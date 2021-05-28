import React, { Component } from 'react';

// react-routerの読み込み
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

// コンポーネントの読み込み
import Header from './Header.jsx'
import UserModalForm from '../users/UserModalForm.jsx'
import UserModalMenu from '../users/UserModalMenu.jsx'
import Container from './Container.jsx'
import Welcome from './Welcome.jsx'
import Index from '../books/Index.jsx'
import NewBookModal from '../books/NewBookModal.jsx'
import MyPage from '../users/MyPage.jsx'
import MyOutputs from '../outputs/MyOutputs.jsx'
import {MyRecommendedBooks} from '../users/MyPage.jsx'
import AccountUpdateModal from '../users/AccountUpdateModal.jsx'
import AccountUpdateForm from '../users/AccountUpdateForm.jsx'
import OutputModal from '../outputs/OutputModal.jsx'
import OutputIndex from '../outputs/OutputIndex.jsx'

//axiosの読み込み
import axios from 'axios';

// Cookieの読み込み
import Cookies from 'universal-cookie';


class App extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      isSignedIn: false // 今まで各ページでcookieを読み込んでいた仕様を変更
    }
    this.getCsrfToken = this.getCsrfToken.bind(this)
  }

  // omniauthによる認証時はトップページに遷移したタイミングでcsrfトークンを更新する
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

  componentDidMount() {
    const cookies = new Cookies();
    let authToken = cookies.get("authToken");
    if (authToken) { 
      // omiauth認証時の挙動
      if (cookies.get('first_session')) {
        // 実際にはユーザー情報編集ページに飛ばす処理を入れる。次のブランチで
        axios.defaults.headers.common['X-CSRF-Token'] = this.getCsrfToken();//それ以外のときは既にセットしてあるcsrf-tokenを参照
        // リンクをクリックさせてマイページに遷移する。history.pushだとうまくいかなかった
        document.getElementById('link_to_mypage').click()
      }
      axios.defaults.headers.common['uid'] = authToken['uid']
      axios.defaults.headers.common['client']  = authToken['client']
      axios.defaults.headers.common['access-token']  = authToken['access-token']
      // ログインしたときにはstateをtrueに変更
      this.setState({
        isSignedIn: true
      })
    } 
  }

  componentDidUpdate() {
    const cookies = new Cookies();
    let authToken = cookies.get("authToken");
    if (authToken != undefined) {
      if (!authToken['uid']) {
        // ログアウト時の挙動。ログアウト時に強制でリロードさせてstateを更新させる。
        // stateを変更することでヘッダーの表示を変え、ログアウト状態にする
        cookies.remove('authToken')
        this.setState({
          isSignedIn: false
        })
      }
    }
  }

  render () {
    return (
      <div className="container">
        <Router>
          <Header isSignedIn={this.state.isSignedIn}>
            <Route path="/users/:content/menu">
              <UserModalMenu>
              </UserModalMenu>
            </Route>
            <Route exact path="/users/:content/form">
              <UserModalForm isSignedIn={this.state.isSignedIn}></UserModalForm>
            </Route>
          </Header>
          <Container isSignedIn={this.state.isSignedIn}>
            <Switch>
              <Route exact path='/'>
                {/* ログイン状態に応じて遷移先を変える */}
                {this.state.isSignedIn 
                  ? <Index isSignedIn={this.state.isSignedIn}></Index>
                  : <Welcome></Welcome>
                }
              </Route>
              <Route exact path='/welcome'>
                <Welcome>
                </Welcome>
              </Route>
              {/* ログアウト時に一覧を表示するために/booksでもアクセスできるようにしておく */}
              <Route exact path='/books'>
                <Index isSignedIn={this.state.isSignedIn}>
                </Index>
              </Route>
              <Route exact path='/books/:isbn/outputs' key={'outputs'}>
                <OutputIndex isSignedIn={this.state.isSignedIn}>
                </OutputIndex>
              </Route>
              <Route path="/mypage" key={'mypage'}>
                <MyPage isSignedIn={this.state.isSignedIn}>
                  <Route exact path="/mypage/books">
                    <MyRecommendedBooks>
                    </MyRecommendedBooks>
                  </Route>
                  <Route exact path="/mypage/edit/menu" key={'menu'}>
                    <AccountUpdateModal></AccountUpdateModal>
                  </Route>
                  <Route exact path="/mypage/:content/edit" key={'edit'}>
                    <AccountUpdateForm isSignedIn={this.state.isSignedIn}></AccountUpdateForm>
                  </Route>
                  <Route path="/mypage/books/:book_isbn/outputs" key={'myoutputs'}>
                    <MyOutputs isSignedIn={this.state.isSignedIn}></MyOutputs>
                  </Route>
                </MyPage>
              </Route>
            </Switch>
          </Container>
          <Route exact path="/books/new">
            <NewBookModal isSignedIn={this.state.isSignedIn}>
            </NewBookModal>
          </Route>
          <Route exact path="/books/:book_isbn/outputs/new">
            <OutputModal isSignedIn={this.state.isSignedIn}></OutputModal>
          </Route>
        </Router>
      </div>
    )
  } 
}


export default App;