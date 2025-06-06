package ru.supersto.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import ru.supersto.dto.analytics.*;
import ru.supersto.service.AnalyticsService;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/analytics")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Аналитика", description = "API для аналитики и отчетов")
@SecurityRequirement(name = "bearerAuth")
@PreAuthorize("hasRole('ADMIN')")
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    @GetMapping("/dashboard")
    @Operation(summary = "Получить статистику для дашборда")
    public ResponseEntity<DashboardStatsDTO> getDashboardStats() {
        DashboardStatsDTO stats = analyticsService.getDashboardStats();
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/revenue")
    @Operation(summary = "Получить статистику доходов за период")
    public ResponseEntity<RevenueStatsDTO> getRevenueStats(
            @RequestParam LocalDateTime startDate,
            @RequestParam LocalDateTime endDate) {
        RevenueStatsDTO stats = analyticsService.getRevenueStats(startDate, endDate);
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/masters/top")
    @Operation(summary = "Получить топ мастеров по производительности")
    public ResponseEntity<List<MasterPerformanceDTO>> getTopMasters(
            @RequestParam(defaultValue = "10") int limit) {
        List<MasterPerformanceDTO> topMasters = analyticsService.getTopMasters(limit);
        return ResponseEntity.ok(topMasters);
    }

    @GetMapping("/masters/{masterId}/performance")
    @Operation(summary = "Получить статистику производительности мастера")
    public ResponseEntity<MasterPerformanceDTO> getMasterPerformance(
            @PathVariable String masterId,
            @RequestParam LocalDateTime startDate,
            @RequestParam LocalDateTime endDate) {
        MasterPerformanceDTO performance = analyticsService.getMasterPerformance(masterId, startDate, endDate);
        return ResponseEntity.ok(performance);
    }

    @GetMapping("/services/top")
    @Operation(summary = "Получить топ услуг по популярности")
    public ResponseEntity<List<ServicePopularityDTO>> getTopServices(
            @RequestParam(defaultValue = "10") int limit) {
        List<ServicePopularityDTO> topServices = analyticsService.getTopServices(limit);
        return ResponseEntity.ok(topServices);
    }

    @GetMapping("/revenue/today")
    @Operation(summary = "Получить доход за сегодня")
    public ResponseEntity<RevenueStatsDTO> getTodayRevenue() {
        LocalDateTime startOfToday = LocalDateTime.now().toLocalDate().atStartOfDay();
        LocalDateTime endOfToday = startOfToday.plusDays(1);
        RevenueStatsDTO stats = analyticsService.getRevenueStats(startOfToday, endOfToday);
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/revenue/month")
    @Operation(summary = "Получить доход за текущий месяц")
    public ResponseEntity<RevenueStatsDTO> getMonthRevenue() {
        LocalDateTime startOfMonth = LocalDateTime.now().toLocalDate().withDayOfMonth(1).atStartOfDay();
        LocalDateTime now = LocalDateTime.now();
        RevenueStatsDTO stats = analyticsService.getRevenueStats(startOfMonth, now);
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/revenue/year")
    @Operation(summary = "Получить доход за текущий год")
    public ResponseEntity<RevenueStatsDTO> getYearRevenue() {
        LocalDateTime startOfYear = LocalDateTime.now().toLocalDate().withDayOfYear(1).atStartOfDay();
        LocalDateTime now = LocalDateTime.now();
        RevenueStatsDTO stats = analyticsService.getRevenueStats(startOfYear, now);
        return ResponseEntity.ok(stats);
    }
}