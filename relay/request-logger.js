import path from "path";
import Pino from "pino";

export class RequestLogger {
  constructor(dirPath) {
    this.logger = Pino({
      transport: {
        target: "pino/file",
        options: { destination: path.join(dirPath, "requests.log") },
      },
    });
  }

  async handleMessage(ctx, [messageType], next) {
    const start = Date.now();
    const result = await next();
    this.logger.info(
      { messageType, duration: Date.now() - start },
      `${messageType} request processed in ${Date.now() - start}ms`
    );
    return result;
  }
}
