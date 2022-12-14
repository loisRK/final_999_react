import { useEffect } from "react";
import { useState } from "react";
import * as React from "react";
import Menu from "@mui/material/Menu";
import PopupState, { bindTrigger, bindMenu } from "material-ui-popup-state";
import io from "socket.io-client";
import { axiosUser } from "../api/User";
import { useSearchParams, Link, useInRouterContext } from "react-router-dom";
import {
  report,
  roomInfo,
  client_out,
  insert_taboo,
  alltabooList,
  deleteTaboo,
  deleteRoom,
} from "../api/Chatting";
import flyGugu from "../img/cutyDulgi.jpg";
import gugueyes from "../img/gugugu.png";
import {
  AppBar,
  Avatar,
  Box,
  Button,
  getButtonGroupUtilityClass,
  Grid,
  IconButton,
  Modal,
  TextField,
  Toolbar,
  Tooltip,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Alert,
} from "@mui/material";
import Snackbar from "@mui/material/Snackbar";
import CancelIcon from "@mui/icons-material/Cancel";
import {
  messageData,
  messageUpdate,
  dulgiInsert,
  dulgiList,
  kickList,
  dulgiKick,
  deleteDulgi,
} from "../api/Firebase";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import Paper from "@material-ui/core/Paper";
import { Input } from "postcss";

// 내가 만든 firebase의 프로젝트의 URL 이다.
// const databaseURL = "https://test-project-c773d-default-rtdb.firebaseio.com/";

// const socket = io.connect("http://192.168.0.147:9999");
// const socket = io.connect("http://192.168.0.13:9999");
// const socket = io.connect("http://192.168.0.25:9999");
const socket = io.connect("https://server.bnmnil96.repl.co");
// aws ec2 server
// const socket = io.connect("https://52.197.104.112:5000");

