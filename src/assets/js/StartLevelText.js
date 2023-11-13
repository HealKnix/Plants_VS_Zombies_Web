import { setGameTimeout } from '/src/models/GameTimeout'

import ReadySetPlantSound from '/src/music/ready_set_plant.mp3'

export const readySetPlantSound = new Audio(ReadySetPlantSound)
export let isReady = false

export function start(startDelay) {
  startDelay -= 1500
  setGameTimeout(() => {
    isReady = true
    readySetPlantSound.play()
    const startWrapperText = document.querySelector('.ready_set_plant')
    const startText = document.querySelector('.ready_set_plant__text')
    startText.style.animationName = 'scaleStartText1'
    startText.style.opacity = '1'
    setGameTimeout(() => {
      startText.style.animationName = 'scaleStartText2'
      startText.innerText = 'Set...'
      setGameTimeout(() => {
        startText.style.animationName = 'scaleStartText3'
        startText.innerText = 'PLANT!'
        setGameTimeout(() => {
          startText.style.display = 'none'
          startWrapperText.style.display = 'none'
          isReady = false
        }, 650)
      }, 650)
    }, 650)
  }, startDelay)
}
