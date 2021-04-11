import React, { Component } from 'react';
import styled from 'styled-components';

// react-routerの読み込み
import { Link } from "react-router-dom";

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
  
`

const ActionPlans = styled.div`
  width: 50%;
  
`

const AwarenessForm = styled.form`
  width: 85%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;

  & h4 {
    margin: 0 80% 0 0;
  }

  & textarea {
    width: 95%;
    height: 60px;
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
  
`

const ActionPlansIndex = styled.div`
  height: 70%;
  
`



export default OutputIndex;