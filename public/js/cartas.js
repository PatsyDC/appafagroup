document.addEventListener("DOMContentLoaded", function () {
    let valueDisplays = document.querySelectorAll(".num");
    let interval = 4000;
  
    let observerOptions = {
      root: null, // Use the viewport as the root
      rootMargin: '0px',
      threshold: 0.1 // Trigger when at least 10% of the section is visible
    };
  
    let observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          valueDisplays.forEach((valueDisplay) => {
            let startValue = 0;
            let endValue = parseInt(valueDisplay.getAttribute("data-val"));
            let duration = Math.floor(interval / endValue);
            let counter = setInterval(function () {
              startValue += 1;
              valueDisplay.textContent = startValue;
              if (startValue == endValue) {
                clearInterval(counter);
              }
            }, duration);
          });
          observer.unobserve(entry.target); // Stop observing after animation
        }
      });
    }, observerOptions);
  
    let cardsSection = document.querySelector("#cards-section");
    if (cardsSection) {
      observer.observe(cardsSection);
    }
  });
  
  