<script>
  import { bech32 } from "https://esm.run/bech32";
  //this takes a feed with an auth tag in it and removes the auth tag,
  //minifies the feed, the gets the sha1 hash of the minified feed.
  //The hash should be the same as in the signed event that's in the feed.
  let feedHash = "";
  let signatureHash = "";
  let verified = "";
  let unapprovedNpub = false;
  let approvedNpubs = [
    "npub1yvgrrzf4dnmu30qfhw95x87ruu0g2kpv3a64h8hpvqsre8qeuspsgd6pv9",
  ];

  // Convert a hex string to a Uint8Array.
  function hexToBytes(hex) {
    if (hex.length % 2) throw new Error("Invalid hex string");
    const bytes = new Uint8Array(hex.length / 2);
    for (let i = 0; i < hex.length; i += 2) {
      bytes[i / 2] = parseInt(hex.slice(i, i + 2), 16);
    }
    return bytes;
  }

  function encodeNpub(publicKeyHex) {
    const publicKeyBytes = hexToBytes(publicKeyHex);
    const words = bech32.toWords(publicKeyBytes);
    return bech32.encode("npub", words);
  }

  function removePodcastAuth(xml) {
    return xml.replace(/<podcast:auth[^>]*>[\s\S]*?<\/podcast:auth>/g, "");
  }

  function minifyXML(xml) {
    return xml.replace(/>\s+</g, "><").trim();
  }

  async function createHash(str) {
    const encoder = new TextEncoder();
    const data = encoder.encode(str);
    const hashBuffer = await crypto.subtle.digest("SHA-1", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  }

  async function getFeedHash(xml) {
    const cleaned = removePodcastAuth(xml);
    const minified = minifyXML(cleaned);
    return await createHash(minified);
  }

  async function verifyFeed(url) {
    const res = await fetch(url);
    const xmlFeed = await res.text();

    const _hash = await getFeedHash(xmlFeed);
    feedHash = _hash;

    const { hash, pubkey } = extractDataFromSignature(xmlFeed);

    signatureHash = hash;
    unapprovedNpub =
      approvedNpubs.findIndex((v) => v === encodeNpub(pubkey)) === -1;
  }

  function extractDataFromSignature(xmlString) {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlString, "text/xml");
    const authElem = xmlDoc.getElementsByTagName("podcast:auth")[0];
    const jsonData = JSON.parse(authElem.textContent);

    const hash = jsonData.tags.find((tag) => tag[0] === "hash")[1];
    const pubkey = jsonData.pubkey;

    return { hash, pubkey };
  }
</script>

{#if feedHash}
  <h3>
    {unapprovedNpub
      ? "Unauthorized npub in feed"
      : feedHash === signatureHash
        ? "Feed Verified"
        : "Unauthorized Feed Change"}
  </h3>
{/if}

<p>Feed Hash: {feedHash}</p>
<p>Signature Hash: {signatureHash}</p>

<div>
  <a
    href="https://raw.githubusercontent.com/thebells1111/bible-song-band/refs/heads/main/good.xml"
    >Good Feed</a
  ><button
    on:click={verifyFeed.bind(
      this,
      "https://raw.githubusercontent.com/thebells1111/bible-song-band/refs/heads/main/good.xml"
    )}>Verify Good Feed</button
  >
</div>

<div>
  <a
    href="https://raw.githubusercontent.com/thebells1111/bible-song-band/refs/heads/main/good.xml"
    >Stolen Feed</a
  ><button
    on:click={verifyFeed.bind(
      this,
      "https://raw.githubusercontent.com/thebells1111/bible-song-band/refs/heads/main/stolen.xml"
    )}>Verify Stolen Feed</button
  >
</div>

<div>
  <a
    href="https://raw.githubusercontent.com/thebells1111/bible-song-band/refs/heads/main/badsign.xml"
    >Unauthorized npub</a
  ><button
    on:click={verifyFeed.bind(
      this,
      "https://raw.githubusercontent.com/thebells1111/bible-song-band/refs/heads/main/badsign.xml"
    )}>Verify Unauthorized npub</button
  >
</div>
