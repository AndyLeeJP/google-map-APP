# 東京都無料 Wi-Fi スポットの可視化(Google Map)

https://google-map-app.vercel.app/

東京オープンデータ(<https://portal.data.metro.tokyo.lg.jp/opendata-api/>)を使用し東京都にある無料 Wi-Fi スポットの座標と住所を取得し、Google Map で座標の位置にピンが表示されており、ピンをクリックすると住所が表示されます。
現在地情報の取得を許可すると現在地が画面の中心の状態でマップが表示され、却下すると東京駅が画面の中心にくるようになっております。

## 使用時の注意

Google Map を使用する上で Google Platform にて API キーを取得する必要がございます。

## 環境

- node 19.2.0
- npm 8.19.3
- TypeScript 4.9.3
- React 18.2.0
- react-google-maps/api 2.17.1

### 起動方法およびデプロイ

ローカル環境では下記のコマンドでプロジェクトが実行され自動でウィンドウが起動します。  
npm start

vercel にてデプロイ(<https://vercel.com/>)

- 無料登録
- 環境変数にて API キーを設定
