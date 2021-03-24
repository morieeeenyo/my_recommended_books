import React, { Component } from 'react';

// react-routerの読み込み
import { Link } from "react-router-dom";

class NewBook extends React.Component {
  render () {
    return (
      <div className="container">
        <div className="new-books-link">
          <p>これは新規投稿ページです</p>
        </div>
      </div>
    )
  } 
}


export default NewBook;