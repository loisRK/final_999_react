import axios from "axios";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { REST_API_KEY, REDIRECT_URI } from "../components/KakaoLogoutData";

// // User 정보 보내기 - GET
// export const userWithdraw = async () => {
//   const token = window.localStorage.getItem("token");
//   const response = await axios
//     .get("http://localhost:8080/api/guguWithdraw", {
//       headers: {
//         Authorization: token,
//       },
//     })
//     .then((data) => {
//       if (data) {
//         window.localStorage.clear();
//         window.location.href = "/";
//         console.log("## DATA : " + data);
//       }
//     });
//   return response;
// };

const KakaoRedirectWithdraw = () => {
  // 우리 서버에서 발급한 jwt 토큰(id, nickname, access_token 정보 포함)
  const token = window.localStorage.getItem("token");

  useEffect(() => {
    (async () => {
      try {
        const res = await axios
          .get("http://localhost:8080/api/guguWithdraw", {
            headers: {
              Authorization: token,
            },
          })
          .then((data) => {
            if (data) {
              window.localStorage.clear();
              window.location.href = "/";
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
    <div>
      <div>잠시만 기다려 주세요! 회원탈퇴 중입니다.</div>
    </div>
  );
};

export default KakaoRedirectWithdraw;
