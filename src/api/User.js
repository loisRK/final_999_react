import axios from "axios";
import { useNavigate } from "react-router-dom";

// User 정보 불러오기 - GET
export const axiosUser = async () => {
  const token = window.localStorage.getItem("token");
  const response = await axios.get("https://api.dulgi.net/api/myPage", {
    headers: {
      Authorization: token,
    },
  });
  console.log("User.js : " + response.data);
  return response.data;
};

// User 정보 수정 - PUT
export const axiosUserUpdate = async (userId, formData) => {
  console.log("axiosUserUpdate" + userId);

  await axios.put(`https://api.dulgi.net/api/updateUser/${userId}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

// User 정보 보내기 - GET
export const userWithdraw = async () => {
  const token = window.localStorage.getItem("token");
  const response = await axios
    .get("https://api.dulgi.net/api/guguWithdraw", {
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
  return response;
};
