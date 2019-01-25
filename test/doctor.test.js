import Debug from "debug"
import Fiber from "fibers"
import invariant from 'tiny-invariant'

import Doctor from "../index"
import Wheaties from '../wheaties'

const debug = Debug("doctor:test")
Debug.enable("doctor:test")

function promisifyFnArgs(fn, index) {
  if (fn.promisifiedFnArgs) return fn
  const nextFn = function(...args) {
    // modify the argument at the given position into a promise
    const arg = args[index]
    invariant(typeof arg === 'function', `Argument at position ${index} must be a function`) 
    args[index] = Wheaties.promisify(arg)
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
