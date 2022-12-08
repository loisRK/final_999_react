import axios from "axios";
import React, { FormEvent } from "react";
import { Form } from "react-router-dom";

// insert Chatting Rooms - post
export const createRooms = async (formData) => {
    axios
    .post("http://localhost:8080/api/room", formData)
    // console.log("nickname:" + formData.nickname);
    // console.log("newNickname:" + formData.newNickname);
    // console.log("tag:" + formData.tag);
    console.log("createRooms axios 실행");
    
};