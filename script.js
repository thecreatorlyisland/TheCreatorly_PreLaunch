// mobile nav
const burger = document.getElementById('burger');
const navLinks = document.getElementById('navLinks');
burger.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  burger.setAttribute('aria-expanded', open);
});
navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  navLinks.classList.remove('open');
  burger.setAttribute('aria-expanded', 'false');
}));

// marquee: repeat words enough times to fill the screen so the loop has no gap
(function () {
  const track = document.getElementById('marqueeTrack');
  if (!track) return;
  const marquee = track.parentElement;
  const baseHTML = track.innerHTML;
  function rebuild() {
    track.innerHTML = baseHTML;
    while (track.scrollWidth < marquee.offsetWidth) {
      track.insertAdjacentHTML('beforeend', baseHTML);
    }
    track.insertAdjacentHTML('beforeend', track.innerHTML);
  }
  rebuild();
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(rebuild, 200);
  });
})();

// scroll reveal
const revealEls = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  revealEls.forEach(el => io.observe(el));
} else {
  revealEls.forEach(el => el.classList.add('is-visible'));
}

// role pills
const roleSelect = document.getElementById('roleSelect');
const roleValue = document.getElementById('roleValue');
roleSelect.querySelectorAll('.role-pill').forEach(pill => {
  pill.addEventListener('click', () => {
    roleSelect.querySelectorAll('.role-pill').forEach(p => p.setAttribute('aria-pressed', 'false'));
    pill.setAttribute('aria-pressed', 'true');
    roleValue.value = pill.dataset.role;
    setFormStatus('', null);
  });
});

// main waitlist form
const WAITLIST_ENDPOINT = 'https://script.google.com/macros/s/AKfycbxwi8wDXbCw9SeZ6fj7P6o9bOfq9ZW27XRUmdqaV2n2LZVnLISvhoJ1Ula2sIH9FsAT/exec';

const mainForm = document.getElementById('mainForm');
const formSuccess = document.getElementById('formSuccess');
const formStatus = document.getElementById('formStatus');
const submitBtn = mainForm.querySelector('button[type="submit"]');
const submitBtnLabel = submitBtn.querySelector('.btn-label');
const submitBtnDefaultText = submitBtnLabel.textContent;

function setFormStatus(message, type) {
  formStatus.textContent = message;
  formStatus.classList.remove('is-error', 'is-duplicate');
  if (type) formStatus.classList.add('is-' + type);
  formStatus.classList.toggle('show', Boolean(message));
}

function setSubmitLoading(isLoading) {
  submitBtn.disabled = isLoading;
  submitBtn.classList.toggle('is-loading', isLoading);
  submitBtnLabel.textContent = isLoading ? 'Joining…' : submitBtnDefaultText;
}

mainForm.addEventListener('submit', (e) => {
  e.preventDefault();

  if (!roleValue.value) {
    setFormStatus('Please select a role to continue.', 'error');
    return;
  }
  if (!mainForm.checkValidity()) { mainForm.reportValidity(); return; }

  setFormStatus('', null);
  setSubmitLoading(true);

  const payload = {
    name: document.getElementById('fullName').value.trim(),
    email: document.getElementById('mainEmail').value.trim(),
    role: roleValue.value,
    instagram: document.getElementById('handle').value.trim(),
    youtube: document.getElementById('youtube').value.trim(),
    honeypot: document.getElementById('hpWebsite').value
  };

  fetch(WAITLIST_ENDPOINT, {
    method: 'POST',
    // text/plain avoids a CORS preflight against the Apps Script Web App
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify(payload)
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.result === 'success') {
        mainForm.classList.add('hide');
        formSuccess.classList.add('show');
      } else if (data.result === 'duplicate') {
        setFormStatus("Looks like you're already on the list — we'll be in touch.", 'duplicate');
        setSubmitLoading(false);
      } else {
        setFormStatus('Something went wrong on our end. Please try again in a moment.', 'error');
        setSubmitLoading(false);
      }
    })
    .catch(() => {
      setFormStatus("Couldn't reach the server — check your connection and try again.", 'error');
      setSubmitLoading(false);
    });
});
