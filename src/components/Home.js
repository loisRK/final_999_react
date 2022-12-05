import "../App.css";
import { Link } from "react-router-dom";
import Map from "./Map";
import { useEffect, useState } from "react";
import { Box, Button, Modal, Typography } from "@mui/material";
import { KAKAO_AUTH_URL } from "./KakaoLoginData";
import kakao_login from "../img/kakao_login.png";
import kakao_login_medium_wide from "../img/kakao_login_medium_wide.png";
import KakaoRedirectHandler from "../api/KakaoRedirectHandler";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const handleLogin = () => {
  window.location.href = KAKAO_AUTH_URL;
};

const logout = () => {};

function Home() {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <h1>999.com</h1>
      <br />
      {window.localStorage.getItem("token") === null ? (
        <Button onClick={() => setOpen(true)}>Login</Button>
      ) : (
        <Button onClick={logout}>Logout</Button>
      )}
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            999에 로그인하기
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            <input placeholder="아이디"></input> <br />
            <input type={"password"} placeholder="비밀번호"></input> <br />
            <button type="submit">Login</button>
            <img
              src={kakao_login_medium_wide}
              alt="kakao_login"
              onClick={handleLogin}
            />
          </Typography>
        </Box>
      </Modal>
      <Link to={"/posting"}>Post</Link>
      <h2 className="map">Map</h2>
      <Map />
    </div>
  );
}

export default Home;
