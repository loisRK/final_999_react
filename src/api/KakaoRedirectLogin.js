import axios from "axios";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const KakaoRedirectLogin = () => {
  const code = new URL(window.location.href).searchParams.get("code");
  console.log(code)

  // 로그인 성공시 MyPage로 이동시키기위해 useNavigate 사용
  const navigate = useNavigate();
  useEffect(() => {
    // 백엔드로부터 인가코드 넘기고 jwt 토큰 받기
    (async () => {
      try {
        const res = await axios
          // 백엔드 주소 뒤에 인가코드 붙여서 GET 설정
          // 백엔드는 이 주소를 통해 뒤에 붙여져있는 인가코드를 전달 받게 된다.
          .get(`http://localhost:8080/api/oauth/token?code=${code}`)
          // 백엔드 쪽에서 보내준 응답 확인
          .then((response) => {
            console.log("응답 확인", response);
            // 백엔드로부터 받아온 토큰을 token 변수에 저장
            const token = response.headers.authorization;
            // 토큰을 현재 서버의 로컬 스토리지에 저장
            window.localStorage.setItem("token", token);
            console.log("INSIDE AXIOS");
            navigate("/");
          });
      } catch (error) {
        // 에러 발생 시, 에러 응답 출력
        console.error("ERROR : " + error);
      }
    })();
  }, []);

  return (
    <div>
      <div>잠시만 기다려 주세요! 로그인 중입니다.</div>
    </div>
  );
};

export default KakaoRedirectLogin;
