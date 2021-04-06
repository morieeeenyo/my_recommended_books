import React, { Component } from 'react';
import styled from 'styled-components';

// コンポーネントの読み込み
// import {Wrapper} from "../common/Container.jsx"

// react-routerの読み込み
import { Link, withRouter, useLocation } from "react-router-dom";

//axiosの読み込み
import axios from 'axios';

export function MyRecommendedBooks() {
  const location = useLocation();
  if (location.state.books.length !== 0) {
    return (
      <BookList>
          {location.state.books.map(book => {
            return (
            <li key={book.isbn}>
              <img src={book.image_url}/>
              <p>{book.title}</p>
              <p>{book.author}</p>
              {/* Todo:この下にアクションプランを書くページへのリンクを貼る */}
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

export function UserInfo() {
  // ユーザー情報が初期表示
  return (
    <div>
      これはユーザー情報
    </div>
  )
}

class MyPage extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      user: {},
      books: []
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
      alert('ユーザーがサインアウトしました。')
      this.props.history.push("/")
    }
    axios 
    .get('/api/v1/users/mypage')
    .then(response => {
      this.setState({
        user: response.data.user,
        books: response.data.books
      })
      return response
    })
    .catch(error =>{
      console.log(error)

    })

  }
  render () {
    return (
      <MyPageWrapper>
        <MyPageHeader>
          {this.state.user.nickname}さんのマイページ
        </MyPageHeader>
        <MyPageBody>
          <MyPageSideBar>
            <ul>
              {/* サイドバーをクリックするとパスに応じてメインコンテンツが切り替わる */}
              <li>
                <Link to="/users/mypage/edit">
                  プロフィール
                </Link>
              </li>
              <li>
                <Link to={{pathname: "/users/mypage/recommends", state: {books: this.state.books}}}>
                  推薦図書一覧
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

const MyPageHeader = styled.h4`
  margin: 0;
  font-size: 16px;
  margin-bottom: 10px;
`

const MyPageBody = styled.div`
  display: flex;
  justify-content: space-between;
  height: 60vh;
`

const MyPageSideBar = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  border: 1px solid black;
  width: 15%;
  background-color: #FFF;

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

  & li {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 20%;
    overflow: wrap;
    margin: 0 5% 5% 0;

    & p {
      font-size: 12px;
      margin: 0;
    }
  }
`


export default withRouter(MyPage)