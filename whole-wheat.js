import Fiber from "fibers"

const WholeWheat = {

  /**
   * Takes a function that we expect to run in a Fiber and adds the Fiber to
   * it. The method returns a Promise.
   * 
   * @param {Function} originalFn 
   */

  promisify(originalFn) {
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
  },

  /**
   * Takes an async function (i.e. a function that returns a Promise) and makes
   * it run using fibers instead. This function must be called within a
   * `Fiber()` call.
   *
   * @param {Function} fn
   */

  asyncToFiber(asyncFn) {
    return function(...args) {
      const fiber = Fiber.current
      asyncFn(...args)
        .then(result => {
          fiber.run(result)
        })
        .catch(error => {
          throw error
        })
      return Fiber.yield()
    }
  },

  /**
   * Take a Promise and yields until the promise is complete. It returns the
   * value that the Promise returns.
   *
   * @param {Promise} promise
   */

  promiseToFiber(promise) {
    const fiber = Fiber.current
    promise
      .then(result => {
        fiber.run(result)
      })
      .catch(error => {
        throw error
      })
    return Fiber.yield()
  }
}

export default WholeWheat
