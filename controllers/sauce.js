const Sauce = require("../models/Sause");

exports.getAllSauces = (req, res, next) => {
    Sauce.find()
    .then(sauces => res.status(200).json(sauces))
    .catch(e => res.status(400).json({e}));
};

exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id})
    .then(thing => res.status(200).json(thing))
    .catch(error => res.status(404).json({ error }));
};

exports.createSauce = (req, res, next) => {
    const sauce = JSON.parse(req.body.sauce);
    const newSauce = new Sauce({
        ...sauce,
        imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}` 
    });
    newSauce.save()
    .then(() => res.status(201).json({message: "Sauce crée !"}))
    .catch(e => res.status(400).json({e}));
};

exports.modifySauce = (req, res, next) => {
    Sauce.updateOne({ _id: req.params.id}, { ...req.body, _id: req.params.id})
    .then(() => res.status(200).json({ message: "Sauce modifiée !"}))
    .catch(e => res.status(400).json({e}));
};

exports.deleteSauce = (req, res, next) => {
    Sauce.deleteOne({ _id: req.params.id})
    .then(() => res.status(200).json({ message: "Sauce supprimée !"}))
    .catch(e => res.status(400).json({e}));
};