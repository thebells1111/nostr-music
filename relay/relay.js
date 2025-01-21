import { NostrRelay, createOutgoingNoticeMessage } from "@nostr-relay/core";
import { EventRepositorySqlite } from "@nostr-relay/event-repository-sqlite";
import { Validator } from "@nostr-relay/validator";
import path from "path";
import { program } from "commander";
import { WebSocketServer } from "ws";
import { RequestLogger } from "./request-logger.js";
import { checkDatabaseRoute } from "./utils/index.js";

// Get the current directory using import.meta.url and normalize the path
const __dirname = path.dirname(new URL(import.meta.url).pathname);

// Convert to a valid Windows path, remove any leading slashes that can cause issues
const normalizedDirname = __dirname.startsWith("/")
  ? __dirname.substring(1)
  : __dirname;

// Ensure it’s a proper absolute path
const DEFAULT_DB_FILE = path.join(normalizedDirname, "db", "db");
const DEFAULT_LOGS_DIRECTORY = path.join(normalizedDirname, "logs");

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

Now you can use your "Nostr App"to connect to this relay.

ws://localhost:${port}
`);
}

program
  .name("nostr-relay-sqlite")
  .description("a Nostr relay server using SQLite as a database");

program
  .option("-p, --port <port>", "Port to listen on")
  .option("-f, --file <file>", "Database file to use");

program.parse();

const options = program.opts();

bootstrap();
