import React, { Component } from 'react';
import styled from 'styled-components';


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

const Header = styled.header`
display: flex;
justify-content: space-around;
background-color: gray;
`;

export default App;