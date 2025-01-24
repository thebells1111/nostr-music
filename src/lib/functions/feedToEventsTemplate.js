async function feedToEventsTemplate(feed, songs) {
  let feedTemplate = {
    feedGuid: feed?.["podcast:guid"],
    author: feed?.["itunes:author"],
    feedTitle: feed?.title,
    imgSrc: feed?.["itunes:image"]?.["@_href"] || feed?.image?.url,
    items:
      songs?.map((v) => {
        return ["e", v.id];
      }) || [],
  };

  return feedTemplate;
}

export default feedToEventsTemplate;
