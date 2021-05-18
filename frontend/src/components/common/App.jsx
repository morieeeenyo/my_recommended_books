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
        axios.defaults.headers.common['X-CSRF-Token'] = this.getCsrfToken();//それ以外のときは既にセットしてあるcsrf-tokenを参照
        // リンクをクリックさせてマイページに遷移する。history.pushだとうまくいかなかった
        document.getElementById('link_to_mypage').click()
      }
      axios.defaults.headers.common['uid'] = authToken['uid']
      axios.defaults.headers.common['client']  = authToken['client']
      axios.defaults.headers.common['access-token']  = authToken['access-token']
      return authToken
    } 
  }

  render () {
    return (
      <div className="container">
        <Router>
          <Header>
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
              <Route exact path='/welcome'>
                <Welcome>
                </Welcome>
              </Route>
              {/* ログアウト時に一覧を表示するために/booksでもアクセスできるようにしておく */}
              <Route exact path='/books'>
                <Index>
                </Index>
              </Route>
              <Route exact path='/books/:isbn/outputs' key={'outputs'}>
                <OutputIndex>
                </OutputIndex>
              </Route>
              <Route exact path="/mypage" key={'mypage'}>
                <MyPage>
                  <Route exact path="/mypage/books">
                    <MyRecommendedBooks>
                    </MyRecommendedBooks>
                  </Route>
                  <Route exact path="/mypage/edit/menu" key={'menu'}>
                    <AccountUpdateModal></AccountUpdateModal>
                  </Route>
                  <Route exact path="/mypage/:content/edit" key={'edit'}>
                    <AccountUpdateForm></AccountUpdateForm>
                  </Route>
                  <Route exact path="/mypage/books/:book_isbn/outputs" key={'myoutputs'}>
                    <MyOutputs></MyOutputs>
                  </Route>
                </MyPage>
              </Route>
            </Switch>
          </Container>
          <Route exact path="/books/new">
            <NewBookModal>
            </NewBookModal>
          </Route>
          <Route exact path="/books/:book_isbn/outputs/new">
            <OutputModal></OutputModal>
          </Route>
        </Router>
      </div>
    )
  } 
}


export default App;