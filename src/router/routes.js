import * as SelectorScreen from '/src/views/SelectorScreen';
import * as Game from '/src/views/Game';
import * as AwardScreen from '/src/views/AwardScreen';

export let currentRoute = {
  value: '',
};

export default {
  toSelectorScreen: () => {
    SelectorScreen.render();
  },
  toAdventure: () => {
    Game.render();
  },
  toAwardScreen: (award) => {
    AwardScreen.render(award);
  },
  toMiniGame: false,
  toPuzzle: false,
  toSurvival: false,
  toAlmanac: false,
  toGarden: false,
  toShop: false,
};
