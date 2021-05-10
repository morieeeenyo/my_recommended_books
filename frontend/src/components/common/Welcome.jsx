import React, { Component } from 'react';
import styled from 'styled-components';

// react-routerの読み込み
import { Link } from "react-router-dom";

// 背景画像の読み込み
import HeadingRightImage from "../../../images/heading_right_image.jpg"
import HeadingLeftImage from "../../../images/heading_left_image.jpg"

class Welcome extends React.Component {

  constructor(props){
    super(props);
  }

  componentDidMount() {
    const newBookLink = document.getElementById('new_book_link')
    if (newBookLink) {
      newBookLink.remove()
    }
  }

  render (){
    return(
    <WelcomeWrapper>
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
            <Link to="books/outputs">みんなのアウトプットを見る</Link>
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
    </WelcomeWrapper>
    )
  }
}

const WelcomeWrapper = styled.div`

  background-color: #F4F5F7;
  /* ヘッダーを抜いた高さ */
  height: calc(100vh - 65px); 

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
      background-image: url(${HeadingLeftImage});
    }

    .heading-right {
      background-image: url(${HeadingRightImage});
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
    }

    & a:hover {
      border: 1px solid #000;
      color: #000;
      background-color: #FFF;
      font-weight: bold;
    }
  }
`

export default Welcome;