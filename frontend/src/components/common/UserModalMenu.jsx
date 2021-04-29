import React, { Component } from 'react';
import styled from 'styled-components';

//axiosの読み込み
import axios from 'axios';

class UserModalForm extends React.Component {
  constructor(props){
    super(props);
    this.state = {
    }
  }

  render () {
    if (this.props.show) {
      return (
        <ModalOverlay onClick={this.resetErrorMessages}> {/* closeModalはみたらわかるけどモーダルを閉じる処理 */}
        <ModalContent onClick={(e) => e.stopPropagation()}> {/* モーダル内部をクリックしたときは閉じない */}
            <p>{this.props.content}</p>
            <button onClick={this.resetErrorMessages}>x</button>
        </ModalContent>
      </ModalOverlay>
    )
    } else {
      return null; //closeModalメソッドが動くとHeader.jsx内のstateが変更され、propsのshowがfalseになる
    }
  }
}


export default UserModalForm;