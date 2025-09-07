import { Blog } from "../models/blogModel.js";
import cloudinary from "../utils/cloudinary.js";
import getDataUri from "../utils/dataUri.js";
// import { User } from "../models/userModel.js";

export const createBlog = async (req, res) => {
  try {
    const { title, category } = req.body;

    if (!req.userId) {
      // ✅ Aggiungi questo controllo
      return res.status(401).json({
        success: false,
        message: "Autenticazione richiesta per creare un blog.",
      });
    }

    if (!title || !category) {
      return res.status(400).json({
        success: false,
        message: "Please provide all the required fields",
      });
    }

    const blog = await Blog.create({
      title,
      category,
      author: req.userId,
    });

    // Popola l'autore per restituirlo al frontend
    const createBlog = await Blog.findById(blog._id).populate({
      path: "author",
      select: "username photoUrl",
    });

    return res.status(201).json({
      success: true,
      message: "Blog created successfully",
      blog: createBlog,
    });
  } catch (error) {
    console.error("Error creating blog:", error); // Usa console.error
    return res.status(500).json({
      success: false, // Aggiungi success: false
      message: "Failed to create blog",
      error: error.message, // Includi l'errore per il debug
    });
  }
};

export const updateBlog = async (req, res) => {
  try {
    const blogId = req.params.blogId;
    // ✅ 1. Recupera l'ID dell'utente autenticato
    const authorId = req.userId;
    const { title, subtitle, category, description, campoLibero, campoLibero2 } = req.body;
    const file = req.file; // req.file è il file della thumbnail, se presente

    if (!req.userId) {
      // ✅ Aggiungi questo controllo
      return res.status(401).json({
        success: false,
        message: "Autenticazione richiesta per modificare un blog.",
      });
    }
    let blog = await Blog.findById(blogId); // Cerca il blog con l'ID specificato per accedere alla vecchia thumbnail
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    // ✅ Corretto: Usa .equals() per confrontare in modo sicuro
    if (!blog.author.equals(req.userId)) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to update this blog",
      });
    }

    const oldThumbnailPublicId = blog.thumbnailPublicId; // Salva il publicId della vecchia thumbnail

    let newThumbnailUrl = blog.thumbnail; // Inizializza il nuovo URL della thumbnail
    let newThumbnailPublicId = blog.thumbnailPublicId; // Inizializza il nuovo publicId della thumbnail

    // let fileUri;
    // Se è stato caricato un nuovo file per la thumbnail
    if (file) {
      const fileUri = getDataUri(file);
      const uploadedThumbnail = await cloudinary.uploader.upload(fileUri);

      newThumbnailUrl = uploadedThumbnail.secure_url;
      newThumbnailPublicId = uploadedThumbnail.public_id;

      // Se l'utente aveva già una thumbnail
      if (oldThumbnailPublicId) {
        try {
          // Elimina la vecchia thumbnail da cloudinary
          await cloudinary.uploader.destroy(oldThumbnailPublicId);
        } catch (cloudinaryError) {
          console.error(
            `Errore durante l'eliminazione della vecchia thumbnail da Cloudinary:`,
            cloudinaryError
          );
          // Non bloccare l'aggiornamento del blog se l'eliminazione fallisce
        }
      }
    }

    // Costruzione dell'oggetto per l'aggiornamento del blog
    const updateData = {
      title: title || blog.title, // Usa il valore fornito se non è vuoto, altrimenti mantiene il vecchio
      subtitle: subtitle || blog.subtitle,
      description: description || blog.description,
      category: category || blog.category,
      campoLibero: campoLibero || blog.campoLibero,
      campoLibero2: campoLibero2 || blog.campoLibero2,
      thumbnail: newThumbnailUrl, // L'URL della thumbnail viene impostata sul nuovo file
      thumbnailPublicId: newThumbnailPublicId, // L'ID pubblico della thumbnail viene impostata sul nuovo file
    };

    // Aggiorna il blog nel database
    const updatedBlog = await Blog.findByIdAndUpdate(blogId, updateData, {
      new: true,
    }).populate({
      path: "author",
      select: "username photoUrl", // Seleziona solo i campi di username e photoUrl dell'autore
    });

    return res.status(200).json({
      success: true,
      message: "Blog updated successfully",
      blog: updatedBlog, // Restituisce il blog aggiornato
    });
  } catch (error) {
    console.error("Error updating blog:", error); // Usa console.error
    res.status(500).json({
      success: false,
      message: "Error updating blog",
      error: error.message,
    });
  }
};

