import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
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
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { axiosSignup } from "../api/KakaoRedirectSignup";
import { PhotoCamera } from "@mui/icons-material";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";

function Profile() {
  const [search, setSearch] = useSearchParams();
  const userId = search.get("userId");

  // 빈 객체 선언
  const [files, setFiles] = useState([]);

  // formData 객체로 전달할 경우 필요한 변수
  // const [nickname, setNickname] = useState(search.get("nickname"));
  const [nickname, setNickname] = useState("gugu");
  const [gender, setGender] = useState(search.get("gender"));
  const [age, setAge] = useState(search.get("age"));
  const [fileImage, setFileImage] = useState(gugu);
  const [addedFile, setAddedFile] = useState([search.get("image")]);
  const [currentNickname, setCurrentNickname] = useState(
    search.get("nickname")
  );
  const [currentGender, setCurrentGender] = useState(search.get("gender"));
  const [currentAge, setCurrentAge] = useState(search.get("age"));

  // 데이터 전송을 위한 form, file 객체 생성
  const formData = new FormData();
  const fileArr = new Array();

  // 미리보기 삭제
  function deleteFileImage(e) {
    console.log(fileImage);
    URL.revokeObjectURL(fileImage);
    setFileImage(files);
  }

  // 변경하려는 nickname
  const nicknameFromHandlerContent = (e) => {
    setNickname(e.target.value);
  };

  // 변경하려는 gender
  const genderFromHandlerContent = (e) => {
    setGender(e.target.value);
  };

  // 변경하려는 nickname
  const ageFromHandlerContent = (e) => {
    setAge(e.target.value);
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
    formData.append("nickname", nickname);
    formData.append("gender", gender);
    formData.append("age", age);
    formData.append("files", addedFile[0]);

    // formdata 값 확인해 보는 법 !
    for (let key of formData.keys()) {
      console.log("formdata확인" + key, ":", formData.get(key));
    }

    axiosSignup(formData);
  };

  return (
    <div>
      <form
        method="PUT"
        onSubmit={(e) => submit(e)}
        encType="multipart/form-data"
      >
        {/* 고정 상단바 */}
        <Box sx={{ flexGrow: 1 }} style={{ fontFamily: "KJCGothicLight" }}>
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
                999 회원가입
              </Typography>
              {/* 수정 submit버튼 */}
              <Button
                color="success"
                endIcon={<SendIcon />}
                type="submit"
                defaultValue="save"
                // style={{ backgroundColor: "#89ab79" }}
              >
                Sign up
              </Button>
              <Button
                color="error"
                endIcon={<DeleteIcon />}
                onClick={() => (
                  window.localStorage.clear(), (window.location.href = "/") // 회원가입 안한다고 하면 로컬스토리지 비우고 홈으로 이동
                )}
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
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableBody>
                <TableRow>
                  <TableCell align="center">Nickname</TableCell>
                  {/* 닉네임 수정 */}
                  <TableCell align="center">
                    <TextField
                      id="content"
                      name="content"
                      multiline
                      variant="outlined"
                      defaultValue={nickname}
                      onChange={(e) => nicknameFromHandlerContent(e)}
                      // style={{ width: "50%" }}
                      sx={{ m: 1, minWidth: 180 }}
                    />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell align="center">Gender</TableCell>
                  {/* 성별 수정 */}
                  <TableCell align="center">
                    <FormControl sx={{ m: 1, minWidth: 200 }}>
                      <InputLabel id="demo-simple-select-label">
                        gender
                      </InputLabel>
                      <Select
                        id="gender"
                        name="gender"
                        value={gender}
                        size={"large"}
                        label="gender"
                        onChange={(e) => genderFromHandlerContent(e)}
                      >
                        <MenuItem value="">
                          <em>선택안함</em>
                        </MenuItem>
                        <MenuItem value={"female"}>여자</MenuItem>
                        <MenuItem value={"male"}>남자</MenuItem>
                        <MenuItem value={"nogender"}>안알려줌</MenuItem>
                      </Select>
                    </FormControl>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell align="center">Age Range</TableCell>
                  {/* 연령대 수정 */}
                  <TableCell align="center">
                    <FormControl sx={{ m: 1, minWidth: 200 }}>
                      <InputLabel id="demo-simple-select-filled-label">
                        Age Range
                      </InputLabel>
                      <Select
                        id="ageRange"
                        name="ageRange"
                        value={age}
                        size={"large"}
                        label={"Age Range"}
                        onChange={(e) => ageFromHandlerContent(e)}
                      >
                        <MenuItem value="">
                          <em>선택안함</em>
                        </MenuItem>
                        <MenuItem value={"0~9"}>0 - 9</MenuItem>
                        <MenuItem value={"10~19"}>10 - 19</MenuItem>
                        <MenuItem value={"20~29"}>20 - 29</MenuItem>
                        <MenuItem value={"30~39"}>30 - 39</MenuItem>
                        <MenuItem value={"40~49"}>40 - 49</MenuItem>
                        <MenuItem value={"50~59"}>50 - 59</MenuItem>
                        <MenuItem value={"60~69"}>60 - 69</MenuItem>
                        <MenuItem value={"70~79"}>70 - 79</MenuItem>
                      </Select>
                    </FormControl>
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
      </form>
    </div>
  );
}

export default Profile;
