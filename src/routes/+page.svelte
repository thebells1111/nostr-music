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

  onMount(async () => {
    // Check if NIP-07 (window.nostr) is available
    nostrAvailable = !!window.nostr;
    if (!nostrAvailable) {
      error = "Nostr extension (e.g., Alby) not found.";
      window.nostr = WindowNostr;
    } else {
      publicKey = await window.nostr.getPublicKey();
    }

    // ws = websocketClient(relayUrls[0]);
  });

  function connect() {
    window.wnjParams = {
      position: "bottom",
      // The only accepted value is 'bottom', default is top
      accent: "green",
      // Supported values: cyan (default), green, purple, red, orange, neutral, stone
      startHidden: true,
      // If the host page has a button that call `getPublicKey` to start a
      // login procedure, the minimized widget can be hidden until connected
      compactMode: true,
      // Show the minimized widget in a compact form
      disableOverflowFix: true,
      // If the host page on mobile has an horizontal scrolling, the floating
      // element/modal are pushed to the extreme right/bottom and exit the
      // viewport. A style is injected in the html/body elements fix this.
      // This option permit to disable this default behavior
    };
  }
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
