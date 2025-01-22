<script>
  import serialFetchItemsByFeedUrl from "$lib/functions/serialFetchItemsByFeedUrl";
  export let relayUrls;

  async function fetchItems() {
    let items = await serialFetchItemsByFeedUrl(
      "https://ableandthewolf.com/static/media/feed.xml",
      relayUrls
    );

    console.log(items);
  }
</script>

<button on:click={fetchItems}>Fetch Items</button>
