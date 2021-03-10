import React, { Component } from 'react';
import styled from 'styled-components';


function UserModal(props) {
  if (props.show) {
  return (
      <ModalOverlay onClick={props.closeModal}>
        <ModalContent>
          <p>これがモーダルウィンドウです。</p>
          <p><button onClick={props.closeModal}>close</button></p>
        </ModalContent>
      </ModalOverlay>
   )
  } else {
    return null;
  }
}

class Header extends React.Component {
  constructor(){
    super();
    this.state = {
      showSignUpModal: false,
      showLoginModal: false,
    }
    this.openSignUpModal = this.openSignUpModal.bind(this)
    this.openLoginModal = this.openLoginModal.bind(this)
    this.closeSignUpModal = this.closeSignUpModal.bind(this)
    this.closeLoginModal = this.closeLoginModal.bind(this)
  }

  openSignUpModal() {
    this.setState ({
      showSignUpModal: true
    })
  }

  openLoginModal() {
    this.setState ({
      showLoginModal: true
    })
  }

  closeSignUpModal() {
    this.setState ({
      showSignUpModal: false
    })
  }

  closeLoginModal() {
    this.setState ({
      showLoginModal: false
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
              <UserModal show={this.state.showSignUpModal} closeModal={this.closeSignUpModal}/>
            <HeaderLink onClick={this.openLoginModal}>
              ログイン
            </HeaderLink>
              <UserModal show={this.state.showLoginModal} closeModal={this.closeLoginModal}/>
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

// モーダルのスタイル
const ModalOverlay = styled.div `
  /*　画面全体を覆う設定　*/
  position:fixed;
  top:0;
  left:0;
  width:100%;
  height:100%;
  background-color:rgba(0,0,0,0.5);

  /*　画面の中央に要素を表示させる設定　*/
  display: flex;
  align-items: center;
  justify-content: center;
`

const ModalContent = styled.div `
  z-index:2;
  width:50%;
  padding: 1em;
  background:#fff;
`



export default Header;