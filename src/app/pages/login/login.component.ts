import { Router, RouterLink } from '@angular/router';
import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  ElementRef,
  inject,
  signal,
  ViewChild,
  WritableSignal,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { AuthService } from '../../core/services/auth/auth.service';
import { CommonModule } from '@angular/common';
import { flush } from '@angular/core/testing';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LoginComponent {
  private readonly formBuilder = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  isPasswordVisible: WritableSignal<boolean> = signal(false);
  isConfirmPasswordVisible: WritableSignal<boolean> = signal(false);
  showPasswordToggle: WritableSignal<boolean> = signal(false);
  showConfirmPasswordToggle: WritableSignal<boolean> = signal(false);
  msgError: WritableSignal<string> = signal('');
  successeded: WritableSignal<string> = signal('');
  isLoading: WritableSignal<boolean> = signal(false);
  userData: any;
  @ViewChild('termInput') myTermInput!: ElementRef;

  loginForm: FormGroup = this.formBuilder.group({
    email: [null, [Validators.required, Validators.email]],
    password: [
      null,
      [Validators.required, Validators.pattern(/^[A-Z][a-z0-9]{7,}$/)],
    ],
  });

  //Submit Form

  submitForm(): void {
    this.isLoading.set(true);

    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value).subscribe({
        next: (res) => {
          console.log(res);

          if (res.message === 'success') {
            this.successeded.set(res.message);

            setTimeout(() => {
              localStorage.setItem('userToken', res.token);
              this.userData = this.authService.getUsersData();
              this.router.navigate(['/home']);
            }, 5000);
          }
          this.isLoading.set(false);
          this.msgError.set('');
        },
        error: (err) => {
          console.log(err);
          this.msgError.set(err.error.message);
          this.isLoading.set(false);
        },
      });
    } else {
      this.loginForm?.setErrors({ mismatch: true });
      this.loginForm.markAllAsTouched();
      this.isLoading.set(false);
    }
  }

  // The Toggle of shown password

  toggleVisibility() {
    this.isPasswordVisible.update((value) => !value);
  }

  onInput(event: Event) {
    const input = event.target as HTMLInputElement;
    this.showPasswordToggle.set(input.value.length > 0);
  }
}
