import { Product, ProductVariant } from "@/types";

export interface ValidationError {
  field: string;
  message: string;
  severity: 'error' | 'warning';
}

export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
  warnings: ValidationError[];
}

/**
 * STRICT PRODUCT VALIDATION SYSTEM
 * Enforces one product type per listing, proper variant structure,
 * 1:1 image mapping, and inventory integrity
 */

// Validate single product type consistency
export const validateProductType = (product: Product): ValidationError[] => {
  const errors: ValidationError[] = [];

  if (!product.productType) {
    errors.push({
      field: 'productType',
      message: 'Product type is required',
      severity: 'error'
    });
    return errors;
  }

  // If product has variants, ensure all variants are same product type
  if (product.variants && product.variants.length > 0) {
    // Check variant names/descriptions don't suggest mixed types
    const mixedTypeKeywords = {
      'ring': ['chain', 'pendant', 'hoodie', 'pants', 'tee', 'cap', 'beanie'],
      'chain': ['ring', 'hoodie', 'pants', 'tee', 'cap', 'beanie'],
      'pendant': ['ring', 'hoodie', 'pants', 'tee', 'cap', 'beanie'],
      'hoodie': ['ring', 'chain', 'pendant', 'pants', 'tee', 'cap', 'beanie'],
      'pants': ['ring', 'chain', 'pendant', 'hoodie', 'tee', 'cap', 'beanie'],
      'tee': ['ring', 'chain', 'pendant', 'hoodie', 'pants', 'cap', 'beanie'],
      'cap': ['ring', 'chain', 'pendant', 'hoodie', 'pants', 'tee', 'beanie'],
      'beanie': ['ring', 'chain', 'pendant', 'hoodie', 'pants', 'tee', 'cap']
    };

    const forbiddenKeywords = mixedTypeKeywords[product.productType] || [];
    
    product.variants.forEach((variant, index) => {
      const variantText = `${variant.name} ${variant.id}`.toLowerCase();
      forbiddenKeywords.forEach(keyword => {
        if (variantText.includes(keyword)) {
          errors.push({
            field: `variants[${index}]`,
            message: `Variant "${variant.name}" suggests mixed product type (${keyword} in ${product.productType} listing)`,
            severity: 'error'
          });
        }
      });
    });
  }

  return errors;
};

// Validate variant structure requirements
export const validateVariantStructure = (product: Product): ValidationError[] => {
  const errors: ValidationError[] = [];

  if (!product.variants || product.variants.length === 0) {
    errors.push({
      field: 'variants',
      message: 'All products must use parent + variant structure (minimum 1 variant)',
      severity: 'error'
    });
    return errors;
  }

  // Each variant must have unique ID
  const variantIds = new Set<string>();
  product.variants.forEach((variant, index) => {
    if (!variant.id || variant.id.trim() === '') {
      errors.push({
        field: `variants[${index}].id`,
        message: 'Each variant must have a unique ID/SKU',
        severity: 'error'
      });
    } else if (variantIds.has(variant.id)) {
      errors.push({
        field: `variants[${index}].id`,
        message: `Duplicate variant ID: ${variant.id}`,
        severity: 'error'
      });
    } else {
      variantIds.add(variant.id);
    }

    // Each variant must have own stock quantity
    if (variant.stockCount === undefined || variant.stockCount === null) {
      errors.push({
        field: `variants[${index}].stockCount`,
        message: `Variant "${variant.name}" is missing stock quantity`,
        severity: 'error'
      });
    }

    // Stock cannot be negative
    if (variant.stockCount < 0) {
      errors.push({
        field: `variants[${index}].stockCount`,
        message: `Variant "${variant.name}" has negative stock (${variant.stockCount})`,
        severity: 'error'
      });
    }

    // Name is required
    if (!variant.name || variant.name.trim() === '') {
      errors.push({
        field: `variants[${index}].name`,
        message: 'Variant name is required',
        severity: 'error'
      });
    }
  });

  return errors;
};

// Validate 1:1 image-to-variant mapping
export const validateImageMapping = (product: Product): ValidationError[] => {
  const errors: ValidationError[] = [];

  if (!product.variants || product.variants.length === 0) {
    return errors; // Already caught by variant structure validation
  }

  product.variants.forEach((variant, index) => {
    // Each variant must have images array
    if (!variant.images || variant.images.length === 0) {
      errors.push({
        field: `variants[${index}].images`,
        message: `Variant "${variant.name}" has no images (1:1 mapping required)`,
        severity: 'error'
      });
    }

    // Warn if variant has only 1 image (should have multiple angles)
    if (variant.images && variant.images.length === 1) {
      errors.push({
        field: `variants[${index}].images`,
        message: `Variant "${variant.name}" has only 1 image (recommend 2+ for better product showcase)`,
        severity: 'warning'
      });
    }

    // Images should not be empty strings
    if (variant.images) {
      variant.images.forEach((img, imgIndex) => {
        if (!img || img.trim() === '') {
          errors.push({
            field: `variants[${index}].images[${imgIndex}]`,
            message: `Empty image URL in variant "${variant.name}"`,
            severity: 'error'
          });
        }
      });
    }
  });

  return errors;
};

