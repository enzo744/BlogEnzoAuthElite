import { User } from "../models/userModel.js";
import { Blog } from "../models/blogModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { verifyMail } from "../emailVerify/verifyMail.js";
import { Session } from "../models/sessionModel.js";
import { sendOtpMail } from "../emailVerify/sendOtpMail.js";
import cloudinary from "../utils/cloudinary.js";
import getDataUri from "../utils/dataUri.js";

export const registerUser = async (req, res) => {
  try {
    const { username, email, password, frontendOrigin } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Compilare tutti i campi obbligatori",
      });
    }

    //🔁 Controlla se l'utente già esiste
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "L'utente esiste già con questa email",
      });
    }

    // ✅ Email valida: procedi con la registrazione
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "20m",
    }); // 20 minutes
    verifyMail(token, email, frontendOrigin);
    newUser.token = token;
    await newUser.save();

    return res.status(201).json({
      success: true,
      message: "Utente creato con successo. Controlla la tua email.",
      data: newUser
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const userId = req.userId; // userId impostato nel middleware
    const { username, bio, photoUrl, photoPublicId } = req.body;
    const file = req.file; // req.file è popolato dal middleware multer se un file è inviato

    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Utente non trovato",
      });
    }

    // --- LOGICA PER L'AGGIORNAMENTO E L'ELIMINAZIONE DELLA FOTO ---
    let newPhotoUrl = user.photoUrl; // Inizializza il nuovo URL della foto
    let newPhotoPublicId = user.photoPublicId; // Inizializza il nuovo ID pubblico della foto

    // Se è stato fornito un nuovo file per la foto
    if (file) {
      console.log("File inviato per la foto. Caricamento su cloudinary...");
      const fileUri = getDataUri(file);
      let cloudResponse = await cloudinary.uploader.upload(fileUri);

      // Aggiorna i nuovi valori dell'URL e del Public ID
      newPhotoUrl = cloudResponse.secure_url;
      newPhotoPublicId = cloudResponse.public_id;

      // Se l'utente aveva già una foto e il suo publicId è diverso dal nuovo
      // (Questo indica una sostituzione della foto)
      if (user.photoPublicId && user.photoPublicId !== newPhotoPublicId) {
        console.log(
          `Tentativo di eliminare la vecchia foto con publicId: ${user.photoPublicId}`
        );
        try {
          // Elimina la vecchia foto da cloudinary
          await cloudinary.uploader.destroy(user.photoPublicId);
        } catch (cloudinaryError) {
          console.error(
            `Errore durante l'eliminazione della vecchia foto da Cloudinary (publicId: ${user.photoPublicId}):`,
            cloudinaryError
          );
          // Non bloccare l'aggiornamento del profilo se l'eliminazione fallisce
        }
      }
    }

    // Aggiorna i campi testuali del profilo
    if (username) user.username = username;
    if (bio) user.bio = bio;

    // Aggiorna i campi della foto nel modello utente
    user.photoUrl = newPhotoUrl;
    user.photoPublicId = newPhotoPublicId;

    // Salva il nuovo profilo
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Profilo aggiornato con successo",
      user,
    });
  } catch (error) {
    console.error("Errore nell'aggiornamento del profilo:", error);
    return res.status(500).json({
      success: false,
      message: "Errore nell'aggiornamento del profilo",
    });
  }
};

export const verification = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Il token di autorizzazione è mancante o non valido",
      });
    }

    const token = authHeader.split(" ")[1];

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      if (err.name === "TokenExpiredError") {
        return res.status(401).json({
          success: false,
          message: "Il token è scaduto",
        });
      }
      return res.status(401).json({
        success: false,
        message: "Il token non è valido",
      });
    }

    const user = await User.findById(decoded.id)
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            })
        }

        user.token = null
        user.isVerified = true
        await user.save()

        return res.status(200).json({
            success: true,
            message: "Email verified successfully"
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Compilare tutti i campi obbligatori",
      });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message:
          "Accesso non autorizzato. Controlla email e password.",
      });
    }
    const passwordCheck = await bcrypt.compare(password, user.password);
    if (!passwordCheck) {
      return res.status(401).json({
        success: false,
        message: "Password errata",
      });
    }
    
    // check if user is verified
    if (user.isVerified !== true) {
      return res.status(403).json({
        success: false,
        message: "Devi prima verificare il tuo indirizzo email. Controlla la posta.",
      });
    }

    // check for existing session and delete it
        const existingSession = await Session.findOne({ userId: user._id });
        if (existingSession) {
            await Session.deleteOne({ userId: user._id })
        }

    // Crea nuova sessione
    await Session.create({ userId: user._id });

    // Genera token JWT
    const accessToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "10d", // 10 days
    }); // 10 days
    const refreshToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "30d",
    }); // 30 days

    user.isLoggedIn = true;
    await user.save();

    // ✅ Rimuovi campi sensibili prima di inviare user
    const { password: _, token, otp, otpExpiry, ...userData } = user.toObject();

    return res.status(200).json({
      success: true,
      message: `Bentornato ${user.username}`,
      accessToken,
      refreshToken,
      user
    });
  } catch (error) {
    console.error("Errore login:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json({
      success: true,
      message: "Utenti recuperati con successo",
      total: users.length,
      users,
    })
  } catch (error) {
    console.error("Error fetching user list:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch users",
    });
  }
}

