# E-Commerce Website

A full-stack e-commerce website built with React for the frontend and Spring Boot for the backend.

## Description

This project is a modern e-commerce platform designed to provide a seamless online shopping experience. It includes features for browsing products, managing a shopping cart, user authentication, order processing, and an admin panel for product management.

## Technologies Used

### Frontend
- React
- Redux
- Material-UI
- Tailwind CSS
- Axios
- React Router Dom

### Backend
- Spring Boot
- Spring Security
- Spring Data JPA
- MySQL
- JWT Authentication
- Maven

## Features

- User authentication and authorization (Signup, Login)
- Product catalog with categories and filtering
- Shopping cart functionality (Add, Update, Remove items)
- Order processing and tracking
- Responsive design for various devices
- Admin dashboard for managing products, orders, and users
- Secure payment processing
- User profile management
- Product reviews and ratings

## API Documentation

The backend provides a RESTful API.

Authentication: All protected endpoints require a valid JWT in the `Authorization` header (`Bearer <token>`).

## Installation

To set up and run the project locally, follow these steps:

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    ```
    Replace `<repository-url>` with the actual URL of your repository.

2.  **Backend Setup (Spring Boot API):**
    *   Navigate to the backend directory:
        ```bash
        cd "spring boot api"
        ```
    *   Configure the database:
        *   Ensure you have MySQL installed and running.
        *   Create a database for the project.
        *   Update the database connection properties in `src/main/resources/application.properties` (or `application.yml`) with your database credentials and name.
    *   Install backend dependencies and build the project using Maven:
        ```bash
        mvn clean install
        ```

3.  **Frontend Setup (React):**
    *   Navigate to the frontend directory:
        ```bash
        cd react
        ```
    *   Install frontend dependencies using npm:
        ```bash
        npm install
        ```
    *   Configure environment variables:
        *   Create a `.env` file in the `react` directory.
        *   Add necessary environment variables, such as the backend API URL. Example:
            ```env
            REACT_APP_API_BASE_URL=http://localhost:5454 # Or the deployed API URL
            ```

## Running the Application

1.  **Start the Backend:**
    *   Navigate to the `spring boot api` directory.
    *   Run the Spring Boot application using Maven:
        ```bash
        mvn spring-boot:run
        ```
    *   The backend API should start, typically on port 5454.

2.  **Start the Frontend:**
    *   Navigate to the `react` directory.
    *   Start the React development server:
        ```bash
        npm start
        ```
    *   The frontend application should open in your browser, typically at `http://localhost:3000`.

## Usage

-   Visit `http://localhost:3000` to access the e-commerce website.
-   Browse products by category or search.
-   Sign up or log in to manage your profile, add items to the cart, and place orders.
-   Use the shopping cart to review items and proceed to checkout.
-   If you have admin privileges, access the admin dashboard for managing products, orders, etc.

## Project Structure

```
.
├── react/             # Frontend React application
├── spring boot api/   # Backend Spring Boot application
├── .git/              # Git version control
└── README.md          # This file
```
*(Note: This is a simplified structure. A full file tree can be generated if needed.)*

## Contributing

(Add contributing guidelines if applicable)

## Contact

-   **Rohan Singh**: rohansinghxyzz@gmail.com (Frontend/Overall Project)
-   **Rohan Singh**: rohansinghxyzz@gmail.com (Backend API)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
