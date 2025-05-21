# 📚 Book Review

A secure and scalable RESTful API to manage users, books, and reviews — built using **Node.js**, **Express.js**, and **MongoDB**.  
It supports **user authentication**, **book CRUD**, **review operations**, **search**.

---

## ⚙️ Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB (with Mongoose ODM)
- **Authentication**: JWT + Bcrypt
- **Environment Management**: Dotenv
- **Middleware**: Morgan (logging)
- **Security**: Helmet, CORS

---

## 📁 Project Structure

```
├── controllers             # Endpoint handlers (business logic for routes)
├── db                      # Database configuration and connection setup
├── middlewares             # Custom Express middleware functions (e.g. auth)
├── models                  # Mongoose schemas and data models
├── app.js                  # Express app setup (middleware, routes, etc.)
├── server.js               # Server entry point (starts the app on a specific port)
├── .env.example            # Template for environment variables (.env values)
├── .gitignore              # Specifies files and folders Git should ignore
├── package-lock.json       # Auto-generated dependency lock file
├── package.json            # Project metadata and dependencies
├── README.md               # Project overview, setup instructions, usage, etc.
└── LICENSE                 # License terms for the project
```

---

## 🚀 Local Setup

### 1. Clone the repository

```bash
git clone https://github.com/tejasnirala/book-review.git
cd book-review
```

### 2. Install dependencies

```bash
npm install
```

### 3. Setup environment variables

Copy `.env.example` to `.env` and update values as needed:

```bash
cp .env.example .env
```

```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/book-review
JWT_SECRET=your_jwt_secret
```

### 4. Start the server

```bash
# for development
npm run dev

# for production
npm start
```

Your backend server will start spining on `http://localhost:3000`

---

## 📮 API Endpoints

### 🔐 Auth

| Method | Endpoint  | Description         |
| ------ | --------- | ------------------- |
| POST   | `/signup` | Register a new user |
| POST   | `/login`  | Authenticate user   |

### 📚 Books

| Method | Endpoint             | Description                    |
| ------ | -------------------- | ------------------------------ |
| POST   | `/books`             | Create a book (auth required)  |
| GET    | `/books`             | Fetch all books                |
| GET    | `/books/:id`         | Get a specific book by ID      |
| POST   | `/books/:id/reviews` | Add a review for a book (auth) |

### ✍️ Reviews

| Method | Endpoint       | Description            |
| ------ | -------------- | ---------------------- |
| PUT    | `/reviews/:id` | Update a review (auth) |
| DELETE | `/reviews/:id` | Delete a review (auth) |

### 🔍 Search

| Method | Endpoint          | Description                    |
| ------ | ----------------- | ------------------------------ |
| GET    | `/search?query=x` | Search by book title or author |

---

## 📦 Example API Requests

### 🔐 Signup (curl)

```bash
curl --location 'http://localhost:3000/signup' \
--header 'Content-Type: application/json' \
--data-raw '{
    "name": "Tejas",
    "email": "tejas@example.com",
    "password": "securePassword123"
  }'
```

**Response :**

```json
{
  "success": true,
  "message": "User created successfully",
  "data": {
    "userId": "682dc3464a414523028d2866"
  }
}
```

### 🔐 Login (curl)

```bash
curl --location 'http://localhost:3000/login' \
--header 'Content-Type: application/json' \
--data-raw '{
    "email": "tejas@example.com",
    "password": "securePassword123"
  }'
```

**Response :**

```json
{
  "success": true,
  "message": "User logged in successfully",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4MmRjMzQ2NGE0MTQ1MjMwMjhkMjg2NiIsImVtYWlsIjoidGVqYXNAZXhhbXBsZS5jb20iLCJpYXQiOjE3NDc4Mjk2MjAsImV4cCI6MTc0NzkxNjAyMH0.3NKhO5CcRggAdkrvkQYZfi7R7tW606MxbRqpf_MjVJE"
  }
}
```

### 📚 Add A New Book (curl)

