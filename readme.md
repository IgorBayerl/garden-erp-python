### README.md

---

# New Garden ERP

New Garden ERP is a Flask-based application designed to manage the production process by handling pieces, products, and the relationships between them. This README will guide you through setting up the project, installing dependencies, and handling database migrations.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Setting Up the Environment](#setting-up-the-environment)
- [Database Migrations](#database-migrations)
- [Running the Application](#running-the-application)
- [API Endpoints](#api-endpoints)

## Prerequisites

Before you begin, ensure you have the following installed on your system:

- [Python 3.8+](https://www.python.org/downloads/)
- [pip](https://pip.pypa.io/en/stable/installation/)
- [virtualenv](https://virtualenv.pypa.io/en/latest/installation/)

## Installation

### 1. Clone the Repository

Clone the repository to your local machine using the following command:

```bash
git clone https://github.com/your-username/new-garden-erp.git
cd new-garden-erp
```

### 2. Create a Virtual Environment

Create a virtual environment to manage your Python dependencies:

```bash
python -m venv venv
```

Activate the virtual environment:

- On Windows:

  ```bash
  venv\Scripts\activate
  ```

- On macOS/Linux:

  ```bash
  source venv/bin/activate
  ```

### 3. Install Dependencies

Install the required Python packages using `pip`:

```bash
pip install -r requirements.txt
```

This will install all the necessary dependencies specified in the `requirements.txt` file.

## Setting Up the Environment

### 1. Create an `.env` File

Create a `.env` file in the root directory of your project to store environment variables. Add the following content to your `.env` file:

```plaintext
FLASK_APP=app
FLASK_ENV=development
SQLALCHEMY_DATABASE_URI=sqlite:///your-database.db
SECRET_KEY=your-secret-key
```

Replace `your-database.db` with the desired database name and `your-secret-key` with a secure key.

### 2. Initialize the Database

Before running the application, you need to initialize the database:

```bash
flask db init
```

This command will create a `migrations` directory to store your database migrations.

## Database Migrations

When you make changes to the database schema (e.g., adding or deleting models), you need to create and apply migrations to keep the database schema in sync with your models.

### 1. Generate a Migration

Whenever you change your models, run the following command to generate a new migration script:

```bash
flask db migrate -m "Your migration message"
```

This will create a new migration script in the `migrations/versions` directory.

### 2. Apply the Migration

Apply the migration to your database by running:

```bash
flask db upgrade
```

This command will apply the changes specified in the migration script to your database.

## Running the Application

After setting up the environment and applying migrations, you can run the application using:

```bash
flask run
```

By default, the application will be available at `http://127.0.0.1:5000/`.

## API Endpoints

### POST /add_piece

Adds a new piece to the database.

**Request Body:**

```json
{
    "name": "Piece Name",
    "sizeX": 100,
    "sizeY": 200,
    "sizeZ": 300
}
```

### POST /add_product

Adds a new product to the database.

**Request Body:**

```json
{
    "name": "Product Name"
}
```

### POST /add_product_piece

Creates a relationship between a product and a piece.

**Request Body:**

```json
{
    "product_id": 1,
    "piece_id": 1,
    "quantity": 10
}
```

### POST /calculate_order

Calculates the required pieces based on the provided product quantities.

**Request Body:**

```json
{
    "group_by": "size",
    "order": "asc",
    "sort_by": ["x", "y", "z"],
    "products": [
        {
            "product_id": 1,
            "quantity": 10
        },
        {
            "product_id": 2,
            "quantity": 5
        }
    ]
}
```

## Conclusion

You're now ready to start developing with the New Garden ERP project! Be sure to follow the steps outlined in this README to set up, manage dependencies, handle database migrations, and run the application effectively.

---

This README provides a comprehensive guide for setting up the project, installing dependencies, managing the environment, handling database migrations, and running the application.