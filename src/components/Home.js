import "../css/Home.css";
import "../index.css";
import { Link, useNavigate } from "react-router-dom";
import Map from "./Map";
import { useEffect, useState } from "react";
import {
  AccountCircleOutlined,
  HomeOutlined,
  StickyNote2Outlined,
} from "@mui/icons-material";
import {
  AppBar,
  Avatar,
  BottomNavigation,
  BottomNavigationAction,
  Box,
  Button,
  FormGroup,
  IconButton,
  Modal,
  Stack,
  Toolbar,
  Tooltip,
  Typography,
  Switch,
  Snackbar,
  Alert,
  Menu,
  MenuItem,
  FormControlLabel,
  Grid,
} from "@mui/material";
import { KAKAO_AUTH_URL } from "./KakaoLoginData";
import kakao_login_medium_wide from "../img/kakao_login_medium_wide.png";
import { KAKAO_LOGOUT_URL } from "./KakaoLogoutData";
import gugu from "../img/bidulgi.png";
import dulgi from "../img/graydulgi.png";
import gugu_tilt from "../img/dulgi_headtilt.png";
import gugu_login from "../img/dulgi_login.jpg";
import { Container } from "@mui/system";
import { styled } from "@mui/material/styles";
import { axiosUser } from "../api/User";
import ChatList from "./ChatList";
import MoreVertIcon from "@mui/icons-material/MoreVert";

const IOSSwitch = styled((props) => (
  <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />
))(({ theme }) => ({
  width: 42,
  height: 26,
  padding: 0,
  "& .MuiSwitch-switchBase": {
    padding: 0,
    margin: 2,
    transitionDuration: "300ms",
    "&.Mui-checked": {
      transform: "translateX(16px)",
      color: "#fff",
      "& + .MuiSwitch-track": {
        backgroundColor: theme.palette.mode === "dark" ? "#2ECA45" : "#65C466",
        opacity: 1,
        border: 0,
      },
      "&.Mui-disabled + .MuiSwitch-track": {
        opacity: 0.5,
      },
    },
    "&.Mui-focusVisible .MuiSwitch-thumb": {
      color: "#33cf4d",
      border: "6px solid #fff",
    },
    "&.Mui-disabled .MuiSwitch-thumb": {
      color:
        theme.palette.mode === "light"
          ? theme.palette.grey[100]
          : theme.palette.grey[600],
    },
    "&.Mui-disabled + .MuiSwitch-track": {
      opacity: theme.palette.mode === "light" ? 0.7 : 0.3,
    },
  },
  "& .MuiSwitch-thumb": {
    boxSizing: "border-box",
    width: 22,
    height: 22,
  },
  "& .MuiSwitch-track": {
    borderRadius: 26 / 2,
    backgroundColor: theme.palette.mode === "light" ? "#E9E9EA" : "#39393D",
    opacity: 1,
    transition: theme.transitions.create(["background-color"], {
      duration: 500,
    }),
  },
}));

