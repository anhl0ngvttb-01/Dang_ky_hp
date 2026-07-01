document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector('form[action="/student/registrations"]');
  if (form) {
    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      const formData = new FormData(form);
      const response = await fetch("/student/registrations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(formData)),
      });

      if (response.ok) {
        window.location.reload();
      }
    });
  }
});
