import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { userWithdraw, axiosUserUpdate } from "../api/User";
import "../App.css";
import gugu from "../img/bidulgi.png";
import gugueyes from "../img/gugugu.png";
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
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import { KAKAO_LOGOUT_URL2 } from "./KakaoLogoutData";
import { PhotoCamera } from "@mui/icons-material";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";

function Profile() {
  const [search, setSearch] = useSearchParams();
  const userId = search.get("userId");

  // 빈 객체 선언
  const [files, setFiles] = useState([]);

  // formData 객체로 전달할 경우 필요한 변수
  const [email, setEmail] = useState(search.get("email"));
  const [nickname, setNickname] = useState(search.get("nickname"));
  const [fileImage, setFileImage] = useState(search.get("image"));
  const [addedFile, setAddedFile] = useState([search.get("image")]);
  const [currentEmail, setCurrentEmail] = useState(search.get("email"));
  const [currentNickname, setCurrentNickname] = useState(
    search.get("nickname")
  );

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

    axiosUserUpdate(userId, formData).then(
      (document.location.href = `/mypage`)
    );
  };

  const [anchorEl, setAnchorEl] = React.useState(null);

  const withdrawButton = (event) => {
    setAnchorEl(event.currentTarget);
  };

  // dialog 닫기 핸들러
  const handleClose = () => {
    setAnchorEl(null);
  };

  // 회원탈퇴 -> agree 클릭 시 핸들러
  const withdrawMember = () => {
    setAnchorEl(null);
    window.location.href = KAKAO_LOGOUT_URL2;
    // userWithdraw();
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

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
            <div align="center">
              {fileImage && (
                <Avatar
                  alt="sample"
                  style={{ width: 100, height: 100 }}
                  src={fileImage}
                />
              )}
            </div>
          </Grid>
        </Grid>
        &nbsp;&nbsp;&nbsp;
        {/* 수정 입력 부분 -> 테이블 형식*/}
        <div>
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
                        variant="outlined"
                        sx={{ m: 1, minWidth: 180 }}
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
                        variant="outlined"
                        sx={{ m: 1, minWidth: 180 }}
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
                      Profile Image
                    </TableCell>
                    <TableCell align="center">
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
                      <IconButton onClick={(e) => deleteFileImage(e)}>
                        <DeleteForeverIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </div>
          <div style={{ padding: 10, float: "right" }}>
            <Button
              aria-describedby={id}
              variant="contained"
              onClick={withdrawButton}
              style={{ backgroundColor: "#999999" }}
            >
              회원탈퇴😲
            </Button>
            <Dialog
              open={open}
              onClose={handleClose}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
            >
              <DialogTitle id="alert-dialog-title">
                {"999.com을 정말로 떠나시겠습니까?"}
              </DialogTitle>
              <img alt="guguEyes" src={gugueyes}></img>
              <DialogContent>
                <DialogContentText id="alert-dialog-description">
                  둥지를 떠나 영영 멀리 정말로 진짜로 날아가버리실 건가요?
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleClose} autoFocus>
                  아니요!
                </Button>
                <Button onClick={withdrawMember}>네ㅠㅠ</Button>
              </DialogActions>
            </Dialog>
          </div>
        </div>
      </form>
    </div>
  );
}

export default Profile;
