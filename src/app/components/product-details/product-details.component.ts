import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { CartItem } from 'src/app/common/cart-item';
import { Product } from 'src/app/common/product';
import { CartService } from 'src/app/services/cart.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit {
  
  product!: Product;
  private productSubscription: Subscription;

  constructor(public productService: ProductService,
              public cartService: CartService,
              public route: ActivatedRoute) { }

  ngOnInit(): void {
    
    this.route.paramMap.subscribe(() => {
      this.handleProductDetails();
    })
  }
  handleProductDetails() {
    //get the "id" param string, convert the string into number using "+".
    const theProductId: number = +this.route.snapshot.paramMap.get('id')!;

    this.productSubscription = this.productService.getProduct(theProductId).subscribe(
      (data: Product) => {
        this.product = data
      }
    )
  }

  addToCart() {
    console.log(`Adding to cart: ${this.product.name}, ${this.product.unitPrice}`);
    const theCartItem = new CartItem(this.product);
    this.cartService.addToCart(theCartItem);
  }

  ngOnDestroy() {
    // Unsubscribe to prevent memory leaks when the component is destroyed
    if (this.productSubscription) {
      this.productSubscription.unsubscribe();
    }
  }
}
