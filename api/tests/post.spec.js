require('dotenv').config();
const express = require('express');
const cors = require('cors');

const api = express();
api.use(cors());
api.use(express.json());

const request = require("supertest");

const postRoutes = require('../routes/postRoutes');

api.use(postRoutes);

describe("/posts", () => {
    it("GET /", async () => {
        const resp = await request(api).get('/');
        expect(resp.statusCode).toBe(200);
    });

    //GET /top

    it("GET /:id", async () => {
        const resp = await request(api).get('/2');
        expect(resp.statusCode).toBe(200);
        expect(resp.body).toStrictEqual({
            post_id: 2,
            title: "The Best Hikes in the Mountains",
            content: "If you love hiking and are looking for new trails to explore, check out these top picks...",
            category: "Hiking",
            votes: 0,
            created_date: expect.any(String),
            user_id: 1
        });
    });

    it("PATCH /:id", async () => {
        const resp = await request(api).patch('/3').send({
            votes: 25
        });
        expect(resp.statusCode).toBe(200);
        expect(resp.body).toStrictEqual({
            post_id: 3,
            votes: 25
        });
    });

    it("GET /top", async () => {
        const resp = await request(api).get('/top');
        expect(resp.statusCode).toBe(200);
        expect(resp.body).toStrictEqual({
            post_id: 3,
            title: "Tips for Working from Home",
            content: "Working from home can be a challenge, but with these tips and tricks...",
            category: "Work",
            votes: expect.any(Number),
            created_date: expect.any(String),
            user_id: 3
        });
    }); 
});
