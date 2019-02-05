import "../src/jest-fiber"
import Session from "../src/session"

describe("Start a session", () => {
  it("should get a session", async () => {
    const session = new Session()
    const client = session.client
    await client.url("https://www.google.ca/")
    const url = await client.getUrl()
    expect(url).toMatch(/google/)
  })

  it("should get a second session", async () => {
    const session = new Session()
    const client = session.client
    await client.url("https://news.ycombinator.com/")
    const url = await client.getUrl()
    expect(url).toMatch(/ycombinator/)
  })
})
