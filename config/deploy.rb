# capistranoのバージョンを記載。固定のバージョンを利用し続け、バージョン変更によるトラブルを防止する
lock '3.16.0'

# Capistranoのログの表示に利用する
set :application, 'my_recommended_books'

# どのリポジトリからアプリをpullするかを指定する
set :repo_url,  'git@github.com:togo-mentor/my_recommended_books.git'
# ask :branch, proc { `git rev-parse --abbrev-ref HEAD`.chomp }.call

# バージョンが変わっても共通で参照するディレクトリを指定
set :linked_dirs, fetch(:linked_dirs, []).push('log', 'tmp/pids', 'tmp/cache', 'tmp/sockets', 'vendor/bundle', 'public/system', 'public/uploads', 'public/javascripts')
set :linked_files, fetch(:linked_files, []).push("config/master.key")

set :rbenv_type, :user
set :rbenv_ruby, '2.6.5' #カリキュラム通りに進めた場合、’2.6.5’ です

# どの公開鍵を利用してデプロイするか
set :ssh_options, auth_methods: ['publickey'],
                                  keys: ['~/.ssh/kaidoku_2.pem'] 

# プロセス番号を記載したファイルの場所
set :unicorn_pid, -> { "#{shared_path}/tmp/pids/unicorn.pid" }

# Unicornの設定ファイルの場所
set :unicorn_config_path, -> { "#{current_path}/config/unicorn.rb" }
set :keep_releases, 5


desc 'Run rake npm install'
task :npm_install do
  on roles(:web) do
    within current_path do
      execute("cd #{current_path}/frontend && npm install")
      execute("cd #{current_path}/frontend && webpack")
    end
  end
end
before 'deploy:assets:precompile', 'npm_install'
after 'deploy:finishing', :compile_assets

# デプロイ処理が終わった後、Unicornを再起動するための記述
after 'deploy:publishing', 'deploy:restart'
namespace :deploy do
  task :restart do
    invoke 'unicorn:restart'
  end
end