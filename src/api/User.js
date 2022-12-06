import axios from "axios";

// User 정보 불러오기 - GET
export const axiosUser = async (setUser) => {
  const token = window.localStorage.getItem("token");
  const response = await axios.get("http://localhost:8080/api/myPage", {
    headers: {
      Authorization: token,
    },
  });
  console.log("User.js : " + response.data);
  return response.data;
};
