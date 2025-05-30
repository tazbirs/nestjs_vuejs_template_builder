# Form Template Builder

A web application for creating, customizing, and managing form templates using Vue.js for frontend and Nest.js for backend.

## Features

- **Template Builder**: Design reusable form templates with a drag and drop interface
- **Form Creation**: Create forms based on templates with customizable fields
- **Element Management**: Add, edit, and arrange various form elements
- **Preview & Publish**: Preview forms before publishing and share with your users

## Tech Stack

### Frontend
- Vue.js 3
- Vuex 4 (State Management)
- Vue Router 4
- Element Plus (UI Components)
- Axios (HTTP Client)
- Vue Draggable (Drag and Drop)

### Backend
- Nest.js
- TypeScript
- MongoDB with Mongoose
- Class Validator
- Class Transformer

## Installation

### Prerequisites
- Node.js (>= 14.x)
- npm or yarn
- MongoDB

### Setup

1. Clone the repository
```bash
git clone <repository-url>
cd VueJS-template-builder
```

2. Install dependencies
```bash
npm run install:all
```

3. Configure the backend
   - Create a `.env` file in the `backend` directory with the following:
```
PORT=3000
MONGODB_URI=mongodb://localhost:27017/template-builder
```

4. Start MongoDB (make sure MongoDB is running on your system)

5. Run both frontend and backend concurrently
```bash
npm start
```

## Usage

1. **Access the application**: Open your browser and navigate to `http://localhost:8080`

2. **Create a Template**:
   - Navigate to Templates > Create Template
   - Add form elements via drag and drop
   - Configure element properties
   - Save the template

3. **Create a Form**:
   - Navigate to Forms > Create Form
   - Start from scratch or select an existing template
   - Customize form settings
   - Save and publish the form

4. **Preview Forms**:
   - Forms can be previewed and tested before sharing
   - Published forms are accessible via their unique URLs

## Development

### Frontend
```bash
cd frontend
npm run serve
```

The frontend will be available at: `http://localhost:8080`

### Backend
```bash
cd backend
npm run start:dev
```

The API will be available at: `http://localhost:3000/api`

## API Documentation

### Templates

- **GET** `/api/templates` - Get all templates
- **GET** `/api/templates/:id` - Get a template by ID
- **POST** `/api/templates` - Create a new template
- **PUT** `/api/templates/:id` - Update a template
- **DELETE** `/api/templates/:id` - Delete a template

### Forms

- **GET** `/api/forms` - Get all forms
- **GET** `/api/forms/:id` - Get a form by ID
- **GET** `/api/forms/template/:templateId` - Get forms by template ID
- **POST** `/api/forms` - Create a new form
- **PUT** `/api/forms/:id` - Update a form
- **DELETE** `/api/forms/:id` - Delete a form

## License

MIT
