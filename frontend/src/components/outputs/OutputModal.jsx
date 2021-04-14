import React, { Component } from 'react';
import styled from 'styled-components';

//axiosの読み込み
import axios from 'axios';

// react-router用のlinkを使えるようにする
import { withRouter } from 'react-router-dom'


//コンポーネントの読み込み
import {FormBlock} from "../common/UserModal.jsx"
import {ModalOverlay} from "../common/UserModal.jsx"
import {ModalContent} from "../common/UserModal.jsx"
import {ErrorMessage} from "../common/UserModal.jsx"
import {UserFromContent} from "../common/UserModal.jsx"


function OutputForm() {
  // Todo:アクションプランは3つまで同時に設定できるようにする
  return (
    <OutputFormContent>
      <ActionPlanFormBlock>
      <label for="awareness_text">気づき</label>
        <textarea name="awareness_text"></textarea>
      </ActionPlanFormBlock>
      <ActionPlanFormBlock>
        <label class="action-plan-label">アクションプラン</label>
        <label for="due_date">いつ</label>
        <input type="text" name="what"></input>
      </ActionPlanFormBlock>
        <ActionPlanFormBlock>
          <label for="what">何を</label>
          <input type="text" name="what"></input>
        </ActionPlanFormBlock>
        <ActionPlanFormBlock>
          <label for="how_much">どのように</label>
          <input type="text" name="how"></input>
        </ActionPlanFormBlock>
        <ActionPlanFormBlock>
          <input type="submit" value="追加" id="submit_btn"></input>  
        </ActionPlanFormBlock>
    </OutputFormContent>
  )
}


class OutputModal extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      errors: []
    }
    // 以下は後で実装するメソッド
    // this.getCsrfToken = this.getCsrfToken.bind(this)
    // this.setAxiosDefaults = this.setAxiosDefaults.bind(this)
    // this.userAuthentification = this.userAuthentification.bind(this)
    this.closeOutputModal = this.closeOutputModal.bind(this)
  }

  closeOutputModal() {
    this.setState({
      errors: []
    })
    this.props.history.goBack() //元いたページに戻る(マイページ以外からアクセスされることも想定)0
  }

  render () {
    // Todo:諸々メソッド実装
    return (
      <ModalOverlay onClick={this.closeOutputModal}>
        {this.props.children}
        <ModalContent onClick={(e) => e.stopPropagation()}>
        <p>アウトプットを投稿する</p>
        <button onClick={this.closeOutputModal}>x</button>
          <div>
            <OutputForm search={this.searchBook} change={this.updateForm} submit={this.postBook} errors={this.state.errors}/>
          </div>
        </ModalContent>
      </ModalOverlay>
     )
   
  } 
}

const OutputFormContent = styled(UserFromContent)`
`

const ActionPlanFormBlock = styled(FormBlock)`
  width: 70%;

  .action-plan-label {
    margin-bottom: 5px;
  }

  & textarea {
    width: 100%;
    height: 80px;
    resize: none;
  }

  & input {
    width: 100%
  }

  & #submit_btn{
    width: 65%;
    margin: 0 auto;
  }
`

export default withRouter(OutputModal);