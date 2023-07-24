import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { Category } from 'src/app/auth/interfaces/category.interface';
import { ProductsService } from 'src/app/services/products.service';

import { categories } from '../fake-categories';

@Component({
  selector: 'app-new-product',
  templateUrl: './new-product.component.html',
  styleUrls: ['./new-product.component.css'],
})
export class NewProductComponent {
  categories: Array<Category> = categories;
  productForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private productService: ProductsService,
    private router: Router
  ) {
    this.productForm = this.fb.group({
      name: ['', [Validators.required]],
      price: ['', []],
      quantity: ['', [Validators.required, Validators.min(1)]],
      image: [null],
      category: ['', []],
      description: ['', []],
    });
  }

  // Evento que se dispara cuando el usuario selecciona un archivo en el campo de imagen
  // Evento para manejar el cambio en el campo de imagen
  onImageChange( event: Event ) {
    const inputElement = event.target as HTMLInputElement;
    const file = inputElement?.files?.[0];

    // Si hay un archivo seleccionado, lo asignamos al formulario
    if (file) {
      this.productForm.patchValue({ image: file });
    }
  }


  createProduct() {
    console.group('productForm');
    console.log(this.productForm.value);
    console.log(this.productForm.valid);
    console.groupEnd();

    // Si el formulario es inválido, no lo enviamos
    if (this.productForm.invalid) {
      return;
    }

    // Crear FormData para enviar la imagen al servidor
    const formData = new FormData();
    formData.append('name', this.productForm.get('name')?.value);
    formData.append('price', this.productForm.get('price')?.value);
    formData.append('quantity', this.productForm.get('quantity')?.value);
    formData.append('category', this.productForm.get('category')?.value);
    formData.append('description', this.productForm.get('description')?.value);

    // Obtener el archivo seleccionado por el usuario
    const imageControl = this.productForm.get('image');
    const imageFile = imageControl?.value;
    if (imageFile instanceof File) {
      formData.append('image', imageFile, imageFile.name);
    }

    // Log para verificar el contenido del FormData
    console.log('FormData Entries:');
    formData.forEach((value, key) => {
      console.log(key, value);
    });

    // Enviar la imagen al servidor
    this.productService.uploadFile(formData).subscribe((response) => {
      console.log(response);
      // Aquí puedes agregar lógica adicional después de subir la imagen, si es necesario
    });

    this.productForm.reset();

    // setTimeout( () => {
    //   this.router.navigate( [ 'dashboard', 'products' ] );
    // }, 1000 );
  }
}
