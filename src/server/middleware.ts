import type { Request } from "./request";
import type { Response } from "./response";

export type Middleware = (req: Request, res: Response, next: () => void) => void;

export function compose(middlewares: Middleware[]): Middleware {
  if (!Array.isArray(middlewares))
    throw new TypeError('Middleware stack must be an array!')

  for (const middleware of middlewares) {
    if (typeof middleware !== 'function')
      throw new TypeError('Middleware must be composed of functions!')
  }

  return function (req, res, next) {
    let lastIndex = -1;

    function dispatch(index: number) {
      if (index <= lastIndex)
        throw new Error('next() called multiple times');

      lastIndex = index;

      const fn = index === middlewares.length ? next : middlewares[index];

      fn(req, res, dispatch.bind(null, index + 1));
    }

    return dispatch(0);
  }
}