// Funzione per recuperare un singolo blog tramite ID
export const getSingleBlog = async (req, res) => {
  try {
    const { blogId } = req.params;

    // Cerca il blog con l'ID specificato e popola i campi dell'autore
    const blog = await Blog.findById(blogId).populate({
      path: "author",
      select: "username photoUrl",
    });

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Blog fetched successfully",
      blog: blog,
    });
  } catch (error) {
    console.error("Error fetching single blog:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching single blog",
      error: error.message,
    });
  }
};

export const getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 }).populate({
      path: "author",
      select: "username photoUrl",
    });
    res.status(200).json({
      success: true,
      message: "Blogs fetched successfully",
      blogs: blogs,
    });
  } catch (error) {
    console.error("Error fetching all blogs:", error); // Usa console.error
    res.status(500).json({
      success: false,
      message: "Error fetching blogs",
      error: error.message,
    });
  }
};

export const getPublishedBlog = async (_, res) => {
  try {
    const blogs = await Blog.find({ isPublished: true })
      .sort({ createdAt: -1 })
      .populate({
        path: "author",
        select: "username photoUrl",
      });

    if (!blogs) {
      return res.status(404).json({
        success: false,
        message: "Blogs published not found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Blogs published fetched successfully",
      blogs: blogs,
    });
  } catch (error) {
    console.error("Error getting published blogs:", error); // Usa console.error
    return res.status(500).json({
      success: false,
      message: "Failed to get published blogs",
      error: error.message, // Includi l'errore per il debug
    });
  }
};

export const togglePublishBlog = async (req, res) => {
  try {
    const { blogId } = req.params;
    const { publish } = req.query; // true o false come stringa

    const blog = await Blog.findById(blogId);
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    // Converte la stringa 'true/false' in booleana
    const shouldPublish = publish === "true";

    // Imposta lo stato di pubblicazione in base al parametro della query
    blog.isPublished = shouldPublish;
    await blog.save();

    const statusMessage = blog.isPublished
      ? "Blog pubblicato"
      : "Blog non pubblicato";
    return res.status(200).json({
      success: true,
      message: `Blog ${statusMessage}`,
      blog: blog, // Restituisce il blog aggiornato
    });
  } catch (error) {
    console.error("Error toggling publish status:", error); // Usa console.error
    return res.status(500).json({
      success: false,
      message: "Failed to update status",
      error: error.message,
    });
  }
};

// Funzione usata per recuperare i blog di un utente autenticato
export const getOwnBlogs = async (req, res) => {
  try {
    const userId = req.userId; // userId impostato nel middleware isAuthenticated
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "userId is required",
      });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 1000;
    const skip = (page - 1) * limit;

    const total = await Blog.countDocuments({ author: userId });

    const blogs = await Blog.find({ author: userId })
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate({
        path: "author",
        select: "username photoUrl",
      });

    if (blogs.length === 0) {
      return res.status(200).json({
        success: true,
        blogs: [],
        message: "Nessun blog creato da questo utente",
        total: 0,
      });
    }
    return res.status(200).json({
      success: true,
      blogs,
      message: "Blogs fetched successfully",
      total,
    });
  } catch (error) {
    console.error("Error fetching own blogs:", error); // Usa console.error
    res.status(500).json({
      success: false, // Aggiungi success: false
      message: "Error fetching blogs",
      error: error.message,
    });
  }
};

