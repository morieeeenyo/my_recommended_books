import React, { Component } from 'react';
import styled from 'styled-components';

function UserFrom(props) {
  if (props.content === 'SignUp') {
    return (
    <UserFromContent onSubmit={(e) => e.preventDefault()}>
      <FormBlock>
        <label htmlFor="nickname">ニックネーム</label>
        <input type="text" name="nickname" id="nickname"/>
      </FormBlock>
      <FormBlock>
        <label htmlFor="email">メールアドレス</label>
        <input type="email" name="email" id="email"/>
      </FormBlock>
      <FormBlock>
        <label htmlFor="password">パスワード</label>
        <input type="password" name="password" id="password"/>
      </FormBlock>
      <FormBlock>
        <label htmlFor="password_confirmation">パスワード(確認)</label>
        <input type="password" name="password_confirmation" id="password_confirmation"/>
      </FormBlock>
      <FormBlock>
        <label htmlFor="avatar">アバター画像</label>
        <input type="file" name="avatar" id="avatar"/>
      </FormBlock>
    </UserFromContent>
    )
  } 
  
  if (props.content === 'Login') {
    return (
    <UserFromContent onSubmit={(e) => e.preventDefault()}>
      <FormBlock>
        <label htmlFor="email">メールアドレス</label>
        <input type="email" name="email" id="email"/>
      </FormBlock>
      <FormBlock>
        <label htmlFor="password">パスワード</label>
        <input type="password" name="password" id="pasaword"/>
      </FormBlock>
    </UserFromContent>
    )
  } 
}


function UserModal(props) {
  if (props.show) {
  return (
      <ModalOverlay onClick={props.closeModal}>
        <ModalContent onClick={(e) => e.stopPropagation()}>
            <p>{props.content}</p>
            <button onClick={props.closeModal}>x</button>
          <UserFrom content={props.content}/>
        </ModalContent>
      </ModalOverlay>
   )
  } else {
    return null;
  }
}

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
  width: 24%;
  padding: 1em;
  background:#fff;
  position: relative;
  height: fit-content;

  & p {
    text-align: center;
    font-family: Verdana, sans-serif;
    margin: 0 auto;
    font-size: 24px;
    font-weight: bold;
  }

  & button {
    background-color: red;
    color: #FFF;
    height: 20px;
    border-radius: 50%;
    border-style: none;
    font-size: 12px;
    text-align: center;
    position: absolute;
    top: 2%;
    left: 2%;
  }

  & button:hover {
    color: red;
    background-color: #fff;
    border: 1px solid #000;
    cursor: pointer;
  }
`

const UserFromContent = styled.form `
  display: flex;
  flex-direction: column;
  align-items: center;
  height: fit-content;
` 

const FormBlock = styled.div `
  margin: 10px auto;
  width: 40%;
  display: flex;
  flex-direction: column;

  & label {
    font-size: 16px;
    font-weight: bold;
  }

  & input {
    width: 100%;
  }
`

export default UserModal;