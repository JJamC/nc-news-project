const request = require('supertest')
const db = require('../connection')
const testData = require('../data/test-data')
const seed = require('../seeds/seed')
const app = require('../../app')
const endPoints = require('../../endpoints.json')

beforeEach(() => seed(testData));

afterAll(() => db.end());

describe('/api/topics', () => {
test('GET 200: response contains all topics', () => {
    return request(app)
    .get("/api/topics")
    .expect(200)
    .then(({ body }) => {
        const { topics } = body;
        expect(topics.length).toBe(3)
        topics.forEach((topic) => {
            expect.objectContaining({
                description: expect.any(String),
                slug: expect.any(String)
            })
        })
        })
 })
test('GET 404: user enters invalid endpoint', () => {
    return request(app)
    .get("/api/tropicz")
    .expect(404)
    .then(({ body }) => {
        const { msg } = body
        expect(msg).toBe('Not Found')
    })
})
});

describe('/api', () => {
test("GET 200: responds with an object of endpoints", () => {
    return request(app)
    .get("/api")
    .expect(200)
    .then(( { body } ) => {
        expect(body).toEqual(endPoints)
    })
})
})