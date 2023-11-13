class Relation {
  constructor(objTarget, propName, callback) {
    if (propName === '') {
      return new Proxy(
        {
          value: objTarget
        },
        {
          set(target, prop, value) {
            if (prop) {
              target[prop] = value
              callback()
              return true
            }
          }
        }
      )
    } else {
      return new Proxy(
        {
          object: objTarget,
          value: objTarget[propName]
        },
        {
          set(target, prop, value) {
            if (prop) {
              target[prop] = value
              objTarget[propName] = value
              callback()
              return true
            }
          }
        }
      )
    }
  }
}

export function rel(objTarget, propName, callback) {
  return new Relation(objTarget, propName, callback)
}
