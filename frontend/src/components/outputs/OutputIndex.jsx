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
          <Awareness></Awareness>
          <ActionPlans></ActionPlans>
        </OutputContent>
        <OutputForm>

        </OutputForm>
      </OutputWrapper>
     )
   
  } 
}

const OutputWrapper = styled.div`
  
`

const OutputForm = styled.form`

`

const OutputContent = styled.div`
  display: flex;
`

const Awareness = styled.div`
  
`

const ActionPlans = styled.div`
  
`


export default OutputIndex;