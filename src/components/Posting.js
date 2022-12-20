import "../css/Posting.css";
import { useEffect, useRef, useState } from "react";
import Posts from "./Posts";
import PostsTest from "./PostsTest";
import SearchBar from "./SearchBar";
import { axiosPostLike } from "../api/Post";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  AppBar,
  BottomNavigation,
  BottomNavigationAction,
  Toolbar,
  Typography,
  Snackbar,
  Alert,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Box,
  Tooltip,
  Modal,
  Button,
} from "@mui/material";
import {
  AccountCircleOutlined,
  HomeOutlined,
  StickyNote2Outlined,
} from "@mui/icons-material";
import { Container } from "@mui/system";
import { axiosUser } from "../api/User";
import { KAKAO_AUTH_URL } from "./KakaoLoginData";
import kakao_login_medium_wide from "../img/kakao_login_medium_wide.png";
import { KAKAO_LOGOUT_URL } from "./KakaoLogoutData";
import gugu from "../img/bidulgi.png";
import gugu_tilt from "../img/dulgi_headtilt.png";
import gugu_login from "../img/dulgi_login.jpg";

function Posting() {
  // ID token 확인
  const token = window.localStorage.getItem("token");

  //////////////////////////////////////////////////
  // AppBar설정에 필요한 것들
  const [settings, setSettings] = useState([]);

  const [anchorElUser, setAnchorElUser] = useState(null);

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const menuAction = (setting) => {
    console.log("menu test: " + setting);
    handleCloseUserMenu();
    switch (setting) {
      case "Login":
        setOpen(true);
        break;
      case "My Profile":
        // 내 프로필 모달로 보여주기
        alert("프로필보여주기");
        break;
      case "Logout":
        // kakaoLogout 이동
        setLogoutOpen(true);
        break;
      default:
        alert("아무것도 선택하지 않음");
    }
  };

  const handleLogin = () => {
    window.location.href = KAKAO_AUTH_URL;
  };

  const logout = () => {
    window.location.href = KAKAO_LOGOUT_URL;
  };

  const [open, setOpen] = useState(false);
  const [logoutOpen, setLogoutOpen] = useState(false);

  const [profileImg, setProfileImg] = useState(
    "https://cdn-icons-png.flaticon.com/128/1077/1077063.png"
  );

  useEffect(() => {
    if (token !== null) {
      const data = axiosUser();
      data.then((res) => setProfileImg(res.kakaoProfileImg));
      setSettings(["My Profile", "Logout"]);
    } else {
      setSettings(["Login"]);
    }
  }, []);
  //////////////////////////////////////////////

  // 하단 바 로그인 상태별 paging 옵션
  const [alertStatus, setAlertStatus] = useState(false);
  const navigate = useNavigate();

  const alertClick = () => {
    setAlertStatus(!alertStatus);
  };

  const alertClick2 = () => {
    setAlertStatus2(!alertStatus2);
  };

  const loginCheck = () => {
    if (token === null) {
      alertClick();
    } else {
      navigate("/myPage");
    }
  };

  // const alertHandler = () => {
  //   setWasLastList(!wasLastList);
  // }

  // infinite scrolling
  const listInnerRef = useRef();
  const [currentPage, setCurrentPage] = useState(1);
  const [prevPage, setPrevPage] = useState(0); // storing prev page number
  const [posts, setPosts] = useState([]);
  const [wasLastList, setWasLastList] = useState(false); // setting a flag to know the last list
  const [searchId, setSearchId] = useState(null);
  const [end, setEnd] = useState(0);
  const [alertStatus2, setAlertStatus2] = useState(false);

  // 존재하지 않는 사용자 alert 발생
  useEffect(() => {
    if (wasLastList) {
      setAlertStatus2(!alertStatus2);
      setTimeout(function () {
        setWasLastList((wasLastList) => !wasLastList);
        setSearchId(null);
      }, 500);
    }
  }, [wasLastList]);

  useEffect(() => {
    console.log("키워드" + searchId);
    // infinite scroll 테스트
    if (!wasLastList && prevPage !== currentPage) {
      {
        token !== null
          ? axiosUser().then((res) => {
              console.log("##### id : " + res.kakaoId);
              axiosPostLike(
                posts,
                setWasLastList,
                setPrevPage,
                setPosts,
                currentPage,
                res.kakaoId,
                searchId !== null ? searchId : "null",
                setEnd
              );
            })
          : axiosPostLike(
              posts,
              setWasLastList,
              setPrevPage,
              setPosts,
              currentPage,
              999,
              searchId !== null ? searchId : "null",
              setEnd
            );
      }
      // postData(posts, setWasLastList, setPrevPage, setPosts, currentPage);
    }
  }, [
    // searchId,
    currentPage,
    wasLastList,
    prevPage,
  ]);
  console.log("######## POSTS : " + posts);

  useEffect(() => {
    token !== null
      ? axiosUser().then((res) => {
          // console.log("go home");
          // console.log("##### id : " + res.kakaoId);
          axiosPostLike(
            posts,
            setWasLastList,
            setPrevPage,
            setPosts,
            currentPage,
            res.kakaoId,
            searchId !== null ? searchId : "null",
            setEnd
          );
        })
      : axiosPostLike(
          posts,
          setWasLastList,
          setPrevPage,
          setPosts,
          currentPage,
          999,
          searchId !== null ? searchId : "null",
          setEnd
        );
  }, [searchId]);

  const onScroll = () => {
    if (listInnerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = listInnerRef.current;
      // console.log(`${scrollTop + clientHeight} >= ${scrollHeight}`);
      // if ((Math.ceil(scrollTop) + clientHeight >= scrollHeight) || currentPage!==end) {
      if (
        Math.ceil(scrollTop) + clientHeight >= scrollHeight &&
        currentPage < end
      ) {
        console.log(
          "스크롤 할 때 페이지 번호" + currentPage + "마지막 페이지" + end
        );
        setCurrentPage(currentPage + 1);
      }
    }
  };

  return (
    <div id="post-box">
      {/* <AppBar position="static" sx={{ background: "#B6E2A1" }}>
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <Typography
              variant="h6"
              noWrap
              position="static"
              component="a"
              href="/"
              sx={{
                mr: 2,
                display: { xs: "none", md: "flex" },
                fontFamily: "monospace",
                fontWeight: 700,
                letterSpacing: ".3rem",
                color: "inherit",
                textDecoration: "none",
              }}
            >
              Posting
            </Typography>
          </Toolbar>
        </Container>
      </AppBar> */}
      <AppBar position="static" sx={{ background: "#B6E2A1" }}>
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <IconButton
              onClick={() => {
                document.location.href = "/";
              }}
            >
              <Avatar alt="gugu" src={gugu}/>
            </IconButton>
            <Typography
              variant="h6"
              noWrap
              component="a"
              href="/"
              sx={{
                mr: 2,
                display: { xs: "none", md: "flex" },
                fontFamily: "SEBANG_Gothic_Bold",
                fontWeight: 700,
                letterSpacing: ".3rem",
                color: "inherit",
                textDecoration: "none",
              }}
            >
              <b>999.com</b>
            </Typography>
            <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }} />
            <Typography
              variant="h6"
              noWrap
              component="a"
              href=""
              sx={{
                mr: 2,
                display: { xs: "flex", md: "none" },
                flexGrow: 1,
                fontFamily: "SEBANG_Gothic_Bold",
                fontWeight: 700,
                letterSpacing: ".3rem",
                color: "inherit",
                textDecoration: "none",
              }}
            >
              <b>999.com</b>
            </Typography>
            <Box sx={{ flexGrow: 0 }}>
              <Tooltip title="Account settings">
                <IconButton size="small" onClick={handleOpenUserMenu}>
                  {token ? (
                    <Avatar alt="myProfile" src={profileImg}/>
                  ) : (
                    <Avatar />
                  )}
                </IconButton>
              </Tooltip>
              <Menu
                sx={{ mt: "45px" }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                {settings.map((setting) => (
                  <MenuItem key={setting} onClick={() => menuAction(setting)}>
                    <Typography textAlign="center">{setting}</Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
      <SearchBar
        setSearchId={setSearchId}
        setPosts={setPosts}
        setPrevPage={setPrevPage}
        setCurrentPage={setCurrentPage}
        setWasLastList={setWasLastList}
        setAlertStatus2={setAlertStatus2}
      />
      {/* <PostsTest
        onScroll={onScroll}
        listInnerRef={listInnerRef}
        posts={posts}
      ></PostsTest> */}
      <Posts
        onScroll={onScroll}
        listInnerRef={listInnerRef}
        posts={posts}
      ></Posts>
      <BottomNavigation
        sx={{
          background: "#B6E2A1",
          bottom: 0,
          position: "fixed",
          width: "100%",
        }}
        showLabels
        value={0}
      >
        <BottomNavigationAction
          icon={<StickyNote2Outlined />}
          component={Link}
          to="/posting"
        />
        <BottomNavigationAction
          icon={<HomeOutlined />}
          component={Link}
          to="/"
        />
        <BottomNavigationAction
          icon={<AccountCircleOutlined />}
          onClick={loginCheck}
        />
      </BottomNavigation>
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
        <Alert severity="success" sx={{ width: "100%" }}>
          로그인이 필요한 기능입니다.
        </Alert>
      </Snackbar>
      <Snackbar
        className="mapAlert"
        anchorOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        open={alertStatus2}
        autoHideDuration={1000}
        onClose={alertClick2}
      >
        <Alert severity="warning" sx={{ width: "100%" }}>
          존재하지 않는 사용자 입니다.
        </Alert>
      </Snackbar>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            border: "2px solid #000",
            boxShadow: 24,
            p: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography id="modal-modal-title" variant="h6" component="h2">
            999에 로그인하기
          </Typography>
          <img
            alt="gugu_login"
            src={gugu_login}
            style={{
              height: 150,
              position: "relative",
              display: "flex",
              alignItems: "center",
            }}
          />
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            {/* <input placeholder="아이디"></input> <br />
                <input type={"password"} placeholder="비밀번호"></input> <br />
                <button type="submit">Login</button> */}
            <img
              src={kakao_login_medium_wide}
              alt="kakao_login"
              onClick={handleLogin}
            />
          </Typography>
        </Box>
      </Modal>
      <Modal
        open={logoutOpen}
        onClose={() => setLogoutOpen(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            border: "2px solid #000",
            boxShadow: 24,
            p: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography id="modal-modal-title" variant="h6" component="h2">
            로그아웃 하시겠습니까?
          </Typography>
          <img
            alt="gugu_tilt"
            src={gugu_tilt}
            style={{
              height: 150,
              position: "relative",
              display: "flex",
              alignItems: "center",
              marginBottom: 20,
            }}
          />
          <Box>
            <Button onClick={logout} variant="outlined">
              네
            </Button>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <Button onClick={() => setLogoutOpen(false)} variant="contained">
              아니요
            </Button>
          </Box>
        </Box>
      </Modal>
    </div>
  );
}

export default Posting;