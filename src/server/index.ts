import * as http from "http";

import EkspressRadixTreeRouter, { HTTP_METHODS } from "../router";
import { compose, Middleware } from "./middleware";
import { Request } from "./request";
import { Response } from "./response";

export default class Ekspress {
  #server: http.Server;
  #router: EkspressRadixTreeRouter;
  #middlewares: Middleware[];

  constructor() {
    this.#router = new EkspressRadixTreeRouter();
    this.#middlewares = [];

    this.#server = http.createServer((req, res) => {
      try {
        compose([...this.#middlewares, this.#router.handle(req, res)])(
          req as Request,
          res as Response,
          () => {
            throw new Error("All callbacks are consumed.")
          },
        );
      } catch (error) {
        console.log("ERROR: " + (error as Error).message)

        res.end();
      }
    });

    this.#server.on('clientError', (err, socket) => {
      socket.end('HTTP/1.1 400 Bad Request\r\n\r\n');
    });
  }

  public use(middleware: Middleware): void {
    this.#middlewares.push(middleware);
  }

  public get(path: string, callback: Middleware): void {
    return this.#router.append("GET", path, callback);
  }

  public post(path: string, callback: Middleware): void {
    return this.#router.append("POST", path, callback);
  }

  public delete(path: string, callback: Middleware): void {
    return this.#router.append("DELETE", path, callback);
  }

  public head(path: string, callback: Middleware): void {
    return this.#router.append("HEAD", path, callback);
  }

  public options(path: string, callback: Middleware): void {
    return this.#router.append("OPTIONS", path, callback);
  }

  public put(path: string, callback: Middleware): void {
    return this.#router.append("PUT", path, callback);
  }

  public trace(path: string, callback: Middleware): void {
    return this.#router.append("TRACE", path, callback);
  }

  public all(path: string, callback: Middleware): void {
    return this.#router.append([...HTTP_METHODS], path, callback);
  }

  public listen(port: number) {
    return this.#server.listen(port);
  }
}