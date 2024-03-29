import React, { Component } from 'react';
import styled from 'styled-components';

// react-router用のlinkを使えるようにする
import { Link, useParams, useLocation, useHistory } from 'react-router-dom'

//コンポーネント読み込み
import {ModalOverlay} from "../users/UserModalForm.jsx"
import {ModalContent} from "../users/UserModalForm.jsx"

function UserModalMenu(props) {
  const location = useLocation();
  const history = useHistory();
  const params = useParams();     // URLのパスパラメータを取得。location.state.contentはキャメルケースなのでスネークケースのデータを取得したい(例：SignUP→sign_up)
  if (location.state.show) {
      return (
      <ModalOverlay onClick={() => history.goBack()}> 
        <ModalMenuContent onClick={(e) => e.stopPropagation()}> 
        {/* モーダル内部をクリックしたときは閉じない */}
          <p>{location.state.content}</p>
          <Link to={{pathname: "/users/"+ params.content + "/form", state: {content: location.state.content, show: location.state.show}}} className="email-button">
            <i className="fas fa-envelope"></i>
            <span>{location.state.content} with Email</span>
          </Link>

          <TwitterLink href={"/api/v1/users/twitter/?auth_origin_url=" + window.location.origin}>
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

export const ModalMenuContent = styled(ModalContent)`

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
    text-decoration: none; 

    & i {
      margin: 8px;
    }

    & span {
      font-weight: bold;
      display: inline-block;
      margin: 0 auto;
    }

    :hover {
      cursor: pointer;
    }
  }

  & .email-button {
    background-color: #fff;
    color: #000;
    border: 1px solid #000;
  }
` 

const TwitterLink = styled.a`
    background-color: #1DA1F2;
    color: #fff;
`


export default UserModalMenu;