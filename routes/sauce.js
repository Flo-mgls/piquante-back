// MODULES
const express = require("express");
const router = express.Router();
// FIN MODULES

// IMPORTATION MIDDLEWARES
const auth = require("../middleware/auth"); // Crée un token d'identification
const multer = require("../middleware/multer-config"); // Permet d'envoyer un fichier dans la requête
// FIN IMPORTATION

// IMPORTATION CONTROLLERS
const sauceCtrl = require("../controllers/sauce");
// FIN IMPORTATION

// ROUTES
router.get("/", auth, sauceCtrl.getAllSauces);
router.get("/:id", auth, sauceCtrl.getOneSauce);
router.post("/", auth, multer, sauceCtrl.createSauce);
router.put("/:id", auth, multer, sauceCtrl.modifySauce);
router.delete("/:id", auth, sauceCtrl.deleteSauce);
router.post("/:id/like", auth, sauceCtrl.rateSauce);
// FIN ROUTES

module.exports = router;