import React, { Component } from 'react';
import styled from 'styled-components';

//axiosの読み込み
import axios from 'axios';

function ErrorMessage(props) {
  if (props.errors.length !== 0) {
    return (
      <ul>
          {props.errors.map(error => {
            return <li key={error}>{error}</li>
          })} 
      </ul>
    )
  } else {
    return null
  }
}

function UserFrom(props) {
  // Header.jsxで定義したstateのcontentによって新規登録とログインのフォームを分ける
  // 実際の送信処理はフロント実装のブランチで行う
  if (props.content === 'SignUp') {
    return (
    <UserFromContent onSubmit={props.submit}>
      <ErrorMessage errors={props.errors}></ErrorMessage>
      <FormBlock>
        <label htmlFor="nickname">ニックネーム</label>
        <input type="text" name="nickname" id="nickname" value={props.user.nickname} onChange={props.change}/>
      </FormBlock>
      <FormBlock>
        <label htmlFor="email">メールアドレス</label>
        <input type="email" name="email" id="email" value={props.user.email} onChange={props.change}/>
      </FormBlock>
      <FormBlock>
        <label htmlFor="password">パスワード</label>
        <input type="password" name="password" id="password" value={props.user.password} onChange={props.change}/>
      </FormBlock>
      <FormBlock>
        <label htmlFor="password_confirmation">パスワード(確認)</label>
        <input type="password" name="password_confirmation" id="password_confirmation" value={props.user.password_confirmation} onChange={props.change}/>
      </FormBlock>
      <FormBlock>
        <label htmlFor="avatar">アバター画像</label>
        <input type="file" name="avatar" id="avatar" value={props.user.avatar} onChange={props.change}/>
      </FormBlock>
      <FormBlock>
        <input type="submit" value="SignUp" id="submit-btn"/>
      </FormBlock>
    </UserFromContent>
    )
  } 
  
  if (props.content === 'SignIn') {
    return (
    <UserFromContent onSubmit={props.submit}>
      <ErrorMessage errors={props.errors}></ErrorMessage>
      <FormBlock>
        <label htmlFor="email">メールアドレス</label>
        <input type="email" name="email" id="email" value={props.user.email} onChange={props.change}/>
      </FormBlock>
      <FormBlock>
        <label htmlFor="password">パスワード</label>
        <input type="password" name="password" id="pasaword" value={props.user.password} onChange={props.change}/>
      </FormBlock>
      <FormBlock>
        <input type="submit" value="Login" id="submit-btn"/>
      </FormBlock>
    </UserFromContent>
    )
  } 
}


class UserModal extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      user: {
        nickname: '',        
        email: '',        
        password: '',        
        password_confirmation: '',        
        avatar: '',  // TODO: ActiveSupport::MessageVerifier::InvalidSignature (ActiveSupport::MessageVerifier::InvalidSignature):を解決したい
      },
      errors: []
    }
    this.formSubmit = this.formSubmit.bind(this)
    this.updateForm = this.updateForm.bind(this)
    this.getCsrfToken = this.getCsrfToken.bind(this)
    this.setAxiosDefaults = this.setAxiosDefaults.bind(this)
    this.updateCsrfToken = this.updateCsrfToken.bind(this)
    this.resetErrorMessages = this.resetErrorMessages.bind(this)
  }

  getCsrfToken() {
    if (!(axios.defaults.headers.common['X-CSRF-Token'])) {
      return (
        document.getElementsByName('csrf-token')[0].getAttribute('content')
      )
    } else {
      return (
        axios.defaults.headers.common['X-CSRF-Token']
      )
    }
  };

  setAxiosDefaults() {
    axios.defaults.headers.common['X-CSRF-Token'] = this.getCsrfToken();
    axios.defaults.headers.common['Accept'] = 'application/json';
  };

  updateCsrfToken(csrf_token){
    axios.defaults.headers.common['X-CSRF-Token'] = csrf_token;
  };

  formSubmit(e) {
    e.preventDefault()
    console.log(this.state.user)
    if (this.props.content == 'SignUp') {
      axios
      .post('/api/v1/users', {user: this.state.user} )
      .then(response => {
        console.log(response.headers)
        this.updateCsrfToken(response.headers['x-csrf-token']) //クライアントからデフォルトで発行されたcsrf-tokenを使い回せるようにする
        this.props.submit() //モーダルを閉じる
        this.setState({
          user: {},
          errors: []
        })
        this.props.signIn()
        return response
      })
      .catch(error => {
        console.error(error); 
        console.log(error.response.data.errors)
        if (error.response.data && error.response.data.errors) {
          this.setState({
            errors: error.response.data.errors
          })
        }
      })
    }
    if (this.props.content == 'SignIn') {
      axios
      .post('/api/v1/users/sign_in', {user: {email: this.state.user.email, password: this.state.user.password} })
      .then(response => {
        this.props.submit()
        this.setState({
          user: {},
          errors: []
        })
        this.props.signIn()
        return response
      })
      .catch(error => {
        if (error.response.data && error.response.data.errors) {
          const errors = [] //新規登録の時のレンダリングと合わせるために配列を作成
          errors.push(error.response.data.errors) 
          this.setState({
            errors: errors
          })
        }
      })
    }
  }

  updateForm(e) {
    // ネストされたオブジェクトのdataまでアクセスしておく
    const user = this.state.user;

    // eventが発火したname属性名ごとに値を処理
    switch (e.target.name) {
        case 'nickname':
            user.nickname = e.target.value;
            break;
        case 'email':
            user.email = e.target.value;
            break;
        case 'password':
            user.password = e.target.value;
            break;
        case 'password_confirmation':
            user.password_confirmation = e.target.value;
            break;
        case 'avatar':
            user.avatar = e.target.value;
            break;
    }
    this.setState({
      user: user
    })
  }

  resetErrorMessages(){
    this.setState({
      errors: []
    })
    this.props.close()
  }

  render () {
    if (this.props.show) {
      return (
        <ModalOverlay onClick={this.resetErrorMessages}> {/* closeModalはみたらわかるけどモーダルを閉じる処理 */}
        <ModalContent onClick={(e) => e.stopPropagation()}> {/* モーダル内部をクリックしたときは閉じない */}
            <p>{this.props.content}</p>
            <button onClick={this.resetErrorMessages}>x</button>
          <UserFrom content={this.props.content} submit={this.formSubmit} user={this.state.user} change={this.updateForm} errors={this.state.errors}/>
        </ModalContent>
      </ModalOverlay>
   )
  } else {
    return null; //closeModalメソッドが動くとHeader.jsx内のstateが変更され、propsのshowがfalseになる
  }
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

  & li {
    list-style: none;
    color: red;
    font-size: 12px;
  }
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