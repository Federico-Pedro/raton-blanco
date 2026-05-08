package com.ratonblanco.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.List;

@Data //crea automaticamente getters y setters
public class ProductRequest {
    @NotBlank(message = "El nombre es obligatorio")
    private String name;

    @NotBlank(message = "La descripción es obligatoria")
    private String description;

    @NotNull(message = "Debe agregar al menos una imagen")
    @NotEmpty(message = "Debe agregar al menos una imagen")
    private List<String> images;

    @NotEmpty(message = "La categoría es obligatoria")
    private List<Long> categoryIds;



}
