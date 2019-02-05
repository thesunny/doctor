import Fibered from "./fibered"
import fs from "fs"
import invariant from "tiny-invariant"
import logger from "@wdio/logger"
import nodepath from "path"
import { remote, attach } from "webdriverio"

// Make webdriver less noisy but it still shows the `reconnect` error even
// though we are catching it.
logger.setLevel("webdriver", "silent")

let sessionCount = 0 // We start at 0 so the first sessionId is 1

const SESSION_DIR = nodepath.join(__dirname, "temp")

function createClient() {
  return Fibered.await(
    remote({
      logLevel: "silent",
      hostname: "127.0.0.1",
      path: "/wd/hub",
      capabilities: {
        browserName: "chrome",
      },
    })
  )
}

function getPath(count) {
  return nodepath.join(SESSION_DIR, `session-config-${count}.json`)
}

function getConfig(client) {
  return {
    sessionId: client.sessionId,
    logLevel: "error",
    ...client.options,
  }
}

function writeConfig(client, count) {
  invariant(typeof count === "number")
  const config = getConfig(client)
  const text = JSON.stringify(config, null, 2)
  if (!fs.existsSync(SESSION_DIR)) {
    fs.mkdirSync(SESSION_DIR)
  }
  const path = getPath(sessionCount)
  fs.writeFileSync(path, text)
}

function readConfig(count) {
  const path = getPath(count)
  const text = fs.readFileSync(path)
  return JSON.parse(text)
}

function reconnectClient(count) {
  invariant(typeof count === "number")
  const path = getPath(count)
  if (!fs.existsSync(path)) return null
  const config = readConfig(count)
  let client
  try {
    client = attach(config)
    const handles = Fibered.await(client.getWindowHandles())
    return client
  } catch (error) {
    return null
  }
}

function getClient(count) {
  invariant(typeof count === "number")
  let client = reconnectClient(count)
  if (client == null) {
    client = createClient()
    writeConfig(client, count)
  }
  return client
}

export default class Session {
  constructor() {
    sessionCount++
    this.count = sessionCount
    this.client = getClient(this.count)
  }
}
