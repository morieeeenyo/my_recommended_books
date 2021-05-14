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
      perPage: 12 //1ページには12冊表示
    }
    this.pageChange = this.pageChange.bind(this)
  }

  pageChange(data) {
    let pageNumber = data['selected']; //選択されたページ番号
    this.setState({
      //スタート位置をページ番号 * 1ページあたりの数、とする(例えば2番を選ぶと12 * 1で12番が先頭になる、つまり13番目以降の書籍が表示される)
      start: pageNumber * this.state.perPage 
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
          <div className="search-form-field">
            <input type="text" placeholder="書籍名で検索" ></input>
            <button className="search-button"><i className="fas fa-search"></i></button>  
          </div>
        </div>

        <div className="book-list">
          <h2>新着書籍一覧</h2>
          <BookList>
            {/* 12冊ずつ表示。this.state.startは(ページ番号 - 1) * 12 */}
            {this.state.books.slice(this.state.start, this.state.start + this.state.perPage).map(book => {
              return (
              <li key={book.isbn} className="book-list-item">
                <img src={book.image_url}/>
                <p className="book-title">{book.title}</p>
                <p className="book-author">{book.author}</p>
                <Link to="/">アウトプット一覧</Link>
              </li> //returnがないと表示できない
              ) 
            })} 
          </BookList>
          <ReactPaginate
            pageCount={Math.ceil(this.state.books.length / this.state.perPage)}
            marginPagesDisplayed={2}
            pageRangeDisplayed={5}
            onPageChange={this.pageChange}
            containerClassName='pagination'
            pageClassName='page-item'
            pageLinkClassName='page-link'
            activeClassName='active'
            previousLabel='<'
            nextLabel='>'
            previousClassName='page-item'
            nextClassName='page-item'
            previousLinkClassName='page-link'
            nextLinkClassName='page-link'
            disabledClassName='disabled'
            breakLabel='...'
            breakClassName='page-item'
            breakLinkClassName='page-link'
          />
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
    width: 40%;

    & input {
      /* 検索ワードを入力するテキストボックス */
      height: 24px;
      width: 82%;
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
      margin: 0 auto;
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
    }
  }
`

export default withRouter(Index);