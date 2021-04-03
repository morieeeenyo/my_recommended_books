import React, { Component } from 'react';
import styled from 'styled-components';

// react-routerの読み込み
import { BrowserRouter as Router, Route } from "react-router-dom";

// コンポーネントの読み込み
import Index from '../books/Index.jsx'
import MyPage from '../users/MyPage.jsx'


class Container extends React.Component {
  constructor(){
    super();
  }

  render () {
    return (
      <Wrapper>
        {this.props.children}
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



export default Container;