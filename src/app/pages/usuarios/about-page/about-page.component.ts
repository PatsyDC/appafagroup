import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ITrabajador } from 'app/core/models/trabajador.model';
import { TrabajadorService } from 'app/core/services/trabajador.service';

@Component({
  selector: 'app-about-page',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './about-page.component.html',
  styleUrl: './about-page.component.css'
})
export class AboutPageComponent {
  trabajadores?: ITrabajador[] = [];
  public listaTrabajadores: ITrabajador[] = [];

  constructor(private trabajadorService: TrabajadorService){
  }

  ngOnInit(): void{
    this.trabajadorService.allTrabajadores().subscribe((data) => {
      console.log('data :' ,data);
      this.trabajadores = data;
    })
  }

}
