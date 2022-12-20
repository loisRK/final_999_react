import React, {
  useEffect,
  useState,
  useRef,
  FormEvent,
  useCallback,
} from "react";
import { postData, postUpdate } from "../api/Post";
import { fileDownload, deleteFile } from "../api/File";
import { useParams, useSearchParams, Link } from "react-router-dom";
import "../App.css";
import gugu from "../img/bidulgi.png";
import {
  AppBar,
  Avatar,
  Box,
  Button,
  IconButton,
  TextField,
  Toolbar,
  Tooltip,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { PhotoCamera } from "@mui/icons-material";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";

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
  const [fileImage, setFileImage] = useState("");
  const [addedFile, setAddedFile] = useState([]);

  // 동기로 diary 데이터 불러오는 useEffect
  useEffect(() => {
    const datas = postData(postNo);
    datas.then((response) => setPost(response));
    datas.then((response) => setFiles(response.fileDTOs));
    datas.then((response) => setContent(response.postContent));
    datas.then((response) => setFileImage(response.postImg));
    datas.then((response) =>
      setAddedFile(new File([response, "oldFile", { type: "image/*" }]))
    );

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
  const fileArr = new Array();

  // 이미지 파일 삭제
  function deleteFileImage(e) {
    console.log(fileImage);
    URL.revokeObjectURL(fileImage);

    setFileImage("");
    setAddedFile([]);
  }

  const inputFromHandlerContent = (e) => {
    setContent(e.target.value);
  };

  // 수정하려는 이미지 미리보기
  const saveFileImage = (e) => {
    setFileImage(URL.createObjectURL(e.target.files[0]));
  };

  function getFile(e) {
    setAddedFile(e.target.files);
    saveFileImage(e);
  }

  const submit = (e) => {
    e.preventDefault();
    console.log("addedFile : " + addedFile[0]);
    formData.append("content", content);
    formData.append("files", addedFile[0]);

    // formdata 값 확인해 보는 법 !
    for (let key of formData.keys()) {
      console.log("formdata확인" + key, ":", formData.get(key));
    }

    postUpdate(postNo, formData, currentPage).then(
      (document.location.href = `/posting`)
    );
  };

  return (
    <div>
      <form
        method="PUT"
        onSubmit={(e) => submit(e)}
        encType="multipart/form-data"
      >
        {/* 고정 상단바 */}
        <Box sx={{ flexGrow: 1 }}>
          <AppBar position="static" sx={{ background: "#B6E2A1" }}>
            <Toolbar>
              <IconButton
                size="large"
                edge="start"
                color="inherit"
                aria-label="menu"
                sx={{ mr: 2 }}
              ></IconButton>
              {/* 비둘기 사진 누르면 홈으로 이동 */}
              <Box sx={{ flexGrow: 0 }}>
                <Tooltip title="Home">
                  <IconButton
                    onClick={() => {
                      document.location.href = "/";
                    }}
                    sx={{ p: 0 }}
                  >
                    <Avatar alt="gugu" src={gugu} />
                  </IconButton>
                </Tooltip>
              </Box>
              {/* 페이지 중앙에 제목 */}
              <Typography
                variant="h6"
                component="div"
                sx={{ flexGrow: 1 }}
                style={{ color: "#4d5749" }}
              >
                Post Edit Page (PostNo : {postNo})
              </Typography>
              {/* 수정 submit버튼 */}
              <Button
                color="inherit"
                variant="outlined"
                className="write_button"
                type="submit"
                defaultValue="save"
                style={{ backgroundColor: "#89ab79" }}
              >
                Submit
              </Button>
            </Toolbar>
          </AppBar>
        </Box>
        {/* 수정 입력 부분 -> 테이블 형식*/}
        <div>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell align="center">Content</TableCell>
                  <TableCell align="center">
                    {/* 내용수정 */}
                    <TextField
                      id="content"
                      name="content"
                      multiline
                      variant="standard"
                      defaultValue={content}
                      ref={textRef}
                      onInput={handleResizeHeight}
                      onChange={(e) => inputFromHandlerContent(e)}
                      style={{ width: "80%" }}
                    />
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row" align="center">
                    Photo
                  </TableCell>
                  <TableCell align="center">
                    <div align="center">
                      {fileImage && <img alt="sample" src={fileImage} />}
                    </div>
                  </TableCell>
                  <TableCell>
                    <IconButton
                      color="primary"
                      aria-label="upload picture"
                      component="label"
                    >
                      <input
                        className="write_button"
                        type="file"
                        name="newFiles"
                        id="newFiles"
                        hidden
                        onChange={(e) => getFile(e)}
                      />
                      <PhotoCamera />
                    </IconButton>
                    {/* 미리보기 사진 삭제 버튼 */}
                    <IconButton onClick={(e) => deleteFileImage(e)}>
                      <DeleteForeverIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </div>
        {/* file list에서 파일 하나씩 전개 -> 사진 하나만 업로드 가능하도록 했기 때문에 multiple 지움*/}
        {/* {files != null ? (
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
        )} */}
      </form>
    </div>
  );
}

export default PostEdit;