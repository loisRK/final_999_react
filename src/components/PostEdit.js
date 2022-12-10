import React, {
  useEffect,
  useState,
  useRef,
  FormEvent,
  useCallback,
} from "react";
import { postData, postUpdate } from "../api/Post";
import { diaryUpdate, diaryData } from "../api/Diary";
import { fileDownload, deleteFile } from "../api/File";
import { useParams, useSearchParams, Link } from "react-router-dom";
import "../App.css";

function PostEdit() {
  // textarea 글 분량에 따른 자동 높이 조절 메소드
  const textRef = useRef();
  const handleResizeHeight = useCallback(() => {
    textRef.current.style.height = "auto";
    textRef.current.style.height = textRef.current.scrollHeight + "px";
  }, []);
  // 페이지 전환 시 쿼리스트링방식으로 값 받아오기
  const [search, setSearch] = useSearchParams();
  const postNo = search.get("postNo");
  const currentPage = search.get("currentPage");
  console.log("postNo : " + postNo);
  console.log("currentPage : " + currentPage);

  // 빈 객체 선언
  const [files, setFiles] = useState([]);
  const [post, setPost] = useState({});

  // // formData 객체로 전달할 경우 필요한 변수
  // const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [postImg, setPostImg] = useState("");
  const [fileImage, setFileImage] = useState("");
  const [addedFile, setAddedFile] = useState("");

  // 동기로 diary 데이터 불러오는 useEffect
  useEffect(() => {
    const datas = postData(postNo);
    datas.then((response) => setPost(response));
    datas.then((response) => setFiles(response.fileDTOs));
    datas.then((response) => setContent(response.postContent));
    datas.then((response) => setPostImg(response.postImg));

    console.log("post " + post);
    console.log("content " + content);
    console.log("post.content " + post.postContent);
  }, []);
  // fileNo(FileEntity PK)로 해당 file 삭제
  const deleteFiles = (e, fileNo, postNo) => {
    e.preventDefault();
    console.log("fileNo" + fileNo);
    console.log("postNo" + postNo);
    // axios로 fileNo 전달해서 file delete 쿼리 실행
    deleteFile(fileNo, postNo);
  };

  // 데이터 전송을 위한 form, file 객체 생성
  const formData = new FormData();
  const fileArr = new Array();

  // 수정하려는 이미지 미리보기
  const saveFileImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileImage(URL.createObjectURL(e.target.files[0]));
    console.log(setFileImage);
    getFile(e);
  };

  // 미리보기 삭제
  const deleteFileImage = () => {
    URL.revokeObjectURL(fileImage);
    setFileImage("");
  };

  const inputFromHandlerContent = (e) => {
    setContent(e.target.value);
  };

  const inputFromHandlerFiles = (e) => {
    console.log(e.target.files);
    setPostImg(e.target.files);
  };

  function getFile(e) {
    console.log(e.target.files);
    // const input = document.querySelector("#newfiles");
    const files = e.target.files;
    setAddedFile(e.target.files);
    const arr = Array.from(files);
    console.log("arr : " + arr);

    for (let i = 0; i < arr.length; i++) {
      fileArr.push(arr[i]);
      console.log(arr[i]);
    }
    console.log(fileArr);
    console.log("fileArr 개수 " + fileArr.length);
  }

  const submit = (e) => {
    e.preventDefault();
    // formData.append("title", title);
    formData.append("content", content);
    // formData.append("postImg", postImg);

    console.log("파일 데이터 확인 " + addedFile);

    // 반복문을 이용해 파일들을 formdata에 추가
    for (let i = 0; i < fileArr.length; i++) {
      formData.append("files", fileArr[i]);
      console.log("파일 데이터 append" + fileArr[i]);
    }

    // formdata 값 확인해 보는 법 !
    for (let key of formData.keys()) {
      console.log("formdata확인" + key, ":", formData.get(key));
    }

    postUpdate(postNo, formData, currentPage);
  };

  return (
    <div>
      {/* <form method="PUT" onSubmit={submit} encType="multipart/form-data"> */}
      <button
        className="write_button"
        type="submit"
        onClick={(e) => {
          inputFromHandlerFiles(e);
          submit(e);
        }}
        defaultValue="save"
      >
        Submit
      </button>
      <br />
      <h1 className="h1">Post Edit Page (PostNo : {postNo})</h1>
      <hr />
      {/* Post 내용 수정 입력 부분 */}
      <div>
        포스트 내용 수정
        <br />
        <img src={`/img/${postImg}`} style={{ margin: "auto" }} />
        {"원래 이미지 주소" + postImg}
        <textarea
          id="content"
          name="content"
          defaultValue={content}
          ref={textRef}
          onInput={handleResizeHeight}
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
              <button onClick={(e) => deleteFiles(e, file.fileNo, postNo)}>
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
        id="newFiles"
        multiple
        onChange={(e) => {
          saveFileImage(e);
        }}
      ></input>
      {/* </form> */}
      <div>
        <h1>미리보기 이미지</h1>
      </div>
      {"수정하려는 이미지 : " + fileImage}
      <div>
        {fileImage && (
          <img alt="sample" src={fileImage} style={{ margin: "auto" }} />
        )}
        <button
          style={{
            width: "50px",
            height: "30px",
            cursor: "pointer",
          }}
          onClick={() => deleteFileImage()}
        >
          {" "}
          삭제{" "}
        </button>
      </div>
    </div>
  );
}

export default PostEdit;
