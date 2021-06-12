import React, { Component } from 'react';
import styled from 'styled-components';

// react-routerの読み込み
import { Link } from "react-router-dom";

// Helmetの読み込み(twitterカード使用するmetaタグを設定)
import { Helmet } from "react-helmet";

class Welcome extends React.Component {

  constructor(props){
    super(props);
  }

  componentDidMount() {
    // 書籍投稿ボタンが表示されている場合消す(removeだとエラーが出る)
    const newBookLink = document.getElementById('new_book_link')
    if (newBookLink) {
      newBookLink.setAttribute('style', 'display: none;')
    }
  }

  render (){
    return(
    <WelcomeWrapper>
    <Helmet 
      meta = {[
      { name: 'twitter:card', content: 'summary' },
      { property: 'og:image', content: "https://kaidoku.s3.ap-northeast-1.amazonaws.com/public/header_logo.png" },
      { property: 'og:title', content: '【Welcome】Kaidoku - 読書とアウトプットを通じて人生を面白く' },
      { property: 'og:description', content: 'Kaidokuはアウトプットを通じて人生をより面白くすることを目指した読書アプリです。' },
      { property: 'og:url', content: location.href }
    ]}>    
    </Helmet>
      {/* 一部リンクの遷移先は未実装 */}
      <div className="title">
        <h1>Kaidoku - 会読</h1>
        <p>Kaidokuは読書とアウトプットを通じて人生をより面白くする機会を提供するサービスです。</p>
      </div>
      <div className="heading">
        <div className="heading-left">
          <div className="overlay">
          </div>
        </div>
        <div className="heading-right">
          <div className="overlay">
          </div>
        </div>
      </div>

      <div className="description">
        <div className="description-content">
          <h1>ひとりで</h1>
          <p>書籍別に気づきやアクションプランアウトプットし、共有することができます。
            <br></br>
            まずは以下のリンクから投稿されたアウトプットをチェックしてみましょう。
            <br></br>
            あなたのアウトプットも誰かの役に立つかもしれません。
            <Link to="/books">みんなのアウトプットを見る</Link>
          </p>
        </div>
        <div className="description-content">
          <h1>みんなで</h1>
          <p>一人では読書を習慣化するのが難しい方、読書を通じて人間関係や交流を広めたい方は読書会に参加することができます。
            <br></br>
            まずは以下のリンクから開催予定の読書会をチェックしてみましょう。
            <br></br>
            ※現在開発中
            <Link to="/kaidoku">輪読会を探す</Link>
          </p>
        </div>
      </div>
      <div className="lets-start">
        <p>さぁ、はじめよう</p>
        <Link to={{pathname: "/users/sign_in/menu", state: {content: 'SignIn', show: true}}} className="sign_up">新規登録</Link>
        <Link to="/kaidoku" className="guest">ゲストとしてログイン</Link>
      </div>
    </WelcomeWrapper>
    )
  }
}

const WelcomeWrapper = styled.div`
  background-color: #F4F5F7;
  /* ヘッダーを抜いた高さ */
  height: 100%; 

  .title {
    margin: 0 auto;
    width: 60%;
    & h1, p {
      color: #000;
      text-align: center;
    }

    & h1 {
      margin: 0;
      font-size: 64px;
    }

    & p {
      font-size: 24px;
    }
  }

  .heading {
    display: flex;
    height: 50%;


    .heading-right, .heading-left {
      width: 50%;
      position: relative;
      background-position: center;
      background-size: cover;

      & .overlay {
        background-color: #212529;
        opacity: 0.7;
        position: absolute;
        height: 100%;
        width: 100%;
      }
    }

    .heading-left {
      background-image: url("https://kaidoku.s3.ap-northeast-1.amazonaws.com/public/heading_left_image.jpg");
    }

    .heading-right {
      background-image: url("https://kaidoku.s3.ap-northeast-1.amazonaws.com/public/heading_right_image.jpg");
    }
  }

  .description {
    display: flex;

    & .description-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin: 0 auto;
      width: 50%;
    }

    & h1 {
      opacity: 1;
      text-align: center;
      font-size: 32px;
      color: #000
    }

    & p {
      color: #000
    }

    & a {
      display: block;
      margin: 10px auto;
      background-color: #989EAB;
      color: #F4F5F7;
      padding: 5px;
      text-decoration: none;
      text-align: center;
      width: fit-content;
      border-radius: 2px;
    }

    & a:hover {
      border: 1px solid #000;
      color: #000;
      background-color: #FFF;
      font-weight: bold;
      margin-bottom: 8px;
    }
  }

  .lets-start {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 0 auto;
    width: 50%;

    & a {
      display: block;
      margin: 10px auto;
      width: 25%;
      padding: 10px 0;
      text-decoration: none;
      text-align: center;
      border-radius: 2px;
      background-color: #989EAB;
      color: #F4F5F7;
    }

    & a:hover {
      font-weight: bold;
      border: 1px solid #000;
      margin-bottom: 8px;
      background-color: #F4F5F7;
      color: #000;
    }
  }
`

export default Welcome;