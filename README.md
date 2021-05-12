# アプリケーション名
俺の推薦図書

# アプリケーションの概要
- ユーザー間でおすすめしたい本を共有する。
- 共有した書籍に対し、気付きやアクションプランを投稿し合う。
- 読書後の気づきやアクションプランに対して気軽にいいね！やリプライをし合うことで挑戦者を応援し合う。
- 輪読会を気軽に開催できる場を提供し、他人との約束を通じて読書週間を促す。

# 想定しているペルソナ
- 読書を習慣化したい20代以上の学生・社会人
- 読書習慣はあるがいまいち日々の生活に活かせていないと感じる方
- 推薦図書を一通り読み終わったが次に読む本が決まらない社員

# デプロイURL
https://kaidoku.herokuapp.com/

# テスト用アカウント
今後記載予定

# 利用方法

# 解決したい課題
①推薦図書を読み終わった人が読むべき本が定まっていない。読書習慣がない人は特に推薦図書を読み終わった後どのような本を読めばいいかわからない
②①の結果会社のルールとして「週1冊以上本を読む」とあるものの、読書習慣がある人とない人で体現度にばらつきが出やすい構造である。
③輪読会開催が個人の自主性に委ねられている。

# 洗い出した要件
|機能|目的|ユーザーストーリー|
|---|----|-------------------|
|書籍一覧機能|登録していないユーザーに投稿された書籍を一覧化して表示することでざっくりとアプリの使用イメージを掴んでもらう|トップページにアクセスすると新規登録ボタンと同時に既に投稿された書籍が一覧化して表示されている。ユーザー登録しないと書籍の詳細は確認できないため、ここでユーザー登録を促したい。|
|ユーザー管理機能	|アプリの利用者となるユーザーを登録する。誰が投稿した本なのか、アクションプランを明確にすることで社員同士のコミュニケーションにもつながる |ユーザーはトップページから新規登録ページにいき、ユーザーを登録する。ログインすると書籍検索および書籍一覧以外の機能が一通り使えるようになる。|
|推薦図書投稿機能|	推薦図書を投稿することでdibookを読み終えた人がどんな本を読めばいいのかわかる	|ユーザーは書籍を投稿できる。書籍情報としては著者、出版社、購入時の価格、Amazonリンクなどを貼る。また投稿時に任意で同時にアクションプランも投稿できる。アクションプランの投稿は後回しにできる。|
アクションプラン投稿機能	|アクションプランを共有し合うことでユーザー間で読書体験を仕事や人生に活かす	|書籍の詳細ページからアクションプランを投稿。アクセスしているユーザーに即座に反映される。詳細ページには10件まで表示し、それ以降はみたい場合はページネーションで遷移させる。|
アクションプラン編集機能	|一度投稿したアクションプランに修正を加える|	アクションプランに編集ボタンを付ける。編集ボタンをクリックするとフォームが出てきて非同期で編集できる。一度投稿したアクションプランをやっぱり修正したい場合などに使う。|
書籍検索機能	|読みたい本があれなんだっけ？ってなったときに検索できるようにしておきたい。	|トップページから書籍を検索できるようにする。書籍一覧は一部の書籍しか表示しない設定にしたいので詳しくみたければ検索して、どうぞという感じです。ログインしていないユーザーでもできるようにする。|
アクションプラン検索機能	|自分の悩みや関心に近いアクションプランを検索して日々の行動に活かしやすくする|	ログインしているユーザーが今の悩みや課題に応じて書籍およびアクションプランを検索できるようにする。|
書籍フォロー機能|	後で読みたい本をメモしておくことであれなんだっけ？となるのを防ぐ	|書籍にブックマークボタンを追加→マイページから一覧で見れるようにする。今すぐ読むわけじゃないけど後で読みたい本をブクマしておく|
アクションプランいいね！機能	|自分も実践してみたい！と思ったアクションプランを保存しておくことで実践しやすくする	|いいね！ボタンをアクションプランに設置し、押すとアクションプラン投稿者への通知が飛ぶ。それ、いいね！と思ったときに応援できるようにする|
アクションプランリプライ機能|	アクションプランの続きや応援のメッセージを送信しあい、挑戦を後押しする	|投稿機能のボタンからリプライを送れるようにする。リプライを送るとユーザーに通知が飛ぶアクションプランに対し感想を共有したいときに使う。|
輪読会開催機能|	輪読会を開催し、集団での読書体験を実現。他人との約束で読書習慣をつける|	開催者は締め切りと書籍情報、イベント詳細を記入し投稿。zoomリンクも貼れるようにする|
アクションプラン削除機能	|一度投稿したアクションプランを削除できるようにする。|	アクションプランを共有したけどやっぱりやめたいときに使う|

# 実装した機能の詳細

# 実装予定の機能

# データベース設計
## usersテーブル
|Column|Type|Options|
|------|----|-------|
|nickname|string|null: false, unique: true|
|email|string|null: false, unique: true|
|encrypted_password|string|null: false|
|avatar||ActiveStorageで実装|
その他devise_auth_tokenのデフォルトのカラム

### Associations
- has_many :user_books
- has_many :books, through: :user_books
- has_many  :likes

## booksテーブル
|Column|Type|Options|
|------|----|-------|
|isbn|string|null: false, unique: true|
|title|string|null: false|
|author|string|null: false|
|author_kana|string|null: false|
|publisher_name|string|null: false|
|sales_date|string|null: false|
|item_price|integer|null: false|
|item_url|text|null: false|
|image_url|text|null: false|

### Associations
- has_many :user_books
- has_many :users, through: :user_books
- has_many :likes

### 補足
isbnは世界の書籍を識別するコード。同じ本であるかどうかを判定するのに用いる

## user_booksテーブル
|Column|Type|Options|
|------|----|-------|
|book|references|null: false, foreign_key: true|
|user|references|null: false, foreign_key: true|

### Associations
- belongs_to :user
- belongs_to :book


## likesテーブル(未実装)
|Column|Type|Options|
|------|----|-------|
|book|references|null: false, foreign_key: true|
|user|references|null: false, foreign_key: true|
|status_id|integer|null: false ※ActiceHashを用いて実装|


### Associations
- belongs_to :book
- belongs_to :user
- has_one :action_plan

## awarenessesテーブル
|Column|Type|Options|
|------|----|-------|
|content|string|null: false|
|user|references|null: false, foreign_key: true|
|book|references|null: false, foreign_key: true|

### Associations
- belongs_to :book
- belongs_to :user
- has_many :action_plans

## action_plansテーブル
|Column|Type|Options|
|------|----|-------|
|time_of_execution|string|null: false|
|what_to_do|string|null: false|
|how_to_do|string||
|awareness|references|null: false, foreign_key: true|

### Associations
- belongs_to :awareness

# ローカルでの動作方法
