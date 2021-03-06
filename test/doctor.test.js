import "../src/jest-fiber"
import Doctor from "../index"

describe("Should pass tests", () => {
  let doctor

  beforeAll(() => {
    doctor = new Doctor()
  })

  it("should sleep", () => {
    const result1 = doctor.sleep(10)
    expect(result1).toEqual(10)
    const result2 = doctor.sleep(20)
    expect(result2).toEqual(20)
  })

  it("should access the browser property", () => {
    const client = doctor.client
    expect(client.sessionId).toEqual(expect.any(String))
  })

  it("should go to a specific URL", () => {
    doctor.url("https://www.slatejs.org/#/rich-text")
    const editorDiv = doctor.$("[data-slate-editor]")
    const html = editorDiv.html
    doctor.sendKeys(editorDiv.elementId, "Hello World!")
  })

  it("should get an Element using a selector", () => {
    doctor.url("https://www.google.ca/")
    const q = doctor.$("[name=q]")
    q.sendKeys("hello world\uE007")
  })
})
