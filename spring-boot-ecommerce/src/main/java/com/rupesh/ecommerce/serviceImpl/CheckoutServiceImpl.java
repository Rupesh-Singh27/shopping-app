package com.rupesh.ecommerce.serviceImpl;

import com.rupesh.ecommerce.dto.PaymentInfo;
import com.rupesh.ecommerce.dto.Purchase;
import com.rupesh.ecommerce.dto.PurchaseResponse;
import com.rupesh.ecommerce.entity.Customer;
import com.rupesh.ecommerce.entity.Order;
import com.rupesh.ecommerce.entity.OrderItem;
import com.rupesh.ecommerce.repository.CustomerRepository;
import com.rupesh.ecommerce.service.CheckoutService;
import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class CheckoutServiceImpl implements CheckoutService {

    @Autowired
    CustomerRepository customerRepository;

    public CheckoutServiceImpl(@Value("${stripe.key.secret}") String stripeSecretKey){

        Stripe.apiKey = stripeSecretKey;
    }

    @Override
    @Transactional
    public PurchaseResponse placeOrder(Purchase purchase) {

        //retrieve the order info from dto
        Order order = purchase.getOrder();

        //generate tracking number
        String orderTrackingNumber = generateOrderTrackingNumber();
        order.setOrderTrackingNumber(orderTrackingNumber);

        //populate order with orderItems
        Set<OrderItem> orderItems = purchase.getOrderItems();
        orderItems.forEach(item -> order.add(item));

        //populate order with billingAddress and shippingAddress
        order.setShippingAddress(purchase.getBillingAddress());
        order.setBillingAddress(purchase.getShippingAddress());

        //populate customer with order
        Customer customer = purchase.getCustomer();

        //check if this is an existing customer
        String email = customer.getEmail();

        Customer customerFromDB = customerRepository.findByEmail(email);

        if(customerFromDB != null){
            //We found them... let's assign them accordingly
            customer = customerFromDB;
        }
        customer.add(order);

        //save to database
        customerRepository.save(customer);

        //return a response
        return new PurchaseResponse(orderTrackingNumber);
    }

    @Override
    public PaymentIntent createPaymentIntent(PaymentInfo paymentInfo) throws StripeException {

        List<String> paymentMethodTypes = new ArrayList<>();
        paymentMethodTypes.add("card");

        Map<String, Object> params = new HashMap<>();
        params.put("amount", paymentInfo.getAmount());
        params.put("currency", paymentInfo.getCurrency());
        params.put("payment_method_types", paymentMethodTypes);
        params.put("description", "Luv2Shop Purchase");
        params.put("receipt_email", paymentInfo.getReceiptEmail());

        return PaymentIntent.create(params);
    }

    private String generateOrderTrackingNumber() {

        //generate a random and unique UUID number (UUID -version 4)
        //Universally Unique Identifier, available in 4 version

        return UUID.randomUUID().toString();
    }
}
