import request from "supertest";
import app from "../src/app";

describe("GET /ping", () => {
    it("should return 200", () => {
        return request(app)
            .get("/ping")
            .expect(200);
    });
});

describe("GET /authPing", () => {
    it("should return 400", () => {
        return request(app)
            .get("/authPing")
            .expect(400);
    });
});

// describe("POST /token",() => {
//     it("should return 200",() => {
//         return request(app)
//         .post("/token")
//         .send()
//     })
// })
