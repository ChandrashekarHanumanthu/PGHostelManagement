package com.pgms.service;

import com.pgms.dto.ComplaintDto;
import com.pgms.entity.Complaint;
import com.pgms.entity.ComplaintStatus;
import com.pgms.entity.Hostel;
import com.pgms.entity.TenantProfile;
import com.pgms.repository.ComplaintRepository;
import com.pgms.repository.TenantProfileRepository;
import com.pgms.service.UserContextService;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ComplaintService {

    private final ComplaintRepository complaintRepository;
    private final TenantProfileRepository tenantProfileRepository;
    private final UserContextService userContextService;

    public ComplaintService(ComplaintRepository complaintRepository,
                            TenantProfileRepository tenantProfileRepository,
                            UserContextService userContextService) {
        this.complaintRepository = complaintRepository;
        this.tenantProfileRepository = tenantProfileRepository;
        this.userContextService = userContextService;
    }

    public List<ComplaintDto> getAllComplaints() {
        Hostel currentHostel = userContextService.getCurrentUserHostel();
        return complaintRepository.findByHostel(currentHostel)
                .stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public ComplaintDto createComplaint(Long tenantId, ComplaintDto dto) {
        Hostel currentHostel = userContextService.getCurrentUserHostel();
        TenantProfile tenant = tenantProfileRepository.findByHostelAndId(currentHostel, tenantId)
                .orElseThrow(() -> new RuntimeException("Tenant not found in your hostel"));
        
        Complaint complaint = Complaint.builder()
                .tenant(tenant)
                .title(dto.getTitle())
                .description(dto.getDescription())
                .createdAt(LocalDateTime.now())
                .hostel(currentHostel)  // Set hostel for data isolation
                .status(ComplaintStatus.OPEN)
                .build();
        
        Complaint saved = complaintRepository.save(complaint);
        return toDto(saved);
    }

    public List<ComplaintDto> getComplaintsForTenant(Long tenantId) {
        Hostel currentHostel = userContextService.getCurrentUserHostel();
        TenantProfile tenant = tenantProfileRepository.findByHostelAndId(currentHostel, tenantId)
                .orElseThrow(() -> new RuntimeException("Tenant not found in your hostel"));
        return complaintRepository.findByHostelAndTenant(currentHostel, tenant)
                .stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public ComplaintDto updateStatus(Long id, ComplaintStatus status) {
        Hostel currentHostel = userContextService.getCurrentUserHostel();
        Complaint complaint = complaintRepository.findByHostelAndId(currentHostel, id)
                .orElseThrow(() -> new RuntimeException("Complaint not found in your hostel"));
        complaint.setStatus(status);
        Complaint saved = complaintRepository.save(complaint);
        return toDto(saved);
    }

    public ComplaintDto resolveComplaint(Long id, String adminResponse) {
        Hostel currentHostel = userContextService.getCurrentUserHostel();
        Complaint complaint = complaintRepository.findByHostelAndId(currentHostel, id)
                .orElseThrow(() -> new RuntimeException("Complaint not found in your hostel"));
        
        complaint.setStatus(ComplaintStatus.RESOLVED);
        complaint.setAdminResponse(adminResponse);
        complaint.setResolvedAt(LocalDateTime.now());
        complaint.setResolvedBy(userContextService.getCurrentUser().getName());
        
        Complaint saved = complaintRepository.save(complaint);
        return toDto(saved);
    }

    public long countPendingComplaints() {
        Hostel currentHostel = userContextService.getCurrentUserHostel();
        return complaintRepository.countByHostelAndStatus(currentHostel, ComplaintStatus.OPEN);
    }

    private ComplaintDto toDto(Complaint complaint) {
        return ComplaintDto.builder()
                .id(complaint.getId())
                .tenantId(complaint.getTenant().getId())
                .tenantName(complaint.getTenant().getUser().getName())
                .roomNumber(complaint.getTenant().getAllocatedRoom() != null ? 
                    complaint.getTenant().getAllocatedRoom().getRoomNumber() : "Not Assigned")
                .title(complaint.getTitle())
                .description(complaint.getDescription())
                .createdAt(complaint.getCreatedAt())
                .status(complaint.getStatus())
                .adminResponse(complaint.getAdminResponse())
                .resolvedAt(complaint.getResolvedAt())
                .resolvedBy(complaint.getResolvedBy())
                .build();
    }
}
