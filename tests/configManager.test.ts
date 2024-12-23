import {
  verifyArray,
  verifyXPathObject,
  verifyWebsiteObject,
  verifyConfiguration,
} from "../configManager.js";

describe("verifyArray tests", () => {
  test("verifyArray should properly verify an array of numbers", () => {
    const numbersArray = [1, 2, 3, 4, 5];
    expect(verifyArray(numbersArray, (num) => typeof num === "number")).toBe(
      true,
    );
  });
  test("verifyArray should return false with a non-uniform array", () => {
    const numbersArray = [1, 2, "notANumber", 4, 5];
    expect(verifyArray(numbersArray, (num) => typeof num === "number")).toBe(
      false,
    );
  });
});
describe("verifyXPathObject tests", () => {
  test("verifyXPathObject should properly validate an XPathQuery object", () => {
    const xPathObject: XPathQuery = {
      label: "testQuery",
      contents: "//div",
      tags: ["tag"],
      prevHash: "prevHash",
    };
    expect(verifyXPathObject(xPathObject)).toBe(true);
  });
  test("verifyXPathObject should return false with invalid xpath objects", () => {
    const xPathObject: Object = {
      label: null,
      contents: "//div",
      tags: ["tag"],
      prevHash: "prevHash",
    };
    expect(verifyXPathObject(xPathObject)).toBe(true);
  });
});
describe("verifyWebsiteObject tests", () => {
  test("verifyWebsiteObject should properly validate an XPathQuery object", () => {
    const xPathObject: XPathQuery = {
      label: "testQuery",
      contents: "//div",
      tags: ["tag"],
      prevHash: "prevHash",
    };
    const website: Website = {
      url: "testurl.com",
      //TODO: figure out whether secondsbetweenchecks should be optional or not
      secondsBetweenChecks: 30,
      XPathQueries: [xPathObject],
    };
    expect(verifyWebsiteObject(website)).toBe(true);
  });
  test("verifyWebsiteObject should return false with invalid website objects", () => {
    const xPathObject: XPathQuery = {
      label: "testQuery",
      contents: "//div",
      tags: ["tag"],
      prevHash: "prevHash",
    };
    const website: Object = {
      url: null,
      //TODO: figure out whether secondsbetweenchecks should be optional or not
      secondsBetweenChecks: 30,
      XPathQueries: [xPathObject],
    };
    expect(verifyWebsiteObject(website)).toBe(true);
  });
});
describe("verifyConfiguration tests", () => {
  test("verifyConfiguration should properly recognize a valid configuration file", () => {
    const xPathObject: XPathQuery = {
      label: "testQuery",
      contents: "//div",
      tags: ["tag"],
      prevHash: "prevHash",
    };
    const website: Website = {
      url: "testurl.com",
      //TODO: figure out whether secondsbetweenchecks should be optional or not
      secondsBetweenChecks: 30,
      XPathQueries: [xPathObject],
    };
    const configuration: Configuration = {
      websites: [website],
    };
    expect(verifyConfiguration(configuration)).toBe(true);
  });
  test("verifyConfiguration should return false with invalid configuration object", () => {
    const xPathObject: XPathQuery = {
      label: "testQuery",
      contents: "//div",
      tags: ["tag"],
      prevHash: "prevHash",
    };
    const website: Website = {
      url: "testurl.com",
      //TODO: figure out whether secondsbetweenchecks should be optional or not
      secondsBetweenChecks: 30,
      XPathQueries: [xPathObject],
    };
    const configuration: Object = {
      websites: "notAListOfWebsites",
    };
    expect(verifyConfiguration(configuration)).toBe(true);
  });
});
