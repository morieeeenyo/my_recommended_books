import React, { Component } from 'react';
import styled from 'styled-components';

// react-routerの読み込み
import { Link, withRouter } from "react-router-dom";

// Cookieの読み込み。localStorageを使用せずCookieを使用する方針に切り替え
import Cookies from 'universal-cookie';

// axiosの読み込み
import axios from 'axios';

// コンポーネントの読み込み
import {BookList} from '../users/MyPage.jsx'

// paginateの読み込み
import ReactPaginate from 'react-paginate';

class Index extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      books: [],
      start: 0, //最初は0番目(=最新)の要素から
      perPage: 12, //1ページには12冊表示
      keyword: '', //検索ワード。初期値は空にしておく
      queryParams: 'title', //どのカラムに対して検索をかけるか
      queryText: 'タイトル', //検索入力欄のテキストボックスに使ってます
      title: '新着書籍一覧' //検索すると「検索結果」に変わる
    }
    this.pageChange = this.pageChange.bind(this)
    this.searchBook = this.searchBook.bind(this)
    this.updateForm = this.updateForm.bind(this)
    this.selectQuery = this.selectQuery.bind(this)
  }

  pageChange(data) {
    let pageNumber = data['selected']; //選択されたページ番号
    this.setState({
      //スタート位置をページ番号 * 1ページあたりの数、とする(例えば2番を選ぶと12 * 1で12番が先頭になる、つまり13番目以降の書籍が表示される)
      start: pageNumber * this.state.perPage 
    })
  }

  updateForm(e) {
    //入力欄の変化を検知してstateを変える
    let keyword = e.target.value            
    this.setState({
      keyword: keyword,
    })
  }

  searchBook(e) {
    e.preventDefault()
    const keyword = this.state.keyword
    axios
    .get(`/api/v1/books/search/?keyword=${keyword}&query=${this.state.queryParams}`)
    .then(response => {
      if (response.data.books.length === 0) {
        // サーバー側でlengthを使った判定ができないためフロントで判定している
        alert('検索結果が見つかりませんでした')
      } else {
        let books = []
        response.data.books.forEach(book => {
          // 検索結果の書籍情報はbook.paramsに入っている
          book.params.image_url = book.params.mediumImageUrl //画像はカラム名と楽天APIから返却されるキーの値が違うためテコ入れが必要
          books.push(book.params)
        })
        this.setState({
          books: books,
          title: '検索結果' 
        })
      }
    })
      .catch(error => {
        alert(error.response.data.errors) //モデルのエラーメッセージではないのでアラートにする
      })
    }

  selectQuery(e){
    // プルダウンの選択に応じてテキストボックスのplaceholderを変える
    let selectedIndex = e.target.selectedIndex
    this.setState({
      queryParams: e.target.value,
      queryText: e.target[selectedIndex].text
    })
  }
    
  componentDidMount() {
    const cookies = new Cookies();
    let authToken = cookies.get("authToken");
    let newBookLink = document.getElementById('new_book_link')
    if (authToken == undefined || !authToken) {
      // なんかundefinedも判定しないとエラーになる
      if (location.pathname === "/") {
        // ルートパスアクセス時、ログインしていなければwelcomeページへ
        this.props.history.push('/welcome')
      } 

      // 書籍投稿ボタンはログアウト時は押せないようにする
      if (newBookLink.getAttribute('style') == 'display: block;') {
        newBookLink.setAttribute('style', 'display: none;')
      }
    } 

    // 書籍投稿ボタンが非表示の場合表示する
    // else文だとうまく作動しないためauthTokenがあるかどうかで分ける
    if (authToken) {
      if (newBookLink.getAttribute('style') == 'display: none;') {
        newBookLink.setAttribute('style', 'display: block;')
      }
    }

    axios
    .get('/api/v1/books')
    .then(response => {
        this.setState({
          books: response.data.books
        })
    })
    .catch(error => {
      alert(error.response.data.errors) //モデルのエラーメッセージではないのでアラートにする
    })
  }

  render () {
    return (
      <BookIndexContainer>
        <div className="search">
          <h2>書籍検索</h2>
          <p>気になる本があれば検索してみましょう。<br></br>すでに読んだ方のアウトプットが見つかるかもしれません。</p>
          <form className="search-form-field">
            <select onChange={this.selectQuery}>
              <option value="title">タイトル</option>
              <option value="author">著者名</option>
            </select>
            <input type="text" placeholder={`${this.state.queryText}で検索`} onChange={this.updateForm} value={this.state.keyword} id="keyword"></input>
            <button className="search-button" onClick={this.searchBook}><i className="fas fa-search"></i></button>  
          </form>
        </div>

        <div className="book-list">
          <h2>{this.state.title}</h2>
          <BookList>
            {/* 12冊ずつ表示。this.state.startは(ページ番号 - 1) * 12 */}
            {this.state.books.slice(this.state.start, this.state.start + this.state.perPage).map(book => {
              return (
              <li key={book.isbn} className="book-list-item">
                <img src={book.image_url}/>
                <p className="book-title">{book.title}</p>
                <p className="book-author">{book.author}</p>
                <Link to={{pathname: "/books/" + book.isbn + "/outputs", state: {book: book}}}>アウトプット一覧</Link>
              </li> //returnがないと表示できない
              ) 
            })} 
          </BookList>
          {this.state.books.length > 0 &&
            <ReactPaginate
            pageCount={Math.ceil(this.state.books.length / this.state.perPage)} //総ページ数。今回は一覧表示したいデータ数 / 1ページあたりの表示数としてます。
            marginPagesDisplayed={2} //先頭と末尾に表示するページの数。今回は2としたので1,2…今いるページの前後…後ろから2番目, 1番目 のように表示されます。
            pageRangeDisplayed={5} //上記の「今いるページの前後」の番号をいくつ表示させるかを決めます。
            onPageChange={this.pageChange} //ページネーションのリンクをクリックしたときのイベント(詳しくは下で解説します)
            containerClassName='pagination' //ページネーションリンクの親要素のクラス名
            pageClassName='page-item' //各子要素(li要素)のクラス名
            pageLinkClassName='page-link' //ページネーションのリンクのクラス名
            activeClassName='active' //今いるページ番号のクラス名。今いるページの番号だけ太字にしたりできます 
            previousLabel='<' //前のページ番号に戻すリンクのテキスト
            nextLabel='>' //次のページに進むボタンのテキスト
            previousClassName='page-item' // '<'の親要素(li)のクラス名
            nextClassName='page-item' //'>'の親要素(li)のクラス名
            previousLinkClassName='page-link'  //'<'のリンクのクラス名
            nextLinkClassName='page-link' //'>'のリンクのクラス名
            disabledClassName='disabled' //先頭 or 末尾に行ったときにそれ以上戻れ(進め)なくするためのクラス
            breakLabel='...' // ページがたくさんあるときに表示しない番号に当たる部分をどう表示するか
            breakClassName='page-item' // 上記の「…」のクラス名
            breakLinkClassName='page-link' // 「…」の中のリンクにつけるクラス
            />
          }
        </div>
      </BookIndexContainer>
     )
   
  } 
}

