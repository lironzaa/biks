# Biks - Student Management System

A modern Angular application for managing student trainees, grades, and performance monitoring.

## Tech Stack

- **Angular 18+** with standalone components
- **RxJS** for reactive programming
- **NgRx** for state management
- **Chart.js** for data visualization
- **JSON Server** for mock backend
- **Signals** for reactive state

## Quick Start

### Installation

```bash
npm install
```

### Running the Project

1. **Start the Mock API Server**
   ```bash
   cd database
   json-server --watch db.json
   ```
   API will run on `http://localhost:3000`

2. **Start the Development Server** (in a new terminal)
   ```bash
   npm start
   ```
   Navigate to `http://localhost:4200/`

### Build for Production

```bash
npm run build
```

## Project Structure

```

## Key Capabilities

- ✅ CRUD operations for trainees and grades
- ✅ Advanced multi-criteria filtering
- ✅ Real-time data validation
- ✅ Performance analytics with charts
- ✅ Responsive pagination
- ✅ Signal-based reactivity
- ✅ Type-safe with TypeScript
- ✅ OnPush change detection for performance

---

Built with Angular CLI version 20.1.6