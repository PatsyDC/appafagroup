var slides = document.querySelectorAll('.slide');
var prevBtn = document.querySelector('.prev-btn');
var nextBtn = document.querySelector('.next-btn');
var index = 0;
function showSlide(n) {
    var slider = document.querySelector('.slider');
    if (slider) {
        slider.style.transform = "translateX(".concat(n * -100, "%)");
    }
}
function prevSlide() {
    if (index === 0) {
        index = slides.length - 1;
    }
    else {
        index--;
    }
    showSlide(index);
}
function nextSlide() {
    if (index === slides.length - 1) {
        index = 0;
    }
    else {
        index++;
    }
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