// Validate inventory integrity
export const validateInventory = (product: Product): ValidationError[] => {
  const errors: ValidationError[] = [];

  if (!product.variants || product.variants.length === 0) {
    return errors;
  }

  let hasStock = false;
  product.variants.forEach((variant, index) => {
    // Check if variant stock and inStock flag are consistent
    if (variant.stockCount > 0 && !variant.inStock) {
      errors.push({
        field: `variants[${index}].inStock`,
        message: `Variant "${variant.name}" has stock (${variant.stockCount}) but inStock=false`,
        severity: 'error'
      });
    }

    if (variant.stockCount === 0 && variant.inStock) {
      errors.push({
        field: `variants[${index}].inStock`,
        message: `Variant "${variant.name}" has zero stock but inStock=true`,
        severity: 'error'
      });
    }

    // Check disabled state
    if (variant.stockCount === 0 && !variant.disabled) {
      errors.push({
        field: `variants[${index}].disabled`,
        message: `Variant "${variant.name}" should be auto-disabled when stock=0`,
        severity: 'warning'
      });
    }

    if (variant.inStock && variant.stockCount > 0) {
      hasStock = true;
    }
  });

  // Product-level inStock should match variant availability
  if (hasStock && !product.inStock) {
    errors.push({
      field: 'inStock',
      message: 'Product has available variants but inStock=false',
      severity: 'error'
    });
  }

  if (!hasStock && product.inStock) {
    errors.push({
      field: 'inStock',
      message: 'Product has no available variants but inStock=true',
      severity: 'error'
    });
  }

  return errors;
};

// Validate cart compatibility (variant IDs only)
export const validateCartCompatibility = (product: Product): ValidationError[] => {
  const errors: ValidationError[] = [];

  // Product should not have standalone stockCount if using variants
  if (product.variants && product.variants.length > 0) {
    if (product.stockCount !== undefined) {
      errors.push({
        field: 'stockCount',
        message: 'Products with variants should not have parent-level stockCount (use variant.stockCount only)',
        severity: 'warning'
      });
    }
  }

  return errors;
};

// MASTER VALIDATION - runs all checks
export const validateProduct = (product: Product): ValidationResult => {
  const allErrors: ValidationError[] = [
    ...validateProductType(product),
    ...validateVariantStructure(product),
    ...validateImageMapping(product),
    ...validateInventory(product),
    ...validateCartCompatibility(product)
  ];

  const errors = allErrors.filter(e => e.severity === 'error');
  const warnings = allErrors.filter(e => e.severity === 'warning');

  return {
    valid: errors.length === 0,
    errors,
    warnings
  };
};

// Validate entire product catalog
export const validateCatalog = (products: Product[]): {
  valid: boolean;
  results: Map<string, ValidationResult>;
  totalErrors: number;
  totalWarnings: number;
} => {
  const results = new Map<string, ValidationResult>();
  let totalErrors = 0;
  let totalWarnings = 0;

  products.forEach(product => {
    const result = validateProduct(product);
    results.set(product.id, result);
    totalErrors += result.errors.length;
    totalWarnings += result.warnings.length;
  });

  return {
    valid: totalErrors === 0,
    results,
    totalErrors,
    totalWarnings
  };
};

// Auto-fix common issues (where safe)
export const autoFixProduct = (product: Product): Product => {
  const fixed = { ...product };

  if (fixed.variants) {
    fixed.variants = fixed.variants.map(variant => {
      const fixedVariant = { ...variant };

      // Auto-disable if stock is 0
      if (fixedVariant.stockCount === 0) {
        fixedVariant.inStock = false;
        fixedVariant.disabled = true;
      }

      // Prevent negative stock
      if (fixedVariant.stockCount < 0) {
        fixedVariant.stockCount = 0;
        fixedVariant.inStock = false;
        fixedVariant.disabled = true;
      }

      // Sync inStock with stockCount
      if (fixedVariant.stockCount > 0 && !fixedVariant.inStock) {
        fixedVariant.inStock = true;
        fixedVariant.disabled = false;
      }

      return fixedVariant;
    });

    // Update parent inStock based on variants
    const hasAnyStock = fixed.variants.some(v => v.inStock && v.stockCount > 0);
    fixed.inStock = hasAnyStock;

    // Remove parent stockCount if using variants
    if (fixed.stockCount !== undefined) {
      delete fixed.stockCount;
    }
  }

  return fixed;
};

// Runtime validation hook
export const useProductValidation = () => {
  const validateBeforeCart = (product: Product): boolean => {
    const result = validateProduct(product);
    
    if (!result.valid) {
      console.error(`Product ${product.id} failed validation:`, result.errors);
      return false;
    }
    
    if (result.warnings.length > 0) {
      console.warn(`Product ${product.id} has warnings:`, result.warnings);
    }
    
    return true;
  };

  return { validateBeforeCart };
};
