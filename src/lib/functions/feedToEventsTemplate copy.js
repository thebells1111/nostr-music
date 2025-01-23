import fetchRSSFeed from "./fetchRSSFeed";

async function feedItemsToEventsTemplate(feedUrl) {
  let feed = await fetchRSSFeed(feedUrl);

  let episodesTemplate = feed?.item
    ?.map((item, i) => {
      return {
        feedGuid: feed?.["podcast:guid"],
        feedUrl,
        author: feed?.["itunes:author"],
        itemGuid: item?.guid?.["#text"] || item?.guid,
        feedTitle: feed?.title,
        itemTitle: item?.title,
        track: i + 1,
        imgSrc:
          item?.["itunes:image"]?.["@_href"] ||
          item?.image?.url ||
          feed?.["itunes:image"]?.["@_href"] ||
          feed?.image?.url,
        mediaSrc: item?.enclosure?.["@_url"],
      };
    })
    ?.reverse();

  return { feed, episodesTemplate };
}

export default feedItemsToEventsTemplate;
