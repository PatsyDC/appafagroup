var slides = document.querySelectorAll('.slide');
var prevBtn = document.querySelector('.prev-btn');
var nextBtn = document.querySelector('.next-btn');
var index = 0;

function showSlide(n) {
    var slider = document.querySelector('.slider');
    if (slider) {
        slider.style.transform = `translateX(${n * -100}%)`;
    }
}

function prevSlide() {
    index = (index === 0) ? slides.length - 1 : index - 1;
    showSlide(index);
}

function nextSlide() {
    index = (index === slides.length - 1) ? 0 : index + 1;
    showSlide(index);
}

if (prevBtn) {
    prevBtn.addEventListener('click', prevSlide);
}
if (nextBtn) {
    nextBtn.addEventListener('click', nextSlide);
}

// Automatic slide change
setInterval(nextSlide, 5000);
