<script>
  import poolFetchById from "$lib/functions/poolFetchById";
  let album = {
    author: "",
    title: "",
    img_src: "",
    description: "",
    tracks: [{ title: "", img_src: "", media_src: "", description: "" }],
  };

  function addTrack() {
    album.tracks = [{ title: "", img_src: "", media_src: "" }].concat(
      album.tracks
    );
  }

  async function fetchStorage() {
    // Prompt user to sign a kind 22242 auth event
    // requesting to buy 1 GB month of storage
    console.log(window.nostr);
    console.log(await window.nostr.getPublicKey());
    const requestCredit = await window.nostr.signEvent({
      kind: 22242,
      created_at: Math.ceil(Date.now() / 1000),
      tags: [["gb_months", "1"]],
      content: "Request Storage",
    });

    console.log(requestCredit);
    // Send a GET request to the API with the signed event
    // as the uri encoded auth param. The API responds with
    // a json object which includes an offer to purchase the
    // requested storage and expected terms of payment.
    const serviceRes = await fetch(
      `https://api.satellite.earth/v1/media/account/credit?auth=${encodeURIComponent(JSON.stringify(requestCredit))}`
    );
    const service = await serviceRes.json();
    console.log(service);
    // Prompt user to sign the returned payment event
    const payment = await window.nostr.signEvent(service.payment);

    // Use another GET request to send the signed payment event
    // to the returned callback url to obtain a lightning invoice
    const invoiceRes = await fetch(
      service.callback +
        `?amount=${service.amount}&nostr=${encodeURIComponent(JSON.stringify(payment))}`
    );
    const invoice = await invoiceRes.json();
    console.log(invoice);
  }

  async function createSignature() {
    let sig = await window.nostr.signEvent({
      created_at: Math.ceil(Date.now() / 1000),
      content: "",
      kind: 33333,
      tags: [["hash", "998b5afa31e53f240f769330f14e461e88954c50"]],
    });

    console.log(sig);
  }

  async function verifyCredits() {
    // Prompt user to sign auth event requesting account info
    const requestAccount = await window.nostr.signEvent({
      created_at: Math.ceil(Date.now() / 1000),
      content: "Authenticate User",
      kind: 22242,
      tags: [],
    });

    // Fetch user's account info
    const accountRes = await fetch(
      `https://api.satellite.earth/v1/media/account?auth=${encodeURIComponent(JSON.stringify(requestAccount))}`
    );

    const account = await accountRes.json();

    // Check if storage was allocated
    if (account.creditTotal > 0) {
      alert("payment succeeded");
    }
  }
</script>

<button on:click={createSignature}>Sign</button>
<button on:click={fetchStorage}>Get Storage</button>
<div>
  <input placeholder="Band Name" bind:value={album.author} />
  <input placeholder="Album Name" bind:value={album.title} />
  <input placeholder="Album Art" bind:value={album.img_src} />
  <textarea placheholder="Album Description" bind:value={album.description} />
</div>
<h2>Tracks</h2>
<button on:click={addTrack}>Add New Track</button>

{#each album.tracks as track, i}
  <div>
    <h3>{track.title || `Track ${i + 1}`}</h3>
    <input placeholder="Track Name" bind:value={track.title} />
    <input placeholder="Track Art" bind:value={track.img_src} />
    <input placeholder="Track Audio" bind:value={track.img_src} />
    <textarea placheholder="Track Description" bind:value={track.description} />
  </div>
{/each}

<button on:click={poolFetchById}>Fetch</button>
