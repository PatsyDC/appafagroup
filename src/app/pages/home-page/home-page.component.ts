import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ISlider } from 'app/core/models/slider.model';
import { SliderService } from 'app/core/services/slider.service';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css'
})
export class HomePageComponent {
  sliders?: ISlider[] = [];
  public slidersHome: ISlider[] = [];

  constructor(private sliderService: SliderService){
  }

  ngOnInit(): void{
    this.sliderService.allSlider().subscribe((data) =>{
      console.log('data:', data);
      this.sliders = data;
    })
  }

}
