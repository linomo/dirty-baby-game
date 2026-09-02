import { SPLASH_FADE_MS } from '../config.js';

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * 開場擋板的互動控制。擋板本體（粉紅色鏤空 Dirty Baby 字樣＋「開始照顧寶寶」
 * 按鈕）直接寫死在 index.html 裡，瀏覽器第一時間就畫出來。這裡負責：
 * 1. 讓按鈕寬度自動跟「Dirty Baby」那行字一樣寬
 * 2. 等玩家點下按鈕才淡出——玩家一定要點過一次，這個點擊同時也是背景音樂
 *    能解除瀏覽器自動播放限制所需要的「使用者互動」
 */
export class SplashScreen {
  constructor({ el, buttonEl }) {
    this.el = el;
    this.buttonEl = buttonEl;
    this.matchButtonWidthToTitle();
  }

  // 讓按鈕寬度跟「Dirty Baby」鏤空字一樣寬
  matchButtonWidthToTitle() {
    const titleText = this.el.querySelector('.splash-title-text');
    const svg = this.el.querySelector('.splash-svg');
    if (!titleText || !svg) return;

    const titleWidth = titleText.getBBox().width;
    const viewBoxWidth = svg.viewBox.baseVal.width;
    this.buttonEl.style.width = `${(titleWidth / viewBoxWidth) * 100}%`;
  }

  hide() {
    return new Promise((resolve) => {
      this.buttonEl.addEventListener(
        'click',
        async () => {
          this.el.classList.add('splash-fade-out');
          await wait(SPLASH_FADE_MS);
          this.el.remove();
          resolve();
        },
        { once: true }
      );
    });
  }
}
