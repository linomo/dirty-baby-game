import { COUNTDOWN_STEPS, COUNTDOWN_STEP_MS } from '../config.js';

/**
 * 倒數畫面：3 → 2 → 1 → START。
 * 每一步都要重新觸發跳動動畫，所以用「移除動畫→強制 reflow→加回動畫」的方式，
 * 而不是只改 textContent（那樣 CSS animation 不會重播）。
 */
export class CountdownOverlay {
  constructor({ container }) {
    this.container = container;
  }

  // 回傳 Promise，整段倒數跑完（含 START 停留時間）才 resolve
  start() {
    return new Promise((resolve) => {
      const overlay = document.createElement('div');
      overlay.className = 'countdown-overlay';
      const numEl = document.createElement('div');
      numEl.className = 'countdown-num';
      overlay.appendChild(numEl);
      this.container.appendChild(overlay);

      let i = 0;
      const showStep = () => {
        const step = COUNTDOWN_STEPS[i];
        numEl.textContent = step;
        numEl.classList.toggle('start-text', step === 'START');

        numEl.style.animation = 'none';
        void numEl.offsetWidth; // 強制 reflow，讓動畫下次加回去時會重新播放
        numEl.style.animation = '';

        i += 1;
        if (i < COUNTDOWN_STEPS.length) {
          setTimeout(showStep, COUNTDOWN_STEP_MS);
        } else {
          setTimeout(() => {
            overlay.remove();
            resolve();
          }, COUNTDOWN_STEP_MS);
        }
      };
      showStep();
    });
  }
}
