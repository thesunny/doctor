import Debug from "debug"
import logger from "@wdio/logger"
import { remote } from "webdriverio"

import Element from "./element"
import Wheaties from "./wheaties"

const debug = Debug("doctor")
Debug.enable("doctor")

export default class Doctor {
  get browser() {
    logger.setLevel("webdriver", "silent")
    if (this.__browser__ == null) {
      this.__browser__ = Wheaties.promiseToFiber(
        remote({
          logLevel: "error",
          path: "/",
          capabilities: {
            browserName: "chrome",
          },
        })
      )
    }
    return this.__browser__
  }

  sleep(ms) {
    return Wheaties.doneToFiber(done => {
      setTimeout(() => {
        done(ms)
      }, ms)
    })
  }

  proxy = Wheaties.proxyPromiseToFiber(context => context.browser)

  sendKeys(elementId, values) {
    if (!Array.isArray(values)) values = [values]
    this.proxy("elementSendKeys", [elementId, values])
  }

  $(selector) {
    // return new Element(Wheaties.promiseToFiber(this.browser.$(selector)))
    return new Element(this, this.proxy("$", [selector]))
  }

  $$(selector) {
    const elements = Wheaties.promiseToFiber(this.browser.$$(selector))
    return elements.map(element => new Element(this, element))
  }
}

const methods = {
  back: true, // navigate back
  click: "elementClick", // click element
  deleteCookie: true, // delete cookie with given name
  deleteAllCookies: "deleteAllCookies",
  forward: true, // navigate forward
  getCokkie: true, // get cookie by name
  getCookies: "getAllCookies", // return an object containing all cookies
  getTitle: true, // return title of browser
  getUrl: true, // returns current url
  navigateTo: true, // navigate to URL
  refresh: true, // refresh browser
  screenshot: "takeScreenshot", // base-64 encoded PNG image
  elementScreenshot: "takeElementScreenshot",
  script: "executeScript", // execute script in browser (function, args)
  setCookie: "addCookie",
  teardown: "deleteSession", // close browser session
  url: true, // navigate to URL
}

Object.entries(methods).forEach(([thisKey, remoteKey]) => {
  if (remoteKey === true) remoteKey = thisKey
  Doctor.prototype[thisKey] = function(...args) {
    return this.proxy(remoteKey, args)
  }
})
