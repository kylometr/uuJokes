"use strict";
const CategoryAbl = require("../../abl/category-abl.js");

class CategoryController {

  list(ucEnv) {
    return CategoryAbl.list(ucEnv.getUri().getAwid(), ucEnv.getDtoIn());
  }

  delete(ucEnv) {
    return CategoryAbl.delete(ucEnv.getUri().getAwid(), ucEnv.getDtoIn(), ucEnv.getSession());
  }

  update(ucEnv) {
    return CategoryAbl.update(ucEnv.getUri().getAwid(), ucEnv.getDtoIn(), ucEnv.getSession());
  }

  get(ucEnv) {
    return CategoryAbl.get(ucEnv.getUri().getAwid(), ucEnv.getDtoIn());
  }

  create(ucEnv) {
    return CategoryAbl.create(ucEnv.getUri().getAwid(), ucEnv.getDtoIn(), ucEnv.getSession());
  }

}

module.exports = new CategoryController();
