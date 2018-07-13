import Storage, { ApiResponse, Bucket, File } from "@google-cloud/storage";
import { Response } from "express";
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

    public static cleanUp(res: Response, path: string) {
        res.on("finish", () => {
            removeSync(path);
        });
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
        return this.upload(`profile-${userID}.png`, file.path);
    }

    public downloadProfile(userID: number): Observable<string> {
        return this.download(`profile-${userID}.png`);
    }

    public deleteProfile(userID: number): Observable<[ApiResponse]> {
        return this.delete(`profile-${userID}.png`);
    }

    public uploadReceipt(id: number, file: Express.Multer.File): Observable<[File]> {
        return this.upload(`receipt-${id}.png`, file.path);
    }

    public downloadReceipt(id: number): Observable<string> {
        return this.download(`receipt-${id}.png`);
    }

    public deleteReceipt(id: number): Observable<[ApiResponse]> {
        return this.delete(`receipt-${id}.png`);
    }

    private upload(destination: string, path: string): Observable<[File]> {
        return from(this.bucket.upload(path, { destination }))
            .pipe(
                map((result) => {
                    removeSync(path);
                    return result;
                }),
        );
    }

    private download(path: string): Observable<string> {
        return from(
            this.bucket
                .file(path)
                .download({
                    destination: join("tmp", path),
                })).pipe(
                    map((_) => join("tmp", path)),
        );
    }

    private delete(path: string): Observable<[ApiResponse]> {
        return from(
            this.bucket
                .file(path)
                .delete(),
        );
    }
}
