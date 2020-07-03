// MODULES
const fs = require("fs"); // Permet de gérer les fichiers stockés
// FIN MODULES

// IMPORTATION MODELS
const Sauce = require("../models/Sauce");
// FIN IMPORTATION

// MIDDLEWARE GETALLSAUCES
exports.getAllSauces = (req, res, next) => { // Renvois toutes les sauces - GET
    Sauce.find()
        .then(sauces => res.status(200).json(sauces))
        .catch(e => res.status(400).json(e));
};
// FIN MIDDLEWARE

// MIDDLEWARE GETONESAUCE
exports.getOneSauce = (req, res, next) => { // Renvois une sauce selon son id - GET
    Sauce.findOne({ _id: req.params.id })
        .then(thing => res.status(200).json(thing))
        .catch(e => res.status(404).json(e));
};
// FIN MIDDLEWARE

// MIDDLEWARE CREATESAUCE
exports.createSauce = (req, res, next) => { // Crée une sauce - POST
    const sauce = JSON.parse(req.body.sauce);
    const newSauce = new Sauce({
        ...sauce,
        imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`,
        likes: 0,
        dislikes: 0,
        usersLiked: [],
        usersdisliked: []
    });
    newSauce.save()
        .then(() => res.status(201).json({ message: "Sauce crée !" }))
        .catch(e => res.status(400).json(e));
};
// FIN MIDDLEWARE

// MIDDLEWARE MODIFYSAUCE
exports.modifySauce = (req, res, next) => { // Modifie une sauce selon son id - PUT
    const modifiedSauce = req.file ? // Soit la modification concerne l'image, soit non 
        {
            ...JSON.parse(req.body.sauce), 
            imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`
        } : { ...req.body }
    Sauce.updateOne({ _id: req.params.id }, { ...modifiedSauce, _id: req.params.id })
        .then(() => res.status(200).json({ message: "Sauce modifiée !" }))
        .catch(e => res.status(400).json(e));
};
// FIN MIDDLEWARE

// MIDDLEWARE DELETESAUCE
exports.deleteSauce = (req, res, next) => { // Supprime une sauce selon son id - DELETE
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
            const filename = sauce.imageUrl.split("/images/")[1];
            fs.unlink(`images/${filename}`, () => { // On supprime le fichier image en amont
                Sauce.deleteOne({ _id: req.params.id })
                    .then(() => res.status(200).json({ message: "Sauce supprimée !" }))
                    .catch(e => res.status(400).json(e));
            })
        })
        .catch(e => res.status(500).json(e));
};
// FIN MIDDLEWARE

// MIDDLEWARE RATESAUCE
exports.rateSauce = (req, res, next) => { // Gère les likes et dislikes - POST
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
            if (req.body.like == 1) { // Si un like
                sauce.usersLiked.push(req.body.userId);
                Sauce.updateOne({ _id: req.params.id }, {
                    sauce,
                    usersLiked: sauce.usersLiked,
                    likes: sauce.usersLiked.length
                })
                    .then(() => res.status(200).json({ message: "Sauce aimée !" }))
                    .catch(e => res.status(400).json(e));
            } else if (req.body.like == -1) { // Si un dislike
                sauce.usersDisliked.push(req.body.userId);
                Sauce.updateOne({ _id: req.params.id }, {
                    sauce,
                    usersDisliked: sauce.usersDisliked,
                    dislikes: sauce.usersDisliked.length
                })
                    .then(() => res.status(200).json({ message: "Sauce détestée !" }))
                    .catch(e => res.status(400).json(e));
            } else if (req.body.like == 0) { // Si un vote neutre
                sauceLiked = sauce.usersLiked.indexOf(req.body.userId);
                sauceDisliked = sauce.usersDisliked.indexOf(req.body.userId);
                if (sauceLiked == -1) { // Si l'user n'aimait pas la sauce avant son vote neutre
                    sauce.usersDisliked.splice(sauceDisliked, 1);
                    Sauce.updateOne({ _id: req.params.id }, {
                        sauce,
                        usersDisliked: sauce.usersDisliked,
                        dislikes: sauce.usersDisliked.length
                    })
                        .then(() => res.status(200).json({ message: "Sauce plus détestée !" }))
                        .catch(e => res.status(400).json(e));
                } else { // Si l'user aimait la sauce avant son vote neutre
                    sauce.usersLiked.splice(sauceLiked, 1);
                    Sauce.updateOne({ _id: req.params.id }, {
                        sauce,
                        usersLiked: sauce.usersLiked,
                        likes: sauce.usersLiked.length
                    })
                        .then(() => res.status(200).json({ message: "Sauce plus aimée !" }))
                        .catch(e => res.status(400).json(e));
                }
            }
        })
        .catch(e => res.status(500).json(e));
};
// FIN MIDDLEWARE