import React, { Component } from 'react';
import styled from 'styled-components';
import UserModal from './UserModal.jsx';

class Header extends React.Component {
  constructor(){
    super();
    this.state = {
      showModal: false,
      content: '',
      // showLoginModal: false,
    }
    this.openSignUpModal = this.openSignUpModal.bind(this)
    this.openLoginModal = this.openLoginModal.bind(this)
    this.closeModal = this.closeModal.bind(this)
  }

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

  render () {
    return (
      <HeaderContainer>
        <HeaderTitle>俺の推薦図書</HeaderTitle>
          <HeaderRight>
            <HeaderLink onClick={this.openSignUpModal}>
              新規登録
            </HeaderLink>
            <HeaderLink onClick={this.openLoginModal}>
              ログイン
            </HeaderLink>
            {/* stateのcontentでログインと新規登録を分岐 */}
              <UserModal show={this.state.showModal} closeModal={this.closeModal} content={this.state.content}/>
            <HeaderLink onClick={this.openModal}>
              ゲストユーザーとしてログイン
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
  background-color: lightgray;
  height: 65px;
`;

const HeaderTitle = styled.h1`
  color: #000;
  font-family: Verdana, sans-serif;
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
  color: #fff;
  line-height: 65px;
  display: inline-block;
  font-size: 18px;
  &:hover {
    cursor: pointer;
    background-color: #fff;
    color: lightgray; 
  }
`


export default Header;