import { KEY_MAP, CORRECT_FLASH_MS } from './config.js';
import { SequenceGame, renderEmptyChips } from './core/SequenceGame.js';
import { IconPanel } from './core/IconPanel.js';
import { BabyAnimator } from './core/BabyAnimator.js';
import { CountdownOverlay } from './core/CountdownOverlay.js';
import { EndingScreen } from './core/EndingScreen.js';
import { RevealMask } from './core/RevealMask.js';
import { SplashScreen } from './core/SplashScreen.js';
import { BackgroundMusic } from './core/BackgroundMusic.js';

async function loadJSON(path) {
  const res = await fetch(path);
  if (!res.ok) throw new Error(`讀取 ${path} 失敗：${res.status}`);
  return res.json();
}

function pickRandomLevel(levels) {
  return levels[Math.floor(Math.random() * levels.length)];
}

async function init() {
  // 0. 背景音樂：全程循環播放，一開始音量淡入
  const bgm = new BackgroundMusic({ src: 'assets/audio/main.mp3' });
  bgm.start();

  // 1. 讀取三份資料檔（關卡序列 / 裝飾icon設定 / 寶寶動畫狀態）
  const [levels, icons, babyStates] = await Promise.all([
    loadJSON('./data/levels.json'),
    loadJSON('./data/icons.json'),
    loadJSON('./data/baby-states.json'),
  ]);

  // 每一輪（含重來）都從關卡池隨機抽一關
  let level = pickRandomLevel(levels);

  const stageEl = document.getElementById('stage');
  const hintEl = document.getElementById('hint');

  // 序列格子的實心外框，一開始（SequenceGame 都還沒建立）就先畫出來，
  // 不要讓玩家看到格子從無到有生成的過程
  renderEmptyChips(document.getElementById('seqRow'), level.sequence);

  // 2. 初始化寶寶動畫
  const babyAnimator = new BabyAnimator({
    imgEl: document.getElementById('babyImg'),
    states: babyStates,
  });
  babyAnimator.setState('idle');

  // 3. 初始化四角裝飾icon（含隱藏的 PHOTO 彩蛋），一開始鎖住
  const iconPanel = new IconPanel({
    container: document.getElementById('babyStage'),
    icons,
    onTrigger: (ending) => game.forceEnding(ending),
  });
  iconPanel.render();
  iconPanel.setLocked(true);

  // 4. 初始化結局畫面（失敗結局的「重來一次」會呼叫 startRound 重跑一輪）
  const endingScreen = new EndingScreen({
    container: stageEl,
    failImageSrc: babyStates.fail.image,
    perfectImageSrc: 'assets/end/good.png',
    photoImageSrc: 'assets/end/followers.png',
    outroPosterSrc: 'assets/background/post02.png',
    onRestart: () => startRound(),
  });

  // 5. 鍵盤輸入（手機版靠畫面按鈕，電腦版靠這個）
  // 階段一／階段二時 game.locked 預設是 true，所以這裡不用額外判斷階段
  let game;
  document.addEventListener('keydown', (e) => {
    const dir = KEY_MAP[e.key];
    if (dir) game && game.handleInput(dir);
  });

  // 6. 一輪完整流程：監聽(聽寶寶念序列) → 倒數 → 解鎖輸入、開始作答
  // 抽成獨立函式是因為「重來一次」要能重新跑一遍，而不是重新整理頁面
  async function startRound() {
    level = pickRandomLevel(levels); // 每輪重新抽關，重來也會換一關
    babyAnimator.setState('idle');
    iconPanel.setLocked(true);

    let correctFlashTimer = null;

    game = new SequenceGame({
      sequence: level.sequence,
      seqRowEl: document.getElementById('seqRow'),
      hintEl,
      timerEl: document.getElementById('timer'),
      buttons: document.querySelectorAll('.vbtn'),
      onCorrect: () => {
        // 每按對一個方向，寶寶就瞬間切成成功圖，停一下再切回打拍子動畫
        clearTimeout(correctFlashTimer);
        babyAnimator.setState('success');
        correctFlashTimer = setTimeout(() => {
          babyAnimator.setState('answering');
        }, CORRECT_FLASH_MS);
      },
      onEnd: (ending) => {
        clearTimeout(correctFlashTimer);
        iconPanel.setLocked(true);
        if (ending === 'perfect') babyAnimator.setState('success');
        else if (ending === 'fail') babyAnimator.setState('fail');
        endingScreen.show(ending);
      },
    });

    await runIntro({ game, babyAnimator, hintEl, stageEl });
    iconPanel.setLocked(false);
    babyAnimator.setState('answering'); // 作答階段：寶寶跟著節奏上下壓縮
    game.start();
  }

  // 7. 開場擋板（HTML 裡已經先畫出來了）停留一下再淡出，才開始第一輪
  const splash = new SplashScreen({
    el: document.getElementById('splash'),
    buttonEl: document.getElementById('splashStartBtn'),
  });
  await splash.hide();

  await startRound();
}

// 階段一：把答案逐格顯示在序列格子上讓玩家看記；階段二：倒數。全部跑完才解鎖 PHOTO 彩蛋跟輸入。
async function runIntro({ game, babyAnimator, hintEl, stageEl }) {
  hintEl.textContent = '看看寶寶想要什麼？';
  babyAnimator.setState('revealing');

  // 看階段的黃色蒙版：HTML 裡已經先畫出來了，這裡只負責顯示／隱藏
  const mask = new RevealMask({ el: document.getElementById('revealMask') });
  mask.show();

  await game.previewReveal();

  mask.hide();
  game.hidePreview(); // 蓋回實心格子，看不出答案
  babyAnimator.setState('idle');
  hintEl.textContent = '準備開始！';
  const countdown = new CountdownOverlay({ container: stageEl });
  await countdown.start();
}

init().catch((err) => {
  // 初始化中途如果出錯，直接把錯誤訊息顯示在畫面上，不用開 DevTools 也看得到
  console.error('遊戲初始化失敗：', err);
  const hintEl = document.getElementById('hint');
  if (hintEl) hintEl.textContent = `發生錯誤：${err.message}`;
});
