import { readFile } from "fs";
import { getWebsite, putWebsite } from "./database.js";

export function verifyArray(
    arr: Array<any>,
    validationFunction: (item: any) => boolean,
) {
    return !arr.map(validationFunction).includes(false);
}

export function verifyXPathObject(obj: any): obj is XPathQuery {
    const isObject = typeof obj === "object" && obj !== null;
    const hasLabel = typeof obj.label === "string";
    const hasTags =
        (Array.isArray(obj.tags) &&
            verifyArray(obj.tags, (s) => typeof s === "string")) ||
        typeof obj.tags === "undefined";
    const hasContents = typeof obj.contents === "string";
    const isValid = isObject && hasLabel && hasTags && hasContents;
    if (!isValid) {
        console.log("Invalid XPath object detected.");
    }
    return isObject && hasLabel && hasTags && hasContents;
}

export function verifyWebsiteObject(obj: any): obj is Website {
    const isObject = typeof obj === "object" && obj !== null;
    const hasUrl = typeof obj.url === "string";
    const hasQueries =
        Array.isArray(obj.XPathQueries) &&
        verifyArray(obj.XPathQueries, verifyXPathObject);
    const isValid = isObject && hasUrl && hasQueries;
    if (!isValid) {
        console.log("Invalid website object detected.");
    }
    return isObject && hasUrl && hasQueries;
}
export function verifyConfiguration(obj: any): obj is Configuration {
    const isObject = typeof obj === "object" && obj !== null;
    const hasWebsites =
        Array.isArray(obj.websites) &&
        verifyArray(obj.websites, verifyWebsiteObject);
    return isObject && hasWebsites;
}

export async function synchronizeDB(configFilePath: string) {
    readFile(configFilePath, "utf8", async (err, data) => {
        if (err) {
            console.log(
                "Error when attempting to read configuration file: ",
                err,
            );
        } else {
            const configuration: Configuration = JSON.parse(data);
            if (verifyConfiguration(configuration)) {
                for (let website of configuration.websites) {
                    putWebsite(website);
                }
            } else {
                console.log(
                    "Failed to validate configuration file. Check the file's contents and try again",
                );
            }
        }
    });
}
