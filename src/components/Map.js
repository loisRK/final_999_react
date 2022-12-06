/*global kakao*/
import "../css/Map.css";
import React, { useRef, useEffect, useState } from "react";
import chattingRooms from "../db/mockup.json";
import { useNavigate } from "react-router-dom";


function Map() {
  const [latitude, setLatitude] = useState(0); // 위도
  const [longitude, setLongitude] = useState(0); // 경도
  const navigate = useNavigate();

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


  useEffect(() => {
    // 페이지 로드 시 현재 위치 지정
    currentPosition();

    const options = {
      //지도를 생성할 때 필요한 기본 옵션
      // center: new window.kakao.maps.LatLng(33.450701, 126.570667), //지도의 중심좌표.
      center: new window.kakao.maps.LatLng(latitude, longitude), //지도의 현재 사용자 좌표.
      level: 3, //지도의 레벨(확대, 축소 정도)
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
      title: "현재 사용자의 위치"
    });

    map.setCenter(markerPosition);

    console.log(`latitude : ${latitude} + longitude : ${longitude}`);
    userMarker.setMap(map);
    // overlay.setMap(map);

    // 채팅방 마커 표시하기
    // 채팅방 목록을 가져와서 forEach로 마커 생성
    chattingRooms.forEach((element) => {
      console.log("위도 : " + element.latitude);
      console.log("경도 : " + element.longitude);
      console.log("태그 : " + element.tag);

      const tag = element.tag;
      const roomLatlng = new kakao.maps.LatLng(
        element.latitude,
        element.longitude
      );

      // 채팅방 마커 이미지 옵션
      const imageSrc = "bidulgi.png";
      const imageSize = new kakao.maps.Size(30, 30); // 마커이미지의 크기
      const imageOption = { offset: new kakao.maps.Point(27, 69) }; // 마커이미지의 옵션

      // 마커의 이미지 정보를 가지고 있는 마커이미지 생성
      const markerImage = new kakao.maps.MarkerImage(
        imageSrc,
        imageSize
        // imageOption
      );
      const marker = new kakao.maps.Marker({
        map: map,
        position: roomLatlng,
        title: tag,
        image: markerImage,
      });
    });

      // 카카오맵-오버레이 내용 지정
    var closeElement = document.createElement('div')
    closeElement.className = 'close';
    closeElement.id = 'close';
    closeElement.title = '닫기';
    closeElement.innerHTML = '<img src="https://cdn-icons-png.flaticon.com/512/5610/5610967.png" width="15" height="15">';

    var postingElement = document.createElement('li')
    postingElement.className = 'posting';
    postingElement.id = 'posting';
    postingElement.title = '포스팅';
    postingElement.innerHTML = '<img src="https://emojigraph.org/media/openmoji/feather_1fab6.png" width="15" height="15">';
    
    var content = document.createElement('div');
    content.className = 'overlaybox';
    content.innerHTML = 
    '    <div class="boxtitle">999' +
          '</div>' +
    '        <li class="posting">' +
    '            <span class="icon"><img src="https://emojigraph.org/media/openmoji/feather_1fab6.png" width="30" height="30"></span>' +
    '            <span class="title"><Link to={"/insert"}>깃털꽂기</Link></span>' +
    "        </li>" +
    '        <li class="chatting">' +
    '            <span class="icon"><img src="https://emojigraph.org/media/google/bug_1f41b.png" width="25" height="25"></span>' +
    '            <span class="title">먹이주기</span>' +
    "        </li>";
    content.appendChild(closeElement);
    content.appendChild(postingElement);

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
      zIndex: 1,
      clickable: true
    });

    // 지도에 클릭 이벤트를 등록합니다
    // 지도를 클릭하면 마지막 파라미터로 넘어온 함수를 호출합니다
    kakao.maps.event.addListener(map, "click", function (mouseEvent) {
      // 클릭한 위도, 경도 정보를 가져옵니다
      var latlng = mouseEvent.latLng;
      console.log("마우스 이벤트" + latlng);

      // 마커 위치를 클릭한 위치로 옮깁니다
      overlay.setPosition(latlng);
      overlay.setMap(map);
    });

    // 오버레이를 닫기 위해 호출되는 함수
    closeElement.onclick = function() {
      overlay.setMap(null);     
    }


    // posting으로 이동 함수
    postingElement.onclick = function() {
      navigate('/insert');
    }

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

  }, [latitude, longitude]);

  


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
