import React, { Component } from 'react';
import styled from 'styled-components';

// react-routerの読み込み
import { BrowserRouter as Router, Route } from "react-router-dom";

// コンポーネントの読み込み
import Index from '../books/Index.jsx'
import MyPage from '../users/MyPage.jsx'

// react-routerの読み込み
import { Link } from "react-router-dom";

class Container extends React.Component {
  constructor(){
    super();
  }

  render () {
    return (
      <Wrapper>
        {this.props.children}
        <NewBooksLink>
          <Link to="/books/new" style={{color: "#FFF", textDecoration: "none"}}>
            <i className="fas fa-book-open"></i>
            <span>投稿する</span>
          </Link>
        </NewBooksLink>
      </Wrapper>
    )
  } 
}

export const Wrapper  = styled.div `
  margin: 0 auto;
  background-color: #F5F6F2;
  /* ヘッダーを抜いた高さ */
  height: calc(100vh - 65px); 
`

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



export default Container;