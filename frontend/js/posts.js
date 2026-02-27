'use strict';

import { cloneFromTemplate } from "./function.js";

const API_BASE = 'https://jsonplaceholder.typicode.com';

const list = document.querySelector('#posts-list');
const loader = document.querySelector('#posts-loader');
const errorBox = document.querySelector('#posts-error');
const reloadBtn = document.querySelector('#posts-reload');
const template = document.querySelector('#post-template');

if (!list || !loader || !errorBox || !reloadBtn || !template) {

} else {
  const getRandomUserId = () => Math.floor(Math.random() * 10) + 1;

  const showLoader = () => {
    loader.style.display = 'flex';
    errorBox.hidden = true;
    errorBox.textContent = '';
    list.innerHTML = '';
  };

  const hideLoader = () => {
    loader.style.display = 'none';
  };

  const showError = (message) => {
    errorBox.textContent = message;
    errorBox.hidden = false;
  };

  const renderPost = (post, userId) => {
    const node = cloneFromTemplate(template);

    node.querySelector('.post__title').textContent = post.title;
    node.querySelector('.post__body').textContent = post.body;
    node.querySelector('.post__meta').textContent =
      `Автор #${userId}, пост #${post.id}`;

    list.appendChild(node);
  };

  const loadPosts = async () => {
    const userId = getRandomUserId();
    showLoader();

    try {
      const url = `${API_BASE}/posts?userId=${encodeURIComponent(userId)}`;
      const response = await fetch(url);

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('not-found');
        }
        if (response.status >= 500) {
          throw new Error('server');
        }
        throw new Error('http');
      }

      const posts = await response.json();

      list.innerHTML = '';

      if (!Array.isArray(posts) || posts.length === 0) {
        showError('Нет постов для выбранного автора.');
        return;
      }

      posts.forEach((post) => renderPost(post, userId));
    } catch (err) {
      console.error(err);

      if (!navigator.onLine) {
        showError('Нет подключения к интернету. Проверьте сеть.');
      } else if (err.message === 'server') {
        showError('Сервис временно недоступен (ошибка сервера). Попробуйте позже.');
      } else if (err.message === 'not-found') {
        showError('Запрашиваемый ресурс не найден (404).');
      } else if (err.message === 'http') {
        showError('Произошла ошибка при запросе данных.');
      } else {
        showError('Не удалось загрузить данные. Попробуйте обновить ленту.');
      }
    } finally {
      hideLoader();
    }
  };

  reloadBtn.addEventListener('click', loadPosts);
  window.addEventListener('DOMContentLoaded', () => {
    loadPosts();
  });
}
