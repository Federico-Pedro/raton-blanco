package com.ratonblanco.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import com.ratonblanco.backend.exception.InvalidFileException;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:5173")
public class FileUploadController {

    private static final List<String> ALLOWED_TYPES = Arrays.asList(
            "image/jpeg",
            "image/jpg",
            "image/png",
            "image/gif",
            "image/webp"
    );

    private static final long MAX_FILE_SIZE = 20 * 1024 * 1024;

    private void validateFile(MultipartFile file) {

        if (file.isEmpty()) {
            throw new InvalidFileException("No se seleccionó ningún archivo");
        }

        String contentType = file.getContentType();
        if (contentType == null || !ALLOWED_TYPES.contains(contentType)) {
            throw new InvalidFileException("Tipo de archivo no permitido. Solo se aceptan imágenes (JPG, PNG, GIF, WEBP)");
        }

        if (file.getSize() > MAX_FILE_SIZE) {
            throw new InvalidFileException("El archivo es demasiado grande. Tamaño máximo: 5MB");
        }

        String filename = file.getOriginalFilename();
        if (filename == null || filename.isEmpty()) {
            throw new InvalidFileException("Nombre de archivo inválido");
        }
    }

    @PostMapping("/upload")
    public ResponseEntity<List<String>> uploadFiles(@RequestParam("files") MultipartFile[] files) {

        for (MultipartFile file : files) {
            validateFile(file);
        }

        List<String> imageUrls = new ArrayList<>();

        if (files.length == 0) {
            return ResponseEntity.badRequest().build();
        }

        try {
            Path uploadPath = Paths.get(System.getProperty("user.dir"), "..", "frontend", "public", "images").normalize();

            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            for (MultipartFile file : files) {

                String originalFilename = file.getOriginalFilename();
                String filename = System.currentTimeMillis() + "_" + originalFilename;
                Path filePath = uploadPath.resolve(filename);
                Files.copy(file.getInputStream(), filePath);
                imageUrls.add("/images/" + filename);
            }

            return ResponseEntity.ok(imageUrls);

        } catch (IOException e) {
            e.printStackTrace();
            throw new InvalidFileException("Error al guardar el archivo: " + e.getMessage());
        }
    }
}
