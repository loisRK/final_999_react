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
  Fab,
  Toolbar,
  Typography,
  Snackbar,
  Alert,
  Button,
} from "@mui/material";
import {
  AccountCircleOutlined,
  AddCircle,
  HomeOutlined,
  StickyNote2Outlined,
} from "@mui/icons-material";
import { Container } from "@mui/system";
import { axiosUser } from "../api/User";

function Posting() {
  // ID token 확인
  const token = window.localStorage.getItem("token");

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
      <AppBar position="static" sx={{ background: "#B6E2A1" }}>
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
          // component={Button}
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
    </div>
  );
}

export default Posting;
