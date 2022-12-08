import React from "react";

const Posts = ({ onScroll, listInnerRef, posts, currentPage }) => {
  return (
    <div>
      <div
        onScroll={onScroll}
        ref={listInnerRef}
        style={{ height: "100vh", overflowY: "auto" }}
      >
        {posts.map((post) => {
          console.log(post);
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
                <br />
                Content: {post.postContent}
                <br />
                <img src={`/img/${post.postImg}`} />
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Posts;