```bash
curl --location 'http://localhost:3000/books' \
--header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4MmRjMzQ2NGE0MTQ1MjMwMjhkMjg2NiIsImVtYWlsIjoidGVqYXNAZXhhbXBsZS5jb20iLCJpYXQiOjE3NDc4Mjk2MjAsImV4cCI6MTc0NzkxNjAyMH0.3NKhO5CcRggAdkrvkQYZfi7R7tW606MxbRqpf_MjVJE' \
--header 'Content-Type: application/json' \
--data '{
    "title": "Steve Jobs",
    "author": "Walter Isaacson",
    "genre": "Biography",
    "publishedYear": 2011
  }'
```

**Response :**

```json
{
  "success": true,
  "message": "Book added successfully",
  "data": {
    "newBook": {
      "title": "Steve Jobs",
      "author": "Walter Isaacson",
      "genre": "Biography",
      "publishedYear": 2011,
      "_id": "682dc49e4a414523028d286d",
      "createdAt": "2025-05-21T12:18:38.588Z",
      "updatedAt": "2025-05-21T12:18:38.588Z",
      "__v": 0
    }
  }
}
```

### 📚 Get All Books (curl)

> with Pagination and optional filters by `author` and `genre`

```bash
curl --location 'http://localhost:3000/books?author=j.k.&genre=Fantasy&page=1&limit=5'
```

**Response :**

```json
{
  "success": true,
  "total": 7,
  "page": 1,
  "pageSize": 5,
  "totalPages": 2,
  "data": [
    {
      "_id": "682db51b2cc0f8000a06e488",
      "title": "Harry Potter and the Prisoner of Azkaban",
      "author": "J.K. Rowling",
      "genre": "Fantasy",
      "publishedYear": 1999,
      "__v": 0,
      "createdAt": "2025-05-21T11:12:27.790Z",
      "updatedAt": "2025-05-21T11:12:27.790Z"
    },
    {
      "_id": "682db51b2cc0f8000a06e48a",
      "title": "Harry Potter and the Order of the Phoenix",
      "author": "J.K. Rowling",
      "genre": "Fantasy",
      "publishedYear": 2003,
      "__v": 0,
      "createdAt": "2025-05-21T11:12:27.790Z",
      "updatedAt": "2025-05-21T11:12:27.790Z"
    },
    {
      "_id": "682db51b2cc0f8000a06e486",
      "title": "Harry Potter and the Philosopher's Stone",
      "author": "J.K. Rowling",
      "genre": "Fantasy",
      "publishedYear": 1997,
      "__v": 0,
      "createdAt": "2025-05-21T11:12:27.790Z",
      "updatedAt": "2025-05-21T11:12:27.790Z"
    },
    {
      "_id": "682db51b2cc0f8000a06e487",
      "title": "Harry Potter and the Chamber of Secrets",
      "author": "J.K. Rowling",
      "genre": "Fantasy",
      "publishedYear": 1998,
      "__v": 0,
      "createdAt": "2025-05-21T11:12:27.790Z",
      "updatedAt": "2025-05-21T11:12:27.790Z"
    },
    {
      "_id": "682db51b2cc0f8000a06e489",
      "title": "Harry Potter and the Goblet of Fire",
      "author": "J.K. Rowling",
      "genre": "Fantasy",
      "publishedYear": 2000,
      "__v": 0,
      "createdAt": "2025-05-21T11:12:27.790Z",
      "updatedAt": "2025-05-21T11:12:27.790Z"
    }
  ]
}
```

### 📚 Get Book Details by ID (curl)

> including: **Average rating** and **Reviews** (with pagination)

```bash
curl --location 'http://localhost:3000/books/682dc49e4a414523028d286d'
```

**Response :**

