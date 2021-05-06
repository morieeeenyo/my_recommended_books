import React, { Component } from 'react';
import styled from 'styled-components';

// react-router用のlinkを使えるようにする
import { Link, useParams, useLocation, useHistory } from 'react-router-dom'

//axiosの読み込み
import axios from 'axios';

//コンポーネント読み込み
import {ModalOverlay} from "../users/UserModalForm.jsx"
import {ModalMenuContent} from "../users/UserModalMenu.jsx"


function AccountUpdateModal(props) {
  const location = useLocation();
  const history = useHistory();
  const params = useParams();     // URLのパスパラメータを取得。location.state.contentはキャメルケースなのでスネークケースのデータを取得したい(例：SignUP→sign_up)
  if (location.state.show) {
      return (
      <ModalOverlay onClick={() => history.goBack()}> 
        <ModalMenuContent onClick={(e) => e.stopPropagation()}> 
        {/* モーダル内部をクリックしたときは閉じない */}
          <p>Account Update</p>
          <Link to={{pathname: "/mypage/profile/edit", state: {content: 'Edit Profile', show: location.state.show, user: location.state.user}}} className="email-button">
          <i className="fas fa-user"></i>
            <span>Edit Profile</span>
          </Link>
          <Link to={{pathname: "/mypage/email/edit", state: {content: 'Change Email', show: location.state.show, user: location.state.user}}} className="email-button">
            <i className="fas fa-envelope"></i>
            <span>Change Email</span>
          </Link>
          <Link to={{pathname: "/mypage/password/edit", state: {content: 'Change Password', show: location.state.show, user: location.state.user}}} className="email-button">
          <i className="fas fa-key"></i>
            <span>Change Password</span>
          </Link>

          <button onClick={() => history.goBack()}>x</button>
        </ModalMenuContent>
      </ModalOverlay>
    )
  } else {
    return null
  }
}


export default AccountUpdateModal;