import { Product } from "@/types";
import { validateProduct, autoFixProduct, ValidationResult } from "./productValidation";

/**
 * ADMIN PRODUCT UPLOAD & PUBLISH VALIDATION
 * Blocks invalid products from being published
 */

export interface PublishBlocker {
  canPublish: boolean;
  blockReasons: string[];
  requiredFixes: string[];
}

// Check if product can be published
export const validateForPublish = (product: Product): PublishBlocker => {
  const validation = validateProduct(product);
  const blockReasons: string[] = [];
  const requiredFixes: string[] = [];

  // CRITICAL: Block if validation errors exist
  if (validation.errors.length > 0) {
    validation.errors.forEach(error => {
      blockReasons.push(`${error.field}: ${error.message}`);
    });
  }

  // CRITICAL: Ensure variant structure exists
  if (!product.variants || product.variants.length === 0) {
    requiredFixes.push('Add at least 1 variant with unique ID, images, and stock quantity');
  }

  // CRITICAL: Check variant count vs image mapping
  if (product.variants && product.variants.length > 0) {
    const variantsWithoutImages = product.variants.filter(v => !v.images || v.images.length === 0);
    if (variantsWithoutImages.length > 0) {
      requiredFixes.push(`${variantsWithoutImages.length} variant(s) missing images (1:1 mapping required)`);
    }

    const variantsWithMissingStock = product.variants.filter(v => v.stockCount === undefined || v.stockCount === null);
    if (variantsWithMissingStock.length > 0) {
      requiredFixes.push(`${variantsWithMissingStock.length} variant(s) missing stock quantity`);
    }
  }

  // CRITICAL: Prevent mixed product types
  if (!product.productType) {
    requiredFixes.push('Specify product type (ring, chain, hoodie, etc.)');
  }

  return {
    canPublish: blockReasons.length === 0 && requiredFixes.length === 0,
    blockReasons,
    requiredFixes
  };
};

// Upload validation - reject invalid uploads
export const validateProductUpload = (productData: Partial<Product>): {
  accepted: boolean;
  rejectionReasons: string[];
  autoFixable: boolean;
  fixedProduct?: Product;
} => {
  const rejectionReasons: string[] = [];

  // Minimum required fields
  if (!productData.name || productData.name.trim() === '') {
    rejectionReasons.push('Product name is required');
  }

  if (!productData.productType) {
    rejectionReasons.push('Product type is required (ring, chain, hoodie, pants, tee, cap, beanie)');
  }

  if (!productData.price || productData.price <= 0) {
    rejectionReasons.push('Valid price is required');
  }

  // Require variants
  if (!productData.variants || productData.variants.length === 0) {
    rejectionReasons.push('At least 1 variant is required (parent + variant structure mandatory)');
  }

  // Check for mixed product types in variant names
  if (productData.productType && productData.variants) {
    const mixedTypeDetected = productData.variants.some(variant => {
      const variantText = `${variant.name} ${variant.id || ''}`.toLowerCase();
      const currentType = productData.productType!.toLowerCase();
      
      // Check if variant name contains OTHER product type keywords
      const otherTypes = ['ring', 'chain', 'pendant', 'hoodie', 'pants', 'tee', 'cap', 'beanie']
        .filter(type => type !== currentType);
      
      return otherTypes.some(type => variantText.includes(type));
    });

    if (mixedTypeDetected) {
      rejectionReasons.push('Detected mixed product types in variants (only one type per listing allowed)');
    }
  }

  // Try auto-fix if only minor issues
  const autoFixable = rejectionReasons.length === 0;
  let fixedProduct: Product | undefined;

  if (autoFixable && productData.id) {
    fixedProduct = autoFixProduct(productData as Product);
  }

  return {
    accepted: rejectionReasons.length === 0,
    rejectionReasons,
    autoFixable,
    fixedProduct
  };
};

// Generate validation report for admin dashboard
export const generateValidationReport = (products: Product[]): {
  totalProducts: number;
  validProducts: number;
  invalidProducts: number;
  productsWithWarnings: number;
  criticalIssues: Array<{ productId: string; productName: string; issue: string }>;
  recommendations: string[];
} => {
  const criticalIssues: Array<{ productId: string; productName: string; issue: string }> = [];
  const recommendations: string[] = [];
  
  let validCount = 0;
  let invalidCount = 0;
  let warningsCount = 0;

  products.forEach(product => {
    const validation = validateProduct(product);
    
    if (validation.valid) {
      validCount++;
    } else {
      invalidCount++;
      validation.errors.forEach(error => {
        criticalIssues.push({
          productId: product.id,
          productName: product.name,
          issue: `${error.field}: ${error.message}`
        });
      });
    }

    if (validation.warnings.length > 0) {
      warningsCount++;
    }
  });

  // Generate recommendations
  if (invalidCount > 0) {
    recommendations.push(`Fix ${invalidCount} product(s) with validation errors before publishing`);
  }

  if (warningsCount > 0) {
    recommendations.push(`Review ${warningsCount} product(s) with warnings to improve quality`);
  }

  const productsWithSingleImages = products.filter(p => 
    p.variants?.some(v => v.images && v.images.length === 1)
  ).length;

  if (productsWithSingleImages > 0) {
    recommendations.push(`Add multiple images to ${productsWithSingleImages} product variant(s) for better showcase`);
  }

  return {
    totalProducts: products.length,
    validProducts: validCount,
    invalidProducts: invalidCount,
    productsWithWarnings: warningsCount,
    criticalIssues,
    recommendations
  };
};
