import Storage, { Bucket, File } from "@google-cloud/storage";
import { join } from "path";
import { from, Observable } from "rxjs";
import { GOOGLE_APPLICATION_CREDENTIALS, GOOGLE_CLOUD_PROJECT_ID } from "../util/secrets";

export class FileManager {

    public static getInstance(): FileManager {
        if (!this.instance) {
            this.instance = new FileManager();
        }
        return this.instance;
    }

    private static instance: FileManager;
    private static readonly BUCKET_NAME = "monkey-storage";

    private storage: Storage.Storage;
    private bucket: Bucket;

    private constructor() {
        this.storage = Storage({
            keyFilename: join(__dirname, `../../key/${GOOGLE_APPLICATION_CREDENTIALS}`),
            projectId: GOOGLE_CLOUD_PROJECT_ID,
        });
        this.bucket = this.storage.bucket(FileManager.BUCKET_NAME);
        this.storage.getBuckets().then((result) => {
            console.log(result);
        }).catch((err) => {
            console.log(err);
        });
    }

    public uploadProfile(file: Express.Multer.File): Observable<[File]> {
        return from(this.bucket.upload(join(file.destination, file.filename)));
    }

}
