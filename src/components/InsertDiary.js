import axios, { all } from "axios";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { newDiaryData, createDiary } from "../api/Diary";
import "../App.css";

function InsertDiary() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("aa");
  const [addedFile, setAddedFile] = useState([]);

  const formData = new FormData();
  const fileArr = new Array();

  const getTitle = (e) => {
    e.preventDefault();
    console.log(e.target.value);
    setTitle(e.target.value);
  };

  const getContent = (e) => {
    e.preventDefault();
    console.log(e.target.value);
    setContent(e.target.value);
  };

  // const allFile = {};
  const getFile = (e) => {
    console.log(e.target.files);
    // setAddedFile(e.target.files);
    // console.log(addedFile);

    const input = document.querySelector("#newfiles");
    const files = input.files;
    const arr = Array.from(files);
    // arr.forEach((file) => setAddedFile([...addedFile, file]));
    console.log(arr);

    for (let i = 0; i < arr.length; i++) {
      fileArr.push(arr[i]);
      console.log(arr[i]);
    }

    console.log(addedFile);
    console.log(fileArr);
  };

  const sendDiary = (e) => {
    e.preventDefault();

    formData.append("title", title);
    formData.append("content", content);

    for (let i = 0; i < fileArr.length; i++) {
      formData.append("files", fileArr[i]);
    }
    console.log(formData);
    // formdata 값 확인해 보는 법 !
    for (let key of formData.keys()) {
      console.log(key, ":", formData.get(key));
    }

    console.log(addedFile);

    createDiary(formData);
  };

  return (
    <form
      method="POST"
      onSubmit={(e) => sendDiary(e)}
      encType="multipart/form-data"
    >
      <button className="write_button" type="submit">
        저장
      </button>
      <div>
        Title :
        <input
          name="title"
          placeholder="title"
          onChange={getTitle}
          value={title}
        ></input>{" "}
        <br />
        Content :
        <input
          name="content"
          placeholder="content"
          onChange={getContent}
          value={content}
        ></input>
        <br />
        File Upload :
        <input
          type="file"
          name="newfiles"
          id="newfiles"
          multiple
          onChange={getFile}
        ></input>
        <hr />* 미리 보기 *<br />
        <div>
          <b>Title : {title}</b> <br></br>
          <b>content : {content}</b> <br></br>
          <b>file : {addedFile} </b>
        </div>
      </div>
    </form>
  );
}

export default InsertDiary;
