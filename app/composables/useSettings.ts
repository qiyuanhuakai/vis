import { ref, watch } from 'vue';
import { StorageKeys, storageGet, storageKey, storageSet } from '../utils/storageKeys';

const enterToSend = ref(storageGet(StorageKeys.settings.enterToSend) === 'true');
const suppressAutoWindows = ref(storageGet(StorageKeys.settings.suppressAutoWindows) === 'true');

watch(enterToSend, (value) => {
  storageSet(StorageKeys.settings.enterToSend, String(value));
});

watch(suppressAutoWindows, (value) => {
  storageSet(StorageKeys.settings.suppressAutoWindows, String(value));
});

if (typeof window !== 'undefined') {
  window.addEventListener('storage', (event) => {
    if (event.key === storageKey(StorageKeys.settings.enterToSend)) {
      enterToSend.value = event.newValue === 'true';
    }
    if (event.key === storageKey(StorageKeys.settings.suppressAutoWindows)) {
      suppressAutoWindows.value = event.newValue === 'true';
    }
  });
}

export function useSettings() {
  return { enterToSend, suppressAutoWindows };
}
