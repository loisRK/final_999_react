import "../css/Posting.css";
import { useEffect, useRef, useState } from "react";
import Posts from "./Posts";
import { axiosData, postData } from "../api/Diary";
import { Link, useNavigate } from "react-router-dom";
import {
  AppBar,
  BottomNavigation,
  BottomNavigationAction,
  Fab,
  Toolbar,
  Typography,
} from "@mui/material";
import {
  AccountCircleOutlined,
  AddCircle,
  HomeOutlined,
  StickyNote2Outlined,
} from "@mui/icons-material";
import { Container } from "@mui/system";

function Posting() {
  // ID token 확인
  const token = window.localStorage.getItem("token");
  console.log("userID token : " + token);
  // infinite scrolling
  const listInnerRef = useRef();
  const [currentPage, setCurrentPage] = useState(1);
  const [prevPage, setPrevPage] = useState(0); // storing prev page number
  const [posts, setPosts] = useState([]);
  const [wasLastList, setWasLastList] = useState(false); // setting a flag to know the last list

  const navigate = useNavigate();

  useEffect(() => {
    // infinite scroll 테스트
    if (!wasLastList && prevPage !== currentPage) {
      postData(posts, setWasLastList, setPrevPage, setPosts, currentPage);
    }
  }, [currentPage, wasLastList, prevPage]);

  const onScroll = () => {
    if (listInnerRef.current) {
      console.log("inside onScroll");
      const { scrollTop, scrollHeight, clientHeight } = listInnerRef.current;
      console.log(scrollTop + clientHeight, scrollHeight);
      if (scrollTop + clientHeight >= scrollHeight) {
        console.log("inside if");
        setCurrentPage(currentPage + 1);
      }
    }
  };

  return (
    <div className="postHome">
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
              Posting
            </Typography>
          </Toolbar>
        </Container>
      </AppBar>

      <div className="postPage">
        <Posts
          onScroll={onScroll}
          listInnerRef={listInnerRef}
          posts={posts}
          currentPage={currentPage}
        ></Posts>
      </div>
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
          component={Link}
          to="/myPage"
        />
      </BottomNavigation>
    </div>
  );
}

export default Posting;
