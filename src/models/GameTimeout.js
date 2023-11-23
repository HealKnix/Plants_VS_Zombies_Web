import { deltaTime } from '/main'

export class GameTimeout {
  constructor(option) {
    this.durationTime = 0
    this.clearAfterEnd = false
    this.isComplete = false
    this.option = Object.assign(option, {
      callback: option.callback,
      goalTime: option.goalTime
    })
  }

  clear() {
    this.option = null
    this.isComplete = true
  }

  method() {
    if (this.isComplete || !this.option) return
    this.durationTime += deltaTime * 1000
    if (this.durationTime <= this.option.goalTime) return
    this.option.callback()
    this.isComplete = true
    if (this.clearAfterEnd) {
      this.clear()
    }
  }
}

export const gameTimeoutsArray = {
  array: new Array()
}

export function setGameTimeout(callback, ms, clearAfterEnd = false) {
  const newGameTimeout = new GameTimeout({
    callback: callback,
    goalTime: ms
  })
  newGameTimeout.clearAfterEnd = clearAfterEnd
  gameTimeoutsArray.array.push(newGameTimeout)
  return newGameTimeout
}

export function clearAllGameTimeouts() {
  gameTimeoutsArray.array = new Array()
}
