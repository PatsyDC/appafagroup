import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ISlider } from 'app/core/models/slider.model';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [CommonModule, RouterLink ],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css'
})
export class HomePageComponent {
  sliders: ISlider[] = [];
  currentSlide: number = 0;
  slideInterval: any;

  ngOnDestroy(): void {
    this.stopSlideInterval();
  }

  showSlide(index: number): void {
    this.currentSlide = index;
  }

  nextSlide(): void {
    this.currentSlide = (this.currentSlide + 1) % this.sliders.length;
  }

  prevSlide(): void {
    this.currentSlide = (this.currentSlide - 1 + this.sliders.length) % this.sliders.length;
  }

  startSlideInterval(): void {
    this.slideInterval = setInterval(() => {
      this.nextSlide();
    }, 5000);
  }

  stopSlideInterval(): void {
    clearInterval(this.slideInterval);
  }
}

