import { AsStringPipe } from "./as-string.pipe";

describe("AsStringPipe", () => {
  it("create an instance", () => {
    const pipe = new AsStringPipe();
    expect(pipe).toBeTruthy();
  });
});
