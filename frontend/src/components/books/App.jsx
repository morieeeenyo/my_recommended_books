import React, { Component } from 'react';
import styled from 'styled-components';
import Header from '../common/Header.jsx'


class App extends React.Component {
  constructor(){
    super();
    this.state = {
      showModal: false,
    }
    this.openModal = this.openModal.bind(this)
  }


  openModal() {
    this.setState ({
      showModal: true
    })
  }

  render () {
    return (
      <div className="container">
        <Header>
        </Header>
      </div>
    )
  } 
}


export default App;