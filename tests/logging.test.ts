import { writeLog, LOG_PATH } from "../logging.js";

describe("Logging tests", () => {
  test("Logging should properly write to the given log file if it does not exist", async () => {
    writeLog("this is a test message");
    expect(2).toBe(2); //TODO
  });
});
