import { XMLBuilder, XMLParser } from "fast-xml-parser";
const parserOptions = {
  attributeNamePrefix: "@_",
  ignoreAttributes: false,
  ignoreNameSpace: false,
};

export default async function fetchRSSFeed(feedUrl) {
  let res = await fetch(feedUrl);
  let data = await res.text();

  const parser = new XMLParser(parserOptions);
  let xml2Json = parser.parse(data);
  let feed = xml2Json.rss.channel;

  return feed;
}