```json
{
  "success": true,
  "book": {
    "_id": "682dc49e4a414523028d286d",
    "title": "Steve Jobs",
    "author": "Walter Isaacson",
    "genre": "Biography",
    "publishedYear": 2011,
    "createdAt": "2025-05-21T12:18:38.588Z",
    "updatedAt": "2025-05-21T12:18:38.588Z",
    "__v": 0
  },
  "averageRating": 4.8,
  "reviews": {
    "total": 1,
    "page": 1,
    "pageSize": 1,
    "totalPages": 1,
    "data": [
      {
        "_id": "682dc8de4a414523028d2878",
        "book": "682dc49e4a414523028d286d",
        "user": {
          "_id": "682dc3464a414523028d2866",
          "name": "Tejas",
          "email": "tejas@example.com"
        },
        "rating": 4.8,
        "comment": "Brilliant book with well-paced storytelling. Must read.",
        "createdAt": "2025-05-21T12:36:46.630Z",
        "updatedAt": "2025-05-21T12:39:01.519Z",
        "__v": 0
      }
    ]
  }
}
```

### 📚 Submit A Review (curl)

> Authenticated users only, one review per user per book

```bash
curl --location 'http://localhost:3000/books/682dc49e4a414523028d286d/reviews' \
--header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4MmRjMzQ2NGE0MTQ1MjMwMjhkMjg2NiIsImVtYWlsIjoidGVqYXNAZXhhbXBsZS5jb20iLCJpYXQiOjE3NDc4Mjk2MjAsImV4cCI6MTc0NzkxNjAyMH0.3NKhO5CcRggAdkrvkQYZfi7R7tW606MxbRqpf_MjVJE' \
--header 'Content-Type: application/json' \
--data '{
    "rating": 4.5,
    "comment": "Brilliant book with well-paced storytelling."
  }'
```

**Response :**

```json
{
  "success": true,
  "message": "Review submitted successfully",
  "data": {
    "book": "682dc49e4a414523028d286d",
    "user": "682dc3464a414523028d2866",
    "rating": 4.5,
    "comment": "Brilliant book with well-paced storytelling.",
    "_id": "682dc8de4a414523028d2878",
    "createdAt": "2025-05-21T12:36:46.630Z",
    "updatedAt": "2025-05-21T12:36:46.630Z",
    "__v": 0
  }
}
```

### 📚 Update Your Own Review (curl)

```bash
curl --location --request PUT 'http://localhost:3000/reviews/682dc8de4a414523028d2878' \
--header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4MmRjMzQ2NGE0MTQ1MjMwMjhkMjg2NiIsImVtYWlsIjoidGVqYXNAZXhhbXBsZS5jb20iLCJpYXQiOjE3NDc4Mjk2MjAsImV4cCI6MTc0NzkxNjAyMH0.3NKhO5CcRggAdkrvkQYZfi7R7tW606MxbRqpf_MjVJE' \
--header 'Content-Type: application/json' \
--data '{
    "rating": 4.8,
    "comment": "Brilliant book with well-paced storytelling. Must read."
  }'
```

**Response :**

```json
{
  "success": true,
  "message": "Review update successfully",
  "data": {
    "_id": "682dc8de4a414523028d2878",
    "book": "682dc49e4a414523028d286d",
    "user": "682dc3464a414523028d2866",
    "rating": 4.8,
    "comment": "Brilliant book with well-paced storytelling. Must read.",
    "createdAt": "2025-05-21T12:36:46.630Z",
    "updatedAt": "2025-05-21T12:39:01.519Z",
    "__v": 0
  }
}
```

### 📚 Delete Your Own Review (curl)

```bash
curl --location --request DELETE 'http://localhost:3000/reviews/682dc8de4a414523028d2878' \
--header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4MmRjMzQ2NGE0MTQ1MjMwMjhkMjg2NiIsImVtYWlsIjoidGVqYXNAZXhhbXBsZS5jb20iLCJpYXQiOjE3NDc4Mjk2MjAsImV4cCI6MTc0NzkxNjAyMH0.3NKhO5CcRggAdkrvkQYZfi7R7tW606MxbRqpf_MjVJE' \
--header 'Content-Type: application/json' \
--data '{
    "rating": 4.8,
    "comment": "Brilliant book with well-paced storytelling. Must read."
  }'
```

