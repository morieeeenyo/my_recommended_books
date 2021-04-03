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

export function Profile() {
  return (
    <div>
      これはプロフィールです
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
        <MyPageMain>
          <MyPageSideBar>
            <ul>
              <li>
                <Link to="/users/mypage/recommends">
                  推薦図書一覧
                </Link>
              </li>
              <li>
                <Link to="/users/mypage/profile">
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
            {this.props.children}
          </MyPageMainContent>
        </MyPageMain>
      </MyPageWrapper>
    )
  } 
}

const MyPageWrapper = styled.div`
  width: 65%; 
  margin: 0 auto;
  padding: 3%; 

`

const MyPageHeader = styled.h4`
  margin: 0;
  font-size: 16px;
  margin-bottom: 10px;
`
const MyPageMain = styled.div`
  display: flex;
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

  & li {
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
`

export default MyPage