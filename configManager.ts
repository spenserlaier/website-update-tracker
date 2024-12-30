//import { promises as fs } from "fs";
import { readFile } from "fs/promises";
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
export async function parseConfig(configFilePath: string) {
    try {
        const data = await readFile(configFilePath, "utf8");
        const json = JSON.parse(data);
        if (verifyConfiguration(json)) {
            return json;
        } else {
            console.log(
                "Failed to validate configuration file. Check the file's contents and try again.",
            );
        }
    } catch {
        // TODO: should this simply throw another error?
        console.log(
            "Failed to read and/or parse json from file. Check that your file is properly formatted and try again.",
        );
    }
}
function XPathAreEqual(xpath1: XPathQuery, xpath2: XPathQuery) {
    const equalContents = xpath1.contents === xpath2.contents;
    const equalLabels = xpath1.label === xpath2.label;
    //don't care about prevHash and tags, which can change
    return equalContents && equalLabels;
}
export async function synchronizeDB(configuration: Configuration) {
    for (let website of configuration.websites) {
        let dbWebsite = await getWebsite(website.url);
        if (dbWebsite) {
            //the config itself doesn't store prevHash values, so we need to look up those values and merge them
            //with the provided website if they do not exist
            for (let dbXPath of dbWebsite.XPathQueries) {
                let correspondingXPathIdx = website.XPathQueries.findIndex(
                    (q) => q.label === dbXPath.label,
                );
                if (
                    correspondingXPathIdx !== -1 &&
                    XPathAreEqual(
                        dbXPath,
                        website.XPathQueries[correspondingXPathIdx],
                    )
                ) {
                    website.XPathQueries[correspondingXPathIdx].prevHash =
                        dbXPath.prevHash;
                }
            }
        }
        const websiteToWrite =
            dbWebsite !== undefined ? { ...dbWebsite, website } : website;
        await putWebsite(websiteToWrite);
        //TODO: figure out how to handle websites that exist in the database but not the configuration file
    }
}
