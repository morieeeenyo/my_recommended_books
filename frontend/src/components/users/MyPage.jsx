import React, { Component } from 'react';
import styled from 'styled-components';

// コンポーネントの読み込み
import {Wrapper} from "../common/Container.jsx"


class MyPage extends React.Component {
  render () {
    return (
      <MyPageWrapper>
        <MyPageHeader>
          テストさんのマイページ
        </MyPageHeader>
        <MyPageMain>
          <MyPageSideBar>
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
`
const MyPageSideBar = styled.div`
`

const MyPageMainContent = styled.div`
`

export default MyPage