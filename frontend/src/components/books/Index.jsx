import React, { Component } from 'react';
import styled from 'styled-components';

// react-routerの読み込み
import { Link, withRouter } from "react-router-dom";

// Cookieの読み込み。localStorageを使用せずCookieを使用する方針に切り替え
import Cookies from 'universal-cookie';

//axiosの読み込み
import axios from 'axios';

import {BookList} from '../users/MyPage.jsx'

class Index extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      books: []
    }
  }

  componentDidMount() {
    const cookies = new Cookies();
    let authToken = cookies.get("authToken");
    if (authToken == undefined || !authToken) {
      // なんかundefinedも判定しないとエラーになる
      if (location.pathname === "/") {
        // ルートパスアクセス時、ログインしていなければwelcomeページへ
        this.props.history.push('/welcome')
      }
    } else {
      axios
      .get('/api/v1/books')
      .then(response => {
         this.setState({
           books: response.data.books
         })
      })
      .catch(error => {
        alert(error.response.data.errors) //モデルのエラーメッセージではないのでアラートにする
      })
    }
    // 書籍投稿ボタンが非表示の場合表示する
    const newBookLink = document.getElementById('new_book_link')
    if (newBookLink.getAttribute('style') == 'display: none;') {
      newBookLink.setAttribute('style', 'display: block;')
    }
  }

  render () {
    return (
      <BookIndexContainer>
        <div className="search">
          <h2>書籍検索</h2>
          <p>気になる本があれば検索してみましょう。<br></br>すでに読んだ方のアウトプットが見つかるかもしれません。</p>
          <div className="search-form-field">
            <input type="text" placeholder="書籍名で検索" ></input>
            <button className="search-button"><i className="fas fa-search"></i></button>  
          </div>
        </div>

        <div className="book_list">
          <h2>新着書籍一覧</h2>
          <BookList>
            {this.state.books.map(book => {
              return (
              <li key={book.isbn} className="book-list-item">
                <img src={book.image_url}/>
                <p className="book-title">{book.title}</p>
                <p className="book-author">{book.author}</p>
              </li> //returnがないと表示できない
              ) 
            })} 
          </BookList>
        </div>
      </BookIndexContainer>
     )
   
  } 
}

const BookIndexContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 80%;
  margin: 0 auto;

  & div {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 80%;
    margin: 0 auto;

    & h2 {
      font-size: 32px;
    }

    & p {
      text-align: center;
    }
  }

  & .search-form-field {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center; 
    width: 40%;

    & input {
      height: 24px;
      width: 82%;
      padding: 10px;
    }

    & .search-button {
      /* 検索ボタン */
      vertical-align: center;
      position: static;
      background-color: #989EAB;
      color: #F4F5F7;
      height: 50px;
      padding: 0 15px;
      border-style: none;

      & i {
        font-size: 16px;
      }
    }

    & .search-button:hover {
      cursor: pointer;
      color: #535F78;
      background-color: #F4F5F7;
      border: 1px solid #989EAB;
    }

  }
`

export default withRouter(Index);