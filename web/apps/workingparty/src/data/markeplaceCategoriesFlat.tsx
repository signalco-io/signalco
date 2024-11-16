import { marketplaceCategories } from './marketplaceCategories';

export const markeplaceCategoriesFlat = marketplaceCategories.flatMap(category => category.subcategories ?? [category]);
