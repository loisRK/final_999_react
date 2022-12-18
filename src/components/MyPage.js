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
  Modal,
} from "@mui/material";
import { Box } from "@mui/system";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { axiosUser } from "../api/User";
import { axioUserPosts, postData, axiosDeletePost } from "../api/Post";
// import Avatar from "@mui/material/Avatar";
import "../css/MyPage.css";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { useNavigate } from "react-router-dom";
import MoreVertIcon from "@mui/icons-material/MoreVert";
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
    // 포스트 마커 forEach로 표시
    userPosts.forEach((post) => {
      const postLatlng = new kakao.maps.LatLng(post.postLat, post.postLong);
      const postNo = post.postNo;

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

  function time(postedDate) {
    const today = new Date();
    const postDate = new Date(postedDate);
    const postedTime = Math.ceil(
      (today.getTime() - postDate.getTime()) / (1000 * 60)
    );

    if (postedTime >= 1440) {
      return "" + Math.round(postedTime / 3600) + "d";
    } else if (postedTime >= 60) {
      return "" + Math.round(postedTime / 60) + "h";
    } else {
      return "" + Math.round(postedTime) + "m";
    }
  }

  return (
    <div>
      <div>
        {/* <Button onClick={() =>{setModalOpen(true)}}>Open modal</Button> */}
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
                    aria-controls={open ? "long-menu" : undefined}
                    aria-expanded={open ? "true" : undefined}
                    aria-haspopup="true"
                    onClick={(e) =>
                      handleClick(e, postDetail.postNo, postDetail.kakaoId)
                    }
                  >
                    <MoreVertIcon />
                  </IconButton>
                </span>
                <Typography
                  id="modal-modal-title"
                  variant="h6"
                  component="h2"
                ></Typography>
                <Typography className="flex">
                  <Avatar
                    className="profile_img"
                    src={postDetail.userDTO.kakaoProfileImg}
                    width="100px"
                    height="100px"
                  />
                </Typography>
                <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                  @{postDetail.userDTO.kakaoNickname}&nbsp;
                  <span className="post_detail">{time(postDetail.postDate)}</span>&nbsp;
                  {/* {postDetail.userDTO.kakaoNickname} */}
                </Typography>
                {/* <span className="post_detail">
                  @{postDetail.userDTO.kakaoNickname}
                </span> */}
                {/* <span className="post_detail">{time(postDetail.postDate)}</span>&nbsp; */}
                {/* <span className="post_detail">post#{postDetail.postNo}</span> */}
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
        <Grid>{userId}</Grid>
      </Grid>
      <div
        id="map"
        className="map"
        style={{ width: `"${window.innerWidth}"`, height: "45vh" }}
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
            maxHeight: ITEM_HEIGHT * 4.5,
            width: "20ch",
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
