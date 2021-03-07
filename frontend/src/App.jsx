import React, { Component } from 'react';
import styled from 'styled-components';

const Header = styled.header`
    display: flex;
`;

class App extends React.Component {
  render () {
    return (
      <div className="container">
        <Header>
          <h1>俺の推薦図書</h1>
          <div className="header-right">
            <a href="" className="user-links">新規登録</a>
            <a href="" className="user-links">ログイン</a>
          </div>
        </Header>
      </div>
    )
  } 
}

export default App;