import React, { Component } from 'react';
import styled from 'styled-components';

// react-routerの読み込み
import { Link } from "react-router-dom";

class Index extends React.Component {
  render () {
    return (
      <div className="container">
        <NewBooksLink>
          <Link to="/books/new" style={{color: "#FFF", textDecoration: "none"}}>
            <i className="fas fa-book-open"></i>
            <span>投稿する</span>
          </Link>
        </NewBooksLink>
      </div>
    )
  } 
}

const NewBooksLink = styled.div `
  background-color: #cb4d00;
  width: 100px;
  height: 100px;
  position: fixed;
  bottom: 50px;
  right: 50px;
  border-radius: 5px;

  & .fa-book-open {
    font-size: 48px;
    color: #FFF;
  }

  & a {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100px;
  }
`


export default Index;