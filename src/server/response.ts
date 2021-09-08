import { ServerResponse } from "http";

type OmitThisDeclaration<F extends (...args: any) => any> = (...args: Parameters<F>) => ReturnType<F>;

export interface Response extends ServerResponse {
  json: OmitThisDeclaration<typeof json>,
  status: OmitThisDeclaration<typeof status>,
  type: OmitThisDeclaration<typeof type>,
  set: OmitThisDeclaration<typeof set>,
}

function json(this: ServerResponse, body: any): void {
  this.setHeader("Content-Type", "application/json");

  return this.end(JSON.stringify(body))
}

function status(this: ServerResponse, statusCode: number): Response {
  this.statusCode = statusCode;

  return this as Response;
}

function type(this: ServerResponse, contentType: string): Response {
  this.setHeader("Content-Type", contentType);

  return this as Response;
}

function set(this: ServerResponse, fields: Record<string, string>): Response;
function set(this: ServerResponse, field: string, value: string | string[]): Response;
function set(this: ServerResponse, arg0: string | Record<string, string>, arg1?: string | string[]): Response {
  if (typeof arg0 === "string" && (typeof arg1 === "string" || Array.isArray(arg1))) {
    this.setHeader(arg0, arg1);
  } else if (typeof arg0 === "object") {
    Object.entries(arg0).forEach(([field, value]) => this.setHeader(field, value));
  } else {
    throw new Error("Invalid function call.");
  }

  return this as Response;
}

const mixin = (res: ServerResponse): Response => Object.assign(
  res,
  {
    json: json.bind(res),
    status: status.bind(res),
    type: type.bind(res),
    set: set.bind(res),
  }
);


export default mixin;