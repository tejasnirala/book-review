# 📚 Book Review API

A secure and scalable REST API to manage users, books, and reviews — built using **Node.js**, **Express.js**, and **MongoDB**.  
It supports **user authentication**, **book CRUD**, **review operations**, **search**, and is ready to be containerized or deployed to cloud platforms.

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
├── controllers             # Engpoint handlers
├── db                      # Database configs
├── middlewares             # Custom middleware
├── models                  # Mongoose schemas
├── app.js                  # Express app initialization
├── server.js               # Server entry point
├── .env.example            # Sample environment variables
├── .gitignore              # Git ignore file
├── package-lock.json
├── package.json
├── README.md
└── LICENSE
```

---

## 🚀 Local Setup

### 1. Clone the repository

```bash
git clone https://github.com/tejasnirala/book-review-api.git
cd book-review-api
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
curl -X POST http://localhost:3000/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Tejas",
    "email": "tejas@example.com",
    "password": "securePassword123"
  }'
```

### 🔐 Login (curl)

```bash
curl -X POST http://localhost:3000/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "tejas@example.com",
    "password": "securePassword123"
  }'
```

### 📚 Create Book (Postman)

- **Method**: POST
- **URL**: `http://localhost:3000/books`
- **Headers**:

  - `Authorization: Bearer <JWT_TOKEN>`
  - `Content-Type: application/json`

- **Body** (raw JSON):

```json
{
  "title": "The Great Gatsby",
  "author": "F. Scott Fitzgerald",
  "genre": "Classic",
  "publishedYear": 1925
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
