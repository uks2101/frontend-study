export function syncTabs(store) {
  window.addEventListener('storage', (e) => {
    if (e.key === store.persist.getOptions().name) {
      store.persist.rehydrate();
    }
  });
}
