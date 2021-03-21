import React, { Component } from 'react';
import Header from '../common/Header.jsx'

// react-routerの読み込み
import { BrowserRouter as Router, Route } from "react-router-dom";

// コンポーネントの読み込み
import UserModal from '../common/UserModal.jsx'


class App extends React.Component {
  render () {
    return (
      <div className="container">
        <Router>
          <Header>
          </Header>
            <Route path="/users/:content" component={UserModal}>
          </Route>
        </Router>
      </div>
    )
  } 
}


export default App;