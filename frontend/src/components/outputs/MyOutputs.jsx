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
            <div className="output-header">
              <h4>『{this.props.location.state.book.title}』のアウトプット</h4>
              <Link to={{pathname: "/books/" + this.props.location.state.book.id + "/outputs/new", state: {book: this.props.location.state.book}}}>
                アウトプットを投稿する
              </Link>
            </div>
            <OutputList>
              <li>
                <h3>アウトプット1</h3>
                <h4>気づき</h4>
                <p>めっちゃおもろい</p>
                <h4>アクションプラン</h4>
                <p>寝る</p>
                <p>投稿日時：2021-04-13</p>
              </li>
              <li>
                <h3>アウトプット2</h3>
                <h4>気づき</h4>
                <p>抱腹絶倒</p>
                <h4>アクションプラン</h4>
                <p>寝る</p>
                <p>投稿日時：2021-04-13</p>
              </li>
              <li>
                <h3>アウトプット3</h3>
                <h4>気づき</h4>
                <p>つまらん</p>
                <h4>アクションプラン</h4>
                <p>寝る</p>
                <p>投稿日時：2021-04-13</p>
              </li>
            </OutputList>
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
  width: 90%;
  margin: 0 auto;

  .output-header {
    display: flex;
    justify-content: space-between;
    align-items: center;

    & a {
        display: inline-block;
        text-decoration: none;
        background-color: #0ACC64;
        color: #FFF;
        border-style: none;
        border-radius: 5px;
        padding: 10px 15px;
        height: 20px;
        line-height: 20px;
      }

      & a:hover {
        cursor: pointer;
        font-weight: bold;
        box-shadow: 0 5px 10px black;
      }

      & a:active {
        box-shadow: 0 0 5px black;
        margin-top: 5px;
      }
  }


`

const OutputList = styled.ul`
  list-style: none;
  overflow: scroll;
  height: 80%;

  & li {
    border: 1px solid #000;
    border-radius: 5px;
    padding: 10px;
    margin-bottom: 5px;
  }
`


export default withRouter(OutputIndex);