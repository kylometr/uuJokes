"use strict";
const JokesMainAbl = require("../../abl/jokes-main-abl.js");

class JokesMainController {

  list(ucEnv) {
    return JokesMainAbl.list(ucEnv.getUri().getAwid(), ucEnv.getDtoIn());
  }

  delete(ucEnv) {
    return JokesMainAbl.delete(ucEnv.getUri().getAwid(), ucEnv.getDtoIn(), ucEnv.getSession());
  }

  update(ucEnv) {
    return JokesMainAbl.update(ucEnv.getUri().getAwid(), ucEnv.getDtoIn(), ucEnv.getSession());
  }

  get(ucEnv) {
    return JokesMainAbl.get(ucEnv.getUri().getAwid(), ucEnv.getDtoIn());
  }

  create(ucEnv) {
    return JokesMainAbl.create(ucEnv.getUri().getAwid(), ucEnv.getDtoIn(), ucEnv.getSession(), ucEnv.getAuthorizationResult());
  }

  helloWorld(ucEnv) {
    return JokesMainAbl.helloWorld(ucEnv.getUri().getAwid(), ucEnv.getDtoIn());
  }
  init(ucEnv) {
    return JokesMainAbl.init(ucEnv.getUri(), ucEnv.getDtoIn(), ucEnv.getSession());
  }

  load(ucEnv) {
    return JokesMainAbl.load(ucEnv.getUri(), ucEnv.getSession());
  }

  loadBasicData(ucEnv) {
    return JokesMainAbl.loadBasicData(ucEnv.getUri(), ucEnv.getSession());
  }
}

module.exports = new JokesMainController();
