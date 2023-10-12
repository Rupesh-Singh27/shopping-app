package com.rupesh.ecommerce.service;

import com.rupesh.ecommerce.dto.PaymentInfo;
import com.rupesh.ecommerce.dto.Purchase;
import com.rupesh.ecommerce.dto.PurchaseResponse;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;

public interface CheckoutService {

    PurchaseResponse placeOrder(Purchase purchase);

    PaymentIntent createPaymentIntent(PaymentInfo paymentInfo) throws StripeException;
}
