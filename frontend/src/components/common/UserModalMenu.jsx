import React, { Component } from 'react';
import styled from 'styled-components';

//axiosの読み込み
import axios from 'axios';

// react-router用のlinkを使えるようにする
import { Link, withRouter, useLocation, useHistory } from 'react-router-dom'

//コンポーネント読み込み
import {ModalOverlay} from "../common/UserModalForm.jsx"
import {ModalContent} from "../common/UserModalForm.jsx"

function UserModalMenu(props) {
  const location = useLocation();
  const history = useHistory();
  if (location.state.show) {
      return (
      <ModalOverlay onClick={() => history.goBack()}> 
        <ModalMenuContent onClick={(e) => e.stopPropagation()}> 
        {/* モーダル内部をクリックしたときは閉じない */}
          <p>{location.state.content}</p>
          <EmailLink>
            <i className="fas fa-envelope"></i>
            <span>{location.state.content} with Email</span>
          </EmailLink>

          <TwitterLink>
            <i className="fab fa-twitter"></i>
            <span>{location.state.content} with Twitter</span>
          </TwitterLink>

          <button onClick={() => history.goBack()}>x</button>
        </ModalMenuContent>
      </ModalOverlay>
    )
  } else {
    return null
  }
}

const ModalMenuContent = styled(ModalContent)`
  & a {
    display: flex;
    justify-content: space-between;
    align-items: center;
    text-align: center;
    margin: 10px auto;
    border-radius: 2px;
    height: 24px;
    line-height: 24px;
    padding: 6px 12px;
    width: 45%;
    font-size: 16px;

    & i {
      margin: 8px;
    }

    & span {
    font-weight: bold;
  }

  :hover {
    cursor: pointer;
  }
}
` 

const TwitterLink = styled.a`
    background-color: #1DA1F2;
    color: #fff;
`

const EmailLink = styled.a`
    background-color: #fff;
    color: #000;
    border: 1px solid #000;
`


export default UserModalMenu;