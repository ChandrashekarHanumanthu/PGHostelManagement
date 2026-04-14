package com.pgms.entity;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "tenant_profiles")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TenantProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.EAGER)
    @MapsId
    @JoinColumn(name = "user_id")
    private User user;

    @Column(name = "phone")
    private String phone;

    @Column(name = "alternate_phone")
    private String alternatePhone;

    @Column(name = "location")
    private String location;

    @Column(name = "aadhaar_number")
    private String aadhaarNumber;

    @Column(name = "photo_url")
    private String photoUrl;

    @Column(name = "signup_token")
    private String signupToken;

    @Column(name = "signup_token_expiry")
    private java.time.LocalDateTime signupTokenExpiry;

    @Column(name = "signup_sent")
    @Builder.Default
    private Boolean signupSent = false;

    @Column(name = "signup_completed")
    @Builder.Default
    private Boolean signupCompleted = false;

    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "allocated_room_id")
    private Room allocatedRoom;

    @Column(name = "allocation_date", nullable = false)
    private java.time.LocalDateTime allocationDate;

    /**
     * Marks whether the tenant is currently staying (active) or has vacated.
     * This helps preserve payment history without hard-deleting records.
     */
    @Column(name = "active")
    @Builder.Default
    private Boolean active = true;

    /**
     * One-time maintenance / deposit fee taken at joining time.
     */
    @Column(name = "maintenance_fee_amount")
    @Builder.Default
    private Double maintenanceFeeAmount = 0.0;

    /**
     * How much was refunded back to tenant when leaving (can be 0, partial, or full).
     */
    @Column(name = "maintenance_fee_refunded_amount")
    @Builder.Default
    private Double maintenanceFeeRefundedAmount = 0.0;

    @Column(name = "leave_date")
    private java.time.LocalDateTime leaveDate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "hostel_id", nullable = false)
    @JsonIgnore
    private Hostel hostel;

    // Explicit getters for Boolean fields to ensure proper method names
    public boolean isSignupSent() {
        return signupSent != null && signupSent;
    }

    public boolean isSignupCompleted() {
        return signupCompleted != null && signupCompleted;
    }

    public boolean isActive() {
        return active != null && active;
    }
}
