// Importer mongoose
const mongoose = require('mongoose');

// Définir le schéma (structure) d'un étudiant
const etudiantSchema = new mongoose.Schema({
    
    // Champ nom :  texte obligatoire
    nom: {
        type: String,
        required: [true, 'Le nom est obligatoire'],
        trim: true  // Supprime les espaces au début et à la fin
    },
    
    // Champ prénom : texte obligatoire
    prenom: {
        type: String,
        required: [true, 'Le prénom est obligatoire'],
        trim:  true
    },
    
    // Champ email : texte obligatoire, unique, avec validation
    email: {
        type: String,
        required:  [true, 'L\'email est obligatoire'],
        unique: true,  // Pas de doublons
        lowercase: true,  // Convertit en minuscules
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Email invalide']
    },
    
    // Champ filière : choix limité parmi une liste
    filiere: {
        type: String,
        required: [true, 'La filière est obligatoire'],
        enum: ['Informatique', 'Génie Civil', 'Électronique', 'Mécanique']
    },
    
    // Champ année : nombre entre 1 et 5
    annee: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    
    // Champ moyenne : nombre entre 0 et 20 (optionnel)
    moyenne: {
        type: Number,
        min: 0,
        max: 20,
        default:  null
    },
    
    // Date d'inscription automatique
    dateInscription: {
        type: Date,
        default: Date.now
    }
    
}, {
    timestamps: true  // Ajoute createdAt et updatedAt automatiquement
});

// Créer et exporter le modèle
module.exports = mongoose.model('Etudiant', etudiantSchema);

// Recherche avancée avec filtres multiples
exports.advancedSearch = async (req, res) => {
    try {
        const { nom, filiere, anneeMin, anneeMax, moyenneMin } = req.query;
        let filter = { actif: true };

        if (nom) filter.nom = new RegExp(nom, 'i');
        if (filiere) filter.filiere = filiere;
        if (anneeMin || anneeMax) {
            filter.annee = {};
            if (anneeMin) filter.annee.$gte = parseInt(anneeMin);
            if (anneeMax) filter.annee.$lte = parseInt(anneeMax);
        }
        if (moyenneMin) filter.moyenne = { $gte: parseFloat(moyenneMin) };

        const etudiants = await Etudiant.find(filter);

        res.status(200).json({
            success: true,
            count: etudiants.length,
            filters: req.query,
            data: etudiants
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erreur serveur',
            error: error.message
        });
    }
};