import React, { Component } from 'react';
import styled from 'styled-components';

// react-routerの読み込み
import { Link, withRouter } from "react-router-dom";

// Cookieの読み込み。localStorageを使用せずCookieを使用する方針に切り替え
import Cookies from 'universal-cookie';

class Index extends React.Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    const cookies = new Cookies()
    const authToken = cookies.get("authToken")
    if (authToken == undefined || !authToken) {
      // なんかundefinedも判定しないとエラーになる
      this.props.history.push('/welcome')
    }
    const newBookLink = document.getElementById('new_book_link')
    if (newBookLink.getAttribute('style') == 'display: none;') {
      newBookLink.setAttribute('style', 'display: block;')
    }
  }

  render () {
    return (
      <div className="container">
    
      </div>
     )
   
  } 
}


export default withRouter(Index);