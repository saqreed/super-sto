package ru.supersto.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import ru.supersto.dto.ProductDTO;
import ru.supersto.entity.ProductCategory;
import ru.supersto.service.ProductService;

import java.util.List;

@RestController
@RequestMapping("/products")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Продукты", description = "API для управления каталогом продуктов и запчастей")
@SecurityRequirement(name = "bearerAuth")
public class ProductController {

    private final ProductService productService;

    @GetMapping
    @Operation(summary = "Получить все активные продукты")
    public ResponseEntity<List<ProductDTO>> getAllActiveProducts() {
        List<ProductDTO> products = productService.findAllActive();
        return ResponseEntity.ok(products);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Получить продукт по ID")
    public ResponseEntity<ProductDTO> getProductById(@PathVariable String id) {
        ProductDTO product = productService.findById(id);
        return ResponseEntity.ok(product);
    }

    @GetMapping("/part-number/{partNumber}")
    @Operation(summary = "Получить продукт по артикулу")
    public ResponseEntity<ProductDTO> getProductByPartNumber(@PathVariable String partNumber) {
        ProductDTO product = productService.findByPartNumber(partNumber);
        return ResponseEntity.ok(product);
    }

    @GetMapping("/category/{category}")
    @Operation(summary = "Получить продукты по категории")
    public ResponseEntity<List<ProductDTO>> getProductsByCategory(@PathVariable ProductCategory category) {
        List<ProductDTO> products = productService.findByCategory(category);
        return ResponseEntity.ok(products);
    }

    @GetMapping("/brand/{brand}")
    @Operation(summary = "Получить продукты по бренду")
    public ResponseEntity<List<ProductDTO>> getProductsByBrand(@PathVariable String brand) {
        List<ProductDTO> products = productService.findByBrand(brand);
        return ResponseEntity.ok(products);
    }

    @GetMapping("/search")
    @Operation(summary = "Поиск продуктов")
    public ResponseEntity<List<ProductDTO>> searchProducts(@RequestParam String query) {
        List<ProductDTO> products = productService.searchProducts(query);
        return ResponseEntity.ok(products);
    }

    @GetMapping("/in-stock")
    @Operation(summary = "Получить продукты в наличии")
    public ResponseEntity<List<ProductDTO>> getProductsInStock() {
        List<ProductDTO> products = productService.findInStock();
        return ResponseEntity.ok(products);
    }

    @GetMapping("/low-stock")
    @Operation(summary = "Получить продукты с низким остатком")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<ProductDTO>> getProductsLowStock() {
        List<ProductDTO> products = productService.findLowStock();
        return ResponseEntity.ok(products);
    }

    @PostMapping
    @Operation(summary = "Создать новый продукт")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ProductDTO> createProduct(@Valid @RequestBody ProductDTO productDTO) {
        ProductDTO createdProduct = productService.createProduct(productDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdProduct);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Обновить продукт")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ProductDTO> updateProduct(@PathVariable String id,
            @Valid @RequestBody ProductDTO productDTO) {
        ProductDTO updatedProduct = productService.updateProduct(id, productDTO);
        return ResponseEntity.ok(updatedProduct);
    }

    @PutMapping("/{id}/stock")
    @Operation(summary = "Обновить количество на складе")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ProductDTO> updateStock(@PathVariable String id, @RequestParam int quantity) {
        ProductDTO updatedProduct = productService.updateStock(id, quantity);
        return ResponseEntity.ok(updatedProduct);
    }

    @PutMapping("/{id}/stock/increase")
    @Operation(summary = "Увеличить количество на складе")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ProductDTO> increaseStock(@PathVariable String id, @RequestParam int quantity) {
        ProductDTO updatedProduct = productService.increaseStock(id, quantity);
        return ResponseEntity.ok(updatedProduct);
    }

    @PutMapping("/{id}/stock/decrease")
    @Operation(summary = "Уменьшить количество на складе")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ProductDTO> decreaseStock(@PathVariable String id, @RequestParam int quantity) {
        ProductDTO updatedProduct = productService.decreaseStock(id, quantity);
        return ResponseEntity.ok(updatedProduct);
    }

    @PutMapping("/{id}/toggle-status")
    @Operation(summary = "Изменить статус продукта (активен/неактивен)")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ProductDTO> toggleProductStatus(@PathVariable String id) {
        ProductDTO product = productService.toggleProductStatus(id);
        return ResponseEntity.ok(product);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Удалить продукт")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteProduct(@PathVariable String id) {
        productService.deleteProduct(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/categories")
    @Operation(summary = "Получить все категории продуктов")
    public ResponseEntity<ProductCategory[]> getAllProductCategories() {
        return ResponseEntity.ok(ProductCategory.values());
    }
}