# youtube-player-iframe

youtubeを再生しながらサーバー上の字幕ファイルを表示します。  
このブログ用に作りました。  
https://brasil-gospel2japanese.blogspot.com/  
サンプルが見れるページ  
https://brasil-gospel2japanese.blogspot.com/2025/10/blog-post_22.html  
YoutubeのIframePlayerAPIを使用しています。

## ファイル
- sub/*.srt  
SRT形式の字幕ファイル
- player.html  
本体
- sub-table.json  
youtubeのVIDEO_IDとsub/に置いた字幕ファイルのファイル名の対応を書いたjsonファイルです。  

## 使い方
- HTTPサーバー上に各ファイルを置きます。文字コードはUTF-8にします。
- sub/下にSRT形式の字幕ファイルを置きます。
- sub-table.jsonにyoutubeのVIDEO_IDとsub/に置いた字幕ファイルのファイル名の対応を書きます。  
VIDEO_IDはyoutubeのURLで  
https://www.youtube.com/watch?v=vM2A2XEm9TE  
の場合、vM2A2XEm9TEです。
```
例：
"4DFBOuQQi1s": "Aline Barros - Autor da Vida.srt",
```

## 見方
```
http://_SERVER_/player.html?v=VIDEO_ID  
```
で見れます。    
