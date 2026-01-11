# Project Setup Instructions

This project consists of a React frontend and a Laravel backend.

## Structure

- `frontend/`: The React application (Vite + TypeScript).
- `backend/`: The Laravel API application.

## Setup

### Backend (Laravel)

1.  Navigate to the `backend` directory:
    ```bash
    cd backend
    ```
2.  Install PHP dependencies:
    ```bash
    composer install
    ```
3.  Copy the environment file:
    ```bash
    cp .env.example .env
    ```
4.  Generate the application key:
    ```bash
    php artisan key:generate
    ```
5.  Configure your database in `.env` (DB_DATABASE, DB_USERNAME, etc.).
6.  Run migrations:
    ```bash
    php artisan migrate
    ```
7.  Start the server:
    ```bash
    php artisan serve
    ```

### Frontend (React)

1.  Navigate to the `frontend` directory:
    ```bash
    cd frontend
    ```
2.  Install Node dependencies:
    ```bash
    npm install
    ```
3.  Start the development server:
    ```bash
    npm run dev
    ```

## API Integration

The backend provides API endpoints at `http://localhost:8000/api`.
The frontend is currently using mock data. To integrate, update the components to fetch data from the API.
# sikap
