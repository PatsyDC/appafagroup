import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { ISlider } from '../models/slider.model';

@Injectable({
  providedIn: 'root'
})
export class SliderService {
  private _refresh$ = new Subject<void>();
  get refresh$(){
    return this._refresh$;
  }

  private url: string = 'http://localhost:3000/slider';
  constructor(private http: HttpClient) {}

  allSlider(): Observable<ISlider[]>{
    return this.http.get<ISlider[]>(this.url)
  }

  getSliderById(id: number): Observable<ISlider> {
    return this.http.get<ISlider>(`${this.url}/${id}`);
  }
}
