import React, { Component } from 'react';
import styled from 'styled-components';

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
        {/* 表示非表示の切り替えのためidを付与 */}
        <NewBooksLink id="new_book_link">
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
  background-color: #F4F5F7;
  /* ヘッダーを抜いた高さ */
  height: calc(100vh - 65px); 
  overflow: scroll;

`

const NewBooksLink = styled.div `
  background-color: #989EAB;
  width: 100px;
  height: 100px;
  position: fixed;
  bottom: 50px;
  right: 50px;
  border-radius: 5px;

  & .fa-book-open {
    font-size: 48px;
    color: #F4F5F7;
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