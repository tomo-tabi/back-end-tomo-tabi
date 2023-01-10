const chai = require("chai");
//const config = require("../db/knexfile");
const chaiHttp = require("chai-http");
chai.use(chaiHttp);
const knex = require("../db/knex");
const fixtures = require("./fixtures");
const UserModel = require("../controllers/users/userController");

let server = require("../server");

describe("users", () => {
  const expect = chai.expect;
  let request;
  beforeEach(() => {
    request = chai.request(server);
  });

  let userFixture;

  before(async () => {
    userFixture = fixtures.getUser();
    await knex("users")
      .insert(userFixture)
      .returning("id")
      .then((result) => {
        console.log("inserted test customer");
      })
      .catch(console.error);
  });

  after(async () => {
    await knex("users")
      .where("id", userFixture.id)
      .returning("id")
      .del()
      .then((result) => {
        console.log("removed test customer");
      })
      .catch(console.error);
  });

  describe("setup", () => {
    it("should connect to database", () => {
      knex.raw("select 1 as result").catch(() => {
        assert.fail("unable to connect to database");
      });
    });

    it("has run the initial migration", () => {
      knex("users")
        .select()
        .catch(() => assert.fail("customer table is not found."));
    });
  });

  describe("SignUp", () => {
    // it("Should console.log the username and token", async () => {
    //   const newUser = {
    //     id: "5",
    //     email: "test@test23412341324.com",
    //     username: "test3242341432",
    //     password: "test123",
    //   };
    //   await request
    //     .post("/user/signup")
    //     .send(newUser)
    //     .then((res) => {
    //       console.log(res)
    //       const body = res.body;
    //       console.log("body", body);
    //     });
    // });

    it("Should return the email and username", async () => {
      const userid = {
        userid: "8"};
      await request
        .get("/user/")
        .send(userid)
        .auth('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyaWQiOjgsImlhdCI6MTY3MzI3NTAzMywiZXhwIjoxNjczODc5ODMzfQ.OJJR-s_jYIuTDlkxvTI06DGQpkLxravCeQv8zbI7Z_A', { type: 'bearer' })
        .then((res) => {
          const body = res.body;
          console.log("body", body);
          expect({email:'test@test23412341324.com', username: 'test3242341432' }).to.deep.equal(res.body)
        });
    });
    
    it("Should return the email and username", async () => {
      const userid = {
        userid: "8"};
      await request
        .get("/user/")
        .send(userid)
        .auth('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyaWQiOjgsImlhdCI6MTY3MzI3NTAzMywiZXhwIjoxNjczODc5ODMzfQ.OJJR-s_jYIuTDlkxvTI06DGQpkLxravCeQv8zbI7Z_A', { type: 'bearer' })
        .then((res) => {
          const body = res.body;
          console.log("body", body);
          expect({email:'test@test23412341324.com', username: 'test3242341432' }).to.deep.equal(res.body)
        });
    });
  });
});
