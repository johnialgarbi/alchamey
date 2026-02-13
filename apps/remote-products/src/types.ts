type Product = {
  id: string; 
  name: string; 
  price: number; 
  image: string;
  rating: number; 
  category: string; 
  description: string;
};

type ProductsFilterType = {
  search: string;
  category: string;
  sortByPrice: 'asc' | 'desc' | '';
  visibleCount: number;
};

export type { Product, ProductsFilterType };