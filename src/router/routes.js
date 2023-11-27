import * as SelectorScreen from '/src/views/SelectorScreen'
import * as Game from '/src/views/Game'

export let currentRoute = {
  value: ''
}

export default {
  toSelectorScreen: () => {
    SelectorScreen.render()
  },
  toAdventure: () => {
    Game.render()
  },
  toMiniGame: false,
  toPuzzle: false,
  toSurvival: false,
  toAlmanac: false,
  toGarden: false,
  toShop: false
}
