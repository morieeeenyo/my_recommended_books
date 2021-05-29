import React, { Component } from 'react';
import styled from 'styled-components';

//axiosの読み込み
import axios from 'axios';

//コンポーネントの読み込み
import {FormBlock} from "../users/UserModalForm.jsx"
import {ModalOverlay} from "../users/UserModalForm.jsx"
import {ModalContent} from "../users/UserModalForm.jsx"
import {ErrorMessage} from "../users/UserModalForm.jsx"
import {UserFromContent} from "../users/UserModalForm.jsx"

// react-router用のlinkを使えるようにする
import { withRouter } from 'react-router-dom'

// Cookieの読み込み。localStorageを使用せずCookieを使用する方針に切り替え
import Cookies from 'universal-cookie';

function SearchBookForm(props) {
  if (props.user.sns_token && props.user.sns_secret) {
  return (
    <NewBookFormContent onSubmit={props.submit}>
      <ErrorMessage errors={props.errors}></ErrorMessage>
      <BooksFormBlock>
        {/* Index.jsx同様プルダウンを選択するとlabelの値および検索対象のカラムが変化する */}
        <label htmlFor="title">{props.queryText}で検索</label>
        <div className="search-form-field">
          <select onChange={props.select}>
            <option value="title">タイトル</option>
            <option value="author">著者名</option>
          </select>
          <input type="text" name="keyword" id="keyword" onChange={props.change}/>  
          <button className="search-button" onClick={props.search}><i className="fas fa-search"></i></button>  
        </div>
      </BooksFormBlock>
      <div id="search_result">
        {/* 検索結果が個々に入る */}


      </div>
        {/* sns未認証の場合表示しない */}
        <BooksFormBlock>
        <label htmlFor="to_be_shared_on_twitter">
          {/* チェックが入っている場合Twitterでシェア */}
          <input type="checkbox" name="to_be_shared_on_twitter" id="to_be_shared_on_twitter" onChange={props.change}/>
          <i className="fab fa-twitter"></i>Twitterでシェア
        </label>
        </BooksFormBlock>
      <BooksFormBlock>
        <input type="submit" value="推薦図書に追加" id="submit_btn"/>
      </BooksFormBlock>
    </NewBookFormContent>
    )
  } else {
    // Todo:条件付きレンダーで記述を減らす
    return(

      <NewBookFormContent onSubmit={props.submit}>
        <ErrorMessage errors={props.errors}></ErrorMessage>
        <BooksFormBlock>
          <label htmlFor="title">{props.queryText}で検索</label>
          <div className="search-form-field">
            <select onChange={props.select}>
              <option value="title">タイトル</option>
              <option value="author">著者名</option>
            </select>
            <input type="text" name="keyword" id="keyword" onChange={props.change}/>  
            <button className="search-button" onClick={props.search}><i className="fas fa-search"></i></button>  
          </div>
        </BooksFormBlock>
        <div id="search_result">
          {/* 検索結果が個々に入る */}


        </div>
        <BooksFormBlock>
          <input type="submit" value="推薦図書に追加" id="submit_btn"/>
        </BooksFormBlock>
      </NewBookFormContent>
    )
  }
}

