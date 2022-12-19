import React, { useEffect, useState } from "react";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { axiosDeletePost, axiosLike, postData } from "../api/Post";
import { useNavigate } from "react-router-dom";
import { Avatar, Checkbox, Snackbar, Alert } from "@mui/material";
import { Favorite, FavoriteBorder, MoreVertIcon } from "@mui/icons-material";
import { axiosUser } from "../api/User";

const ITEM_HEIGHT = 20;

const Posts = ({ onScroll, listInnerRef, posts, currentPage }) => {
  const navigate = useNavigate();
  const [postNo, setPostNo] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [userId, setUserId] = useState("");
  const open = Boolean(anchorEl);

  const token = window.localStorage.getItem("token");
  const [alertStatus, setAlertStatus] = useState(false);

  useEffect(() => {
    // userId 가져오기
    if (token !== null) {
      const data = axiosUser();
      data.then((res) => setUserId(res.kakaoId));
    }
  }, []);

  const heartClick = (postNum, liked) => {
    // 데이터 전송을 위한 form, file 객체 생성
    const formData = new FormData();
    console.log("postNo : " + postNum + "  kakaoId : " + userId);
    formData.append("postNo", postNum);
    formData.append("userId", userId);

    let changeLike = 0;
    {
      liked === 0 ? (changeLike = 1) : (changeLike = 0);
    }
    formData.append("afterLike", changeLike);

    // formdata 값 확인해 보는 법 !
    for (let key of formData.keys()) {
      console.log("formdata확인" + key, ":", formData.get(key));
    }

    axiosLike(formData);
  };

  const handleClick = (event, postNo, postOwner) => {
    // console.log("handleClick : " + postNo + " " + postOwner);
    if (postOwner === userId) {
      setAnchorEl(event.currentTarget);
      setPostNo(postNo);
    }
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const alertClick = () => {
    setAlertStatus(!alertStatus);
  };

  const loginOptions = ["수정하기", "삭제하기"];
  const editOrDelete = (event) => {
    console.log(event.currentTarget);
    if (userId === "") {
      alertClick();
    } else {
      if (event.currentTarget.innerText === "수정하기") {
        console.log("수정 눌렀을 때 : " + postNo);
        navigate(`/postEdit?postNo=${postNo}`);
      } else {
        console.log("삭제 눌렀을 때 : " + postNo);
        axiosDeletePost(postNo).then((document.location.href = `/posting`));
      }
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
      <div
        onScroll={onScroll}
        ref={listInnerRef}
        style={{
          height: "73vh",
          overflowY: "scroll",
          fontFamily: "LeferiPoint-WhiteObliqueA",
        }}
      >
        {posts.map((post) => {
          console.log(post);
          console.log(userId);
          // like가 Promise 객체로 불러와지기 때문에 이렇게 사용할 수가 없다
          // posts 자체를 불러올 때 afterLike 변수값까지 같이 가져올 수 있는 DTO를 새로 만들어야 한다.
          // let liked = axiosGetLike(userId, post.postNo);
          // console.log("get liked : " + post.postNo + " " + liked);

          return (
            <div key={post.postNo} className="post_box">
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
              <section className="section_view">
                <Avatar
                  className="profile_img"
                  src={post.kakaoProfileImg}
                  width="100px"
                  height="100px"
                />
                <div className="posts">
                  <div className="post_name">
                    {/* <span>{post.kakaoNickname}</span> */}
                    <span className="post_detail">@{post.kakaoNickname}</span>
                    {/* <span className="post_detail">{post.postDate}</span> */}
                    {/* <span className="post_detail">post#{post.postNo}</span> */}
                    {/* <br /> */}
                    <span className="post_detail">{time(post.postDate)}</span>
                    <br />
                    <span className="heart_btn">
                      {token !== null ? (
                        <Checkbox
                          defaultChecked={post.afterLike === 1 ? true : false}
                          icon={<FavoriteBorder />}
                          checkedIcon={<Favorite />}
                          onChange={() =>
                            heartClick(post.postNo, post.afterLike)
                          }
                          color="warning"
                        />
                      ) : (
                        <Checkbox
                          defaultChecked={post.afterLike === 1 ? true : false}
                          disabled
                          icon={<FavoriteBorder />}
                          checkedIcon={<Favorite />}
                          onChange={() =>
                            heartClick(post.postNo, post.afterLike)
                          }
                          color="warning"
                        />
                      )}
                      <span>{post.likeCnt}</span>
                    </span>
                    <span className="dot_btn">
                      {" "}
                      <IconButton
                        aria-label="more"
                        id="long-button"
                        aria-controls={open ? "long-menu" : undefined}
                        aria-expanded={open ? "true" : undefined}
                        aria-haspopup="true"
                        onClick={(e) =>
                          handleClick(e, post.postNo, post.kakaoId)
                        }
                      >
                        <MoreVertIcon />
                      </IconButton>
                    </span>
                  </div>
                  <div className="post_content">{post.postContent}</div>
                  {post.postImg === "" ? (
                    <></>
                  ) : (
                    <img className="post_img" src={post.postImg} />
                  )}
                </div>
              </section>
              <div></div>
            </div>
          );
        })}
      </div>
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
};

export default Posts;
