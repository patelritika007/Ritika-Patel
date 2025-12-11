document.addEventListener('DOMContentLoaded', function () {
	// DOM elements
	const navToggle = document.getElementById('nav-toggle');
	const siteNav = document.getElementById('site-nav');
	const yearSpan = document.getElementById('year');
	const contactForm = document.getElementById('contact-form');

	if (yearSpan) yearSpan.textContent = new Date().getFullYear();

	// Mobile nav toggle
	if (navToggle && siteNav) {
		navToggle.addEventListener('click', function () {
			siteNav.classList.toggle('show');
		});

		// close nav on link click (mobile)
		siteNav.querySelectorAll('a').forEach(function (link) {
			link.addEventListener('click', function () {
				siteNav.classList.remove('show');
			});
		});
	}

	// Smooth scroll (for browsers without CSS smooth behavior)
	document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
		anchor.addEventListener('click', function (e) {
			const targetId = this.getAttribute('href').slice(1);
			if (!targetId) return;
			const target = document.getElementById(targetId);
			if (target) {
				e.preventDefault();
				target.scrollIntoView({behavior: 'smooth', block: 'start'});
			}
		});
	});

	// Contact form: simple validation and faux-send
	if (contactForm) {
		contactForm.addEventListener('submit', function (e) {
			e.preventDefault();
			const name = contactForm.name.value.trim();
			const email = contactForm.email.value.trim();
			const message = contactForm.message.value.trim();

			if (!name || !email || !message) {
				alert('Please fill in all fields.');
				return;
			}

			// Basic email pattern
			const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
			if (!emailPattern.test(email)) {
				alert('Please enter a valid email address.');
				return;
			}

			// Simulate sending
			const submitButton = contactForm.querySelector('button[type="submit"]');
			if (submitButton) {
				submitButton.disabled = true;
				submitButton.textContent = 'Sending...';
			}

			setTimeout(function () {
				alert('Thanks, ' + name + '! Your message has been received. (This is a demo)');
				contactForm.reset();
				if (submitButton) {
					submitButton.disabled = false;
					submitButton.textContent = 'Send Message';
				}
			}, 800);
		});
	}

	// Theme handling: persistence and system preference
	const themeToggle = document.getElementById('theme-toggle');
	const storageKey = 'theme'; // 'light' or 'dark'

	// Apply a theme to document
	function applyTheme(theme) {
		if (theme === 'light') {
			document.documentElement.setAttribute('data-theme', 'light');
			if (themeToggle) {
				themeToggle.textContent = '☀️';
				themeToggle.setAttribute('aria-pressed', 'true');
			}
		} else {
			document.documentElement.removeAttribute('data-theme');
			if (themeToggle) {
				themeToggle.textContent = '🌙';
				themeToggle.setAttribute('aria-pressed', 'false');
			}
		}
	}

	// Determine initial theme: stored -> system -> default dark
	function detectInitialTheme() {
		try {
			const stored = localStorage.getItem(storageKey);
			if (stored === 'light' || stored === 'dark') return stored;
		} catch (e) {}

		// prefer light if user prefers light scheme
		if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
			return 'light';
		}
		return 'dark';
	}

	// Initialize theme
	const initialTheme = detectInitialTheme();
	applyTheme(initialTheme);

	// Toggle handler
	if (themeToggle) {
		themeToggle.addEventListener('click', function () {
			const current = document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
			const next = current === 'light' ? 'dark' : 'light';
			try { localStorage.setItem(storageKey, next); } catch (e) {}
			applyTheme(next);
		});
	}

	// React to system preference changes
	if (window.matchMedia) {
		const mq = window.matchMedia('(prefers-color-scheme: light)');
		mq.addEventListener && mq.addEventListener('change', function (e) {
			// If user hasn't explicitly chosen a theme, follow system
			try {
				const stored = localStorage.getItem(storageKey);
				if (!stored) {
					applyTheme(e.matches ? 'light' : 'dark');
				}
			} catch (err) {}
		});
	}
});

