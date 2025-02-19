import { SimplePool } from "nostr-tools/pool";

const pool = new SimplePool();

const relays = [
  "ws://localhost:4000",
  "wss://relay.nostr.band/",
  "wss://relay.damus.io/",
  "wss://relay.snort.social/",
  "wss://relay.fountain.fm",
];

async function poolFetchById(id) {
  let events = await pool.querySync(relays, {
    authors: [
      "32e1827635450ebb3c5a7d12c1f8e7b2b514439ac10a67eef3d9fd9c5c68e245",
    ],
  });
  console.log(events);
  let event = await pool.get(relays, {
    ids: ["cf9a114f6b286826438a0643a9bc25956ae8d1ff0be0d9fcd3590719403de6d9"],
  });

  console.log(event);
}

export default poolFetchById;
