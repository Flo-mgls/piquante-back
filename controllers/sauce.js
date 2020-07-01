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
    const newSauce = new Sauce({
        ...req.body
    });
    newSauce.save()
    .then(() => res.status(201).json({message: "Sauce crée !"}))
    .catch(e => res.status(400).json({e}));
};

exports.modifySauce = (req, res, next) => {

};

exports.deleteSauce = (req, res, next) => {

};