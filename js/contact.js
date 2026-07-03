(function (global) {
  const app = (global.__portfolioApp = global.__portfolioApp || {});
  const utils = app.utils;
  const firebase = app.firebase;

  async function submitContactForm(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const fields = Array.from(form.querySelectorAll('input, textarea'));
    const values = Object.fromEntries(fields.map((field) => [field.getAttribute('placeholder') || field.name || field.type, field.value.trim()]));

    const name = values['Your Name'] || values.name || '';
    const email = values['Your Email'] || values.email || '';
    const message = values['Your Message'] || values.message || '';

    if (!name || !email || !message) {
      utils.showToast('Please complete all fields.', 'error');
      return;
    }
    if (!utils.isValidEmail(email)) {
      utils.showToast('Please enter a valid email address.', 'error');
      return;
    }

    const submitButton = form.querySelector('button[type="submit"]');
    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = 'Sending...';
    }

    try {
      await firebase.addDocument?.('contact-messages', { name, email, message, createdAt: new Date().toISOString() });
      utils.showToast('Thanks for reaching out. I will respond soon.', 'success');
      form.reset();
    } catch (error) {
      utils.showToast('Message failed to send. Please try again.', 'error');
    } finally {
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
      }
    }
  }

  async function submitCommentForm(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const name = form.querySelector('input[type="text"]')?.value.trim();
    const message = form.querySelector('textarea')?.value.trim();

    if (!name || !message) {
      utils.showToast('Please add your name and message.', 'error');
      return;
    }

    const button = form.querySelector('button[type="submit"]');
    if (button) {
      button.disabled = true;
      button.textContent = 'Posting...';
    }

    try {
      await firebase.addDocument?.('comments', { name, message, likes: 0, replies: [], createdAt: new Date().toISOString() });
      utils.showToast('Comment posted successfully.', 'success');
      form.reset();
    } catch (error) {
      utils.showToast('Unable to post comment right now.', 'error');
    } finally {
      if (button) {
        button.disabled = false;
        button.innerHTML = '<i class="fas fa-paper-plane"></i> Post Comment';
      }
    }
  }

  function init() {
    const contactForm = document.getElementById('contactForm');
    const commentForm = document.getElementById('commentForm');
    if (contactForm) contactForm.addEventListener('submit', submitContactForm);
    if (commentForm) commentForm.addEventListener('submit', submitCommentForm);
    const formInputs = document.querySelectorAll('#contactForm input, #contactForm textarea, #commentForm input, #commentForm textarea');
    formInputs.forEach((input) => {
      input.addEventListener('input', () => input.classList.toggle('is-valid', Boolean(input.value.trim())));
    });
  }

  app.contact = { init, submitContactForm, submitCommentForm };
})(window);
