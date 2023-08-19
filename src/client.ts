import { getLocalStorage, LocalStorage, writeLocalStorage } from "./storage.ts";
import { logError, logInfo } from "./logger.ts";
import { authorize } from "./simperium/auth.ts";

type Client = {
  projectDir: string;
  versionDir: string;
  storage: LocalStorage;
};

export async function newClient(): Promise<Client> {
  const storage = await getLocalStorage();

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
  };
}

export async function Authenticate(client: Client) {
  logInfo("Authenticating...");
  if (client.storage.at) {
    logInfo("Authentication token found.");
    return;
  }

  const { username, password } = readCredentials();
  let accessToken: string | undefined;

  logInfo("Authorizing...");
  try {
    accessToken = await authorize(username, password);
  } catch (e) {
    logError(e);
    logInfo("Retrying...");
    Authenticate(client);
  }

  client.storage.at = accessToken;
  writeLocalStorage(client.storage);
}

type Credentials = { username: string; password: string };
function readCredentials(): Credentials {
  const username = prompt("Username:") || "";
  const password = prompt("Password:") || "";
  return {
    username,
    password,
  };
}
