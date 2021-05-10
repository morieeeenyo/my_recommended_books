import React, { Component } from 'react';
import styled from 'styled-components';

// react-routerの読み込み
import { Link } from "react-router-dom";

// 背景画像の読み込み
import BackGroundImage from "../../../images/startup-593341_1920.jpg"

class Container extends React.Component {
  constructor(){
    super();
  }

  render () {
    return (
      <Wrapper>
        {this.props.children}
        <div class="heading">
          <div id="overlay"></div>
        </div>
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
  background-color: #F4F5F7;
  /* ヘッダーを抜いた高さ */
  height: calc(100vh - 65px); 
  .heading {
    background-image: url(${BackGroundImage});
    position: relative;
    height: 40%;

    & #overlay {
      background-color: #212529;
      opacity: 0.5;
      position: absolute;
      height: 100%;
      width: 100%;
    }
  }

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