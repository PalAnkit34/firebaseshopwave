
# E-commerce Backend

This is the backend server for the e-commerce application, built with Node.js, Express, and MongoDB.

## Getting Started

### Prerequisites

- Node.js
- MongoDB Atlas account (or a local MongoDB instance)

### Installation & Setup

1.  **Clone the repository and install dependencies:**
    ```bash
    # Navigate to the backend directory
    cd backend

    # Install NPM packages
    npm install
    ```

2.  **Create a `.env` file:**
    Create a file named `.env` in the `backend` directory by copying the example file:
    ```bash
    cp .env.example .env
    ```

3.  **Configure environment variables in `.env`:**
    Open the `.env` file and add your configuration:
    ```
    NODE_ENV=development
    PORT=5000
    MONGO_URI=your_mongodb_connection_string
    JWT_SECRET=your_super_secret_key_for_jwt
    JWT_EXPIRE=30d
    ```
    - `MONGO_URI`: Your MongoDB connection string.
    - `JWT_SECRET`: A long, random string used to sign tokens.

### Running the Server

-   **Development mode (with auto-restarting):**
    ```bash
    npm run dev
    ```

-   **Production mode:**
    ```bash
    npm start
    ```

The server will be running on `http://localhost:5000`.

### Creating an Admin User

To create an admin user, you can use a tool like Postman to send a `POST` request to the registration endpoint with the `role` field set to `admin`.

**Endpoint:** `POST http://localhost:5000/api/auth/register`

**Body (raw JSON):**
```json
{
    "fullName": "Admin User",
    "email": "admin@example.com",
    "password": "yoursecurepassword",
    "role": "admin"
}
```
This only needs to be done once to create your initial admin account.
