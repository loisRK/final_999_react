import axios from "axios";

// delete Diary - delete
export const axiosDeletePost = async (postNo) => {
  const response = await axios
    .delete(`http://localhost:8080/api/postDelete?postNo=${postNo}`)
    .then((document.location.href = `/posting`));
  return response.data;
};
