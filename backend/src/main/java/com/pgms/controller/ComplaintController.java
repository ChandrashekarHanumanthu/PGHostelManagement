package com.pgms.controller;

import com.pgms.dto.ComplaintDto;
import com.pgms.entity.ComplaintStatus;
import com.pgms.service.ComplaintService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/complaints")
@CrossOrigin
public class ComplaintController {

    private final ComplaintService complaintService;

    public ComplaintController(ComplaintService complaintService) {
        this.complaintService = complaintService;
    }

    @PostMapping("/tenant/{tenantId}")
    @PreAuthorize("hasRole('ADMIN') or #tenantId == authentication.principal.id")
    public ResponseEntity<ComplaintDto> createComplaint(@PathVariable Long tenantId,
                                                        @RequestBody ComplaintDto dto) {
        // In a real app, assert tenantId matches authenticated user
        return ResponseEntity.ok(complaintService.createComplaint(tenantId, dto));
    }

    @GetMapping("/my/{tenantId}")
    @PreAuthorize("hasRole('ADMIN') or #tenantId == authentication.principal.id")
    public ResponseEntity<List<ComplaintDto>> getMyComplaints(@PathVariable Long tenantId) {
        return ResponseEntity.ok(complaintService.getComplaintsForTenant(tenantId));
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN','OWNER')")
    public ResponseEntity<List<ComplaintDto>> getAllComplaints() {
        return ResponseEntity.ok(complaintService.getAllComplaints());
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('ADMIN','OWNER')")
    public ResponseEntity<ComplaintDto> updateStatus(@PathVariable Long id,
                                                     @RequestParam ComplaintStatus status) {
        return ResponseEntity.ok(complaintService.updateStatus(id, status));
    }

    @PutMapping("/{id}/resolve")
    @PreAuthorize("hasAnyRole('ADMIN','OWNER')")
    public ResponseEntity<ComplaintDto> resolveComplaint(@PathVariable Long id,
                                                        @RequestBody Map<String, String> request) {
        String adminResponse = request.get("adminResponse");
        return ResponseEntity.ok(complaintService.resolveComplaint(id, adminResponse));
    }
}

