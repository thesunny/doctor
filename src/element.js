import invariant from "tiny-invariant"
import Wheaties from "./fibered"
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

  sendKeys(text) {
    invariant(typeof text === "string")
    this.doctor.sendKeys(this.elementId, text)
  }
}

const methods = {
  click: "click",
  getHTML: "getHTML",
  getValue: "getValue",
  setValue: "setValue",
  waitForExist: "waitForExist",
}

Object.entries(methods).forEach(([thisKey, remoteKey]) => {
  Element.prototype[thisKey] = function(...args) {
    return this.proxy(remoteKey, args)
  }
})
