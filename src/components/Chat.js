import { useEffect } from "react";
import { useState } from "react";
import * as React from "react";
import { Avatar } from "@mui/material";
import { Button } from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import PopupState, { bindTrigger, bindMenu } from "material-ui-popup-state";
import io from "socket.io-client";
import { axiosUser } from "../api/User";
import { useSearchParams } from "react-router-dom";

// 내가 만든 firebase의 프로젝트의 URL 이다.
// const databaseURL = "https://test-project-c773d-default-rtdb.firebaseio.com/";

const options = [
  "None",
  "Atria",
  "Callisto",
  "Dione",
  "Ganymede",
  "Hangouts Call",
  "Luna",
  "Oberon",
  "Phobos",
  "Pyxis",
  "Sedna",
  "Titania",
  "Triton",
  "Umbriel",
];

const ITEM_HEIGHT = 48;
// const socket = io.connect("http://192.168.0.25:9999");
const socket = io.connect("https://server.bnmnil96.repl.co");

// const Chat = ({ socket, room, username }) => {
const Chat = () => {
  const [message, setMessage] = useState("");
  const [messageList, setMessageList] = useState([]);
  const [username, setUsername] = useState("gugu");
  const [profileImg, setProfileImg] = useState("../img/dulgi.jpg");
  const [clients, setClients] = useState("");

  const [search, setSearch] = useSearchParams();
  const room = search.get("roomNo");

  // 상대방이 보낸 메세지를 신호를 감지해 내 리스트에 추가하여 말풍선을 뿌려주는 함수.
  useEffect(() => {
    socket.on("messageReturn", (data) => {
      // console.log(data);
      setMessageList((prev) => [...prev, data]);
    });

    const data = axiosUser();
    data.then((res) => setUsername(res.kakaoNickname));
    data.then((res) => setProfileImg(res.kakaoProfileImg));
  }, [socket]);

  // // 첫 입장시 데이터 정보 저장.
  useEffect(() => {
    console.log("CHATTING # : " + room);
    socket.emit("room", room);
    socket.on("clients", (data) => {
      console.log(data);
      setClients(data);
    });
  }, [room]);

  // 룸의 입장 인원을 카운트해주는 함수
  useEffect(() => {
    socket.on("clients", (data) => {
      console.log(data);
      setClients(data);
    });
  }, [socket]);

  // 새로운 채팅이 생성되면 스크롤를 최하단으로 내려줌.
  useEffect(() => {
    let chat = document.querySelector("#chat");
    chat.scrollTop = chat.scrollHeight;
  }, [messageList]);

  // 내 리스트에 message data 추가 후
  // 소켓에 message data를 담아 서버에 전달 !
  const sendMessage = async () => {
    const messageContent = {
      username: username,
      message: message,
      room: room,
      date: new Date().toLocaleString(), // 2022. 12. 7. 오전 11:24:42
      // new Date(Date.now()).getHours() +
      // ":" +
      // new Date(Date.now()).getMinutes(),
    };
    // messageContent 값이 먼저 정의 된 후 메세지 전달.
    await socket.emit("message", messageContent);

    // firebase data base에도 값 추가
    // messageUpdate(messageContent);

    // 메세지 리스트에 방금 보낸 메세지도 함께 추가.
    setMessageList((prev) => [...prev, messageContent]);
    setMessage("");
  };

  const onKeyPress = (e) => {
    if (message != "") {
      if (e.key === "Enter") {
        sendMessage();
      } else {
        setMessage(e.target.value);
      }
    }
  };

  console.log("messageList", messageList);

  // mui 적용

  return (
    // items-center justify-center
    <div className="flex flex-col h-fit ">
      <div className="w-full h-screen bg-white relative overflow-y-auto">
        <div className="w-full h-16 bg-gray-700 flex items-center p-3">
          {/* <div className="w-12 h-12 bg-white rounded-full"></div> */}
          {/* 프로필 지정 */}
          <Avatar alt={username} src={profileImg} className="w-12 h-12" />
          <div className="m-5 text-white">
            {clients !== "" ? (
              <div className="flex">{`${clients} 명`}</div>
            ) : (
              <></>
            )}
            <div className="flex">
              <div>#민기짱</div> &nbsp;
              <div>#민기천재</div> &nbsp;
              <div>#민기훈남</div> &nbsp;
            </div>
          </div>
          <a
            href="/"
            className="ml-auto text-white w-14 bg-gray-600 text-white h-8 rounded-xl"
          >
            EXIT
          </a>
        </div>
        <div id="chat" className="w-auto h-[80%] overflow-y-auto">
          {messageList &&
            messageList.map((msg, i) => (
              <PopupState key={i} variant="popover" popupId="demo-popup-menu">
                {(popupState) => (
                  <React.Fragment key={i}>
                    {/* {username === msg.username ? ( */}
                    {/* <div className="flex"> */}
                    {username !== msg.username ? (
                      <div
                        className={
                          // username === msg.username
                          //   ? "flex justify-end text-xs mr-4 font-semibold"
                          "flex text-xs m-3 font-semibold"
                        }
                      >
                        {msg.username}
                      </div>
                    ) : (
                      <></>
                    )}
                    <div
                      key={i}
                      className={`${
                        username === msg.username ? "flex justify-end" : ""
                      }`}
                      variant="contained"
                      {...bindTrigger(popupState)}
                    >
                      <div
                        className={` ${
                          username === msg.username
                            ? "bg-green-600 rounded-xl rounded-tr-none"
                            : "bg-blue-600 rounded-xl rounded-tl-none"
                        } max-w-[30%] h-auto p-2 text-white m-2 w-auto `}
                      >
                        <div className="flex">{msg.message}</div>
                      </div>
                    </div>

                    <Menu {...bindMenu(popupState)}>
                      <box
                        component="MenuItem"
                        sx={{ display: "inline" }}
                        onClick={popupState.close}
                      >
                        🤐
                      </box>
                      <box
                        component="MenuItem"
                        sx={{ display: "inline" }}
                        onClick={popupState.close}
                      >
                        🚨
                      </box>
                    </Menu>
                  </React.Fragment>
                )}
              </PopupState>
            ))}
        </div>
      </div>
      <div className="absolute bottom-0 left-0 w-full h-[10%]">
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-3/4 h-12 border p-3 outline-none rounded-xl"
          type="text"
          placeholder="message send"
          onKeyPress={onKeyPress}
        />
        {message != "" ? (
          <button
            onClick={sendMessage}
            className="w-1/4 bg-indigo-600 text-white h-12 hover-opacity-70 rounded-xl"
          >
            SEND
          </button>
        ) : (
          <button className="w-1/4 bg-indigo-600 text-white h-12 hover-opacity-70 rounded-xl">
            SEND
          </button>
        )}
      </div>
    </div>
  );
};

export default Chat;
