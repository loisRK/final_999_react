import axios from "axios";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { REST_API_KEY, REDIRECT_URI } from "../components/KakaoLogoutData";

const KakaoRedirectHandler = () => {
  const navigate = useNavigate();
  // 우리 서버에서 발급한 jwt 토큰(id, nickname, access_token 정보 포함)
  const token = window.localStorage.getItem("token");
  //   console.log(token);

  useEffect(() => {
    (async () => {
      try {
        const res = await axios
          .get("http://localhost:8080/api/kakaoLogout", {
            headers: {
              Authorization: token,
            },
          })
          .then((data) => {
            console.log("## DATA : " + data);
            if (data) {
              window.localStorage.clear();
              navigate("/");
              console.log("## DATA : " + data);
            }
          });
      } catch (error) {
        // 에러 발생 시, 에러 응답 출력
        console.error("ERROR : " + error);
      }
    })();
  }, []);

  return (
    <div>
      <div>잠시만 기다려 주세요! 로그아웃 중입니다.</div>
    </div>
  );
};

export default KakaoRedirectHandler;
