import Doctor from '../index'

describe("Should pass tests", () => {
  let doctor

  beforeAll(async () => {
    doctor = new Doctor()

    await doctor.url("https://www.slatejs.org/#/rich-text")

    // const el = await browser.$("[data-slate-editor]")
    // const { elementId } = await browser.$("[data-slate-editor]")
    // console.log({ elementId, el })

    // await browser.elementSendKeys(elementId, ["Hello Great World!"])

    // await browser.deleteSession()
  })

  afterAll(async () => {
    await doctor.teardown()
  })

  it("should pass", () => {
    expect(true).toEqual(true)
  })
})
