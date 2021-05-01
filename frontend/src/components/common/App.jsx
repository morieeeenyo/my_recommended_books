import React, { Component } from 'react';

// react-routerの読み込み
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

// コンポーネントの読み込み
import Header from './Header.jsx'
import UserModalForm from './UserModalForm.jsx'
import UserModalMenu from './UserModalMenu.jsx'
import Container from './Container.jsx'
import Index from '../books/Index.jsx'
import NewBookModal from '../books/NewBookModal.jsx'
import MyPage from '../users/MyPage.jsx'
import MyOutputs from '../outputs/MyOutputs.jsx'
import {MyRecommendedBooks} from '../users/MyPage.jsx'
import {EditUserInfo} from '../users/MyPage.jsx'
import OutputModal from '../outputs/OutputModal.jsx'

//axiosの読み込み
import axios from 'axios';

// Cookieの読み込み
import Cookies from 'universal-cookie';


class App extends React.Component {

  componentDidMount() {
    const cookies = new Cookies();
    let authToken = cookies.get("authToken");
    // uid, client, access-tokenの3つが揃っているか検証
    if (authToken) { 
      if (authToken['uid'] == undefined) {
        authToken = JSON.parse(authToken)
      }
      axios.defaults.headers.common['uid'] = authToken['uid']
      axios.defaults.headers.common['client']  = authToken['client']
      axios.defaults.headers.common['access-token']  = authToken['access-token']
      console.log(axios.defaults.headers.common)
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
                  <Route path="/mypage/edit">
                    <EditUserInfo></EditUserInfo>
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