import React, { Component } from 'react';
import styled from 'styled-components';

// コンポーネントの読み込み
// import {Wrapper} from "../common/Container.jsx"

// react-routerの読み込み
import { Link, withRouter, useLocation } from "react-router-dom";

//axiosの読み込み
import axios from 'axios';

// ロゴ画像の読み込み
import Sample from "../../../images/sample_avatar.png"

export function MyRecommendedBooks() {
  const location = useLocation();
  if (location.state.books.length !== 0) {
    return (
      <BookList>
          {location.state.books.map(book => {
            return (
            <li key={book.isbn} className="book-list-item">
              <img src={book.image_url}/>
              <p className="book-title">{book.title}</p>
              <p className="book-author">{book.author}</p>
              <Link to={{pathname: "/users/mypage/books/" + book.id + "/outputs", state: {book: book}}}>アウトプット</Link>
            </li> //returnがないと表示できない
            ) 
          })} 
      </BookList>
    )
    } else {
      return null
  }
}

export function EditUserInfo() {
  return (
    <div>
      これはユーザー情報の編集フォームです
    </div>
  )
}

class MyPage extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      user: {},
      books: [],
      avatar: ''
    }
    this.getCsrfToken = this.getCsrfToken.bind(this)
    this.setAxiosDefaults = this.setAxiosDefaults.bind(this)
    this.userAuthentification = this.userAuthentification.bind(this)
  }

  getCsrfToken() {
    if (!(axios.defaults.headers.common['X-CSRF-Token'])) {
      return (
        document.getElementsByName('csrf-token')[0].getAttribute('content') //初回ログイン時新規登録時はheadタグのcsrf-tokenを参照する
      )
    } else {
      return (
        axios.defaults.headers.common['X-CSRF-Token'] //それ以外のときは既にセットしてあるcsrf-tokenを参照
      )
    }
  };

  setAxiosDefaults() {
    axios.defaults.headers.common['X-CSRF-Token'] = this.getCsrfToken();
  };

  userAuthentification() {
    const authToken = JSON.parse(localStorage.getItem("auth_token"));
    // uid, client, access-tokenの3つが揃っているか検証
    if (authToken['uid'] && authToken['client'] && authToken['access-token']) { 
      axios.defaults.headers.common['uid'] = authToken['uid']
      axios.defaults.headers.common['client']  = authToken['client']
      axios.defaults.headers.common['access-token']  = authToken['access-token']
      return authToken
    } else {
      return null
    }
  }

  componentDidMount() {
    this.setAxiosDefaults();
    const authToken = this.userAuthentification()
    if (!authToken) {
      // マイページからサインアウトした場合にはここを経由してトップページに戻る
      alert('ユーザーがサインアウトしました。')
      this.props.history.push("/")
    }
    axios 
    .get('/api/v1/users/mypage')
    .then(response => {
      if (response.data.avatar) {
        this.setState({
          user: response.data.user,
          books: response.data.books,
          avatar: response.data.avatar
        })
      } else {
        this.setState({
          user: response.data.user,
          books: response.data.books,
          avatar: Sample
        })
      }
      return response
    })
    .catch(error =>{
      console.log(error)

    })

  }
  render () {
    return (
      <MyPageWrapper>
        <MyPageBody>
          <MyPageSideBar>
          <img src={this.state.avatar}/>
          <h4>{this.state.user.nickname}さんのマイページ</h4>
            <ul>
              {/* サイドバーをクリックするとパスに応じてメインコンテンツが切り替わる */}
              <li>
                <Link to={{pathname: "/users/mypage/books", state: {books: this.state.books}}}>
                  推薦図書一覧
                </Link>
              </li>
              <li>
                <Link to="/users/mypage">
                  ユーザー情報編集
                </Link>
              </li>
            </ul>
          </MyPageSideBar>
          <MyPageMainContent>
            {/* ここにサイドバーのパスに対応したコンテンツが表示される */}
            {this.props.children}
          </MyPageMainContent>
        </MyPageBody>
      </MyPageWrapper>
    )
  } 
}

const MyPageWrapper = styled.div`
  /* ちょうどヘッダーのロゴと端がそろうようにしている */
  width: 65%; 
  margin: 0 auto;
  padding: 3%; 
`

const MyPageBody = styled.div`
  display: flex;
  justify-content: space-between;
  /* 高さを固定しないと推薦図書を投稿するたびに高さが変動してしまう。 */
  height: 60vh;
`

const MyPageSideBar = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  border: 1px solid black;
  width: 15%;
  background-color: #FFF;
  padding-top: 5px;

  & img {
    border-radius: 5px;
    width: 95%;
  }

  /* 以下はサイドバーのリンクの仕様 */
  & ul {
    list-style: none;
    padding: 0;
    margin: 0;
    background-color: #FFF;
    width: 100%;
  }

  & a {
    display: inline-block;
    padding: 10px;
    border-radius: 2px;
    text-decoration: none;
    color: #000;
  }

  & li:hover {
    /* ホバーしたときに色を反転させる */
    background-color: #cb4d00;
    cursor: pointer;

    & a {
      color: #FFF;
    }
  }
`

const MyPageMainContent = styled.div`
  width: 80%;
  border: 1px solid black;
  background-color: #FFF;
`

const BookList = styled.ul`
  display: flex;
  list-style: none;
  width: 100%;
  flex-wrap: wrap;

  & .book-list-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    /* 1行に4冊分のデータが表示されるようにしている */
    width: 20%;
    overflow: wrap;
    margin: 0 5% 5% 0;

    & p {
      font-size: 12px;
      margin: 0;
    }

    & a {
      display: inline-block;
      text-decoration: none;
      background-color: #0ACC64;
      color: #FFF;
      border-style: none;
      border-radius: 5px;
      padding: 5px 10px;
    }

    & a:hover {
      cursor: pointer;
      font-weight: bold;
      box-shadow: 0 5px 10px black;
    }

    & a:active {
      box-shadow: 0 0 5px black;
      margin-top: 5px;
    }
  }
`


export default withRouter(MyPage)