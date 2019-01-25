import Fiber from "fibers"

const WholeWheat = {
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
