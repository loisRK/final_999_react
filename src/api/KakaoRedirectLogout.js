import axios from "axios";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { REST_API_KEY, REDIRECT_URI } from "../components/KakaoLogoutData";
import CircularProgress from "@mui/material/CircularProgress";

const KakaoRedirectHandler = () => {
  const navigate = useNavigate();
  // 우리 서버에서 발급한 jwt 토큰(id, nickname, access_token 정보 포함)
  const token = window.localStorage.getItem("token");
  //   console.log(token);

  useEffect(() => {
    (async () => {
      try {
        const res = await axios
          .get("https://api.dulgi.net/api/kakaoLogout", {
            headers: {
              Authorization: token,
            },
          })
          .then((data) => {
            if (data) {
              window.localStorage.clear();
              navigate("/");
              console.log("## DATA : " + data);
            }
          });
      } catch (error) {
        // 에러 발생 시, 에러 응답 출력
        console.error("KakaoRedirectHandler ERROR : " + error);
      }
    })();
  }, []);

  return (
    <div className="d_container">
      <div className="div_box">
        잠시만 기다려 주세요! 로그아웃 중입니다.
        <br />
        <br />
        <br />
        <CircularProgress color="inherit" />
      </div>
    </div>
  );
};

export default KakaoRedirectHandler;
