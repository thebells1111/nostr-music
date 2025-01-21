import { Relay } from "nostr-tools/relay";

// Publish a signed event to relays
async function serialPublishEvent(relays, signedEvent) {
  const status = [];
  for (const url of relays) {
    let relay;
    try {
      relay = await Relay.connect(url);
      await relay.publish(signedEvent);
      status.push({ url, status: "published" });
      relay.close();
    } catch (err) {
      console.error("Failed to publish event:", err);
      status.push({ url, status: "failed", error: err.message });
      if (relay) relay.close();
    }
  }
  return status;
}

export default serialPublishEvent;
