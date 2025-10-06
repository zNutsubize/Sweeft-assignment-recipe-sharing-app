# Recipe Sharing Application

A modern Angular application for sharing, viewing, editing, and managing recipes. Built with Angular 19, Angular Material, and json-server for the backend.

## Features

### Core Features
- **Recipe Display**: Browse recipes with title, description, and thumbnail images
- **Recipe Details**: View full recipe with ingredients and step-by-step instructions
- **Add Recipes**: Create new recipes with comprehensive form validation
- **Edit & Delete**: Modify or remove existing recipes
- **Search Functionality**: Filter recipes by title, description, or ingredients
- **Responsive Design**: Works seamlessly on desktop and mobile devices

### Bonus Features
- **Favorites System**: Mark recipes as favorites and view them separately
- **Modern UI/UX**: Beautiful Material Design interface with smooth animations
- **Image Support**: Upload and display recipe images with fallback support

## Technology Stack

- **Frontend**: Angular 19 with standalone components
- **UI Framework**: Angular Material with custom styling
- **Backend**: json-server for mock API
- **Forms**: Reactive Forms with comprehensive validation
- **Routing**: Angular Router with lazy loading
- **State Management**: Angular Signals for reactive state management
- **Control Flow**: New Angular control flow syntax (@if, @for, @else)

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd sweeft-assignment
```

2. Install dependencies:
```bash
npm install
```

### Running the Application

#### Option 1: Run both frontend and backend together (Recommended)
```bash
npm run dev
```
This will start both the Angular development server (port 4200) and json-server (port 3000) simultaneously.

#### Option 2: Run separately
```bash
# Terminal 1: Start the backend server
npm run server

# Terminal 2: Start the Angular development server
npm start
```

### Access the Application

- **Frontend**: http://localhost:4200
- **Backend API**: http://localhost:3000

## API Endpoints

The json-server provides the following REST API endpoints:

- `GET /recipes` - Get all recipes
- `GET /recipes/:id` - Get a specific recipe
- `POST /recipes` - Create a new recipe
- `PUT /recipes/:id` - Update a recipe
- `DELETE /recipes/:id` - Delete a recipe

## Project Structure

```
src/
├── app/
│   ├── components/
│   │   ├── recipe-list/          # Recipe listing with search
│   │   ├── recipe-detail/        # Individual recipe view
│   │   ├── recipe-form/          # Add/Edit recipe form
│   │   ├── favorites/            # Favorites page
│   │   └── not-found/            # 404 error page
│   ├── models/
│   │   └── recipe.model.ts       # Recipe data interfaces
│   ├── services/
│   │   └── recipe.service.ts     # Recipe CRUD operations
│   ├── app.component.*           # Root component
│   ├── app.config.ts             # App configuration
│   └── app.routes.ts             # Routing configuration
├── assets/                       # Static assets
└── styles.scss                   # Global styles
```

## Key Features Implementation

### Reactive Forms with Validation
- Comprehensive form validation for all recipe fields
- Dynamic ingredient and instruction lists
- Real-time error messages
- Image URL validation with regex patterns

### Search Functionality
- Debounced search input (300ms delay)
- Search across title, description, and ingredients
- Real-time filtering without page reload

### Favorites System
- Toggle favorite status with visual feedback
- Dedicated favorites page
- Persistent favorite state

### Responsive Design
- Mobile-first approach
- Adaptive grid layouts
- Touch-friendly interface
- Optimized for all screen sizes

## Development

### Available Scripts

- `npm start` - Start Angular development server
- `npm run build` - Build for production
- `npm run server` - Start json-server backend
- `npm run dev` - Start both frontend and backend
- `npm test` - Run unit tests

### Code Quality

The application follows Angular best practices:
- Standalone components for better tree-shaking
- Angular Signals for reactive state management
- New control flow syntax (@if, @for, @else) for cleaner templates
- Lazy loading for optimal performance
- TypeScript strict mode
- Simplified component logic without complex RxJS subscriptions
- Clean, maintainable code structure

## Sample Data

The application comes with 5 sample recipes including:
- Classic Spaghetti Carbonara
- Chocolate Chip Cookies
- Grilled Salmon with Lemon
- Vegetarian Buddha Bowl
- Beef Stir Fry

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is created for educational purposes as part of a technical assignment.