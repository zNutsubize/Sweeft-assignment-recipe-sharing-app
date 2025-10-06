export interface Recipe {
  id: string;
  title: string;
  description: string;
  ingredients: string[];
  instructions: string[];
  thumbnailImage: string;
  isFavorite?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface RecipeFormData {
  title: string;
  description: string;
  ingredients: string[];
  instructions: string[];
  thumbnailImage: string;
}
