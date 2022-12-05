import React, { useEffect, useState } from "react";
import { useLocation } from "react-router";
import { fileUpload, fileDownload } from "../api/File";
import { diaryData, diaryDelete } from "../api/Diary";
import { useParams, useSearchParams, Link } from "react-router-dom";
import "../App.css";

const style = {
  border: "1px solid black",
};

function File() {
  //   const location = useLocation();
  //   const diaryNo = location.state.diaryno;

  // URL 파라미터 방식으로 값을 넘겨 받을 때 링크에서 값을 꺼내는 방법
  // const params = useParams();
  // const diaryNo = params.diaryNo;
  // console.log(diaryNo);

  // 쿼리 스트링방식으로 값을 넘겨받을 때 링크에서 값을 꺼내는 방법
  const [search, setSearch] = useSearchParams();
  const diaryNo = search.get("diaryNo");
  const currentPage = search.get("currentPage");
  console.log("diaryNo : " + diaryNo);
  console.log("currentPage : " + currentPage);

  const [files, setFiles] = useState([]);
  const [diary, setDiary] = useState({});

  // 글 목록 클릭하여 페이지 전환 시 실행되는 axios data get 메소드
  useEffect(() => {
    const datas = diaryData(diaryNo);
    datas.then((response) => console.log(response));
    datas.then((response) => setDiary(response));
    datas.then((response) => console.log(response.fileDTOs));
    datas.then((response) => setFiles(response.fileDTOs));
  }, []);
  console.log(files);

  // file download axios 실행 onclick 함수

  // diary delete 함수
  const deleteDiary = (diaryNo, currentPage) => {
    console.log(diaryNo);
    diaryDelete(diaryNo, currentPage);
  };

  return (
    <div>
      <Link to={`/diaryEdit?diaryNo=${diaryNo}&currentPage=${currentPage}`}>
        <button className="write_button">Edit</button>
      </Link>
      <button
        className="write_button"
        onClick={() => {
          deleteDiary(diaryNo, currentPage);
        }}
      >
        Delete
      </button>
      <Link to={"/posting/" + currentPage}>
        <button className="write_button">Back</button>
      </Link>

      <br />
      <h1>Diary Title : {diary ? <>{diary.title}</> : <></>}</h1>
      <hr />
      <table className="table">
        <thead style={style}>
          <tr style={style}>
            <th style={style}>Content</th>
            <th style={style}>Written Date</th>
            <th style={style}>Modified Date</th>
          </tr>
        </thead>
        <tbody>
          <tr style={style}>
            {diary ? <th style={style}>{diary.content}</th> : <></>}
            {diary ? <th style={style}>{diary.writtenDate}</th> : <></>}
            {diary ? <th style={style}>{diary.modifiedDate}</th> : <></>}
          </tr>
        </tbody>
      </table>
      <hr />
      {files != null ? (
        <ul>
          {files.map((file) => (
            <li key={file.fileName}>
              <a
                href={`http://localhost:8080/api/file-download?fileName=${file.fileName}`}
              >
                {file.fileName}
              </a>
            </li>
          ))}
        </ul>
      ) : (
        <></>
      )}
    </div>
  );
}

export default File;
