import React from "react";
import styled from "styled-components";

const PageUl = styled.ul`
  list-style: none;
  text-align: center;
  border-radius: 3px;
  color: white;
  padding: 1px;
  border-top: 3px solid #186ead;
  border-bottom: 3px solid #186ead;
  background-color: rgba(0, 0, 0, 0.4);
`;

const PageLi = styled.li`
  display: inline-block;
  font-size: 17px;
  font-weight: 600;
  padding: 5px;
  border-radius: 5px;
  width: 25px;
  &:hover {
    cursor: pointer;
    color: white;
    background-color: #263a6c;
  }
  &:focus::after {
    color: white;
    background-color: #263a6c;
  }
`;

const PageSpan = styled.span`
  &:hover::after,
  &:focus::after {
    border-radius: 100%;
    color: white;
    background-color: #263a6c;
  }
`;

const Pagination = ({ setCurrentPage, prev, next, start, end, pageList }) => {
  // const pageNumbers = [];
  // for (let i = 1; i <= Math.ceil(totalPosts / postsPerPage); i++) {
  //   pageNumbers.push(i);
  // }
  return (
    <div>
      <nav>
        <PageUl>
          {prev ? (
            <button
              onClick={() => {
                setCurrentPage(start - 1);
              }}
            >
              prev
            </button>
          ) : (
            <></>
          )}
          {pageList ? (
            pageList.map((page) => (
              <PageLi key={page}>
                <PageSpan
                  onClick={() => {
                    setCurrentPage(page);
                  }}
                >
                  {page}
                </PageSpan>
              </PageLi>
            ))
          ) : (
            <></>
          )}
          {next ? (
            <button
              onClick={() => {
                setCurrentPage(end + 1);
              }}
            >
              next
            </button>
          ) : (
            <></>
          )}
        </PageUl>
      </nav>
    </div>
  );
};

export default Pagination;
