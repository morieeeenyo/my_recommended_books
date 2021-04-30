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
        <ModalContent onClick={(e) => e.stopPropagation()}> 
        {/* モーダル内部をクリックしたときは閉じない */}
          <p>{location.state.content}</p>
          <TwitterLink>
            <i className="fab fa-twitter"></i>
            <span>{location.state.content} with Twitter</span>
          </TwitterLink>
          <button onClick={() => history.goBack()}>x</button>
        </ModalContent>
      </ModalOverlay>
    )
  } else {
    return null
  }
}

const TwitterLink = styled.a`
  display: flex;
  justify-content: space-between;
  align-items: center;
  text-align: center;
  margin: 10px auto;
  background-color: #1DA1F2;
  color: #fff;
  border-radius: 2px;
  height: 24px;
  line-height: 24px;
  padding: 6px 12px;
  width: 45%;
  font-size: 16px;

  & i{
    margin: 8px;
  }

  & span {
    font-weight: bold;
  }

  & :hover {
    cursor: pointer;
  }
` 


export default UserModalMenu;