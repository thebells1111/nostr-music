<script>
  import serialPublishEvent from "$lib/functions/serialPublishEvent";

  export let relayUrls = [];
  export let episodesTemplate = [];

  let events = [];

  const signEvent = async () => {
    try {
      for (let event of episodesTemplate) {
        // Request the Nostr extension to sign the event

        const {
          feedGuid,
          feedUrl,
          author,
          itemGuid,
          feedTitle,
          itemTitle,
          imgSrc,
          mediaSrc,
        } = event;

        const eventTemplate = {
          kind: 33333,
          created_at: Math.floor(Date.now() / 1000),
          tags: [
            ["fg", feedGuid],
            ["f", feedUrl],
            ["author", author],
            ["i", itemGuid],
            ["feed_title", feedTitle],
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

<button on:click={signEvent}> Publish Songs </button>
