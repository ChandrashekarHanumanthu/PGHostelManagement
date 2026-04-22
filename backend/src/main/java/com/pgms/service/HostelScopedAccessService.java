package com.pgms.service;

import com.pgms.entity.Hostel;
import com.pgms.entity.Payment;
import com.pgms.entity.Room;
import com.pgms.entity.RoomTypeConfig;
import com.pgms.entity.TenantProfile;
import com.pgms.exception.ResourceNotFoundException;
import com.pgms.repository.PaymentRepository;
import com.pgms.repository.RoomRepository;
import com.pgms.repository.RoomTypeConfigRepository;
import com.pgms.repository.TenantProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class HostelScopedAccessService {
    private final UserContextService userContextService;
    private final TenantProfileRepository tenantProfileRepository;
    private final RoomRepository roomRepository;
    private final RoomTypeConfigRepository roomTypeConfigRepository;
    private final PaymentRepository paymentRepository;

    public Hostel getCurrentHostel() {
        return userContextService.getCurrentUserHostel();
    }

    public TenantProfile getTenant(Long tenantId) {
        Hostel hostel = getCurrentHostel();
        return tenantProfileRepository.findByHostelAndId(hostel, tenantId)
                .orElseThrow(() -> new ResourceNotFoundException("Tenant not found in your hostel"));
    }

    public Room getRoom(Long roomId) {
        Hostel hostel = getCurrentHostel();
        return roomRepository.findByHostelAndId(hostel, roomId)
                .orElseThrow(() -> new ResourceNotFoundException("Room not found in your hostel"));
    }

    public RoomTypeConfig getRoomTypeConfig(Long configId) {
        Hostel hostel = getCurrentHostel();
        return roomTypeConfigRepository.findByHostelAndId(hostel, configId)
                .orElseThrow(() -> new ResourceNotFoundException("Room type configuration not found in your hostel"));
    }

    public Payment getPayment(Long paymentId) {
        Hostel hostel = getCurrentHostel();
        return paymentRepository.findByHostelAndId(hostel, paymentId)
                .orElseThrow(() -> new ResourceNotFoundException("Payment not found in your hostel"));
    }
}
