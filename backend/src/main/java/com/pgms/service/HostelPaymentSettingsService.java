package com.pgms.service;

import com.pgms.dto.HostelPaymentSettingsDto;
import com.pgms.entity.Hostel;
import com.pgms.entity.HostelPaymentSettings;
import com.pgms.repository.HostelPaymentSettingsRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class HostelPaymentSettingsService {

    private final HostelPaymentSettingsRepository repository;
    private final UserContextService userContextService;

    @Value("${app.upload.base-url:http://localhost:8080/uploads}")
    private String uploadBaseUrl;

    public HostelPaymentSettingsService(HostelPaymentSettingsRepository repository, UserContextService userContextService) {
        this.repository = repository;
        this.userContextService = userContextService;
    }

    public Optional<HostelPaymentSettingsDto> get() {
        Hostel currentHostel = userContextService.getCurrentUserHostel();
        Optional<HostelPaymentSettings> opt = repository.findByHostel(currentHostel);
        if (opt.isPresent()) {
            return opt.map(this::toDto);
        }
        return Optional.of(HostelPaymentSettingsDto.builder()
                .paymentMode("UPI_ID")
                .build());
    }

    public HostelPaymentSettingsDto save(HostelPaymentSettingsDto dto) {
        Hostel currentHostel = userContextService.getCurrentUserHostel();
        HostelPaymentSettings entity = repository.findByHostel(currentHostel)
                .orElse(HostelPaymentSettings.builder()
                        .hostel(currentHostel)
                        .build());
        entity.setPaymentMode(dto.getPaymentMode());
        entity.setUpiId(dto.getUpiId());
        String qrPath = dto.getQrCodePath();
        if (qrPath != null && qrPath.startsWith("http")) {
            qrPath = qrPath.replaceFirst("^https?://[^/]+/uploads/", "");
        }
        entity.setQrCodePath(qrPath != null && !qrPath.isEmpty() ? qrPath : null);
        HostelPaymentSettings saved = repository.save(entity);
        return toDto(saved);
    }

    private HostelPaymentSettingsDto toDto(HostelPaymentSettings e) {
        String qrFullUrl = null;
        if (e.getQrCodePath() != null && !e.getQrCodePath().isEmpty()) {
            String rel = e.getQrCodePath().replaceFirst("^/uploads/", "").replaceFirst("^/+", "");
            qrFullUrl = uploadBaseUrl + "/" + rel;
        }
        return HostelPaymentSettingsDto.builder()
                .id(e.getId())
                .paymentMode(e.getPaymentMode())
                .upiId(e.getUpiId())
                .qrCodePath(qrFullUrl)
                .build();
    }
}
