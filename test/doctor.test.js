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

const it = function(text, fn) {
  global.it(text, promisify(fn))
}

const beforeAll = function(fn) {
  global.beforeAll(promisify(fn))
}

const afterAll = function(fn) {
  global.afterAll(promisify(fn))
}

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
