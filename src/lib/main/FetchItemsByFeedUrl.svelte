<script>
  import serialFetchItemsByFeedUrl from "$lib/functions/serialFetchItemsByFeedUrl";
  export let relayUrls;

  async function fetchItems() {
    let items = await serialFetchItemsByFeedUrl(
      "https://raw.githubusercontent.com/thebells1111/bible-song-band/refs/heads/main/feed.xml",
      relayUrls
    );

    console.log(items);
  }
</script>

<button on:click={fetchItems}>Fetch Items</button>
