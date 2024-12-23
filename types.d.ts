interface XPathQuery {
    label: string;
    contents: string;
    tags: string[];
    prevHash: string;
}
interface Website {
    url: string;
    XPathQueries: XPathQuery[];
    secondsBetweenChecks: number;
}
interface EqualityMessage {
    website: Website;
    xpath: XPathQuery;
    oldHash: string;
    newHash: string;
    isFirstHash: boolean;
    areEqual: boolean;
}
interface Configuration {
    websites: Website[];
}
interface NodeJSError extends Error {
    code?: string; // Error code, e.g., 'ENOENT', 'EACCES'
    errno?: number; // System error number
    path?: string; // File path (if applicable)
    syscall?: string; // System call name, e.g., 'open', 'read'
}
