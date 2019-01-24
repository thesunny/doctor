import Doctor from '../index'

describe("Should pass tests", () => {
  let doctor

  beforeAll(async () => {
    doctor = new Doctor()
  })

  afterAll(async () => {
    await doctor.teardown()
  })

  it("should pass", async () => {
    await doctor.url("https://www.slatejs.org/#/rich-text")
  })
})
