import { Storage } from "../storage.ts";
import { Client } from "./types.ts";

export async function newClient(): Promise<Client> {
  const storage = new Storage("sn");

  // initializing project directory
  const homeDir = Deno.env.get("HOME") || ".";
  const projectDir = homeDir + "/Documents/sn";
  await Deno.mkdir(projectDir, { recursive: true });

  // initializing version control
  // creating a directory within .git to automatically ignore version
  // metadata in most IDEs
  const versionDir = projectDir + "/.git/version";
  await Deno.mkdir(versionDir, { recursive: true });

  return {
    projectDir,
    versionDir,
    storage,
    connection: null,
  };
}
