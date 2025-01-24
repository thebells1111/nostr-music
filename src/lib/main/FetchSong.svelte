<script>
  import serialFetchByEvent from "$lib/functions/serialFetchByEvent";
  export let relayUrls;

  async function fetchSong() {
    let item = await serialFetchByEvent(
      "791be4572667aca8e2279cc2767cad38f01e024925d0e3bfa372257c6a36254b",
      relayUrls
    );

    console.log(item);
  }
</script>

<button on:click={fetchSong}>Fetch Song</button>
