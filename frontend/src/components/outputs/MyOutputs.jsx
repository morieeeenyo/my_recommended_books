import React, { Component } from 'react';
import styled from 'styled-components';

//コンポーネントの読み込み
import {FormBlock} from "../common/UserModalForm.jsx"
import OutputModal from '../outputs/OutputModal.jsx'

// react-router用のlinkを使えるようにする
import { Link,withRouter } from 'react-router-dom'

//axiosの読み込み
import axios from 'axios';

//momentの読み込み(日付の表示)
import moment from 'moment'

// Cookieの読み込み
import Cookies from 'universal-cookie';


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
    const cookies = new Cookies();
    const authToken = cookies.get("authToken");
    // uid, client, access-tokenの3つが揃っているか検証
    if (authToken) { 
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
    this.userAuthentification()
    //MyPage.jsxにてユーザーがログインしていない場合トップページにリダイレクトさせる処理が発火
    axios
      .get('/api/v1/mypage/books/' + this.props.location.state.book.id + '/outputs')
      .then(response => {
        this.setState({
            outputs: response.data.outputs
          }
        )
      })
      .catch(error => {
        if (error.response.data && error.response.data.errors) {
          // 投稿していない書籍のページに行くときなどにエラーが発生することを想定
          //アラートを出すとうまく動かなかった(アラートが2つ出てくる？？？)
          console.log(error) 
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
                  <h3 className="output-header output-list-header">
                    アウトプット{output_index + 1}
                    <div className="output-edit-delete-buttons">
                      {/* ここのリンクは後で実装 */}
                      <Link>編集</Link>  
                      <Link>削除</Link>  
                    </div>  
                  </h3>
                  <h4>気づき</h4>
                  <p>{output.awareness.content}</p>
                  <h4>アクションプラン</h4>
                  <div className="action-plan">
                    {output.action_plans.map(action_plan => {
                    return(
                        <p key={action_plan.id}>・{action_plan.time_of_execution}{action_plan.what_to_do}{action_plan.how_to_do}</p>
                        )
                    })}
                  </div>
                  {/* Railsのcreated_atが汚いので整形 */}
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
    /* 「〜のアウトプット」・「アウトプット1,2,3..」の部分 */
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
        /* 「アウトプットを投稿する」ボタンにホバーしたときの挙動 */
        cursor: pointer;
        font-weight: bold;
        box-shadow: 0 5px 10px black;
      }

      & a:active {
        /* 「アウトプットを投稿する」ボタンにクリックしたときの挙動 */
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

  & .output-edit-delete-buttons {
    /* 編集・削除ボタン */
    display: flex;
    justify-content: space-between;
    width: 15%;

    & a {
      /* 「アウトプットを投稿する」ボタンより目立たなくする */
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
    /* 「気づき」「アクションプラン」というタイトルと実際の内容との幅 */
    margin-bottom: 2px;
  }

  & p {
    /* テキストの幅 */
    margin: 2px 0;
  }

  .posted-date {
    /* 投稿日時 */
    text-align: right;
    font-size: 12px;
    margin-bottom: 2px;
  }
`


export default withRouter(MyOutputs);