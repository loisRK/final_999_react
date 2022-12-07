import { Grid } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { axiosUser } from "../api/User";
import Avatar from "@mui/material/Avatar";
import "../css/MyPage.css";

function MyPage() {
  const [nickname, setNickname] = useState("gugu");
  const [profileImg, setProfileImg] = useState("../img/dulgi.jpg");
  const [email, setEmail] = useState("gugu@999.com");

  useEffect(() => {
    const data = axiosUser();
    data.then((res) => setNickname(res.kakaoNickname));
    data.then((res) => setProfileImg(res.kakaoProfileImg));
    data.then((res) => setEmail(res.kakaoEmail));
  }, []);

  return (
    <div>
      <Grid
        container
        direction="column"
        justifyContent="space-evenly"
        alignItems="stretch"
      >
        <h1>myPage</h1>
      </Grid>
      <Grid
        container
        direction="column"
        justifyContent="space-evenly"
        alignItems="center"
      >
        <div>
          <Avatar
            // className="profileImg"
            alt="gugu"
            src={profileImg}
            sx={{ width: 100, height: 100 }}
          />
        </div>
        <h3>{nickname}</h3>
        {email}
      </Grid>
      <Grid
        container
        direction="column"
        justifyContent="space-evenly"
        alignItems="stretch"
      >
        <Link to={"/"}>Home</Link>
      </Grid>
    </div>
  );
}

export default MyPage;
