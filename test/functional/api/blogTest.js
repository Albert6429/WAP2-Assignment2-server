const chai = require("chai");
const expect = chai.expect;
const request = require("supertest");
const MongoMemoryServer = require("mongodb-memory-server").MongoMemoryServer;
const User = require("../../../models/user.model");
const mongoose = require("mongoose");

const _ = require("lodash");
let server;
let mongod;
let db, validID,validName

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
    });
});