import React, { Component } from 'react';

// react-routerの読み込み
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

// コンポーネントの読み込み
import Header from './Header.jsx'
import UserModalForm from '../users/UserModalForm.jsx'
import UserModalMenu from '../users/UserModalMenu.jsx'
import Container from './Container.jsx'
import Index from '../books/Index.jsx'
import NewBookModal from '../books/NewBookModal.jsx'
import MyPage from '../users/MyPage.jsx'
import MyOutputs from '../outputs/MyOutputs.jsx'
import {MyRecommendedBooks} from '../users/MyPage.jsx'
import {UserInfo} from '../users/MyPage.jsx'
import AccountUpdateModal from '../users/AccountUpdateModal.jsx'
import OutputModal from '../outputs/OutputModal.jsx'

//axiosの読み込み
import axios from 'axios';

// Cookieの読み込み
import Cookies from 'universal-cookie';


class App extends React.Component {

  constructor(props){
    super(props);
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
      if (cookies.get('first_session')) {
        // 実際にはユーザー情報編集ページに飛ばす処理を入れる。次のブランチで
        console.log('初回ログイン')
        axios.defaults.headers.common['X-CSRF-Token'] = this.getCsrfToken();//それ以外のときは既にセットしてあるcsrf-tokenを参照
      }
      axios.defaults.headers.common['uid'] = authToken['uid']
      axios.defaults.headers.common['client']  = authToken['client']
      axios.defaults.headers.common['access-token']  = authToken['access-token']
      return authToken
    } else {
      return null
    }
  }

  render () {
    return (
      <div className="container">
        <Router>
          <Header>
            {/* Todo：ここのパスにparamsを渡せるようにする */}
            <Route path="/users/:content/menu">
              <UserModalMenu>
              </UserModalMenu>
            </Route>
            <Route exact path="/users/:content/form">
              <UserModalForm></UserModalForm>
            </Route>
          </Header>
          <Container>
            <Switch>
              <Route exact path='/'>
                <Index>
                </Index>
              </Route>
              <Route path="/mypage">
                <MyPage>
                  <Route exact path="/mypage/books">
                    <MyRecommendedBooks>
                    </MyRecommendedBooks>
                  </Route>
                  <Route path="/mypage/edit/menu">
                    <AccountUpdateModal></AccountUpdateModal>
                  </Route>
                  <Route path="/mypage/books/:book_id/outputs">
                    <MyOutputs></MyOutputs>
                  </Route>
                </MyPage>
              </Route>
            </Switch>
          </Container>
          <Route path="/books/new">
            <NewBookModal>
            </NewBookModal>
          </Route>
          <Route path="/books/:book_id/outputs/new">
            <OutputModal></OutputModal>
          </Route>
        </Router>
      </div>
    )
  } 
}


export default App;