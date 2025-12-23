
# DHL Shipment Tracking

This web application provides a simple and intuitive way to track DHL shipments, manage shipment creation and updates, and view shipment timelines. Built with Angular, it is designed for both end-users and administrators.

## Features

### Core Functionality

#### 1. Shipment Tracking (User Feature)
- **Access:** Available to all registered users
- **Capability:** Enter a Tracking ID to view shipment details
- **Information Display:**
  - Current shipment status
  - Complete shipment history with timeline visualization
  - Origin and destination details
  - Estimated delivery date
- **Error Handling:** Graceful handling of invalid tracking IDs and server errors

#### 2. Shipment Creation (Admin Only)
- **Access:** Restricted to Admin users
- **Capability:** Create new shipments through an intuitive form interface
- **Required Details:**
  - Origin location
  - Destination location
  - Estimated delivery date
- **Validation:** Comprehensive form validation with real-time feedback
- **User Feedback:** Success/error messages after creation

#### 3. Shipment Updates (Admin Only)
- **Access:** Restricted to Admin users
- **Capability:** Update shipment milestones and status changes throughout the shipment lifecycle
- **Functionality:**
  - Modify current shipment status
  - Add/update shipment milestones
  - Track shipment progress in real-time

### Technical Features

#### UI/UX
- **Reusable Components:** Modular component architecture for maintainability and reusability
- **Loading Indicators:** Visual feedback during API calls
- **Error Handling:** Comprehensive error states for invalid tracking IDs and server errors
- **Responsive Layout:** Mobile-friendly design using Tailwind CSS
- **Navigation:** Proper header and footer components

#### Authentication & Authorization
- **Secure Login:** Role-based authentication for users and admins
- **Auth Guard:** Route protection based on user roles
- **Session Management:** Persistent authentication state

## Getting Started

### Prerequisites
- Node.js (v18 or higher recommended)
- npm (v9 or higher)

### Installation
1. Clone the repository:
	 ```bash
	 git clone https://github.com/shravani-09/angular_shipment_tracking_DHL.git
	 cd dhl-shipment-tracking
	 ```
2. Install dependencies:
	 ```bash
	 npm install
	 ```

### Running the Application
Start the development server:
```bash
npm start
```
Visit [http://localhost:4200](http://localhost:4200) in your browser.

### Running Tests
- **Unit tests:**
	```bash
	npm test
	```
- **Linting:**
	```bash
	npm run lint
	```

## Project Structure

- `src/app/core` – Core services, models, interceptors, and constants
- `src/app/features` – Feature modules (tracking, admin, auth)
- `src/app/shared` – Shared UI components (loader, error message, timeline, etc.)
- `src/app/layout` – Header and footer components

## Technical Implementation

### Angular Architecture
- **Component Structure:** Modular and feature-based organization with reusable shared components
- **Services:** Centralized API communication through service layer (`AuthService`, `ShipmentService`)
- **RxJS Integration:** 
  - Observables for asynchronous data handling
  - Pipe operators for data transformation and filtering
  - Proper error handling with `catchError` operator
- **Form Validation:** Reactive forms with custom validators
- **Guards:** Route protection using `AuthGuard` and `AdminGuard` for role-based access control
- **Interceptors:**
  - `AuthInterceptor` for adding authentication tokens to requests
  - `ErrorInterceptor` for centralized error handling
- **Unit Testing:** Comprehensive test coverage for components and services

### Models & DTOs
- `AuthModel` – Authentication-related data structures
- `ShipmentModel` – Shipment data transfer objects with complete shipment lifecycle information

### Styling
- **Framework:** Tailwind CSS for rapid UI development
- **Color System:** Defined in `src/app/core/styles/colors.ts`
- **Component Styles:** Centralized in `src/app/core/styles/component-styles.ts`
- **Responsive Design:** Mobile-first approach with responsive breakpoints

## API Integration

### Backend Requirements
The application expects a RESTful backend API running at `http://localhost:5108/api` with the following features:
- **RESTful Design:** Proper HTTP methods (GET, POST, PUT, DELETE)
- **Status Codes:** Appropriate HTTP status codes (200, 201, 400, 401, 404, 500)
- **DTO Usage:** Data Transfer Objects for request/response payloads
- **Exception Handling:** Comprehensive error responses with meaningful messages
- **Validation:** Input validation with appropriate error feedback
- **Dependency Injection:** DI container for service management
- **Repository Pattern:** Service layer abstraction for data access
- **Database:** Entity Framework Core (EFCore) integration

### Expected API Endpoints
- `POST /api/auth/login` – User authentication
- `GET /api/shipments/{trackingId}` – Retrieve shipment details
- `POST /api/shipments` – Create new shipment (Admin only)
- `PUT /api/shipments/{trackingId}` – Update shipment status (Admin only)

### Configuration
Update the API URL in the service files if your backend runs on a different port or address:
- Primary configuration: `src/app/core/services/`

### CORS Integration
- The backend must have CORS configured to allow requests from the Angular application
- Credentials (cookies/tokens) are sent with requests for authentication

## Testing

### Unit Tests
The application includes comprehensive unit tests for components and services:
```bash
npm test
```
- **Service Tests:** Mock API calls and test business logic
- **Component Tests:** Test component behavior and user interactions
- **Test Coverage:** Includes tests for auth service, shipment service, and key components

### Code Quality
```bash
npm run lint
```
- ESLint configuration for code consistency and quality

## Customization

- **Styling:** Uses Tailwind CSS for rapid UI development. Modify `tailwind.config.js` and `src/styles.css` as needed.
- **Environment:** Adjust API URLs and environment settings in the service files under `src/app/core/services/`.
