import React, { Component } from 'react';
import styled from 'styled-components';

import {withRouter} from 'react-router-dom'

//axiosの読み込み
import axios from 'axios';

// Cookieの読み込み
import Cookies from 'universal-cookie';

export function ErrorMessage(props) {
  if (props.errors.length !== 0) {
    return (
      <ul>
          {props.errors.map(error => {
            return <li key={error}>{error}</li> //returnがないと表示できない
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
  //  file_fieldはvalueをscriptから変更できないので関数内でsetStateを用いて変更 
  if (props.content === 'SignUp') {
    return (
    <UserFromContent onSubmit={props.submit}>
      <ErrorMessage errors={props.errors}></ErrorMessage>
      <FormBlock>
        <label htmlFor="nickname">ニックネーム(必須)</label>
        <input type="text" name="nickname" id="nickname" value={props.user.nickname} onChange={props.change}/>
      </FormBlock>
      <FormBlock>
        <label htmlFor="email">メールアドレス(必須)</label>
        <input type="email" name="email" id="email" placeholder="@を含む形式" value={props.user.email} onChange={props.change}/>
      </FormBlock>
      <FormBlock>
        <label htmlFor="password">パスワード(必須)</label>
        <input type="password" name="password" id="password" placeholder="英小文字・大文字・数字を全て含み8文字以上" value={props.user.password} onChange={props.change}/>
      </FormBlock>
      <FormBlock>
        <label htmlFor="password_confirmation">パスワード(確認)</label>
        <input type="password" name="password_confirmation" id="password_confirmation" placeholder="同じものを入力" value={props.user.password_confirmation} onChange={props.change}/>
      </FormBlock>
      <FormBlock>
        <label htmlFor="avatar">アバター画像(任意)</label>
        <input type="file" name="avatar" id="avatar" accept="image/*,.png,.jpg,.jpeg,.gif" onChange={props.change}/>
      </FormBlock>
      <FormBlock>
        <input type="submit" value="SignUp" id="submit_btn"/>
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
        <input type="submit" value="SignIn" id="submit_btn"/>
      </FormBlock>
    </UserFromContent>
    )
  } 

  if (props.content === 'SignOut') {
    // 他のモーダルと併用しやすいのでform送信でサインアウトする 
    return (
    <UserFromContent onSubmit={props.submit}>
      <ErrorMessage errors={props.errors}></ErrorMessage>
      <FormBlock>
        <input type="submit" value="SignOut" id="submit_btn"/>
      </FormBlock>
    </UserFromContent>
    )
  } 
}


class UserModalForm extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      user: {
        nickname: '',        
        email: '',        
        password: '',        
        password_confirmation: '',        
        avatar: {
          data: '',
          filename: ''
        }  
      },
      errors: []
    }
    this.formSubmit = this.formSubmit.bind(this)
    this.updateForm = this.updateForm.bind(this)
    this.getCsrfToken = this.getCsrfToken.bind(this)
    this.setAxiosDefaults = this.setAxiosDefaults.bind(this)
    this.updateCsrfToken = this.updateCsrfToken.bind(this)
    this.resetErrorMessages = this.resetErrorMessages.bind(this)
    this.authenticatedUser = this.authenticatedUser.bind(this)
  }

  getCsrfToken() {
    if (!(axios.defaults.headers.common['X-CSRF-Token'])) {
      return (
        document.getElementsByName('csrf-token')[0].getAttribute('content') //初回ログイン時新規登録時はheadタグのcsrf-tokenを参照する
      )
    } else {
      return (
        axios.defaults.headers.common['X-CSRF-Token'] //それ以外のときは既にセットしてあるcsrf-tokenを参照
      )
    }
  };

  setAxiosDefaults() {
    axios.defaults.headers.common['X-CSRF-Token'] = this.getCsrfToken();
  };

  updateCsrfToken(csrf_token){
    axios.defaults.headers.common['X-CSRF-Token'] = csrf_token;
  };

  authenticatedUser(uid, client, accessToken) {
    // サーバーから返ってきた値をaxios.defaults.headersにセットして非同期処理で使えるようにする
    axios.defaults.headers.common['uid'] = uid;
    axios.defaults.headers.common['client'] = client;
    axios.defaults.headers.common['access-token'] = accessToken;
    const cookies = new Cookies();
    cookies.set('authToken', JSON.stringify(axios.defaults.headers.common), { path: '/' , maxAge: 60 * 60, secure: true, sameSite: 'Lax'});
  }

  formSubmit(e) {
    e.preventDefault()
    // props.content,つまりモーダルの種類ごとに処理を分ける
    if (this.props.location.state.content == 'SignUp') {
      axios
      .post('/api/v1/users', {user: this.state.user} )
      .then(response => {
        this.updateCsrfToken(response.headers['x-csrf-token']) //クライアントからデフォルトで発行されたcsrf-tokenを使い回せるようにする
        this.authenticatedUser(response.headers['uid'], response.headers['client'], response.headers['access-token']) //uid, client, access-tokenの3つをログアウトで使えるようにする
        // stateをリセットすることで再度モーダルを開いたときにフォームに値が残らないようにする
        this.setState({
          user: {},
          errors: []
        })
        this.props.history.push('/')
        return response
      })
      .catch(error => {
        if (error.response.data && error.response.data.errors) {
          this.setState({
            errors: error.response.data.errors //エラーメッセージの表示
          })
        }
      })
    }

    if (this.props.location.state.content == 'SignIn') {
      axios
      .post('/api/v1/users/sign_in', {user: {email: this.state.user.email, password: this.state.user.password} })
      .then(response => {
        this.updateCsrfToken(response.headers['x-csrf-token']) //クライアントからデフォルトで発行されたcsrf-tokenを使い回せるようにする
        this.authenticatedUser(response.headers['uid'], response.headers['client'], response.headers['access-token'])
        this.setState({
          user: {},
          errors: []
        })
        this.props.history.push('/')
        return response
      })
      .catch(error => {
        if (error.response.data && error.response.data.errors) {
          this.setState({
            errors: error.response.data.errors //エラーメッセージの表示
          })
        }
      })
    }

    if (this.props.location.state.content == 'SignOut') {
      this.setAxiosDefaults();
      if(!this.props.isSignedIn) { return null }
      axios
      .delete('/api/v1/users/sign_out', {uid: axios.defaults.headers.common['uid']})
      .then(response => {
        this.updateCsrfToken(response.headers['x-csrf-token']) //クライアントからデフォルトで発行されたcsrf-tokenを使い回せるようにする
        this.authenticatedUser(response.headers['uid'], response.headers['client'], response.headers['access-token']) //ログアウト時はこれらはundefinedになる
        const cookies = new Cookies();
        cookies.remove('authToken')
        this.setState({
          user: {},
          errors: []
        })
        this.props.history.push('/')
        window.location.reload(true)
        return response
      })
      .catch(error => {
        if (error.response.data && error.response.data.errors) {
          // ログアウトに失敗するケースはあまり想定していないが一応設定
          const errors = [] //ログアウトではエラーメッセージは1つしか出ないがループ処理でレンダリングするために一度配列を作っておく
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
            //画像は事前にvalueを取得できないのでFileReaderを使ってデータを読み取る
            const file = e.target.files[0];
            const reader = new FileReader()
            reader.onload = () => { 
              //以下2つはactivestorageの保存に必要
              user.avatar.data = reader.result
              user.avatar.filename = file.name 
            }
            reader.readAsDataURL(file) //戻り値はata:image/jpeg;base64,/9j/4AA…のようになる。これをサーバーサイドで複合する
            break;
    }
    this.setState({
      user: user
    })
  }

  resetErrorMessages(){
    // モーダルを閉じるときにエラーメッセージが残ったままにならないようにする
    this.setState({
      errors: []
    })
    this.props.close()
  }

  componentDidMount(){
    if (!this.props.isSignedIn) {
      if( location.pathname == '/users/sign_out/form') {
       alert('ユーザーがログインしていません')
       this.props.history.push('/')
     }
    } else {
      if (location.pathname == '/users/sign_in/form' || location.pathname == '/users/sign_up/form') {
        alert('ログイン・新規登録するにはログアウトしてください')
        this.props.history.push('/')
      }
    }
  }

  render () {
    if (this.props.location.state.show) {
      // マイページ→サインアウトモーダル→やっぱやめた、の場合を想定してgoBackにする
      if (this.props.location.state.content == 'SignOut') {
        return(
            <ModalOverlay onClick={() => this.props.history.goBack()}> 
            <ModalContent onClick={(e) => e.stopPropagation()}> {/* モーダル内部をクリックしたときは閉じない */}
                <p>{this.props.location.state.content}</p>
                <button onClick={() => this.props.history.goBack()}>x</button>
              <UserFrom content={this.props.location.state.content} submit={this.formSubmit} user={this.state.user} change={this.updateForm} errors={this.state.errors}/>
            </ModalContent>
          </ModalOverlay>
        )
      } else {
        return (
          <ModalOverlay onClick={() => this.props.history.push('/')}> 
          <ModalContent onClick={(e) => e.stopPropagation()}> {/* モーダル内部をクリックしたときは閉じない */}
              <p>{this.props.location.state.content}</p>
              <button onClick={() => this.props.history.push('/')}>x</button>
            <UserFrom content={this.props.location.state.content} submit={this.formSubmit} user={this.state.user} change={this.updateForm} errors={this.state.errors}/>
          </ModalContent>
        </ModalOverlay>
     )
   }
  } else {
    return null; //closeModalメソッドが動くとHeader.jsx内のstateが変更され、propsのshowがfalseになる
  }
 }
}

// モーダルのスタイル
export const ModalOverlay = styled.div `
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



export const ModalContent = styled.div `
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
    font-weight: bold;
  }

`

export const UserFromContent = styled.form `
  display: flex;
  flex-direction: column;
  align-items: center;
  height: fit-content;

  & ul {
    padding: 0 30px;
  }

  & li {
    color: red;
    font-size: 12px;
  }
` 

export const FormBlock = styled.div `
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

  & #submit_btn {
    background-color: lightgray;
    color: #FFF;
    height: 24px;
    line-height: 24px;
    font-size: 18px;
    border-style: none;
    border-radius: 2px;
  }

  /* ホバー時にクリックできることがわかりやすくなるようにする */
  & #submit_btn:hover {
    background-color: #535F78;
    cursor: pointer;
  }
`

export default withRouter(UserModalForm);