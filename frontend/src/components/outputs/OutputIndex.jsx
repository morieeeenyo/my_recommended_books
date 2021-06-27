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

//momentの読み込み(投稿日時の表示)
import moment from 'moment'

// metaタグの設定をするコンポーネント
import {MetaTags} from '../common/MetaTags.jsx'

class OutputIndex extends React.Component {
  constructor(props){
    super(props);
    this.state ={
      outputs: [],
      book: {},
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
    .get('/api/v1/books/' + location.pathname.replace(/[^0-9]/g, '') + '/outputs')
    .then(response => {
      // ユーザーがログイン済みかどうかによる条件分岐
      // 引数の内容で条件分岐しちゃってるので本当はよくなさそう
      // サーバー側で条件分岐させるべき？
      if (response.data.user) {
        this.setState({
          outputs: response.data.outputs,
          myOutputs: response.data.myoutputs,
          user: response.data.user,
          posted: response.data.posted,
          book: response.data.book
        })
      } else {
        this.setState({
          outputs: response.data.outputs,
          myOutputs: response.data.myoutputs,
          book: response.data.book
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
    .post('/api/v1/books', {book: this.state.book, to_be_shared_on_twitter: to_be_shared_on_twitter})
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
        <MetaTags title={"『" + this.state.book.title + "』のアウトプット Kaidoku - 読書とアウトプットで人生を面白く"} description="みんなのアウトプット一覧をご覧になれます。"></MetaTags>
        <OutputContent>
          <div className="output-header">
          {/* this.state.bookでリンクから書籍情報を取得 */}
            <h4>『{this.state.book.title}』のアウトプット</h4>
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
                <Link to={{pathname: "/books/" + this.state.book.isbn + "/outputs/new", state: {book: this.state.book, user: this.state.user}}}>
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
                <p className="posted-date">投稿日：{moment(output.awareness.created_at).format('YYYY-MM-DD')}</p>
                <div className="awareness-container">
                  <h4>気づき</h4>
                  <p className="awareness one-indented">{output.awareness.content}</p>
                </div>
                <div className="action-plans">
                  {output.action_plans.map((action_plan, action_plan_index) => {
                    return(
                      <div key={action_plan.id} className="action-plan">
                        <h4>アクションプラン{action_plan_index + 1}</h4>
                        <p className="one-indented">{action_plan.what_to_do}</p>
                        <h5 className="one-indented">いつやるか</h5>
                        <p className="two-indented">{action_plan.time_of_execution}</p>
                        <h5 className="one-indented">実施方法・達成基準</h5>
                        <p className="two-indented">{action_plan.how_to_do}</p>
                      </div>
                      )
                  })}
                </div>
                {/* Railsのcreated_atが汚いので整形 */}
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
                <p className="posted-date">投稿日：{moment(output.awareness.created_at).format('YYYY-MM-DD')}</p>
                <h4>気づき</h4>
                <p className="awareness one-indented">{output.awareness.content}</p>
                <div className="action-plans">
                  {output.action_plans.map((action_plan, action_plan_index) => {
                    return(
                      <div key={action_plan.id} className="action-plan">
                        <h4>アクションプラン{action_plan_index + 1}</h4>
                        <p className="one-indented">{action_plan.what_to_do}</p>
                        <h5 className="one-indented">いつやるか</h5>
                        <p className="two-indented">{action_plan.time_of_execution}</p>
                        <h5 className="one-indented">実施方法・達成基準</h5>
                        <p className="two-indented">{action_plan.how_to_do}</p>
                      </div>
                      )
                  })}
                </div>
                {/* Railsのcreated_atが汚いので整形 */}
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
    height: 370px;
    /* アウトプット詳細ページを作ったらhiddenに変える */
    overflow: scroll;
    padding: 5px 20px 15px;

    & .action-plan > p {
      margin: 0;
      text-indent: 1em;
    }

    & .action-plan > h5 {
      margin-bottom: 0;
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
    height: 370px;
    /* アウトプット詳細ページを作ったらhiddenに変える */
    overflow: scroll;
    padding: 5px 20px 15px;

    & .output-edit-delete-buttons {
      width: 18%;
    }

    & .action-plan > p {
      margin: 0;
    }

    & .action-plan > h5 {
      margin-bottom: 0;
    }

    & .one-indented {
      text-indent: 1em;
    }

    & .two-indented {
      text-indent: 2em;
    }
  }
`

export default withRouter(OutputIndex);