package com.rupesh.ecommerce.repository;

import com.rupesh.ecommerce.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.stereotype.Repository;
import org.springframework.web.bind.annotation.CrossOrigin;

@RepositoryRestResource
public interface ProductRepository extends JpaRepository<Product, Long> {

    /*
    * Spring Data Rest will automatically exposes endpoint
    *
    * http://localhost:8081/api/products/search/findByCategoryId?id=2
    * http://localhost:8081/api/products/search/findByNameContaining?name=Python
    * */
    Page<Product> findByCategoryId(@Param("id") Long id, Pageable pageable);

    Page<Product> findByNameContaining(@Param("name") String name, Pageable pageable);

}
