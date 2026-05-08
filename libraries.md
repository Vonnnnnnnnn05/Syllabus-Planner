# Syllabus Planner - Libraries and Technologies

## Programming Languages

### Backend
- **PHP 8.2+** - Server-side programming language

### Frontend
- **TypeScript 5.5.3** - Type-safe JavaScript for React components
- **JavaScript (ES6+)** - Runtime JavaScript for browser execution

---

## Backend Framework & Libraries

### Core Framework
- **Laravel Framework 12.0** - PHP web application framework
  - MVC architecture
  - Eloquent ORM
  - Blade templating
  - Artisan CLI
  - Migration system

### Authentication & Security
- **Laravel Sanctum 4.3** - API authentication and authorization
  - API token authentication
  - SPA authentication
  - Token management

### PDF Generation
- **barryvdh/laravel-dompdf** - PDF generation library
  - HTML to PDF conversion
  - Invoice/document generation

### Development Tools
- **Laravel Tinker 2.10.1** - REPL for Laravel
- **Faker 1.23** - Fake data generation for testing
- **Laravel Pail 1.2.2** - Log viewer
- **Laravel Pint 1.24** - Code style fixer
- **Laravel Sail 1.41** - Docker development environment
- **Mockery 1.6** - Mocking framework for testing
- **Collision 8.6** - Error reporting for CLI
- **PHPUnit 11.5.50** - Unit testing framework

---

## Frontend Framework & Libraries

### Core Framework
- **React 18.3.1** - UI component library
  - Functional components with hooks
  - Context API for state management
  - Virtual DOM for performance

### Build Tool
- **Vite 5.4.0** - Next-generation frontend build tool
  - Fast HMR (Hot Module Replacement)
  - Optimized build pipeline
  - ES modules support
  - TypeScript support

### Routing
- **React Router DOM 6.26.0** - Client-side routing
  - Dynamic routing
  - Nested routes
  - Route parameters
  - Navigation guards

### HTTP Client
- **Axios 1.16.0** - Promise-based HTTP client
  - REST API integration
  - Request/response interceptors
  - Automatic JSON transformation
  - Error handling

### UI Components & Styling
- **Tailwind CSS 3.4.9** - Utility-first CSS framework
  - Responsive design
  - Custom color palette
  - Dark mode support
  - JIT compilation

- **Lucide React 0.427.0** - Icon library
  - 1000+ consistent icons
  - Tree-shakeable
  - Customizable

- **Class Variance Authority 0.7.0** - Variant-based component styling
- **clsx 2.1.1** - Conditional class name utility
- **tailwind-merge 2.5.0** - Merge Tailwind CSS classes intelligently

### Notifications
- **React Hot Toast 2.4.1** - Toast notification library
  - Success/error/info/warning toasts
  - Customizable positioning
  - Promise-based loading states

### Data Visualization
- **Recharts 2.12.7** - Chart library for React
  - Line charts, bar charts, pie charts
  - Responsive charts
  - Customizable tooltips
  - Animation support

### PDF Export
- **html2pdf.js 0.14.0** - HTML to PDF conversion
  - Client-side PDF generation
  - High-quality rendering
  - Custom page formatting
  - Image support

### Development Tools
- **TypeScript 5.5.3** - Static type checking
- **@types/react 18.3.3** - React TypeScript definitions
- **@types/react-dom 18.3.0** - React DOM TypeScript definitions
- **@vitejs/plugin-react 4.3.1** - React plugin for Vite
- **PostCSS 8.4.41** - CSS transformation tool
- **Autoprefixer 10.4.20** - CSS vendor prefixing

---

## System Architecture

### Backend Architecture
- **RESTful API** - State API endpoints for CRUD operations
- **MVC Pattern** - Model-View-Controller separation
- **Eloquent ORM** - Database abstraction layer
- **Laravel Sanctum** - API authentication system
- **Laravel Queues** - Background job processing
- **Laravel Logs** - Application logging via Pail

### Frontend Architecture
- **Single Page Application (SPA)** - Client-side routing
- **Component-based Architecture** - Reusable React components
- **API Integration** - Axios for backend communication
- **State Management** - React hooks (useState, useEffect, useContext)
- **Responsive Design** - Mobile-first approach with Tailwind CSS

---

## Database
- **SQLite** (default) - Lightweight file-based database
- **MySQL** (supported) - Relational database management system
- **PostgreSQL** (supported) - Advanced relational database

---

## Development Environment
- **Node.js & npm** - JavaScript package management
- **Composer** - PHP package management
- **PHP 8.2+** - Backend runtime
- **Vite** - Frontend development server
- **Laravel Artisan** - CLI tool for Laravel

---

## Key Features Implementation

### Syllabus Management
- Course CRUD operations
- Weekly planning system
- Learning outcomes (CLOs) tracking
- Grading system management
- Requirements and policies
- References and rubrics

### Export Functionality
- **Print View** - Browser native printing
- **PDF Export** - Client-side PDF generation with html2pdf.js
  - A4 portrait format
  - High-quality rendering (3x scale)
  - Smart page breaks
  - Color preservation
  - Auto-naming based on course code

### User Interface
- Academic-themed color palette
- Responsive design for all screen sizes
- Toast notifications for user feedback
- Loading states for async operations
- Form validation
- Data visualization with Recharts

---

## Additional System Components

### Authentication
- Laravel Sanctum for API token authentication
- Session-based authentication for admin panel

### Logging
- Laravel Pail for real-time log monitoring
- Application error tracking

### Background Processing
- Laravel Queues for asynchronous tasks
- Queue worker with retry mechanism

### Code Quality
- Laravel Pint for code formatting
- TypeScript for type safety
- PHPUnit for backend testing

---

## Version Control
- **Git** - Version control system
- **GitHub** - Remote repository hosting

---

## Deployment
- **Vite Build** - Optimized production build
- **Laravel Optimization** - Configuration and route caching
- **Asset Compilation** - CSS and JS minification