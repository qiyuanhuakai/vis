import { ref, watch } from 'vue';
import { StorageKeys, storageGet, storageKey, storageSet } from '../utils/storageKeys';

const DEFAULT_PINNED_SESSIONS_LIMIT = 30;
const MIN_PINNED_SESSIONS_LIMIT = 1;
const MAX_PINNED_SESSIONS_LIMIT = 200;

function normalizePinnedSessionsLimit(value: unknown) {
  if (typeof value !== 'number' || !Number.isFinite(value)) return DEFAULT_PINNED_SESSIONS_LIMIT;
  const rounded = Math.round(value);
  if (rounded < MIN_PINNED_SESSIONS_LIMIT) return MIN_PINNED_SESSIONS_LIMIT;
  if (rounded > MAX_PINNED_SESSIONS_LIMIT) return MAX_PINNED_SESSIONS_LIMIT;
  return rounded;
}

function readPinnedSessionsLimit() {
  const raw = storageGet(StorageKeys.settings.pinnedSessionsLimit);
  if (!raw) return DEFAULT_PINNED_SESSIONS_LIMIT;
  const parsed = Number(raw);
  return normalizePinnedSessionsLimit(parsed);
}

const enterToSend = ref(storageGet(StorageKeys.settings.enterToSend) === 'true');
const suppressAutoWindows = ref(storageGet(StorageKeys.settings.suppressAutoWindows) === 'true');
const showMinimizeButtons = ref(storageGet(StorageKeys.settings.showMinimizeButtons) !== 'false');
const dockAlwaysOpen = ref(storageGet(StorageKeys.settings.dockAlwaysOpen) === 'true');
const pinnedSessionsLimit = ref(readPinnedSessionsLimit());

watch(enterToSend, (value) => {
  storageSet(StorageKeys.settings.enterToSend, String(value));
});

watch(suppressAutoWindows, (value) => {
  storageSet(StorageKeys.settings.suppressAutoWindows, String(value));
});

watch(showMinimizeButtons, (value) => {
  storageSet(StorageKeys.settings.showMinimizeButtons, String(value));
});

watch(dockAlwaysOpen, (value) => {
  storageSet(StorageKeys.settings.dockAlwaysOpen, String(value));
});

watch(showMinimizeButtons, (value) => {
  if (value) return;
  dockAlwaysOpen.value = false;
});

watch(pinnedSessionsLimit, (value) => {
  const normalized = normalizePinnedSessionsLimit(value);
  if (normalized !== value) {
    pinnedSessionsLimit.value = normalized;
    return;
  }
  storageSet(StorageKeys.settings.pinnedSessionsLimit, String(normalized));
});

if (typeof window !== 'undefined') {
  window.addEventListener('storage', (event) => {
    if (event.key === storageKey(StorageKeys.settings.enterToSend)) {
      enterToSend.value = event.newValue === 'true';
    }
    if (event.key === storageKey(StorageKeys.settings.suppressAutoWindows)) {
      suppressAutoWindows.value = event.newValue === 'true';
    }
    if (event.key === storageKey(StorageKeys.settings.showMinimizeButtons)) {
      showMinimizeButtons.value = event.newValue !== 'false';
    }
    if (event.key === storageKey(StorageKeys.settings.dockAlwaysOpen)) {
      dockAlwaysOpen.value = event.newValue === 'true';
    }
    if (event.key === storageKey(StorageKeys.settings.pinnedSessionsLimit)) {
      const parsed = event.newValue === null ? DEFAULT_PINNED_SESSIONS_LIMIT : Number(event.newValue);
      pinnedSessionsLimit.value = normalizePinnedSessionsLimit(parsed);
    }
  });
}

export function useSettings() {
  return {
    enterToSend,
    suppressAutoWindows,
    showMinimizeButtons,
    dockAlwaysOpen,
    pinnedSessionsLimit,
    defaultPinnedSessionsLimit: DEFAULT_PINNED_SESSIONS_LIMIT,
    minPinnedSessionsLimit: MIN_PINNED_SESSIONS_LIMIT,
    maxPinnedSessionsLimit: MAX_PINNED_SESSIONS_LIMIT,
  };
}
