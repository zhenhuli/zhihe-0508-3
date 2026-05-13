import { writable } from 'svelte/store';

function createFavorites() {
  const { subscribe, set, update } = writable([]);

  return {
    subscribe,
    add: (giftId) => update(favorites => {
      if (!favorites.includes(giftId)) {
        return [...favorites, giftId];
      }
      return favorites;
    }),
    remove: (giftId) => update(favorites => favorites.filter(id => id !== giftId)),
    toggle: (giftId) => update(favorites => {
      if (favorites.includes(giftId)) {
        return favorites.filter(id => id !== giftId);
      }
      return [...favorites, giftId];
    }),
    clear: () => set([])
  };
}

export const favorites = createFavorites();
