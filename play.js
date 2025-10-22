let Subtitle = function (startSec, endSec, texts) {
    this.startSec = startSec;
    this.endSec = endSec;
    this.texts = texts;
};

let SubManager = function () {
    this.subtitles = [];
};

SubManager.prototype.readSub = async function (url) {
    /*
      字幕ファイルのテキストを配列に読み込む
      引数：
      url 字幕ファイルのurl
      */
    const response = await fetch(url);
    const text = await response.text();

    const lines = text.split("\r\n"); // 空行で分割

    const re = new RegExp(
        /(\d{2}):(\d{2}):(\d{2})[\.,]000 --> (\d{2}):(\d{2}):(\d{2})[\.,]000/
    );
    let subtitle = null;
    for (const line of lines) {
        const m = line.match(re);
        if (m != null) {
            // 時間指定行
            startSec =
                parseInt(m[1]) * 60 * 60 + parseInt(m[2]) * 60 + parseInt(m[3]);
            endSec = parseInt(m[4]) * 60 * 60 + parseInt(m[5]) * 60 + parseInt(m[6]);

            subtitle = new Subtitle(startSec, endSec, []);
            continue;
        }

        if (line.length == 0) {
            // 空行
            if (subtitle != null) {
                this.subtitles.push(subtitle);
                subtitle = null;
                continue;
            }
        }

        //字幕テキスト
        if (subtitle != null) {
            subtitle.texts.push(line);
        }
    }
};

SubManager.prototype.getSub = function (sec) {
    // 指定された秒数の字幕テキストの配列を返す

    for (const subtitle of this.subtitles) {
        if (subtitle.startSec <= sec && sec < subtitle.endSec)
            return subtitle.texts;
    }
    return [];
};

let SetuupVideo = async function () {
    // url引数取得
    let uri = new URL(window.location.href);
    const param = uri.search;
    if (param.length == 0) {
        console.log("urlに引数がありません");
        return;
    }

    // url引数：v=videoId
    let videoId = "";
    if (uri.searchParams.has("v")) {
        videoId = uri.searchParams.get("v");
    } else {
        console.log("videoIdが指定されていません");
        return;
    }

    // 字幕テーブル読み込み
    //const jsonFileUrl = `${uri.protocol}//${uri.hostname}/youtube-player/sub-table.json`
    const jsonFileUrl = "sub-table.json";
    const response = await fetch(jsonFileUrl);
    const subTable = await response.json();

    if (!(videoId in subTable)) {
        console.log(`videoId:${videoId}がテーブルにありません`);
        return;
    }
    let subFile = subTable[videoId];
    document.title = subFile.split(".").slice(0, -1).join("."); // タイトル設定
    let subFileUrl = "sub/" + subFile;
    //let subFileUrl= `${uri.protocol}//${uri.hostname}/youtube-player/sub/${subFile}`

    let sm = new SubManager();
    sm.readSub(subFileUrl);

    const player = new YT.Player("video", {
        videoId: videoId,
        width: "100%",
        height: "100%",
    });

    setInterval(() => {
        // 字幕表示
        if (typeof player.getCurrentTime !== "function") {
            console.log("関数player.getCurrentTimeがありません");
            return;
        }
        sec = player.getCurrentTime();
        texts = sm.getSub(sec);
        if (texts.length > 0) {
            document.getElementById("subtitle").style.visibility = "visible";
            text = texts.join("<br/>");
            document.getElementById("subtitle").innerHTML = text;
        } else {
            document.getElementById("subtitle").style.visibility = "hidden";
            document.getElementById("subtitle").innerHTML = "";
        }
    }, 500);
};

async function onYouTubeIframeAPIReady() {
    SetuupVideo();
}
