class Relation {
  constructor(objTarget, propName, callback) {
    if (propName === '') {
      callback(objTarget);
      return new Proxy(
        {
          value: objTarget,
        },
        {
          set(target, prop, value) {
            if (prop) {
              target[prop] = value;
              callback(value);
              return true;
            }
          },
        },
      );
    } else {
      callback(objTarget[propName]);
      return new Proxy(
        {
          object: objTarget,
          value: objTarget[propName],
        },
        {
          set(target, prop, value) {
            if (prop) {
              target[prop] = value;
              objTarget[propName] = value;
              callback(value);
              return true;
            }
          },
        },
      );
    }
  }
}

export function rel(objTarget, propName, callback) {
  return new Relation(objTarget, propName, callback);
}
