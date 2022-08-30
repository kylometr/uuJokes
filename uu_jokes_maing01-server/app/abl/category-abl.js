"use strict";
const { Validator } = require("uu_appg01_server").Validation;
const { DaoFactory, ObjectStoreError } = require("uu_appg01_server").ObjectStore;
const { ValidationHelper } = require("uu_appg01_server").AppServer;

const Errors = require("../api/errors/category-error");


const WARNINGS = {
  categoryCreateUnsupportedKeys: {
    code: `${Errors.CategoryCreate.UC_CODE}unsupportedKeys`
  },
  categoryGetUnsupportedKeys: {
    code: `${Errors.CategoryGet.UC_CODE}unsupportedKeys`
  },
  categoryListUnsupportedKeys: {
    code: `${Errors.CategoryList.UC_CODE}unsupportedKeys`
  },
  categoryUpdateUnsupportedKeys: {
    code: `${Errors.CategoryUpdate.UC_CODE}unsupportedKeys`
  },
  categoryDeleteUnsupportedKeys: {
    code: `${Errors.CategoryDelete.UC_CODE}unsupportedKeys`
  }
};

class CategoryAbl {

  constructor() {
    this.validator = Validator.load();
    this.dao = DaoFactory.getDao("jokeCategories");
  }

  async delete(awid, dtoIn, session) {
    let validationResult = this.validator.validate("categoryDeleteDtoInType", dtoIn);
    let uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      WARNINGS.categoryDeleteUnsupportedKeys.code,
      Errors.CategoryDelete.InvalidDtoIn
    );

    dtoIn.uuIdentity = session.getIdentity().getUuIdentity();
    dtoIn.uuIdentityName = session.getIdentity().getName();

    dtoIn.awid = awid;

    const result = await this.dao.get(awid, dtoIn.id);
    console.log(result);
    if (!result) {
      throw new Errors.CategoryDelete.DaoCategoryNotFound({ uuAppErrorMap });
    }
    await this.dao.delete(dtoIn);

    const dtoOut = {
      ...result,
      uuAppErrorMap
    }
    return dtoOut;
  }

  async update(awid, dtoIn, session) {
    // Validate input
    let validationResult = this.validator.validate("categoryUpdateDtoInType", dtoIn);
    let uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      WARNINGS.categoryUpdateUnsupportedKeys.code,
      Errors.CategoryUpdate.InvalidDtoIn
    );

    // Check if category already exists
    const result = await this.dao.getByFilter(awid, { name: dtoIn.name.toLowerCase() });
    if (result) {
      throw new Errors.CategoryCreate.CategoryAlreadyExists({ uuAppErrorMap });
    }

    // Set properties
    dtoIn.uuIdentity = session.getIdentity().getUuIdentity();
    dtoIn.uuIdentityName = session.getIdentity().getName();
    dtoIn.name = dtoIn.name.toLowerCase();
    dtoIn.awid = awid;

    // Update category
    let dtoOut = {};
    try {
      dtoOut = await this.dao.updateOne(dtoIn);
    } catch (e) {
      if (e instanceof ObjectStoreError) {
        throw new Errors.CategoryUpdate.CategoryDaoUpdateFailed({ uuAppErrorMap }, e);
      }
      throw e;
    }
    dtoOut.uuAppErrorMap = uuAppErrorMap;
    return dtoOut;
  }

  async list(awid, dtoIn) {
    // HDS 1, 1.1
    let validationResult = this.validator.validate("categoryListDtoInType", dtoIn);

    // HDS 1.2, 1.3 // A1, A2
    let uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      WARNINGS.categoryListUnsupportedKeys.code,
      Errors.CategoryList.InvalidDtoIn
    );

    // HDS 2
    let sort = { name: (dtoIn.order === "desc") ? -1 : 1 };
    let dtoOut = {};
    try {
      dtoOut = await this.dao.getAll(awid, dtoIn.pageInfo, sort);
    } catch (e) {
      if (e instanceof ObjectStoreError) {
        throw new Errors.CategoryList.CategoryDaoListFailed({ uuAppErrorMap }, e);
      }
      throw e;
    }

    // HDS 3
    dtoOut.uuAppErrorMap = uuAppErrorMap;
    return dtoOut;
  }

  async get(awid, dtoIn) {
    let validationResult = this.validator.validate("categoryGetDtoInType", dtoIn);
    let uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      WARNINGS.categoryGetUnsupportedKeys.code,
      Errors.CategoryGet.InvalidDtoIn
    );
    const result = await this.dao.get(awid, dtoIn.id);
    if (!result) {
      throw new Errors.CategoryGet.CategoryDaoGetFailed({ uuAppErrorMap });
    }
    const dtoOut = {
      ...result,
      uuAppErrorMap
    };
    return dtoOut;
  }

  async create(awid, dtoIn, session) {
    // Validate input
    let validationResult = this.validator.validate("categoryCreateDtoInType", dtoIn);
    let uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      WARNINGS.categoryCreateUnsupportedKeys.code,
      Errors.CategoryCreate.InvalidDtoIn
    );

    // Check if category already exists
    const result = await this.dao.getByFilter(awid, { name: dtoIn.name.toLowerCase() });
    if (result) {
      throw new Errors.CategoryCreate.CategoryAlreadyExists({ uuAppErrorMap });
    }

    // Set properties
    dtoIn.uuIdentity = session.getIdentity().getUuIdentity();
    dtoIn.uuIdentityName = session.getIdentity().getName();
    dtoIn.name = dtoIn.name.toLowerCase();
    dtoIn.awid = awid;

    // Create category
    let dtoOut = {};
    try {
      dtoOut = await this.dao.create(dtoIn);
    } catch (e) {
      if (e instanceof ObjectStoreError) {
        throw new Errors.CategoryCreate.CategoryDaoCreateFailed({ uuAppErrorMap }, e);
      }
      throw e;
    }

    dtoOut.uuAppErrorMap = uuAppErrorMap;
    return dtoOut;
  }

}

module.exports = new CategoryAbl();
