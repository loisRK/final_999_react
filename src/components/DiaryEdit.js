import React, {
  useEffect,
  useState,
  useRef,
  FormEvent,
  useCallback,
} from "react";
import { diaryUpdate, diaryData } from "../api/Diary";
import { fileDownload, deleteFile } from "../api/File";
import { useParams, useSearchParams, Link } from "react-router-dom";
import "../App.css";

function DiaryEdit() {
  // textarea 글 분량에 따른 자동 높이 조절 메소드
  const textRef = useRef();
  const handleResizeHeight = useCallback(() => {
    textRef.current.style.height = "auto";
    textRef.current.style.height = textRef.current.scrollHeight + "px";
  }, []);

  // linkto로 페이지 이동 시 Diary.js에서 보내준 diaryNo 값 받는 부분
  // const params = useParams();
  // const diaryNo = params.diaryNo;
  // console.log(diaryNo);

  // 페이지 전환 시 쿼리스트링방식으로 값 받아오기
  const [search, setSearch] = useSearchParams();
  const diaryNo = search.get("diaryNo");
  const currentPage = search.get("currentPage");
  console.log("diaryNo : " + diaryNo);
  console.log("currentPage : " + currentPage);

  // 빈 객체 선언
  const [files, setFiles] = useState([]);
  const [diary, setDiary] = useState({});

  // // formData 객체로 전달할 경우 필요한 변수
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [addedFile, setAddedFile] = useState([]);

  // 동기로 diary 데이터 불러오는 useEffect
  useEffect(() => {
    const datas = diaryData(diaryNo);
    datas.then((response) => setDiary(response));
    datas.then((response) => setFiles(response.fileDTOs));
    datas.then((response) => setTitle(response.title));
    datas.then((response) => setContent(response.content));

    // const diary = diaryData(diaryNo);
  }, []);
  //   console.log(files);

  // fileNo(FileEntity PK)로 해당 file 삭제
  const deleteFiles = (e, fileNo, diaryNo) => {
    e.preventDefault();
    console.log("fileNo" + fileNo);
    console.log("diaryNo" + diaryNo);
    // axios로 fileNo 전달해서 file delete 쿼리 실행
    deleteFile(fileNo, diaryNo);
  };

  // // save 버튼 클릭 시 다이어리 수정 내용 업로드
  // const diaryUpdateByForm = async (e) => {
  //   const formData = new FormData();
  //   formData.append("title", title);
  //   formData.append("content", content);
  //   formData.append("addedFile", addedFile);
  // };

  const formData = new FormData();

  const inputFromHandlerTitle = (e) => {
    setTitle(e.target.value);
  };

  const inputFromHandlerContent = (e) => {
    setContent(e.target.value);
  };

  const inputFromHandlerFiles = (e) => {
    console.log(e.target.files);
    setAddedFile(e.target.files);
  };

  const submit = (e) => {
    e.preventDefault();
    formData.append("title", title);
    formData.append("content", content);

    // 반복문을 이용해 파일들을 formdata에 추가
    for (let i = 0; i < addedFile.length; i++) {
      formData.append("addedFile", addedFile[i]);
    }

    // formdata 값 확인해 보는 법 !
    for (let key of formData.keys()) {
      console.log(key, ":", formData.get(key));
    }

    diaryUpdate(diaryNo, formData, currentPage);
  };

  return (
    <div>
      {/* <form method="PUT" onSubmit={submit} encType="multipart/form-data"> */}
      <button
        className="write_button"
        type="submit"
        onClick={submit}
        defaultValue="save"
      >
        Submit
      </button>
      <br />
      <h1 className="h1">Diary Edit Page (diaryNo : {diaryNo})</h1>
      <hr />
      {/* Diary 내용 수정 입력 부분 */}
      <div>
        <input
          type="text"
          name="title"
          defaultValue={diary.title}
          onChange={(e) => inputFromHandlerTitle(e)}
        ></input>
        <br />
        <textarea
          id="content"
          name="content"
          defaultValue={diary.content}
          ref={textRef}
          onInput={handleResizeHeight}
          // placeholder={diary.content}
          onChange={(e) => inputFromHandlerContent(e)}
        ></textarea>
      </div>
      <br />
      <hr />
      {/* file list에서 파일 하나씩 전개 */}
      {files != null ? (
        <ul>
          {files.map((file) => (
            <li key={file.fileName}>
              {file.fileName} &nbsp;&nbsp;
              <button onClick={(e) => deleteFiles(e, file.fileNo, diaryNo)}>
                x
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <></>
      )}
      <input
        className="write_button"
        type="file"
        name="newFiles"
        multiple
        onChange={(e) => inputFromHandlerFiles(e)}
      ></input>
      {/* </form> */}
    </div>
  );
}

export default DiaryEdit;
