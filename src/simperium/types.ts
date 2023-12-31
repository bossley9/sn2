import type { JSONDiff, JSONDiffOperation } from "../jsondiff/types.ts";

export type AuthorizeResponse = {
  access_token: string;
  userid: string;
  username: string;
};

export type IndexMessageProps = {
  limit: number;
  shouldReturnData?: boolean;
  offset?: string;
};

export type IndexResponse<T> = {
  current: string;
  index: {
    id: string;
    v: number;
    d?: T;
  }[];
  mark?: string;
};

export type Note = {
  tags: string[];
  deleted: boolean;
  shareURL: string;
  publishURL: string;
  content: string;
  systemTags: string[];
  modificationDate: number;
  creationDate: number;
};

type BaseChange<T> = {
  clientid: string;
  cv: string;
  ev: number;
  sv?: number;
  id: string;
  o: JSONDiffOperation;
  v: JSONDiff<T>;
  d?: unknown;
};

export type DChange<T> = BaseChange<T> & {
  error?: number;
  ccids?: string[];
};

export type UChange<T> = Omit<BaseChange<T>, "clientid" | "cv" | "ev">;

export type HandledData =
  | IndexResponse<Note> & { type: "index" }
  | { message: string; type: "cv" }
  | { changes: DChange<Note>[]; type: "c" };
