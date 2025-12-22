import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthService } from './auth.service';
import { LoginRequest, LoginResponse } from '../models/auth.model';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  const baseUrl = 'http://localhost:5108/api/auth';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService],
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    localStorage.clear();
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  describe('login', () => {
    it('should send login request with correct credentials', () => {
      const loginRequest: LoginRequest = { email: 'admin@test.com', password: 'password123' };
      const mockResponse: LoginResponse = { token: 'test-token', role: 'Admin' };

      service.login(loginRequest).subscribe();

      const req = httpMock.expectOne(`${baseUrl}/login`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(loginRequest);
      req.flush(mockResponse);
    });

    it('should store token and role in localStorage on successful login', () => {
      const loginRequest: LoginRequest = { email: 'admin@test.com', password: 'password123' };
      const mockResponse: LoginResponse = { token: 'test-token', role: 'Admin' };

      service.login(loginRequest).subscribe(() => {
        expect(localStorage.getItem('token')).toBe('test-token');
        expect(localStorage.getItem('role')).toBe('Admin');
      });

      const req = httpMock.expectOne(`${baseUrl}/login`);
      req.flush(mockResponse);
    });

    it('should emit role through roleSubject on successful login', () => {
      const loginRequest: LoginRequest = { email: 'admin@test.com', password: 'password123' };
      const mockResponse: LoginResponse = { token: 'test-token', role: 'Admin' };
      let emittedRole: string | null = null;

      service.role$.subscribe((role) => {
        emittedRole = role;
      });

      service.login(loginRequest).subscribe();

      const req = httpMock.expectOne(`${baseUrl}/login`);
      req.flush(mockResponse);

      expect(emittedRole).toBe('Admin');
    });

    it('should handle login error gracefully', () => {
      const loginRequest: LoginRequest = { email: 'admin@test.com', password: 'wrong' };
      let hasError = false;

      service.login(loginRequest).subscribe({
        error: () => {
          hasError = true;
        },
      });

      const req = httpMock.expectOne(`${baseUrl}/login`);
      req.error(new ErrorEvent('Unauthorized'), { status: 401 });

      expect(hasError).toBe(true);
      expect(localStorage.getItem('token')).toBeNull();
    });
  });

  describe('logout', () => {
    it('should clear localStorage on logout', () => {
      localStorage.setItem('token', 'test-token');
      localStorage.setItem('role', 'Admin');

      service.logout();

      expect(localStorage.getItem('token')).toBeNull();
      expect(localStorage.getItem('role')).toBeNull();
    });

    it('should emit null through roleSubject on logout', () => {
      let emittedRole: string | null = 'Admin';

      service.role$.subscribe((role) => {
        emittedRole = role;
      });

      service.logout();

      expect(emittedRole).toBe(null);
    });

    it('should reset roleSubject to null', () => {
      service.logout();
      expect(service.getRole()).toBeNull();
    });
  });

  describe('getToken', () => {
    it('should return token from localStorage', () => {
      localStorage.setItem('token', 'test-token');
      expect(service.getToken()).toBe('test-token');
    });

    it('should return null when no token in localStorage', () => {
      expect(service.getToken()).toBeNull();
    });
  });

  describe('getRole', () => {
    it('should return role from localStorage', () => {
      localStorage.setItem('role', 'Admin');
      expect(service.getRole()).toBe('Admin');
    });

    it('should return null when no role in localStorage', () => {
      expect(service.getRole()).toBeNull();
    });
  });

  describe('isAdmin', () => {
    it('should return true when role is Admin', () => {
      localStorage.setItem('role', 'Admin');
      expect(service.isAdmin()).toBe(true);
    });

    it('should return false when role is User', () => {
      localStorage.setItem('role', 'User');
      expect(service.isAdmin()).toBe(false);
    });

    it('should return false when no role is set', () => {
      expect(service.isAdmin()).toBe(false);
    });
  });

  describe('isLoggedIn', () => {
    it('should return true when token exists', () => {
      localStorage.setItem('token', 'test-token');
      expect(service.isLoggedIn()).toBe(true);
    });

    it('should return false when no token exists', () => {
      expect(service.isLoggedIn()).toBe(false);
    });
  });
});
