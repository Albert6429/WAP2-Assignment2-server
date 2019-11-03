const chai = require("chai");
const expect = chai.expect;
const request = require("supertest");
const MongoMemoryServer = require("mongodb-memory-server").MongoMemoryServer;
const User = require("../../../models/user.model");
const Post = require("../../../models/posts.model");
const mongoose = require("mongoose");

const _ = require("lodash");
let server;
let mongod;
let db, validID,validName,validPostID,validTitle;

describe("userTest", () => {
    before(async () => {
        try {
            mongod = new MongoMemoryServer({
                instance: {
                    port: 27017,
                    dbPath: "./test/database",
                    dbName: "blog" // by default generate random dbName
                }
            });
            // Async Trick - this ensures the database is created before
            // we try to connect to it or start the server
            await mongod.getConnectionString();

            mongoose.connect("mongodb://localhost:27017/blog", {
                useNewUrlParser: true,
                useUnifiedTopology: true
            });
            server = require("../../../bin/www");
            db = mongoose.connection;
        } catch (error) {
            console.log(error);
        }
    });

    after(async () => {
        try {
            //await db.dropDatabase();
        } catch (error) {
            console.log(error);
        }
    });

    beforeEach(async () => {
        try {
            await User.deleteMany({});
            let user = new User();
            user.username = 'GYF';
            user.password = '123';
            user.email = '987654321@qq.com';
            user.followed = 0;
            await user.save();
            user = new User();
            user.username = 'SMX';
            user.password = '123';
            user.email = '192837465@qq.com';
            user.followed = 0;
            await user.save();
            user = await User.findOne({username: 'GYF'});
            validID = user._id;
            validName = user.username;
        } catch (error) {
            console.log(error);
        }
    });
    describe("GET /users", () => {
        it("should GET all the users", done => {
            request(server)
                .get("/users")
                .set("Accept", "application/json")
                .expect("Content-Type", /json/)
                .expect(200)
                .end((err, res) => {
                    try {
                        expect(res.body).to.be.a("array");
                        expect(res.body.length).to.equal(2);
                        let result = _.map(res.body, user => {
                            return {
                                username: user.username,
                                email: user.email
                            };
                        });
                        expect(result).to.deep.include({
                            username: "GYF",
                            email: "987654321@qq.com"
                        });
                        expect(result).to.deep.include({
                            username: "SMX",
                            email: "192837465@qq.com"
                        });
                        done();
                    } catch (e) {
                        done(e);
                    }
                });
        });
    });

    describe("GET /users/:username", () => {
        describe("when the username is valid", () => {
            it("should return the matching user", done => {
                request(server)
                    .get(`/users/${validName}`)
                    .set("Accept", "application/json")
                    .expect("Content-Type", /json/)
                    .expect(200)

                    .end((err, res) => {
                        expect(res.body).to.have.property("username", "GYF");
                        done(err);
                    });
            });
        });
        describe("when the username is invalid", () => {
            it("should return the NOT found message", done => {
                request(server)
                    .get("/users/jojo")
                    .set("Accept", "application/json")
                    .expect("Content-Type", /json/)
                    .expect(200)
                    .end((err, res) => {
                        expect(res.body.message).equals("The user does not exist");
                        done(err);
                    });
            });
        });
    });

    describe("POST /reg", () => {
        describe("when the username is not used", () => {
            it("should register successfully and update", () => {
                const user = {
                    username: "Nancy",
                    password: "123",
                    email: "123456789@qq.com",
                };
                return request(server)
                    .post(`/reg`)
                    .send(user)
                    .expect(200)
                    .then(res => {
                        expect(res.body.message).equals("Register successfully");
                        validName = res.body.data.username;
                    });
            });
            after(() => {
                return request(server)
                    .get(`/users/${validName}`)
                    .expect(200)
                    .then(res => {
                        expect(res.body).to.have.property("username", "Nancy");
                        expect(res.body).to.have.property("email", "123456789@qq.com");
                    });
            });
        });
        describe("when the username used by other users", () => {
            it("should return the username existed message", () => {
                const user = {
                    username: "GYF",
                    password: "123",
                    email: "123456789@qq.com",
                };
                return request(server)
                    .post(`/reg`)
                    .send(user)
                    .expect(200)
                    .then(res => {
                        expect(res.body.message).equals("The username already existed");
                    });
            });
        });
    });
    describe("POST /log", () => {
        describe("when the username is wrong", () => {
            it("should return the username NOT existed message", () => {
                const user = {
                    username: "ZXL",
                    password: "123",
                };
                return request(server)
                    .post(`/log`)
                    .send(user)
                    .expect(200)
                    .then(res => {
                        expect(res.body.message).equals("The username does not exist");
                    });
            });
        });
        describe("when the password is wrong", () => {
            it("should return the WRONG password message", () => {
                const user = {
                    username: "GYF",
                    password: "12345",
                };
                return request(server)
                    .post(`/log`)
                    .send(user)
                    .expect(200)
                    .then(res => {
                        expect(res.body.message).equals("The password is wrong");
                    });
            });
        });
        describe("when the username and password are both correct", () => {
            it("should return login successfully message", () => {
                const user = {
                    username: "GYF",
                    password: "123",
                };
                return request(server)
                    .post(`/log`)
                    .send(user)
                    .expect(200)
                    .then(res => {
                        expect(res.body.message).equals("Login successfully");
                    });
            });
        });
    });
    describe("PUT /users/:username/followed", () => {
        describe("when the username is valid", () => {
            it("should return a message and the user followed by 1", () => {
                return request(server)
                    .put(`/users/${validName}/followed`)
                    .expect(200)
                    .then(resp => {
                        expect(resp.body).to.include({
                            message: "The user is followed successfully!"
                        });
                        expect(resp.body.data).to.have.property("followed", 1);
                    });
            });
            after(() => {
                return request(server)
                    .get(`/users/${validName}`)
                    .set("Accept", "application/json")
                    .expect("Content-Type", /json/)
                    .expect(200)
                    .then(resp => {
                        expect(resp.body).to.have.property("followed", 1);
                    });
            });
        });
        describe("when the username is invalid", () => {
            it("should return the NOT exist message", done => {
                request(server)
                    .put("/users/jojo/followed")
                    .set("Accept", "application/json")
                    .expect("Content-Type", /json/)
                    .expect(200)
                    .end((err, res) => {
                        expect(res.body.message).equals("The username does not exist");
                        done(err);
                    });
            });
        });
    });

    describe("DELETE /deleteUser/:id", () => {
        describe("when the id is valid", () => {
            it("should return a message and update", () => {
                return request(server)
                    .delete(`/deleteUser/${validID}`)
                    .expect(200)
                    .then(resp => {
                        expect(resp.body).to.include({
                            message: "The user is deleted"
                        });
                    });
            });
            after(() => {
                return request(server)
                    .get(`/users`)
                    .set("Accept", "application/json")
                    .expect("Content-Type", /json/)
                    .expect(200)
                    .then(resp => {
                        expect(resp.body.length).to.equal(1);
                    });
            });
        });

        describe("when the id is invalid", () => {
            it("should return the NOT exist message", done => {
                request(server)
                    .delete("/deleteUser/jojo")
                    .set("Accept", "application/json")
                    .expect("Content-Type", /json/)
                    .expect(200)
                    .end((err, res) => {
                        expect(res.body.message).equals("The id does not exist");
                        done(err);
                    });
            });
        });
    });
});

