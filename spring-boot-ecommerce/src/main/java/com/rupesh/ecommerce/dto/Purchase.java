package com.rupesh.ecommerce.dto;

import com.rupesh.ecommerce.entity.Address;
import com.rupesh.ecommerce.entity.Customer;
import com.rupesh.ecommerce.entity.Order;
import com.rupesh.ecommerce.entity.OrderItem;
import lombok.Data;

import java.util.Set;

@Data
public class Purchase {

    private Customer customer;

    private Address shippingAddress;

    private Address billingAddress;

    private Order order;

    private Set<OrderItem> orderItems;
}
