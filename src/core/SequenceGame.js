import { LABELS, ROUND_TIME_SEC, REVEAL_DISPLAY_MS } from '../config.js';

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// 畫出實心序列格子（看不出答案）。獨立成函式是因為 main.js 想在遊戲一開始、
// SequenceGame 都還沒建立之前就先把格子畫出來，不要讓玩家等到格子突然冒出來。
export function renderEmptyChips(seqRowEl, sequence) {
  seqRowEl.innerHTML = '';
  sequence.forEach(() => {
    const chip = document.createElement('div');
    chip.className = 'seq-chip';
    chip.innerHTML = '<span class="spark">✨</span><span class="txt"></span>';
    seqRowEl.appendChild(chip);
  });
}

/**
 * 一輪記憶遊戲的核心邏輯。
 * 只負責「序列比對、計時、畫面上的序列格子」，
 * 不管音效、不管寶寶動畫、不管結局畫面 —— 那些交給其他模組。
 */
export class SequenceGame {
  constructor({ sequence, seqRowEl, hintEl, timerEl, buttons, onEnd, onCorrect }) {
    this.sequence = sequence;
    this.seqRowEl = seqRowEl;
    this.hintEl = hintEl;
    this.timerEl = timerEl;
    this.buttons = buttons;
    this.onEnd = onEnd; // (endingType: 'perfect' | 'fail') => void
    this.onCorrect = onCorrect; // 每按對一個方向就會呼叫（讓寶寶瞬間切成成功圖）

    this.index = 0;
    this.timeLeft = ROUND_TIME_SEC;
    this.timerHandle = null;
    this.locked = true;

    // 一建立就馬上把畫面重置乾淨（格子、計時器），
    // 這樣「重來一次」在監聽/倒數階段就不會殘留上一輪答錯/答對的格子
    this.buildChips();
    this.updateTimerDisplay();
  }

  // 建立空的序列格子（實心、看不出答案）
  buildChips() {
    renderEmptyChips(this.seqRowEl, this.sequence);
  }

  // 看階段：把整段答案一次顯示出來讓玩家記，不影響作答進度／鎖定狀態
  async previewReveal() {
    this.sequence.forEach((dir, i) => this.revealChip(i, dir));
    await wait(REVEAL_DISPLAY_MS);
  }

  // 看完之後把格子蓋回實心，看不出答案
  hidePreview() {
    this.buildChips();
  }

  start() {
    this.index = 0;
    this.timeLeft = ROUND_TIME_SEC;
    this.locked = false;
    this.buildChips();
    this.hintEl.textContent = '換你了！';
    this.bindButtons();
    this.startTimer();
  }

  bindButtons() {
    this.buttons.forEach((btn) => {
      btn.onclick = () => this.handleInput(btn.dataset.dir);
    });
  }

  startTimer() {
    this.updateTimerDisplay();
    this.timerHandle = setInterval(() => {
      this.timeLeft -= 1;
      this.updateTimerDisplay();
      if (this.timeLeft <= 0) this.finish();
    }, 1000);
  }

  updateTimerDisplay() {
    const t = Math.max(this.timeLeft, 0);
    this.timerEl.textContent = `00:${String(t).padStart(2, '0')}`;
  }

  // 供鍵盤事件跟按鈕點擊共用的輸入入口
  handleInput(dir) {
    if (this.locked || !dir) return;

    const expected = this.sequence[this.index];
    if (dir === expected) {
      this.revealChip(this.index, dir);
      this.onCorrect && this.onCorrect();
      this.index += 1;
      if (this.index === this.sequence.length) {
        this.hintEl.textContent = '全部答對！🎉';
        this.finish();
      } else {
        this.hintEl.textContent = '換你了！';
      }
    } else {
      this.markWrong(this.index);
      this.hintEl.textContent = '按錯了！';
      this.finish();
    }
  }

  revealChip(i, dir) {
    const chip = this.seqRowEl.children[i];
    chip.classList.add('revealed', `c-${dir}`);
    chip.querySelector('.txt').textContent = LABELS[dir];
  }

  markWrong(i) {
    const chip = this.seqRowEl.children[i];
    chip.classList.add('wrong');
    chip.querySelector('.txt').textContent = '✗';
  }

  // 結束這一輪（按錯 / 全部答對 / 時間到 都會走到這）
  finish() {
    if (this.locked) return; // 避免重複觸發
    this.locked = true;
    clearInterval(this.timerHandle);

    // 全對才算 perfect；只要錯一個（不管前面對了幾個）都算 fail
    const ending = this.index === this.sequence.length ? 'perfect' : 'fail';
    this.onEnd(ending);
  }

  // PHOTO 彩蛋按下時，外部直接呼叫這個，跳過分數判定
  forceEnding(endingType) {
    if (this.locked) return;
    this.locked = true;
    clearInterval(this.timerHandle);
    this.onEnd(endingType);
  }
}