const BookIndexContainer = styled.div`
  /* 一覧表示全体 */
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 80%;
  margin: 0 auto;

  & div {
    /* .search, book-list共通 */
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 80%;
    margin: 0 auto;

    & h2 {
      /* 「書籍検索」 */
      font-size: 32px;
    }

    & p {
      /* 「書籍検索」の説明文のスタイル */
      text-align: center;
    }
  }

  & .search-form-field {
    /* 検索フォーム */
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center; 
    width: 70%;

    & input {
      /* 検索ワードを入力するテキストボックス */
      height: 24px;
      width: calc(100% - 200px);
      padding: 10px;
    }

    & select {
      height: 46px;
      display: block;
      width: 100px;
      padding: 10px;
    }

    & .search-button {
      /* 検索ボタン */
      vertical-align: center;
      position: static;
      background-color: #989EAB;
      color: #F4F5F7;
      height: 50px;
      padding: 0 15px;
      border-style: none;

      & i {
        /* アイコン */
        font-size: 16px;
      }
    }

    & .search-button:hover {
      /* 検索ボタンにホバーしたとき */
      cursor: pointer;
      color: #535F78;
      background-color: #F4F5F7;
      border: 1px solid #989EAB;
    }
  }

  & .book-list {
    & .pagination {
      /* ページネーションボタン */
      display: flex;
      justify-content: space-between;
      margin: 0 auto 30px;
      width: 20%;
      padding: 0;

      & > li {
        /* 1個1個のボタン */
          list-style: none;
          margin: 0 12px;

          & > a {
            /* ボタン内にあるリンク */
              position: relative;
              font-size: 12px;
              outline: none;
              z-index: 100;
              cursor: pointer;
              color: #000;

              &::before {
                /* ボタンにホバーしたときの丸 */
                content: "";
                display: block;
                position: absolute;
                top: 50%;
                left: 50%;
                width: 24px;
                height: 24px;
                border-radius: 50%;
                transform: translate(-50%, -50%);
                z-index: -100;
              }

              &:hover {
                /* ホバーすると白丸に黒太文字になる */
                  font-weight: bold;
                  
                  &::before {
                      background-color: #fff;
                  }
              }
          }
      }

      & .previous,
      & .next {
        /* <, > のスタイル */
          & > a {
              font-size: 10px;
          }
      }

      & .disabled {
        /* 端までいくと< , >が非表示になる */
          display: none;
      }

      & .active {
        font-weight: bold;
      }
    }
  }
`

export default withRouter(Index);