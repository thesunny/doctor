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
   * Takes a function that ends by calling a done(result) style callback and
   * runs it in the current fiber.
   * 
   * @param {Function} fn 
   */

  doneToFiber(fn) {
    const fiber = Fiber.current
    fn(function (result) {
      fiber.run(result)
    })
    return Fiber.yield()
  },

  /**
   * Takes a function that ends by calling a traditional node callback where the
   * first argument is an error and the second is the result and runs it using
   * the current fiber. Returns the value of data.
   *
   * @param {Function} fn 
   */

  errDataToFiber(fn) {
    const fiber = Fiber.current
    fn(function (err, data) {
      if (err) throw err
      fiber.run(data)
    })
    return Fiber.yield()
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
