import React, { useState } from "react";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { axiosDeletePost } from "../api/Post";
import { useNavigate} from "react-router-dom";

const options = ["수정하기", "삭제하기"];

const ITEM_HEIGHT = 20;

const Posts = ({ onScroll, listInnerRef, posts, currentPage }) => {
  const navigate = useNavigate();
  const [postNo, setPostNo] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const token = window.localStorage.getItem("token");

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
      // axiosDeletePost(postNo);
    }
  };

  return (
    <div>
      <div
        onScroll={onScroll}
        ref={listInnerRef}
        style={{ height: "50vh", overflowY: "auto" }}
      >
        {posts.map((post) => {
          // console.log(post);
          return (
            <div
              key={post.postNo}
              style={{
                marginTop: "40px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
              }}
            >
              <p>
                postNo: {post.postNo}
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
                <br />
                Content: {post.postContent}
                <br />
                <img src={`/img/${post.postImg}`} />
              </p>
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