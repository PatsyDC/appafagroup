import { Component } from '@angular/core';
import { GoogleMap, MapHeatmapLayer } from '@angular/google-maps';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [GoogleMap, MapHeatmapLayer],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css'
})
export class ContactComponent {
  center = {lat: -8.1487078, lng: -79.040944};
  zoom = 15;
  heatmapOptions = {radius: 15};
  heatmapData = [
    {lat: -8.1487078, lng: -79.040944},
    {lat: -8.1714148, lng: -79.008936},
    {lat: -6.7714616, lng: -79.8387175},
    {lat: -6.034721374511719, lng: -76.97469329833984},
    {lat: -12.0621065, lng: -77.0365256},
  ];

  setCenter(lat: number, lng: number) {
    this.center = {lat, lng};
  }

}
