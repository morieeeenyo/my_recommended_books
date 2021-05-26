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

// Cookieの読み込み
import Cookies from 'universal-cookie';




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
              <Link to={{pathname: "/mypage/books/" + book.isbn + "/outputs", state: {book: book, user: location.state.user}}}>アウトプット</Link>
            </li> //returnがないと表示できない
            ) 
          })} 
      </BookList>
    )
    } else {
      return null
  }
}

class MyPage extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      user: {
        nickname: '',        
        email: '',        
        password: '',        
        password_confirmation: '',        
      },
      avatar: {
        data: '',
        filename: ''
      },
      avatar: ''
    }
    this.getCsrfToken = this.getCsrfToken.bind(this)
    this.setAxiosDefaults = this.setAxiosDefaults.bind(this)
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

  componentDidMount() {
    this.setAxiosDefaults();
    const authToken = this.userAuthentification()
    if (!authToken) {
      // マイページからサインアウトした場合にはここを経由してトップページに戻る
      alert('ユーザーがサインアウトしました。')
      this.props.history.push("/")
    }
    axios 
    .get('/api/v1/mypage')
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
      //アラートを出すとうまく動かなかった(アラートが2つ出てくる？？？)
      console.log(error) 
    })
    const cookies = new Cookies();
    if (cookies.get('first_session')) {
      // こっちはhistory.pushでいけた
      this.props.history.push({pathname: "/mypage/profile/edit", state: {content: 'Edit Profile', show: true, user: this.state.user}})
    }
  }

  componentDidUpdate() {
    let updatedProps = this.props.location.state
    // 編集後の挙動。非同期で画面に情報を反映させる
    if (updatedProps) {
      if (updatedProps.avatar) {
        this.state.avatar = updatedProps.avatar
        document.getElementById('avatar').src = this.state.avatar
      } 
      if (updatedProps.user) {
      this.state.user.nickname = updatedProps.user.nickname
      document.getElementById('nickname').innerHTML = `${this.state.user.nickname}さんのマイページ`
      }
    }
  }

  render () {
    return (
      <MyPageWrapper>
        <MyPageBody>
          <MyPageSideBar>
          <img id="avatar"src={this.state.avatar}/>
          <h4 id="nickname">{this.state.user.nickname}さんのマイページ</h4>
            <ul>
              {/* サイドバーをクリックするとパスに応じてメインコンテンツが切り替わる */}
              <li>
                <Link to={{pathname: "/mypage/books", state: {books: this.state.books, user: this.state.user}}}>
                  推薦図書一覧
                </Link>
              </li>
              <li>
                <Link to={{pathname: "/mypage/edit/menu", state: {user: this.state.user, show: true}}}>
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
  height: 80vh;
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

export const BookList = styled.ul`
  display: flex;
  list-style: none;
  width: 100%;
  flex-wrap: wrap;
  overflow: scroll;
  margin-bottom: 0;

  & .book-list-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-around;
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
      background-color: #ACC47E;
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