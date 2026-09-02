/**
 * 四個角落的裝飾 icon。
 * 大部分是假的（純裝飾，點了只會晃一下），
 * 只有 icons.json 裡標記 isReal: true 的那個會真的觸發結局。
 */
export class IconPanel {
  constructor({ container, icons, onTrigger }) {
    this.container = container;
    this.icons = icons;
    this.onTrigger = onTrigger; // (endingType: string) => void
    this.locked = true; // PHOTO 彩蛋要等 START 出現、進入作答階段後才能按
  }

  // 階段一／階段二時要 setLocked(true)，作答階段開始後才 setLocked(false)
  setLocked(locked) {
    this.locked = locked;
  }

  render() {
    this.icons.forEach((icon) => {
      const el = this.container.querySelector(`[data-id="${icon.id}"]`);
      if (!el) return;

      el.textContent = icon.emoji;
      el.onclick = () => {
        if (icon.isReal && !this.locked) {
          this.onTrigger(icon.ending);
        } else {
          // 假icon：只給一點點回饋，讓玩家覺得「好像有反應」但沒有實際效果
          el.classList.add('shake-once');
          setTimeout(() => el.classList.remove('shake-once'), 300);
          this.spawnJokeMarquee();
        }
      };
    });
  }

  // 按到假icon時，寶寶背後飄過一句吐槽用的跑馬燈，純裝飾、不影響任何遊戲狀態
  spawnJokeMarquee() {
    const marquee = document.createElement('div');
    marquee.className = 'icon-joke-marquee';
    marquee.innerHTML = '<span>沒人在乎　　沒人在乎　　沒人在乎</span>';
    this.container.appendChild(marquee);
    setTimeout(() => marquee.remove(), 3000);
  }
}
