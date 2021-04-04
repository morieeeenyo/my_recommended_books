import React, { Component } from 'react';
import styled from 'styled-components';

// コンポーネントの読み込み
// import {Wrapper} from "../common/Container.jsx"

// react-routerの読み込み
import { Link } from "react-router-dom";

export function MyRecommendedBooks() {
  return (
    <div>
      これは推薦図書一覧です
    </div>
  )
}

export function EditUserInfo() {
  return (
    <div>
      これはユーザー情報の編集フォームです
    </div>
  )
}

export function UserInfo() {
  // ユーザー情報が初期表示
  return (
    <div>
      これはユーザー情報
    </div>
  )
}

class MyPage extends React.Component {
  render () {
    return (
      <MyPageWrapper>
        <MyPageHeader>
          テストさんのマイページ
        </MyPageHeader>
        <MyPageBody>
          <MyPageSideBar>
            <ul>
              {/* サイドバーをクリックするとパスに応じてメインコンテンツが切り替わる */}
              <li>
                <Link to="/users/mypage/recommends">
                  推薦図書一覧
                </Link>
              </li>
              <li>
                <Link to="/users/mypage/edit">
                  プロフィール編集
                </Link>
              </li>
              <li>
                <Link to="/users/:id/books">
                  ログアウト
                </Link>
              </li>
            </ul>
          </MyPageSideBar>
          <MyPageMainContent>
            {/* ここにサイドバーのパスに対応したコンテンツが表示される */}
            {this.props.children}
          </MyPageMainContent>
        </MyPageBody>
      </MyPageWrapper>
    )
  } 
}

const MyPageWrapper = styled.div`
  /* ちょうどヘッダーのロゴと端がそろうようにしている */
  width: 65%; 
  margin: 0 auto;
  padding: 3%; 
`

const MyPageHeader = styled.h4`
  margin: 0;
  font-size: 16px;
  margin-bottom: 10px;
`

const MyPageBody = styled.div`
  display: flex;
  justify-content: space-between;
`

const MyPageSideBar = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  border: 1px solid black;
  width: 15%;

  & ul {
    list-style: none;
    padding: 0;
    margin: 0;
    background-color: #FFF;
    width: 100%;
  }

  & a {
    display: inline-block;
    padding: 10px;
    border-radius: 2px;
    text-decoration: none;
    color: #000;
  }

  & li:hover {
    background-color: #cb4d00;
    cursor: pointer;

    & a {
      color: #FFF;
    }
  }
`

const MyPageMainContent = styled.div`
  width: 80%;
  border: 1px solid black;
  background-color: #FFF;

`

export default MyPage