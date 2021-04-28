import React, { Component } from 'react';

// react-routerの読み込み
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

// コンポーネントの読み込み
import Header from './Header.jsx'
import UserModal from './UserModal.jsx'
import Container from './Container.jsx'
import Index from '../books/Index.jsx'
import NewBookModal from '../books/NewBookModal.jsx'
import MyPage from '../users/MyPage.jsx'
import MyOutputs from '../outputs/MyOutputs.jsx'
import {MyRecommendedBooks} from '../users/MyPage.jsx'
import {EditUserInfo} from '../users/MyPage.jsx'
import OutputModal from '../outputs/OutputModal.jsx'


class App extends React.Component {
  // constructor(){
  //   super();
  //   this.state = {
  //     showBookModal: false,
  //   }
  //   this.closeBookModal = this.closeBookModal.bind(this)
  // }

  // closeBookModal() {
  //   this.setState({
  //     showBookModal: false
  //   })
  //   this.history.push("/")
  // }

  render () {
    return (
      <div className="container">
        <Router>
          <Header>
            {/* Todo：ここのパスにparamsを渡せるようにする */}
            <Route path="/users/:content" component={UserModal}/>
          </Header>
          <Container>
            <Switch>
              <Route exact path='/'>
                <Index>
                </Index>
              </Route>
              <Route path="/mypage">
                <MyPage>
                  <Route exact path="/mypage/books">
                    <MyRecommendedBooks>
                    </MyRecommendedBooks>
                  </Route>
                  <Route path="/mypage/edit">
                    <EditUserInfo></EditUserInfo>
                  </Route>
                  <Route path="/mypage/books/:book_id/outputs">
                    <MyOutputs></MyOutputs>
                  </Route>
                </MyPage>
              </Route>
            </Switch>
          </Container>
          <Route path="/books/new">
            <NewBookModal>
            </NewBookModal>
          </Route>
          <Route path="/books/:book_id/outputs/new">
            <OutputModal></OutputModal>
          </Route>
        </Router>
      </div>
    )
  } 
}


export default App;