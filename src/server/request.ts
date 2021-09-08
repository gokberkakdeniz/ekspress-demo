import { IncomingMessage } from "http";

export interface Request extends IncomingMessage {
  params: Record<string, string>
}

const mixin = (req: IncomingMessage, params: Record<string, string>): Request => Object.assign(req, { params });

export default mixin;