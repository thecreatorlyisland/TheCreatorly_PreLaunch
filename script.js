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
  });
});

// main waitlist form
const mainForm = document.getElementById('mainForm');
const formSuccess = document.getElementById('formSuccess');
mainForm.addEventListener('submit', (e) => {
  e.preventDefault();
  if (!mainForm.checkValidity()) { mainForm.reportValidity(); return; }
  // NOTE: this is a static prototype — wire this up to your real backend
  // (Django endpoint, Google Sheet, Mailchimp, etc.) before launch.
  mainForm.classList.add('hide');
  formSuccess.classList.add('show');
});
