const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const AdmZip = require('adm-zip'); // Import adm-zip for extracting ZIP files

const router = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path.join(__dirname, '../uploads', req.body.userId, req.body.projectName);
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname); // Keep original filename
    },
});

const upload = multer({ storage });

// Endpoint to handle ZIP uploads
router.post('/upload', upload.single('file'), async (req, res) => {
    try {
        const { userId, projectName } = req.body;
        const fileName = req.file.originalname;
        let result = fileName.replace(/\.zip$/, "");
        // Ensure the uploaded file is a ZIP file
        if (path.extname(req.file.originalname) !== '.zip') {
            return res.status(400).json({ message: 'Please upload a ZIP file' });
        }

        const zipPath = req.file.path; // Path to the uploaded ZIP file
        const extractPath = path.join(__dirname, '../uploads', userId, projectName); // Folder to extract contents

        // Extract the ZIP file
        const zip = new AdmZip(zipPath);
        zip.extractAllTo(extractPath, true); // Extract files to the target directory

        // Optionally, delete the uploaded ZIP file after extraction
        fs.unlinkSync(zipPath);

        // Generate the hosted URL for the project
        const hostedUrl = `${req.protocol}://${req.get('host')}/uploads/${userId}/${projectName}/${result}/index.html`;

        res.status(200).json({
            message: 'Project uploaded and extracted successfully',
            hostedUrl,
        });
    } catch (error) {
        res.status(500).json({ message: 'Error processing the ZIP file', error: error.message });
    }
});

module.exports = router;
