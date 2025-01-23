<script>
  import serialPublishEvent from "$lib/functions/serialPublishEvent";

  export let relayUrls = [];

  export let songs = [];
  export let feed = {};

  const signEvent = async () => {
    try {
      for (let event of episodesTemplate) {
        // Request the Nostr extension to sign the event

        const { kind, id, pubkey } = songs;

        const eventTemplate = {
          kind: 33334,
          created_at: Math.floor(Date.now() / 1000),
          tags: [
            ["g", feedGuid],
            ["u", feedUrl],
            ["author", author],
            ["i", itemGuid],
            ["feed_title", feed.title],
            ["item_title", itemTitle],
            ["img_src", imgSrc],
            ["media_src", mediaSrc],
            ["d", btoa(feedUrl + itemGuid)],
          ],
          content: `${itemTitle} by ${author}\n${imgSrc}\n${mediaSrc}`,
        };

        console.log(eventTemplate);
        const signedEvent = await window.nostr.signEvent(eventTemplate);
        events.push(signedEvent);
        await serialPublishEvent(relayUrls, signedEvent);
      }
      console.log(events);
    } catch (err) {
      console.log(err.message);
    }
  };
</script>

<button on:click={signEvent}> Publish Album </button>
