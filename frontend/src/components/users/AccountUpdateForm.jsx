import React, { Component } from 'react';
import styled from 'styled-components';

// react-router用のlinkを使えるようにする
import { Link, useParams, useLocation, useHistory } from 'react-router-dom'

//axiosの読み込み
import axios from 'axios';

//コンポーネント読み込み
import {ModalOverlay} from "../users/UserModalForm.jsx"
import {ModalMenuContent} from "../users/UserModalMenu.jsx"


function AccountUpdateForm(props) {
  const location = useLocation();
  const history = useHistory();
  const params = useParams();     // URLのパスパラメータを取得。location.state.contentはキャメルケースなのでスネークケースのデータを取得したい(例：SignUP→sign_up)
  if (location.state.show) {
      return (
      <ModalOverlay onClick={() => history.goBack()}> 
        <ModalMenuContent onClick={(e) => e.stopPropagation()}> 
        {/* モーダル内部をクリックしたときは閉じない */}
          <p>Account Update</p>
          

          <button onClick={() => history.goBack()}>x</button>
        </ModalMenuContent>
      </ModalOverlay>
    )
  } else {
    return null
  }
}


export default AccountUpdateForm;