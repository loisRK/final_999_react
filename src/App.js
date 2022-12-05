import "./App.css";
import logo from "./logo.svg";
import { useEffect, useState } from "react";
import axios from "axios";
import { axiosData } from "./api/Diary";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Diary from "./components/Diary";
import Posting from "./components/Posting";
import Home from "./components/Home";
import DiaryEdit from "./components/DiaryEdit";
import InsertDiary from "./components/InsertDiary";
import KakaoRedirectHandler from "./api/KakaoRedirectHandler";
import MyPage from "./components/MyPage";

function App() {
  // 페이지네이션을 위한 필요 데이터
  /*
    1. 페이지당 출력 개수(10) postPerPage
    2. indexOfLastPage
    3. indexOfFirstPage
    4. currentPage
  */

  // const indexOfLastPage = currentPage * postsPerPage;
  // const indexOfFirstPage = indexOfLastPage - postsPerPage;
  // const currentPosts = (posts) => {
  //   let currentPosts = [];
  //   currentPosts = posts.slice(start, end);
  //   return currentPosts;
  // };
  // console.log(currentPage);

  return (
    <div className="App">
      {/* 페이지 전환을 위한 routes 설정 */}
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/posting" element={<Posting />} />
          <Route path="/diaryFile/*" element={<Diary />} />
          <Route path="/diaryEdit/*" element={<DiaryEdit />} />
          <Route path="/insert" element={<InsertDiary />} />
          <Route
            path="/oauth/callback/kakao"
            element={<KakaoRedirectHandler />}
          />
          <Route path="/myPage" element={<MyPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
