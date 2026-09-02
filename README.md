# Dirty baby二創小遊戲

Dirty Baby（達康.come）歌曲二創投稿用的小遊戲：跩寶寶用「看/親/抱/拍/我」跟大人討關注，玩家要記住寶寶要求的順序、限時內照樣按出來。

線上試玩：**https://linomo.github.io/dirty-baby-game/**

## 怎麼在本機打開測試

**重要：不能直接雙擊 index.html 打開！**
因為程式會用 `fetch()` 讀取 `data/` 資料夾裡的 JSON，瀏覽器基於安全性限制，
用「直接開檔案」的方式（網址列會是 `file://...`）會讀取失敗。

正確做法：
1. 在 VS Code 左側安裝「Live Server」擴充套件（左側方塊圖示 → 搜尋 Live Server → 安裝）
2. 在 VS Code 左側檔案列表裡，右鍵點 `index.html`
3. 選「Open with Live Server」
4. 瀏覽器會自動打開，網址列會是 `http://127.0.0.1:5500/...` 這種格式，這樣才是對的

## 目前的遊戲流程

1. **開場**：粉紅擋板鏤空出 Logo，淡出後進入遊戲
2. **看階段**：從 `data/levels.json` 隨機抽一關，序列格子直接顯示完整答案讓玩家記，同時蓋一層黃色蒙版鎖住其他操作
3. **倒數**：3 → 2 → 1 → START，倒數完才解鎖輸入
4. **作答階段**：限時內用方向鍵（↑↓←→）／空白鍵，或直接點畫面按鈕，照記憶按出正確順序
   - 全部答對 → 完美結局（送終）
   - 只要錯一個 → 混亂結局（可以按「重來一次」馬上再挑戰）
   - 作答階段點右上角相機 icon（📷）→ 拍照打卡結局（其他三個角落 icon 是裝飾用的，按了只會晃一下＋跑一句吐槽跑馬燈）
5. **結局畫面**：perfect / photo 兩種「玩完了」的結局，停留幾秒後自動轉黑幕，帶出巡演海報、歌曲連結、工作人員名單，右下角小圖示可以再玩一次
6. 全程有背景音樂（`assets/audio/main.mp3`）循環播放，一開始會淡入

## 檔案結構

```
index.html              ← 畫面骨架，開場擋板/黃色蒙版本體也寫死在這裡
style.css               ← 所有樣式跟配色
src/
  config.js             ← 按鍵對應、文字標籤、各種時間長度／音量，要調數值都改這裡
  main.js               ← 主程式，只負責讀資料＋把模組串起來，不寫商業邏輯
  core/
    SequenceGame.js     ← 核心邏輯：序列比對、計時、答對/答錯判定、看階段答案預覽
    IconPanel.js        ← 四角裝飾icon（含隱藏的PHOTO彩蛋、假icon的吐槽跑馬燈）
    BabyAnimator.js     ← 寶寶圖片＋動畫狀態切換
    SplashScreen.js     ← 開場擋板淡出控制
    RevealMask.js       ← 看階段黃色蒙版顯示／隱藏
    CountdownOverlay.js ← 3→2→1→START 倒數畫面
    EndingScreen.js     ← 三種結局畫面＋停留後的黑幕宣傳頁
    BackgroundMusic.js  ← 背景音樂播放＋淡入（含瀏覽器自動播放被擋的退場機制）
data/
  levels.json           ← 5 關關卡序列，每輪／每次重來都會隨機抽一關
  icons.json            ← 四角icon設定，哪個是真的（isReal）在這裡改
  baby-states.json      ← 寶寶各狀態對應的圖片跟動畫效果
assets/
  baby/                 ← 寶寶各狀態圖片（idle / success / fail）
  background/           ← 寶寶兩側的手繪小海報＋結局宣傳頁用的巡演海報
  end/                  ← 完美結局／拍照結局的完整插畫
  audio/                ← 背景音樂（main.mp3）
```

## 還沒做的事

- [ ] Excel → JSON 的關卡資料轉換小工具
- [ ] 關卡選擇畫面（目前是自動隨機抽關，沒有讓玩家自己選）
