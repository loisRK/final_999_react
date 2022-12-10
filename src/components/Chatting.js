import axios, {all} from "axios";
import { createRooms } from "../api/Chatting";
import React, { FormEvent, useEffect, useState } from "react";
import { Box, Button, Modal, Typography } from "@mui/material";
import { Form } from "react-router-dom";
import { useNavigate, useSearchParams } from "react-router-dom";
import { axiosUser } from "../api/User";

function Chatting() {
    const navigate = useNavigate();
    const formData = new FormData();
    
    const token = window.localStorage.getItem("token");
    const [nickname, setNickname] = useState("비회원");
    const [newNickname, setNewNickname] = useState("");
    const [category, setCategory] = useState("");
    const [userId, setUserId] = useState("");
    const [tag, setTag] = useState("");
    

    useEffect(() => {
        if(token !== null) {
            const data = axiosUser();
            data.then((res) => setNickname(res.kakaoNickname));
            data.then((res) => setUserId(res.kakaoId));
            console.log(userId);
        }

    }, [])

    const getCategory = (e) => {
        setCategory(e.target.value);
    }

    const getNewNickname = (e) => {
        // e.preventDafault();
        setNewNickname(e.target.value);
    };

    const getTag = (e) => {
        // e.preventDafault();
        setTag(e.target.value);
    }
    
    const goHome = (e) => {
        navigate('/');
      };
    const [search, setSearch] = useSearchParams();
    const roomLatitude = search.get("latitude");
    const roomLongitude = search.get("longitude");
    const createRoom = (e, nickname, newNickname, tag, category) => {
        formData.append("userId", userId); // 카카오아이디
        formData.append("nickname", nickname); // 카카오닉네임
        formData.append("newNickname", newNickname); // 익명닉네임
        formData.append("tag", tag);
        formData.append("chatLat", roomLatitude);
        formData.append("chatLong", roomLongitude);
        formData.append("category", category);

        console.log(nickname + newNickname + tag + "위도: "+roomLatitude + "경도: " + roomLongitude);
        createRooms(formData);
    }
    

    return (
        
        <div>
            {token !== null ? (
                <div>
                현재 위도   : <span>{roomLatitude}</span>  
                현재 경도   : <span>{roomLongitude}</span><br/>  
                회원 닉네임 : <span>{nickname}</span><br/>
                카테고리    : <input name="category" onChange={getCategory} value={category} placeholder="카테고리" /><br/>
                익명 닉네임 : <input name="newNickname" onChange={getNewNickname} value={newNickname} placeholder="익명 닉네임" /><br/>
                채팅방 태그 : <input name="tag" onChange={getTag} value={tag} placeholder= "해시태그 입력" /><br/>
                <button onClick={(e) => createRoom(e, nickname, newNickname, tag, category)}>채팅방 만들기</button>
                </div>
            
        ) : (
            <div>채팅방 개설은 회원만 가능합니다.</div>
        )}
        <div><Button onClick={goHome}>Home</Button></div>
        </div>        
    );
}

export default Chatting;