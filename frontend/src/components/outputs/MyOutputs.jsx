import React, { Component } from 'react';
import styled from 'styled-components';

//コンポーネントの読み込み
import {FormBlock} from "../common/UserModal.jsx"
import OutputModal from '../outputs/OutputModal.jsx'

// react-router用のlinkを使えるようにする
import { Link,withRouter } from 'react-router-dom'


class OutputIndex extends React.Component {
  constructor(props){
    super(props);
    // this.getCsrfToken = this.getCsrfToken.bind(this)
    // this.setAxiosDefaults = this.setAxiosDefaults.bind(this)
    // this.userAuthentification = this.userAuthentification.bind(this)
  }

  render () {
    return (
      <OutputWrapper>
        <OutputContent>
            <h4>『{this.props.location.state.book.title}』のアウトプット</h4>
            <Link to="/books/:book_id/outputs/new">アウトプットを投稿する</Link>
        </OutputContent>
      </OutputWrapper>
     )
   
  } 
}

const OutputWrapper = styled.div`
  height: 100%;
  
`


const OutputContent = styled.div`
  height: 100%;
`


export default withRouter(OutputIndex);