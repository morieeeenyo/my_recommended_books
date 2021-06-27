import React, { Component } from 'react';
import styled from 'styled-components';

// react-router用のlinkを使えるようにする
import { Link,withRouter } from 'react-router-dom'

//axiosの読み込み
import axios from 'axios';

//momentの読み込み(投稿日時の表示)
import moment from 'moment'

// Cookieの読み込み。localStorageを使用せずCookieを使用する方針に切り替え
import Cookies from 'universal-cookie';


class MyOutputs extends React.Component {
  constructor(props){
    super(props);
    this.state ={
      outputs: [],
      reloaded: false // componentDidUpdateの無限ループを防ぐためにリロード済みかどうかを判定するstateを用意
    }
    this.getCsrfToken = this.getCsrfToken.bind(this)
    this.setAxiosDefaults = this.setAxiosDefaults.bind(this)
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
    //MyPage.jsxにてユーザーがログインしていない場合トップページにリダイレクトさせる処理が発火
    axios
    .get('/api/v1/mypage/books/' + this.props.location.state.book.isbn + '/outputs')
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

  componentDidMount() {
    this.setAxiosDefaults();
    this.fetchResources()
  }

  componentDidUpdate () {
    if (!this.state.reloaded) {
      // 無限ループを防ぐための条件式
      this.state.reloaded = true
      this.fetchResources()
    }
  }

  render () {
      return (
        <OutputWrapper>
          <OutputContent>
              <div className="output-header">
              {/* this.props.location.state.bookでリンクから書籍情報を取得 */}
                <h4>『{this.props.location.state.book.title}』のアウトプット</h4>
                {/* スタイルはMyPage→MyOutputsへのリンクと同じ */}
                {this.props.location.state.user && 
                  <Link to={{pathname: "/books/" + this.props.location.state.book.isbn + "/outputs/new", state: {book: this.props.location.state.book, user: this.props.location.state.user}}}>
                    アウトプットを投稿する
                  </Link>
                }
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
                    <p className="posted-date">投稿日：{moment(output.awareness.created_at).format('YYYY-MM-DD')}</p>
                    <h4>気づき</h4>
                    <p className="awareness">{output.awareness.content}</p>
                    <div className="action-plan">
                      {output.action_plans.map((action_plan, action_plan_index) => {
                      return(
                            <div key={action_plan.id} className="action-plan">
                              <h4>アクションプラン{action_plan_index + 1}</h4>
                              <p>{action_plan.what_to_do}</p>
                              <h5>いつやるか</h5>
                              <p>{action_plan.time_of_execution}</p>
                              <h5>実施方法・達成基準</h5>
                              <p>{action_plan.how_to_do}</p>
                            </div>
                          )
                      })}
                    </div>
                    {/* Railsのcreated_atが汚いので整形 */}
                    </li>
                  )
                })}
              </OutputList>
          </OutputContent>
        </OutputWrapper>
       )  
  } 
}

export const OutputWrapper = styled.div`
  height: 100%;
`

export const OutputContent = styled.div`
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
        background-color: #ACC47E;
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

export const OutputList = styled.ul`
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
    padding: 5px 20px 15px;

    & .action-plan > p {
      margin: 0;
    }

    & .action-plan > h5 {
      margin-bottom: 0;
    }
  }

  & h4 {
    /* 「気づき」「アクションプラン」というタイトルと実際の内容との幅 */
    margin-bottom: 2px;
  }

  & p {
    /* テキストの幅 */
    margin: 2px 0;
    text-indent: 1em;
  }

  .posted-date {
    /* 投稿日時 */
    text-align: right;
    font-size: 12px;
    margin-bottom: 2px;
  }
`


export default withRouter(MyOutputs);