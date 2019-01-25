import Doctor from "../index"
import Fiber from "fibers"

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

describe("Should pass tests", () => {
  let doctor

  beforeAll(async () => {
    doctor = new Doctor()
  })

  afterAll(async () => {
    // await doctor.teardown()
  })

  // it("should pass", async () => {
  //   // await doctor.url("https://www.slatejs.org/#/rich-text")
  // })

  it("should sleep", () => {
    doctor.sleep(1000)
  })
})
