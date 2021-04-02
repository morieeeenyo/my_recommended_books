import React, { Component } from 'react';
import styled from 'styled-components';

// コンポーネントの読み込み
import {Wrapper} from "../common/Container.jsx"


class MyPage extends React.Component {
  render () {
    return (
      <MyPageWrapper>
        <MyPageSideBar>
          テストさんのマイページ
        </MyPageSideBar>
        <MyPageMainContent>
        </MyPageMainContent>
      </MyPageWrapper>
    )
  } 
}

const MyPageWrapper = styled(Wrapper) `

`

const MyPageSideBar = styled.div`
`

const MyPageMainContent = styled.div`
`

export default MyPage