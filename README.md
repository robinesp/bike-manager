# Bike Manager

A modern Angular application that allows users to search for bikes by city and view detailed information about each bike. This application is built using the [Bike Index API](https://bikeindex.org/documentation/api_v3).

## Features

- **Bike Search**: Search for bikes by city name
- **Search Results**: View a list of bikes with key information and link to details
- **Bike Details**: See comprehensive information about a specific bike including images, manufacturer details, and more
- **Responsive Design**: Optimized for both desktop and mobile devices

## Tech Stack

- **Angular**: Front-end framework
- **TypeScript**: Programming language
- **SCSS**: Styling
- **Bike Index API**: Data source

## Getting Started

### Prerequisites

- Node.js (version 14.x or later)
- npm (version 6.x or later)

### Installation

1. Clone the repository:

   ```
   git clone https://github.com/yourusername/bike-manager.git
   cd bike-manager
   ```

2. Install dependencies:

   ```
   npm install
   ```

3. Start the development server:

   ```
   npm start
   ```

4. Open your browser and navigate to `http://localhost:4200`

## Project Structure

```
bike-manager/
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   ├── bike-search/    # Bike search component
│   │   │   └── bike-detail/    # Bike detail component
│   │   ├── models/             # TypeScript interfaces
│   │   ├── services/           # API services
│   │   ├── app.component.*     # Root component
│   │   └── app.routes.ts       # Application routes
│   ├── assets/                 # Static assets
│   │   └── images/             # Image files
│   └── styles.css              # Global styles
└── ...
```

## API Integration

This application uses the Bike Index API v3:

- `GET /v3/search` - Search for bikes by location
- `GET /v3/bikes/{id}` - Get detailed information about a specific bike

## Future Improvements

- Add advanced search filters
- Implement user authentication to save favorite bikes
- Add a map view to show bike locations
- Add pagination for search results
- Support for multiple languages

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [Bike Index](https://bikeindex.org/) for providing the API
- Angular team for the excellent framework
