package com.pgms.controller;

import com.pgms.dto.HostelPaymentSettingsDto;
import com.pgms.service.HostelPaymentSettingsService;
import com.pgms.service.FileStorageService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/payment-settings")
@CrossOrigin
public class PaymentSettingsController {

    private final HostelPaymentSettingsService service;
    private final FileStorageService fileStorageService;

    public PaymentSettingsController(HostelPaymentSettingsService service,
                                    FileStorageService fileStorageService) {
        this.service = service;
        this.fileStorageService = fileStorageService;
    }

    @GetMapping
    public ResponseEntity<HostelPaymentSettingsDto> get() {
        return service.get()
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.ok(HostelPaymentSettingsDto.builder().build()));
    }

    @PutMapping
    @PreAuthorize("hasAnyRole('ADMIN','OWNER')")
    public ResponseEntity<HostelPaymentSettingsDto> update(@RequestBody HostelPaymentSettingsDto dto) {
        return ResponseEntity.ok(service.save(dto));
    }

    @PostMapping(value = "/upload-qr", consumes = "multipart/form-data")
    @PreAuthorize("hasAnyRole('ADMIN','OWNER')")
    public ResponseEntity<HostelPaymentSettingsDto> uploadQr(
            @RequestParam("paymentMode") String paymentMode,
            @RequestParam(value = "upiId", required = false) String upiId,
            @RequestParam(value = "qrFile", required = false) MultipartFile qrFile) {
        HostelPaymentSettingsDto dto = HostelPaymentSettingsDto.builder()
                .paymentMode(paymentMode)
                .upiId(upiId)
                .build();
        if (qrFile != null && !qrFile.isEmpty()) {
            String path = fileStorageService.storeFile(qrFile, "payments");
            dto.setQrCodePath(path.replaceFirst("^/uploads/", ""));
        }
        return ResponseEntity.ok(service.save(dto));
    }
}
