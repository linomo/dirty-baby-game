import { SPLASH_HOLD_MS, SPLASH_FADE_MS } from '../config.js';

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * 開場擋板的淡出控制。擋板本體（粉紅色鏤空 Dirty Baby 字樣）直接寫死在
 * index.html 裡，瀏覽器第一時間就畫出來，避免等 JS/資料載入完才插入畫面、
 * 中間閃一下裸畫面的卡頓感。這裡只負責「停留一下再淡出、淡出完就移除」。
 */
export class SplashScreen {
  constructor({ el }) {
    this.el = el;
  }

  async hide() {
    await wait(SPLASH_HOLD_MS);
    this.el.classList.add('splash-fade-out');
    await wait(SPLASH_FADE_MS);
    this.el.remove();
  }
}
