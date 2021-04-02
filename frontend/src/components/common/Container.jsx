import React, { Component } from 'react';
import styled from 'styled-components';

// react-routerの読み込み
import { BrowserRouter as Router, Route } from "react-router-dom";

// コンポーネントの読み込み
import Index from '../books/Index.jsx'
import NewBookModal from '../books/NewBookModal.jsx'


class Container extends React.Component {
  render () {
    return (
      <Wrapper>
        <Router>
          <Route exact path='/' component={Index}/>
          <Route path="/books/new" component={NewBookModal}/>
        </Router>
      </Wrapper>
    )
  } 
}

export const Wrapper  = styled.div `
  width: 65%;
  margin: 0 auto;
`



export default Container;