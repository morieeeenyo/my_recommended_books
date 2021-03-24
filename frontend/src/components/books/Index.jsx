import React, { Component } from 'react';

// react-routerの読み込み
import { Link } from "react-router-dom";

class Index extends React.Component {
  render () {
    return (
      <div className="container">
        <div className="new-books-link">
          <Link to="/books/new" style={{paddingRight: "5px"}}>投稿する</Link>
        </div>
      </div>
    )
  } 
}


export default Index;