// const Chat = ({ socket, room, username }) => {
const Chat = () => {
  const [message, setMessage] = useState("");
  const [messageList, setMessageList] = useState([]);
  const [username, setUsername] = useState("gugu");
  const [profileImg, setProfileImg] = useState("../img/dulgi.jpg");
  const [ownerName, setOwnerName] = useState("");
  const [ownerProfileImg, setOwnerProfileImg] = useState("../img/dulgi.jpg");
  const [clients, setClients] = useState("");
  const [tags, setTags] = useState("");
  const [profileInfo, setProfileInfo] = useState(false);
  const [index, setIndex] = useState("");
  const [kakaoId, setKakaoId] = useState("");
  const [host, setHost] = useState("");
  const [taboo, setTaboo] = useState(false);
  const [tabooWord, setTabooWord] = useState("");
  const [tabooList, setTabooList] = useState([]);
  const [clientKey, setClientKey] = useState([]);
  const [clientList, setClientList] = useState([]);
  const [del, setDel] = useState(false);
  const [clear, setClear] = useState(false);
  const [alertStatus, setAlertStatus] = useState(false);
  const [alerts, setAlerts] = useState(false);
  const [visitor, setVisitor] = useState("");
  const [outGoing, setOutGoing] = useState("");
  const [count, setCount] = useState([]);
  const [check, setCheck] = useState([]);
  const [alertes, setAlertes] = useState(false);

  const [search, setSearch] = useSearchParams();
  const room = search.get("roomNo");

  // 상대방이 보낸 메세지를 신호를 감지해 내 리스트에 추가하여 말풍선을 뿌려주는 함수.
  useEffect(() => {
    socket.on("messageReturn", (data) => {
      // console.log(data);
      setMessageList((prev) => [...prev, data]);
    });
  }, [socket]);

  // // 첫 입장시 데이터 정보 저장.
  useEffect(() => {
    const userData = axiosUser();
    const dulgiData = dulgiList();

    userData.then((res) => setUsername(res.kakaoNickname));
    userData.then((res) => setKakaoId(res.kakaoId));
    userData.then((res) => setProfileImg(res.kakaoProfileImg));
    // 같은 방으로 join
    userData.then((res) => socket.emit("room", [room, res.kakaoNickname]));

    dulgiData.then((res) => setClientList(Object.values(res)));

    console.log("CHATTING # : " + room);

    // 이방의 채팅내용 모두 가져오기
    const messagedata = messageData();
    // messagedata.then((res) => console.log(res));
    // 데이터가 오브젝트 형식으로 오기 때문에 ex ( {1 : {name:~ , message :2~}})
    // value 값만 가져와 리스트로 만들어주는 작업이 필요하다 . // Object.value(response)
    messagedata.then((response) =>
      setMessageList(
        Object.values(response).filter(function (data) {
          return data.room === room;
        })
      )
    );

    // 방의 상세정보 조회
    const data = roomInfo(room);
    // 참여 인원 입력
    // data.then((response) => console.log(response.user.kakaoId));
    data.then((response) => setClients(response.userCnt));
    // 방의 태그 내용 입력
    data.then((response) => setTags(response.title));
    data.then((response) => setHost(response.user.kakaoId));

    // 방장 프로필 보기 용 변수 설정
    data.then((response) => setOwnerProfileImg(response.user.kakaoProfileImg));
    data.then((response) => setOwnerName(response.user.kakaoNickname));

    // 금기어 리스트 모두 가져오기
    const data1 = alltabooList(room);
    // data.then((response) => console.log(response));
    data1.then((response) => setTabooList(response));
  }, []);

  // 룸의 입장 인원을 카운트해주는 함수
  useEffect(() => {
    socket.on("clients", (data) => {
      // console.log(data);
      setVisitor(data[1]);
      alertClick();
    });
  }, [socket]);

  // 룸 퇴장 인원 화면에 띄워주기
  useEffect(() => {
    socket.on("out", (data) => {
      setOutGoing(data[0]);
      setClients(clients - 1);
      alertClick2();
    });
  }, [socket]);

  // 룸의 금기어가 추가되면 리스트 추가
  useEffect(() => {
    socket.on("returnTabooUpdate", (data) => {
      // 같은 방 사람들도 리스트 추가 !
      setTabooList((prev) => [...prev, data]);
    });
  }, [socket]);

  // 룸의 금기어가 삭제되면 리스트에서도 삭제
  useEffect(() => {
    socket.on("returnTabooDelete", (datas) => {
      let filterArr = tabooList.filter(function (data) {
        return data !== tabooList[datas];
      });

      setTabooList(filterArr);
    });
  }, [socket]);

  // 새로운 채팅이 생성되면 스크롤를 최하단으로 내려줌.
  useEffect(() => {
    let chat = document.querySelector("#chat");
    chat.scrollTop = chat.scrollHeight;
  }, [messageList]);

  // 신고가 3번 이상이면 추방 당할 사람으로 setExit으로 저장
  useEffect(() => {
    socket.on("reportedGugu", (data) => {
      console.log("추방될 사람 id : " + data);
      setCount((prev) => [...prev, { roomNo: room, kickDulgi: data }]);
      dulgiKick({ roomNo: room, kickDulgi: data });
    });
  }, [socket]);

  // 채팅방 소멸
  useEffect(() => {
    socket.on("returnRoomClear", (data) => {
      if (data === "close") {
        setClear(true);
      }
    });
  }, [socket]);

  // 내 리스트에 message data 추가 후
  // 소켓에 message data를 담아 서버에 전달 !
  const sendMessage = async () => {
    if (tabooList.length !== 0) {
      let test = tabooList.join("|");
      let test2 = new RegExp(test, "gi");
      // setMessage(message.replace("하남", "구구"));
      if (message !== "") {
        const messageContent = {
          username: username,
          // message: message,
          message: message.replace(test2, "구구"),
          userId: kakaoId,
          profile: profileImg,
          room: room,
          date: new Date().toLocaleString(), // 2022. 12. 7. 오전 11:24:42
        };
        // messageContent 값이 먼저 정의 된 후 메세지 전달.
        await socket.emit("message", messageContent);

        // firebase realtime db 데이터 추가
        messageUpdate(messageContent);

        // 메세지 리스트에 방금 보낸 메세지도 함께 추가.
        // setMessageList((prev) => [...prev, messageContent]);
        setMessage("");
      }
    } else {
      if (message !== "") {
        const messageContent = {
          username: username,
          // message: message,
          message: message,
          userId: kakaoId,
          profile: profileImg,
          room: room,
          date: new Date().toLocaleString(), // 2022. 12. 7. 오전 11:24:42
        };
        // messageContent 값이 먼저 정의 된 후 메세지 전달.
        await socket.emit("message", messageContent);

        // firebase data base에도 값 추가
        messageUpdate(messageContent);

        // 메세지 리스트에 방금 보낸 메세지도 함께 추가.
        // setMessageList((prev) => [...prev, messageContent]);
        setMessage("");
      }
    }
  };

  // 엔터로 메세지 보낼 수 있게하기
  const onKeyPress = (e) => {
    if (message !== "") {
      if (e.key === "Enter") {
        sendMessage();
      } else {
        setMessage(e.target.value);
      }
    }
  };

  console.log("messageList", messageList);

  // EXIT 버튼을 누르면 채팅방을 나가거나 채팅방에 남거나 선택하는 modal
  const [open, setOpen] = React.useState(false);
  const [openKick, setOpenKick] = React.useState(false);

  const handleClickOpen = () => {
    // firebase 현재 참여목록 호출
    const dulgiData = dulgiList();
    dulgiData.then((res) => setClientKey([...Object.keys(res)]));
    dulgiData.then((res) => setClientList(Object.values(res)));
    dulgiData.then((res) => handleClickOpens(Object.values(res)));
  };

  const handleClickOpens = (list) => {
    if (
      list.map((e, i) => (e.roomNo === room ? i : "")).filter(String).length > 5
    ) {
      // 남은 인원 5인 이상
      setOpen(true);
    }
    // 5인 이하
    else {
      // 나가는 사람이 방장일 때
      if (host === kakaoId) {
        setDel(true);
      } else if (
        list
          .map((e, i) => (e.dulgi === host && e.roomNo === room ? i : ""))
          .filter(String).length >= 1
      ) {
        setOpen(true);
      } else {
        setDel(true);
      }
    }
  };

  const handleClosedel = () => {
    setDel(false);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleCloseKick = () => {
    setOpenKick(true);
  };

  const inputIndex = (i) => {
    setIndex(i);
  };

  const tabooOpen = () => {
    setTaboo(true);
  };

  const alertClick = () => {
    setAlertStatus(!alertStatus);
  };

  const alertClick2 = () => {
    setAlerts(!alerts);
  };

  const alertClick3 = () => {
    setAlertes(!alertes);
  };

  // 추방자 리스트 확인 후 추방하기 !
  useEffect(() => {
    let outDulgi = count.filter(function (data) {
      return data.kickDulgi === kakaoId && data.roomNo === room;
    });
    if (outDulgi.length >= 1) {
      chatOut2();
      handleCloseKick();
    }
  }, [count.length]);

  // 뒤로가기시 방 퇴장
  const handleEvent = () => {
    window.history.pushState(null, "", window.location.href);
    handleClickOpen();
  };

  useEffect(() => {
    window.history.pushState(null, "", window.location.href);
    window.addEventListener("popstate", handleEvent);
    return () => {
      window.removeEventListener("popstate", handleEvent);
    };
  }, []);

  // 방문자 in
  const userIn = () => {
    let counts = clientList.filter(function (data) {
      return data.dulgi === kakaoId && data.roomNo === room;
    });
    if (counts.length === 0) {
      dulgiInsert({ roomNo: room, dulgi: kakaoId }); // 룸 내 새로운 방문객 추가
    }
  };

  // 채팅방 퇴장하기2
  const chatOut2 = () => {
    // 소켓에서 퇴장하기. socket.disconnect();
    socket.emit("left", [username, room, kakaoId]);
    // 소켓 연결 끊기
    socket.disconnect();
    // db인원 -1
    client_out(room);
    // 해당 아이디 index 찾기
    let idx = clientList
      .map((e, i) => (e.dulgi === kakaoId && e.roomNo === room ? i : ""))
      .filter(String);
    // console.log(idx);
    // index에 해당하는 key 가져오기
    let deletedulgi = Object.values(
      clientKey
        .map((e, i) => {
          return clientKey[idx[i]];
        })
        .filter(String)
    );
    // console.log(deletedulgi);

    deletedulgi.map((e, i) => {
      deleteDulgi(e);
    });
  };

  // 채팅방 퇴장하기
  const chatOut = () => {
    // 소켓에서 퇴장하기. socket.disconnect();
    socket.emit("left", [username, room, kakaoId]);
    // 소켓 연결 끊기
    socket.disconnect();
    // db인원 -1
    client_out(room);
    // 해당 아이디 index 찾기
    let idx = clientList
      .map((e, i) => (e.dulgi === kakaoId && e.roomNo === room ? i : ""))
      .filter(String);
    // console.log(idx);
    // index에 해당하는 key 가져오기
    let deletedulgi = Object.values(
      clientKey
        .map((e, i) => {
          return clientKey[idx[i]];
        })
        .filter(String)
    );
    // console.log(deletedulgi);

    deletedulgi.map((e, i) => {
      deleteDulgi(e);
      if (i === clientList.length - 1) {
        deleteDulgi(e).then(() => {
          document.location.href = "/";
        });
      }
    });
  };

  // 신고하기 DB에 저장
  const reportUser = async () => {
    // console.log(index);
    const formData = new FormData();
    // console.log([messageList[index]]);
    let reportMessage = messageList[index];
    if (reportMessage.userId !== host) {
      formData.append("roomNo", reportMessage.room);
      formData.append("message", reportMessage.message);
      formData.append("reporterId", kakaoId);
      formData.append("reportedId", reportMessage.userId);

      report(formData).then((data) => {
        console.log("#### 신고 숫자 : " + data);
        if (data === 3) {
          console.log("### 신고 3번 이상!!!!!");
          socket.emit("reported", [reportMessage.userId, room]);
        }
      });
    } else {
      alertClick3();
    }

    // 신고 3번 이상 받으면 퇴장당하기
    // axiosReportNum(reportMessage.room, reportMessage.userId).then((data) => {
    //   console.log("#### 신고 숫자 : " + data);
    //   if (data >= 3) {
    //     console.log("### 신고 3번 이상!!!!!");
    //     socket.emit("reported", reportMessage.userId);
    //   }
    // });
  };

  // 금기어를 추가하는 함수
  const insertTaboo = async () => {
    if (tabooWord !== "") {
      const formData = new FormData();
      formData.append("roomNo", parseInt(room));
      formData.append("tabooWord", tabooWord);

      // formdata에 담아 금기어 데이터 백엔드에 전달
      insert_taboo(formData);
      setTabooWord("");
      socket.emit("tabooUpdate", [tabooWord, room]);
      // 내 방 금기어 리스트 추가 !
      setTabooList((prev) => [...prev, tabooWord]);
    }
  };

  const handleKeyPress = (e) => {
    if (e.keyCode === 13) {
      insertTaboo();
    }
  };

  // 금기어 삭제
  const tabooDelete = async (idx) => {
    console.log(tabooList[idx]);
    deleteTaboo(tabooList[idx]);
    socket.emit("tabooDelete", [idx, room]);

    let filterArr = tabooList.filter(function (data) {
      return data !== tabooList[idx];
    });

    setTabooList(filterArr);
  };

  // mui 적용

  return (
    // items-center justify-center
    <div
      className="flex flex-col h-fit"
      style={{ fontFamily: "KJHGothicLight" }}
    >
      <div className="w-full h-screen bg-white relative overflow-y-auto">
        <Box sx={{ flexGrow: 1 }}>
          <AppBar position="static" sx={{ background: "#B6E2A1" }}>
            <Toolbar>
              <Box sx={{ flexGrow: 0 }}>
                <Tooltip title="profile">
                  <IconButton
                    onClick={() => {
                      setProfileInfo(true);
                      // document.location.href = "/";
                    }}
                    sx={{ p: 0 }}
                  >
                    <Avatar alt="gugu" src={ownerProfileImg} />
                  </IconButton>
                </Tooltip>
              </Box>
              <div
                className="h-12 text-white text-lg m-3"
                style={{ color: "#4d5749" }}
              >
                {clients !== null ? (
                  <>
                    <div className="flex">{`${clients} 명`}</div>
                    <div>{tags}</div>
                  </>
                ) : (
                  <></>
                )}
              </div>
              <Typography
                variant="h6"
                component="div"
                sx={{ flexGrow: 1 }}
              ></Typography>
              <Button
                color="inherit"
                variant="outlined"
                className="write_button"
                type="submit"
                defaultValue="save"
                onClick={() => handleClickOpen()}
                style={{
                  backgroundColor: "#89ab79",
                  fontFamily: "KJHGothicLight",
                  fontWeight: "bold",
                }}
              >
                EXIT
              </Button>
            </Toolbar>
          </AppBar>
        </Box>
        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          sx={{ fontFamily: "KJHGothicLight" }}
        >
          <DialogTitle
            id="alert-dialog-title"
            sx={{ fontFamily: "KJHGothicLight", fontWeight: "bold" }}
          >
            {"조금 더 자유로워지시겠습니까?"}
          </DialogTitle>
          <img alt="flyGugu" src={flyGugu}></img>

          <DialogActions>
            <Button
              style={{
                fontFamily: "KJHGothicLight",
                fontWeight: "bold",
              }}
              onClick={() => {
                chatOut();
              }}
              autoFocus
            >
              날아가기
            </Button>
            <Button
              style={{
                fontFamily: "KJHGothicLight",
                fontWeight: "bold",
              }}
              onClick={handleClose}
            >
              둥지틀기
            </Button>
          </DialogActions>
        </Dialog>
        {/* </div> */}
        <div id="chat" className="w-auto h-[80vh] overflow-y-auto">
          {messageList &&
            messageList.map((msg, i) => (
              <PopupState key={i} variant="popover" popupId="demo-popup-menu">
                {(popupState) => (
                  <div onClick={() => inputIndex(i)}>
                    {username !== msg.username ? (
                      <div className={"flex text-xs m-3 font-semibold"}>
                        <img
                          alt="guguProfile"
                          src={msg.profile}
                          className="w-6 h-6 rounded-full border-2"
                        ></img>{" "}
                        &nbsp;&nbsp;
                        {msg.username}
                      </div>
                    ) : (
                      <></>
                    )}
                    <div
                      className={`${
                        username === msg.username ? "flex justify-end" : ""
                      }`}
                      variant="contained"
                      {...bindTrigger(popupState)}
                    >
                      <div
                        className={` ${
                          username === msg.username
                            ? "bg-green-600 rounded-xl rounded-tr-none "
                            : "bg-blue-600 rounded-xl rounded-tl-none"
                        } h-auto p-2 text-white m-2 w-fit max-w-[30%] text-left p-2 break-all`}
                      >
                        <div className="flex">{msg.message}</div>
                      </div>
                    </div>
                    {username !== msg.username ? (
                      // <Menu>
                      <Menu {...bindMenu(popupState)}>
                        <button
                          component="MenuItem"
                          style={{ fontFamily: "KJHGothicLight" }}
                          sx={{
                            display: "inline",
                          }}
                          onClick={() => {
                            popupState.close();
                            reportUser(this);
                          }}
                        >
                          🚨 신고하기
                        </button>
                      </Menu>
                    ) : (
                      <></>
                    )}
                  </div>
                )}
              </PopupState>
            ))}
        </div>
      </div>
      <div className="absolute bottom-0 left-0 w-full h-[10%]">
        {host === kakaoId ? (
          <button onClick={tabooOpen} className="w-12 h-12 border rounded-xl">
            +
          </button>
        ) : (
          <></>
        )}
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-[70%] h-12 border p-3 outline-none rounded-xl"
          type="text"
          placeholder="message send"
          style={{ marginLeft: 10, marginRight: 10, width: "60vw" }}
          onKeyPress={onKeyPress}
        />
        {message != null ? (
          <button
            onClick={sendMessage}
            className="w-[15%] bg-indigo-600 text-white h-12 hover-opacity-70 rounded-xl"
            style={{ backgroundColor: "#89ab79", fontWeight: "bold" }}
          >
            SEND
          </button>
        ) : (
          <button
            className="w-[15%] bg-indigo-600 text-white h-12 hover-opacity-70 rounded-xl"
            style={{ backgroundColor: "#89ab79" }}
          >
            SEND
          </button>
        )}
      </div>

      <Modal
        open={profileInfo}
        onClose={() => setProfileInfo(false)}
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
            bgcolor: "background.paper",
            border: "2px solid #000",
            boxShadow: 24,
            p: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            fontFamily: "KJHGothicLight",
          }}
        >
          <img
            className="rounded-full"
            alt="gugu_tilt"
            src={ownerProfileImg}
            style={{
              height: 120,
              width: "auto",
              position: "relative",
              display: "flex",
              alignItems: "center",
              marginBottom: 20,
            }}
          />
          <b>{ownerName}의 방</b>
          {/* <IconButton
            component="label"
            style={{ color: "#89ab79" }}
            onClick={() => setProfileInfo(false)}
          >
            <CancelIcon />
          </IconButton> */}
          <br />
          <br />
          <Typography>⛔금기어 목록⛔</Typography>
          <br />
          <div className="h-[30vh] overflow-y-auto">
            {tabooList.map((value, index) => (
              <Typography key={index}>{value}</Typography>
            ))}
          </div>
        </Box>
      </Modal>

      <Dialog open={taboo} onClose={() => setTaboo(false)}>
        <DialogTitle>⛔내 방 금기어 리스트⛔</DialogTitle>
        <DialogContent>
          {/* <Typography className="h-[30vh] overflow-y-auto"> */}
          {tabooList.map((taboo, idx) =>
            taboo !== "" ? (
              <DialogContentText
                id="modal-modal-title"
                key={idx}
                className="text-[14px]"
              >
                {idx + 1 + ". " + taboo}
                &nbsp;&nbsp;&nbsp;
                <button
                  onClick={() => tabooDelete(idx)}
                  key={idx}
                  className="text-[14px]"
                >
                  <DeleteForeverIcon />
                </button>
              </DialogContentText>
            ) : (
              <></>
            )
          )}
          {/* </Typography> */}
          <TextField
            autoFocus
            margin="dense"
            label="추가 금기어 입력"
            fullWidth
            variant="standard"
            value={tabooWord}
            onChange={(e) => setTabooWord(e.target.value)}
            onKeyDown={(e) => handleKeyPress(e)}
            type="text"
            placeholder="taboo"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={insertTaboo}>Insert</Button>
          <Button onClick={() => setTaboo(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openKick}
        onClose={() => {
          document.location.href = "/";

          setOpenKick(false);
        }}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"둥지에서 퇴장입니다."}
        </DialogTitle>
        {/* <img alt="flyGugu" src={flyGugu}></img> */}

        <DialogActions>
          <Button
            onClick={() => {
              document.location.href = "/";
            }}
            autoFocus
          >
            확인
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={del}
        onClose={handleClosedel}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"5인 이하의 방은 퇴장시 해당방이 사라집니다."}
        </DialogTitle>
        {/* <img alt="flyGugu" src={flyGugu}></img> */}

        <DialogActions>
          <Button
            onClick={() => {
              // 소켓에서 퇴장하기. socket.disconnect();
              socket.emit("left", [username, room, "close"]);
              // 소켓 연결 끊기
              socket.disconnect();
              // db인원 -1
              client_out(room);
              // 룸에서 해당 아이디 index 찾기
              let idx = clientList
                .map((e, i) => (e.roomNo === room ? i : ""))
                .filter(String);
              // console.log(idx);
              // index에 해당하는 key 가져오기
              let deletedulgi = Object.values(
                clientKey
                  .map((e, i) => {
                    return clientKey[idx[i]];
                  })
                  .filter(String)
              );
              console.log(deletedulgi);

              deletedulgi.map((e, i) => {
                deleteDulgi(e);
                if (i === clientList.length - 1) {
                  deleteDulgi(e).then(() => {
                    deleteRoom(room);
                    document.location.href = "/";
                  });
                }
              });
            }}
            autoFocus
          >
            날아가기
          </Button>
          <Button onClick={handleClosedel}>둥지틀기</Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={clear}
        onClose={() => (document.location.href = "/")}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"모두가 떠나 홀로 남았습니다.."}
        </DialogTitle>
        <img alt="guguEyes" src={gugueyes}></img>

        <DialogActions>
          <Button onClick={() => (document.location.href = "/")} autoFocus>
            날아가기
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        className="mapAlert"
        anchorOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        open={alerts}
        autoHideDuration={3000}
        onClose={alertClick2}
      >
        <Alert severity="info" sx={{ width: "100%" }}>
          {`${outGoing} 둘기가 떠났습니다...`}
        </Alert>
      </Snackbar>
      <Snackbar
        className="mapAlert"
        anchorOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        open={alertStatus}
        autoHideDuration={3000}
        onClose={() => {
          alertClick();
          userIn();
        }}
      >
        <Alert severity="success" sx={{ width: "100%" }}>
          {`${visitor} 둘기가 합류하였습니다`}
        </Alert>
      </Snackbar>
      <Snackbar
        className="mapAlert"
        anchorOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        open={alertes}
        autoHideDuration={3000}
        onClose={alertClick3}
      >
        <Alert severity="error" sx={{ width: "100%" }}>
          {`방장 둘기는 기싸움을 버텨냈습니다 😎`}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default Chat;
