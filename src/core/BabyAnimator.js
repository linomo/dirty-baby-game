/**
 * 控制寶寶目前顯示哪張圖、套用哪個動畫效果（呼吸/壓縮/晃動...）。
 * 動畫效果本身寫在 style.css 裡（.anim-breathe / .anim-squash / .anim-shake），
 * 這裡只負責「換圖 + 換 class」，不寫任何動畫細節，
 * 之後想調整寶寶的動作表現，只要改 baby-states.json 或 style.css，不用碰這個檔案。
 */
export class BabyAnimator {
  constructor({ imgEl, states }) {
    this.imgEl = imgEl;
    this.states = states;
    this.currentAnim = null;
  }

  setState(stateName) {
    const state = this.states[stateName];
    if (!state) {
      console.warn(`BabyAnimator: 找不到狀態 "${stateName}"，請檢查 baby-states.json`);
      return;
    }

    this.imgEl.src = state.image;

    if (this.currentAnim) {
      this.imgEl.classList.remove(this.currentAnim);
    }
    this.currentAnim = `anim-${state.animation}`;
    this.imgEl.classList.add(this.currentAnim);
  }
}
