import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Login } from './login';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { vi } from 'vitest';
import { describe, it, expect, beforeEach } from 'vitest';

describe('Login Component', () => {
  let component: Login;
  let fixture: ComponentFixture<Login>;
  let authService: AuthService;
  let router: Router;

  beforeEach(async () => {
    const mockAuthService = {
      login: vi.fn(() => of({ token: 'test-token', role: 'Admin' })),
    };
    const mockRouter = {
      navigate: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [Login],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: Router, useValue: mockRouter },
      ],
    }).compileComponents();

    authService = TestBed.inject(AuthService);
    router = TestBed.inject(Router);
    fixture = TestBed.createComponent(Login);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('Component Initialization', () => {
    it('should create the component', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize with default values', () => {
      expect(component.error).toBe('');
      expect(component.loading).toBe(false);
      expect(component.form).toBeTruthy();
    });

    it('should have email and password form controls', () => {
      expect(component.form.get('email')).toBeTruthy();
      expect(component.form.get('password')).toBeTruthy();
    });
  });

  describe('Form Validation', () => {
    it('should be invalid when form is empty', () => {
      expect(component.form.invalid).toBe(true);
    });

    it('should be invalid when email is empty', () => {
      component.form.patchValue({ password: 'password123' });
      expect(component.form.invalid).toBe(true);
    });

    it('should be invalid when password is empty', () => {
      component.form.patchValue({ email: 'admin@test.com' });
      expect(component.form.invalid).toBe(true);
    });

    it('should be valid when all fields are filled', () => {
      component.form.patchValue({
        email: 'admin@test.com',
        password: 'password123',
      });
      expect(component.form.valid).toBe(true);
    });
  });

  describe('submit() method', () => {
    it('should not call authService when form is invalid', () => {
      component.form.patchValue({ email: 'admin@test.com' });
      component.submit();

      expect(authService.login).not.toHaveBeenCalled();
    });

    it('should call authService with form values when form is valid', () => {
      const loginSpy = vi
        .spyOn(authService, 'login')
        .mockReturnValue(of({ token: 'test', role: 'Admin' }));
      component.form.patchValue({
        email: 'admin@test.com',
        password: 'password123',
      });

      component.submit();

      expect(loginSpy).toHaveBeenCalledWith({
        email: 'admin@test.com',
        password: 'password123',
      });
    });

    it('should set loading to true during submission', () => {
      vi.spyOn(authService, 'login').mockReturnValue(of({ token: 'test', role: 'Admin' }));
      component.form.patchValue({
        email: 'admin@test.com',
        password: 'password123',
      });

      component.submit();

      expect(component.loading).toBe(false);
    });

    it('should clear error message before submission', () => {
      vi.spyOn(authService, 'login').mockReturnValue(of({ token: 'test', role: 'Admin' }));
      component.error = 'Previous error';
      component.form.patchValue({
        email: 'admin@test.com',
        password: 'password123',
      });

      component.submit();

      expect(component.error).toBe('');
    });
  });

  describe('Successful Login', () => {
    it('should navigate to home on successful login', () => {
      const loginSpy = vi
        .spyOn(authService, 'login')
        .mockReturnValue(of({ token: 'test', role: 'Admin' }));
      const routerSpy = vi.spyOn(router, 'navigate');
      component.form.patchValue({
        email: 'admin@test.com',
        password: 'password123',
      });

      component.submit();

      expect(loginSpy).toHaveBeenCalled();
      expect(routerSpy).toHaveBeenCalledWith(['/track']);
    });

    it('should set loading to false after successful login', () => {
      vi.spyOn(authService, 'login').mockReturnValue(of({ token: 'test', role: 'Admin' }));
      component.form.patchValue({
        email: 'admin@test.com',
        password: 'password123',
      });

      component.submit();

      expect(component.loading).toBe(false);
    });

    it('should clear error message on successful login', () => {
      vi.spyOn(authService, 'login').mockReturnValue(of({ token: 'test', role: 'Admin' }));
      component.error = 'Previous error';
      component.form.patchValue({
        email: 'admin@test.com',
        password: 'password123',
      });

      component.submit();

      expect(component.error).toBe('');
    });
  });

  describe('Login Error Handling', () => {
    it('should display error message on login failure', () => {
      const errorResponse = { error: { message: 'Invalid credentials' } };
      vi.spyOn(authService, 'login').mockReturnValue(throwError(() => errorResponse));
      component.form.patchValue({
        email: 'admin@test.com',
        password: 'wrongpassword',
      });

      component.submit();

      expect(component.error).toBe('Invalid credentials');
    });

    it('should display fallback error when no error message provided', () => {
      const errorResponse = { status: 500 };
      vi.spyOn(authService, 'login').mockReturnValue(throwError(() => errorResponse));
      component.form.patchValue({
        email: 'admin@test.com',
        password: 'password123',
      });

      component.submit();

      expect(component.error).toBe('Something went wrong');
    });

    it('should set loading to false on error', () => {
      const errorResponse = { error: { message: 'Server error' } };
      vi.spyOn(authService, 'login').mockReturnValue(throwError(() => errorResponse));
      component.form.patchValue({
        email: 'admin@test.com',
        password: 'password123',
      });

      component.submit();

      expect(component.loading).toBe(false);
    });

    it('should not navigate on login failure', () => {
      const errorResponse = { error: { message: 'Invalid credentials' } };
      vi.spyOn(authService, 'login').mockReturnValue(throwError(() => errorResponse));
      const routerSpy = vi.spyOn(router, 'navigate');
      component.form.patchValue({
        email: 'admin@test.com',
        password: 'wrongpassword',
      });

      component.submit();

      expect(routerSpy).not.toHaveBeenCalled();
    });
  });

  describe('Memory Management', () => {
    it('should cleanup on component destroy', () => {
      vi.spyOn(authService, 'login').mockReturnValue(of({ token: 'test', role: 'Admin' }));
      component.form.patchValue({
        email: 'admin@test.com',
        password: 'password123',
      });

      component.submit();
      fixture.destroy();

      expect(component).toBeTruthy();
    });
  });
});
