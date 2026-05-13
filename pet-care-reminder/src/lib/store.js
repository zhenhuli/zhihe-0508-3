import { writable } from 'svelte/store';

const STORAGE_KEY = 'pet-care-data';

const DEFAULT_REMINDER_TYPES = {
  FEED: { label: '喂食', icon: '🍖', defaultInterval: 1 },
  BATH: { label: '洗澡', icon: '🛁', defaultInterval: 7 },
  DEWORM: { label: '驱虫', icon: '💊', defaultInterval: 30 },
  VACCINE: { label: '疫苗', icon: '💉', defaultInterval: 365 }
};

const DEFAULT_PET_TYPES = {
  dog: { label: '狗', icon: '🐕', breeds: ['金毛', '拉布拉多', '泰迪', '柯基', '哈士奇', '萨摩耶', '博美', '边牧', '其他'] },
  cat: { label: '猫', icon: '🐱', breeds: ['英短', '美短', '布偶', '暹罗', '橘猫', '蓝猫', '加菲', '缅因', '其他'] },
  bird: { label: '鸟', icon: '🐦', breeds: ['鹦鹉', '八哥', '画眉', '百灵', '其他'] },
  fish: { label: '鱼', icon: '🐟', breeds: ['金鱼', '锦鲤', '孔雀鱼', '其他'] },
  other: { label: '其他', icon: '🐾', breeds: ['其他'] }
};

function loadData() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      const parsed = JSON.parse(data);
      return {
        pets: parsed.pets || [],
        reminders: parsed.reminders || [],
        reminderTypes: parsed.reminderTypes || { ...DEFAULT_REMINDER_TYPES },
        petTypes: parsed.petTypes || { ...DEFAULT_PET_TYPES }
      };
    }
    return {
      pets: [],
      reminders: [],
      reminderTypes: { ...DEFAULT_REMINDER_TYPES },
      petTypes: { ...DEFAULT_PET_TYPES }
    };
  } catch {
    return {
      pets: [],
      reminders: [],
      reminderTypes: { ...DEFAULT_REMINDER_TYPES },
      petTypes: { ...DEFAULT_PET_TYPES }
    };
  }
}

function saveData(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

const initialData = loadData();

function createPetStore() {
  const { subscribe, set, update } = writable(initialData.pets);

  return {
    subscribe,
    add: (pet) => update(pets => {
      const newPets = [...pets, { ...pet, id: Date.now().toString() }];
      const current = loadData();
      saveData({ ...current, pets: newPets });
      return newPets;
    }),
    update: (pet) => update(pets => {
      const newPets = pets.map(p => p.id === pet.id ? pet : p);
      const current = loadData();
      saveData({ ...current, pets: newPets });
      return newPets;
    }),
    delete: (id) => update(pets => {
      const newPets = pets.filter(p => p.id !== id);
      const current = loadData();
      saveData({ ...current, pets: newPets, reminders: current.reminders.filter(r => r.petId !== id) });
      return newPets;
    })
  };
}

function createReminderStore() {
  const { subscribe, set, update } = writable(initialData.reminders);

  return {
    subscribe,
    add: (reminder) => update(reminders => {
      const newReminders = [...reminders, { ...reminder, id: Date.now().toString(), completed: false }];
      const current = loadData();
      saveData({ ...current, reminders: newReminders });
      return newReminders;
    }),
    update: (reminder) => update(reminders => {
      const newReminders = reminders.map(r => r.id === reminder.id ? reminder : r);
      const current = loadData();
      saveData({ ...current, reminders: newReminders });
      return newReminders;
    }),
    delete: (id) => update(reminders => {
      const newReminders = reminders.filter(r => r.id !== id);
      const current = loadData();
      saveData({ ...current, reminders: newReminders });
      return newReminders;
    }),
    complete: (id) => update(reminders => {
      const newReminders = reminders.map(r => r.id === id ? { ...r, completed: true } : r);
      const current = loadData();
      saveData({ ...current, reminders: newReminders });
      return newReminders;
    })
  };
}

function createReminderTypeStore() {
  const { subscribe, set, update } = writable(initialData.reminderTypes);

  return {
    subscribe,
    add: (key, type) => update(types => {
      const newTypes = { ...types, [key]: type };
      const current = loadData();
      saveData({ ...current, reminderTypes: newTypes });
      return newTypes;
    }),
    update: (key, type) => update(types => {
      const newTypes = { ...types, [key]: type };
      const current = loadData();
      saveData({ ...current, reminderTypes: newTypes });
      return newTypes;
    }),
    delete: (key) => update(types => {
      const newTypes = { ...types };
      delete newTypes[key];
      const current = loadData();
      saveData({ ...current, reminderTypes: newTypes });
      return newTypes;
    }),
    reset: () => {
      const current = loadData();
      saveData({ ...current, reminderTypes: { ...DEFAULT_REMINDER_TYPES } });
      set({ ...DEFAULT_REMINDER_TYPES });
    }
  };
}

function createPetTypeStore() {
  const { subscribe, set, update } = writable(initialData.petTypes);

  return {
    subscribe,
    add: (key, type) => update(types => {
      const newTypes = { ...types, [key]: type };
      const current = loadData();
      saveData({ ...current, petTypes: newTypes });
      return newTypes;
    }),
    update: (key, type) => update(types => {
      const newTypes = { ...types, [key]: type };
      const current = loadData();
      saveData({ ...current, petTypes: newTypes });
      return newTypes;
    }),
    delete: (key) => update(types => {
      const newTypes = { ...types };
      delete newTypes[key];
      const current = loadData();
      saveData({ ...current, petTypes: newTypes });
      return newTypes;
    }),
    addBreed: (typeKey, breed) => update(types => {
      const type = types[typeKey];
      if (type && !type.breeds.includes(breed)) {
        const newTypes = {
          ...types,
          [typeKey]: { ...type, breeds: [...type.breeds, breed] }
        };
        const current = loadData();
        saveData({ ...current, petTypes: newTypes });
        return newTypes;
      }
      return types;
    }),
    deleteBreed: (typeKey, breedIndex) => update(types => {
      const type = types[typeKey];
      if (type) {
        const newBreeds = type.breeds.filter((_, i) => i !== breedIndex);
        const newTypes = {
          ...types,
          [typeKey]: { ...type, breeds: newBreeds }
        };
        const current = loadData();
        saveData({ ...current, petTypes: newTypes });
        return newTypes;
      }
      return types;
    }),
    reset: () => {
      const current = loadData();
      saveData({ ...current, petTypes: { ...DEFAULT_PET_TYPES } });
      set({ ...DEFAULT_PET_TYPES });
    }
  };
}

export const pets = createPetStore();
export const reminders = createReminderStore();
export const reminderTypes = createReminderTypeStore();
export const petTypes = createPetTypeStore();
