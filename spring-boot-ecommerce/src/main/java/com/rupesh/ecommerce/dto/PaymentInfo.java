package com.rupesh.ecommerce.dto;

import lombok.*;

@Data
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PaymentInfo {

    private int amount;
    private String currency;
    private String receiptEmail;
}
