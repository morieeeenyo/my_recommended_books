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
          <button onClick={() => history.goBack()}>x</button>
        </ModalContent>
      </ModalOverlay>
    )
  } else {
    return null
  }
}


export default UserModalMenu;