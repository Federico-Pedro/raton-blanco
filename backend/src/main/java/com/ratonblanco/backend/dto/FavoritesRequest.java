package com.ratonblanco.backend.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class FavoritesRequest {

    @NotNull(message = "El producto es obliogatorio")
    private Long productId;

    @NotNull(message = "El usuario es obligatorio")
    private Long userId;

}
