"use strict";
const JokesMainUseCaseError = require("./jokes-main-use-case-error.js");

const Init = {
  UC_CODE: `${JokesMainUseCaseError.ERROR_PREFIX}init/`,

  InvalidDtoIn: class extends JokesMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Init.UC_CODE}invalidDtoIn`;
      this.message = "DtoIn is not valid.";
    }
  },

  SchemaDaoCreateSchemaFailed: class extends JokesMainUseCaseError {
    constructor() {
      super(...arguments);
      this.status = 500;
      this.code = `${Init.UC_CODE}schemaDaoCreateSchemaFailed`;
      this.message = "Create schema by Dao createSchema failed.";
    }
  },

  SetProfileFailed: class extends JokesMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Init.UC_CODE}sys/setProfileFailed`;
      this.message = "Set profile failed.";
    }
  },

  CreateAwscFailed: class extends JokesMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Init.UC_CODE}createAwscFailed`;
      this.message = "Create uuAwsc failed.";
    }
  },
};

const HelloWorld = {
  UC_CODE: `${JokesMainUseCaseError.ERROR_PREFIX}helloWorld/`,

  InvalidDtoIn: class extends JokesMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${HelloWorld.UC_CODE}invalidDtoIn`;
      this.message = "DtoIn is not valid.";
    }
  },
};

const JokeCreate = {
  UC_CODE: `${JokesMainUseCaseError.ERROR_PREFIX}joke/create/`,

  InvalidDtoIn: class extends JokesMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${JokeCreate.UC_CODE}Invalid DtoIn`;
      this.message = "Invalid arguments";
    }
  },
  JokeDaoCreateFailed: class extends JokesMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${JokeCreate.UC_CODE}jokeDaoCreateFailed`;
      this.message = "Dao failed to create joke.";
    }
  }
};

const JokeGet = {
  UC_CODE: `${JokesMainUseCaseError.ERROR_PREFIX}joke/get/`,

  InvalidDtoIn: class extends JokesMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${JokeGet.UC_CODE}Invalid DtoIn`;
      this.message = "Invalid arguments";
    }
  },

  JokeDaoGetFailed: class extends JokesMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${JokeGet.UC_CODE}jokeDaoGetFailed`;
      this.message = "Dao failed to get joke.";
    }
  }
};

const JokeList = {
  UC_CODE: `${JokesMainUseCaseError.ERROR_PREFIX}joke/list/`,

  InvalidDtoIn: class extends JokesMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${JokeList.UC_CODE}Invalid DtoIn`;
      this.message = "Invalid arguments";
    }
  },
  JokeDaoListFailed: class extends JokesMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${JokeList.UC_CODE}jokeDaoListFailed`;
      this.message = "Dao failed to list jokes.";
    }
  }
};

const JokeUpdate = {
  UC_CODE: `${JokesMainUseCaseError.ERROR_PREFIX}joke/update/`,

  InvalidDtoIn: class extends JokesMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${JokeUpdate.UC_CODE}Invalid DtoIn`;
      this.message = "Invalid arguments";
    }
  },
  JokeDaoUpdateFailed: class extends JokesMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${JokeUpdate.UC_CODE}jokeDaoUpdateFailed`;
      this.message = "Dao failed to update joke."
    }
  }
};

const JokeDelete = {
  UC_CODE: `${JokesMainUseCaseError.ERROR_PREFIX}joke/delete/`,

  InvalidDtoIn: class extends JokesMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${JokeDelete.UC_CODE}Invalid DtoIn`;
      this.message = "Invalid arguments";
    }
  },
  DaoJokeNotFound: class extends JokesMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${JokeDelete.UC_CODE}jokeDaoDeleteFailed`;
      this.message = "Joke not found.";
    }
  }
};

module.exports = {
  JokeDelete,
  JokeUpdate,
  JokeList,
  JokeGet,
  JokeCreate,
  HelloWorld,
  Init,
};
