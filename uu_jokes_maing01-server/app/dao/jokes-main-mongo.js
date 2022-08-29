"use strict";
const { UuObjectDao } = require("uu_appg01_server").ObjectStore;

class JokesMainMongo extends UuObjectDao {
  async createSchema() {
    await super.createIndex({ awid: 1 }, { unique: true });
  }

  async create(uuObject) {
    return await super.insertOne(uuObject);
  }

  async get(awid, id) {
    let filter = {
      awid: awid,
      id: id,
    };
    return await super.findOne(filter);
  }

  async getByFilter(awid, filter) {
    filter.awid = awid;
    return await super.findOne(filter);
  }

  async getAll(awid, pageInfo, sort) {
    return await super.find({ awid: awid }, pageInfo, sort);
  }

  async updateOne(uuObject) {
    let filter = {
      awid: uuObject.awid,
      id: uuObject.id,
    };
    return await super.findOneAndUpdate(filter, uuObject, { revisionStrategy: "REVISION" });
  }

  async delete(uuObject) {
    let filter = {
      awid: uuObject.awid,
      id: uuObject.id,
    };
    return await super.deleteOne(filter);
  }
}

module.exports = JokesMainMongo;
