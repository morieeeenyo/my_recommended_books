import React, { Component } from 'react';
import styled from 'styled-components';

// ロゴ画像の読み込み。ダブルクオートじゃないと本番環境で読み込めない
import Logo from "../../../images/header_logo.png"

// react-router用のlinkを使えるようにする
import { withRouter } from 'react-router-dom'

// react-routerの読み込み
import { Link } from "react-router-dom";

// Cookieの読み込み。localStorageを使用せずCookieを使用する方針に切り替え
import Cookies from 'universal-cookie';


class Header extends React.Component {
  constructor(){
    super();
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
        <Link to={{pathname: "/users/sign_out/form", state: {content: 'SignOut', show: true}}}>
            ログアウト
          </Link>
          <Link to="/mypage" id="link_to_mypage">
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