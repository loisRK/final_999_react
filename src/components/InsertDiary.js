import axios, { all } from "axios";
import React, { useState } from "react";
import { useParams, useSearchParams, Link } from "react-router-dom";
import { newDiaryData, createDiary, createPost } from "../api/Post";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import "../App.css";

function InsertDiary() {
  // 페이지 전환 시 쿼리스트링방식으로 값 받아오기위한 searchParams 객체 생성
  const [search, setSearch] = useSearchParams();

  // post 위치 위도(lat), 경도(long)
  const postLat = search.get("lat");
  const postLong = search.get("long");
  console.log(postLat);

  // post 내용
  const [content, setContent] = useState("");

  // post 첨부 이미지(1개)
  const [addedFile, setAddedFile] = useState([]);

  // 데이터 전송을 위한 form, file 객체 생성
  const formData = new FormData();
  const fileArr = new Array();

  const getContent = (e) => {
    e.preventDefault();
    console.log(e.target.value);
    setContent(e.target.value);
  };

  const getFile = (e) => {
    console.log(e.target.files);
    const input = document.querySelector("#newfiles");
    const files = input.files;
    const arr = Array.from(files);
    console.log("arr : " + arr);

    for (let i = 0; i < arr.length; i++) {
      fileArr.push(arr[i]);
      console.log(arr[i]);
    }

    console.log(addedFile);
    console.log(fileArr);
  };

  const sendDiary = (e) => {
    e.preventDefault();

    console.log("postLat" + postLat);
    console.log("content" + content);

    formData.append("postLat", postLat);
    formData.append("postLong", postLong);
    formData.append("postContent", content);

    for (let i = 0; i < fileArr.length; i++) {
      formData.append("files", fileArr[i]);
    }
    console.log(formData);

    // formdata 값 확인해 보는 법 !
    for (let key of formData.keys()) {
      console.log(key, ":", formData.get(key));
    }

    console.log(addedFile);

    createPost(formData);
    console.log("formData" + formData);
  };

  return (
    <div>
      <button
        className="write_button"
        onClick={() => (window.location.href = "/")}
      >
        취소
      </button>

      <form
        method="POST"
        onSubmit={(e) => sendDiary(e)}
        encType="multipart/form-data"
      >
        <button className="write_button" type="submit">
          저장
        </button>

        <div>
          {/* Content :<br /> */}
          <Stack
            component="form"
            sx={{
              width: "25ch",
            }}
            spacing={2}
            noValidate
            autoComplete="off"
          >
            <TextField
              fullWidth
              label="content"
              id="content"
              name="content"
              defaultValue={content}
              variant="filled"
              onChange={getContent}
            />
            <TextField
              hiddenLabel
              id="filled-hidden-label-normal"
              defaultValue="Normal"
              variant="filled"
            />
          </Stack>
          {/* <input
            name="content"
            placeholder="content"
            onChange={getContent}
            value={content}
          ></input> */}
          <br />
          File Upload :
          <input
            type="file"
            name="newfiles"
            id="newfiles"
            multiple
            onChange={getFile}
          ></input>
        </div>
      </form>
    </div>
  );
}

export default InsertDiary;