export const logoutUser = async (req, res) => {
  try {
    const userId = req.userId;
    await Session.deleteMany({ userId });
    await User.findByIdAndUpdate(userId, { isLoggedIn: false });
    return res.status(200).json({
      success: true,
      message: "Logout eseguito con successo!",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiry = new Date(Date.now() + 1000 * 60 * 20); //20 minutes

    user.otp = otp;
    user.otpExpiry = expiry;
    await user.save();
    await sendOtpMail(email, otp);
    return res.status(200).json({
      success: true,
      message: "OTP inviato con successo!",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const verifyOTP = async (req, res) => {
  const { otp } = req.body;
  const email = req.params.email;

  if (!otp) {
    return res.status(400).json({
      success: false,
      message: "OTP obbligatorio",
    });
  }
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    if (!user.otp || !user.otpExpiry) {
      return res.status(400).json({
        success: false,
        message: "OTP non valido o già utilizzato",
      });
    }
    if (user.otpExpiry < new Date()) {
      return res.status(400).json({
        success: false,
        message: "L'OTP è scaduto. Richiedine uno nuovo", 
      });
    }
    if (otp !== user.otp) {
      return res.status(400).json({
        success: false,
        message: "OTP non valido",
      });
    }
    user.otp = null;
    user.otpExpiry = null;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "OTP verificato con successo",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error internal server",
    });
  }
};

export const changePassword = async (req, res) => {
  const { newPassword, confirmPassword } = req.body;
  const email = req.params.email;
  if (!newPassword || !confirmPassword) {
    return res.status(400).json({
      success: false,
      message: "Compilare tutti i campi obbligatori",
    });
  }
  if (newPassword !== confirmPassword) {
    return res.status(400).json({
      success: false,
      message: "Le password non corrispondono",
    });
  }
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();
    return res.status(200).json({
      success: true,
      message: "Password modificata con successo",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const userId = req.userId; // Ottiene l'ID dell'utente autenticato
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is missing from the request.",
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Utente non trovato.",
      });
    } // Fase 1: Eliminare tutti i blog dell'utente
    const userBlogs = await Blog.find({ author: userId });
    for (const blog of userBlogs) {
      // Elimina la thumbnail del blog da Cloudinary
      if (blog.thumbnailPublicId) {
        try {
          await cloudinary.uploader.destroy(blog.thumbnailPublicId);
          console.log(
            `Thumbnail del blog ${blog._id} eliminata da Cloudinary.`
          );
        } catch (cloudinaryError) {
          console.error(
            `Errore nell'eliminazione della thumbnail da Cloudinary:`,
            cloudinaryError
          );
        }
      } 
    } 
    // Dopo aver eliminato thumbnail, elimina i blog
    await Blog.deleteMany({ author: userId }); 
    // Fase 2: Eliminare  dell'utente su blog altrui
    if (user.photoPublicId) {
      try {
        await cloudinary.uploader.destroy(user.photoPublicId);
        console.log(
          `Foto profilo dell'utente ${userId} eliminata da Cloudinary.`
        );
      } catch (cloudinaryError) {
        console.error(
          `Errore nell'eliminazione della foto profilo da Cloudinary:`,
          cloudinaryError
        );
      }
    } // Fase 4: Eliminare l'utente dal database
    await User.findByIdAndDelete(userId); 
    
    // Fase 5: Logout forzato
    res.clearCookie("token", { maxAge: 0 }); // Rimuovi il token di autenticazione

    return res.status(200).json({
      success: true,
      message:
        "Account eliminato con successo. Tutti i blog associati all'utente sono stati cancellati.",
    });
  } catch (error) {
    console.error("Errore durante l'eliminazione dell'utente:", error);
    return res.status(500).json({
      success: false,
      message: "Si è verificato un errore durante l'eliminazione dell'account.",
      error: error.message,
    });
  }
};
