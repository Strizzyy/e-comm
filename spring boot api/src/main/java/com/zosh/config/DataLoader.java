package com.zosh.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.zosh.modal.Category;
import com.zosh.modal.Product;
import com.zosh.modal.Size;
import com.zosh.repository.CategoryRepository;
import com.zosh.repository.ProductRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.io.File;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

@Component
public class DataLoader implements CommandLineRunner {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final ObjectMapper objectMapper;

    public DataLoader(ProductRepository productRepository, CategoryRepository categoryRepository, ObjectMapper objectMapper) {
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
        this.objectMapper = objectMapper;
    }

    @Override
    public void run(String... args) throws Exception {
        // Check if products already exist to avoid duplicate data on every run
        if (productRepository.count() == 0) {
            System.out.println("Loading product data...");
            loadProductData();
            System.out.println("Product data loaded.");
        } else {
            System.out.println("Products already exist in the database. Skipping data loading.");
        }
    }

    private void loadProductData() {
        // Correct the path to the frontend data directory relative to the Spring Boot application's working directory
        String dataDirPath = "../react/src/Data/";
        File dataDir = new File(dataDirPath);

        if (!dataDir.exists() || !dataDir.isDirectory()) {
            System.err.println("Frontend data directory not found: " + dataDirPath);
            return;
        }

        // List of data files to load (add more files here as needed)
        String[] dataFiles = {
                "Gouns/gouns.js",
                "Saree/page1.js",
                "Saree/lenghaCholiPage2.js",
                "Women/LenghaCholi.js",
                "Women/LenghaCholi.json",
                "Men/men_kurta.js",
                "Men/men_jeans.json",
                "Men/men_shirt.json",
                "Men/mensKurta.json",
                "dress/page1.js",
                "Kurta/kurta.js",
                "pants/men_page1.js",
                "shoes.js",
                "Women/women_dress.json",
                "Women/women_jeans.json",
                "Women/women_top.json"
        };

        for (String filePath : dataFiles) {
            try {
                String fullPath = dataDirPath + filePath;
                String fileContent = new String(Files.readAllBytes(Paths.get(fullPath)));
                List<Map<String, Object>> productsData = parseFileData(fileContent, filePath);

                String categoryName = getCategoryNameFromPath(filePath);
                Category category = findOrCreateCategory(categoryName);

                for (Map<String, Object> productData : productsData) {
                    Product product = mapProductDataToEntity(productData, category);
                    productRepository.save(product);
                }
                System.out.println("Loaded data from: " + filePath);

            } catch (Exception e) {
                System.err.println("Error loading data from " + filePath + ": " + e.getMessage());
                // e.printStackTrace(); // Uncomment for detailed error
            }
        }
    }

    private List<Map<String, Object>> parseFileData(String fileContent, String filePath) throws Exception {
        if (filePath.endsWith(".js")) {
            // For .js files exporting an array like 'export const arrayName = [...]'
            int startIndex = fileContent.indexOf('[');
            int endIndex = fileContent.lastIndexOf(']');
            if (startIndex != -1 && endIndex != -1 && endIndex > startIndex) {
                String jsonArrayString = fileContent.substring(startIndex, endIndex + 1);
                return objectMapper.readValue(jsonArrayString, List.class);
            } else {
                throw new IllegalArgumentException("Could not find JSON array in .js file: " + filePath);
            }
        } else if (filePath.endsWith(".json")) {
            // For .json files
            return objectMapper.readValue(fileContent, List.class);
        } else {
            throw new IllegalArgumentException("Unsupported file type: " + filePath);
        }
    }

    private String getCategoryNameFromPath(String filePath) {
        // Extract category name from the directory path
        String[] parts = filePath.split("/");
        if (parts.length > 1) {
            // Use the directory name as the category
            return parts[0];
        }
        // For files directly in the Data directory, use the file name without extension
        String fileName = new File(filePath).getName();
        int dotIndex = fileName.lastIndexOf('.');
        return (dotIndex == -1) ? fileName : fileName.substring(0, dotIndex);
    }

    private Category findOrCreateCategory(String categoryName) {
        Category category = categoryRepository.findByName(categoryName);
        if (category == null) {
            // Create a simple top-level category if it doesn't exist
            category = new Category();
            category.setName(categoryName);
            category.setLevel(1); // Assuming top level for simplicity
            // Parent category is null for top level
            category = categoryRepository.save(category);
        }
        return category;
    }


    private Product mapProductDataToEntity(Map<String, Object> productData, Category category) {
        Product product = new Product();
        // Assuming keys in Map match frontend data structure
        product.setTitle((String) productData.get("title"));
        product.setBrand((String) productData.get("brand"));
        product.setColor((String) productData.get("color"));
        product.setImageUrl((String) productData.get("image"));
        product.setDescription((String) productData.get("title2")); // Using title2 as description if description is missing

        // Parse price, discountedPrice, discountPersent
        try {
            String sellingPriceStr = (String) productData.get("selling_price");
            if (sellingPriceStr != null) {
                product.setDiscountedPrice(parsePrice(sellingPriceStr));
            }
            String priceStr = (String) productData.get("price");
            if (priceStr != null) {
                product.setPrice(parsePrice(priceStr));
            }
            String discountStr = (String) productData.get("disscount");
             if (discountStr != null && discountStr.contains("%")) {
                product.setDiscountPersent(parseDiscount(discountStr));
            }
        } catch (NumberFormatException e) {
            System.err.println("Error parsing price or discount for product: " + productData.get("title") + " - " + e.getMessage());
            // Set to 0 or handle as needed
            product.setPrice(0);
            product.setDiscountedPrice(0);
            product.setDiscountPersent(0);
        }


        // Set quantity (assuming a default quantity if not present or if size is empty)
        // The frontend data doesn't have a quantity field per product object in the example
        // Setting a default quantity for all loaded products
        product.setQuantity(100); // Default quantity

        // Handle sizes (frontend data has a simple 'size' field, often empty)
        // Mapping to backend Set<Size> requires creating Size objects
        Set<Size> sizes = new HashSet<>();
        String sizeStr = (String) productData.get("size");
        if (sizeStr != null && !sizeStr.isEmpty()) {
             // If a size is specified, add it
             Size size = new Size();
             size.setName(sizeStr);
             size.setQuantity(product.getQuantity()); // Use product quantity for this size
             sizes.add(size);
        } else {
            // Add default sizes if no specific size is mentioned
            sizes.add(new Size("S", product.getQuantity()));
            sizes.add(new Size("M", product.getQuantity()));
            sizes.add(new Size("L", product.getQuantity()));
            sizes.add(new Size("XL", product.getQuantity()));
        }
        product.setSizes(sizes);


        product.setCategory(category);
        product.setCreatedAt(LocalDateTime.now());
        product.setNumRatings(0); // Default numRatings
        // ratings and reviews lists are initialized in the Product entity

        return product;
    }

    private int parsePrice(String priceStr) {
        if (priceStr == null || priceStr.isEmpty()) {
            return 0;
        }
        // Remove currency symbols, commas, and parse as integer
        return Integer.parseInt(priceStr.replace("₹", "").replace(",", "").trim());
    }

     private int parseDiscount(String discountStr) {
        if (discountStr == null || discountStr.isEmpty() || !discountStr.contains("%")) {
            return 0;
        }
        // Remove "% off" and parse as integer
        return Integer.parseInt(discountStr.replace("% off", "").trim());
    }
}