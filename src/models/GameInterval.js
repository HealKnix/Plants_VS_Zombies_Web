import { deltaTime } from '/main'

export class GameInterval {
  constructor(option) {
    this.durationTime = 0
    this.option = Object.assign(option, {
      callback: option.callback,
      goalTime: option.goalTime
    })
  }

  clear() {
    this.option = null
  }

  method() {
    if (!this.option) return
    this.durationTime += deltaTime * 1000
    if (this.durationTime >= this.option.goalTime) {
      this.option.callback()
      this.durationTime = 0
    }
  }
}

export const gameIntervalsArray = {
  array: new Array()
}

export function setGameInterval(callback, ms) {
  const newGameInterval = new GameInterval({
    callback: callback,
    goalTime: ms
  })
  gameIntervalsArray.array.push(newGameInterval)
  return newGameInterval
}
