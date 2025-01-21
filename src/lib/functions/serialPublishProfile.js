import { Relay } from "nostr-tools/relay";

async function serialPublishProfile(feed, sk, relayUrls) {
  let profile = createProfile({
    name: `${feed.title}`,
    picture: feed?.["itunes:image"]?.["@_href"],
    lud16: `${feed?.["podcast:guid"]}@thesplitbox.com`,
  });

  console.log(profile);

  let profileEventTemplate = {
    content: profile,
    created_at: Math.floor(Date.now() / 1000),
    kind: 0,
    tags: [],
  };
  await publishEvent(relayUrls, profileEventTemplate, sk);
  return getPublicKey(sk);
}
