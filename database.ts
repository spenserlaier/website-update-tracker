import PouchDB from "pouchdb";

const db = new PouchDB("Websites");

export async function getWebsite(url: string) {
    try {
        const doc: Website = await db.get(url);
        return doc;
    } catch (error: any) {
        console.log(
            `ERROR: DB Retrieval Failed for URL : ${url}\nError Contents: ${error}`,
        );
    }
}
export async function putWebsite(website: Website) {
    try {
        const response = await db.put(website);
        if (!response.ok) {
            console.log(
                `ERROR: DB Put Failed for website object: ${website}\n`,
            );
        }
    } catch (error: any) {
        console.log(
            `ERROR: DB Put Failed for website object: ${website}\nError Contents: ${error} `,
        );
    }
}
//TODO: need _rev field to be set when updating a document--revisions not automatic,
//need to be explicit
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
