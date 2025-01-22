<script>
  import { onMount } from "svelte";
  import { WindowNostr } from "nostr-tools/nip07";
  import serialFetchById from "$lib/functions/serialFetchById";
  import GetItems from "$lib/main/GetItems.svelte";
  import PublishSongs from "$lib/main/PublishSongs.svelte";
  import FetchItemsByFeedUrl from "$lib/main/FetchItemsByFeedUrl.svelte";
  import websocketClient from "$lib/functions/websocketClient";

  let publicKey = "";
  let error = "";
  let nostrAvailable = false;
  let ws;
  let show;

  // Define the relays you want to connect to
  const relayUrls = [
    "ws://localhost:4000",
    // "wss://relay.nostr.band/",
    // "wss://relay.damus.io/",
    // "wss://relay.snort.social/",
    // "wss://relay.fountain.fm",
  ];

  let feedUrl = "https://ableandthewolf.com/static/media/feed.xml";
  let feed = {};
  let episodesTemplate = [];

  let showNostrFallback = false;
  onMount(async () => {
    // Check if NIP-07 (window.nostr) is available
    nostrAvailable = !!window.nostr;
    if (!nostrAvailable) {
      showNostrFallback = true;
    } else {
      publicKey = await window.nostr.getPublicKey();
    }
  });
</script>

<main>
  <h1>Nostr Event Signer</h1>

  {#if error}
    <p style="color: red;">Error: {error}</p>
  {/if}

  {#if publicKey}
    <p><strong>Public Key:</strong> {publicKey}</p>
  {/if}

  {#if nostrAvailable}
    <!-- <button
      on:click={() => {
        ws.send(
          JSON.stringify(["REQ", "sub:1", { kinds: [33333], "#f": ["abcd"] }])
        );
      }}>Fetch</button
    > -->
    <FetchItemsByFeedUrl {relayUrls} />
    <GetItems bind:feed bind:feedUrl bind:episodesTemplate />
    <PublishSongs bind:feed bind:feedUrl bind:episodesTemplate {relayUrls} />
  {:else}
    <button on:click={connect}>Connect</button>
  {/if}
</main>

<style>
  main {
    font-family: Arial, sans-serif;
    max-width: 600px;
    margin: 20px auto;
    text-align: center;
  }
  button {
    padding: 10px 20px;
    font-size: 16px;
    cursor: pointer;
  }
  pre {
    background: #f4f4f4;
    padding: 10px;
    border-radius: 5px;
    text-align: left;
    max-height: 300px;
    overflow-y: auto;
  }
</style>
