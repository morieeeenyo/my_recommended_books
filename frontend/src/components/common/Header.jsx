import React, { Component } from 'react';
import styled from 'styled-components';

// コンポーネントの読み込み
import UserModalForm from './UserModalForm.jsx';

// ロゴ画像の読み込み。ダブルクオートじゃないと本番環境で読み込めない
import Logo from "../../../images/header_logo.png"

// react-router用のlinkを使えるようにする
import { withRouter } from 'react-router-dom'

// react-routerの読み込み
import { Link } from "react-router-dom";

// Cookieの読み込み
import Cookies from 'universal-cookie';


class Header extends React.Component {
  constructor(){
    super();
    this.closeModal = this.closeModal.bind(this)

  }

  // モーダルを閉じる。contentは空文字列にリセット
  closeModal() {
    this.props.history.goBack() //マイページから来てもトップページから来てもいいようにgoBackに修正(サインアウトのみマイページから来れる)
    // ※マイページからサインアウトした時はマイページに繊維→一度アラートを出してからトップページに戻る。コードはMypage.jsxに記載
  }

  componentDidMount(){
    const cookies = new Cookies()
    //ブラウザバックしたときにURLに応じてモーダルの表示を切り替える
    this.props.history.listen((location) => {
      if (location.pathname == '/') {
        // ブラウザバックしたときrootパスにいればモーダルを閉じる
        
      }
      if (!JSON.parse(cookies.get("authToken"))['uid']) {
        if (location.pathname == '/users/sign_up') {
          // ブラウザバックしたときもパスがあっていれば新規登録モーダルを開く
          
        }
        if (location.pathname == '/users/sign_in') {
          // ブラウザバックしたときもパスがあっていればログインモーダルを開く
          
        }
        if (location.pathname == '/users/sign_out') {
          // ログアウト時にログアウトのモーダルは開けないようにする
          alert('ユーザーがログインしていません')
          this.closeModal()
        }
      } else {
        if (location.pathname == '/users/sign_out') {
          // ブラウザバックしたときもパスがあっていればログアウトモーダルを開く
          
        } else if (location.pathname == '/users/sign_up' || location.pathname == '/users/sign_in')  {
          // ログイン時にログイン・新規登録のモーダルは開けないようにする
          alert('ログイン・新規登録するにはログアウトしてください')
          this.closeModal()
        }
      }
    });
  }

  render () {
    const cookies = new Cookies()
    const authToken = cookies.get("authToken")
    if (authToken == undefined || !authToken) { //undefinedのときも判定することで初回リロード時のエラーを防ぐ
    return (
          <HeaderContainer>
            {this.props.children}
            <HeaderTitle>
              <Link to="/">
                <img src={Logo} alt="私の推薦図書" width="200" height="60"/> {/* ロゴの高さはヘッダーより5pxだけ小さい */}
              </Link>
            </HeaderTitle>
            <HeaderRight>
              <Link to={{pathname: "/users/sign_up/menu", state: {content: 'SignUp', show: true}}}>
                新規登録
              </Link>
              <Link to={{pathname: "/users/sign_in/menu", state: {content: 'SignIn', show: true}}}>
                ログイン
              </Link>
                {/* ゲストユーザーログインは別途フロント実装のブランチで実装予定  */}
            </HeaderRight>
        </HeaderContainer>
      )  
    } else {
    return (
         // 以下はログインしているときのみ表示
      <HeaderContainer>
        {this.props.children}
        <HeaderTitle>
          <Link to="/">
            <img src={Logo} alt="俺の推薦図書" width="200" height="60"/> {/* ロゴの高さはヘッダーより5pxだけ小さい */}
          </Link>
        </HeaderTitle>
        <HeaderRight>
        <Link to={{pathname: "/users/sign_out", state: {content: 'SignOut'}}}>
            ログアウト
          </Link>
          <Link to="/mypage">
            マイページ
          </Link>
        </HeaderRight>
      </HeaderContainer>
      )
    }
  } 
}

// ヘッダーのスタイル
const HeaderContainer = styled.header`
  display: flex;
  justify-content: space-between;
  background-color: #cb4d00;
  height: 65px;
`;

const HeaderTitle = styled.h1`
  color: #FFF;
  margin: 0;
  line-height: 65px;
  margin-left: 16%;
`;

const HeaderRight = styled.div`
  display: flex;
  justify-content: end;
  height: 65px;
  width: 500px;

  & a {
  color: #FFF;
  line-height: 40px;
  display: inline-block;
  font-size: 16px;
  border: 1px solid #FFF;
  border-radius: 2px;
  height: 40px;
  padding: 5px 10px;
  margin: 5px 5px 5px 10px;
  text-decoration: none;
  }

  & a:hover {
    cursor: pointer;
    font-weight: bold;
  }
`


// export default Header;
export default withRouter(Header);