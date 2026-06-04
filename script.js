const links = document.querySelectorAll('.project-card');
links.forEach((link) => {
  link.addEventListener('click', () => {
    link.classList.add('activated');
  });
});
