(function (global) {
  const app = (global.__portfolioApp = global.__portfolioApp || {});
  const utils = app.utils;
  const firebase = app.firebase;

  let comments = [];
  let currentPage = 1;

  function renderComments() {
    const container = document.querySelector('.comments-list');
    const count = document.querySelector('.card-header h3');
    if (!container) return;

    const pageSize = app.config?.comments?.pageSize || 6;
    const pageComments = comments.slice(0, currentPage * pageSize);
    container.innerHTML = pageComments.map((comment) => `
      <article class="comment-item">
        <div class="comment-item__header">
          <strong>${comment.name}</strong>
          <span>${utils.formatTimeAgo(comment.createdAt)}</span>
        </div>
        <p>${comment.message}</p>
        <div class="comment-item__actions">
          <button class="comment-like" data-id="${comment.id}">👍 ${comment.likes || 0}</button>
          <button class="comment-delete" data-id="${comment.id}">Delete</button>
        </div>
      </article>
    `).join('');

    if (count) {
      count.innerHTML = `<i class="fas fa-comments"></i> Comments (${comments.length})`;
    }

    container.querySelectorAll('.comment-like').forEach((button) => button.addEventListener('click', () => likeComment(button.dataset.id)));
    container.querySelectorAll('.comment-delete').forEach((button) => button.addEventListener('click', () => deleteComment(button.dataset.id)));
  }

  async function loadComments() {
    try {
      const items = await firebase.queryDocuments?.('comments', { orderBy: ['createdAt', 'desc'] }) || [];
      comments = items;
      renderComments();
    } catch (error) {
      comments = utils.storage.get(app.config?.storageKeys?.comments || 'portfolio-comments', []);
      renderComments();
    }
  }

  function getCommentsHeader(section) {
    return section.querySelector('.card-header h3');
  }

  function renderComments() {
    const container = document.querySelector('.comments-list');
    const section = document.querySelector('#contact .contact-card:last-child');
    const count = section ? getCommentsHeader(section) : null;
    if (!container) return;

    const pageSize = app.config?.comments?.pageSize || 6;
    const pageComments = comments.slice(0, currentPage * pageSize);
    container.innerHTML = pageComments.map((comment) => `
      <article class="comment-item">
        <div class="comment-item__header">
          <strong>${comment.name}</strong>
          <span>${utils.formatTimeAgo(comment.createdAt)}</span>
        </div>
        <p>${comment.message}</p>
        <div class="comment-item__actions">
          <button class="comment-like" data-id="${comment.id}">👍 ${comment.likes || 0}</button>
          <button class="comment-delete" data-id="${comment.id}">Delete</button>
        </div>
      </article>
    `).join('');

    if (count) {
      count.innerHTML = `<i class="fas fa-comments"></i> Comments (${comments.length})`;
    }

    container.querySelectorAll('.comment-like').forEach((button) => button.addEventListener('click', () => likeComment(button.dataset.id)));
    container.querySelectorAll('.comment-delete').forEach((button) => button.addEventListener('click', () => deleteComment(button.dataset.id)));
  }

  async function likeComment(id) {
    const target = comments.find((comment) => comment.id === id);
    if (!target) return;
    const updated = { likes: (target.likes || 0) + 1 };
    await firebase.updateDocument?.('comments', id, updated);
    target.likes = (target.likes || 0) + 1;
    renderComments();
  }

  async function deleteComment(id) {
    await firebase.deleteDocument?.('comments', id);
    comments = comments.filter((comment) => comment.id !== id);
    renderComments();
  }

  function init() {
    const section = document.querySelector('#contact .contact-card:last-child');
    if (!section) return;
    const list = document.createElement('div');
    list.className = 'comments-list';
    section.appendChild(list);
    loadComments();
  }

  app.comments = { init, loadComments, likeComment, deleteComment };
})(window);
