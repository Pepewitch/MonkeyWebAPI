import request from "supertest";
import app from "../src/app";

describe("GET /post", () => {
    it("should return 200", () => {
        return request(app)
            .get("/ping")
            .expect(200);
    });
});
