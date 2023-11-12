import { deltaTime } from '/main'

export class GameTimeout {
  constructor(option) {
    this.durationTime = 0
    this.isComplete = false
    this.option = Object.assign(option, {
      callback: option.callback,
      goalTime: option.goalTime
    })
  }

  clear() {
    this.option = null
  }

  method() {
    if (this.isComplete) return
    this.durationTime += deltaTime * 1000
    if (this.durationTime <= this.option.goalTime) return
    this.option.callback()
    this.isComplete = true
    this.clear()
  }
}

export const gameTimeoutsArray = {
  array: new Array()
}

export function setGameTimeout(callback, ms) {
  const newGameTimeout = new GameTimeout({
    callback: callback,
    goalTime: ms
  })
  gameTimeoutsArray.array.push(newGameTimeout)
  return newGameTimeout
}
