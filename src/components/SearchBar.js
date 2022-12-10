import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../css/search.css";
import axios from "axios";

function SearchBar({ setSearchPost }) {
  const [text, setText] = useState("");
  const [data, setData] = useState("");

  const onChange = (e) => {
    setText(e.target.value);
  };

  const submit = (e) => {
    e.preventDefault();
    setSearchPost(text);

    // axios
    //   .get("/api/searchController", {
    //     params: { inputText: text },
    //   })
    //   .then((response) => setSearchPost(response.data.postList));
    // // .then((response) => setData(response.data.postList));

    console.log("SEARCHBAR : ", text);
  };

  return (
    <div className="searchDiv">
      <div id="search">
        <div className="item1">
          <input
            onChange={onChange}
            value={text}
            className="searchBar"
            name="SearchBar"
          ></input>
        </div>
        <div className="item2">
          <button onClick={submit} className="magBtn">
            {/* <Link to="/Body" state={{ data: data }}></Link> */}
            <img
              className="magGlass"
              src="https://cdn-icons-png.flaticon.com/512/2120/2120967.png"
              alt="magGlass"
            ></img>
          </button>
        </div>
      </div>
    </div>
  );
}

export default SearchBar;
