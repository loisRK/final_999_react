import React, { useState } from "react";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { axiosDeletePost } from "../api/Post";
import { useNavigate } from "react-router-dom";
import { Avatar, Container, Box, AppBar, Tooltip, Toolbar } from "@mui/material";
import { axiosLike } from "../api/Post";
import { FavoriteOutlined } from "@mui/icons-material";
import gugu from "../img/bidulgi.png";

const options = ["수정하기", "삭제하기"];
const ITEM_HEIGHT = 20;

const Posts = ({ onScroll, listInnerRef, posts, currentPage }) => {
  const navigate = useNavigate();
  const [postNo, setPostNo] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [heartToggle, setHeartToggle] = useState(1);
  const open = Boolean(anchorEl);
  const token = window.localStorage.getItem("token");

  const heartBtnClick = () => {
    setHeartToggle(!heartToggle);
  };

  const heartClick = (postNum, userId, heartToggle) => {
    // 데이터 전송을 위한 form, file 객체 생성
    const formData = new FormData();
    // console.log("postNo : " +postNum +"  kakaoId : " +userId +"  heartToggle : " +heartToggle);
    formData.append("postNo", postNum);
    formData.append("userId", userId);
    formData.append("afterLike", heartToggle);

    console.log("formdata : " + formData);

    axiosLike(formData);
  };

  const handleClick = (event, postNo) => {
    setAnchorEl(event.currentTarget);
    console.log("handleClick : " + postNo);
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

      // axiosEditPost();
    } else {
      console.log("삭제 눌렀을 때 : " + postNo);
      axiosDeletePost(postNo);
    }
  };

  function time(postedDate) {
    const today = new Date();
    const postDate = new Date(postedDate);
    const postedTime = Math.ceil((today.getTime() - postDate.getTime()) /(1000 * 60));

    if((postedTime >=1440)) {
      return ''+Math.round((postedTime / 3600))+"일 전";
    } else if((postedTime >= 60)) {
      return ''+Math.round((postedTime / 60))+"시간 전";
    } else {
      return ''+Math.round(postedTime)+"분 전";
    };
  }

  return (
    <div>
      <div
        onScroll={onScroll}
        ref={listInnerRef}
        style={{ height: "73vh", overflowY: "auto" }}
      >
        {posts.map((post) => {
          console.log(post);
          console.log(post.userDTO.kakaoId);

          return (
            <div key={post.postNo} className="post_box">
              <section className="section_view">
                <Avatar
                  className="profile_img"
                  src={post.userDTO.kakaoProfileImg}
                  width="100px"
                  height="100px"
                />
                <div className="posts">
                  <div className="post_name">
                    <span>{post.userDTO.kakaoNickname}</span>
                    <span className="post_detail">
                      @{post.userDTO.kakaoNickname}
                    </span>
                    <span className="post_detail">{post.postDate}</span>
                    <span className="post_detail">post#{post.postNo}</span><br/>
                    <span className="post_detail">{time(post.postDate)} 포스팅</span><br/>
                    
                    <span className="heart_btn">
                      <Avatar
                        onClick={() =>
                          heartClick(
                            post.postNo,
                            post.userDTO.kakaoId,
                            heartToggle
                          )
                        }
                      >
                        <FavoriteOutlined color="secondary" />
                      </Avatar>
                      {/* <button onClick={heartBtnClick}>
                        {heartToggle === 0 ? (
                          <Avatar
                            src={heart}
                            alt="heart"
                            onClick={() =>
                              heartClick(
                                post.postNo,
                                post.userDTO.kakaoId,
                                heartToggle
                              )
                            }
                          />
                        ) : (
                          <Avatar
                            src={heart_filled}
                            alt="heart"
                            onClick={() =>
                              heartClick(
                                post.postNo,
                                post.userDTO.kakaoId,
                                heartToggle
                              )
                            }
                          />
                        )}
                      </button> */}
                    </span>
                    <span className="dot_btn">
                      {" "}
                      <IconButton
                        aria-label="more"
                        id="long-button"
                        aria-controls={open ? "long-menu" : undefined}
                        aria-expanded={open ? "true" : undefined}
                        aria-haspopup="true"
                        onClick={(e) => handleClick(e, post.postNo)}
                      >
                        <MoreVertIcon />
                      </IconButton>
                    </span>
                  </div>
                  <div className="post_content">{post.postContent}</div>
                  {post.postImg === "" ? (
                    <></>
                  ) : (
                    <img className="post_img" src={`/img/${post.postImg}`} />
                  )}
                </div>
              </section>
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
        {options.map((option) => (
          <MenuItem
            key={option}
            selected={option === "Pyxis"}
            onClick={(e) => editOrDelete(e)}
          >
            {option}
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
};

export default Posts;
