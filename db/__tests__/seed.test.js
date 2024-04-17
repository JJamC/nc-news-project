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
    .get('/api/topics')
    .expect(200)
    .then(({ body }) => {
        const { topics } = body;
        expect(topics.length).toBe(3)
        topics.forEach((topic) => {
            expect(topic).toMatchObject(expect.objectContaining({
                description: expect.any(String),
                slug: expect.any(String)
            }))
        })
        })
 })
test('GET 404: responds with a 404 error message when user enters invalid endpoint', () => {
    return request(app)
    .get('/api/tropicz')
    .expect(404)
    .then(({ body }) => {
        const { msg } = body
        expect(msg).toBe('Not Found')
    })
})
});

describe('/api', () => {
test('GET 200: responds with an object of endpoints"', () => {
    return request(app)
    .get('/api')
    .expect(200)
    .then(({ body } ) => {
        expect(body).toEqual(endPoints)
    })
})
})

describe('/api/articles/:article_id', () => {
test('GET 200: responds with the article that matches the given article_id', () => {
    return request(app)
    .get('/api/articles/1')
    .expect(200)
    .then(({ body }) => {
        const { article } = body
            expect(article).toMatchObject(expect.objectContaining(
                {
                    title: "Living in the shadow of a great man",
                    topic: "mitch",
                    author: "butter_bridge",
                    body: "I find this existence challenging",
                    created_at: expect.any(String), 
                    votes: 100,
                    article_img_url:
                      "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
                  }
                )
            )
        })
        })  
    })
test('GET 404: responds with 404 error message if id does not exist', () => {
    return request(app)
    .get('/api/articles/9999')
    .expect(404)
    .then(({ body }) => {
        const { msg } = body
        expect(msg).toBe('Not Found')
    })
})
test('GET 400: responds with 400 error message if id is entered in an invalid format', () => {
    return request(app)
    .get('/api/articles/nfafns')
    .expect(400)
    .then(({ body }) => {
        const { msg } = body
        expect(msg).toBe('Bad Request')
    })
})

describe('/api/articles', () => {
test('GET 200: responds with array of article objects', () => {
    return request(app)
    .get('/api/articles')
    .expect(200)
    .then(({ body }) => {
        const { articles } = body
        expect(articles.length).toBe(13)
        articles.forEach((article) => {
            expect(article).toMatchObject(expect.objectContaining({
                article_id: expect.any(Number),
                title: expect.any(String),
                topic: expect.any(String),
                author: expect.any(String),
                created_at: expect.any(String),
                votes: expect.any(Number),
                article_img_url: expect.any(String),
                comment_count: expect.any(Number)
            }))
        })
    })
})
test('GET 200: responds with array of article objects in descending order', () => {
    return request(app)
    .get('/api/articles')
    .expect(200)
    .then(({ body }) => {
        const { articles } = body
        expect(articles).toBeSortedBy('created_at',{ descending: true })
    })
})
})

describe('/api/articles/:article_id/comments', () => {
test('GET 200: responds with an array of comments for the given article_id', () => {
    return request(app)
    .get('/api/articles/1/comments')
    .expect(200)
    .then(({ body }) => {
    const { comments } = body
    expect(comments.length).toBe(11)
    comments.forEach((comment) => {
        expect(comment).toMatchObject(expect.objectContaining({
            comment_id: expect.any(Number),
            votes: expect.any(Number),
            created_at: expect.any(String),
            author: expect.any(String),
            body: expect.any(String),
            article_id: 1
            }))
        })
    })
})
test('GET 200: responds with array of comments from most recent to least recent', () => {
    return request(app)
    .get('/api/articles/1/comments')
    .expect(200)
    .then(({ body }) => {
        const { comments } = body
        expect(comments).toBeSortedBy('created_at',{ descending: true })
    })
})
test('GET 200: responds with an empty array if article_id is valid but has no comments', () => {
    return request(app)
    .get('/api/articles/10/comments')
    .expect(200)
.   then(({ body }) => {
    const { comments } = body
        expect(comments.length).toBe(0)
})
})
test('GET 404: responds with error message if article_id is not found', () => {
    return request(app)
    .get('/api/articles/437/comments')
    .expect(404)
    .then(( { body } ) => {
        const { msg } = body
        expect(msg).toBe('Not Found')
})
})
test.only('GET 400: responds with error message if article_id is invalid', () => {
    return request(app)
    .get('/api/articles/catsanddogs/comments')
    .expect(400)
    .then(( { body } ) => {
        const { msg } = body
        expect(msg).toBe('Bad Request')
})
})

test('POST 201: responds with successful created message when post is successfully made', () => {
    const newComment = {
        username: "butter_bridge",
        body: "Whilst reading this article I suffered a great fall"
    }
    return request(app)
    .post('/api/articles/2/comments')
    .send(newComment)
    .expect(201)
    .then(({ body }) => {
        const { comment } = body
        expect(comment).toMatchObject({
            comment_id: expect.any(Number),
            votes: expect.any(Number),
            created_at: expect.any(String),
            author: expect.any(String),
            body: expect.any(String),
            article_id: 2,
            body: "Whilst reading this article I suffered a great fall"
    })
    })
})
// post errors - invalid article:id, non-existent article id
test('POST 409: responds with error message if passed a non-existent article id', () => {
    const newComment = {
        username: "butter_bridge",
        body: "Whilst reading this article I suffered a great fall"
    }
    return request(app)
    .post('/api/articles/5485/comments')
    .send(newComment)
    .expect(409)
    .then(({ body }) => {
        const { msg } = body
        expect(msg).toBe('Conflict')
})
});
// invalid comment format, 
})