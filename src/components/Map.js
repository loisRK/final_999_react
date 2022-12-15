/*global kakao*/
import "../css/Map.css";
import React, { useRef, useEffect, useState } from "react";
// import chattingRooms from "../db/mockup.json";
import chattingRooms from "../db/room_mock.json";
import { useNavigate } from "react-router-dom";
import { axiosUser } from "../api/User";
import { axiosGetAllPosts, postData } from "../api/Post";
import io from "socket.io-client";
import {
  Snackbar,
  Alert,
  Button,
  Typography,
  Modal,
  Avatar,
} from "@mui/material";
import { Box } from "@mui/system";
import { roomList } from "../api/Chatting";
import ChatList from "./ChatList";

// 위도, 경도로 위치 계산해서 km로 반환하는 함수
function getDistanceFromLatLonInKm(lat1, lng1, lat2, lng2) {
  const socket = io.connect("https://server.bnmnil96.repl.co");
  function deg2rad(deg) {
    return deg * (Math.PI / 180);
  }

  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2 - lat1); // deg2rad below
  var dLon = deg2rad(lng2 - lng1);
  var a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c; // Distance in km
  return d;
}

function Map() {
  const [latitude, setLatitude] = useState(0); // 위도
  const [longitude, setLongitude] = useState(0); // 경도
  const [roomNo, setRoomNo] = useState(null);
  const [open, setOpen] = useState(false);
  const [errorOpen, setErrorOpen] = useState(false);
  const [posts, setPosts] = useState([]);
  const [username, setUsername] = useState("gugu");
  const [chatList, setChatList] = useState([]); // 채팅 리스트 전부 불러오기
  const [modalOpen, setModalOpen] = useState(false);
  const [postDetail, setPostDetail] = useState(null);

  const alertClick = () => {
    setOpen(!open);
  };

  const errorAlertClick = () => {
    setErrorOpen(!errorOpen);
  };

  const navigate = useNavigate();

  // navigator.geolocation 으로 Geolocation API 에 접근(사용자의 브라우저가 위치 정보 접근 권한 요청)
  // geolocation으로 현재 위치 가져오는 함수 (Geolocation.getCurrentPosition(success, error, [options]))
  const currentPosition = () => {
    // console.log("navigator.geolocation : " + navigator.geolocation);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        function (position) {
          setLatitude(position.coords.latitude);
          setLongitude(position.coords.longitude);
          // console.log(
          //   `latitude : ${position.coords.latitude} longitude : ${position.coords.longitude}`
          // );
        },
        function (error) {
          console.error(error);
        }
      );
    } else {
      console.log("GPS를 지원하지 않습니다.");
    }
  };

  useEffect(() => {
    const data = axiosUser();
    data.then((res) => setUsername(res.kakaoNickname));

    // 페이지 로드 시 현재 위치 지정
    currentPosition();

    const options = {
      //지도를 생성할 때 필요한 기본 옵션
      // center: new window.kakao.maps.LatLng(33.450701, 126.570667), //지도의 중심좌표.
      center: new window.kakao.maps.LatLng(latitude, longitude), //지도의 현재 사용자 좌표.
      level: 5, //지도의 레벨(확대, 축소 정도)
    };

    // 지도를 담을 영역 div tag를 id 값으로 지정
    const container = document.getElementById("map");

    // 지도 생성
    const map = new kakao.maps.Map(container, options);

    // // 사용자 위치 마커 이미지 옵션
    // const imageSrc = "bidulgi.png"; // 나중에 우리 비둘기 이미지로 변경
    // const imageSize = new kakao.maps.Size(50, 50); // 마커이미지의 크기
    // const imageOption = { offset: new kakao.maps.Point(27, 69) }; // 마커이미지의 옵션

    // // 마커의 이미지 정보를 가지고 있는 마커이미지 생성
    // const markerImage = new kakao.maps.MarkerImage(
    //   imageSrc,
    //   imageSize,
    //   imageOption
    // );

    // 사용자 마커 위치 지정
    // 임시로 현재 위치로 지정함
    const markerPosition = new kakao.maps.LatLng(latitude, longitude);
    const userMarker = new kakao.maps.Marker({
      map: map,
      position: markerPosition,
      // image: markerImage,
      title: "현재 사용자의 위치",
    });

    map.setCenter(markerPosition);

    // console.log(`latitude : ${latitude} + longitude : ${longitude}`);
    userMarker.setMap(map); // 마커 객체 생성 시, map 지정해줬으면 setMap 안해줘도 됨
    // overlay.setMap(map);

    // 포스팅 마커 표시하기
    const postsData = axiosGetAllPosts();
    // postsData.then((res) => console.log(res));
    postsData.then((res) => setPosts(res));

    posts.forEach((post) => {
      const postLatlng = new kakao.maps.LatLng(post.postLat, post.postLong);
      const postNo = post.postNo;

      // 포스트 마커 이미지 옵션
      const imageSrc = "feather.png";
      const imageSize = new kakao.maps.Size(30, 30); // 마커이미지의 크기
      const imageOption = { offset: new kakao.maps.Point(27, 69) }; // 마커이미지의 옵션

      // 포스트 마커의 이미지 정보를 가지고 있는 마커이미지 생성
      const postImage = new kakao.maps.MarkerImage(
        imageSrc,
        imageSize
        // imageOption
      );
      // 채팅방 마커 객체 생성
      const postMarkers = new kakao.maps.Marker({
        map: map,
        position: postLatlng,
        image: postImage,
        title: postNo,
      });

      // 포스트 마커 클릭시 modal 띄우기
      kakao.maps.event.addListener(postMarkers, "click", function (mouseEvent) {
        const onePost = postData(postNo);
        onePost.then((res) => setPostDetail(res));
        setModalOpen(true);
      });
    });

    const chatData = roomList();
    chatData.then((response) => console.log(response));
    chatData.then((response) => setChatList(response));

    // 채팅방 마커 표시하기
    // 채팅방 목록을 가져와서 forEach로 마커 생성
    chatList.forEach((room) => {
      // console.log("위도 : " + room.latitude);
      // console.log("경도 : " + room.longitude);
      // console.log("태그 : " + room.tag);

      const tag = room.tag;
      const roomsLatlng = new kakao.maps.LatLng(room.chatLat, room.chatLong);

      // 채팅방 마커 이미지 옵션
      const imageSrc = "bidulgi.png";
      const imageSize = new kakao.maps.Size(50, 50); // 마커이미지의 크기
      const imageOption = { offset: new kakao.maps.Point(27, 69) }; // 마커이미지의 옵션

      // 채팅방 마커의 이미지 정보를 가지고 있는 마커이미지 생성
      const markerImage = new kakao.maps.MarkerImage(
        imageSrc,
        imageSize
        // imageOption
      );
      // 채팅방 마커 객체 생성
      const roomMarkers = new kakao.maps.Marker({
        map: map,
        position: roomsLatlng,
        title: room.roomNo,
        image: markerImage,
        client: room.userCnt,
      });

      // 채팅방 마커 클릭시 오버레이 띄우기
      kakao.maps.event.addListener(roomMarkers, "click", function (mouseEvent) {
        overlay.setMap(null);
        const roomMarker = roomMarkers;
        roomEnter(roomMarker, room); // 입장하는 함수에 room의 정보를 전달하기 위해 room도 전달
      });
    });


    // 채팅방 입장 오버레이 내용 지정 -> 초기값 지정
    var enterElement = document.createElement("div");
    enterElement.className = "enteroveray";
    enterElement.innerHTML = `<div class="boxtitle">입장하기</div>`;

    // 채팅방 입장 오버레이 내용 지정
    var blockElement = document.createElement("div");
    blockElement.className = "blockoveray";
    blockElement.innerHTML = '<div class="boxtitle">입장불가</div>';

    // 채팅방 입장 오버레이 생성
    var enterOverlay = new kakao.maps.CustomOverlay({
      position: null,
      content: enterElement,
      title: enterElement,
      xAnchor: 0.5,
      yAnchor: 2.3,
      zIndex: 2,
      clickable: true,
    });

    // 채팅방 오버레이 (채팅방 입장)
    function roomEnter(roomMarker, room) {
      const roomPosition = roomMarker.getPosition();

      // 클릭한 채팅방의 마커 위치와 사용자의 위치 거리 계산
      const distance = getDistanceFromLatLonInKm(
        latitude,
        longitude,
        roomPosition.Ma,
        roomPosition.La
      );
      console.log("선택한 채팅방과의 거리 : " + distance + "km");
      

      const roomLatlng = new kakao.maps.LatLng(
        roomPosition.Ma,
        roomPosition.La
      );
      var latlng = roomLatlng;

      // 받아온 room의 정보를 보여주기 위해 enterElement에 값을 다시 선언
      var enterElement = document.createElement("div");
      enterElement.className = "enteroveray";
      enterElement.innerHTML = `<div class="boxtitle">${room.title}<br/>${room.userCnt}명<br/>입장하기</div>`;

      if (distance <= 1) {
        enterOverlay.setContent(enterElement);
      } else {
        enterOverlay.setContent(blockElement);
      }
      enterOverlay.setPosition(latlng);
      enterOverlay.setMap(map);

      // enterElement를 클릭했을 때 실행될 함수
      enterElement.onclick = function () {
        const roomNo = roomMarker.getTitle();
        console.log("ROOM NO : " + roomNo);
        // ******************* 방으로 이동하는 함수 추가하기!!!!!!!!!! *******************
        navigate(`/room?roomNo=${roomNo}`);
        // ******************* 방 인원수 +1 하기 axios 함수 추가!!!!! ********************
      };
    }

    // 카카오맵-오버레이 내용 지정
    var closeElement = document.createElement("div");
    closeElement.className = "close";
    closeElement.id = "close";
    closeElement.title = "닫기";
    closeElement.innerHTML =
      '<img src="https://cdn-icons-png.flaticon.com/512/5610/5610967.png" width="15" height="15">';

    var postingElement = document.createElement("li");
    postingElement.className = "posting";
    postingElement.id = "posting";
    postingElement.title = "포스팅 작성";
    postingElement.innerHTML =
      '<span class="icon"><img src="https://emojigraph.org/media/openmoji/feather_1fab6.png" width="30" height="30"></span>' +
      '            <span class="title"><Link to={"/insert"}>깃털꽂기</Link></span>';

    var chattingElement = document.createElement("li");
    chattingElement.className = "chatting";
    chattingElement.id = "chatting";
    chattingElement.title = "채팅방 생성";
    chattingElement.innerHTML =
      '<span class="icon"><img src="https://emojigraph.org/media/google/bug_1f41b.png" width="25" height="25"></span>' +
      '            <span class="title">먹이주기</span>';

    var content = document.createElement("div");
    content.className = "overlaybox";
    content.innerHTML = "    <div class=boxtitle>999</div>";
    // '        <li class="posting">' +
    // '            <span class="icon"><img src="https://emojigraph.org/media/openmoji/feather_1fab6.png" width="30" height="30"></span>' +
    // '            <span class="title"><Link to={"/insert"}>깃털꽂기</Link></span>' +
    // "        </li>" +
    // '        <li class="chatting">' +
    // '            <span class="icon"><img src="https://emojigraph.org/media/google/bug_1f41b.png" width="25" height="25"></span>' +
    // '            <span class="title">먹이주기</span>' +
    // "        </li>";
    content.appendChild(closeElement);
    content.appendChild(postingElement);
    content.appendChild(chattingElement);

    // var content =
    // '<div class="overlaybox">' +
    // '    <div class="boxtitle">999' +
    // '            <div class="close" onclick="closeOverlay()" title="닫기">' +
    // '               <img src="https://cdn-icons-png.flaticon.com/512/5610/5610967.png" width="15" height="15">' +
    // '           </div>' +
    //       '</div>' +
    // '        <li class="posting">' +
    // '            <span class="icon"><img src="https://emojigraph.org/media/openmoji/feather_1fab6.png" width="30" height="30"></span>' +
    // '            <span class="title">깃털꽂기</span>' +
    // "        </li>" +
    // '        <li class="chatting">' +
    // '            <span class="icon"><img src="https://emojigraph.org/media/google/bug_1f41b.png" width="25" height="25"></span>' +
    // '            <span class="title">먹이주기</span>' +
    // "        </li>" +
    // "</div>";

    // 오버레이 생성
    var overlay = new kakao.maps.CustomOverlay({
      position: markerPosition,
      content: content,
      xAnchor: 0.3,
      yAnchor: 0.91,
      zIndex: 3,
      clickable: true,
    });

    // 지도에 클릭 이벤트를 등록합니다
    // 지도를 클릭하면 마지막 파라미터로 넘어온 함수를 호출합니다
    kakao.maps.event.addListener(map, "click", function (mouseEvent) {
      enterOverlay.setMap(null);
      // 클릭한 위도, 경도 정보를 가져옵니다
      var latlng = mouseEvent.latLng;
      console.log("마우스 이벤트" + latlng);
      // 마커 위치를 클릭한 위치로 옮깁니다

      // 클릭한 마커 위치와 사용자의 위치 거리 계산
      const mouseDistance = getDistanceFromLatLonInKm(
        latitude,
        longitude,
        latlng.Ma,
        latlng.La
      );

      if (mouseDistance > 1) {
        overlay.setMap(null);
        enterOverlay.setMap(null);
        console.log("거리범위 초과" + mouseDistance);
        errorAlertClick();
      } else {
        overlay.setPosition(latlng);
        overlay.setMap(map);
      }
    });

    // 오버레이를 닫기 위해 호출되는 함수
    closeElement.onclick = function () {
      overlay.setMap(null);
    };

    // posting으로 이동 함수
    postingElement.onclick = function () {
      let token = window.localStorage.getItem("token");

      console.log("TOKEN : " + token);
      console.log("OPEN : " + open); // false

      if (token !== null) {
        var roomPosition = overlay.getPosition();
        navigate(`/insert?lat=${roomPosition.Ma}&long=${roomPosition.La}`);
      } else {
        alertClick();
        console.log("??? :" + open);
      }
      // {
      //   token !== null
      //     ? navigate(`/insert?lat=${latitude}&long=${longitude}`)
      //     : setOpen(true);
      //   console.log("INSIDE FALSE STATEMENT: " + open);
      // }
      console.log(open); // true
    };

    // Chatting으로 이동 함수
    chattingElement.onclick = function () {
      navigate("/chatting");
    };

    // Chatting으로 이동 함수
    chattingElement.onclick = function () {
      var roomPosition = overlay.getPosition();
      navigate(
        `/chatting?latitude=${roomPosition.Ma}&longitude=${roomPosition.La}`
      );
    };

    // 오버레이 클릭시 자동으로 닫는 함수(v1)
    // content.onclick = function() {
    //   overlay.setMap(null);
    // }

    // 원본 코드(origin)
    // var closeOverlay = function() {
    //   overlay.setMap(null);
    // }

    // 웹브라우저 사이즈 크기에 따라서 지도의 중심값 변경
    function mapResize() {
      map.relayout();
      map.setCenter(markerPosition);
    }

    // 웹브라우저의 사이즈가 변경될 때 마다 함수 실행
    window.onresize = mapResize;

    // 사용자의 위치를 기준으로 원 생성
    // 원 객체를 생성합니다

    var circle = new kakao.maps.Circle({
      center: markerPosition, // 원의 중심좌표입니다
      radius: 1000, // 원의 반지름입니다 m 단위 이며 선 객체를 이용해서 얻어옵니다
      strokeWeight: 1, // 선의 두께입니다
      strokeColor: "#00a0e9", // 선의 색깔입니다
      strokeOpacity: 0.1, // 선의 불투명도입니다 0에서 1 사이값이며 0에 가까울수록 투명합니다
      strokeStyle: "solid", // 선의 스타일입니다
      fillColor: "#00a0e9", // 채우기 색깔입니다
      fillOpacity: 0.2, // 채우기 불투명도입니다
    });
    circle.setMap(map);
    // gps 버튼 동작
    const gps = document.getElementById("gps_bnt");
    gps.addEventListener("click", () => {
      console.log("gps 작동");
      currentPosition();
      map.setCenter(markerPosition);
    });
  }, [latitude, longitude, posts.length, chatList.length]);

  return (
    <div>
      <div>
        {/* <Button onClick={() =>{setModalOpen(true)}}>Open modal</Button> */}
        <Modal
          open={modalOpen}
          onClose={() => {
            setModalOpen(false);
          }}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 400,
              bgcolor: "white",
              border: "2px solid #000",
              boxShadow: 24,
              p: 4,
            }}
          >
            {postDetail === null ? (
              <></>
            ) : (
              <div>
                <Typography
                  id="modal-modal-title"
                  variant="h6"
                  component="h2"
                ></Typography>
                <Avatar
                  className="profile_img"
                  src={postDetail.userDTO.kakaoProfileImg}
                  width="100px"
                  height="100px"
                />
                <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                  {postDetail.userDTO.kakaoNickname}
                </Typography>
                <span className="post_detail">
                  @{postDetail.userDTO.kakaoNickname}
                </span>
                &nbsp;
                <span className="post_detail">{postDetail.postDate}</span>&nbsp;
                <span className="post_detail">post#{postDetail.postNo}</span>
                &nbsp;
                <div className="post_content">{postDetail.postContent}</div>
                {postDetail.postImg === "" ? (
                  <></>
                ) : (
                  <img
                    className="post_img"
                    src={`/img/${postDetail.postImg}`}
                  />
                )}
              </div>
            )}
          </Box>
        </Modal>
      </div>

      <div className="map_wrap" style={{ position: "relative" }}>
        <div
          id="map"
          className="map"
          style={{ width: `"${window.innerWidth}"`, height: "500px" }}
        >
          <img id="gps_bnt" className="gps_bnt" src="gps.png" />
        </div>
      </div>

      <div>
        {/* <MyPage map = {propMap}/> */}
        <Snackbar
          className="mapAlert"
          anchorOrigin={{
            vertical: "top",
            horizontal: "center",
          }}
          open={open}
          autoHideDuration={2000}
          onClose={alertClick}
        >
          <Alert severity="success" sx={{ width: "100%" }}>
            로그인이 필요한 기능입니다.
          </Alert>
        </Snackbar>

        <Snackbar
          className="mapAlert"
          anchorOrigin={{
            vertical: "top",
            horizontal: "center",
          }}
          open={errorOpen}
          autoHideDuration={2000}
          onClose={errorAlertClick}
        >
          <Alert severity="error" sx={{ width: "100%" }}>
            1km 밖에서는 이용 불가
          </Alert>
        </Snackbar>
      </div>
    </div>
  );
}

export default Map;