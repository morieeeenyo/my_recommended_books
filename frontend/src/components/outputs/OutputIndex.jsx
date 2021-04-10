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
  width: 45%;
  border-right: 1px solid black;
  
`

const ActionPlans = styled.div`
  width: 45%;
  
`

const AwarenessForm = styled.form`
  
`

const AwarenessIndex = styled.div`
  height: 60%;

  
`

const ActionPlansForm = styled.form`
  
`

const ActionPlansIndex = styled.div`
  height: 60%;
  
`



export default OutputIndex;