import React, { Component } from 'react';
import styled from 'styled-components';

//axiosの読み込み
import axios from 'axios';

//コンポーネントの読み込み
import {FormBlock} from "../common/UserModal.jsx"
import {ModalOverlay} from "../common/UserModal.jsx"
import {ModalContent} from "../common/UserModal.jsx"
import {ErrorMessage} from "../common/UserModal.jsx"

// react-router用のlinkを使えるようにする
import { withRouter } from 'react-router-dom'

// function ManualBookPostForm() {
//   // もしかしたら使うかも
//     return(
//       <form>
//         <BooksFormBlock>
//           <label htmlFor="title">タイトル</label>
//           <input type="text" name="title" id="nickname" onChange={this.searchBook}/>  
//         </BooksFormBlock>
//         <BooksFormBlock>
//           <label htmlFor="recommends">こんな人におすすめ！</label>
//           <input type="text" name="recommends" id="nickname" />  
//         </BooksFormBlock>
//         <BooksFormBlock>
//           <label htmlFor="description">内容要約</label>
//           <textarea type="text" name="description" id="nickname"></textarea> 
//         </BooksFormBlock>
//         <BooksFormBlock>
//           <label htmlFor="author">著者</label>
//           <input type="text" name="author" id="nickname" />  
//         </BooksFormBlock>
//         <BooksFormBlock>
//           <label htmlFor="author_kana">著者(カナ)</label>
//           <input type="text" name="author_kana" id="nickname" />  
//         </BooksFormBlock>
//         <BooksFormBlock>
//           <label htmlFor="publisher_name">出版社</label>
//           <input type="text" name="publisher_name" id="nickname" />  
//         </BooksFormBlock>
//         <BooksFormBlock>
//           <label htmlFor="genre_id">ジャンル</label>
//           <input type="text" name="genre_id" id="nickname" />  
//         </BooksFormBlock>
//         <BooksFormBlock>
//           <label htmlFor="sales_date">発売日</label>
//           <input type="text" name="sales_date" id="nickname" />  
//         </BooksFormBlock>
//         <BooksFormBlock>
//           <label htmlFor="item_price">価格</label>
//           <input type="text" name="item_price" id="nickname" />  
//         </BooksFormBlock>
//         <BooksFormBlock>
//           <label htmlFor="image_url">画像</label>
//           <input type="hidden" name="image_url" id="nickname" />  
//         </BooksFormBlock>
//         <BooksFormBlock>
//           <input type="hidden" name="isbn" id="nickname" />  
//         </BooksFormBlock>
//         <BooksFormBlock>
//           <input type="submit" value="推薦図書に追加" id="submit-btn"/>
//         </BooksFormBlock>
//       </form>
//     )
//   }

function SearchBookForm(props) {
  return(
    <form onSubmit={props.submit}>
      <ErrorMessage errors={props.errors}></ErrorMessage>
      <BooksFormBlock>
        <label htmlFor="title">タイトルで検索</label>
        <div className="search-form-field">
          <input type="text" name="title" id="title" onChange={props.change}/>  
          <button className="search-button" onClick={props.search}><i className="fas fa-search"></i></button>  
        </div>
      </BooksFormBlock>
      <div id="search_result">
        {/* 検索結果が個々に入る */}


      </div>
      <BooksFormBlock>
        <input type="submit" value="推薦図書に追加" id="submit_btn"/>
      </BooksFormBlock>
    </form>
  )
}

class NewBookModal extends React.Component {
  constructor(props){
    super(props);
    this.state = {
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
      errors: []
    }
    this.closeBookModal = this.closeBookModal.bind(this)
    this.searchBook = this.searchBook.bind(this)
    this.updateForm = this.updateForm.bind(this)
    this.postBook = this.postBook.bind(this)
    this.userAuthentification = this.userAuthentification.bind(this)
    this.getCsrfToken = this.getCsrfToken.bind(this)
    this.setAxiosDefaults = this.setAxiosDefaults.bind(this)
  }

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
    const book = this.state.book;
    book.title = e.target.value            
    this.setState({
      book: book
    })
  }

  searchBook(e) {
    e.preventDefault()
    const keyword = this.state.book.title
    // ユーザー認証とcsrf-tokenの準備
    this.userAuthentification()
    this.setAxiosDefaults();
    axios
    .get(`/api/v1/books/search/?keyword=${keyword}`)
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
        resultInfoWrapper.insertAdjacentHTML('afterbegin', resultInfoContent)
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
    this.userAuthentification()
    this.setAxiosDefaults();
    axios
    .post('/api/v1/books', {book: this.state.book})
    .then(response => {
      // todo:次のブランチでマイページに書籍情報を渡す
      this.setState({
        books: {}
      })
      this.closeBookModal()
    })
    .catch(error => {
      if (error.response.data && error.response.data.errors) {
        this.setState({
          errors: error.response.data.errors //モデルのバリデーションエラーメッセージの表示
        })
      }
    })
  }


  userAuthentification() {
    const authToken = JSON.parse(localStorage.getItem("auth_token"));
    // uid, client, access-tokenの3つが揃っているか検証
    if (authToken['uid'] && authToken['client'] && authToken['access-token']) { 
      axios.defaults.headers.common['uid'] = authToken['uid']
      axios.defaults.headers.common['client']  = authToken['client']
      axios.defaults.headers.common['access-token']  = authToken['access-token']
    } else {
      return null
    }
  }

  componentDidMount(){
    const authToken = JSON.parse(localStorage.getItem("auth_token"));
    if (!authToken || !authToken['uid']) { //ログインしていない場合モーダルが開かないようにする。初回起動時はそもそもauthTokenが存在しないのでそれも判定
      alert('推薦図書の投稿にはログインが必要です')
      this.props.history.push("/");
    }
  }

  render () {
    return (
      <ModalOverlay onClick={this.closeBookModal}>
        {this.props.children}
        <ModalContent onClick={(e) => e.stopPropagation()}>
        <p>推薦図書を投稿する</p>
        <button onClick={this.closeBookModal}>x</button>
          <NewBooksWrapper>
            <SearchBookForm search={this.searchBook} change={this.updateForm} submit={this.postBook} errors={this.state.errors}/>
          </NewBooksWrapper>
        </ModalContent>
      </ModalOverlay>
    )
  } 
}

// 基本的なスタイルはUserModal.jsxを継承しているためそちらを参照
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

const BooksFormBlock = styled(FormBlock)`
  /* formBlock全体の幅を少し広げている */
  width: 80%;

  label {
    font-size: 16px;
  }


  .search-form-field {
    display: flex;
    justify-content: space-between;
    align-items: center;

    & input {
      /* 検索入力欄のスタイル */
      height: 24px;
      line-height: 24px;
      width: 80%;
    }

    & .search-button {
      /* 検索ボタン */
      vertical-align: center;
      position: static;
      background-color: #cb4d00;
      color: #FFF;
      height: 30px;
      padding: 0 10px;

      & i {
        font-size: 16px;
      }
    }

    & .search-button:hover {
      cursor: pointer;
      color: #cb4d00;
      background-color: #FFF;
    }
  }

`


export default withRouter(NewBookModal);