function Home() {
  const token = window.localStorage.getItem("token");
  const [settings, setSettings] = useState([]);
  const [profileSettings, setProfileSettings] = useState([]);
  const [open, setOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [logoutOpen, setLogoutOpen] = useState(false);
  const [toggled, setToggled] = useState(false);
  const [nickname, setNickname] = useState("gugu");
  const [profileImg, setProfileImg] = useState(
    "https://cdn-icons-png.flaticon.com/128/1077/1077063.png"
  );
  const [email, setEmail] = useState("gugu@999.com");
  const [userId, setUserId] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);

  // 하단 바 로그인 상태별 paging 옵션
  const [alertStatus, setAlertStatus] = useState(false);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [anchorElUserProfile, setAnchorElUserProfile] = useState(null);

  const navigate = useNavigate();

  const handleClick = (event) => {
    // console.log("handleClick : " + postNo + " " + postOwner);
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const editMypage = () => {
    navigate(
      `/profile?userId=${userId}&email=${email}&nickname=${nickname}&image=${profileImg}`
    );
  };

  const handleOpenUserProfileMenu = (event) => {
    setAnchorElUserProfile(event.currentTarget);
  };

  const handleCloseUserProfileMenu = () => {
    setAnchorElUserProfile(null);
  };

  const profileMenuAction = (setting) => {
    console.log("menu test: " + setting);
    handleCloseUserProfileMenu();
    switch (setting) {
      case "Edit Profile":
        // 내 프로필 모달로 보여주기
        editMypage();
        // alert("프로필수정하기");
        break;
      // case "Logout":
      //   // kakaoLogout 이동
      //   setLogoutOpen(true);
      //   break;
      default:
        alert("아무것도 선택하지 않음");
    }
  };

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
        // alert("프로필보여주기");
        setProfileOpen(true);
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

  const alertClick = () => {
    setAlertStatus(!alertStatus);
  };

  const loginCheck = () => {
    if (token === null) {
      alertClick();
    } else {
      navigate("/myPage");
    }
  };

  useEffect(() => {
    if (token !== null) {
      const data = axiosUser();
      data.then((res) => setProfileImg(res.kakaoProfileImg));
      data.then((res) => setUserId(res.kakaoId));
      data.then((res) => setNickname(res.kakaoNickname));
      data.then((res) => setEmail(res.kakaoEmail));
      setSettings(["My Profile", "Logout"]);
      setProfileSettings(["Edit Profile"]);
    } else {
      setSettings(["Login"]);
    }
  }, []);

  return (
    <div className="wrap1">
      <div className="header">
        <AppBar position="static" sx={{ background: "#B6E2A1" }}>
          <Container maxWidth="xl">
            <Toolbar disableGutters>
              <IconButton
                onClick={() => {
                  document.location.href = "/";
                }}
              >
                <Avatar alt="gugu" src={gugu} />
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
                  fontSize: "large",
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
                  fontSize: 30,
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
                      <Avatar alt="myProfile" src={profileImg} />
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
        <div className="headerLeft"></div>
      </div>
      <br />
      <div>
        <FormGroup sx={{ alignContent: "center" }}>
          <Stack direction="row" spacing={1} alignItems="center">
            <Typography
              style={{
                fontSize: 20,
                fontWeight: 700,
                fontFamily: "SEBANG_Gothic_Bold",
                color: "#999999",
              }}
            >
              MAP
            </Typography>
            <IOSSwitch
              sx={{ m: 1 }}
              checked={toggled}
              size="large"
              inputProps={{ "aria-label": "ant design" }}
              onChange={(e) => setToggled(e.target.checked)}
            />
            <Typography
              style={{
                fontSize: 20,
                fontWeight: 700,
                fontFamily: "SEBANG_Gothic_Bold",
                color: "#999999",
              }}
            >
              LIST
            </Typography>
          </Stack>
        </FormGroup>
      </div>
      <br />
      <div>
        {toggled === false ? <Map token={token} /> : <ChatList token={token} />}
      </div>
      {/* <Map /> */}
      <br />
      <BottomNavigation
        sx={{
          background: "#B6E2A1",
          bottom: 0,
          position: "fixed",
          width: "100%",
        }}
        showLabels
        value={1}
      >
        <BottomNavigationAction
          // label="Posting"
          icon={<StickyNote2Outlined sx={{ transform: "scale(1.3)" }} />}
          component={Link}
          to="/posting"
        />
        <BottomNavigationAction
          // label="Home"
          icon={<HomeOutlined sx={{ transform: "scale(1.3)" }} />}
          component={Link}
          to="/"
        />
        <BottomNavigationAction
          // label="My Page"
          icon={<AccountCircleOutlined sx={{ transform: "scale(1.3)" }} />}
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
        open={profileOpen}
        onClose={() => setProfileOpen(false)}
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
          <span className="dot_btn">
            {" "}
            <IconButton
              aria-label="more"
              id="long-button"
              aria-controls={profileOpen ? "long-menu" : undefined}
              aria-expanded={profileOpen ? "true" : undefined}
              aria-haspopup="true"
              sx={{ alignContent: "right" }}
              onClick={(e) => handleOpenUserProfileMenu(e)}
            >
              <MoreVertIcon />
            </IconButton>
          </span>
          <Grid
            container
            justifycontent="center"
            direction="column"
            alignItems="center"
            padding={3}
            style={{ fontFamily: "LeferiPoint-WhiteObliqueA" }}
          >
            <Menu
              sx={{ mt: "45px" }}
              id="menu-appbar"
              anchorEl={anchorElUserProfile}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorElUserProfile)}
              onClose={handleCloseUserProfileMenu}
            >
              {profileSettings.map((setting) => (
                <MenuItem
                  key={setting}
                  onClick={() => profileMenuAction(setting)}
                >
                  <Typography textAlign="center">{setting}</Typography>
                </MenuItem>
              ))}
            </Menu>
            <Grid>
              <Avatar
                className="profileImg"
                alt="gugu"
                src={profileImg}
                sx={{
                  width: 100,
                  height: 100,
                  border: "0.1px solid lightgray",
                }}
              />
            </Grid>
            &nbsp;&nbsp;&nbsp;
            <Grid>{nickname}</Grid>
            <Grid sx={{ fontSize: 15, color: "grey" }}>{email}</Grid>
            {/* <Grid>{userId}</Grid> */}
            &nbsp;
          </Grid>
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

export default Home;
