import path from 'path';
import express from 'express';
import multer from 'multer';

const router = express.Router();

const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, 'uploads/');
    },
    filename : (req, file, cb) => {
        cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
    }
});

function checkFileType(file, cb) {
    const filetypes = /jpg|jpeg|png|webp/;
    const extname = path.extname(file.originalname).toLowerCase();
    const mimetypes = /image\/(jpe?g|png|webp)/;
    const mimetype = file.mimetype;

    if(filetypes.test(extname) && mimetypes.test(mimetype)) {
        cb(null, true);
    } else {
        cb('Images only!');
    }
}

const upload = multer({
    storage,
    fileFilter : (req, file, cb) => {
        checkFileType(file, cb);
    }
});

const uploadSingleImage = upload.single('image');

router.post('/', (req, res) => {
    uploadSingleImage(req, res, (err) => {
        if(err) {
            return res.status(400).send({message: err.message});
        }
        else if (req.file){
            res.status(200).send({
                message: 'File uploaded successfully',
                image: `/${req.file.filename}`
            })
        }
        else {
            res.status(400).send({message: 'No file uploaded'});
        }
    })
})

export default router;