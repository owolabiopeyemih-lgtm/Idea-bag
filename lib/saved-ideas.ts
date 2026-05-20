export type IdeaStatus = "SAVED" | "IN_PROGRESS" | "COMPLETED" | "ABANDONED";

interface SavedEntry {
  status: IdeaStatus;
  savedAt: string;
}

type SavedStore = Record<string, SavedEntry>;

const KEY = "forgeflow_saved";

function getStore(): SavedStore {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? "{}");
  } catch {
    return {};
  }
}

function setStore(store: SavedStore) {
  localStorage.setItem(KEY, JSON.stringify(store));
}

export function getSavedIds(): string[] {
  return Object.keys(getStore());
}

export function getSavedEntry(id: string): SavedEntry | null {
  return getStore()[id] ?? null;
}

export function saveIdea(id: string): void {
  const store = getStore();
  if (!store[id]) {
    store[id] = { status: "SAVED", savedAt: new Date().toISOString() };
    setStore(store);
  }
}

export function unsaveIdea(id: string): void {
  const store = getStore();
  delete store[id];
  setStore(store);
}

export function isIdeaSaved(id: string): boolean {
  return id in getStore();
}

export function updateIdeaStatus(id: string, status: IdeaStatus): void {
  const store = getStore();
  if (store[id]) {
    store[id].status = status;
    setStore(store);
  }
}
