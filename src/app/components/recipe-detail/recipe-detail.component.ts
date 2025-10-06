import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';

import { RecipeService } from '../../services/recipe.service';
import { Recipe } from '../../models/recipe.model';

@Component({
  selector: 'app-recipe-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatToolbarModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatDividerModule,
    MatListModule
  ],
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.scss'],
})
export class RecipeDetailComponent {
  recipeId = signal<string | null>(null);
  
  recipe = computed(() => {
    const id = this.recipeId();
    if (!id || this.recipeService.loading()) {
      return null;
    }
    return this.recipeService.getRecipe(id);
  });

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public recipeService: RecipeService
  ) {
    this.checkReceipeId()
  }

  checkReceipeId(): void {
    this.route.params.subscribe(params => {
      const id = params['id'];
      if (id) {
        this.recipeId.set(id);
      } else {
        this.router.navigate(['/recipes']);
      }
    });
  }

  toggleFavorite(): void {
    const recipe = this.recipe();
    if (recipe) {
      this.recipeService.toggleFavorite(recipe.id);
    }
  }

  deleteRecipe(): void {
    const recipe = this.recipe();
    if (recipe && confirm(`Are you sure you want to delete "${recipe.title}"?`)) {
      this.recipeService.deleteRecipe(recipe.id);
      this.router.navigate(['/recipes']);
    }
  }

  getImageUrl(): string {
    const recipe = this.recipe();
    return recipe?.thumbnailImage || 'assets/default-recipe.jpg';
  }

  goBack(): void {
    this.router.navigate(['/recipes']);
  }
}
