import express from "express";
import { isAuthenticated } from "../middleware/isAuthenticated.js";
import { singleUpload } from "../middleware/multer.js";

import {
  createBlog,
  deleteBlog,
  getAllBlogs,
  getOwnBlogs,
  getPublishedBlog,
  getSingleBlog,
  searchBlogs,
  togglePublishBlog,
  updateBlog,
} from "../controllers/blogController.js";

const router = express.Router();

// 1 ROTTE STATICHE (definite prima delle dinamiche)
// Per “statica” si intende una rotta con un path fisso, es. /search
// Per “dinamica” si intende una rotta con parametri, es. /:id

// 2. Rotte più specifiche prima di quelle più generiche
// Se hai più parametri, ordina dalla più specifica alla più generica:
router.route("/get-own-blogs").get(isAuthenticated, getOwnBlogs);
router.route("/get-all-blogs").get(getAllBlogs);
router.route("/get-published-blogs").get(getPublishedBlog);
router.route("/search").get(isAuthenticated, searchBlogs);
router.route("/delete/:id").delete(isAuthenticated, deleteBlog);
router.route("/").post(isAuthenticated, createBlog);

// ROTTE DINAMICHE (dopo quelle statiche)
router.route("/:blogId/publish").patch(isAuthenticated, togglePublishBlog);
router.route("/:blogId").put(isAuthenticated, singleUpload, updateBlog);
router.route("/:blogId").get(isAuthenticated, getSingleBlog);

export default router;
