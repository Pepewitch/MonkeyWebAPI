import multer from "multer";

export const submissionDocuments = multer({
    storage: multer.diskStorage({}),
}).array("files");

export const userProfile = multer({
    storage: multer.diskStorage({}),
}).single();
