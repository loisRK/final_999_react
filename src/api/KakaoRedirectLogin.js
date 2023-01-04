import axios from "axios";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";

const KakaoRedirectLogin = () => {
  const code = new URL(window.location.href).searchParams.get("code");
  // console.log(code);

  // 로그인 성공시 MyPage로 이동시키기위해 useNavigate 사용
  const navigate = useNavigate();

  useEffect(() => {
    // 백엔드로부터 인가코드 넘기고 jwt 토큰 받기
    (async () => {
      const res = await axios
        // 백엔드 주소 뒤에 인가코드 붙여서 GET 설정
        // 백엔드는 이 주소를 통해 뒤에 붙여져있는 인가코드를 전달 받게 된다.
        .get(`https://api.dulgi.net/api/checkMember?code=${code}`)
        .then((response) => {
          // console.log("응답 확인", response);
          // 백엔드로부터 받아온 토큰을 token 변수에 저장
          const key = response.headers.key;
          const token = response.headers.authorization;

          window.localStorage.setItem("token", token);

          {
            key === "signup"
              ? navigate("/signup") // 회원가입 페이지 띄우기
              : navigate("/"); // 로그인 끝
          }
        });
    })();
  }, []);

  return (
    <div className="d_container">
      <div className="div_box">
        잠시만 기다려 주세요! 로그인 중입니다.
        <br />
        <br />
        <br />
        <CircularProgress color="inherit" />
      </div>
    </div>
  );
};

export default KakaoRedirectLogin;
