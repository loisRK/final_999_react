import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Posting from "./components/Posting";
import Home from "./components/Home";
import HomeTest from "./components/HomeTest";
import InsertDiary from "./components/InsertDiary";
import MyPage from "./components/MyPage";
import Chatting from "./components/Chatting";
import KakaoRedirectLogin from "./api/KakaoRedirectLogin";
import KakaoRedirectLogout from "./api/KakaoRedirectLogout";
import KakaoRedirectWithdraw from "./api/KakaoRedirectWithdraw";
import Chat from "./components/Chat";
import PostEdit from "./components/PostEdit";
import Profile from "./components/Profile";
import Signup from "./components/Signup";

function App() {
  return (
    <div className="App">
      {/* 페이지 전환을 위한 routes 설정 */}
      <BrowserRouter>
        <Routes>
          {/* <Route path="/" element={<HomeTest />} /> */}
          <Route path="/" element={<Home />} />
          <Route path="/posting/*" element={<Posting />} />
          <Route path="/chatting/*" element={<Chatting />} />
          <Route path="/postEdit/*" element={<PostEdit />} />
          <Route path="/insert/*" element={<InsertDiary />} />
          <Route path="/checkMember" element={<KakaoRedirectLogin />} />
          <Route path="/kakaoLogout" element={<KakaoRedirectLogout />} />
          <Route path="/kakaoWithdraw" element={<KakaoRedirectWithdraw />} />
          <Route path="/myPage" element={<MyPage />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/signup" element={<Signup />} />
          <Route path={`/room/*`} element={<Chat />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
