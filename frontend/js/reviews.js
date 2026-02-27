'use strict';
import hljs from 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/es/highlight.min.js';

document.addEventListener('DOMContentLoaded', () => {
  const blocks = document.querySelectorAll('pre code');
  blocks.forEach((block) => {
    hljs.highlightElement(block);
  });
});
