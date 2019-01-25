import Debug from "debug"
import Fiber from "fibers"
import invariant from "tiny-invariant"
import { remote } from "webdriverio"

const debug = Debug("doctor")
Debug.enable("doctor")

export default class Doctor {
  async browser() {
    if (this.__browser__ == null) {
      this.__browser__ = remote({
        logLevel: "error",
        path: "/",
        capabilities: {
          browserName: "chrome"
        }
      })
    }
    return this.__browser__
  }

  async proxy(method, ...args) {
    debug("proxy", { method, args })
    invariant(typeof method === "string")
    const browser = await this.browser()
    return await browser[method](...args)
  }

  sleep(ms) {
    const fiber = Fiber.current
    setTimeout(function() {
      fiber.run()
    }, ms)
    Fiber.yield()
  }

}

const methods = {
  url: "url",
  teardown: "deleteSession"
}

Object.entries(methods).forEach(([thisKey, remoteKey]) => {
  Doctor.prototype[thisKey] = async function(...args) {
    return this.proxy(remoteKey, ...args)
  }
})
