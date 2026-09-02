/**
 * 階段一「看寶寶要幹嘛」用的半透明黃色蒙版。
 * 蓋住整個 stage（狀態列、四角icon、按鍵列），
 * 只留寶寶圖跟序列格子清楚可見，同時擋掉點擊，達到視覺跟操作都鎖住的效果。
 *
 * 蒙版本體直接寫死在 index.html 裡（一開始就在，不用等 JS 建立），
 * 這裡只負責顯示／隱藏，每一輪重來都可以重複使用同一個元素。
 */
export class RevealMask {
  constructor({ el }) {
    this.el = el;
  }

  show() {
    this.el.style.display = '';
  }

  hide() {
    this.el.style.display = 'none';
  }
}
