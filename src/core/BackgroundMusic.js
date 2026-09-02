import { BGM_VOLUME, BGM_FADE_IN_MS } from '../config.js';

/**
 * 全程循環播放的背景音樂，一開始音量從 0 慢慢淡入。
 * 瀏覽器通常會擋住「使用者還沒跟頁面互動過」的自動播放，
 * 所以先嘗試自動播放，被擋下來的話就改成監聽玩家第一次點擊/按鍵/觸控再播放。
 */
export class BackgroundMusic {
  constructor({ src, volume = BGM_VOLUME, fadeMs = BGM_FADE_IN_MS }) {
    this.audio = new Audio(src);
    this.audio.loop = true;
    this.audio.volume = 0;
    this.targetVolume = volume;
    this.fadeMs = fadeMs;
    this.started = false;
  }

  start() {
    if (this.started) return;

    const attemptPlay = () => {
      this.audio
        .play()
        .then(() => {
          if (this.started) return;
          this.started = true;
          this.fadeIn();
          cleanup();
        })
        .catch(() => {
          // 還是被瀏覽器擋下來，等下一次互動事件再試一次
        });
    };

    const cleanup = () => {
      document.removeEventListener('click', attemptPlay);
      document.removeEventListener('keydown', attemptPlay);
      document.removeEventListener('touchstart', attemptPlay);
    };

    document.addEventListener('click', attemptPlay);
    document.addEventListener('keydown', attemptPlay);
    document.addEventListener('touchstart', attemptPlay);

    attemptPlay(); // 先試著自動播放；成功的話上面的監聽器會被清掉
  }

  fadeIn() {
    const steps = 30;
    const stepMs = this.fadeMs / steps;
    let i = 0;
    const iv = setInterval(() => {
      i += 1;
      this.audio.volume = Math.min(this.targetVolume, (this.targetVolume * i) / steps);
      if (i >= steps) clearInterval(iv);
    }, stepMs);
  }
}
