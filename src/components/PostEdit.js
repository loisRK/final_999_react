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
import { color } from "@mui/system";
import { green } from "@mui/material/colors";
import { Directions } from "@mui/icons-material";

const styles = {
  bar: {
    backgroundColor: "#B6E2A1",
  },
  editPage: {
    fontWeight: "bold",
  },
  sumbitBotton: {
    width: "10%",
    float: "right",
    padding: 1,
    borderRadius: 10,
    backgroundColor: "#d5e3de",
  },
  fileDeleteBotton: {
    width: "10%",
    border: "0.1rem solid",
    borderRadius: 10,
    backgroundColor: "#d5e3de",
  },
  textarea: {
    width: "60%",
    height: 50,
    border: "0.1rem solid",
    borderRadius: 10,
    borderWidth: 0,
    padding: 5,
  },
  photoPosition: {
    width: "50%",
    border: "0.1rem solid",
    display: "flex",
    flex: "center",
  },
};

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
  const [addedFile, setAddedFile] = useState([]);

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
    // axios로 fileNo 전달해서 file delete 쿼리 실행
    deleteFile(fileNo, postNo);
  };

  // 데이터 전송을 위한 form, file 객체 생성
  const formData = new FormData();

  // 미리보기 삭제
  const deleteFileImage = () => {
    URL.revokeObjectURL(fileImage);
    setFileImage("");
  };

  const inputFromHandlerContent = (e) => {
    setContent(e.target.value);
  };

  // 수정하려는 이미지 미리보기
  // React.ChangeEvent<HTMLInputElement> 타입스크립트 언어라 오류처럼 보이지만 작동
  const saveFileImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileImage(URL.createObjectURL(e.target.files[0]));
  };

  function getFile(e) {
    setAddedFile(e.target.files);
    saveFileImage(e);
  }

  const submit = (e) => {
    e.preventDefault();
    console.log("addedFile : " + addedFile[0]);
    console.log("files : " + postImg);
    formData.append("content", content);
    formData.append("files", addedFile[0]);
    // formData.append("files", addedFile[0]);

    // formdata 값 확인해 보는 법 !
    for (let key of formData.keys()) {
      console.log("formdata확인" + key, ":", formData.get(key));
    }

    postUpdate(postNo, formData, currentPage);
  };

  return (
    <div>
      <form
        method="PUT"
        onSubmit={(e) => submit(e)}
        encType="multipart/form-data"
      >
        <div style={styles.bar}>
          <button
            className="write_button"
            type="submit"
            defaultValue="save"
            style={styles.sumbitBotton}
          >
            Submit
          </button>
          <br />
          <h1 className="h1" style={styles.editPage}>
            Post Edit Page (PostNo : {postNo})
          </h1>
        </div>
        <hr />
        {/* Post 내용 수정 입력 부분 */}
        <div>
          <br />
          {/* <img src={`/img/${postImg}` } style={{ margin: "auto" }} /> */}
          <div>포스트 내용 수정</div>
          <div border="solid">
            <textarea
              id="content"
              name="content"
              defaultValue={content}
              ref={textRef}
              style={styles.textarea}
              onInput={handleResizeHeight}
              onChange={(e) => inputFromHandlerContent(e)}
            ></textarea>
          </div>
        </div>
        <br />
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
        <h1>사진 첨부</h1>
        <br />
        <div>
          <input
            className="write_button"
            type="file"
            name="newFiles"
            id="newFiles"
            multiple
            onChange={(e) => {
              getFile(e);
            }}
          />
          <button
            style={styles.fileDeleteBotton}
            onClick={() => deleteFileImage()}
          >
            {" "}
            삭제{" "}
          </button>
          <div>사진 미리보기</div>
          <div align="center">
            {fileImage && (
              <img alt="sample" src={fileImage} style={styles.photoPosition} />
            )}
          </div>
        </div>
      </form>
    </div>
  );
}

export default PostEdit;
