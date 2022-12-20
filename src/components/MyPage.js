/*global kakao*/
// import PropTypes from 'prop-types';
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
  Tooltip,
  Typography,
  Modal,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Tooltip,
} from "@mui/material";
import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
// import { Box } from "@mui/system";
import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { axiosUser } from "../api/User";
import { axioUserPosts, postData, axiosDeletePost, axiosMypagePosts } from "../api/Post";
// import Avatar from "@mui/material/Avatar";
import "../css/MyPage.css";
import { useNavigate } from "react-router-dom";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { currentPositions } from "../api/Map";
import Profile from "./Profile";
import gugu from "../img/bidulgi.png";
import Posts from "./Posts";
// import Map from "./Map";

function MyPage() {
  const [settings, setSettings] = useState(["Edit Profile", "Logout"]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [logoutOpen, setLogoutOpen] = useState(false);
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
      case "Edit Profile":
        // 내 프로필 모달로 보여주기
        editMypage();
        alert("프로필수정하기");
        break;
      case "Logout":
        // kakaoLogout 이동
        setLogoutOpen(true);
        break;
      default:
        alert("아무것도 선택하지 않음");
    }
  };

  const [nickname, setNickname] = useState("gugu");
  const [profileImg, setProfileImg] = useState("../img/dulgi.jpg");
  const [email, setEmail] = useState("gugu@999.com");
  const [userId, setUserId] = useState("");
  const [latitude, setLatitude] = useState(0); // 위도
  const [longitude, setLongitude] = useState(0); // 경도
  const [userPosts, setUserPosts] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [postDetail, setPostDetail] = useState(null);
  const loginOptions = ["수정하기", "삭제하기"];
  const navigate = useNavigate();
  const [postNo, setPostNo] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const ITEM_HEIGHT = 20;

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
    data.then((res) => setUserId(res.kakaoId));
    data.then((res) => setNickname(res.kakaoNickname));
    data.then((res) => setProfileImg(res.kakaoProfileImg));
    data.then((res) => setEmail(res.kakaoEmail));
    data
      .then((res) => axioUserPosts(res.kakaoId))
      .then((res) => setUserPosts(res));
    // const postsData = axioUserPosts(userId);

    // 지도생성
    currentPositions();
    const userPosition = new kakao.maps.LatLng(latitude, longitude);
    const options = {
      center: userPosition,
      level: 5, //지도의 레벨(확대, 축소 정도)
    };

    // 사용자 마커 이미지 옵션
    const imageSrc = "place.png";
    const imageSize = new kakao.maps.Size(40, 40); // 마커이미지의 크기
    // const imageOption = { offset: new kakao.maps.Point(27, 69) }; // 마커이미지의 옵션

    // 사용자 마커의 이미지 정보를 가지고 있는 마커이미지 생성
    const userMarkerImg = new kakao.maps.MarkerImage(
      imageSrc,
      imageSize
      // imageOption
    );

    const container = document.getElementById("map");
    const map = new kakao.maps.Map(container, options);
    const userMarker = new kakao.maps.Marker({
      map: map,
      position: userPosition,
      image: userMarkerImg,
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
    // 포스트 마커 forEach로 표시
    userPosts.forEach((post) => {
      const postLatlng = new kakao.maps.LatLng(post.postLat, post.postLong);
      const postNo = post.postNo;

      // 포스트 마커 이미지 옵션
      const imageSrc = "feather.png";
      const imageSize = new kakao.maps.Size(30, 30); // 마커이미지의 크기
      // const imageOption = { offset: new kakao.maps.Point(27, 69) }; // 마커이미지의 옵션

      // 포스트 마커의 이미지 정보를 가지고 있는 마커이미지 생성
      const postImage = new kakao.maps.MarkerImage(
        imageSrc,
        imageSize
        // imageOption
      );
      // 포스트 마커 객체 생성
      const postMarkers = new kakao.maps.Marker({
        map: map,
        position: postLatlng,
        image: postImage,
        title: postNo,
      });

      // 포스트 마커 클릭시 modal 띄우기
      kakao.maps.event.addListener(postMarkers, "click", function (mouseEvent) {
        const onePost = postData(postNo);
        onePost.then((res) => setPostDetail(res));
        setModalOpen(true);
      });
    });
  }, [latitude, longitude, userPosts.length]);

  const handleClick = (event, postNo) => {
    // console.log("handleClick : " + postNo + " " + postOwner);
    setAnchorEl(event.currentTarget);
    setPostNo(postNo);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const editOrDelete = (event) => {
    console.log(event.currentTarget);

    if (event.currentTarget.innerText === "수정하기") {
      console.log("수정 눌렀을 때 : " + postNo);
      navigate(`/postEdit?postNo=${postNo}`);
    } else {
      console.log("삭제 눌렀을 때 : " + postNo);
      axiosDeletePost(postNo);
    }
  };

  const editMypage = (event) => {
    navigate(
      `/profile?userId=${userId}&email=${email}&nickname=${nickname}&image=${profileImg}`
    );
  };

  const [value, setValue] = React.useState('1');
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

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
                  fontSize: "medium",
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
                    <Avatar alt="myProfile" src={profileImg} />
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
        <Modal
          open={modalOpen}
          onClose={() => {
            setModalOpen(false);
          }}
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
              bgcolor: "white",
              border: "2px solid #000",
              boxShadow: 24,
              p: 4,
            }}
          >
            {postDetail === null ? (
              <></>
            ) : (
              <div>
                <span className="dot_btn">
                  {" "}
                  <IconButton
                    aria-label="more"
                    id="long-button"
                    aria-controls={modalOpen ? "long-menu" : undefined}
                    aria-expanded={modalOpen ? "true" : undefined}
                    aria-haspopup="true"
                    onClick={(e) =>
                      handleClick(e, postDetail.postNo, postDetail.kakaoId)
                    }
                  >
                    <MoreVertIcon />
                  </IconButton>
                </span>
                <div id="modal-modal-title" variant="h6" component="h2"></div>
                <div className="flex">
                  <Avatar
                    className="profile_img"
                    src={postDetail.userDTO.kakaoProfileImg}
                    width="100px"
                    height="100px"
                  />
                </div>
                <div id="modal-modal-description" sx={{ mt: 2 }}>
                  <b>@{postDetail.userDTO.kakaoNickname}</b>
                  &nbsp;&nbsp;
                  <span className="post_detail">
                    {postDetail.postDate.substr(0, 10)}
                  </span>
                </div>
                <div className="post_content">{postDetail.postContent}</div>
                {postDetail.postImg === "" ? (
                  <></>
                ) : (
                  <img
                    className="post_img"
                    src={postDetail.postImg}
                  />
                )}
              </div>
            )}
          </Box>
        </Modal>
      </div>
      <div>
        <div className="mypagePostModal">
          <Modal
            open={modalOpen}
            onClose={() => {
              setModalOpen(false);
            }}
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
                bgcolor: "white",
                border: "2px solid #000",
                boxShadow: 24,
                p: 4,
              }}
            >
              {postDetail === null ? (
                <></>
              ) : (
                <div>
                  <span className="dot_btn">
                    {" "}
                    <IconButton
                      aria-label="more"
                      id="long-button"
                      aria-controls={modalOpen ? "long-menu" : undefined}
                      aria-expanded={modalOpen ? "true" : undefined}
                      aria-haspopup="true"
                      onClick={(e) =>
                        handleClick(e, postDetail.postNo, postDetail.kakaoId)
                      }
                    >
                      <MoreVertIcon />
                    </IconButton>
                  </span>
                  <div id="modal-modal-title" variant="h6" component="h2"></div>
                  <div className="flex">
                    <Avatar
                      className="profile_img"
                      src={postDetail.userDTO.kakaoProfileImg}
                      width="100px"
                      height="100px"
                    />
                  </div>
                  <div id="modal-modal-description" sx={{ mt: 2 }}>
                    <b>{postDetail.userDTO.kakaoNickname}</b>
                  </div>
                  <div>
                    <span className="post_detail">
                      @{postDetail.userDTO.kakaoNickname}
                    </span>
                    &nbsp;&nbsp;&nbsp;
                    <span className="post_detail">
                      {postDetail.postDate.substr(0, 10)}
                    </span>
                  </div>
                  &nbsp;&nbsp;&nbsp;
                  <div className="post_content">{postDetail.postContent}</div>
                  {postDetail.postImg === "" ? (
                    <></>
                  ) : (
                    <img className="post_img" src={postDetail.postImg} />
                  )}
                </div>
              )}
            </Box>
          </Modal>
        </div>
        <br/><br/><br/>
        <div className="mypageInfo">
            <Grid
              container
              justifycontent="center"
              direction="column"
              alignItems="center"
              padding={3}
              style={{ fontFamily: "LeferiPoint-WhiteObliqueA" }}
              >
            <Grid>
              <Avatar
                className="profileImg"
                alt="gugu"
                src={profileImg}
                sx={{
                  width: 100,
                  height: 100,
                  border: "0.1px solid lightgray",
                  zIndex:0
                }}
              />
            </Grid>
            &nbsp;&nbsp;&nbsp;
            <Grid>{nickname}</Grid>
            <Grid sx={{ fontSize: 15, color: "grey" }}>{email}</Grid>
          </Grid>
        </div>
        
        <div className="mypageTab">
            <Box sx={{ width: "100%", typography: "body1"}}>
              <TabContext value={value}>
                  <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                    <TabList
                      onChange={handleChange}
                      centered
                      aria-label="lab API tabs example"
                    >
                      <Tab label="Map" value="1" sx={{ width: "50vw" }} />
                      <Tab label="List" value="2" sx={{ width: "50vw" }} />
                    </TabList>
                  </Box>
                <TabPanel
                  value="1"
                  id="map"
                  sx={{ width: `"${window.innerWidth}"`, height: "40vh" }}
                >
                </TabPanel>
                <TabPanel 
                  value="2"
                  id="postList"
                  sx={{ width: `"${window.innerWidth}"`, height: "20px" }}
                  >
                  <Posts
                    sx={{height:"30vh !important"}}
                    onScroll={onScroll}
                    listInnerRef={listInnerRef}
                    posts={posts}
                  ></Posts>
                </TabPanel>
              </TabContext>
            </Box>
        </div>
        
      </div>

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
          component={Link}
          to="/myPage"
        />
      </BottomNavigation>
      <Menu
        id="long-menu"
        MenuListProps={{
          "aria-labelledby": "long-button",
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          style: {
            maxHeight: ITEM_HEIGHT * 6,
            width: "15ch",
          },
        }}
      >
        {loginOptions.map((option) => (
          <MenuItem key={option} onClick={(e) => editOrDelete(e)}>
            {option}
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
}

export default MyPage;
