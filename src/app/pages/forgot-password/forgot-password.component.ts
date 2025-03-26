import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  inject,
  signal,
  WritableSignal,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../core/services/auth/auth.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ForgotPasswordComponent {
  private readonly formBuilder = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  isPasswordVisible: WritableSignal<boolean> = signal(false);
  isConfirmPasswordVisible: WritableSignal<boolean> = signal(false);
  showPasswordToggle: WritableSignal<boolean> = signal(false);
  showConfirmPasswordToggle: WritableSignal<boolean> = signal(false);
  step: WritableSignal<number> = signal(1);
  successMsg: WritableSignal<string> = signal('');
  msgErr: WritableSignal<string> = signal('');
  myToken: string = '';
  isLoading: WritableSignal<boolean> = signal(false);

  verifyEmailForm: FormGroup = this.formBuilder.group({
    email: [null, [Validators.required, Validators.email]],
  });

  verifyCodeForm: FormGroup = this.formBuilder.group({
    resetCode: [null, [Validators.required, Validators.pattern(/^\w{4,6}$/)]],
  });

  resetPasswordForm: FormGroup = this.formBuilder.group({
    email: [null, [Validators.required, Validators.email]],
    newPassword: [
      null,
      [Validators.required, Validators.pattern(/^[A-Z][a-z0-9]{7,}$/)],
    ],
  });

  verifyEmailSubmit(): void {
    if (this.verifyEmailForm.valid) {
      this.isLoading.set(true);
      this.authService.verifyEmail(this.verifyEmailForm.value).subscribe({
        next: (res) => {
          if (res.statusMsg === 'success') {
            setTimeout(() => {
              this.step.set(2);
            }, 5000);
          }
          this.successMsg.set(res.message);
          this.msgErr.set('');
          this.isLoading.set(false);
        },
        error: (err) => {
          this.msgErr.set(err.error.message);
          this.isLoading.set(false);
        },
      });
    }
  }

  verifyCodeSubmit(): void {
    if (this.verifyCodeForm.valid) {
      this.isLoading.set(true);

      this.authService.verifyCode(this.verifyCodeForm.value).subscribe({
        next: (res) => {
          console.log(res);
          if (res.status === 'Success') {
            setTimeout(() => {
              this.step.set(3);
            }, 5000);
            this.successMsg.set(res.status);
            this.msgErr.set('');
            this.isLoading.set(false);
          }
        },
        error: (err) => {
          console.log(err);
          this.msgErr.set(err.error.message);
          this.isLoading.set(false);
        },
      });
    }
  }

  newPasswordSubmit(): void {
    if (this.resetPasswordForm.valid) {
      this.isLoading.set(true);
      console.log('hallo New Password');
      console.log('Sending Data:', this.resetPasswordForm.value);
      this.authService.resetPassword(this.resetPasswordForm.value).subscribe({
        next: (res) => {
          console.log(res);
          if (res.token) {
            this.myToken = res.token;
            console.log(this.myToken);
            setTimeout(() => {
              this.router.navigate(['/login']);
            }, 5000);
            this.successMsg.set(res.status);
            this.msgErr.set('');
            this.isLoading.set(false);
          }
        },
        error: (err) => {
          console.log(err);
          this.msgErr.set(err.error.message);
          this.isLoading.set(false);
        },
      });
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
