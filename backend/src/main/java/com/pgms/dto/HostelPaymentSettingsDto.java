package com.pgms.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HostelPaymentSettingsDto {
    private Long id;
    private String paymentMode;  // UPI_ID, QR_CODE
    private String upiId;
    private String qrCodePath;   // Full URL for frontend to display
}
