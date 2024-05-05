const request = require("supertest");
const db = require("../connection");
const testData = require("../data/test-data");
const seed = require("../seeds/seed");
const app = require("../../app");
const endPoints = require("../../endpoints.json");

beforeEach(() => seed(testData));

afterAll(() => db.end());

describe("/api/topics", () => {
  test("GET 200: response contains all topics", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        const { topics } = body;
        expect(topics.length).toBe(3);
        topics.forEach((topic) => {
          expect(topic).toMatchObject({
            description: expect.any(String),
            slug: expect.any(String),
          });
        });
      });
  });
  test("GET 404: responds with a 404 error message when user enters invalid endpoint", () => {
    return request(app)
      .get("/api/tropicz")
      .expect(404)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("Not Found");
      });
  });
});

describe("/api", () => {
  test('GET 200: responds with an object of endpoints"', () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body }) => {
        expect(body).toEqual(endPoints);
      });
  });
});

describe("/api/articles/:article_id", () => {
  test("GET 200: responds with the article that matches the given article_id", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body }) => {
        const { article } = body;
        expect(article).toMatchObject({
          title: "Living in the shadow of a great man",
          topic: "mitch",
          author: "butter_bridge",
          body: "I find this existence challenging",
          created_at: expect.any(String),
          votes: 100,
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
        });
      });
  });

  test("GET 200: responds with the article that matches the given article_id and a comment_count property", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body }) => {
        const { article } = body;
        expect(article).toMatchObject({
          title: "Living in the shadow of a great man",
          topic: "mitch",
          author: "butter_bridge",
          body: "I find this existence challenging",
          created_at: expect.any(String),
          votes: 100,
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
          comment_count: 11,
        });
      });
  });

  test("GET 404: responds with 404 error message if id does not exist", () => {
    return request(app)
      .get("/api/articles/9999")
      .expect(404)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("Not Found");
      });
  });
  test("GET 400: responds with 400 error message if id is entered in an invalid format", () => {
    return request(app)
      .get("/api/articles/nfafns")
      .expect(400)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("Bad Request");
      });
  });
  test("PATCH 200: updates votes key of article by adding a positive integer and returns updated article", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({ inc_votes: 1 })
      .expect(200)
      .then(({ body }) => {
        const { article } = body;
        expect(article).toMatchObject({
          title: "Living in the shadow of a great man",
          topic: "mitch",
          author: "butter_bridge",
          body: "I find this existence challenging",
          created_at: expect.any(String),
          votes: 101,
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
        });
      });
  });
  test("PATCH 200: updates votes key of article by adding a negative integer and returns updated article", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({ inc_votes: -50 })
      .expect(200)
      .then(({ body }) => {
        const { article } = body;
        expect(article).toMatchObject({
          title: "Living in the shadow of a great man",
          topic: "mitch",
          author: "butter_bridge",
          body: "I find this existence challenging",
          created_at: expect.any(String),
          votes: 50,
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
        });
      });
  });
  test("PATCH 400: returns error given invalid body", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({})
      .expect(400)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("Bad Request");
      });
  });

  test("PATCH 400: returns error if article does not exist", () => {
    return request(app)
      .patch("/api/articles/100")
      .send({ inc_votes: 1 })
      .expect(400)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("Bad Request");
      });
  });
});

