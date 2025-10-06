import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, catchError, of } from 'rxjs';
import { Recipe, RecipeFormData } from '../models/recipe.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RecipeService {
  private readonly baseUrl = environment.API_URL;
  
  private recipesSignal = signal<Recipe[]>([]);
  private loadingSignal = signal<boolean>(false);
  private errorSignal = signal<string | null>(null);

  public recipes = this.recipesSignal.asReadonly();
  public loading = this.loadingSignal.asReadonly();
  public error = this.errorSignal.asReadonly();
  
  public favoriteRecipes = computed(() => 
    this.recipes().filter(recipe => recipe.isFavorite)
  );

  constructor(private http: HttpClient) {
  }

   loadRecipes(): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    
    this.http.get<Recipe[]>(this.baseUrl).subscribe({
      next: (recipes) => {
        this.recipesSignal.set(recipes);
        this.loadingSignal.set(false);
      },
      error: (error) => {
        console.error('Error loading recipes:', error);
        this.errorSignal.set('Failed to load recipes');
        this.loadingSignal.set(false);
      }
    });
  }

  getRecipe(id: string): Recipe | undefined {
    return this.recipes().find(recipe => recipe.id == id);
  }

  addRecipe(recipeData: RecipeFormData): void {
    const newRecipe: Recipe = {
      id: Date.now().toString(),
      ...recipeData,
      isFavorite: false,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.http.post<Recipe>(this.baseUrl, newRecipe).subscribe({
      next: (recipe) => {
        this.recipesSignal.update(recipes => [...recipes, recipe]);
      },
      error: (error) => {
        console.error('Error adding recipe:', error);
        this.errorSignal.set('Failed to add recipe');
      }
    });
  }

  updateRecipe(id: string, recipeData: RecipeFormData): void {
    const updatedRecipe = {
      ...recipeData,
      id,
      updatedAt: new Date()
    };

    this.http.put<Recipe>(`${this.baseUrl}/${id}`, updatedRecipe).subscribe({
      next: (recipe) => {
        this.recipesSignal.update(recipes => 
          recipes.map(r => r.id === id ? recipe : r)
        );
      },
      error: (error) => {
        console.error('Error updating recipe:', error);
        this.errorSignal.set('Failed to update recipe');
      }
    });
  }

  deleteRecipe(id: string): void {
    this.http.delete<void>(`${this.baseUrl}/${id}`).subscribe({
      next: () => {
        this.recipesSignal.update(recipes => 
          recipes.filter(recipe => recipe.id !== id)
        );
      },
      error: (error) => {
        console.error('Error deleting recipe:', error);
        this.errorSignal.set('Failed to delete recipe');
      }
    });
  }

  toggleFavorite(id: string): void {
    const recipe = this.getRecipe(id);
    if (!recipe) return;

    const updatedRecipe = {
      ...recipe,
      isFavorite: !recipe.isFavorite,
      updatedAt: new Date()
    };

    this.http.put<Recipe>(`${this.baseUrl}/${id}`, updatedRecipe).subscribe({
      next: (recipe) => {
        this.recipesSignal.update(recipes => 
          recipes.map(r => r.id === id ? recipe : r)
        );
      },
      error: (error) => {
        console.error('Error toggling favorite:', error);
        this.errorSignal.set('Failed to update favorite');
      }
    });
  }

  searchRecipes(query: string): Recipe[] {
    if (!query.trim()) {
      return this.recipes();
    }
    
    const lowercaseQuery = query.toLowerCase();
    return this.recipes().filter(recipe => 
      recipe.title.toLowerCase().includes(lowercaseQuery) ||
      recipe.description.toLowerCase().includes(lowercaseQuery) ||
      recipe.ingredients.some(ingredient => 
        ingredient.toLowerCase().includes(lowercaseQuery)
      )
    );
  }
}
