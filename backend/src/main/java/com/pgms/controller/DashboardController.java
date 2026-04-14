package com.pgms.controller;

import com.pgms.dto.AdminDashboardDto;
import com.pgms.dto.TenantDashboardDto;
import com.pgms.service.DashboardService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin
public class DashboardController {

    private final DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @GetMapping("/admin")
    @PreAuthorize("hasAnyRole('ADMIN','OWNER')")
    public ResponseEntity<AdminDashboardDto> getAdminDashboard(@RequestParam String month) {
        try {
            return ResponseEntity.ok(dashboardService.getAdminDashboard(month));
        } catch (Exception e) {
            System.err.println("===== DASHBOARD API ERROR =====");
            e.printStackTrace();
            System.err.println("===============================");
            throw e;
        }
    }

    @GetMapping("/tenant/{tenantId}")
    @PreAuthorize("hasAnyRole('ADMIN','OWNER') or #tenantId == authentication.principal.id")
    public ResponseEntity<TenantDashboardDto> getTenantDashboard(@PathVariable Long tenantId) {
        // In a real app, ensure tenantId matches authenticated user
        return ResponseEntity.ok(dashboardService.getTenantDashboard(tenantId));
    }
}