describe("/api/articles", () => {
  test("GET 200: responds with array of article objects", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles.length).toBe(10);
        articles.forEach((article) => {
          expect(article).toMatchObject({
            article_id: expect.any(Number),
            title: expect.any(String),
            topic: expect.any(String),
            author: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            article_img_url: expect.any(String),
            comment_count: expect.any(Number),
          });
        });
      });
  });
  test("GET 200: responds with array of article objects in descending order", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles).toBeSortedBy("created_at", { descending: true });
      });
  });
  test("GET 200: responds with array of article objects matching the topic query", () => {
    return request(app)
      .get("/api/articles?topic=mitch")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles.length).toBe(10);
        articles.forEach((article) => {
          expect(article).toMatchObject({
            article_id: expect.any(Number),
            title: expect.any(String),
            topic: "mitch",
            author: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            article_img_url: expect.any(String),
            comment_count: expect.any(Number),
          });
        });
      });
  });
  test("GET 404: responds with error message if passed non-existent query", () => {
    return request(app)
      .get("/api/articles?topic=dogs")
      .expect(404)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("Not Found");
      });
  });
  test("GET 200: responds with array of all articles if passed an invalid query", () => {
    return request(app)
      .get("/api/articles?tropicz=mitch")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles.length).toBe(10);
        articles.forEach((article) => {
          expect(article).toMatchObject({
            article_id: expect.any(Number),
            title: expect.any(String),
            topic: expect.any(String),
            author: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            article_img_url: expect.any(String),
            comment_count: expect.any(Number),
          });
        });
      });
  });
  test("GET 200: responds with array sorted by any column specified, sorted by default by created_at and descending", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles.length).toBe(10);
        expect(articles).toBeSortedBy("created_at", { descending: true });
        articles.forEach((article) => {
          expect(article).toMatchObject({
            article_id: expect.any(Number),
            title: expect.any(String),
            topic: expect.any(String),
            author: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            article_img_url: expect.any(String),
            comment_count: expect.any(Number),
          });
        });
      });
  });
  test("GET 200: responds with array which by default is sorted by created_at and ordered by descending", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles.length).toBe(10);
        expect(articles).toBeSortedBy("created_at", { descending: true });
        articles.forEach((article) => {
          expect(article).toMatchObject({
            article_id: expect.any(Number),
            title: expect.any(String),
            topic: expect.any(String),
            author: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            article_img_url: expect.any(String),
            comment_count: expect.any(Number),
          });
        });
      });
  });
  test("GET 200: responds with array sorted by any column specified and any order specified", () => {
    return request(app)
      .get("/api/articles?sort_by=comment_count&&order=ASC")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles.length).toBe(10);
        expect(articles).toBeSortedBy("comment_count", { ascending: true });
        articles.forEach((article) => {
          expect(article).toMatchObject({
            article_id: expect.any(Number),
            title: expect.any(String),
            topic: expect.any(String),
            author: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            article_img_url: expect.any(String),
            comment_count: expect.any(Number),
          });
        });
      });
  });
  test("GET 200: returns array of articles with length where limit and p queries have default of 10 and 1 respectively", () => {
    return request(app)
      .get("/api/articles?limit=10&&p=1")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles.length).toBe(10);
      });
  });
  test("GET 200: returns array of articles with length where limit and p queries differ from default values", () => {
    return request(app)
      .get("/api/articles?limit=5&&p=2")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles.length).toBe(5);
      });
  });

  test("GET 400: responds with error if passed invalid column to sort by", () => {
    return request(app)
      .get("/api/articles?sort_by=cromment_crounts")
      .expect(400)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("Bad Request");
      });
  });
  test("POST 201: responds with successful created message when article is successfully posted", () => {
    const newArticle = {
      author: "rogersop",
      title: "cool things",
      body: "really awesome cool things that are too cool for you",
      topic: "cats",
      article_img_ur: "",
    };
    return request(app)
      .post("/api/articles")
      .send(newArticle)
      .expect(201)
      .then(({ body }) => {
        const { article } = body;
        expect(article).toMatchObject({
          author: "rogersop",
          title: "cool things",
          body: "really awesome cool things that are too cool for you",
          topic: "cats",
          article_id: 14,
          votes: 0,
          created_at: expect.any(String),
          comment_count: 0,
        });
      });
  });
  test("POST 400: responds with an error message if the new article is in an invalid format", () => {
    const newArticle = {};
    return request(app)
      .post("/api/articles")
      .send(newArticle)
      .expect(400)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("Bad Request");
      });
  });
});
describe("/api/articles/:article_id/comments", () => {
  test("GET 200: responds with an array of comments for the given article_id", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body }) => {
        const { comments } = body;
        expect(comments.length).toBe(10);
        comments.forEach((comment) => {
          expect(comment).toMatchObject({
            comment_id: expect.any(Number),
            votes: expect.any(Number),
            created_at: expect.any(String),
            author: expect.any(String),
            body: expect.any(String),
            article_id: 1,
          });
        });
      });
  });
  test("GET 200: responds with array of comments from most recent to least recent", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body }) => {
        const { comments } = body;
        expect(comments).toBeSortedBy("created_at", { descending: true });
      });
  });
  test("GET 200: responds with an empty array if article_id is valid but has no comments", () => {
    return request(app)
      .get("/api/articles/10/comments")
      .expect(200)
      .then(({ body }) => {
        const { comments } = body;
        expect(comments.length).toBe(0);
      });
  });
  test("GET 200: returns array of comments with length where limit and p queries have default of 10 and 1 respectively", () => {
    return request(app)
      .get("/api/articles/1/comments?limit=10&&p=1")
      .expect(200)
      .then(({ body }) => {
        const { comments } = body;
        expect(comments.length).toBe(10);
      });
  });
  test("GET 200: returns array of comments with length where limit and p queries differ from default values", () => {
    return request(app)
      .get("/api/articles/1/comments?limit=5&&p=2")
      .expect(200)
      .then(({ body }) => {
        const { comments } = body;
        expect(comments.length).toBe(5);
      });
  });
  test("GET 404: responds with error message if article_id is not found", () => {
    return request(app)
      .get("/api/articles/437/comments")
      .expect(404)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("Not Found");
      });
  });
  test("GET 400: responds with error message if article_id is invalid", () => {
    return request(app)
      .get("/api/articles/catsanddogs/comments")
      .expect(400)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("Bad Request");
      });
  });

  test("POST 201: responds with successful created message when post is successfully made", () => {
    const newComment = {
      username: "butter_bridge",
      body: "Whilst reading this article I suffered a great fall",
    };
    return request(app)
      .post("/api/articles/2/comments")
      .send(newComment)
      .expect(201)
      .then(({ body }) => {
        const { comment } = body;
        expect(comment).toMatchObject({
          comment_id: expect.any(Number),
          votes: expect.any(Number),
          created_at: expect.any(String),
          author: expect.any(String),
          body: expect.any(String),
          article_id: 2,
          body: "Whilst reading this article I suffered a great fall",
        });
      });
  });
  test("POST 404: responds with error message if article id not found", () => {
    const newComment = {
      username: "butter_bridge",
      body: "Whilst reading this article I suffered a great fall",
    };
    return request(app)
      .post("/api/articles/5485/comments")
      .send(newComment)
      .expect(404)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("Not Found");
      });
  });
  test("POST 400: responds with error message if passed an invalid article id", () => {
    const newComment = {
      username: "butter_bridge",
      body: "Whilst reading this article I suffered a great fall",
    };
    return request(app)
      .post("/api/articles/woohoo/comments")
      .send(newComment)
      .expect(400)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("Bad Request");
      });
  });

  test("POST 404: responds with error message if username not found", () => {
    const newComment = {
      username: "nowhere_man",
      body: "Whilst reading this article I suffered a great fall",
    };
    return request(app)
      .post("/api/articles/2/comments")
      .send(newComment)
      .expect(404)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("Not Found");
      });
  });
});
describe("/api/comments/:comment_id", () => {
  test("DELETE 204: deletes comment given in comment id", () => {
    return request(app).delete("/api/comments/2").expect(204);
  });
  test("DELETE 400: responds with error message when comment_id is invalid", () => {
    return request(app).delete("/api/comments/fdsa").expect(400);
  });
  test("DELETE 400: responds with error message when comment_id is not found", () => {
    return request(app).delete("/api/comments/1213").expect(404);
  });
  test("PATCH 200: updates votes key of comment by adding a positive and returns updated comment", () => {
    return request(app)
      .patch("/api/comments/1")
      .send({ inc_votes: 1 })
      .expect(200)
      .then(({ body }) => {
        const { comment } = body;
        expect(comment).toMatchObject({
          body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
          votes: 17,
          author: "butter_bridge",
          article_id: 9,
          created_at: expect.any(String),
        });
      });
  });
});
test("PATCH 400: returns error given invalid body", () => {
  return request(app)
    .patch("/api/comments/1")
    .send({})
    .expect(400)
    .then(({ body }) => {
      const { msg } = body;
      expect(msg).toBe("Bad Request");
    });
});

test("PATCH 400: returns error if article does not exist", () => {
  return request(app)
    .patch("/api/comments/100")
    .send({ inc_votes: 1 })
    .expect(400)
    .then(({ body }) => {
      const { msg } = body;
      expect(msg).toBe("Bad Request");
    });
});
describe("/api/users", () => {
  test("GET 200: responds with array of users", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body }) => {
        const { users } = body;
        expect(users.length).toBe(4);
        users.forEach((user) => {
          expect(user).toMatchObject({
            username: expect.any(String),
            name: expect.any(String),
            avatar_url: expect.any(String),
          });
        });
      });
  });
});
describe("/api/users/:username", () => {
  test("GET 200: responds with user selected by username", () => {
    return request(app)
      .get("/api/users/rogersop")
      .expect(200)
      .then(({ body }) => {
        const { user } = body;
        expect(user).toMatchObject({
          username: "rogersop",
          name: "paul",
          avatar_url:
            "https://avatars2.githubusercontent.com/u/24394918?s=400&v=4",
        });
      });
  });
  test("GET 404: responds with user selected by username", () => {
    return request(app)
      .get("/api/users/sgjdfk")
      .expect(404)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("Not Found");
      });
  });
});
