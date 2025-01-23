<script>
  import { onMount } from "svelte";
  import {
    nip19,
    finalizeEvent,
    generateSecretKey,
    getPublicKey,
  } from "nostr-tools";
  import serialFetchById from "$lib/functions/serialFetchById";
  import GetItems from "$lib/main/GetItems.svelte";
  import PublishSongs from "$lib/main/PublishSongs.svelte";
  import FetchItemsByFeedUrl from "$lib/main/FetchItemsByFeedUrl.svelte";
  import websocketClient from "$lib/functions/websocketClient";

  let showNostrFallback = false;
  let publicKey = "";
  let nsecInput = "";
  let errorMessage = "";
  let ws;

  // Define the relays you want to connect to
  const relayUrls = [
    "ws://localhost:4000",
    // "wss://relay.nostr.band/",
    // "wss://relay.damus.io/",
    // "wss://relay.snort.social/",
    // "wss://relay.fountain.fm",
  ];

  // Custom fallback nostr object
  const nostrFallback = {
    privateKey: null,

    async getPublicKey() {
      if (!this.privateKey) throw new Error("Private key not set.");
      return getPublicKey(this.privateKey);
    },

    async signEvent(event) {
      if (!this.privateKey) throw new Error("Private key not set.");
      return finalizeEvent(event, this.privateKey);
    },

    setPrivateKey(inputKey) {
      try {
        if (inputKey.startsWith("nsec")) {
          // Decode NIP-19 formatted private key
          const decoded = nip19.decode(inputKey);
          this.privateKey = decoded.data;
        } else if (/^[a-fA-F0-9]{64}$/.test(inputKey)) {
          // Validate hex private key
          this.privateKey = inputKey;
        } else {
          throw new Error("Invalid private key format.");
        }
        // Derive and return the public key for verification
        return getPublicKey(this.privateKey);
      } catch (error) {
        throw new Error("Invalid private key.");
      }
    },
  };

  let feedUrl =
    "https://raw.githubusercontent.com/thebells1111/bible-song-band/refs/heads/main/feed.xml";
  let feed = {};
  let episodesTemplate = [];

  onMount(async () => {
    // Check if NIP-07 (window.nostr) is available

    if (!window.nostr) {
      showNostrFallback = true;
    } else {
      publicKey = await window.nostr.getPublicKey();
    }
  });

  // Handle manual fallback setup
  async function initializeNostrFallback() {
    try {
      const derivedPublicKey = nostrFallback.setPrivateKey(nsecInput);
      window.nostr = nostrFallback; // Attach fallback to window.nostr
      publicKey = derivedPublicKey; // Display derived public key
      showNostrFallback = false; // Hide the fallback input
      errorMessage = "";
    } catch (error) {
      errorMessage = error.message;
    }
  }
</script>

<main>
  {#if showNostrFallback}
    <div class="fallback">
      <h2>No Nostr extension detected</h2>
      <p>Enter your private key (nsec or hex) to proceed:</p>
      <input
        type="password"
        bind:value={nsecInput}
        placeholder="Enter your nsec or hex key"
      />
      <button on:click={initializeNostrFallback}>Initialize Nostr</button>
      {#if errorMessage}
        <p class="error">{errorMessage}</p>
      {/if}
    </div>
  {:else}
    <h1>Nostr Event Signer</h1>

    {#if publicKey}
      <p><strong>Public Key:</strong> {publicKey}</p>
    {/if}

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
