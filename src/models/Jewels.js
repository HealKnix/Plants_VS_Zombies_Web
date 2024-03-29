import CoinSilverGif from '/src/images/other/coin_silver.gif';
import CoinGoldGif from '/src/images/other/coin_gold.gif';
import MoneyBagImg from '/src/images/other/moneybag.png';
import DiamondGif from '/src/images/other/diamond.gif';

import { setGameTimeout } from '/src/models/GameTimeout';
import { currentSaveData } from '/src/store/gameStore';
import { soundFX } from '/src/assets/js/Music';

export class Jewel {
  name = '';
  dropSound = soundFX.object.sounds.moneyfalls;
  pickupSound = soundFX.object.sounds.coinSound;
  value = 0;
  htmlElement = null;
  gameTimeout = null;
  browserTimeout = null;

  destroy() {
    if (this.htmlElement) {
      this.htmlElement.parentElement.removeChild(this.htmlElement);
    }
    this.htmlElement = null;
    this.gameTimeout.clear();
    clearTimeout(this.browserTimeout);
  }

  playDropSound() {
    this.dropSound.play();
  }

  constructor(x, y) {
    this.playDropSound();
    this.htmlElement = document.createElement('div');
    this.htmlElement.classList.add('jewel');
    this.htmlElement.addEventListener('click', () => {
      this.pickupSound.play();
      currentSaveData.coinbank.value += 0;

      const goal = document.querySelector('.coinbank');
      this.htmlElement.style.transition = '0.75s ease-in-out';

      this.htmlElement.style.left = `${
        goal.getBoundingClientRect().x +
        goal.getBoundingClientRect().width / 6 -
        document.querySelector('.main__wrapper').getBoundingClientRect().x -
        this.htmlElement.getBoundingClientRect().width / 2
      }px`;
      this.htmlElement.style.top = 'calc(100% - 6vh)';

      this.htmlElement.style.opacity = `0.15`;
      this.htmlElement.style.pointerEvents = 'none';

      this.browserTimeout = setTimeout(() => {
        currentSaveData.coinbank.value += this.value;
        this.destroy();
      }, 750);
    });
    this.htmlElement.style.left = `${x}%`;
    this.htmlElement.style.top = `${y}%`;

    this.gameTimeout = setGameTimeout(
      () => {
        this.destroy();
      },
      8000,
      true,
    );
  }
}

export class CoinSilver extends Jewel {
  constructor(x, y) {
    super(x, y);
    this.htmlElement.classList.add('coin_silver');
    this.name = 'Серебряная монета';
    this.value = 10;
    this.htmlElement.style.backgroundImage = `url(${CoinSilverGif})`;
  }
}

export class CoinGold extends Jewel {
  constructor(x, y) {
    super(x, y);
    this.htmlElement.classList.add('coin_gold');
    this.name = 'Золотая монета';
    this.value = 50;
    this.htmlElement.style.backgroundImage = `url(${CoinGoldGif})`;
  }
}

export class Diamond extends Jewel {
  playDropSound() {
    this.dropSound = soundFX.object.sounds.diamond;
    this.dropSound.play();
  }

  constructor(x, y) {
    super(x, y);
    this.htmlElement.classList.add('diamond');
    this.name = 'Алмаз';
    this.value = 1000;
    this.htmlElement.style.backgroundImage = `url(${DiamondGif})`;
  }
}

export class MoneyBag extends Jewel {
  constructor(x, y) {
    super(x, y);
    this.htmlElement.classList.add('money_bag');
    this.name = 'Мешок монет';
    this.value = 250;
    this.htmlElement.style.backgroundImage = `url(${MoneyBagImg})`;
  }
}

export function dropRandomJewel(x, y) {
  const random = Math.random();
  let jewel = null;

  if (random <= 0.75) {
    jewel = new CoinSilver(x, y);
  } else if (random <= 0.9) {
    jewel = new CoinGold(x, y);
  } else if (random <= 0.975) {
    jewel = new MoneyBag(x, y);
  } else {
    jewel = new Diamond(x, y);
  }

  document.querySelector('.main__wrapper').appendChild(jewel.htmlElement);

  return jewel;
}
