/*global kakao*/
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
import { axioUserPosts } from "../api/Post";
// import Avatar from "@mui/material/Avatar";
import "../css/MyPage.css";
import { currentPositions } from "../api/Map";
// import Map from "./Map";

function MyPage() {
  const [nickname, setNickname] = useState("gugu");
  const [profileImg, setProfileImg] = useState("../img/dulgi.jpg");
  const [email, setEmail] = useState("gugu@999.com");
  const [userId, setUserId] = useState("");
  const [latitude, setLatitude] = useState(0); // 위도
  const [longitude, setLongitude] = useState(0); // 경도
  const [userPosts, setUserPosts] = useState([]);

  function currentPositions() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        function (position) {
          setLatitude(position.coords.latitude);
          setLongitude(position.coords.longitude);
        },
        function (error) {
          console.error(error);
        }
      );
    } else {
      console.log("GPS를 지원하지 않습니다.");
    }
  }

  const token = window.localStorage.getItem("token");

  useEffect(() => {
    const data = axiosUser();
    data.then((res) => setNickname(res.kakaoNickname));
    data.then((res) => setProfileImg(res.kakaoProfileImg));
    data.then((res) => setEmail(res.kakaoEmail));
    data.then((res) => setUserId(res.kakaoId));

    currentPositions();
    const userPosition = new kakao.maps.LatLng(latitude, longitude);
    const options = {
      center: userPosition,
      level: 5, //지도의 레벨(확대, 축소 정도)
    };
    const container = document.getElementById("map");
    const map = new kakao.maps.Map(container, options);
    const userMarker = new kakao.maps.Marker({
      map: map,
      position: userPosition,
      // image: markerImage,
      title: "현재 사용자의 위치",
    });
    // 웹브라우저 사이즈 크기에 따라서 지도의 중심값 변경
    function mapResize() {
      map.relayout();
      map.setCenter(userPosition);
    }

    // 웹브라우저의 사이즈가 변경될 때 마다 함수 실행
    window.onresize = mapResize;

    // 마이페이지 포스팅 마커 표시하기
    const postsData = axioUserPosts(userId);
    postsData.then((res) => setUserPosts(res));
    console.log("userId" + userId);
    console.log(postsData);
    userPosts.forEach((post) => {
      const postLatlng = new kakao.maps.LatLng(post.postLat, post.postLong);
      console.log("userId" + post.userId);

      // 포스트 마커 이미지 옵션
      const imageSrc = "feather.png";
      const imageSize = new kakao.maps.Size(30, 30); // 마커이미지의 크기
      const imageOption = { offset: new kakao.maps.Point(27, 69) }; // 마커이미지의 옵션

      // 포스트 마커의 이미지 정보를 가지고 있는 마커이미지 생성
      const postImage = new kakao.maps.MarkerImage(
        imageSrc,
        imageSize,
        imageOption
      );
      // 채팅방 마커 객체 생성
      const postMarkers = new kakao.maps.Marker({
        map: map,
        position: postLatlng,
        image: postImage,
      });
    });
  }, [latitude, longitude, userPosts.length]);

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
      <div
        id="map"
        className="map"
        style={{ width: `"${window.innerWidth}"`, height: "350px" }}
      ></div>
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
