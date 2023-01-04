import axios from "axios";

// 서버에서 데이터 불러오기 - GET
export const fileData = async (diaryNo) => {
  const response = await axios.get(
    `https://api.dulgi.net/api/fileInfo?diaryno=${diaryNo}`
  );
  return response.data;
};

// file-download - GET
export const fileDownload = async (fileName) => {
  const response = await axios.get(
    `https://api.dulgi.net/api/file-download?fileName=${fileName}`
  );
  return response.data;
};

// file-upload - POST
// export const fileUpload = async (files) => {
//   const response = await axios.post(
//     "https://api.dulgi.net/api/fileUpload",
//     files
//   );
//   return response.data;
// };

// file 삭제
export const deleteFile = async (fileNo, diaryNo) => {
  console.log("fileNO" + fileNo);
  const response = await axios
    .get(`https://api.dulgi.net/api/deleteFile?fileNo=${fileNo}`)
    .then(window.location.replace(`/diaryEdit/${diaryNo}`));
  // .then((window.location.href = "/"));
  // return response.data;
};
