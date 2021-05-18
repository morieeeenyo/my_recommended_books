import React, { Component } from 'react';
import styled from 'styled-components';

// react-routerの読み込み
import { Link, withRouter } from "react-router-dom";

//axiosの読み込み
import axios from 'axios';

// コンポーネントの読み込み
import OutputWrapper from './MyOutputs.jsx'
import OutputContent from './MyOutputs.jsx'
import OutputList from './MyOutputs.jsx'

// Cookieの読み込み。localStorageを使用せずCookieを使用する方針に切り替え
import Cookies from 'universal-cookie';

//momentの読み込み(投稿日時の表示)
import moment from 'moment'

class OutputIndex extends React.Component {
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
      .get('/api/v1/books/' + this.props.location.state.book.isbn + '/outputs')
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
      <OutputIndexWrapper>
        <OutputContent>
            <div className="output-header">
            {/* this.props.location.state.bookでリンクから書籍情報を取得 */}
              <h4>『{this.props.location.state.book.title}』のアウトプット</h4>
              {/* スタイルはMyPage→MyOutputsへのリンクと同じ */}
              <Link to={{pathname: "/books/" + this.props.location.state.book.isbn + "/outputs/new", state: {book: this.props.location.state.book, user: this.props.location.state.user}}}>
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
                      <Link to="/">編集</Link>  
                      <Link to="/">削除</Link>  
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
      </OutputIndexWrapper>
    )
  }
}

const OutputIndexWrapper = styled(OutputWrapper)`
  width: 80%;
  margin: 0 auto;
`

export default withRouter(OutputIndex);