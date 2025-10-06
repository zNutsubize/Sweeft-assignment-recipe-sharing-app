import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormArray } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { RecipeService } from '../../services/recipe.service';
import { Recipe, RecipeFormData } from '../../models/recipe.model';

@Component({
  selector: 'app-recipe-form',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatToolbarModule,
    MatProgressSpinnerModule,
    MatSnackBarModule
  ],
  templateUrl: './recipe-form.component.html',
  styleUrls: ['./recipe-form.component.scss']
})
export class RecipeFormComponent {
  recipeId = signal<string | null>(null);
  isSubmitting = signal(false);
  
  isEditMode = computed(() => this.recipeId() !== null);
  
  recipeForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    public recipeService: RecipeService,
    private snackBar: MatSnackBar
  ) {
    this.recipeForm = this.createForm();
    
    this.checkReceipeId();
  }

  checkReceipeId(){
    this.route.params.subscribe(params => {
      const id = params['id'];
      if (id) {
        this.recipeId.set(id);
        this.loadRecipe(id);
      }
    });
  }

  private createForm(): FormGroup {
    return this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      description: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(500)]],
      thumbnailImage: ['', [Validators.required]],
      ingredients: this.fb.array([
        this.fb.control('', [Validators.required, Validators.minLength(2)])
      ]),
      instructions: this.fb.array([
        this.fb.control('', [Validators.required, Validators.minLength(5)])
      ])
    });
  }

  private loadRecipe(id: string): void {
    const recipe = this.recipeService.getRecipe(id);
    if (recipe) {
      this.populateForm(recipe);
    } else {
      this.router.navigate(['/recipes']);
    }
  }

  private populateForm(recipe: Recipe): void {
    this.clearFormArrays();

    this.recipeForm.patchValue({
      title: recipe.title,
      description: recipe.description,
      thumbnailImage: recipe.thumbnailImage
    });

    recipe.ingredients.forEach(ingredient => {
      this.addIngredient(ingredient);
    });

    recipe.instructions.forEach(instruction => {
      this.addInstruction(instruction);
    });
  }

  private clearFormArrays(): void {
    while (this.ingredients.length !== 0) {
      this.ingredients.removeAt(0);
    }
    while (this.instructions.length !== 0) {
      this.instructions.removeAt(0);
    }
  }

  get ingredients(): FormArray {
    return this.recipeForm.get('ingredients') as FormArray;
  }

  get instructions(): FormArray {
    return this.recipeForm.get('instructions') as FormArray;
  }

  addIngredient(value: string = ''): void {
    this.ingredients.push(this.fb.control(value, [Validators.required, Validators.minLength(2)]));
  }

  removeIngredient(index: number): void {
    if (this.ingredients.length > 1) {
      this.ingredients.removeAt(index);
    }
  }

  addInstruction(value: string = ''): void {
    this.instructions.push(this.fb.control(value, [Validators.required, Validators.minLength(5)]));
  }

  removeInstruction(index: number): void {
    if (this.instructions.length > 1) {
      this.instructions.removeAt(index);
    }
  }

  onSubmit(): void {
    if (this.recipeForm.valid && !this.isSubmitting()) {
      this.isSubmitting.set(true);
      
      const formData: RecipeFormData = {
        title: this.recipeForm.value.title.trim(),
        description: this.recipeForm.value.description.trim(),
        thumbnailImage: this.recipeForm.value.thumbnailImage.trim(),
        ingredients: this.recipeForm.value.ingredients
          .map((ingredient: string) => ingredient.trim())
          .filter((ingredient: string) => ingredient.length > 0),
        instructions: this.recipeForm.value.instructions
          .map((instruction: string) => instruction.trim())
          .filter((instruction: string) => instruction.length > 0)
      };

      if (this.isEditMode()) {
        this.recipeService.updateRecipe(this.recipeId()!, formData);
        this.snackBar.open('Recipe updated successfully!', 'Close', { duration: 3000 });
        this.router.navigate(['/recipes', this.recipeId()]);
      } else {
        this.recipeService.addRecipe(formData);
        this.snackBar.open('Recipe created successfully!', 'Close', { duration: 3000 });
        this.router.navigate(['/recipes']);
      }
      
      this.isSubmitting.set(false);
    } else {
      this.markFormGroupTouched();
    }
  }

  private markFormGroupTouched(): void {
    Object.keys(this.recipeForm.controls).forEach(key => {
      const control = this.recipeForm.get(key);
      control?.markAsTouched();
      
      if (control instanceof FormArray) {
        control.controls.forEach(arrayControl => {
          arrayControl.markAsTouched();
        });
      }
    });
  }

  getErrorMessage(controlName: string, index?: number): string {
    const control = index !== undefined 
      ? (this.recipeForm.get(controlName) as FormArray).at(index)
      : this.recipeForm.get(controlName);

    if (control?.hasError('required')) {
      return `${this.getFieldLabel(controlName)} is required`;
    }
    if (control?.hasError('minlength')) {
      const requiredLength = control.errors?.['minlength'].requiredLength;
      return `${this.getFieldLabel(controlName)} must be at least ${requiredLength} characters`;
    }
    if (control?.hasError('maxlength')) {
      const requiredLength = control.errors?.['maxlength'].requiredLength;
      return `${this.getFieldLabel(controlName)} must not exceed ${requiredLength} characters`;
    }
    if (control?.hasError('pattern')) {
      return 'Please upload a valid image file';
    }
    return '';
  }

  private getFieldLabel(controlName: string): string {
    const labels: { [key: string]: string } = {
      title: 'Title',
      description: 'Description',
      thumbnailImage: 'Image',
      ingredients: 'Ingredient',
      instructions: 'Instruction'
    };
    return labels[controlName] || controlName;
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input?.files && input.files.length ? input.files[0] : null;
    if (!file) {
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = typeof reader.result === 'string' ? reader.result : '';
      this.recipeForm.get('thumbnailImage')?.setValue(dataUrl);
      this.recipeForm.get('thumbnailImage')?.markAsDirty();
      this.recipeForm.get('thumbnailImage')?.updateValueAndValidity();
    };
    reader.onerror = () => {
      this.snackBar.open('Failed to read image file.', 'Close', { duration: 3000 });
    };
    reader.readAsDataURL(file);
  }

  goBack(): void {
    if (this.isEditMode() && this.recipeId()) {
      this.router.navigate(['/recipes', this.recipeId()]);
    } else {
      this.router.navigate(['/recipes']);
    }
  }
}
