import PouchDB from "pouchdb";

const db = new PouchDB("Websites");

export async function getWebsite(url: string) {
    try {
        const doc: Website & PouchDB.Core.IdMeta & PouchDB.Core.GetMeta =
            await db.get(url);
        return doc;
    } catch (error: any) {
        console.log(
            `ERROR: DB Retrieval Failed for URL : ${url}\nError Contents: ${error}`,
        );
        return undefined;
    }
}
export async function putWebsite(newWebsite: Website) {
    let oldWebsite = await getWebsite(newWebsite.url);
    if (oldWebsite !== undefined) {
        oldWebsite = { ...oldWebsite, ...newWebsite };
        //console.log("updated the old website object with properties: ");
        //Object.keys(oldWebsite).forEach((key) =>
        //    console.log(key, oldWebsite![key as keyof typeof oldWebsite]),
        //);
    }
    const websiteToWrite =
        oldWebsite !== undefined
            ? oldWebsite
            : { ...newWebsite, _id: newWebsite.url };
    console.log("website to write: ", websiteToWrite);
    try {
        const response = await db.put(websiteToWrite);
        if (!response.ok) {
            console.log(
                `ERROR: DB Put Failed for website object (response not OK): ${websiteToWrite}\n`,
            );
        } else {
            console.log(`DB: Updated website document`);
        }
    } catch (error: any) {
        console.log(
            `ERROR: DB Put Failed for website object: ${websiteToWrite}\nError Contents: ${error} `,
        );
    }
}
export async function putQuery(url: string, query: XPathQuery) {
    // append a query to a website if a query does not exist with the given label,
    // otherwise modify the given query
    let website = await getWebsite(url);
    if (website) {
        const idx = website.XPathQueries.findIndex(
            (q) => q.label === query.label,
        );
        if (idx != -1) {
            website.XPathQueries[idx] = query;
        } else {
            website.XPathQueries = [...website.XPathQueries, query];
        }
        await putWebsite(website);
    }
}
