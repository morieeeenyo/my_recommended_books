import React, { Component } from 'react';

// react-routerの読み込み
import { BrowserRouter as Router, Route } from "react-router-dom";

// コンポーネントの読み込み
import Header from './Header.jsx'
import UserModal from './UserModal.jsx'
import Container from './Container.jsx'
import MyPage from '../users/MyPage.jsx'


class App extends React.Component {
  render () {
    return (
      <div className="container">
        <Router>
          <Header>
          </Header>
          <Container>
          </Container>
          <Route path="/users/:content" component={UserModal}/>
          <Route path="/users/:id" component={MyPage}/>
        </Router>
      </div>
    )
  } 
}


export default App;