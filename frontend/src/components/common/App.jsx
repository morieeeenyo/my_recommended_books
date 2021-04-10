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
import OutputIndex from '../outputs/OutputIndex.jsx'
import {MyRecommendedBooks} from '../users/MyPage.jsx'
import {EditUserInfo} from '../users/MyPage.jsx'


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
              <Route path="/users/mypage">
                <MyPage>
                  <Route exact path="/users/mypage/books">
                    <MyRecommendedBooks>
                      <Route path="/users/mypage/books/:book_id/outputs">
                        <OutputIndex></OutputIndex>
                      </Route>
                    </MyRecommendedBooks>
                  </Route>
                  <Route path="/users/mypage/edit">
                    <EditUserInfo></EditUserInfo>
                  </Route>
                </MyPage>
              </Route>
            </Switch>
          </Container>
          <Route path="/books/new">
            <NewBookModal>
            </NewBookModal>
          </Route>
        </Router>
      </div>
    )
  } 
}


export default App;