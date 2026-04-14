package com.pgms.service;

import com.pgms.dto.*;
import com.pgms.entity.*;
import com.pgms.repository.*;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class DashboardService {

    private final RoomService roomService;
    private final PaymentService paymentService;
    private final ComplaintService complaintService;
    private final TenantProfileRepository tenantProfileRepository;
    private final NoticeRepository noticeRepository;
    private final UserContextService userContextService;

    public DashboardService(RoomService roomService,
                            PaymentService paymentService,
                            ComplaintService complaintService,
                            TenantProfileRepository tenantProfileRepository,
                            NoticeRepository noticeRepository,
                            UserContextService userContextService) {
        this.roomService = roomService;
        this.paymentService = paymentService;
        this.complaintService = complaintService;
        this.tenantProfileRepository = tenantProfileRepository;
        this.noticeRepository = noticeRepository;
        this.userContextService = userContextService;
    }

    public AdminDashboardDto getAdminDashboard(String month) {
        long totalRooms = roomService.countTotalRooms();
        long occupiedRooms = roomService.countOccupiedRooms();
        Hostel currentHostel = userContextService.getCurrentUserHostel();
        long totalTenants = tenantProfileRepository.findByHostelAndSignupCompletedTrueAndActiveTrue(currentHostel).size();
        double monthlyRevenue = paymentService.calculateMonthlyRevenue(month);
        long pendingComplaints = complaintService.countPendingComplaints();

        return AdminDashboardDto.builder()
                .totalRooms(totalRooms)
                .occupiedRooms(occupiedRooms)
                .totalTenants(totalTenants)
                .monthlyRevenue(monthlyRevenue)
                .pendingComplaints(pendingComplaints)
                .build();
    }

    public TenantDashboardDto getTenantDashboard(Long tenantId) {
        Hostel currentHostel = userContextService.getCurrentUserHostel();
        TenantProfile tenant = tenantProfileRepository.findByHostelAndId(currentHostel, tenantId)
                .orElseThrow(() -> new RuntimeException("Tenant not found in your hostel"));

        Room room = tenant.getAllocatedRoom();
        RoomDto roomDto = RoomDto.builder()
                .id(room.getId())
                .roomNumber(room.getRoomNumber())
                .roomType(room.getRoomType())
                .capacity(room.getCapacity())
                .rentAmount(room.getRentAmount())
                .availabilityStatus(room.getAvailabilityStatus())
                .build();

        List<PaymentDto> payments = paymentService.getByTenant(tenantId);
        long openComplaints = complaintService.getComplaintsForTenant(tenantId).stream()
                .filter(c -> c.getStatus() == ComplaintStatus.OPEN)
                .count();

        List<NoticeDto> notices = noticeRepository.findByHostelOrderByCreatedAtDesc(tenant.getHostel()).stream()
                .limit(5)
                .map(n -> NoticeDto.builder()
                        .id(n.getId())
                        .title(n.getTitle())
                        .content(n.getContent())
                        .createdAt(n.getCreatedAt())
                        .build())
                .collect(Collectors.toList());

        return TenantDashboardDto.builder()
                .room(roomDto)
                .payments(payments)
                .openComplaints(openComplaints)
                .notices(notices)
                .build();
    }
}

