// 鍵盤按鍵 → 遊戲動作 的對應表
export const KEY_MAP = {
  ArrowUp: 'look',
  ArrowDown: 'kiss',
  ArrowLeft: 'hug',
  ArrowRight: 'pat',
  ' ': 'me',
};

// 動作 → 顯示文字
export const LABELS = {
  look: '看',
  kiss: '親',
  hug: '抱',
  pat: '拍',
  me: '我',
};

// 一輪的作答時間（秒）
export const ROUND_TIME_SEC = 5;

// 階段一「看寶寶要幹嘛」：答案一次全部顯示出來，要停留多久（毫秒）才蓋掉
export const REVEAL_DISPLAY_MS = 2500;

// 倒數畫面：3 → 2 → 1 → START，每個字停留的時間（毫秒）
export const COUNTDOWN_STEPS = ['3', '2', '1', 'START'];
export const COUNTDOWN_STEP_MS = 700;

// PHOTO 彩蛋結局的閃光次數／間隔（毫秒）
export const PHOTO_FLASH_TIMES = 3;
export const PHOTO_FLASH_INTERVAL_MS = 120;

// 作答階段每按對一個方向，寶寶切成成功圖要停留多久（毫秒）才切回打拍子動畫
export const CORRECT_FLASH_MS = 350;

// 三種結局畫面停留多久（毫秒）之後自動轉黑幕，帶出演出資訊
export const OUTRO_DELAY_MS = 3000;

// 開場擋板：點下「開始照顧寶寶」之後，淡出要多久（毫秒）
export const SPLASH_FADE_MS = 600;

// 背景音樂：全程循環播放的音量、淡入時間（毫秒）
export const BGM_VOLUME = 0.3;
export const BGM_FADE_IN_MS = 1000;
