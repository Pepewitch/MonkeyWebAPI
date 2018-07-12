import Storage, { Bucket, File } from "@google-cloud/storage";
import { removeSync } from "fs-extra";
import { join } from "path";
import { from, Observable } from "rxjs";
import { map } from "rxjs/operators";
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
    }

    public uploadProfile(userID: number, file: Express.Multer.File): Observable<[File]> {
        return from(this.bucket.upload(file.path, {
            destination: `profile-${userID}.png`,
        })).pipe(
            map((result) => {
                removeSync(file.path);
                return result;
            }),
        );
    }

    public getProfile(userID: number): Observable<string> {
        return from(
            this.bucket
                .file(`profile-${userID}.png`)
                .getSignedUrl({
                    action: "read",
                }),
        ).pipe(
            map((result) => result[0]),
        );
    }

}
