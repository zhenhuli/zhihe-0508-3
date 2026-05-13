import { writable } from 'svelte/store';

const STORAGE_KEY = 'flash-cards-data';

function loadCards() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function saveCards(cards) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cards));
}

function createCardsStore() {
  const { subscribe, set, update } = writable(loadCards());

  return {
    subscribe,
    addCard: (front, back) => {
      update(cards => {
        const newCard = {
          id: Date.now(),
          front,
          back,
          mastery: 0,
          createdAt: new Date().toISOString()
        };
        const updated = [...cards, newCard];
        saveCards(updated);
        return updated;
      });
    },
    updateCard: (id, front, back) => {
      update(cards => {
        const updated = cards.map(card =>
          card.id === id ? { ...card, front, back } : card
        );
        saveCards(updated);
        return updated;
      });
    },
    deleteCard: (id) => {
      update(cards => {
        const updated = cards.filter(card => card.id !== id);
        saveCards(updated);
        return updated;
      });
    },
    updateMastery: (id, mastery) => {
      update(cards => {
        const updated = cards.map(card =>
          card.id === id ? { ...card, mastery } : card
        );
        saveCards(updated);
        return updated;
      });
    },
    reset: () => {
      set([]);
      saveCards([]);
    }
  };
}

export const cards = createCardsStore();
