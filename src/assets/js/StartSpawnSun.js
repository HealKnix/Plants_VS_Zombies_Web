import { setGameInterval } from '/src/models/GameInterval'
import { setGameTimeout } from '/src/models/GameTimeout'
import { Sun } from '/src/models/Sun'
import { sunsArray } from '/main'

export default startDelay => {
  setGameTimeout(() => {
    setGameInterval(() => {
      const newElement = document.createElement('div')
      newElement.classList.add('sun_from_level', 'sun')
      const randomX = Math.floor(Math.random() * 97 + 20)
      const newSun = new Sun(newElement, randomX, 18, 25)
      newSun.goalY = Math.floor(Math.random() * 70 + 20)
      newSun.isFall = true
      sunsArray.push(newSun)
    }, 5000)
  }, startDelay + 2000)
}
