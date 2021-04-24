import React, { Component } from 'react';
import styled from 'styled-components';

//コンポーネントの読み込み
import {FormBlock} from "../common/UserModal.jsx"
import OutputModal from '../outputs/OutputModal.jsx'

// react-router用のlinkを使えるようにする
import { Link,withRouter } from 'react-router-dom'

//axiosの読み込み
import axios from 'axios';

//momentの読み込み(日付の表示)
import moment from 'moment'


class MyOutputs extends React.Component {
  constructor(props){
    super(props);
    this.state ={
      outputs: []
    }
    this.getCsrfToken = this.getCsrfToken.bind(this)
    this.setAxiosDefaults = this.setAxiosDefaults.bind(this)
    this.userAuthentification = this.userAuthentification.bind(this)
  }

  getCsrfToken() {
    if (!(axios.defaults.headers.common['X-CSRF-Token'])) {
      return (
        document.getElementsByName('csrf-token')[0].getAttribute('content') //初回ログイン時新規登録時はheadタグのcsrf-tokenを参照する
      )
    } else {
      return (
        axios.defaults.headers.common['X-CSRF-Token'] //それ以外のときは既にセットしてあるcsrf-tokenを参照
      )
    }
  };

  setAxiosDefaults() {
    axios.defaults.headers.common['X-CSRF-Token'] = this.getCsrfToken();
  };

  userAuthentification() {
    const authToken = JSON.parse(localStorage.getItem("auth_token"));
    // uid, client, access-tokenの3つが揃っているか検証
    if (authToken['uid'] && authToken['client'] && authToken['access-token']) { 
      axios.defaults.headers.common['uid'] = authToken['uid']
      axios.defaults.headers.common['client']  = authToken['client']
      axios.defaults.headers.common['access-token']  = authToken['access-token']
      return authToken
    } else {
      return null
    }
  }

  componentDidMount() {
    this.setAxiosDefaults();
    const authToken = this.userAuthentification()
    axios
      .get('/api/v1/users/mypage/books/' + this.props.location.state.book.id + '/outputs')
      .then(response => {
        this.setState({
            outputs: response.data.outputs
          }
        )
      })
      .catch(error => {
        if (error.response.data && error.response.data.errors) {
          // ログアウトに失敗するケースはあまり想定していないが一応設定
          const errors = [] //ログアウトではエラーメッセージは1つしか出ないがループ処理でレンダリングするために一度配列を作っておく
          errors.push(error.response.data.errors) 
          this.setState({
            errors: errors
          })
        }
      })

  }

  render () {
    return (
      <OutputWrapper>
        <OutputContent>
            <div className="output-header">
            {/* this.props.location.state.bookでリンクから書籍情報を取得 */}
              <h4>『{this.props.location.state.book.title}』のアウトプット</h4>
              {/* スタイルはMyPage→MyOutputsへのリンクと同じ */}
              <Link to={{pathname: "/books/" + this.props.location.state.book.id + "/outputs/new", state: {book: this.props.location.state.book}}}>
                アウトプットを投稿する
              </Link>
            </div>
            <OutputList>
              {/* Todo:編集ボタンをつける */}
              {this.state.outputs.map((output, output_index) => {
                return(
                  <li key={output_index}>
                  <h3 className="output-header output-content-header">
                    アウトプット{output_index + 1}
                    <div class="output-edit-delete-buttons">
                      <Link>編集</Link>  
                      <Link>削除</Link>  
                    </div>  
                  </h3>
                  <h4>気づき</h4>
                  <p>{output.awareness.content}</p>
                  <h4>アクションプラン</h4>
                  {output.action_plans.map((action_plan, action_plan_index) => {
                    return(
                      <div className="action-plan" key={action_plan.id}>
                        <p>・{action_plan.time_of_execution}{action_plan.what_to_do}{action_plan.how_to_do}</p>
                      </div>
                    )
                  })}
                  <p className="posted-date">投稿日：{moment(output.awareness.created_at).format('YYYY-MM-DD')}</p>
                  </li>
                )
              })}
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
        /* 「アウトプットを投稿する」ボタンのスタイル(Mypage.jsxの「アウトプットボタン」と同じ) */
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
  /* heightがないとscrollしない */
  height: 80%;

  .output-header {
    display: flex;
    justify-content: space-between

  }

  & .output-edit-delete-buttons {
    display: flex;
    justify-content: space-between;
    width: 15%;

    & a {
      background-color: #FFF;
      color: #000;
      border: 1px solid #000;
      font-size: 14px;
      font-weight: normal;
      padding: 5px 10px;
    }


  }

  & li {
    border: 1px solid #000;
    border-radius: 5px;
    padding: 10px 15px;
    margin-bottom: 5px;
  }

  & h4 {
    margin-bottom: 2px;
  }

  & p {
    margin: 2px 0;
  }

  .posted-date {
    text-align: right;
    font-size: 12px;
    margin-bottom: 2px;
  }
`


export default withRouter(MyOutputs);