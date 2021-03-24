import React, { Component } from 'react';

// react-routerの読み込み
import { BrowserRouter as Router, Route } from "react-router-dom";

// コンポーネントの読み込み
import Index from '../books/Index.jsx'
import NewBook from '../books/New.jsx'


class Container extends React.Component {
  render () {
    return (
      <div className="container">
        <Router>
          <Route exact path='/' component={Index}/>
          <Route path="/books/new" component={NewBook}/>
        </Router>
      </div>
    )
  } 
}


export default Container;