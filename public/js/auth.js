document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.querySelector('form[action="/auth/login"]');
  const registerForm = document.querySelector('form[action="/auth/register"]');

  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const formData = new FormData(loginForm);
      const response = await fetch("/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(formData)),
      });

      if (response.redirected) {
        window.location.href = response.url;
      } else {
        const html = await response.text();
        document.documentElement.innerHTML = html;
      }
    });
  }

  if (registerForm) {
    registerForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const formData = new FormData(registerForm);
      const response = await fetch("/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(formData)),
      });

      if (response.redirected) {
        window.location.href = response.url;
      } else {
        const html = await response.text();
        document.documentElement.innerHTML = html;
      }
    });
  }
});