describe("postTest", () => {
    before(async () => {
        try {
            mongod = new MongoMemoryServer({
                instance: {
                    port: 27017,
                    dbPath: "./test/database",
                    dbName: "blog"
                }
            });
            await mongod.getConnectionString();

            mongoose.connect("mongodb://localhost:27017/blog", {
                useNewUrlParser: true,
                useUnifiedTopology: true
            });
            server = require("../../../bin/www");
            db = mongoose.connection;
        } catch (error) {
            console.log(error);
        }
    });

    after(async () => {
        try {
        } catch (error) {
            console.log(error);
        }
    });

    beforeEach(async () => {
        try {
            await Post.deleteMany({});
            let post = new Post();
            post.title = "Diary";
            post.author = "GYF";
            post.content = "I am very happy today";
            post.likes = 0;
            post.view = 0;
            await post.save();
            let post2 = new Post();
            post2.title = "Diary2";
            post2.author = "SMX";
            post2.content = "I am very sad today";
            post2.likes = 0;
            post2.view = 0;
            await post2.save();
            let post3 = new Post();
            post3 = await Post.findOne({title: 'Diary'});
            validPostID = post3._id;
            validTitle = post3.title;
        } catch (error) {
            console.log(error);
        }
    });

    describe("GET /posts", () => {
        it("should GET all the posts", done => {
            request(server)
                .get("/posts")
                .set("Accept", "application/json")
                .expect("Content-Type", /json/)
                .expect(200)
                .end((err, res) => {
                    try {
                        expect(res.body).to.be.a("array");
                        expect(res.body.length).to.equal(2);
                        let result = _.map(res.body, post => {
                            return {
                                title: post.title,
                                author: post.author
                            };
                        });
                        expect(result).to.deep.include({
                            title: "Diary",
                            author: "GYF"
                        });
                        expect(result).to.deep.include({
                            title: "Diary2",
                            author: "SMX"
                        });
                        done();
                    } catch (e) {
                        done(e);
                    }
                });
        });
    });

    describe("GET /posts/:id", () => {
        describe("when the id is valid", () => {
            it("should return the matching post", done => {
                request(server)
                    .get(`/posts/${validPostID}`)
                    .set("Accept", "application/json")
                    .expect("Content-Type", /json/)
                    .expect(200)
                    .end((err, res) => {
                        expect(res.body.data).to.have.property("title", "Diary");
                        done(err);
                    });
            });
        });
        describe("when the id is invalid", () => {
            it("should return the NOT found message", done => {
                request(server)
                    .get("/posts/jojojo")
                    .set("Accept", "application/json")
                    .expect("Content-Type", /json/)
                    .expect(200)
                    .end((err, res) => {
                        expect(res.body.message).equals("The post does not exist");
                        done(err);
                    });
            });
        });
    });

    describe("POST /posts", () => {
        describe("when the id is valid", () => {
            it("should register successfully and update", () => {
                const post = {
                    title: "Hello World",
                    author: "Jack",
                    content: "Hello World",
                };
                return request(server)
                    .post(`/posts`)
                    .send(post)
                    .expect(200)
                    .then(res => {
                        expect(res.body.message).equals("Post successfully");
                        validID = res.body.data._id;
                    });
            });
            after(() => {
                return request(server)
                    .get(`/posts/${validID}`)
                    .expect(200)
                    .then(res => {
                        expect(res.body.data).to.have.property("title", "Hello World");
                    });
            });
        });
        describe("when the id is invalid", () => {
            it("should return the NOT found message", done => {
                request(server)
                    .get("/posts/11111")
                    .set("Accept", "application/json")
                    .expect("Content-Type", /json/)
                    .expect(200)
                    .end((err, res) => {
                        expect(res.body.message).equals("The post does not exist");
                        done(err);
                    });
            });
        });
    });

    describe("PUT /posts/:id/likes", () => {
        describe("when the id is valid", () => {
            it("should return a message and the likes by 1", () => {
                return request(server)
                    .put(`/posts/${validPostID}/likes`)
                    .expect(200)
                    .then(resp => {
                        expect(resp.body).to.include({
                            message: "The post is liked successfully!"
                        });
                        expect(resp.body.data).to.have.property("likes", 1);
                    });
            });
            after(() => {
                return request(server)
                    .get(`/posts/${validPostID}`)
                    .set("Accept", "application/json")
                    .expect("Content-Type", /json/)
                    .expect(200)
                    .then(resp => {
                        expect(resp.body.data).to.have.property("likes", 1);
                    });
            });
        });

        describe("when the id is invalid", () => {
            it("should return the NOT exist message", done => {
                request(server)
                    .put("/posts/jojo/likes")
                    .set("Accept", "application/json")
                    .expect("Content-Type", /json/)
                    .expect(200)
                    .end((err, res) => {
                        expect(res.body.message).equals("The post does not exist");
                        done(err);
                    });
            });
        });
    });

    describe("DELETE /deletePost/:id", () => {
        describe("when the id is valid", () => {
            it("should return a message and update", () => {
                return request(server)
                    .delete(`/deletePost/${validPostID}`)
                    .expect(200)
                    .then(resp => {
                        expect(resp.body).to.include({
                            message: "The post is deleted"
                        });
                    });
            });
            after(() => {
                return request(server)
                    .get(`/posts`)
                    .set("Accept", "application/json")
                    .expect("Content-Type", /json/)
                    .expect(200)
                    .then(resp => {
                        expect(resp.body.length).to.equal(1);
                    });
            });
        });
        describe("when the id is invalid", () => {
            it("should return the NOT exist message", done => {
                request(server)
                    .delete("/deletePost/jojo")
                    .set("Accept", "application/json")
                    .expect("Content-Type", /json/)
                    .expect(200)
                    .end((err, res) => {
                        expect(res.body.message).equals("The id does not exist");
                        done(err);
                    });
            });
        });
    });
});