**Response :**

```json
{
  "success": true,
  "message": "Review deleted successfully",
  "data": {}
}
```

### 📚 Search Books by `title` or `author` (curl)

```bash
curl --location 'http://localhost:3000/search?query=hAr&page=1&limit=5'
```

**Response :**

```json
{
  "success": true,
  "message": "Found 8 book(s) matching your search",
  "data": {
    "books": [
      {
        "_id": "682db51b2cc0f8000a06e487",
        "title": "Harry Potter and the Chamber of Secrets",
        "author": "J.K. Rowling",
        "genre": "Fantasy",
        "publishedYear": 1998,
        "__v": 0,
        "createdAt": "2025-05-21T11:12:27.790Z",
        "updatedAt": "2025-05-21T11:12:27.790Z"
      },
      {
        "_id": "682db51b2cc0f8000a06e489",
        "title": "Harry Potter and the Goblet of Fire",
        "author": "J.K. Rowling",
        "genre": "Fantasy",
        "publishedYear": 2000,
        "__v": 0,
        "createdAt": "2025-05-21T11:12:27.790Z",
        "updatedAt": "2025-05-21T11:12:27.790Z"
      },
      {
        "_id": "682db51b2cc0f8000a06e482",
        "title": "Sapiens: A Brief History of Humankind",
        "author": "Yuval Noah Harari",
        "genre": "Non-Fiction",
        "publishedYear": 2011,
        "__v": 0,
        "createdAt": "2025-05-21T11:12:27.790Z",
        "updatedAt": "2025-05-21T11:12:27.790Z"
      },
      {
        "_id": "682db51b2cc0f8000a06e486",
        "title": "Harry Potter and the Philosopher's Stone",
        "author": "J.K. Rowling",
        "genre": "Fantasy",
        "publishedYear": 1997,
        "__v": 0,
        "createdAt": "2025-05-21T11:12:27.790Z",
        "updatedAt": "2025-05-21T11:12:27.790Z"
      },
      {
        "_id": "682db51b2cc0f8000a06e488",
        "title": "Harry Potter and the Prisoner of Azkaban",
        "author": "J.K. Rowling",
        "genre": "Fantasy",
        "publishedYear": 1999,
        "__v": 0,
        "createdAt": "2025-05-21T11:12:27.790Z",
        "updatedAt": "2025-05-21T11:12:27.790Z"
      }
    ],
    "total": 8,
    "currentPage": 1,
    "totalPages": 2
  }
}
```

---

## 🎯 Design Decisions & Assumptions

### ✅ JWT-based Authentication

- Chosen for stateless session handling.
- JWTs are stored in HTTP-only cookies for security (extendable).

### ✅ One Review Per User Per Book

- Users can only submit one review per book.
- They can update or delete their review later.

### ✅ Review Reference Design

- Reviews are stored in a separate `reviews` collection with references to both users and books.
- Book documents contain an array of review IDs for quick access and aggregation.

### ✅ Book Search Strategy

- Simple text-based matching (`$regex`) on `title` and `author`.
- Can be upgraded to MongoDB Atlas Full-Text Search later.

### ✅ Basic Validation & Security

- Bcrypt is used to hash passwords.

---

## 🧪 Sample Data

### 📖 Book

```json
{
  "title": "Atomic Habits",
  "author": "James Clear",
  "genre": "Self-help",
  "publishedYear": 2018
}
```

### 📝 Review

```json
{
  "rating": 5,
  "comment": "Life-changing read!",
  "book": "<bookId>",
  "user": "<userId>"
}
```

---

## 🧾 License

MIT © [Tejas Nirala](https://github.com/tejasnirala)

---

## 🙌 Contributions

Pull requests and feedback are welcome. If you'd like to contribute, please open an issue first to discuss the change.
