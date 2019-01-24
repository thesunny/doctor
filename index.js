import { remote } from "webdriverio"

export default class Doctor {
  constructor() {}

  async browser() {
    if (this.__browser__ == null) {
      this.__browser__ = remote({
        logLevel: "error",
        path: "/",
        capabilities: {
          browserName: "chrome"
        }
      })
    }
    return this.__browser__
  }

  async url(url) {
    const browser = await this.browser()
    return await browser.url(url)
  }

  async teardown() {
    await this.browser().deleteSession()
  }
}
