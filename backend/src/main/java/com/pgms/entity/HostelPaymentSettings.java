package com.pgms.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Stores hostel owner's preferred payment methods.
 * Used when tenant pays rent - amount goes to owner's UPI/QR or cash.
 */
@Entity
@Table(name = "hostel_payment_settings")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HostelPaymentSettings {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "hostel_id", nullable = false)
    private Hostel hostel;

    /**
     * UPI_ID = show UPI ID/phone number for tenant to pay
     * QR_CODE = show QR code image for tenant to scan
     */
    @Column(name = "payment_mode", length = 20)
    private String paymentMode; // UPI_ID, QR_CODE

    /**
     * UPI ID or phone number (e.g. 9876543210@paytm or 9876543210)
     */
    @Column(name = "upi_id", length = 100)
    private String upiId;

    /**
     * Path to QR code image (when paymentMode = QR_CODE)
     */
    @Column(name = "qr_code_path", length = 255)
    private String qrCodePath;
}
