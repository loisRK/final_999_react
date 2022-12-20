import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../css/search.css";
import axios from "axios";
import SearchIcon from "@mui/icons-material/Search";

function SearchBar({ setSearchId, setCurrentPage, setPrevPage }) {
  const [text, setText] = useState("");
  const [data, setData] = useState("");

  const onChange = (e) => {
    setText(e.target.value);
  };

  const submit = (e) => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });

    e.preventDefault();
    // setSearchPost(text);
    console.log("검색키워드" + text);
    setPrevPage(0);
    setCurrentPage(1);

    if (text === "") {
      setSearchId(0);
      // eslint-disable-next-line no-restricted-globals
      location.reload(true);
    } else {
      setSearchId(text);
    }

    console.log("SEARCHBAR : ", text);
  };

  const handleOnKeyPress = (e) => {
    if (e.key === "Enter") {
      submit(e); // Enter 입력이 되면 클릭 이벤트 실행
    }
  };
  // 인풋에 적용할 Enter 키 입력 함수

  return (
    <div className="searchDiv">
      <div id="search">
        <div className="item1">
          <input
            onChange={onChange}
            onKeyPress={handleOnKeyPress}
            value={text}
            className="searchBar"
            name="SearchBar"
          ></input>
        </div>
        <div className="item2">
          <button onClick={submit} className="magBtn">
            <SearchIcon sx={{ color: "#999999", fontSize: 35 }} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default SearchBar;
