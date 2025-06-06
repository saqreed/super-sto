package ru.supersto.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import ru.supersto.dto.ProductDTO;
import ru.supersto.entity.Product;
import ru.supersto.entity.ProductCategory;
import ru.supersto.exception.ResourceNotFoundException;
import ru.supersto.exception.BusinessException;
import ru.supersto.repository.ProductRepository;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ProductService {

    private final ProductRepository productRepository;
    private static final int LOW_STOCK_THRESHOLD = 10;

    @Cacheable(value = "products", key = "#productId")
    public ProductDTO findById(String productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Товар не найден с ID: " + productId));
        return mapToProductDTO(product);
    }

    @Cacheable(value = "products", key = "'all'")
    public List<ProductDTO> findAllActive() {
        List<Product> products = productRepository.findAllActive();
        return products.stream()
                .map(this::mapToProductDTO)
                .collect(Collectors.toList());
    }

    public ProductDTO findByPartNumber(String partNumber) {
        Product product = productRepository.findByPartNumber(partNumber)
                .orElseThrow(() -> new ResourceNotFoundException("Продукт не найден с артикулом: " + partNumber));
        return mapToProductDTO(product);
    }

    @Cacheable(value = "products", key = "'category-' + #category")
    public List<ProductDTO> findByCategory(ProductCategory category) {
        List<Product> products = productRepository.findByCategory(category);
        return products.stream()
                .map(this::mapToProductDTO)
                .collect(Collectors.toList());
    }

    public List<ProductDTO> findByBrand(String brand) {
        return productRepository.findByBrand(brand).stream()
                .map(this::mapToProductDTO)
                .collect(Collectors.toList());
    }

    public List<ProductDTO> searchProducts(String searchTerm) {
        return productRepository.searchByNameAndDescription(searchTerm).stream()
                .map(this::mapToProductDTO)
                .collect(Collectors.toList());
    }

    public List<ProductDTO> findInStock() {
        return productRepository.findInStock().stream()
                .map(this::mapToProductDTO)
                .collect(Collectors.toList());
    }

    public List<ProductDTO> findLowStock() {
        return productRepository.findLowStock(LOW_STOCK_THRESHOLD).stream()
                .map(this::mapToProductDTO)
                .collect(Collectors.toList());
    }

    @CacheEvict(value = "products", allEntries = true)
    public ProductDTO createProduct(ProductDTO productDTO) {
        // Проверяем уникальность артикула
        Optional<Product> existingProduct = productRepository.findByPartNumber(productDTO.getPartNumber());
        if (existingProduct.isPresent()) {
            throw new BusinessException("Продукт с артикулом " + productDTO.getPartNumber() + " уже существует");
        }

        Product product = Product.builder()
                .name(productDTO.getName())
                .description(productDTO.getDescription())
                .price(productDTO.getPrice())
                .quantity(productDTO.getQuantity())
                .category(productDTO.getCategory())
                .brand(productDTO.getBrand())
                .partNumber(productDTO.getPartNumber())
                .isActive(true)
                .build();

        product.prePersist();
        Product savedProduct = productRepository.save(product);
        log.info("Создан новый продукт: {} (артикул: {})", savedProduct.getName(), savedProduct.getPartNumber());

        return mapToProductDTO(savedProduct);
    }

    @CacheEvict(value = "products", key = "#productId")
    public ProductDTO updateProduct(String productId, ProductDTO productDTO) {
        Product existingProduct = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Продукт не найден с ID: " + productId));

        // Проверяем уникальность артикула при изменении
        if (!existingProduct.getPartNumber().equals(productDTO.getPartNumber())) {
            Optional<Product> productWithSamePartNumber = productRepository
                    .findByPartNumber(productDTO.getPartNumber());
            if (productWithSamePartNumber.isPresent()) {
                throw new BusinessException("Продукт с артикулом " + productDTO.getPartNumber() + " уже существует");
            }
        }

        existingProduct.setName(productDTO.getName());
        existingProduct.setDescription(productDTO.getDescription());
        existingProduct.setPrice(productDTO.getPrice());
        existingProduct.setQuantity(productDTO.getQuantity());
        existingProduct.setCategory(productDTO.getCategory());
        existingProduct.setBrand(productDTO.getBrand());
        existingProduct.setPartNumber(productDTO.getPartNumber());

        if (productDTO.getIsActive() != null) {
            existingProduct.setIsActive(productDTO.getIsActive());
        }

        Product updatedProduct = productRepository.save(existingProduct);
        log.info("Продукт {} обновлен", updatedProduct.getName());
        return mapToProductDTO(updatedProduct);
    }

    public ProductDTO updateStock(String id, int newQuantity) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Продукт не найден с ID: " + id));

        int oldQuantity = product.getQuantity();
        product.setQuantity(newQuantity);

        Product updatedProduct = productRepository.save(product);
        log.info("Количество продукта {} изменено с {} на {}", product.getName(), oldQuantity, newQuantity);

        return mapToProductDTO(updatedProduct);
    }

    public ProductDTO increaseStock(String id, int quantity) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Продукт не найден с ID: " + id));

        product.setQuantity(product.getQuantity() + quantity);
        Product updatedProduct = productRepository.save(product);
        log.info("Количество продукта {} увеличено на {}. Текущее количество: {}",
                product.getName(), quantity, updatedProduct.getQuantity());

        return mapToProductDTO(updatedProduct);
    }

    public ProductDTO decreaseStock(String id, int quantity) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Продукт не найден с ID: " + id));

        if (product.getQuantity() < quantity) {
            throw new BusinessException("Недостаточно товара на складе. Доступно: " + product.getQuantity());
        }

        product.setQuantity(product.getQuantity() - quantity);
        Product updatedProduct = productRepository.save(product);
        log.info("Количество продукта {} уменьшено на {}. Осталось: {}",
                product.getName(), quantity, updatedProduct.getQuantity());

        return mapToProductDTO(updatedProduct);
    }

    public ProductDTO toggleProductStatus(String id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Продукт не найден с ID: " + id));

        product.setIsActive(!product.getIsActive());
        Product updatedProduct = productRepository.save(product);
        log.info("Статус продукта {} изменен на: {}", product.getName(), product.getIsActive());
        return mapToProductDTO(updatedProduct);
    }

    public void deleteProduct(String id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Продукт не найден с ID: " + id));

        productRepository.delete(product);
        log.info("Продукт {} удален", product.getName());
    }

    private ProductDTO mapToProductDTO(Product product) {
        return ProductDTO.builder()
                .id(product.getId())
                .name(product.getName())
                .description(product.getDescription())
                .price(product.getPrice())
                .quantity(product.getQuantity())
                .stockQuantity(product.getQuantity())
                .category(product.getCategory())
                .brand(product.getBrand())
                .partNumber(product.getPartNumber())
                .isActive(product.getIsActive())
                .rating(4.5)
                .reviewCount(0)
                .inStock(product.getQuantity() > 0)
                .lowStock(product.getQuantity() <= LOW_STOCK_THRESHOLD && product.getQuantity() > 0)
                .build();
    }
}