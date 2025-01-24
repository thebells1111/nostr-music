<script>
  import serialPublishEvent from "$lib/functions/serialPublishEvent";
  import feedToEventsTemplate from "$lib/functions/feedToEventsTemplate";

  export let relayUrls = [];

  export let songs = [];
  export let feed = {};
  export let feedUrl = "";

  const signEvent = async () => {
    try {
      console.log(feed);
      const x = await feedToEventsTemplate(feed, songs);
      console.log(x);

      const { feedGuid, author, feedTitle, imgSrc, items } = x;

      const eventTemplate = {
        kind: 33334,
        created_at: Math.floor(Date.now() / 1000),
        tags: [
          ["g", feedGuid],
          ["u", feedUrl],
          ["author", author],
          ["feed_title", feed.title],
          ["img_src", imgSrc],
          ["d", btoa(feedUrl)],
          ...items,
        ],
        content: `${feedTitle} by ${author}\n${imgSrc}`,
      };

      console.log(eventTemplate);
      const signedEvent = await window.nostr.signEvent(eventTemplate);
      console.log(signedEvent);

      await serialPublishEvent(relayUrls, signedEvent);
    } catch (err) {
      console.log(err.message);
    }
  };
</script>

<button on:click={signEvent}> Publish Album </button>
