import invariant from "tiny-invariant"
import Wheaties from "./fibered"

function promisifyFnArgs(fn, index) {
  if (fn.promisifiedFnArgs) return fn
  const nextFn = function(...args) {
    // modify the argument at the given position into a promise
    const arg = args[index]
    invariant(
      typeof arg === "function",
      `Argument at position ${index} must be a function`
    )
    args[index] = Wheaties.promisify(arg)
    fn(...args)
  }
  nextFn.promisifiedFnArgs = true
  return nextFn
}

const original = Object.assign({}, global)

global.it = promisifyFnArgs(original.it, 1)
global.it.only = promisifyFnArgs(original.it.only, 1)
global.it.skip = promisifyFnArgs(original.it.skip, 1)

global.beforeAll = promisifyFnArgs(original.beforeAll, 0)
global.afterAll = promisifyFnArgs(original.afterAll, 0)
global.beforeEach = promisifyFnArgs(original.beforeEach, 0)
global.afterEach = promisifyFnArgs(original.afterEach, 0)
