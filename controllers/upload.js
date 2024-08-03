const multer = require('multer');
const path = require('path');
const fs = require('fs');

const UPLOAD_DIR = path.join(__dirname, 'uploads');
if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR);
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, UPLOAD_DIR);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
})

const upload = multer({storage: storage});

const handleFileUpload = (req, res) => {
    try {
        const filePath = req.file.path;
        res.json({imageUrl: `http://localhost:3000/${filePath}`});
    } catch (err) {
        console.error(err);
        res.status(500).json('Error uploading file');
    }
}

module.exports = {
    upload: upload,
    handleFileUpload: handleFileUpload
};