# Bike Manager

An Angular application that allows users to search for bikes by city and view detailed information about each bike. This application is built using the [Bike Index API](https://bikeindex.org/documentation/api_v3).

## Tech Stack

- **Frontend**:

  - Angular 19 (Latest version)
  - TypeScript
  - TailwindCSS for styling
  - Angular Material UI components
  - ESLint & Prettier for linting and formatting

- **Backend/SSR**:

  - Node.js with Express
  - Angular SSR (@angular/ssr)

- **Testing**:

  - Jest for unit testing
  - Cypress for end-to-end testing

## Installation

### Prerequisites

- Node.js (version 20.x or later)
- npm (version 8.x or later)

### Setup Instructions

1. Clone the repository:

   ```bash
   git clone https://github.com/robinesp/bike-manager.git
   cd bike-manager
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:

   ```bash
   npm start
   ```

4. Open your browser and navigate to `http://localhost:4200`

## Available Scripts

- `npm start` - Start the development server
- `npm run build` - Build the application for production
- `npm run serve:ssr` - Run the server-side rendering server
- `npm run lint` - Lint the codebase
- `npm run format` - Format code with Prettier
- `npm test` - Run unit tests with Jest
- `npm run cypress:open` - Open Cypress for E2E testing
- `npm run cypress:run` - Run Cypress tests in headless mode

## Building for Production

To build the application for production, run:

```bash
npm run build
```

This will create a production-ready build in the `dist/` directory.

## Server-Side Rendering (SSR)

This application implements server-side rendering using Angular Universal and Express. SSR provides several key benefits:

1. **Improved Performance**: Initial page load is faster as the server sends pre-rendered HTML
2. **Better SEO**: Search engines can crawl the content more effectively
3. **Enhanced User Experience**: Users see content immediately while JavaScript is loading

To run the SSR server after building the application:

```bash
npm run serve:ssr
```

The server will be available at `http://localhost:4000` by default.

## Testing

### Unit Testing

Unit tests are written using Jest and the Angular testing utilities. To run the unit tests:

```bash
npm test
```

Unit tests are located next to the files they test with the naming pattern `*.unit.spec.ts`.

### End-to-End Testing

End-to-end tests are written using Cypress. To run the E2E tests:

```bash
# Open Cypress test runner
npm run cypress:open

# Run tests headlessly
npm run cypress:run
```

