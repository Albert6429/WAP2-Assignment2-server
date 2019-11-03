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
});