document.addEventListener("DOMContentLoaded", function() {
  var navbar = document.getElementById('navbarContainer');
  var content = document.getElementById('content');

  window.addEventListener('scroll', function() {
    var scrollPosition = window.pageYOffset || document.documentElement.scrollTop;

    // Si el usuario ha hecho scroll hacia abajo
    if (scrollPosition > 0) {
      navbar.style.position = "fixed";
      navbar.style.top = "0";
      navbar.style.width = "100%";
      navbar.style.zIndex = "1000"; // Asegura que la navbar esté por encima de otros elementos
    } else {
      // Si el usuario ha subido a la parte superior de la página
      navbar.style.position = "static";
      navbar.style.top = "auto";
      navbar.style.marginTop = "200px"; // Ajusta este valor según la altura de tu spinner
    }
  });

  // Evento para volver a la parte superior de la página
  document.querySelector('.back-to-top').addEventListener('click', function() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
});
