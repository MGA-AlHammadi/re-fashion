package de.bht.refashion.backend.dto;

import java.math.BigDecimal;

public class CreateProductRequest {
    public String title;
    public String description;
    public BigDecimal price;
    public String size;
    public String condition;
    public String imageUrl;
    public Long categoryId;
    public Long ownerId;
}
