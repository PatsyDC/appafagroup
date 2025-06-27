import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [CommonModule, RouterLink ],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css'
})
export class HomePageComponent {
  currentSlide: number = 0;
  slideInterval: any;

  ngOnDestroy(): void {
    this.stopSlideInterval();
  }

  showSlide(index: number): void {
    this.currentSlide = index;
  }

  stopSlideInterval(): void {
    clearInterval(this.slideInterval);
  }
}

