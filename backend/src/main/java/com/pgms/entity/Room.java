package com.pgms.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "rooms")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Room {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "room_number", nullable = false)
    private String roomNumber;

    @Enumerated(EnumType.STRING)
    @Column(name = "room_type", nullable = false, length = 50)
    private RoomType roomType; // SINGLE, DOUBLE, THREE, FOUR

    @Column(nullable = false)
    private Integer capacity;

    @Column(name = "current_occupancy")
    @Builder.Default
    private Integer currentOccupancy = 0;

    @Column(name = "rent_amount", nullable = false)
    private Double rentAmount;

    @Enumerated(EnumType.STRING)
    @Column(name = "availability_status", nullable = false)
    private RoomAvailabilityStatus availabilityStatus; // AVAILABLE, FULL, MAINTENANCE

    @JsonIgnore
    @OneToMany(mappedBy = "allocatedRoom", fetch = FetchType.LAZY)
    private java.util.List<TenantProfile> tenants;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "hostel_id", nullable = false)
    @JsonIgnore
    private Hostel hostel;
}

