# Shopping Cart Application

A full-stack shopping cart application built with Angular and Express.js. This application allows users to register, login, browse products, and manage their shopping cart with persistent cart data across sessions.

## Features

- **User Authentication**
  - User registration with email and password validation
  - Login with session persistence
  - Protected routes with authentication guard

- **Product Catalog**
  - Browse available products
  - View product details (title, price, image, stock status)
  - Real-time stock availability indicators

- **Shopping Cart**
  - Add products to cart with stock validation
  - Remove items from cart
  - Persistent cart data per user
  - Cart persists across login sessions
  - Real-time total price calculation

- **User Experience**
  - Responsive design
  - Loading states and error handling
  - Success/error notifications
  - Form validation with helpful error messages

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (version 18 or higher)
- **npm** (comes with Node.js)
- **Angular CLI** (version 20.3.10 or higher)

To install Angular CLI globally:
```bash
npm install -g @angular/cli
```

## Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd shopping-cart-app
```

### 2. Install Frontend Dependencies

```bash
npm install
```

### 3. Install Backend Dependencies

```bash
cd server
npm install
cd ..
```

## Running the Application

The application consists of two parts: the Angular frontend and the Express.js backend. Both need to be running simultaneously.

### Start the Backend Server

Open a terminal and run:

```bash
cd server
node server.js
```

The backend server will start on `http://localhost:3000`.

### Start the Frontend Application

Open a **new terminal** and run:

```bash
npm start
```

Or alternatively:

```bash
ng serve
```

The frontend application will start on `http://localhost:4200`.

### Access the Application

Open your browser and navigate to:
```
http://localhost:4200
```

## Project Structure

```
shopping-cart-app/
├── src/                          # Angular source code
│   ├── app/
│   │   ├── auth/                 # Authentication components
│   │   │   ├── login.component.ts
│   │   │   └── register.component.ts
│   │   ├── guards/                # Route guards
│   │   │   └── auth.guard.ts
│   │   ├── home/                  # Main application components
│   │   │   ├── home.component.ts
│   │   │   ├── header.component.ts
│   │   │   ├── products.component.ts
│   │   │   └── cart.component.ts
│   │   ├── models/                # TypeScript interfaces
│   │   │   └── product.models.ts
│   │   ├── services/              # Angular services
│   │   │   ├── auth.service.ts
│   │   │   ├── products.service.ts
│   │   │   └── cart.service.ts
│   │   ├── app.component.ts       # Root component
│   │   ├── app.config.ts          # Application configuration
│   │   └── app.routes.ts          # Route configuration
│   └── main.ts                    # Application entry point
├── server/                        # Express.js backend
│   ├── server.js                  # Backend server
│   ├── db.json                    # User and cart data (auto-generated)
│   └── products.json              # Product catalog data
├── e2e/                           # End-to-end tests
│   └── user-journey.spec.ts
└── package.json                   # Frontend dependencies
```

## Available Scripts

### Frontend Scripts

- `npm start` or `ng serve` - Start the development server
- `npm run build` or `ng build` - Build the project for production
- `npm test` or `ng test` - Run unit tests
- `npm run watch` - Build and watch for changes

### Backend Scripts

The backend server is started directly with Node.js:
```bash
cd server
node server.js
```

## Testing

### Unit Tests

Run unit tests using Karma:

```bash
npm test
```

### End-to-End Tests

This project uses Playwright for e2e testing. To run e2e tests:

```bash
npx playwright test
```

To view the test report:

```bash
npx playwright show-report
```

**Note:** Make sure both the frontend (`npm start`) and backend (`node server/server.js`) are running before executing e2e tests.

## API Endpoints

The backend server provides the following REST API endpoints:

- `GET /api/products` - Get all products
- `POST /api/register` - Register a new user
- `POST /api/login` - Login a user
- `GET /api/cart` - Get user's cart (requires `x-user-email` header)
- `POST /api/cart` - Update user's cart (requires `x-user-email` header)

## Technologies Used

### Frontend
- **Angular 20.3** - Frontend framework
- **TypeScript** - Programming language
- **RxJS** - Reactive programming
- **Tailwind CSS** (via @ngneat/tailwind) - Styling
- **Playwright** - E2E testing

### Backend
- **Express.js** - Web server framework
- **Node.js** - Runtime environment
- **CORS** - Cross-origin resource sharing

## Development Notes

- The backend uses JSON files (`db.json` and `products.json`) for data persistence
- User authentication is session-based using localStorage
- Cart data is stored per user email in the backend
- All routes except `/login` and `/register` are protected by the authentication guard

## Troubleshooting

### Port Already in Use

If port 3000 or 4200 is already in use:

**Backend (port 3000):**
- Modify the port in `server/server.js` (line 64)

**Frontend (port 4200):**
- Use `ng serve --port <port-number>`

### CORS Issues

If you encounter CORS errors, ensure the backend server is running and CORS is enabled (already configured in `server.js`).

### Build Errors

If you encounter build errors:
1. Delete `node_modules` and `package-lock.json`
2. Run `npm install` again
3. Clear Angular cache: `ng cache clean`

## License

This project is private and intended for demonstration purposes.
