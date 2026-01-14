'use strict';

export const cloneFromTemplate = (template) => {
  const root = template?.content?.firstElementChild;
  if (!root) {
    throw new Error('внутри нет корневого элемента');
  }
  return root.cloneNode(true); 
};

export const saveJson = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error('ошибка при сохранении в localStorage', err);
  }
};

export const loadJson = (key, fallback = null) => {
  const raw = localStorage.getItem(key);
  if (!raw) return fallback;

  try {
    return JSON.parse(raw);
  } catch (err) {
    console.error('ошибка при чтении из localStorage', err);
    return fallback;
  }
};
