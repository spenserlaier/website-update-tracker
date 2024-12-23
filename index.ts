import { hash } from "crypto";
import { Browser, chromium, devices, Page } from "playwright";
import { getWebsite, putWebsite, putQuery } from "./database.js";

const SECONDS_PER_MINUTE = 60;
const SECONDS_PER_HOUR = SECONDS_PER_MINUTE * 60;
const SECONDS_PER_DAY = SECONDS_PER_HOUR * 24;
const MILLISECONDS_PER_SECOND = 1000;

class DefaultXPath implements XPathQuery {
    label: string;
    contents: string;
    tags: string[];
    prevHash: string;
    constructor() {
        this.label = "defaultLabel";
        this.contents = "//p";
        this.tags = [];
        this.prevHash = "";
    }
}
class DefaultWebsite implements Website {
    _id: string;
    url: string;
    XPathQueries: XPathQuery[];
    secondsBetweenChecks: number;
    constructor(url: string) {
        this._id = url;
        this.url = url;
        const defaultXPath = new DefaultXPath();
        this.XPathQueries = [defaultXPath];
        //this.secondsBetweenChecks = SECONDS_PER_MINUTE * 3;
        this.secondsBetweenChecks = 15;
    }
}

async function computeHashes(website: Website, page: Page) {
    await page.goto(website.url);
    let hashes: string[] = [];
    for (const query of website.XPathQueries) {
        const textNodes = await page
            .locator(`xpath=${query.contents}`)
            .allInnerTexts();
        for (const node of textNodes) {
            console.log("found text node: ", node);
        }
        const joinedText = textNodes.join();
        const hashedText = hash("sha256", joinedText);
        hashes.push(hashedText);
    }
    return hashes;
}
function compareHashes(
    website: Website,
    oldHashes: string[],
    newHashes: string[],
) {
    const equalityMessages: EqualityMessage[] = oldHashes.map((_, idx) => {
        return {
            website: website,
            xpath: website.XPathQueries[idx],
            oldHash: oldHashes[idx],
            newHash: newHashes[idx],
            isFirstHash: oldHashes[idx] === "",
            areEqual: oldHashes[idx] === newHashes[idx],
        };
    });
    return equalityMessages;
}
function printEqualityMessage(msg: EqualityMessage) {
    if (!msg.isFirstHash) {
        const equalityString = msg.areEqual ? "equal" : "not equal";
        console.log(
            `Comparing hashes for query "${msg.xpath.label} : Hashes are ${equalityString}"`,
        );
    } else {
        console.log(
            "No comparisons made yet. First hashes have not yet been initialized.",
        );
    }
}
export async function trackWebsite(website: Website, browser: Browser) {
    const page = await browser.newPage();
    setInterval(async () => {
        const oldHashes = website.XPathQueries.map((q) => q.prevHash);
        const newHashes = await computeHashes(website, page);
        const equalityMessages = compareHashes(website, oldHashes, newHashes);
        for (const msg of equalityMessages) {
            printEqualityMessage(msg);
        }
        const updatedXPath = website.XPathQueries.map((q, idx) => {
            q.prevHash = newHashes[idx];
            return q;
        });
        website.XPathQueries = updatedXPath;
        await putWebsite(website);
    }, website.secondsBetweenChecks * MILLISECONDS_PER_SECOND);
}
export async function runProgram() {
    console.log("starting program");
    const exampleSite = new DefaultWebsite("https://example.com/");
    await putWebsite(exampleSite);
    const browser = await chromium.launch({ headless: false });
    await trackWebsite(exampleSite, browser);
    console.log("thinking about it");
}

(async () => {
    console.log("starting program");
    const exampleSite = new DefaultWebsite("https://example.com/");
    await putWebsite(exampleSite);
    const browser = await chromium.launch({ headless: false });
    await trackWebsite(exampleSite, browser);
    console.log("thinking about it");
})();
