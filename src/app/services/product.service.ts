import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { response } from 'express';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Product } from '../common/product';
import { ProductCategory } from '../common/product-category';

@Injectable({ //means Can we autowired  
  providedIn: 'root' //this means this class can be used Globally
})
export class ProductService {
  
  // Define the base URL of the REST API
  private baseUrl = environment.luv2ShopApiUrl+"/products";

  private categoryUrl = environment.luv2ShopApiUrl+"/product-category";
  // private baseUrl = "http://localhost:8081/api/products";

  // private categoryUrl = "http://localhost:8081/api/product-category";

  // Inject/Autowired the HttpClient service for making HTTP requests
  constructor(private httpClient: HttpClient) { }

  
  getProductListPaginate(thePage: number,
                        thePageSize: number,
                        theCategoryId: number): Observable<GetResponseProducts> {
  
    //need to build URL based on category ID
    const searchUrl = `${this.baseUrl}/search/findByCategoryId`
      + `?id=${theCategoryId}&page=${thePage}&size=${thePageSize}`;

    console.log(`Getting products from ${searchUrl}`);

    return this.httpClient.get<GetResponseProducts>(searchUrl);
  }

  
  getProductList(theCategoryId: number): Observable<Product[]> {

    //need to build URL based on category ID
    const searchUrl = `${this.baseUrl}/search/findByCategoryId?id=${theCategoryId}`;

    return this.httpClient.get<GetResponseProducts>(searchUrl).pipe(
      map(response => response._embedded.products)
    ); 
  }

  
  getProduct(theProductId: number): Observable<Product> {
    
    //need to build URL based on category ID
    const productUrl = `${this.baseUrl}/${theProductId}`;

    return this.httpClient.get<Product>(productUrl);
  
  }

  
  searchProducts(theKeyword: string | null) {
    //need to build URL based on category ID
    const searchUrl = `${this.baseUrl}/search/findByNameContaining?name=${theKeyword}`;

    return this.httpClient.get<GetResponseProducts>(searchUrl).pipe(
      map(response => response._embedded.products)
    ); 
  }

  
  searchProductsPaginate(thePage: number,
                        thePageSize: number,
                        theKeyword: string): Observable<GetResponseProducts> {

    //need to build URL based on the keyword, page and size
    const searchUrl = `${this.baseUrl}/search/findByNameContaining`
      + `?name=${theKeyword}&page=${thePage}&size=${thePageSize}`;

    return this.httpClient.get<GetResponseProducts>(searchUrl);
  }

  
  getProductCategories(): Observable<ProductCategory[]> {
      
    return this.httpClient.get<GetResponseProductCategory>(this.categoryUrl).pipe(
      map(response => response._embedded.productCategory)
    ); 
  }

}

interface GetResponseProducts {
  _embedded: {
    products : Product[]
  },
  page: {
    size: number,
    totalElements: number,
    totalPages: number,
    number: number
  }
}

interface GetResponseProductCategory {
  _embedded: {
    productCategory : ProductCategory[]
  }
}
