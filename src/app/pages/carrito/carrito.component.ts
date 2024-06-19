import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ICarrito } from 'app/core/models/carrito.model';
import { CarritoService } from 'app/core/services/carrito.service';

@Component({
  selector: 'app-carrito',
  standalone: true,
  imports: [CommonModule ],
  templateUrl: './carrito.component.html',
  styleUrl: './carrito.component.css'
})
export class CarritoComponent {
  cartItems: ICarrito[] = [];
  public listaCarrito: ICarrito[] = [];

  constructor(private carritoService: CarritoService) {
  }

  ngOnInit(): void {
    this.carritoService.allCarrito().subscribe((data) => {
      console.log('data: ',data);
      this.cartItems = data;
    });
  }

  loadCart(): void {
    this.carritoService.allCarrito().subscribe((combinedProducts) => {
      console.log(combinedProducts); // Imprime la respuesta en la consola
      this.cartItems = combinedProducts;
    });

  }

  addToCart(product: ICarrito): void {
    this.carritoService.addProductToCart(product).subscribe(newItem => {
      this.cartItems.push(newItem);
      this.loadCart(); // Actualiza el carrito en la interfaz de usuario
    });
  }

  // En carrito.ts

// En tu componente, cuando quieras incrementar o decrementar la cantidad

incrementQuantity(productId: number): void {
  const currentItem = this.cartItems.find(item => item.id === productId);
  if (currentItem) {
    this.carritoService.incrementProductQuantity(productId, currentItem.cantidad).subscribe(updatedItem => {
      const index = this.cartItems.findIndex(item => item.id === productId);
      if (index > -1) {
        this.cartItems[index] = updatedItem;
      }
    });
  }
}

decrementQuantity(productId: number): void {
  const currentItem = this.cartItems.find(item => item.id === productId);
  if (currentItem && currentItem.cantidad > 1) {
    this.carritoService.decrementProductQuantity(productId, currentItem.cantidad).subscribe(updatedItem => {
      const index = this.cartItems.findIndex(item => item.id === productId);
      if (index > -1) {
        this.cartItems[index] = updatedItem;
      }
    });
  }
}



  removeFromCart(productId: number): void {
    this.carritoService.removeProductFromCart(productId).subscribe(() => {
      this.cartItems = this.cartItems.filter(item => item.id !== productId);
    });
  }
}
