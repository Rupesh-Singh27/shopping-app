import { Component, OnInit } from '@angular/core';
import { Product } from 'src/app/common/product';
import { ProductService } from 'src/app/services/product.service';
import { ActivatedRoute } from '@angular/router';
import { CartService } from 'src/app/services/cart.service';
import { CartItem } from 'src/app/common/cart-item';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list-grid.component.html',
  // templateUrl: './product-list-table.component.html',
  // templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {
  
  products: Product[] = [];
  currentCategoryId: number = 1;
  previousCategoryId: number = 1;
  searchMode: boolean = false;

  //new properties for pagination
  thePageNumber: number = 1;
  thePageSize: number = 5;
  theTotalElements: number = 0;

  previousKeyword: string = "";


  constructor(private productService: ProductService, //we have autowired productService here
              private route: ActivatedRoute, //Current activated route, used to access route params. e.g category's id here.
              private cartService: CartService
  ) { } 

  ngOnInit(): void {
    this.route.paramMap.subscribe(() => {
      this.listProducts();
    });
  }
  
  listProducts() {
    this.searchMode = this.route.snapshot.paramMap.has("keyword");

    if (this.searchMode) {
      this.handleSearchProduct();
    } else {
      this.handleListProduct();
    }
  }

  handleListProduct() {
    //check if "id" parameter is available  
    const hasCategoryId: boolean = this.route.snapshot.paramMap.has("id");

    if (hasCategoryId) {
      //get the "id" parameter string, convert the string to the number using the "+" symbol.
      this.currentCategoryId = +this.route.snapshot.paramMap.get("id")!; // ! tells compiler that object is not null
    } else {
      //if category id is not available... default to category id = 1.
      this.currentCategoryId = 1; //However it is already set to 1, this else block is unneccessary. This is for understandin purpose.
    }

    /* Check if we have a different category than previous 
      Note: Angular will reuse a component if it is currently being viewed

      if we have a different category id than previous
      then set thePageNumber back to 1
     */
    if (this.previousCategoryId != this.currentCategoryId) {
      this.thePageNumber = 1;
    }

    this.previousCategoryId = this.currentCategoryId;
    console.log(`currentCategoryId=${this.currentCategoryId}, thePageNumber=${this.thePageNumber}`)

    this.productService.getProductListPaginate(this.thePageNumber - 1,
                                       this.thePageSize,
                                       this.currentCategoryId)
                                        .subscribe(
                                        data => {
                                            this.products = data._embedded.products;
                                            this.thePageNumber = data.page.number + 1;
                                            this.thePageSize = data.page.size;
                                            this.theTotalElements = data.page.totalElements;
                                        }
                                      )
  }

  updatePageSize(pageSize: string) {
    this.thePageSize = +pageSize;
    this.thePageNumber = 1;
    this.listProducts();
  }

  handleSearchProduct() {
    
    const theKeyword = this.route.snapshot.paramMap.get("keyword")!;

    /* 
      If we have a different keyword than previous
      then reset the page number for new keyword category i.e thePaegNumber to 1.
     */
    
    if (this.previousKeyword != theKeyword) {
      this.thePageNumber = 1;
    }
    
    this.previousKeyword = theKeyword!;
    console.log(`keyword=${theKeyword}, thePageNumber=${this.thePageNumber}`)

    this.productService.searchProductsPaginate( this.thePageNumber - 1,
                                                this.thePageSize,
                                                theKeyword)
                                                .subscribe(
                                                  (data: any) => {
                                                    this.products = data._embedded.products;
                                                    this.thePageNumber = data.page.number + 1;
                                                    this.thePageSize = data.page.size;
                                                    this.theTotalElements = data.page.totalElements;
                                                  }
                                                );
  }

  addToCart(theProduct: Product) {
    console.log(`Adding to cart: ${theProduct.name}, ${theProduct.unitPrice}`);

    //TODO: do the real work
    const theCartItem = new CartItem(theProduct);

    this.cartService.addToCart(theCartItem);
  }

}
