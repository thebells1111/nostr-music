<script>
  import { onMount } from "svelte";
  import serialFetchById from "$lib/functions/serialFetchById";
  import GetItems from "$lib/main/GetItems.svelte";
  import PublishSongs from "$lib/main/PublishSongs.svelte";

  let publicKey = "";
  let error = "";
  let nostrAvailable = false;

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
    <button
      on:click={serialFetchById.bind(
        this,
        "bfa24f2bcd37f02d5cfe0aad5b1ed7739be4327444e90a5076320812d1c8dc97",
        "23103189356cf7c8bc09bb8b431fc3e71e85582c8f755b9ee160203c9c19e403",
        relayUrls
      )}>Fetch</button
    >

    <GetItems bind:feed bind:feedUrl bind:episodesTemplate />
    <PublishSongs bind:feed bind:feedUrl bind:episodesTemplate {relayUrls} />
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
