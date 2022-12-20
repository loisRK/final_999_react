import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { axiosUser, axiosUserUpdate } from "../api/User";
import "../App.css";
import gugu from "../img/bidulgi.png";
import DeleteIcon from "@mui/icons-material/Delete";
import SendIcon from "@mui/icons-material/Send";
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
  Grid
} from "@mui/material";

function Profile() {
  const [search, setSearch] = useSearchParams();
  const userId = search.get("userId");

  // 빈 객체 선언
  const [files, setFiles] = useState([]);

  // formData 객체로 전달할 경우 필요한 변수
  const [email, setEmail] = useState(search.get("email"));
  const [nickname, setNickname] = useState(search.get("nickname"));
  const [fileImage, setFileImage] = useState("");
  const [addedFile, setAddedFile] = useState([search.get("image")]);
  const [currentEmail, setCurrentEmail] = useState(search.get("email"));
  const [currentNickname, setCurrentNickname] = useState(search.get("nickname"));


  // 데이터 전송을 위한 form, file 객체 생성
  const formData = new FormData();
  const fileArr = new Array();

  // 미리보기 삭제
  function deleteFileImage(e) {
    console.log(fileImage);
    URL.revokeObjectURL(fileImage);
    setFileImage(files);
  }

  //  변경하려는 email
  const emailFromHandlerContent = (e) => {
    setEmail(e.target.value);
  };

  // 변경하려는 nickname
  const nicknameFromHandlerContent = (e) => {
    setNickname(e.target.value);
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
    formData.append("email", email);
    formData.append("nickname", nickname);
    formData.append("files", addedFile[0]);

    // formdata 값 확인해 보는 법 !
    for (let key of formData.keys()) {
      console.log("formdata확인" + key, ":", formData.get(key));
    }

    axiosUserUpdate(userId, formData)
    .then(
        (document.location.href=`/mypage`)
    );

    };


    return(
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
                Profile Edit Page
              </Typography>
              {/* 수정 submit버튼 */}
              <Button
                color="success" 
                endIcon={<SendIcon />}
                type="submit"
                defaultValue="save"
                // style={{ backgroundColor: "#89ab79" }}
              >
                EDIT
              </Button>
              <Button
                color="error"
                endIcon={<DeleteIcon />}
                onClick={() => (window.location.href = "/MyPage")}
            >
                Cancel
              </Button>
              
            </Toolbar>
          </AppBar>
        </Box>
        <Grid
        container
        justifycontent="center"
        direction="column"
        alignItems="center"
        padding={3}
      >
        <Grid>
          <Avatar
            className="profileImg"
            alt="gugu"
            src={addedFile[0]}
            sx={{
              width: 100,
              height: 100,
            }}
          />
        </Grid>
        
      </Grid>
    
        &nbsp;&nbsp;&nbsp;
        {/* 수정 입력 부분 -> 테이블 형식*/}
        <div>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell align="center">Email</TableCell>
                  <TableCell align="center">
                    {/* 이메일 수정 */}
                    <TextField
                      id="content"
                      name="content"
                      multiline
                      variant="standard"
                      defaultValue={currentEmail}
                      onChange={(e) => emailFromHandlerContent(e)}
                      style={{ width: "80%" }}
                    />
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
              <TableRow>
                  <TableCell align="center">Nickname</TableCell>
                  <TableCell align="center">
                    {/* 닉네임 수정 */}
                    <TextField
                      id="content"
                      name="content"
                      multiline
                      variant="standard"
                      defaultValue={currentNickname}
                      onChange={(e) => nicknameFromHandlerContent(e)}
                      style={{ width: "80%" }}
                    />
                  </TableCell>
                </TableRow>
                <TableRow
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row" align="center">
                    Photo
                  </TableCell>
                  <TableCell align="center">
                    <input
                      className="write_button"
                      type="file"
                      name="newFiles"
                      id="newFiles"
                      onChange={(e) => {
                        getFile(e);
                      }}
                    />
                    {/* 미리보기 사진 삭제 버튼 */}
                    <button type="button" onClick={(e) => deleteFileImage(e)}>
                      삭제
                    </button>
                    <div align="center">
                      {fileImage && <img alt="sample" src={fileImage} />}
                    </div>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </div>

      </form>
    </div>
    );
}

export default Profile;