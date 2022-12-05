import React from "react";
import { Link } from "react-router-dom";

const Posts = ({ onScroll, listInnerRef, posts, currentPage }) => {
  return (
    <div>
      <div
        onScroll={onScroll}
        ref={listInnerRef}
        style={{ height: "100vh", overflowY: "auto" }}
      >
        {posts.map((post) => {
          return (
            <div
              key={post.no}
              style={{
                marginTop: "40px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
              }}
            >
              <p>Title: {post.title}</p>
              <p>Content: {post.content}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Posts;
