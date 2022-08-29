"use strict";

const JokesMainUseCaseError = require("./jokes-main-use-case-error.js");
const CATEGORY_ERROR_PREFIX = `${JokesMainUseCaseError.ERROR_PREFIX}category/`;

const CategoryCreate = {
  UC_CODE: `${CATEGORY_ERROR_PREFIX}/create/`,

  InvalidDtoIn: class extends JokesMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${CategoryCreate.UC_CODE}Invalid DtoIn`;
      this.message = "Invalid arguments";
    }
  },
  CategoryDaoCreateFailed: class extends JokesMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${CategoryCreate.UC_CODE}categoryDaoCreateFailed`;
      this.message = "Dao failed to create category.";
    }
  },
  CategoryAlreadyExists: class extends JokesMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${CategoryCreate.UC_CODE}categoryAlreadyExists`;
      this.message = "Category already exists in database.";
    }
  }
};

const CategoryGet = {
  UC_CODE: `${CATEGORY_ERROR_PREFIX}get/`,

  InvalidDtoIn: class extends JokesMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${CategoryGet.UC_CODE}Invalid DtoIn`;
      this.message = "Invalid arguments";
    }
  },

  CategoryDaoGetFailed: class extends JokesMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${CategoryGet.UC_CODE}categoryDaoGetFailed`;
      this.message = "Dao failed to get category. Category not found.";
    }
  }
};

const CategoryList = {
  UC_CODE: `${CATEGORY_ERROR_PREFIX}list/`,

  InvalidDtoIn: class extends JokesMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${CategoryList.UC_CODE}Invalid DtoIn`;
      this.message = "Invalid arguments";
    }
  },
  CategoryDaoListFailed: class extends JokesMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${CategoryList.UC_CODE}categoryDaoListFailed`;
      this.message = "Dao failed to list categories.";
    }
  }
};

const CategoryUpdate = {
  UC_CODE: `${CATEGORY_ERROR_PREFIX}update/`,

  InvalidDtoIn: class extends JokesMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${CategoryUpdate.UC_CODE}Invalid DtoIn`;
      this.message = "Invalid arguments";
    }
  },
  CategoryDaoUpdateFailed: class extends JokesMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${CategoryUpdate.UC_CODE}categoryDaoUpdateFailed`;
      this.message = "Dao failed to update category."
    }
  }
};

const CategoryDelete = {
  UC_CODE: `${CATEGORY_ERROR_PREFIX}delete/`,

  InvalidDtoIn: class extends JokesMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${CategoryDelete.UC_CODE}Invalid DtoIn`;
      this.message = "Invalid arguments";
    }
  },
  DaoCategoryNotFound: class extends JokesMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${CategoryDelete.UC_CODE}categoryDaoDeleteFailed`;
      this.message = "Category not found.";
    }
  }
};


module.exports = {
  CategoryDelete,
  CategoryUpdate,
  CategoryList,
  CategoryGet,
  CategoryCreate
};
