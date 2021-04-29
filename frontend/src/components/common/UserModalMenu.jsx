import React, { Component } from 'react';
import styled from 'styled-components';

//axiosの読み込み
import axios from 'axios';

//コンポーネント読み込み
import {ModalOverlay} from "../common/UserModalForm.jsx"
import {ModalContent} from "../common/UserModalForm.jsx"

class UserModalForm extends React.Component {
  constructor(props){
    super(props);
    this.state = {
    }
  }

  render () {
      return (
      <ModalOverlay onClick={this.resetErrorMessages}> {/* closeModalはみたらわかるけどモーダルを閉じる処理 */}
        <ModalContent onClick={(e) => e.stopPropagation()}> {/* モーダル内部をクリックしたときは閉じない */}
            <p>{this.props.content}</p>
            <button onClick={this.resetErrorMessages}>x</button>
        </ModalContent>
      </ModalOverlay>
    )
  }
}


export default UserModalForm;