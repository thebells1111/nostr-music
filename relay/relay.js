import { NostrRelay, createOutgoingNoticeMessage } from "@nostr-relay/core";
import { EventRepositorySqlite } from "@nostr-relay/event-repository-sqlite";
import { Validator } from "@nostr-relay/validator";
import path from "path";
import { fileURLToPath } from "url";
import { program } from "commander";
import { WebSocketServer } from "ws";
import { RequestLogger } from "./request-logger.js";
import { checkDatabaseRoute } from "./utils/index.js";

// Convert import.meta.url to __dirname
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Define platform-independent paths
const DEFAULT_DB_FILE = path.resolve(__dirname, "db", "db");
const DEFAULT_LOGS_DIRECTORY = path.resolve(__dirname, "logs");

checkDatabaseRoute(DEFAULT_DB_FILE);

async function bootstrap(options = {}) {
  const { port = 4000, file = DEFAULT_DB_FILE } = options;

  if (file === DEFAULT_DB_FILE) {
    checkDatabaseRoute(DEFAULT_DB_FILE);
  }

  const wss = new WebSocketServer({ port });

  const eventRepository = new EventRepositorySqlite(file);
  const relay = new NostrRelay(eventRepository);
  const validator = new Validator();

  relay.register(new RequestLogger(DEFAULT_LOGS_DIRECTORY));

  wss.on("connection", (ws) => {
    relay.handleConnection(ws);

    ws.on("message", async (data) => {
      try {
        console.log(data);
        const message = await validator.validateIncomingMessage(data);
        console.log(message);
        await relay.handleMessage(ws, message);
      } catch (error) {
        if (error instanceof Error) {
          ws.send(JSON.stringify(createOutgoingNoticeMessage(error.message)));
        }
      }
    });

    ws.on("close", () => relay.handleDisconnect(ws));

    ws.on("error", (error) => {
      ws.send(JSON.stringify(createOutgoingNoticeMessage(error.message)));
    });
  });

  console.log(`
db file:  ${file}
logs dir: ${DEFAULT_LOGS_DIRECTORY}

Now you can use your "Nostr App" to connect to this relay.

ws://localhost:${port}
`);
}

program
  .name("nostr-relay-sqlite")
  .description("A Nostr relay server using SQLite as a database");

program
  .option("-p, --port <port>", "Port to listen on")
  .option("-f, --file <file>", "Database file to use");

program.parse();

const options = program.opts();

bootstrap(options);
