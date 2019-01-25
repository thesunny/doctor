import Debug from "debug"
import Fiber from "fibers"
import invariant from "tiny-invariant"
import { remote } from "webdriverio"

import WholeWheat from "./whole-wheat"

const debug = Debug("doctor")
Debug.enable("doctor")

export default class Doctor {
  get browser() {
    if (this.__browser__ == null) {
      this.__browser__ = WholeWheat.promiseToFiber(
        remote({
          logLevel: "error",
          path: "/",
          capabilities: {
            browserName: "chrome"
          }
        })
      )
    }
    return this.__browser__
  }

  sleep(ms) {
    const fiber = Fiber.current
    setTimeout(() => fiber.run(ms), ms)
    return Fiber.yield()
  }

  proxy(method, args) {
    invariant(typeof method === "string")
    invariant(Array.isArray(args))
    return WholeWheat.promiseToFiber(this.browser[method](...args))
  }

}

const methods = {
  url: "url",
  teardown: "deleteSession"
}

Object.entries(methods).forEach(([thisKey, remoteKey]) => {
  Doctor.prototype[thisKey] = function(...args) {
    return this.proxy(remoteKey, args)
  }
})