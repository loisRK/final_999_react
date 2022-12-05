import "../App.css";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import Posts from "./Posts";
import Pagination from "./Pagination";
import { axiosData } from "../api/Diary";
import { Link, useParams } from "react-router-dom";

function Posting() {
  // infinite scrolling
  const listInnerRef = useRef();
  const [currentPage, setCurrentPage] = useState(1);
  const [prevPage, setPrevPage] = useState(0); // storing prev page number
  const [posts, setPosts] = useState([]);
  const [wasLastList, setWasLastList] = useState(false); // setting a flag to know the last list

  useEffect(() => {
    // infinite scroll 테스트
    if (!wasLastList && prevPage !== currentPage) {
      axiosData(posts, setWasLastList, setPrevPage, setPosts, currentPage);
    }
  }, [currentPage, wasLastList, prevPage]);

  const onScroll = () => {
    if (listInnerRef.current) {
      console.log("inside onScroll");
      const { scrollTop, scrollHeight, clientHeight } = listInnerRef.current;
      console.log(scrollTop + clientHeight, scrollHeight);
      if (scrollTop + clientHeight >= scrollHeight) {
        console.log("inside if");
        setCurrentPage(currentPage + 1);
      }
    }
  };

  return (
    <div className="Home">
      <div>
        <Link to={"/"}>
          <button className="write_button">홈으로</button>
        </Link>
        <Link to={"/insert"}>
          <button className="write_button">글쓰기</button>
        </Link>
        <br />
      </div>
      <Posts
        onScroll={onScroll}
        listInnerRef={listInnerRef}
        posts={posts}
        currentPage={currentPage}
      ></Posts>
      {/* <Pagination
        postsPerPage={data.size}
        totalPosts={data.totalPage}
        setCurrentPage={setCurrentPage}
        pageList={data.pageList}
        next={data.next}
        prev={data.prev}
        start={data.start}
        end={data.end}
      ></Pagination> */}
    </div>
  );
}

export default Posting;
