import { CurrencyPipe } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-detalle-r',
  standalone: true,
  imports: [CurrencyPipe],
  templateUrl: './detalle-r.component.html',
  styleUrl: './detalle-r.component.css'
})
export class DetalleRComponent {
  // repuesto?: IRepuesto

  // constructor(
  //   private route: ActivatedRoute,
  //   private service: RepuestoService
  // ) {}

  // ngOnInit(): void {
  //   const id = this.route.snapshot.paramMap.get('id');
  //   if (id) {
  //     const idNumber = parseInt(id, 10);
  //     this.service.allRepuestosWithCategories().subscribe((repuestoConCategorias: IRepuesto[]) => {
  //       const repuesto = repuestoConCategorias.find(p => p.id === idNumber);
  //       if (repuesto) {
  //         this.repuesto = repuesto;
  //         console.log(this.repuesto);
  //       } else {
  //         console.error('repuesto no encontrado');
  //       }
  //     });
  //   } else {
  //     console.error('ID inválido');
  //   }
  // }
}
