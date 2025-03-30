import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  ElementRef,
  inject,
  signal,
  ViewChild,
  ViewEncapsulation,
  WritableSignal,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
  ReactiveFormsModule,
} from '@angular/forms';
import { AuthService } from '../../core/services/auth/auth.service';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { ScrollPanelModule } from 'primeng/scrollpanel';


@Component({
  selector: 'app-sign-up',
  imports: [CommonModule, ReactiveFormsModule, RouterLink , ScrollPanelModule],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  encapsulation: ViewEncapsulation.None,
})
export class SignUpComponent {
  private readonly formBuilder = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  isPasswordVisible: WritableSignal<boolean> = signal(false);
  isConfirmPasswordVisible: WritableSignal<boolean> = signal(false);
  showPasswordToggle: WritableSignal<boolean> = signal(false);
  showConfirmPasswordToggle: WritableSignal<boolean> = signal(false);
  termMsg: WritableSignal<boolean> = signal(false);
  successeded: WritableSignal<string> = signal('');
  msgErr: WritableSignal<string> = signal('');
  isLoading: WritableSignal<boolean> = signal(false);
  @ViewChild('termInput') myTermInput!: ElementRef;

  signUpForm: FormGroup = this.formBuilder.group(
    {
      name: [
        null,
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(25),
        ],
      ],
      email: [null, [Validators.required, Validators.email]],
      password: [
        null,
        [Validators.required, Validators.pattern(/^[A-Z][a-z0-9]{7,}$/)],
      ],
      rePassword: [null, [Validators.required]],
      phone: [
        null,
        [Validators.required, Validators.pattern(/^01(0|1|2|5)\d{8}$/)],
      ],
    },
    { validators: [this.confirmPassword] }
  );

  confirmPassword(group: AbstractControl) {
    const password = group.get('password')?.value;
    const rePassword = group.get('rePassword')?.value;

    return password === rePassword ? null : { mismatch: true };
  }

  //Submit Form

  submitForm(): void {
    if (this.signUpForm.valid) {
      if (this.myTermInput.nativeElement.checked) {
        this.isLoading.set(true);
        this.authService.signUp(this.signUpForm.value).subscribe({
          next: (res) => {
            console.log(res);
            if (res.message === 'success') {
              setTimeout(() => {
                this.router.navigate(['/login']);
              }, 10000);
              this.successeded.set(res.message);
              this.msgErr.set('');
              this.isLoading.set(false);
            }
          },
          error: (err: HttpErrorResponse) => {
            this.msgErr.set(err.error.message);
            this.successeded.set('');
            this.isLoading.set(false);
          },
        });
        this.termMsg.set(false);
      } else {
        this.termMsg.set(true);
      }
    } else {
      this.signUpForm?.setErrors({ mismatch: true });
      this.signUpForm.markAllAsTouched();
    }
  }

  // The Toggle of shown password

  toggleVisibility(field: 'password' | 'confirmPassword') {
    if (field === 'password') {
      this.isPasswordVisible.update((value) => !value);
    } else {
      this.isConfirmPasswordVisible.update((value) => !value);
    }
  }

  onInput(event: Event, field: 'password' | 'confirmPassword') {
    const input = event.target as HTMLInputElement;
    if (field === 'password') {
      this.showPasswordToggle.set(input.value.length > 0);
    } else {
      this.showConfirmPasswordToggle.set(input.value.length > 0);
    }
  }
}
