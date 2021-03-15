import React, { Component } from 'react';
import styled from 'styled-components';

function UserFrom(props) {
  // Header.jsxで定義したstateのcontentによって新規登録とログインのフォームを分ける
  // 実際の送信処理はフロント実装のブランチで行う
  if (props.content === 'SignUp') {
    return (
    <UserFromContent onSubmit={props.submit}>
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
      <FormBlock>
        <input type="submit" value="SignUp" id="submit-btn"/>
      </FormBlock>
    </UserFromContent>
    )
  } 
  
  if (props.content === 'Login') {
    return (
    <UserFromContent onSubmit={props.submit}>
      <FormBlock>
        <label htmlFor="email">メールアドレス</label>
        <input type="email" name="email" id="email"/>
      </FormBlock>
      <FormBlock>
        <label htmlFor="password">パスワード</label>
        <input type="password" name="password" id="pasaword"/>
      </FormBlock>
      <FormBlock>
        <input type="submit" value="Login" id="submit-btn"/>
      </FormBlock>
    </UserFromContent>
    )
  } 
}


function UserModal(props) {
  if (props.show) {
  return (
      <ModalOverlay onClick={props.closeModal}> {/* closeModalはみたらわかるけどモーダルを閉じる処理 */}
        <ModalContent onClick={(e) => e.stopPropagation()}> {/* モーダル内部をクリックしたときは閉じない */}
            <p>{props.content}</p>
            <button onClick={props.closeModal}>x</button>
          <UserFrom content={props.content} submit={props.submit}/>
        </ModalContent>
      </ModalOverlay>
   )
  } else {
    return null; //closeModalメソッドが動くとHeader.jsx内のstateが変更され、propsのshowがfalseになる
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

  /* Xボタンのスタイル */
  & button {
    background-color: red;
    color: #FFF;
    height: 20px;
    border-style: none;
    border-radius: 2px;
    font-size: 12px;
    text-align: center;
    position: absolute;
    top: 2%;
    left: 2%;

  }
    /* 青い枠が出ないようにする */
  & button:focus {
    outline: 0;
  } 

  /* ホバー時にクリックできることがわかりやすくなるようにする */
  & button:hover {
    color: red;
    background-color: #fff;
    border: 1px #000 solid;
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

  & #submit-btn {
    background-color: lightgray;
    color: #FFF;
    height: 24px;
    font-size: 18px;
    border-style: none;
    border-radius: 2px;
  }

  /* ホバー時にクリックできることがわかりやすくなるようにする */
  & #submit-btn:hover {
    background-color: #000;
    cursor: pointer;
  }
`

export default UserModal;