import React, { Component } from 'react';
import styled from 'styled-components';

// コンポーネントの読み込み
import {Wrapper} from "../common/Container.jsx"

// react-routerの読み込み
import { Link } from "react-router-dom";


class MyPage extends React.Component {
  render () {
    return (
      <MyPageWrapper>
        <MyPageHeader>
          テストさんのマイページ
        </MyPageHeader>
        <MyPageMain>
          <MyPageSideBar>
            <Link>
              推薦図書一覧
            </Link>
            <Link>
              推薦図書一覧
            </Link>
            <Link>
              推薦図書一覧
            </Link>
            <Link>
              推薦図書一覧
            </Link>
          </MyPageSideBar>
          <MyPageMainContent>
          </MyPageMainContent>
        </MyPageMain>
      </MyPageWrapper>
    )
  } 
}

const MyPageWrapper = styled(Wrapper) `

`

const MyPageHeader = styled.h2`
`
const MyPageMain = styled.div`
  display: flex;
`
const MyPageSideBar = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  border: 1px solid black;

  & a {
    display: inline-block;
    padding: 10px;
    border-bottom: 1px solid black;
    border-radius: 2px;
    text-decoration: none;
    color: #000;
  }
`

const MyPageMainContent = styled.div`
`

export default MyPage