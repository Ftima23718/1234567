package dz.univ.transcampus.controller;

import dz.univ.transcampus.dto.DashboardDtos;
import dz.univ.transcampus.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN','RESPONSIBLE')")
    public ResponseEntity<DashboardDtos.DashboardResponse> getSummary() {
        return ResponseEntity.ok(dashboardService.getSummary());
    }

    @GetMapping("/kpis")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<DashboardDtos.KPIsResponse> getKPIs() {
        return ResponseEntity.ok(dashboardService.getKPIs());
    }

    @GetMapping("/responsable")
    @PreAuthorize("hasAnyRole('ADMIN','RESPONSIBLE')")
    public ResponseEntity<DashboardDtos.ResponsableDashboardResponse> getResponsableDashboard() {
        return ResponseEntity.ok(dashboardService.getResponsableDashboard());
    }

    @GetMapping("/driver")
    @PreAuthorize("hasAnyRole('ADMIN','DRIVER')")
    public ResponseEntity<DashboardDtos.DriverDashboardResponse> getDriverDashboard(Authentication authentication) {
        return ResponseEntity.ok(dashboardService.getDriverDashboard(authentication.getName()));
    }

    @GetMapping("/student")
    @PreAuthorize("hasAnyRole('ADMIN','STUDENT')")
    public ResponseEntity<DashboardDtos.StudentDashboardResponse> getStudentDashboard(Authentication authentication) {
        return ResponseEntity.ok(dashboardService.getStudentDashboard(authentication.getName()));
    }
}
