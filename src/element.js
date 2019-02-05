import invariant from "tiny-invariant"
import Wheaties from "./wheaties"
import Doctof from "./doctor"
import Doctor from "./doctor"

export default class Element {
  constructor(doctor, el) {
    invariant(doctor instanceof Doctor)
    this.doctor = doctor
    this.el = el
  }

  proxy = Wheaties.proxyPromiseToFiber(context => context.el)

  get elementId() {
    return this.el.elementId
  }

  get html() {
    return this.proxy("getHTML")
  }

  sendKeys(text) {
    invariant(typeof text === "string")
    this.doctor.sendKeys(this.elementId, text)
  }
}

const methods = {
  click: true,
  getHTML: true,
  getValue: true,
  setValue: true,
  waitForExist: true,
}

Object.entries(methods).forEach(([thisKey, remoteKey]) => {
  if (remoteKey === true) remoteKey = thisKey
  Element.prototype[thisKey] = function(...args) {
    return this.proxy(remoteKey, args)
  }
})
