import Debug from "debug"
import Fiber from "fibers"
import invariant from "tiny-invariant"

import "../src/jest-fiber"
import Doctor from "../index"
import Wheaties from "../src/wheaties"

const debug = Debug("doctor:test")
Debug.enable("doctor:test")

describe("Should pass tests", () => {
  let doctor

  beforeAll(() => {
    doctor = new Doctor()
  })

  afterAll(() => {
    // doctor.teardown()
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
    const editorDiv = doctor.$("[data-slate-editor]")
    const html = Wheaties.promiseToFiber(editorDiv.getHTML())
    console.log({ html })
    doctor.sendKeys(editorDiv.elementId, "Hello World!")
  })

  it.only("should get an Element using a selector", () => {
    doctor.url("https://www.google.ca/")
    const q = doctor.$("[name=q]")
    q.setValue("hello world")
    const value = q.getValue()
    console.log({ value })
    const button = doctor.$("[aria-label='Google Search']")
    button.click()
  })
})
