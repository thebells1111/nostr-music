<script>
  import feedItemsToEventsTemplate from "$lib/functions/feedItemsToEventsTemplate";
  export let feedUrl = "";
  export let feed = {};
  export let episodesTemplate = [];

  async function getItems(url) {
    if (feedUrl) {
      let data = await feedItemsToEventsTemplate(feedUrl);
      feed = data.feed;
      episodesTemplate = data.episodesTemplate;
      console.log(episodesTemplate);
      console.log(feed);
    }
  }
</script>

<button on:click={getItems}>Get Songs</button>
<input placeholder="link to feed" type="url" bind:value={feedUrl} />
