import { rel } from '/src/models/Relation';
import { setGameTimeout } from '/src/models/GameTimeout';

let showCoinbankTimeout = null;

export const userSaveData = [
  {
    userName: 'Guest',
    coinbank: 0,
    currentLevel: {
      place: 1,
      level: 1,
    },
    achievements: [],
  },
  {
    userName: 'Pupster',
    coinbank: 12850,
    currentLevel: {
      place: 1,
      level: 1,
    },
    achievements: [],
  },
  {
    userName: 'AMOGUS',
    coinbank: 9999999,
    currentLevel: {
      place: 1,
      level: 1,
    },
    achievements: [],
  },
];

const currentUser = userSaveData[0];

export const currentSaveData = {
  userName: rel(currentUser.userName, '', (value) => {
    if (!document.querySelector('.selector_screen_woodsign_welcome__user-name')) return;
    document.querySelector('.selector_screen_woodsign_welcome__user-name').innerText = value + '!';
  }),
  coinbank: rel(currentUser.coinbank, '', (value) => {
    clearTimeout(showCoinbankTimeout);
    if (!document.querySelector('.coinbank')) return;
    document.querySelector('.coinbank__value').innerText = '$' + value;
    document.querySelector('.coinbank').style.bottom = '0';
    showCoinbankTimeout = setGameTimeout(() => {
      document.querySelector('.coinbank').style.bottom = '-6vh';
    }, 3500);
  }),
};
