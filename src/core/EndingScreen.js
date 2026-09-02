import { PHOTO_FLASH_TIMES, PHOTO_FLASH_INTERVAL_MS, OUTRO_DELAY_MS } from '../config.js';

const FAIL_EMOJIS = ['🍼', '💩', '🐱', '🤮'];
const FAIL_EMOJI_COUNT = 32;

const OUTRO_LINKS = [
  { label: '達康.come－Baby先生全壘打', url: 'https://legacy.soundscape.net/a/171654' },
  { label: '達康.come－明天初老的我不在你眼裡', url: 'https://legacy.soundscape.net/a/145202' },
];

const OUTRO_CREDITS = [
  '音樂：Dirty Baby・達康.come・何瑞康 RayKang',
  '插畫・遊戲企劃：BB',
  '程式開發：Claude',
  '特別感謝：達達寶寶',
];

const OUTRO_COPYRIGHT = '℗ 有笑果漫才創意有限公司　©草莓Bberry城堡的角落';

/**
 * 三種結局的全螢幕畫面（蓋在 .stage 上面）。
 * perfect / photo 直接顯示使用者畫好的完整結局插畫，文字已經畫在圖裡了，
 * 只在上面疊一句標語。停留 OUTRO_DELAY_MS 之後會自動轉成
 * 黑幕 + 巡演海報 + 歌曲連結 + 工作人員名單的最終畫面 —— 只有 perfect / photo
 * 這兩種「玩完了」的結局會接宣傳畫面，fail 留在畫面上讓玩家重來，不會被推走。
 */
export class EndingScreen {
  constructor({ container, failImageSrc, perfectImageSrc, photoImageSrc, outroPosterSrc, onRestart }) {
    this.container = container;
    this.failImageSrc = failImageSrc;
    this.perfectImageSrc = perfectImageSrc;
    this.photoImageSrc = photoImageSrc;
    this.outroPosterSrc = outroPosterSrc;
    this.onRestart = onRestart; // 失敗結局的「重來一次」按鈕會呼叫這個
    this.outroTimer = null;
  }

  show(type) {
    clearTimeout(this.outroTimer);

    const overlay = document.createElement('div');
    overlay.className = `ending-overlay ending-${type}`;

    if (type === 'perfect') {
      overlay.innerHTML = `
        <div class="ending-caption">老了有人送終</div>
        <img class="ending-full-img" src="${this.perfectImageSrc}" alt="送終">
      `;
      this.container.appendChild(overlay);
    } else if (type === 'photo') {
      overlay.innerHTML = `
        <div class="ending-caption">恭喜達成十萬人追蹤！</div>
        <img class="ending-full-img" src="${this.photoImageSrc}" alt="拍照打卡十萬人追蹤">
      `;
      this.container.appendChild(overlay);
      this.playFlash();
    } else {
      overlay.innerHTML = `
        <div class="marquee-row top"><span>你們耳聾嗎！！　　你們耳聾嗎！！　　你們耳聾嗎！！</span></div>
        <div class="fail-emoji-field"></div>
        <img class="fail-baby-img" src="${this.failImageSrc}" alt="fail">
        <button class="ending-restart-btn" type="button">重來一次</button>
        <div class="marquee-row bottom"><span>你們耳聾嗎！！　　你們耳聾嗎！！　　你們耳聾嗎！！</span></div>
      `;
      this.container.appendChild(overlay);
      this.spawnFailEmojis(overlay.querySelector('.fail-emoji-field'));
      overlay.querySelector('.ending-restart-btn').addEventListener('click', () => {
        clearTimeout(this.outroTimer);
        overlay.remove();
        this.onRestart && this.onRestart();
      });
    }

    // 只有 perfect / photo 這種「玩完了」的結局才會接宣傳畫面；
    // fail 留在畫面上讓玩家用「重來一次」繼續挑戰，不會被推去黑幕
    if (type !== 'fail') {
      this.outroTimer = setTimeout(() => this.showOutro(), OUTRO_DELAY_MS);
    }
  }

  showOutro() {
    this.container.querySelectorAll('.ending-overlay, .photo-flash').forEach((el) => el.remove());

    const outro = document.createElement('div');
    outro.className = 'outro-overlay';
    outro.innerHTML = `
      <img class="outro-poster" src="${this.outroPosterSrc}" alt="演出資訊">
      <div class="outro-links">
        ${OUTRO_LINKS.map(
          (link) => `<a href="${link.url}" target="_blank" rel="noopener noreferrer">${link.label}</a>`
        ).join('')}
      </div>
      <div class="outro-credits">${OUTRO_CREDITS.join('<br>')}</div>
      <div class="outro-copyright">${OUTRO_COPYRIGHT}</div>
      <button class="outro-restart-icon" type="button" aria-label="再玩一次">↺</button>
    `;
    this.container.appendChild(outro);
    outro.querySelector('.outro-restart-icon').addEventListener('click', () => {
      outro.remove();
      this.onRestart && this.onRestart();
    });
  }

  spawnFailEmojis(field) {
    for (let i = 0; i < FAIL_EMOJI_COUNT; i += 1) {
      const span = document.createElement('span');
      span.className = 'floating-emoji';
      span.textContent = FAIL_EMOJIS[Math.floor(Math.random() * FAIL_EMOJIS.length)];
      span.style.fontSize = `${32 + Math.random() * 52}px`;
      span.style.left = `${Math.random() * 90}%`;
      span.style.top = `${Math.random() * 90}%`;
      span.style.animationDuration = `${1.2 + Math.random() * 1.6}s`;
      span.style.animationDelay = `${Math.random() * 1}s`;
      field.appendChild(span);
    }
  }

  playFlash() {
    const flash = document.createElement('div');
    flash.className = 'photo-flash';
    this.container.appendChild(flash);

    let count = 0;
    const tick = () => {
      flash.classList.remove('flash-on');
      void flash.offsetWidth;
      flash.classList.add('flash-on');
      count += 1;
      if (count < PHOTO_FLASH_TIMES) {
        setTimeout(tick, PHOTO_FLASH_INTERVAL_MS * 2);
      }
    };
    tick();
  }
}
