<script>
  let messages = [];
  let socket;

  function connect() {
    socket = new WebSocket("ws://localhost:4000"); // Adjust URL if needed

    socket.onmessage = (event) => {
      messages = [...messages, event.data];
    };

    socket.onopen = () => {
      console.log("WebSocket connection opened");
      socket.send("Hello, Server!");
    };

    socket.onclose = () => {
      console.log("WebSocket connection closed");
    };
  }
</script>

<button on:click={connect}>Connect</button>

<ul>
  {#each messages as msg}
    <li>{msg}</li>
  {/each}
</ul>
