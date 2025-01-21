import { Relay } from "nostr-tools/relay";

const TIMEOUT_MS = 1000; // Adjust timeout duration as needed

async function serialFetchById(eventId, publicKey, relayUrls) {
  for (const url of relayUrls) {
    let relay;
    try {
      relay = await Relay.connect(url);

      console.log(eventId);
      const event = await new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error("Timeout"));
        }, TIMEOUT_MS);

        relay.subscribe(
          [
            {
              ids: [eventId], // Filter by event ID
              authors: [publicKey], // Filter by public key
            },
          ],
          {
            onevent(event) {
              clearTimeout(timeout);
              resolve(event); // Resolve with the event
            },
          }
        );
      });

      console.log(`Event found on relay ${url}:`, event);
      return event; // Return the event immediately if found
    } catch (error) {
      console.log(`Relay ${url} failed: ${error.message}`);
      // Continue to the next relay
    } finally {
      if (relay && relay.status === WebSocket.OPEN) {
        relay.close();
      }
    }
  }

  throw new Error("No event found on any relay.");
}

export default serialFetchById;
