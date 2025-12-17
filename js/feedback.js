(() => {
  'use strict';

  const STORAGE_KEY = 'mononews-feedback';

  const form = document.querySelector('#feedback-form');
  const list = document.querySelector('#feedback-list');
  const template = document.querySelector('#feedback-template');

  const nameInput = form.elements['name'];
  const emailInput = form.elements['email'];
  const messageInput = form.elements['message'];

  let items = [];

  const loadFromStorage = () => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;

    try {
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return;
      items = parsed;
      items.forEach(renderItem);
    } catch (err) {
      console.error('Ошибка чтения feedback из localStorage', err);
    }
  };

  const saveToStorage = () => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (err) {
      console.error('Ошибка записи feedback в localStorage', err);
    }
  };


  const renderItem = (item) => {
    const node = template.content.firstElementChild.cloneNode(true);

    node.dataset.id = item.id;
    node.querySelector('.feedback-item__author').textContent = item.name;
    node.querySelector('.feedback-item__email').textContent = item.email;
    node.querySelector('.feedback-item__date').textContent =
      new Date(item.createdAt).toLocaleString();
    node.querySelector('.feedback-item__text').textContent = item.message;

    const editBtn = node.querySelector('[data-action="edit"]');
    editBtn.addEventListener('click', () => handleEdit(item.id, node));

    list.appendChild(node);
  };


  const handleEdit = (id, node) => {
    const textEl = node.querySelector('.feedback-item__text');
    const oldText = textEl.textContent;

    const updated = window.prompt('Измените текст отзыва:', oldText);
    if (updated === null) return; 

    const trimmed = updated.trim();
    if (trimmed.length < 10) {
      alert('Текст отзыва должен быть не короче 10 символов.');
      return;
    }

 
    textEl.textContent = trimmed;

 
    const item = items.find((it) => it.id === id);
    if (item) {
      item.message = trimmed;
      saveToStorage();
    }
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
    saveToStorage();
    renderItem(item);
    form.reset();
  });

  loadFromStorage();
})();
