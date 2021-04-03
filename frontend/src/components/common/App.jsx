import React, { Component } from 'react';

// react-routerの読み込み
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

// コンポーネントの読み込み
import Header from './Header.jsx'
import UserModal from './UserModal.jsx'
import Container from './Container.jsx'
import Index from '../books/Index.jsx'
import NewBookModal from '../books/NewBookModal.jsx'
import MyPage from '../users/MyPage.jsx'


class App extends React.Component {
  render () {
    return (
      <div className="container">
        <Router>
          <Header>
            <Route path="/users/:content" component={UserModal}/>
          </Header>
          <Container>
            <Switch>
              <Route exact path='/'>
                <Index>
                </Index>
              </Route>
              <Route path="/users/mypage">
                <MyPage></MyPage>
              </Route>
            </Switch>
            <Route path="/books/new">
              <NewBookModal></NewBookModal>
            </Route>
          </Container>
        </Router>
      </div>
    )
  } 
}


export default App;