document.addEventListener('DOMContentLoaded', function() {
  const slides = document.querySelectorAll('.slide');
  const nextBtn = document.querySelector('.next-btn');
  const prevBtn = document.querySelector('.prev-btn');
  let currentSlide = 0;
  let slideInterval;

  function showSlide(index) {
      slides.forEach((slide, i) => {
          if (i === index) {
              slide.style.display = 'block';
          } else {
              slide.style.display = 'none';
          }
      });
  }

  function nextSlide() {
      currentSlide = (currentSlide + 1) % slides.length;
      showSlide(currentSlide);
  }

  function prevSlide() {
      currentSlide = (currentSlide - 1 + slides.length) % slides.length;
      showSlide(currentSlide);
  }

  function startSlideInterval() {
      slideInterval = setInterval(nextSlide, 5000); // Cambia el slide cada 5 segundos (5000 milisegundos)
  }

  function stopSlideInterval() {
      clearInterval(slideInterval);
  }

  // Mostrar el primer slide al cargar la página y comenzar el intervalo
  showSlide(currentSlide);
  startSlideInterval();

  // Verificar que los botones nextBtn y prevBtn existan antes de agregar eventos
  if (nextBtn && prevBtn) {
      // Manejar los eventos de clic para los botones
      nextBtn.addEventListener('click', function() {
          nextSlide();
          stopSlideInterval(); // Detener el intervalo cuando se hace clic en siguiente
      });

      prevBtn.addEventListener('click', function() {
          prevSlide();
          stopSlideInterval(); // Detener el intervalo cuando se hace clic en anterior
      });
  } else {
      console.error('No se encontraron los elementos next-btn o prev-btn.');
  }
});
