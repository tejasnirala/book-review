import cookieParser from "cookie-parser";
import express from "express";
import morgan from "morgan";
import connect from "./db/db.js";
import { isAuthenticated } from "./middlewares/auth.js";
import {
  signup,
  login,
  addBook,
  allBooks,
  getBookById,
  addBookReview,
  updateReview,
  deleteReview,
} from "./controllers/index.js";

connect();

const app = express();

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", (req, res) => {
  res.status(200).send("hello world...!");
});

app.post("/signup", signup);
app.post("/login", login);

app.post("/books", isAuthenticated, addBook);
app.get("/books", allBooks);
app.get("/books/:id", getBookById);
app.post("/books/:id/reviews", isAuthenticated, addBookReview);

app.put("/reviews/:id", isAuthenticated, updateReview);
app.delete("/reviews/:id", isAuthenticated, deleteReview);

app.get("/search", (req, res) => {
  res.status(200).send("hello g");
});

export default app;
