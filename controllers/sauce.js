const Sauce = require("../models/Sauce");
const fs = require("fs");

exports.getAllSauces = (req, res, next) => {
    Sauce.find()
        .then(sauces => res.status(200).json(sauces))
        .catch(e => res.status(400).json({ e }));
};

exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(thing => res.status(200).json(thing))
        .catch(e => res.status(404).json({ e }));
};

exports.createSauce = (req, res, next) => {
    const sauce = JSON.parse(req.body.sauce);
    delete sauce._id;
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
        .catch(e => res.status(400).json({ e }));
};

exports.modifySauce = (req, res, next) => {
    const modifiedSauce = req.file ?
        {
            ...JSON.parse(req.body.sauce),
            imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`
        } : { ...req.body }
    Sauce.updateOne({ _id: req.params.id }, { ...modifiedSauce, _id: req.params.id })
        .then(() => res.status(200).json({ message: "Sauce modifiée !" }))
        .catch(e => res.status(400).json({ e }));
};

exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
            const filename = sauce.imageUrl.split("/images/")[1];
            fs.unlink(`images/${filename}`, () => {
                Sauce.deleteOne({ _id: req.params.id })
                    .then(() => res.status(200).json({ message: "Sauce supprimée !" }))
                    .catch(e => res.status(400).json({ e }));
            })
        })
        .catch(e => res.status(500).json({ e }));
};

exports.rateSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
            if (req.body.like == 1) {
                sauce.usersLiked.push(req.body.userId);
                Sauce.updateOne({ _id: req.params.id }, {
                    sauce,
                    usersLiked: sauce.usersLiked,
                    likes: sauce.usersLiked.length
                })
                    .then(() => res.status(200).json({ message: "Sauce aimée !" }))
                    .catch(e => res.status(400).json({ e }));
            } else if (req.body.like == -1) {
                sauce.usersDisliked.push(req.body.userId);
                Sauce.updateOne({ _id: req.params.id }, {
                    sauce,
                    usersDisliked: sauce.usersDisliked,
                    dislikes: sauce.usersDisliked.length
                })
                    .then(() => res.status(200).json({ message: "Sauce détestée !" }))
                    .catch(e => res.status(400).json({ e }));
            } else if (req.body.like == 0) {
                sauceLiked = sauce.usersLiked.indexOf(req.body.userId);
                sauceDisliked = sauce.usersDisliked.indexOf(req.body.userId);
                if (sauceLiked == -1) {
                    sauce.usersDisliked.splice(sauceDisliked, 1);
                    Sauce.updateOne({ _id: req.params.id }, {
                        sauce,
                        usersDisliked: sauce.usersDisliked,
                        dislikes: sauce.usersDisliked.length
                    })
                        .then(() => res.status(200).json({ message: "Sauce plus détestée !" }))
                        .catch(e => res.status(400).json({ e }));
                } else {
                    sauce.usersLiked.splice(sauceLiked, 1);
                    Sauce.updateOne({ _id: req.params.id }, {
                        sauce,
                        usersLiked: sauce.usersLiked,
                        likes: sauce.usersLiked.length
                    })
                        .then(() => res.status(200).json({ message: "Sauce plus aimée !" }))
                        .catch(e => res.status(400).json({ e }));
                }
            }
        })
        .catch();
};