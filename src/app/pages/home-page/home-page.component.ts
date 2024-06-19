import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ISlider } from 'app/core/models/slider.model';
import { SliderService } from 'app/core/services/slider.service';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [RouterLink, CommonModule ],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css'
})
export class HomePageComponent implements OnInit, OnDestroy {
  sliders: ISlider[] = [];
  currentSlide: number = 0;
  slideInterval: any;

  constructor(private sliderService: SliderService) {}

  ngOnInit(): void {
    this.sliderService.allSlider().subscribe((data) => {
      this.sliders = data;
      this.startSlideInterval();
    });
  }

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
    }, 5000); // Cambia el slide cada 5 segundos
  }

  stopSlideInterval(): void {
    clearInterval(this.slideInterval);
  }
}