export const deleteBlog = async (req, res) => {
  try {
    const blogId = req.params.id;
    const authorId = req.userId;
    const blog = await Blog.findById(blogId);

    // Verifica che l'ID dell'autore sia presente
    if (!authorId) {
      return res.status(401).json({
        success: false,
        message: "Autenticazione richiesta.",
      });
    }

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    // Verifica che l'utente autenticato sia l'autore del blog
    if (!blog.author.equals(authorId)) {
      return res.status(403).json({
        success: false,
        message: "Non autorizzato a eliminare questo blog",
      });
    }

    // Elimina la thumbnail da Cloudinary se esiste
    if (blog.thumbnailPublicId) {
      try {
        await cloudinary.uploader.destroy(blog.thumbnailPublicId);
        // console.log(
        //   `Thumbnail del blog con publicId ${blog.thumbnailPublicId} eliminata da Cloudinary.`
        // );
      } catch (cloudinaryError) {
        console.error(
          `Errore durante l'eliminazione della thumbnail del blog da Cloudinary:`,
          cloudinaryError
        );
        // Non bloccare l'eliminazione del blog se l'eliminazione della thumbnail fallisce
      }
    }
    // Elimina il blog dal database
    await Blog.findByIdAndDelete(blogId);

    return res.status(200).json({
      success: true,
      message: "Blog eliminato con successo",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting blog",
      error: error.message,
    });
  }
};

export const searchBlogs = async (req, res) => {
  try {
    const query = req.query.q; // può anche essere undefined
    const userId = req.userId;
    const publishedFilter = req.query.published; // "true" | "false" | undefined

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "Utente non fornito.",
      });
    }

    const searchConditions = {
      author: userId,
    };

    // Applica filtro sul testo, se presente
    if (query && query.trim()) {
      const regex = new RegExp(query.trim(), "i");
      searchConditions.$or = [
        { title: regex },
        { subtitle: regex },
        { category: regex },
      ];
    }

    // Applica filtro su pubblicazione, se presente
    if (publishedFilter === "true") {
      searchConditions.isPublished = true;
    } else if (publishedFilter === "false") {
      searchConditions.isPublished = false;
    }

    const blogs = await Blog.find(searchConditions)
      .sort({ createdAt: -1 })
      .populate({
        path: "author",
        select: "username photoUrl",
      });

    return res.status(200).json({
      success: true,
      message: "Risultati ottenuti con successo",
      blogs,
    });

  } catch (error) {
    console.error("Errore nella ricerca:", error);
    return res.status(500).json({
      success: false,
      message: "Errore durante la ricerca dei blog",
    });
  }
};

export const removeThumbnail = async (req, res) => {
    try {
        const { id } = req.params;
        const blog = await Blog.findById(id);

        if (!blog) {
            return res.status(404).json({
                success: false,
                message: "Blog non trovato.",
            });
        }
        
        // Controlla se esiste un public_id da eliminare
        const publicId = blog.thumbnailPublicId;
        if (!publicId) {
            return res.status(400).json({
                success: false,
                message: "Nessuna thumbnail da rimuovere per questo blog.",
            });
        }

        // 1. Elimina l'immagine da Cloudinary
        const result = await cloudinary.uploader.destroy(publicId);

        if (result.result !== 'ok') {
            // Se Cloudinary restituisce un errore, non procedere
            throw new Error("Errore durante l'eliminazione dell'immagine da Cloudinary.");
        }
        
        // 2. Aggiorna il documento nel database
        blog.thumbnail = "";
        blog.thumbnailPublicId = "";
        await blog.save();

        return res.status(200).json({
            success: true,
            message: "Thumbnail rimossa con successo.",
        });

    } catch (error) {
        console.error("Errore nella rimozione della thumbnail:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Errore del server durante la rimozione della thumbnail.",
        });
    }
};

