/*global kakao*/
import "../css/Map.css";
import React, { useRef, useEffect, useState } from "react";
import chattingRooms from "../db/mockup.json";

function Map() {
  const [latitude, setLatitude] = useState(0); // 위도
  const [longitude, setLongitude] = useState(0); // 경도

  // navigator.geolocation 으로 Geolocation API 에 접근(사용자의 브라우저가 위치 정보 접근 권한 요청)
  // geolocation으로 현재 위치 가져오는 함수 (Geolocation.getCurrentPosition(success, error, [options]))
  const currentPosition = () => {
    console.log("navigator.geolocation : " + navigator.geolocation);
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

  // 카카오맵-오버레이 내용 지정
  const content =
    '<div class="overlaybox">' +
    '    <div class="boxtitle">999</div>' +
    '        <li class="posting">' +
    '            <span class="icon"><img src="https://emojigraph.org/media/openmoji/feather_1fab6.png" width="30" height="30"></span>' +
    '            <span class="title">깃털꽂기</span>' +
    "        </li>" +
    '        <li class="chatting">' +
    '            <span class="icon"><img src="https://emojigraph.org/media/google/bug_1f41b.png" width="25" height="25"></span>' +
    '            <span class="title">먹이주기</span>' +
    "        </li>" +
    "    </ul>" +
    "</div>";

  useEffect(() => {
    // 페이지 로드 시 현재 위치 지정
    currentPosition();

    const options = {
      //지도를 생성할 때 필요한 기본 옵션
      // center: new window.kakao.maps.LatLng(33.450701, 126.570667), //지도의 중심좌표.
      center: new window.kakao.maps.LatLng(latitude, longitude), //지도의 현재 사용자 좌표.
      level: 3, //지도의 레벨(확대, 축소 정도)
    };

    // const container = useRef(null); //지도를 담을 영역의 DOM 레퍼런스
    // 지도를 담을 영역 div tag를 id 값으로 지정
    const container = document.getElementById("map");

    // 지도 생성
    const map = new kakao.maps.Map(container, options);

    // 마커 이미지 옵션
    const imageSrc = "bidulgi.png"; // 나중에 우리 비둘기 이미지로 변경
    const imageSize = new kakao.maps.Size(50, 50); // 마커이미지의 크기
    const imageOption = { offset: new kakao.maps.Point(27, 69) }; // 마커이미지의 옵션

    // 마커의 이미지 정보를 가지고 있는 마커이미지 생성
    const markerImage = new kakao.maps.MarkerImage(
      imageSrc,
      imageSize,
      imageOption
    );

    // 마커 위치 지정
    // 임시로 현재 위치로 지정함
    const markerPosition = new kakao.maps.LatLng(latitude, longitude);
    const marker = new kakao.maps.Marker({
      map: map,
      position: markerPosition,
      image: markerImage,
    });

    // 오버레이 생성
    const overlay = new kakao.maps.CustomOverlay({
      position: markerPosition,
      content: content,
      xAnchor: 0.3,
      yAnchor: 0.91,
    });
    map.setCenter(markerPosition);

    console.log(`latitude : ${latitude} + longitude : ${longitude}`);
    // setMap(new window.kakao.maps.Map(container.current, options)); //지도 생성 및 객체 리턴
    // return () => {};
    // marker.setMap(map);
    overlay.setMap(map);

    // 채팅방 마커 표시하기
    // 채팅방 목록 가져오기
    chattingRooms.forEach((element) => {
      console.log("위도 : " + element.latitude);
      console.log("경도 : " + element.longitude);
      console.log("태그 : " + element.tag);

      const tag = element.tag;
      const roomLatlng = new kakao.maps.LatLng(
        element.latitude,
        element.longitude
      );
      const marker = new kakao.maps.Marker({
        map: map,
        position: roomLatlng,
        title: tag,
      });
    });
  }, [latitude, longitude]);

  // 인포윈도우를 표시하는 클로저를 만드는 함수입니다
  function makeOverListener(map, marker, infowindow) {
    return function () {
      infowindow.open(map, marker);
    };
  }

  // 인포윈도우를 닫는 클로저를 만드는 함수입니다
  function makeOutListener(infowindow) {
    return function () {
      infowindow.close();
    };
  }

  return (
    <div
      id="map"
      className="map"
      style={{ width: `"${window.innerWidth}"`, height: "500px" }}
      //   ref={container}
    ></div>
  );
}

export default Map;
