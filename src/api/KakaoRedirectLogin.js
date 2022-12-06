import axios from "axios";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const KakaoRedirectHandler = () => {
  const code = new URL(window.location.href).searchParams.get("code");

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
          });
      } catch (error) {
        // 에러 발생 시, 에러 응답 출력
        console.error("ERROR : " + error);
      }

      // 위에서 setItem 을 사용하여 내부에 저장시킨 토크을 다시 불러온다.
      // 이때, 내부 저장소에서 가져온 토큰을 다시 token 이라는 변수에 담는다.
      const token = window.localStorage.getItem("token");
      // const token = window.localStorage.getItem("token").split(" ")[1];
      console.log("TOKEN : " + token);

      // var base64Payload = token.split(".")[1];
      // var payload = Buffer.from(base64Payload, "base64");
      // var result = JSON.parse(payload.toString());
      // console.log("RESULT : " + payload.toString());
      // console.log("RESULT : " + result);

      // 백엔드로 토큰 다시 넘기기
      try {
        const res = await axios
          // 이때, post가 아닌 get으로 접근한다.
          // 접근 주소는 백엔드에서 설정한 주소로 한다.
          .get("http://localhost:8080/api/myPage", {
            // 헤더값에는 받아온 토큰을 Authorization과 request 에 담아서 보낸다/
            headers: {
              Authorization: token,
              request: token,
            },
          })
          // 위에서 백엔드가 토큰을 잘받고 처리해서 유저정보를 다시 넘겨준다면, 그 응답을 처리한다.
          // data 라는 변수에 유저 정보를 저장하고, setItem을 사용해 로컬에 다시 저장한다.
          .then((data) => {
            window.localStorage.setItem("profile", data);
            // console.log("DATA : " + data.json());
            // console.log("BODY : " + data.body);
            // 만약, 유저정보를 잘 불러왔다면 navigate를 사용해 프론트엔드에서 설정한 마이페이지 경로를 설정해서 이동시킨다.
            if (data) {
              navigate("/");
              // navigate("/myPage");
            }
          });
      } catch (e) {
        // 에러 발생 시, 에러 응답 출력
        console.error(e);
      }
    })();
  }, []);

  return (
    <div>
      <div>잠시만 기다려 주세요! 로그인 중입니다.</div>
    </div>
  );
};

export default KakaoRedirectHandler;
