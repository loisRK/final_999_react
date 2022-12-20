import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { createPost } from "../api/Post";
import TextField from "@mui/material/TextField";
import "../App.css";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import DeleteIcon from "@mui/icons-material/Delete";
import SendIcon from "@mui/icons-material/Send";
import Snackbar from "@mui/material/Snackbar";
import { Alert, IconButton } from "@mui/material";
import { PhotoCamera } from "@mui/icons-material";
import {  
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableCell,
  TableBody,
  TableRow 
} from  "@mui/material";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";

function InsertDiary() {
  // 페이지 전환 시 쿼리스트링방식으로 값 받아오기위한 searchParams 객체 생성
  const [search, setSearch] = useSearchParams();
  // post 위치 위도(lat), 경도(long)
  const postLat = search.get("lat");
  const postLong = search.get("long");
  console.log(postLat);
  // post 내용
  const [content, setContent] = useState("");
  // post 첨부 이미지(1개)
  const [addedFile, setAddedFile] = useState([]);
  // 데이터 전송을 위한 form, file 객체 생성
  const formData = new FormData();
  const fileArr = new Array();

  const [alertStatus, setAlertStatus] = useState(false);
  const [fileImage, setFileImage] = useState("");

  const alertClick = () => {
    setAlertStatus(!alertStatus);
  };

  const getContent = (e) => {
    e.preventDefault();
    console.log(e.target.value);
    setContent(e.target.value);
  };

  const getFile = (e) => {
    saveFileImage(e); // 미리보기 파일이미지
    setAddedFile(e.target.files); // 파일 더하기

    console.log(e.target.files);
    const input = document.querySelector("#newfiles");
    const files = input.files;
    const arr = Array.from(files);
    console.log("arr : " + arr);

    for (let i = 0; i < arr.length; i++) {
      fileArr.push(arr[i]);
      console.log(arr[i]);
    }

    console.log(addedFile);
    console.log(fileArr);
  };

    // 수정하려는 이미지 미리보기
    const saveFileImage = (e) => {
      setFileImage(URL.createObjectURL(e.target.files[0]));
    };

      // 이미지 파일 삭제
  function deleteFileImage(e) {
    console.log(fileImage);
    URL.revokeObjectURL(fileImage);

    setFileImage("");
    setAddedFile([]);
  }

  const sendDiary = (e) => {
    console.log(content);
    if (content === "") {
      alertClick();
    } else {
      e.preventDefault();

      console.log("postLat" + postLat);
      console.log("content" + content);

      formData.append("postLat", postLat);
      formData.append("postLong", postLong);
      formData.append("postContent", content);
      formData.append("files", addedFile[0]); // fileArr[0] 였는데 안돼서 addedFile[0]로 바꿨어요

      // // file 1개 업로드 test
      // const input = document.querySelector("#newfiles");
      // const oneFile = input.files;
      // formData.append("files", oneFile);

      // for (let i = 0; i < fileArr.length; i++) {
      //   formData.append("files", fileArr[i]);
      // }

      // formdata 값 확인해 보는 법 !
      for (let key of formData.keys()) {
        console.log("formdata확인" + key, ":", formData.get(key));
      }

      createPost(formData).then((document.location.href = "/posting"));
      console.log("formData" + formData);
    }
  };

  return (
    // 원래 있던 코드
    // <Box
    //   component="form"
    //   sx={{
    //     "& .MuiTextField-root": { m: 2, width: "50ch" },
    //     flexGrow: 1,
    //   }}
    //   noValidate
    //   autoComplete="off"
    //   method="POST"
    //   onSubmit={(e) => sendDiary(e)}
    //   encType="multipart/form-data"
    // >
    //   <AppBar position="static" sx={{ background: "#B6E2A1" }}>
    //     <Toolbar>
    //       <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
    //         <img
    //           src="https://emojigraph.org/media/openmoji/feather_1fab6.png"
    //           width="30"
    //           height="30"
    //         />
    //       </Typography>
    //       <Button color="success" endIcon={<SendIcon />} onClick={sendDiary}>
    //         Send
    //       </Button>
    //       <Button
    //         color="error"
    //         endIcon={<DeleteIcon />}
    //         onClick={() => (window.location.href = "/")}
    //       >
    //         Cancel
    //       </Button>
    //     </Toolbar>
    //   </AppBar>
    //   <div>
    //     <TextField
    //       id="outlined-multiline-static"
    //       label="Content"
    //       name="content"
    //       multiline
    //       rows={4}
    //       onChange={getContent}
    //       defaultValue={content}
    //     />
    //   </div>
    //   <div>
    //     <IconButton
    //       color="primary"
    //       aria-label="upload picture"
    //       component="label"
    //     >
    //       <input
    //         type="file"
    //         name="newfiles"
    //         id="newfiles"
    //         onChange={getFile}
    //         hidden
    //         // accept="image/*"
    //       />
    //       <PhotoCamera />
    //     </IconButton>
    //     {/* <input
    //       type="file"
    //       name="newfiles"
    //       id="newfiles"
    //       // multiple
    //       onChange={getFile}
    //     ></input> */}
    //     <Snackbar
    //       className="mapAlert"
    //       anchorOrigin={{
    //         vertical: "top",
    //         horizontal: "center",
    //       }}
    //       open={alertStatus}
    //       autoHideDuration={1000}
    //       onClose={alertClick}
    //     >
    //       <Alert severity="warning" sx={{ width: "100%" }}>
    //         포스팅 내용을 입력해주세요.
    //       </Alert>
    //     </Snackbar>
    //   </div>
    // </Box>
    
    // 수정하기 페이지랑 맞춘 CSS
    <div>
<div>
 <Box
       component="form"
       sx={{
         "& .MuiTextField-root": { m: 2, width: "50ch" },
         flexGrow: 1,
       }}
       noValidate
       autoComplete="off"
       method="POST"
       onSubmit={(e) => sendDiary(e)}
       encType="multipart/form-data"
     >
        {/* 고정 상단바 */}
        <AppBar position="static" sx={{ background: "#B6E2A1" }}>
         <Toolbar>
           <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
             <img
               src="https://emojigraph.org/media/openmoji/feather_1fab6.png"
               width="30"
               height="30"
             />
           </Typography>
           <Button color="success" endIcon={<SendIcon />} onClick={sendDiary}>
             Send
           </Button>
           <Button
             color="error"
             endIcon={<DeleteIcon />}
             onClick={() => (window.location.href = "/")}
           >
             Cancel
           </Button>
         </Toolbar>
       </AppBar>
        {/* 수정 입력 부분 -> 테이블 형식*/}

          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell align="center">Content</TableCell>
                  <TableCell align="center">
                    {/* 내용수정 */}
                    <TextField
                    id="outlined-multiline-static"
                    label="Content"
                    name="content"
                    multiline
                    variant="standard"
                    onChange={getContent}
                    defaultValue={content}
                    style={{ width: "80%" }}
                  />
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                  {/* photo 입력부분 */}
                <TableCell component="th" scope="row" align="center">Photo</TableCell>
                <TableCell align="center">
                <div align="center">
                      {fileImage && <img className="post_img" alt="sample" src={fileImage} style={{objectFit: "contain"}}/>}
                    </div>
                    </TableCell>
                  <TableCell>
                <IconButton
                      color="primary"
                      aria-label="upload picture"
                      component="label"
                    >
              <input
                type="file"
                name="newfiles"
                id="newfiles"
                onChange={getFile}
                hidden
                // accept="image/*"
              />
              <PhotoCamera />
              </IconButton>
            {/* 미리보기 사진 삭제 버튼 */}
            <IconButton onClick={deleteFileImage}>
              <DeleteForeverIcon />
            </IconButton>
              </TableCell>
             </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
     </Box>
          
    </div>
    <Snackbar
           className="mapAlert"
           anchorOrigin={{
             vertical: "top",
             horizontal: "center",
           }}
           open={alertStatus}
           autoHideDuration={1000}
           onClose={alertClick}
         >
           <Alert severity="warning" sx={{ width: "100%" }}>
             포스팅 내용을 입력해주세요.
           </Alert>
         </Snackbar>
    </div>

  );
}

export default InsertDiary;