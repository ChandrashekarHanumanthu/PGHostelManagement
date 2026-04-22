package com.pgms.controller;

import com.pgms.exception.ForbiddenOperationException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@RestController
@RequestMapping("/uploads")
public class FileController {
    private static final Logger logger = LoggerFactory.getLogger(FileController.class);

    @Value("${app.upload.dir}")
    private String uploadDir;

    @GetMapping("/{subDirectory}/{filename:.+}")
    public ResponseEntity<Resource> serveFile(
            @PathVariable String subDirectory,
            @PathVariable String filename) {
        try {
            Path uploadRoot = Paths.get(uploadDir).toAbsolutePath().normalize();
            Path filePath = uploadRoot.resolve(subDirectory).resolve(filename).normalize();

            if (!filePath.startsWith(uploadRoot)) {
                throw new ForbiddenOperationException("Invalid file path");
            }

            Resource resource = new UrlResource(filePath.toUri());
            if (!resource.exists() || !resource.isReadable()) {
                return ResponseEntity.notFound().build();
            }

            String contentType = resolveContentType(filePath);
            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(contentType))
                    .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + resource.getFilename() + "\"")
                    .body(resource);
        } catch (ForbiddenOperationException ex) {
            throw ex;
        } catch (Exception ex) {
            logger.warn("Failed to serve file {}/{}", subDirectory, filename, ex);
            return ResponseEntity.notFound().build();
        }
    }

    private String resolveContentType(Path filePath) {
        try {
            String contentType = Files.probeContentType(filePath);
            return contentType != null ? contentType : "application/octet-stream";
        } catch (IOException ignored) {
            return "application/octet-stream";
        }
    }
}
