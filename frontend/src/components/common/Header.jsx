import React, { Component } from 'react';
import styled from 'styled-components';

// コンポーネントの読み込み
import UserModal from './UserModal.jsx';

// ロゴ画像の読み込み
import Logo from '../../../images/logo.jpg'

class Header extends React.Component {
  constructor(){
    super();
    this.state = {
      showModal: false,
      content: '',
    }
    this.openSignUpModal = this.openSignUpModal.bind(this)
    this.openLoginModal = this.openLoginModal.bind(this)
    this.closeModal = this.closeModal.bind(this)
    this.submitUserForm = this.submitUserForm.bind(this)
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
      content: 'Login'
      // showLoginModal: true
    })
  }

  closeModal() {
    this.setState ({
      showModal: false,
      content: ''
    })
  }

  submitUserForm(e) {
    e.preventDefault()
    console.log(e.target)

  }

  render () {
    return (
      <HeaderContainer>
        <HeaderTitle>
          <img src={Logo} alt="俺の推薦図書" width="200" height="60"/> {/* ロゴの高さはヘッダーより5pxだけ小さい */}
        </HeaderTitle>
        <HeaderRight>
          <HeaderLink onClick={this.openSignUpModal}>
            新規登録
          </HeaderLink>
          <HeaderLink onClick={this.openLoginModal}>
            ログイン
          </HeaderLink>
            <UserModal show={this.state.showModal} closeModal={this.closeModal} content={this.state.content} submit={this.submitUserForm}/> {/* stateのcontentでログインと新規登録を分岐 */}
          <HeaderLink onClick={this.openModal}>
            ゲストユーザーとしてログイン {/* ゲストユーザーログインは別途フロント実装のブランチで実装予定 */}
          </HeaderLink>
        </HeaderRight>
      </HeaderContainer>
    )
  } 
}

// ヘッダーのスタイル
const HeaderContainer = styled.header`
  display: flex;
  justify-content: space-between;
  background-color: #fffaeb;
  height: 65px;
`;

const HeaderTitle = styled.h1`
  color: #000;
  margin: 0;
  line-height: 65px;
  margin-left: 16%;
`;

const HeaderRight = styled.div`
  display: flex;
  justify-content: space-between;
  height: 65px;
  width: 500px;
  margin-right: 16%;
`

const HeaderLink = styled.a`
  color: #000;
  line-height: 65px;
  display: inline-block;
  font-size: 18px;
  &:hover {
    cursor: pointer;
    font-weight: bold;
  }
`


export default Header;