class NewBookModal extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      user: {},
      book: {
        isbn: '',
        title: '',
        author: '',
        author_kana: '',
        publisher_name: '',
        sales_date: '',
        item_price: '',
        item_url: '',
        image_url: '',
      },
      errors: [],
      // Twitterにシェアするかどうかを決めるstate
      to_be_shared_on_twitter: false,
      queryParams: 'title', //検索対象のカラム
      queryText: 'タイトル', //フォームのlabelに表示するテキスト
      keyword: '' //フォームの入力内容
    }
    this.closeBookModal = this.closeBookModal.bind(this)
    this.searchBook = this.searchBook.bind(this)
    this.updateForm = this.updateForm.bind(this)
    this.postBook = this.postBook.bind(this)
    this.getCsrfToken = this.getCsrfToken.bind(this)
    this.setAxiosDefaults = this.setAxiosDefaults.bind(this)
    this.selectQuery = this.selectQuery.bind(this)
  }

  // emailで新規登録、ログインした場合はこちらを使ってcsrfトークンを更新
  getCsrfToken() {
    if (!(axios.defaults.headers.common['X-CSRF-Token'])) {
      return (
        document.getElementsByName('csrf-token')[0].getAttribute('content') //初回ログイン時新規登録時はheadタグのcsrf-tokenを参照する
      )
    } else {
      return (
        axios.defaults.headers.common['X-CSRF-Token'] //それ以外のときは既にセットしてあるcsrf-tokenを参照
      )
    }
  };

  setAxiosDefaults() {
    axios.defaults.headers.common['X-CSRF-Token'] = this.getCsrfToken();
  };

  closeBookModal() {
    this.setState({
      books: {},
      errors: []
    })
    this.props.history.goBack() //マイページから来てもトップページから来てもいいようにgoBackに修正
  }

  updateForm(e) {
    //入力欄の変化を検知してstateを変える
    let keyword = ''
    let to_be_shared_on_twitter = this.state.to_be_shared_on_twitter
    switch (e.target.name) {
      case 'keyword':
        keyword = e.target.value
        break;
      case 'to_be_shared_on_twitter':
        to_be_shared_on_twitter = !to_be_shared_on_twitter
        break;
    }
    this.setState({
      keyword: keyword,
      to_be_shared_on_twitter: to_be_shared_on_twitter
    })
  }

  selectQuery(e){
    // プルダウンの選択内容に応じてlabelのテキストを変えつ
    let selectedIndex = e.target.selectedIndex
    this.setState({
      queryParams: e.target.value,
      queryText: e.target[selectedIndex].text
    })
  }

  searchBook(e) {
    e.preventDefault()
    if(!this.props.isSignedIn) { 
      alert('推薦図書の投稿にはログインが必要です')
      return this.props.history.push("/");
     }
    const keyword = this.state.keyword
    // ユーザー認証とcsrf-tokenの準備
    this.setAxiosDefaults();
    axios
    .get(`/api/v1/books/search/?keyword=${keyword}&query=${this.state.queryParams}`)
    .then(response => {
      if (response.data.books.length === 0) {
        return alert('検索結果が見つかりませんでした') //memo: サーバー側で検索結果が0件であるかどうかを判定できない
      }
      this.setState({
        errors: []
      })
      const resultList = document.getElementById('search_result')
      resultList.textContent = "" //検索するたびに中身を空にして重複を防ぐ
      response.data.books.forEach(book => {
        const resultItem = document.createElement('div') //全体の親
        const resultImage = document.createElement('img') //画像
        resultImage.setAttribute('src', book.params.mediumImageUrl) 
        const resultInfoWrapper = document.createElement('div') //書籍の詳細
        const resultInfoContent = `
        <h3>${book.params.title}</h3>
        <p>著者名</p><p>${book.params.author}</p>
        `
        resultInfoWrapper.insertAdjacentHTML('afterbegin', resultInfoContent) //変数の埋め込みのために文字列を流し込む
        resultItem.appendChild(resultImage)
        resultItem.appendChild(resultInfoWrapper)
        resultList.appendChild(resultItem)
        resultItem.addEventListener('click', (e) => {
          const selectedItems = document.getElementsByClassName('selected')
          if (selectedItems) { //初回は選択状態の要素がないので条件分岐しないとエラーが発生しそう
            Array.prototype.slice.call(selectedItems).forEach(item => {
              item.removeAttribute('class') //一度クラスが付与されたdiv要素を全て外し1つだけ選択されている状態にする
            })
          }
          resultItem.setAttribute('class', 'selected') //選択状態にする
          this.setState(prevState => {
            const bookParams = prevState.book
            bookParams.title = book.params.title
            bookParams.isbn = book.params.isbn
            bookParams.author = book.params.author
            bookParams.author_kana = book.params.authorKana
            bookParams.publisher_name = book.params.publisherName
            bookParams.sales_date = book.params.salesDate
            bookParams.item_price = book.params.itemPrice
            bookParams.item_url = book.params.itemUrl
            bookParams.image_url = book.params.mediumImageUrl
            return { book: bookParams }
          })
        })
      })
      return response 
    })
    .catch(error => {
      alert(error.response.data.errors) //モデルのエラーメッセージではないのでアラートにする
    })
  }

  postBook(e) {
    e.preventDefault()
    if(!this.props.isSignedIn) { 
      alert('推薦図書の投稿にはログインが必要です')
      return this.props.history.push("/");
     }
    this.setAxiosDefaults();
    axios
    .post('/api/v1/books', {book: this.state.book, to_be_shared_on_twitter: this.state.to_be_shared_on_twitter})
    .then(response => {
      // todo:次のブランチでマイページに書籍情報を渡す
      this.setState({
        books: {}
      })
      this.closeBookModal()
      return response
    })
    .catch(error => {
      if (error.response.data && error.response.data.errors) {
        this.setState({
          errors: error.response.data.errors
        })
      }
    })
  }

  componentDidMount(){
    axios 
    .get('/api/v1/mypage')
    .then(response => {
      if (response.data.avatar) {
        this.setState({
          user: response.data.user,
        })
      } else {
        this.setState({
          user: response.data.user,
        })
      }
      return response
    })
    .catch(error =>{
      //アラートを出すとうまく動かなかった(アラートが2つ出てくる？？？)
      console.log(error) 
    })
  }

  render () {
    return (
      <ModalOverlay onClick={this.closeBookModal}>
        {this.props.children}
        <ModalContent onClick={(e) => e.stopPropagation()}>
        <p>推薦図書を投稿する</p>
        <button onClick={this.closeBookModal}>x</button>
          <NewBooksWrapper>
            <SearchBookForm select={this.selectQuery} queryText={this.state.queryText} search={this.searchBook} change={this.updateForm} submit={this.postBook} errors={this.state.errors} user={this.state.user}/>
          </NewBooksWrapper>
        </ModalContent>
      </ModalOverlay>
    )
  } 
}

