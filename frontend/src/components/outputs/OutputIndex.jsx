import React, { Component } from 'react';
import styled from 'styled-components';

// react-routerの読み込み
import { Link, withRouter } from "react-router-dom";

//axiosの読み込み
import axios from 'axios';

// コンポーネントの読み込み
import {OutputWrapper} from './MyOutputs.jsx'
import {OutputContent} from './MyOutputs.jsx'
import {OutputList} from './MyOutputs.jsx'

// Cookieの読み込み。localStorageを使用せずCookieを使用する方針に切り替え
import Cookies from 'universal-cookie';

//momentの読み込み(投稿日時の表示)
import moment from 'moment'

// Helmetの読み込み(twitterカード使用するmetaタグを設定)
import { Helmet } from "react-helmet";

class OutputIndex extends React.Component {
  constructor(props){
    super(props);
    this.state ={
      outputs: [],
      myOutputs: [],
      user: {},
      posted: false
    }
    this.getCsrfToken = this.getCsrfToken.bind(this)
    this.setAxiosDefaults = this.setAxiosDefaults.bind(this)
    this.postBook = this.postBook.bind(this)
    this.fetchResources = this.fetchResources.bind(this)
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

  fetchResources() {
    axios
    .get('/api/v1/books/' + this.props.location.state.book.isbn + '/outputs')
    .then(response => {
      // ユーザーがログイン済みかどうかによる条件分岐
      // 引数の内容で条件分岐しちゃってるので本当はよくなさそう
      // サーバー側で条件分岐させるべき？
      if (response.data.user) {
        this.setState({
          outputs: response.data.outputs,
          myOutputs: response.data.myoutputs,
          user: response.data.user,
          posted: response.data.posted
        })
      } else {
        this.setState({
          outputs: response.data.outputs,
          myOutputs: response.data.myoutputs
        })
      }
    })
    .catch(error => {
      if (error.response.data && error.response.data.errors) {
        // 投稿していない書籍のページに行くときなどにエラーが発生することを想定
        //アラートを出すとうまく動かなかった(アラートが2つ出てくる？？？)
        console.log(error) 
      }
    })
  }

  componentDidMount() {
    this.fetchResources()
  }

  componentDidUpdate () {
    if (!this.state.reloaded) {
      // 無限ループを防ぐための条件式
      this.state.reloaded = true
      this.fetchResources()
    }
  }

  postBook(e) {
    e.preventDefault()
    this.setAxiosDefaults();
    let to_be_shared_on_twitter = false
    // ユーザーがSNS認証済みの場合
    if (this.state.user.sns_token && this.state.user.sns_secret) {
      if (confirm('Twitterにシェアしますか？')) {
        to_be_shared_on_twitter = true
      } 
    }
    axios
    .post('/api/v1/books', {book: this.props.location.state.book, to_be_shared_on_twitter: to_be_shared_on_twitter})
    .then(response => {
      // 推薦図書に追加した際に推薦図書追加済みにしつつリンクを「アウトプットを投稿する」に変える
      this.setState({
        posted: true
      })
      return response
    })
    .catch(error => {
      if (error.response.data && error.response.data.errors) {
        this.setState({
          errors: error.response.data.errors
        })
      }
    })
  }

  render () {
    return (
      <OutputIndexWrapper>
        <Helmet 
        meta = {[
        { name: 'charset', content: 'UTF-8'},
        { name: 'twitter:card', content: 'summary' },
        { property: 'og:image', content: "https://kaidoku.s3.ap-northeast-1.amazonaws.com/public/header_logo.png" },
        { property: 'og:title', content: `『${this.props.location.state.book.title}』のアウトプット一覧` },
        { property: 'og:description', content: `『${this.props.location.state.book.title}』に興味をお持ちですか？まずはみんなのアウトプットを覗いてみましょう。` },
        { property: 'og:url', content: location.href }
        ]}>    
        </Helmet>
        <OutputContent>
          <div className="output-header">
          {/* this.props.location.state.bookでリンクから書籍情報を取得 */}
            <h4>『{this.props.location.state.book.title}』のアウトプット</h4>
            {/* スタイルはMyPage→MyOutputsへのリンクと同じ */} 
            
            <div className="header-left">
              {/* ログイン済み、かつ推薦図書に追加ずみではない場合に出る */}
              {!this.state.posted && this.state.user.uid &&
                <a onClick={this.postBook}>
                  推薦図書に追加する
                </a>
              }

              {/* 推薦図書追加済みの場合のみ出る */}
              {this.state.posted && 
                <Link to={{pathname: "/books/" + this.props.location.state.book.isbn + "/outputs/new", state: {book: this.props.location.state.book, user: this.state.user}}}>
                  アウトプットを投稿する
                </Link>
              }
            </div>
          </div>

          {this.state.myOutputs.length > 0 && 
            <h2>自分のアウトプット</h2>
          }
          <MyOutputList>
            {/* Todo:編集ボタンをつける */}
            {this.state.myOutputs.map((output, output_index) => {
              return(
                <li key={output_index} className="myoutputs">
                <h3 className="output-header output-list-header">
                  アウトプット{output_index + 1}
                  <div className="output-edit-delete-buttons">
                    {/* ここのリンクは後で実装 */}
                    <Link to="/">編集</Link>  
                    <Link to="/">削除</Link> 
                  </div>  
                </h3>
                <h4>気づき</h4>
                <p className="awareness">{output.awareness.content}</p>
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
          </MyOutputList>
          
          {this.state.outputs.length > 0 && 
            <h2>みんなのアウトプット</h2>
          }
          <OutputIndexList>
            {/* Todo:編集ボタンをつける */}
            {this.state.outputs.map((output, output_index) => {
              return(
                <li key={output_index} className="outputs-of-others">
                <h3 className="output-header output-list-header">
                  {output.username}さんのアウトプット
                </h3>
                <h4>気づき</h4>
                <p className="awareness">{output.awareness.content}</p>
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
          </OutputIndexList>
        </OutputContent>
      </OutputIndexWrapper>
    )
  }
}

const OutputIndexWrapper = styled(OutputWrapper)`
  width: 85%;
  margin: 0 auto;
`

const OutputIndexList = styled(OutputList)`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  padding: 0;
  height: fit-content;

  & li {
    width: 45%;
    margin: 0 20px 25px 0;
    height: fit-content;
    padding: 5px 15px 15px;

    & .output-edit-delete-buttons {
      width: 18%;
    }
  }
`

const MyOutputList = styled(OutputList)`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  padding: 0;
  height: fit-content;

  & li {
    width: 45%;
    margin: 0 20px 25px 0;
    height: fit-content;
    padding: 5px 15px 15px;

    & .output-edit-delete-buttons {
      width: 18%;
    }
  }
`

export default withRouter(OutputIndex);