package com.rupesh.ecommerce.config;

import com.rupesh.ecommerce.entity.*;
import jakarta.persistence.EntityManager;
import jakarta.persistence.metamodel.EntityType;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.rest.core.config.RepositoryRestConfiguration;
import org.springframework.data.rest.webmvc.config.RepositoryRestConfigurer;
import org.springframework.http.HttpMethod;
import org.springframework.web.servlet.config.annotation.CorsRegistry;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

@Configuration
public class MyDataRestConfig implements RepositoryRestConfigurer {

    @Value("${allowed.origins}")
    private String[] allowedOrigins;

    @Autowired
    EntityManager entityManager;

    @Override
    public void configureRepositoryRestConfiguration(RepositoryRestConfiguration config,
                                                     CorsRegistry cors) {
        RepositoryRestConfigurer.super.configureRepositoryRestConfiguration(config, cors);

        HttpMethod[] theUnsupportedActions = {HttpMethod.POST,
                    HttpMethod.PUT, HttpMethod.PATCH, HttpMethod.DELETE};

        //disable HTTP methods for ProductCategory: POST, PUT, PATCH, DELETE
        disableHttpMethods(Product.class, config, theUnsupportedActions);
        disableHttpMethods(ProductCategory.class, config, theUnsupportedActions);
        disableHttpMethods(Country.class, config, theUnsupportedActions);
        disableHttpMethods(State.class, config, theUnsupportedActions);
        disableHttpMethods(Order.class, config, theUnsupportedActions);

        //calls an internal helper method;
        exposeIds(config);

        //configure cors mapping
//        cors.addMapping("/api/**").allowedOrigins("http://localhost/4200");
        cors.addMapping(config.getBasePath() + "/**").allowedOrigins(allowedOrigins);
    }

    private void disableHttpMethods(Class theClass,
                                    RepositoryRestConfiguration config,
                                    HttpMethod[] theUnsupportedActions) {
        config.getExposureConfiguration()
                .forDomainType(theClass)
                .withItemExposure((metadata, httpMethods) -> httpMethods.disable(theUnsupportedActions))
                .withCollectionExposure((metadata, httpMethods) -> httpMethods.disable(theUnsupportedActions));
    }

    //expose entity Ids
    private void exposeIds(RepositoryRestConfiguration config) {

        //get the list of all entity classes from the Entity Manager
        Set<EntityType<?>> entityTypeSet = entityManager.getMetamodel().getEntities();

        //create the list of the Entity types
        List<Class> entityClasses = new ArrayList<>();

        //get the entity type from the entities
        for(EntityType entityType : entityTypeSet){
            entityClasses.add(entityType.getJavaType());
        }

        // expose the Entity Ids for the Array of entity/domain types
        Class[] domainTypes = entityClasses.toArray(new Class[0]);
        config.exposeIdsFor(domainTypes);
    }
}