// 基本的なスタイルはUserModalForm.jsxを継承しているためそちらを参照
const NewBooksWrapper = styled.div `
  width: 100%;
  margin: 0 auto;
  font-family: Verdana, sans-serif;
  & h1 {
    text-align: center;
  }

  & #search_result {
    overflow: scroll;
    height: 300px;
    /* 以下クラスやidを付与していないのはsearchBookメソッドが長くなるため */

    & > div { 
      /* 個々の検索結果 */
      display: flex;
      justify-content: space-between;
      padding: 10px;
      border: 1px solid black;
      border-radius: 5px;
      margin-bottom: 10px;

      & img {
        /* 書籍の画像 */
        width: 30%;
      }

      & > div {
        /* 書籍の情報の箱 */
        width: 60%;
      }

      & p {
        /* 書籍情報のテキスト */
        text-align: start;
        font-size: 12px;
      }
    }

    & .selected {
      /* 書籍を選択するとborderが青くなる */
      border: 5px solid blue;
    }
  }
` 

const NewBookFormContent = styled(UserFromContent)`

`

const BooksFormBlock = styled(FormBlock)`
  /* formBlock全体の幅を少し広げている */
  width: 80%;

  label {
    font-size: 16px;
  }

  input[type=checkbox] {
    width: fit-content;
    margin-right: 2px;
  }


  .search-form-field {
    display: flex;
    justify-content: space-between;
    align-items: center;

    & input {
      /* 検索入力欄のスタイル */
      height: 24px;
      width: calc(100% - 200px);
      line-height: 24px;
    }

    & select {
      height: 30px;
      display: block;
      width: 100px;
    }

    & .search-button {
      /* 検索ボタン */
      vertical-align: center;
      position: static;
      background-color: #989EAB;
      color: #F4F5F7;
      height: 30px;
      padding: 0 10px;

      & i {
        font-size: 16px;
      }
    }

    & .search-button:hover {
      cursor: pointer;
      color: #535F78;
      background-color: #F4F5F7;
    }
  }

`


export default withRouter(NewBookModal);