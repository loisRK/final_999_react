import React from "react";

function MyPage() {
  const profile = window.localStorage.getItem("profile");
  console.log(profile);

  return (
    <div>
      <h1>myPage</h1>
      <div>{profile.data}</div>
    </div>
  );
}

export default MyPage;
