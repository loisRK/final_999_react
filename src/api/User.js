import axios from "axios";

// User 정보 불러오기 - GET
export const axiosUser = async () => {
  const token = window.localStorage.getItem("token");
  const response = await axios.get("http://localhost:8080/api/myPage", {
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

  await axios.put(`http://localhost:8080/api/updateUser/${userId}`, formData, {
    headers: {
      "Contest-Type": "multipart/form-data",
    },
  });
};
