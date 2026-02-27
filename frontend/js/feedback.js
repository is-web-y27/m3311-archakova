'use strict';

import {cloneFromTemplate, saveJson, loadJson} from './function.js'
import markdownit from 'https://esm.sh/markdown-it@14.1.0';

const STORAGE_KEY = 'mononews-feedback';

const md = markdownit({
  breaks: true,
  linkify: true
});

const form = document.querySelector('#feedback-form');
const list = document.querySelector('#feedback-list');
const template = document.querySelector('#feedback-template');


if (!form || !list || !template) {

} else {
  const nameInput = form.elements['name'];
  const emailInput = form.elements['email'];
  const messageInput = form.elements['message'];

  let items = loadJson(STORAGE_KEY, []);
  if (!Array.isArray(items)) items = [];
  const renderItem = (item) => {
    const node = cloneFromTemplate(template);

    node.dataset.id = item.id;
    node.querySelector('.feedback-item__author').textContent = item.name;
    node.querySelector('.feedback-item__email').textContent = item.email;
    node.querySelector('.feedback-item__date').textContent =
      new Date(item.createdAt).toLocaleString();

    const textEl = node.querySelector('.feedback-item__text');
    textEl.innerHTML = md.render(item.message);

    const editBtn = node.querySelector('[data-action="edit"]');
    editBtn.addEventListener('click', () => handleEdit(item.id, node));

    list.appendChild(node);
  };

  const saveAll = () => {
    saveJson(STORAGE_KEY, items);
  }

  const handleEdit = (id, node) => {
    const item = items.find((it) => it.id === id);
    if (!item) return;

    const oldText = item.message;
    const updated = window.prompt('Измените текст отзыва:', oldText);
    if (updated === null) return;

    const trimmed = updated.trim();
    if (trimmed.length < 10) {
      alert('Текст отзыва должен быть не короче 10 символов.');
      return;
    }

    item.message = trimmed;

    const textEl = node.querySelector('.feedback-item__text');
    textEl.innerHTML = md.render(trimmed);

    saveAll();
  };

  const clearValidation = () => {
    [nameInput, emailInput, messageInput].forEach((input) => {
      input.classList.remove('feedback-input--error');
    });
  };

  const validateForm = () => {
    clearValidation();
    let ok = true;

    if (!nameInput.value.trim()) {
      nameInput.classList.add('feedback-input--error');
      ok = false;
    }

    if (!emailInput.validity.valid) {
      emailInput.classList.add('feedback-input--error');
      ok = false;
    }

    if (messageInput.value.trim().length < 10) {
      messageInput.classList.add('feedback-input--error');
      ok = false;
    }

    return ok;
  };

  items.forEach(renderItem);

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    if (!validateForm()) return;

    const item = {
      id: Date.now().toString(),
      name: nameInput.value.trim(),
      email: emailInput.value.trim(),
      message: messageInput.value.trim(), 
      createdAt: new Date().toISOString()
    };

    items.push(item);
    saveAll();
    renderItem(item);
    form.reset();
  });
}
