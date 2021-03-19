import React, { Component } from 'react';
import styled from 'styled-components';

// コンポーネントの読み込み
import UserModal from './UserModal.jsx';

// ロゴ画像の読み込み
import Logo from '../../../images/header_logo.png'

class Header extends React.Component {
  constructor(){
    super();
    this.state = {
      showModal: false,
      content: '',
      isSignedIn: false
    }
    this.openSignUpModal = this.openSignUpModal.bind(this)
    this.openLoginModal = this.openLoginModal.bind(this)
    this.closeModal = this.closeModal.bind(this)
    this.changeSignInStatus = this.changeSignInStatus.bind(this)
  }

  // 新規登録とログインでモーダルの表示を分けるために別メソッドとして定義
  openSignUpModal() {
    this.setState ({
      showModal: true,
      content: 'SignUp'
    })
  }

  openLoginModal() {
    this.setState ({
      showModal: true,
      content: 'SignIn'
      // showLoginModal: true
    })
  }

  closeModal() {
    this.setState ({
      showModal: false,
      content: ''
    })
  }

  changeSignInStatus() {
    this.setState({
      isSignedIn: true
    })
  }

  render () {
    if (!this.state.isSignedIn) {
    return (
          <HeaderContainer>
            <HeaderTitle>
              <img src={Logo} alt="私の推薦図書" width="200" height="60"/> {/* ロゴの高さはヘッダーより5pxだけ小さい */}
            </HeaderTitle>
            <HeaderRight>
              <HeaderLink onClick={this.openSignUpModal}>
                新規登録
              </HeaderLink>
              <HeaderLink onClick={this.openLoginModal}>
                ログイン
              </HeaderLink>
              <UserModal show={this.state.showModal} close={this.closeModal} content={this.state.content} submit={this.closeModal} signIn={this.changeSignInStatus}/> {/* stateのcontentでログインと新規登録を分岐 */}
                {/* ゲストユーザーログインは別途フロント実装のブランチで実装予定  */}
              <HeaderLink onClick={this.openModal}>
                ゲストユーザーとしてログイン 
              </HeaderLink>
            </HeaderRight>
        </HeaderContainer>
      )  
    } else {
    return (
         // 以下はログインしているときのみ表示
      <HeaderContainer>
        <HeaderTitle>
          <img src={Logo} alt="俺の推薦図書" width="200" height="60"/> {/* ロゴの高さはヘッダーより5pxだけ小さい */}
        </HeaderTitle>
        <HeaderRight>
          <HeaderLink>
            ログアウト
          </HeaderLink>
            <UserModal show={this.state.showModal} closeModal={this.closeModal} content={this.state.content} submit={this.submitUserForm}/> {/* モーダルは仮おき */}
          <HeaderLink>
            マイページ
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
`


export default Header;