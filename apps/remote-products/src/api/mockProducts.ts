import { faker } from '@faker-js/faker';

const categories = ['home', 'kitchen', 'apparel', 'outdoors', 'office', 'electronics'];

/**
 * Server-safe product data generator (no MSW/React).
 * Used by dev API middleware and by MSW handlers.
 */
export function generateProducts(count: number) {
  return Array.from({ length: count }, (_, i) => ({
    id: String(i + 1),
    name: faker.commerce.productName(),
    price: Number(faker.commerce.price({ min: 5, max: 200, dec: 2 })),
    category: faker.helpers.arrayElement(categories),
    rating: Number(faker.number.float({ min: 3.5, max: 5, fractionDigits: 1 })),
    image: `https://prd.place/400?id=${faker.number.int({ min: 1, max: 45 })}`,
    description: faker.commerce.productDescription(),
  }));
}
