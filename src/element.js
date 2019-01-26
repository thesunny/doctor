import Wheaties from "./wheaties"

export default class Element {
  constructor(el) {
    this.el = el
  }

  proxy = Wheaties.proxyPromiseToFiber(context => context.el)
}

const methods = {
  click: true,
  getValue: true,
  setValue: true,
}

Object.entries(methods).forEach(([thisKey, remoteKey]) => {
  if (remoteKey === true) remoteKey = thisKey
  Element.prototype[thisKey] = function(...args) {
    return this.proxy(remoteKey, args)
  }
})
