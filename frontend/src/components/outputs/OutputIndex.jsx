import React, { Component } from 'react';
import styled from 'styled-components';

// react-routerの読み込み
import { Link } from "react-router-dom";

//コンポーネントの読み込み
import {FormBlock} from "../common/UserModal.jsx"


class OutputIndex extends React.Component {
  constructor(props){
    super(props);
    // this.getCsrfToken = this.getCsrfToken.bind(this)
    // this.setAxiosDefaults = this.setAxiosDefaults.bind(this)
    // this.userAuthentification = this.userAuthentification.bind(this)
  }

  render () {
    return (
      <OutputWrapper>
        <OutputContent>
          <Awareness>
            <AwarenessIndex></AwarenessIndex>
            <AwarenessForm>
                <h4>気づき</h4>
                <textarea name="awareness_text"></textarea>
                <input type="submit" value="追加" id="add_btn"></input>
            </AwarenessForm>
          </Awareness>
          <ActionPlans>
            <ActionPlansIndex></ActionPlansIndex>
            <ActionPlansForm>
              <h4>アクションプラン</h4>
              <ActionPlanFormBlock>
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
              <input type="submit" value="追加" id="add_btn"></input>
            </ActionPlansForm>
          </ActionPlans>
        </OutputContent>
      </OutputWrapper>
     )
   
  } 
}

const OutputWrapper = styled.div`
  height: 100%;
  
`


const OutputContent = styled.div`
  display: flex;
  height: 100%;
  justify-content: space-around;
`

const Awareness = styled.div`
  width: 50%;
  border-right: 1px solid black;
  position: relative;
  padding: 0 2%;
  
`

const ActionPlans = styled.div`
  width: 50%;
  position: relative;
  padding: 0 2%;
  
`

const AwarenessForm = styled.form`
  width: 95%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  position: absolute;
  bottom: 2%;

  & h4 {
    margin: 0 80% 0 0;
  }

  & textarea {
    width: 80%;
    height: 80px;
    resize: none;
  }

  & #add_btn{
    background-color: lightgray;
    color: #FFF;
    height: 24px;
    line-height: 24px;
    font-size: 18px;
    border-style: none;
    border-radius: 2px;
    width: 60%;
    margin-top: 5px;
  }

  /* ホバー時にクリックできることがわかりやすくなるようにする */
  & #add_btn:hover {
    background-color: #000;
    cursor: pointer;
  }
  
`

const AwarenessIndex = styled.div`
  height: 75%;

  
`

const ActionPlansForm = styled.form`
  width: 95%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  position: absolute;
  bottom: 2%;

  & h4 {
    margin: 0 60% 0 0;
  }

  & #add_btn{
    background-color: lightgray;
    color: #FFF;
    height: 24px;
    line-height: 24px;
    font-size: 18px;
    border-style: none;
    border-radius: 2px;
    width: 60%;
    margin-top: 5px;
  }

  /* ホバー時にクリックできることがわかりやすくなるようにする */
  & #add_btn:hover {
    background-color: #000;
    cursor: pointer;
  }
  
`

const ActionPlanFormBlock = styled(FormBlock)`
  width: 70%;
`

const ActionPlansIndex = styled.div`
  height: 30%;
  
`



export default OutputIndex;