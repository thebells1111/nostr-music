import { Relay } from "nostr-tools/relay";

const TIMEOUT_MS = 1000; // Adjust timeout duration as needed

async function serialFetchItemsByFeedUrl(feedUrl, relayUrls) {
  for (const url of relayUrls) {
    let relay;
    let events = [];
    try {
      relay = await Relay.connect(url);

      const event = await new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error("Timeout"));
        }, TIMEOUT_MS);

        relay.subscribe(
          [
            {
              kinds: [33333],
              "#f": [feedUrl],
            },
          ],
          {
            onevent(event) {
              clearTimeout(timeout);
              events.push(event);
            },
            oneose() {
              resolve(events);
              if (relay && relay.status === WebSocket.OPEN) {
                relay.close();
              }
            },
          }
        );
      });

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

export default serialFetchItemsByFeedUrl;
