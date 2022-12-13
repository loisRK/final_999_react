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
  Container,
  Grid,
  Toolbar,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { axiosUser } from "../api/User";
// import Avatar from "@mui/material/Avatar";
import "../css/MyPage.css";

function MyPage() {
  const [nickname, setNickname] = useState("gugu");
  const [profileImg, setProfileImg] = useState("../img/dulgi.jpg");
  const [email, setEmail] = useState("gugu@999.com");

  const token = window.localStorage.getItem("token");

  useEffect(() => {
    if (token !== null) {
      const data = axiosUser();
      data.then((res) => setNickname(res.kakaoNickname));
      data.then((res) => setProfileImg(res.kakaoProfileImg));
      data.then((res) => setEmail(res.kakaoEmail));
    }
  }, []);

  return (
    <div>
      <AppBar position="static" sx={{ background: "#B6E2A1" }}>
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <Typography
              variant="h6"
              noWrap
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
              마이페이지
            </Typography>
          </Toolbar>
        </Container>
      </AppBar>
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
            src={profileImg}
            sx={{
              width: 100,
              height: 100,
            }}
          />
        </Grid>
        &nbsp;&nbsp;&nbsp;
        <Grid>{nickname}</Grid>
        <Grid>{email}</Grid>
      </Grid>
      <button>프로필 수정</button>
      <BottomNavigation
        sx={{
          background: "#B6E2A1",
          position: "fixed",
          width: "100%",
          bottom: 0,
          flex: "justify-start",
        }}
        showLabels
        value={2}
      >
        <BottomNavigationAction
          label="Posting"
          icon={<StickyNote2Outlined />}
          component={Link}
          to="/posting"
        />
        <BottomNavigationAction
          label="Home"
          icon={<HomeOutlined />}
          component={Link}
          to="/"
        />
        <BottomNavigationAction
          label="My Page"
          icon={<AccountCircleOutlined />}
          component={Link}
          to="/myPage"
        />
      </BottomNavigation>
    </div>
  );
}

export default MyPage;
