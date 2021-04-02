import React, { Component } from 'react';
import styled from 'styled-components';

// コンポーネントの読み込み
import UserModal from './UserModal.jsx';

// ロゴ画像の読み込み
import Logo from '../../../images/header_logo.png'

// react-router用のlinkを使えるようにする
import { withRouter } from 'react-router-dom'

// react-routerの読み込み
import { Link } from "react-router-dom";

//axiosの読み込み
import axios from 'axios';


class Header extends React.Component {
  constructor(){
    super();
    this.state = {
      showModal: false,
      content: '',
    }
    this.openSignUpModal = this.openSignUpModal.bind(this)
    this.openSignInModal = this.openSignInModal.bind(this)
    this.openSignOutModal = this.openSignOutModal.bind(this)
    this.closeModal = this.closeModal.bind(this)
  }

  // 新規登録・ログイン・ログアウトでモーダルの表示を分けるために別メソッドとして定義
  openSignUpModal() {
    this.setState ({
      showModal: true,
      content: 'SignUp'
    })
    this.props.history.push("/users/sign_up");
  }

  openSignInModal() {
    this.setState ({
      showModal: true,
      content: 'SignIn'
    })
    this.props.history.push("/users/sign_in");
  }

  openSignOutModal() {
    this.setState ({
      showModal: true,
      content: 'SignOut'
    })
    this.props.history.push("/users/sign_out");
  }

  // モーダルを閉じる。contentは空文字列にリセット
  closeModal() {
    this.setState ({
      showModal: false,
      content: ''
    })
    this.props.history.push("/");
  }

  componentDidMount(){
    //ブラウザバックしたときにURLに応じてモーダルの表示を切り替える
    this.props.history.listen((location) => {
      if (location.pathname == '/') {
        // ブラウザバックしたときrootパスにいればモーダルを閉じる
        this.setState ({
          showModal: false,
          content: ''
        })
      }
      if (!JSON.parse(localStorage.getItem("auth_token"))['uid']) {
        if (location.pathname == '/users/sign_up') {
          // ブラウザバックしたときもパスがあっていれば新規登録モーダルを開く
          this.setState ({
            showModal: true,
            content: 'SignUp'
          })
        }
        if (location.pathname == '/users/sign_in') {
          // ブラウザバックしたときもパスがあっていればログインモーダルを開く
          this.setState ({
            showModal: true,
            content: 'SignIn'
          })
        }
        if (location.pathname == '/users/sign_out') {
          // ログアウト時にログアウトのモーダルは開けないようにする
          alert('ユーザーがログインしていません')
          this.closeModal()
        }
      } else {
        if (location.pathname == '/users/sign_out') {
          // ブラウザバックしたときもパスがあっていればログアウトモーダルを開く
          this.setState ({
            showModal: true,
            content: 'SignOut'
          })
        } else if (location.pathname == '/users/sign_up' || location.pathname == '/users/sign_in')  {
          // ログイン時にログイン・新規登録のモーダルは開けないようにする
          alert('ログイン・新規登録するにはログアウトしてください')
          this.closeModal()
        }
      }
    });
  }

  render () {
    const authToken = localStorage.getItem("auth_token")
    if (authToken == undefined || !JSON.parse(authToken)['uid']) { //undefinedのときも判定することで初回リロード時のエラーを防ぐ
    return (
          <HeaderContainer>
            {this.props.children}
            <HeaderTitle>
              <img src={Logo} alt="私の推薦図書" width="200" height="60"/> {/* ロゴの高さはヘッダーより5pxだけ小さい */}
            </HeaderTitle>
            <HeaderRight>
              <HeaderLink onClick={this.openSignUpModal}>
                新規登録
              </HeaderLink>
              <HeaderLink onClick={this.openSignInModal}>
                ログイン
              </HeaderLink>
              <UserModal show={this.state.showModal} close={this.closeModal} content={this.state.content}/> {/* stateのcontentでログインと新規登録を分岐 */}
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
          <img src={Logo} alt="俺の推薦図書" width="200" height="60"/> {/* ロゴの高さはヘッダーより5pxだけ小さい */}
        </HeaderTitle>
        <HeaderRight>
          <HeaderLink onClick={this.openSignOutModal}>
            ログアウト
          </HeaderLink>
            <UserModal show={this.state.showModal} close={this.closeModal} content={this.state.content}/> 
          <HeaderLink>
            <Link to="/user/:id">
              マイページ
            </Link>
          </HeaderLink>
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
`

const HeaderLink = styled.a`
  color: #FFF;
  line-height: 40px;
  display: inline-block;
  font-size: 16px;
  border: 1px solid #FFF;
  border-radius: 2px;
  height: 40px;
  padding: 5px 10px;
  margin: 5px 5px 5px 10px;

  &:hover {
    cursor: pointer;
    font-weight: bold;
  }

  & a {
    /* マイページだけreact-router-domのLinkを用いている */
    color: inherit;
    text-decoration: inherit;
  }
`


// export default Header;
export default withRouter(Header);