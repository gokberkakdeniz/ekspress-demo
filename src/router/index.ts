import { IncomingMessage, ServerResponse } from "http";

import resMixin, { Response } from "../server/response";
import reqMixin, { Request } from "../server/request";
import { Middleware } from "../server/middleware";

export const HTTP_METHODS = ["CONNECT", "DELETE", "GET", "HEAD", "OPTIONS", "POST", "PUT", "TRACE"] as const;

export type Method = typeof HTTP_METHODS[number];

type Node = {
  dir: string,
  children: Node[];
  handlers: Partial<Record<Method, Middleware>>;
}

export default class EkspressRadixTreeRouter {
  #root: Node = {
    dir: "",
    children: [],
    handlers: {}
  }

  public append(method: Method | Method[], path: string, resolver: Middleware): void {
    const methods = Array.isArray(method) ? method : [method];
    const dirs = path.split("/");

    let node = this.#root;
    for (let i = 0; i < dirs.length; i++) {
      const dir = dirs[i];
      const nextDir = dirs[i + 1];

      if (dir !== node.dir) return;

      const child = node.children.find(child => child.dir === nextDir);

      if (child) {
        node = child;
      } else if (!nextDir) {
        methods.forEach(m => node.handlers[m] = resolver);
      } else {
        const newNode = {
          dir: nextDir,
          children: [],
          handlers: {}
        };
        node.children.push(newNode);
        node = newNode;
      }
    }
  }

  public handle(req: IncomingMessage, res: ServerResponse): Middleware {
    const { url = "", method = "" } = req;
    
    let handler: Middleware = (_req: Request, _res: Response) => {
      const { url = "", method = "" } = req;

      _res.status(404).json({
        message: `The resource ${url} (${method}) is not found.`
      });
    };

    const dirs = url.split("/");
    dirs[dirs.length - 1] = dirs[dirs.length - 1].split("?")[0];

    const queue = [[0 as number, this.#root] as const];
    const matches = new Array(dirs.length);
    while (queue.length > 0) {
      const [index, node] = queue.shift()!;

      const dir = dirs[index];
      const nextDir = dirs[index + 1];

      if (node.dir !== dir) {
        if (!node.dir.startsWith(":")) continue;

        matches[index] = node.dir.substr(1);
      }

      const children = node.children
        .filter(child => child.dir === nextDir || (child.dir.startsWith(":") && nextDir))
        .map(child => [index + 1, child] as const);

      if (children.length > 0) {
        queue.push(...children);
      } else if (!nextDir && method in node.handlers) {
        handler = node.handlers[method as Method]!;
        break;
      }
    }

    const params = matches.reduce((acc, key, index) => Object.assign(acc, { [key]: dirs[index] }), {});

    reqMixin(req, params);
    resMixin(res);

    return handler;
  }
}