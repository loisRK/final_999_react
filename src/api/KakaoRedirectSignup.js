import axios from "axios";

// 회원가입
export const axiosSignup = async (formData) => {
  // formdata 값 확인해 보는 법 !
  // for (let key of formData.keys()) {
  //   console.log("formdata확인" + key, ":", formData.get(key));
  // }
  const token = window.localStorage.getItem("token");

  axios
    .post(`http://13.231.10.66:8080/api/oauth/token`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: token,
      },
    })
    .then((res) => {
      console.log(res.headers.authorization);
      window.localStorage.setItem("token", res.headers.authorization);
      document.location.href = "/";
    });
};
