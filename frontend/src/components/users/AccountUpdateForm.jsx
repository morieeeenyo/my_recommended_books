import React, { Component } from 'react';
import styled from 'styled-components';

// react-router用のlinkを使えるようにする
import { withRouter } from 'react-router-dom'

//axiosの読み込み
import axios from 'axios';

//コンポーネント読み込み
import {ModalOverlay} from "../users/UserModalForm.jsx"
import {ModalMenuContent} from "../users/UserModalMenu.jsx"
import {ErrorMessage} from "../users/UserModalForm.jsx"
import {UserFromContent} from "../users/UserModalForm.jsx"
import {FormBlock} from "../users/UserModalForm.jsx"

// Cookieの読み込み
import Cookies from 'universal-cookie';


class AccountUpdateForm extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      user: {
        nickname: '',        
        email: '',        
        password: '',        
        password_confirmation: '',        
      },
      avatar: {
        data: '',
        filename: ''
      },
      errors: []
    }
    this.formSubmit = this.formSubmit.bind(this)
    this.updateForm = this.updateForm.bind(this)
    this.getCsrfToken = this.getCsrfToken.bind(this)
    this.setAxiosDefaults = this.setAxiosDefaults.bind(this)
    this.updateCsrfToken = this.updateCsrfToken.bind(this)
    this.authenticatedUser = this.authenticatedUser.bind(this)
  }

  componentDidMount() {
    this.setState({
      user: this.props.location.state.user
    })
    const cookies = new Cookies();
    if (cookies.get('first_session')) {
      // SNS認証での初回ログイン時の挙動
      document.getElementById('first_session_message').innerHTML = "ご登録いただきありがとうございます！" + "<br>" + "まずはプロフィールの設定をしましょう。"
      cookies.remove('first_session')
    }
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
    this.setAxiosDefaults();
    if(!this.props.isSignedIn) { 
      alert('ユーザーがログインしていません。')
      return this.props.hisotyr.push('/welcome')
    }
    // props.content,つまりモーダルの種類ごとに処理を分ける
    if (this.props.location.state.content == 'Edit Profile') {
      axios
      .patch('/api/v1/users', {user: {nickname: this.state.user.nickname, avatar: this.state.avatar }} )
      .then(response => {
        this.updateCsrfToken(response.headers['x-csrf-token']) //クライアントからデフォルトで発行されたcsrf-tokenを使い回せるようにする
        this.authenticatedUser(response.headers['uid'], response.headers['client'], response.headers['access-token']) //uid, client, access-tokenの3つをログアウトで使えるようにする
        // stateをリセットすることで再度モーダルを開いたときにフォームに値が残らないようにする
        this.setState({
          user: {},
          errors: [],
          avatar: {}
        })
        this.props.history.push({pathname: '/mypage', state: {user: response.data.user, avatar: response.data.avatar}})
        // this.props.history.push('/mypage')
        return response
      })
      .catch(error => {
        console.log(error)
        if (error.response.data && error.response.data.errors) {
          this.setState({
            errors: error.response.data.errors //エラーメッセージの表示
          })
        }
      })
    }
  }

  updateForm(e) {
    // ネストされたオブジェクトのdataまでアクセスしておく
    const user = this.state.user;
    const avatar = this.state.avatar;

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
              avatar.data = reader.result
              avatar.filename = file.name 
            }
            reader.readAsDataURL(file) //戻り値はata:image/jpeg;base64,/9j/4AA…のようになる。これをサーバーサイドで複合する
            break;
    }
    this.setState({
      user: user,
      avatar: avatar
    })
  }

  render() {
    if (this.props.location.state.show) {
        if(this.props.location.state.content == 'Edit Profile') {
          return (
          <ModalOverlay onClick={() => this.props.history.push('/mypage')}> 
            <ModalMenuContent onClick={(e) => e.stopPropagation()}> 
            {/* モーダル内部をクリックしたときは閉じない */}
              <p>{this.props.location.state.content}</p>
              <FirstSessionMessage id="first_session_message"></FirstSessionMessage>
              <UserFromContent onSubmit={this.formSubmit}>
                <ErrorMessage errors={this.state.errors}></ErrorMessage>
                <FormBlock>
                  <label htmlFor="nickname">ニックネーム(必須)</label>
                  <input type="text" name="nickname" id="nickname" onChange={this.updateForm} value={this.props.location.state.user.nickname}/>
                </FormBlock>
                <FormBlock>
                  <label htmlFor="avatar">アバター画像(任意)</label>
                  <input type="file" name="avatar" id="avatar" onChange={this.updateForm} accept="image/*,.png,.jpg,.jpeg,.gif"/>
                </FormBlock>
                <FormBlock>
                  <input type="submit" onChange={this.updateForm} value={this.props.location.state.content} id="submit_btn"/>
                </FormBlock>
              </UserFromContent>
              <button onClick={() => this.props.history.push('/mypage')}>x</button>
            </ModalMenuContent>
          </ModalOverlay>
          )
        }
  
      if(this.props.location.state.content == 'Change Email') {
        return (
          <ModalOverlay onClick={() => this.props.history.push('/mypage')}> 
              <ModalMenuContent onClick={(e) => e.stopPropagation()}> 
              {/* モーダル内部をクリックしたときは閉じない */}
                <p>{this.props.location.state.content}</p>
                <UserFromContent onSubmit={this.formSubmit}>
                  <ErrorMessage errors={this.state.errors}></ErrorMessage>
                  <FormBlock>
                    <label htmlFor="email">メールアドレス(必須)</label>
                    <input type="email" name="email" id="email" placeholder="@を含む形式" onChange={this.updateForm} value={this.props.location.state.user.email}/>
                  </FormBlock>
                  <FormBlock>
                    <input type="submit" onChange={this.updateForm} value={this.props.location.state.content} id="submit_btn"/>
                  </FormBlock>
                </UserFromContent>
                <button onClick={() => this.props.history.push('/mypage')}>x</button>
              </ModalMenuContent>
            </ModalOverlay>
        )
      }
  
      if(this.props.location.state.content == 'Change Password') {
        return (
          <ModalOverlay onClick={() => this.props.history.push('/mypage')}> 
              <ModalMenuContent onClick={(e) => e.stopPropagation()}> 
              {/* モーダル内部をクリックしたときは閉じない */}
                <p>{this.props.location.state.content}</p>
                <UserFromContent onSubmit={this.formSubmit}>
                  <ErrorMessage errors={this.state.errors}></ErrorMessage>
                  <FormBlock>
                    <label htmlFor="password">パスワード(必須)</label>
                    <input type="password" name="password" id="password" placeholder="英小文字・大文字・数字を全て含み8文字以上" onChange={this.updateForm} value={this.props.location.state.user.password}/>
                  </FormBlock>
                  <FormBlock>
                    <label htmlFor="password_confirmation">パスワード(確認)</label>
                    <input type="password" name="password_confirmation" id="password_confirmation" placeholder="同じものを入力" onChange={this.updateForm} value={this.props.location.state.user.password_confirmation}/>
                  </FormBlock>
                  <FormBlock>
                    <input type="submit" onChange={this.updateForm} value={this.props.location.state.content} id="submit_btn"/>
                  </FormBlock>
                </UserFromContent>
                <button onClick={() => this.props.history.push('/mypage')}>x</button>
              </ModalMenuContent>
            </ModalOverlay>
        )
      }
    } else {
      return null
    }
  }     // URLのパスパラメータを取得。location.state.contentはキャメルケースなのでスネークケースのデータを取得したい(例：SignUP→sign_up)
}

const FirstSessionMessage = styled.span`
/* SNS認証での初回ログイン時に表示するメッセージ */
  color: red;
  text-align: center;
  margin: 0 auto;
  display: block;
`


export default withRouter(AccountUpdateForm);