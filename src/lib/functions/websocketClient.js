// websocketClient.js

export default function connectToRelay(relayUrl, message, onMessage) {
  // Create a new WebSocket connection
  const ws = new WebSocket(relayUrl);

  // Event listener for when the connection is established
  ws.addEventListener("open", () => {
    console.log("Connected to the relay.");
  });

  // Event listener for incoming messages from the server
  ws.addEventListener("message", (event) => {
    const serverMessage = JSON.parse(event.data);
    console.log("Message from server:", serverMessage);

    // Call the provided onMessage callback with the server message
    if (onMessage) {
      onMessage(serverMessage, ws);
    }
  });

  // Event listener for when the connection is closed
  ws.addEventListener("close", () => {
    console.log("Disconnected from the relay.");
  });

  // Event listener for errors
  ws.addEventListener("error", (error) => {
    console.error("WebSocket error:", error);
  });

  // Return the WebSocket instance for further use
  return ws;
}
