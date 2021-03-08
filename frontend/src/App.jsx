import React, { Component } from 'react';
import styled from 'styled-components';


function UserModal(props) {
  if (props.show) {
  return (
      <ModalOverlay>
        <ModalContent>
          <p>これがモーダルウィンドウです。</p>
          <p><button>close</button></p>
        </ModalContent>
      </ModalOverlay>
   )
  } else {
    return null;
  }
}


class App extends React.Component {
  constructor(){
    super();
    this.state = {
      showModal: false,
    }
    this.openModal = this.openModal.bind(this)
  }


  openModal() {
    this.setState ({
      showModal: true
    })
  }

  render () {
    return (
      <div className="container">
        <Header>
          <HeaderTitle>俺の推薦図書</HeaderTitle>
          <HeaderRight>
            <HeaderLink onClick={this.openModal}>
              新規登録
              <UserModal show={this.state.showModal}/>
            </HeaderLink>
            <HeaderLink onClick={this.openModal}>
              ログイン
              <UserModal show={this.state.showModal}/>
            </HeaderLink>
          </HeaderRight>
        </Header>
      </div>
    )
  } 
}

// ヘッダーのスタイル
const Header = styled.header`
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
  width: 200px;
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



export default App;