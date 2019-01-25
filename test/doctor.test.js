import Doctor from "../index"
import Fiber from "fibers"
import Debug from "debug"

const debug = Debug("doctor:test")
Debug.enable("doctor:test")

const promisify = function(originalFn) {
  return function(...args) {
    return new Promise(function(resolve, reject) {
      Fiber(function() {
        try {
          const result = originalFn(...args)
          resolve(result)
        } catch (e) {
          reject(e)
        }
      }).run()
    })
  }
}

function promisifyFnArgs(fn, index) {
  if (fn.promisifiedFnArgs) return fn
  const nextFn = function(...args) {
    args[index] = promisify(args[index])
    fn(...args)
  }
  nextFn.promisifiedFnArgs = true
  return nextFn
}

// promisifyFunctions(global, {
//   it: [1],
//   beforeAll: [0],
//   afterAll: [0],
//   beforeEach: [0],
//   afterEach: [0],
// })

global.it = promisifyFnArgs(global.it, 1)
global.beforeAll = promisifyFnArgs(global.beforeAll, 0)
global.afterAll = promisifyFnArgs(global.afterAll, 0)
global.beforeEach = promisifyFnArgs(global.beforeEach, 0)
global.afterEach = promisifyFnArgs(global.afterEach, 0)

describe("Should pass tests", () => {
  let doctor

  beforeAll(() => {
    doctor = new Doctor()
  })

  afterAll(() => {
    doctor.teardown()
  })

  it("should sleep", () => {
    const result1 = doctor.sleep(10)
    expect(result1).toEqual(10)
    const result2 = doctor.sleep(20)
    expect(result2).toEqual(20)
  })

  it("should access the browser property", () => {
    const browser = doctor.browser
    expect(browser.sessionId).toEqual(expect.any(String))
  })

  it("should go to a specific URL", () => {
    doctor.url("https://www.slatejs.org/#/rich-text")
  })
})
