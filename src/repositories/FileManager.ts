import Storage from "@google-cloud/storage";
import { join } from "path";
import { GOOGLE_APPLICATION_CREDENTIALS, GOOGLE_CLOUD_PROJECT_ID } from "../util/secrets";

export class FileManager {

    public static getInstance(): FileManager {
        if (!this.instance) {
            this.instance = new FileManager();
        }
        return this.instance;
    }

    private static instance: FileManager;

    private storage: Storage.Storage;

    private constructor() {
        this.storage = Storage({
            keyFilename: join(__dirname, `../../key/${GOOGLE_APPLICATION_CREDENTIALS}`),
            projectId: GOOGLE_CLOUD_PROJECT_ID,
        });
        this.storage.getBuckets().then((result) => {
            console.log(result);
        }).catch((err) => {
            console.log(err);
        });
    }

}
