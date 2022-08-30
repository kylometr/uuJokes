"use strict";
const { Validator } = require("uu_appg01_server").Validation;
const { DaoFactory, ObjectStoreError } = require("uu_appg01_server").ObjectStore;
const { ValidationHelper } = require("uu_appg01_server").AppServer;
const { Profile, AppClientTokenService, UuAppWorkspace, UuAppWorkspaceError } = require("uu_appg01_server").Workspace;
const { UriBuilder } = require("uu_appg01_server").Uri;
const { LoggerFactory } = require("uu_appg01_server").Logging;
const { AppClient } = require("uu_appg01_server");
const { BinaryStoreError, ObjectNotFound } = require("uu_appg01_binarystore");

const FileHelper = require("../helpers/file-helper");
const Errors = require("../api/errors/jokes-main-error");

const WARNINGS = {
  initUnsupportedKeys: {
    code: `${Errors.Init.UC_CODE}unsupportedKeys`,
  },
  helloWorldUnsupportedKeys: {
    code: `${Errors.HelloWorld.UC_CODE}unsupportedKeys`
  },
  jokeCreateUnsupportedKeys: {
    code: `${Errors.JokeCreate.UC_CODE}unsupportedKeys`
  },
  jokeGetUnsupportedKeys: {
    code: `${Errors.JokeGet.UC_CODE}unsupportedKeys`
  },
  jokeListUnsupportedKeys: {
    code: `${Errors.JokeList.UC_CODE}unsupportedKeys`
  },
  jokeUpdateUnsupportedKeys: {
    code: `${Errors.JokeUpdate.UC_CODE}unsupportedKeys`
  },
  jokeDeleteUnsupportedKeys: {
    code: `${Errors.JokeDelete.UC_CODE}unsupportedKeys`
  }
};
const EXECUTIVES_PROFILE = "Executives";

const logger = LoggerFactory.get("JokesMainAbl");

class JokesMainAbl {
  constructor() {
    this.validator = Validator.load();
    this.jokeDao = DaoFactory.getDao("jokesMain");
    this.categoryDao = DaoFactory.getDao("jokeCategories");
    this.binaryDao = DaoFactory.getDao("jokeImage");
  }

  async delete(awid, dtoIn, session) {
    // Validate input
    let validationResult = this.validator.validate("jokeDeleteDtoInType", dtoIn);
    let uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      WARNINGS.jokeDeleteUnsupportedKeys.code,
      Errors.JokeDelete.InvalidDtoIn
    );

    // Set identity
    dtoIn.uuIdentity = session.getIdentity().getUuIdentity();
    dtoIn.uuIdentityName = session.getIdentity().getName();
    dtoIn.awid = awid;

    // Check if joke exists
    const result = await this.jokeDao.get(awid, dtoIn.id);
    if (!result) {
      throw new Errors.JokeDelete.DaoJokeNotFound({ uuAppErrorMap });
    }

    // Delete joke
    await this.jokeDao.delete(dtoIn);

    // Delete joke's image if present
    if (result.image) {
      try {
        await this.binaryDao.deleteByCode(awid, result.image);
      } catch (e) {
        if (e instanceof ObjectNotFound) {
          throw new Errors.JokeDelete.DaoImageNotFound({ uuAppErrorMap });
        }
      }
    }

    const dtoOut = {
      ...result,
      uuAppErrorMap
    }
    return dtoOut;
  }

  async update(awid, dtoIn, session) {
    // Validate input
    let validationResult = this.validator.validate("jokeUpdateDtoInType", dtoIn);
    let uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      WARNINGS.jokeUpdateUnsupportedKeys.code,
      Errors.JokeUpdate.InvalidDtoIn
    );

    // Check categoryIdList (remove duplicates, check if categories exist)
    if (dtoIn.categoryIdList && dtoIn.categoryIdList.length) {
      dtoIn.categoryIdList = [...new Set(dtoIn.categoryIdList)];

      for (const category of dtoIn.categoryIdList) {
        const result = await this.categoryDao.get(awid, category);
        if (!result) {
          throw new Errors.JokeUpdate.JokeDaoCategoryNotFound({ uuAppErrorMap });
        }
      }
    }

    // Check if joke exists
    const joke = await this.jokeDao.get(awid, dtoIn.id);
    if (!joke) {
      throw new Errors.JokeUpdate.DaoJokeNotFound({ uuAppErrorMap });
    }

    // Delete image if it was present
    if (joke.image) {
      try {
        await this.binaryDao.deleteByCode(awid, joke.image);
      } catch (e) {
        if (e instanceof ObjectNotFound) {
          throw new Errors.JokeUpdate.DaoImageNotFound({ uuAppErrorMap });
        }
      }
    }

    // Set identity
    dtoIn.uuIdentity = session.getIdentity().getUuIdentity();
    dtoIn.uuIdentityName = session.getIdentity().getName();
    dtoIn.awid = awid;

    // Create new image if it is present
    let jokeImage;
    if (dtoIn.image) {
      await FileHelper.validateImage(dtoIn.image, uuAppErrorMap, Errors.JokeUpdate.InvalidDtoInImage);
      try {
        jokeImage = await this.binaryDao.create({ awid }, dtoIn.image);
        dtoIn.image = jokeImage.code;
      } catch (e) {
        if (e instanceof BinaryStoreError) {
          throw new Errors.JokeUpdate.JokeImageDaoCreateFailed({ uuAppErrorMap }, e);
        }
        throw e;
      }
    }

    // Update joke
    let dtoOut = {};
    try {
      dtoOut = await this.jokeDao.updateOne(dtoIn);
    } catch (e) {
      if (e instanceof ObjectStoreError) {
        throw new Errors.JokeUpdate.JokeDaoUpdateFailed({ uuAppErrorMap }, e);
      }
      throw e;
    }

    dtoOut.uuAppErrorMap = uuAppErrorMap;
    return dtoOut;
  }

  async list(awid, dtoIn) {
    // Validate input
    let validationResult = this.validator.validate("jokeListDtoInType", dtoIn);
    let uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      WARNINGS.jokeListUnsupportedKeys.code,
      Errors.JokeList.InvalidDtoIn
    );

    // Get list of jokes
    let sort = { [dtoIn.sortBy]: (dtoIn.order === "desc") ? -1 : 1 };
    let dtoOut = {};
    try {
      dtoOut = await this.jokeDao.getAll(awid, dtoIn.pageInfo, sort);
    } catch (e) {
      if (e instanceof ObjectStoreError) {
        throw new Errors.JokeList.JokeDaoListFailed({ uuAppErrorMap }, e);
      }
      throw e;
    }

    dtoOut.uuAppErrorMap = uuAppErrorMap;
    return dtoOut;
  }

  async get(awid, dtoIn) {
    // Validate input
    let validationResult = this.validator.validate("jokeGetDtoInType", dtoIn);
    let uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      WARNINGS.jokeGetUnsupportedKeys.code,
      Errors.JokeGet.InvalidDtoIn
    );

    // Get joke from db
    let result = await this.jokeDao.get(awid, dtoIn.id);
    if (!result) {
      throw new Errors.JokeGet.JokeDaoGetFailed({ uuAppErrorMap });
    }

    const dtoOut = {
      ...result,
      uuAppErrorMap
    };
    return dtoOut;
  }

  async create(awid, dtoIn, session, authorizationResult) {
    // Validate input
    let validationResult = this.validator.validate("jokeCreateDtoInType", dtoIn);
    let uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      WARNINGS.jokeCreateUnsupportedKeys.code,
      Errors.JokeCreate.InvalidDtoIn
    );

    // Check categoryIdList (remove duplicates, check if categories exist)
    if (dtoIn.categoryIdList && dtoIn.categoryIdList.length) {
      dtoIn.categoryIdList = [...new Set(dtoIn.categoryIdList)];

      for (const category of dtoIn.categoryIdList) {
        const result = await this.categoryDao.get(awid, category);
        if (!result) {
          throw new Errors.JokeCreate.JokeDaoCategoryNotFound({ uuAppErrorMap });
        }
      }
    }

    // Create image if present
    let jokeImage;
    if (dtoIn.image) {
      await FileHelper.validateImage(dtoIn.image, uuAppErrorMap, Errors.JokeCreate.InvalidDtoInImage);
      try {
        jokeImage = await this.binaryDao.create({ awid }, dtoIn.image);
        dtoIn.image = jokeImage.code;
      } catch (e) {
        if (e instanceof BinaryStoreError) {
          throw new Errors.JokeCreate.JokeImageDaoCreateFailed({ uuAppErrorMap }, e);
        }
        throw e;
      }
    }

    // Set visibility and identity
    dtoIn.visibility = authorizationResult.getAuthorizedProfiles().includes(EXECUTIVES_PROFILE);
    dtoIn.uuIdentity = session.getIdentity().getUuIdentity();
    dtoIn.uuIdentityName = session.getIdentity().getName();

    // Create joke
    dtoIn.awid = awid;
    let dtoOut = {};
    try {
      dtoOut = await this.jokeDao.create(dtoIn);
    } catch (e) {
      if (jokeImage) {
        await this.binaryDao.deleteByCode(awid, jokeImage.code);
      }
      if (e instanceof ObjectStoreError) {
        throw new Errors.JokeCreate.JokeDaoCreateFailed({ uuAppErrorMap }, e);
      }
      throw e;
    }

    dtoOut.uuAppErrorMap = uuAppErrorMap;
    return dtoOut;
  }

  async helloWorld(awid, dtoIn) {
    // HDS 1, 1.1
    let validationResult = this.validator.validate("helloWorldDtoInType", dtoIn);

    // HDS 1.2, 1.3 // A1, A2
    let uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      WARNINGS.helloWorldUnsupportedKeys.code,
      Errors.HelloWorld.InvalidDtoIn
    );

    // HDS 2
    const dtoOut = {
      uuAppErrorMap,
      name: dtoIn.name,
      timeStamp: (new Date()).toISOString(),
    };

    return dtoOut;
  }

  async init(uri, dtoIn, session) {
    const awid = uri.getAwid();
    // HDS 1
    let validationResult = this.validator.validate("initDtoInType", dtoIn);
    // A1, A2
    let uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      WARNINGS.initUnsupportedKeys.code,
      Errors.Init.InvalidDtoIn
    );

    // HDS 2
    const schemas = ["jokesMain"];
    let schemaCreateResults = schemas.map(async (schema) => {
      try {
        return await DaoFactory.getDao(schema).createSchema();
      } catch (e) {
        // A3
        throw new Errors.Init.SchemaDaoCreateSchemaFailed({ uuAppErrorMap }, { schema }, e);
      }
    });
    await Promise.all(schemaCreateResults);

    if (dtoIn.uuBtLocationUri) {
      const baseUri = uri.getBaseUri();
      const uuBtUriBuilder = UriBuilder.parse(dtoIn.uuBtLocationUri);
      const location = uuBtUriBuilder.getParameters().id;
      const uuBtBaseUri = uuBtUriBuilder.toUri().getBaseUri();

      const createAwscDtoIn = {
        name: "UuJokes",
        typeCode: "uu-jokes-maing01",
        location: location,
        uuAppWorkspaceUri: baseUri,
      };

      const awscCreateUri = uuBtUriBuilder.setUseCase("uuAwsc/create").toUri();
      const appClientToken = await AppClientTokenService.createToken(uri, uuBtBaseUri);
      const callOpts = AppClientTokenService.setToken({ session }, appClientToken);

      // TODO HDS
      let awscId;
      try {
        const awscDtoOut = await AppClient.post(awscCreateUri, createAwscDtoIn, callOpts);
        awscId = awscDtoOut.id;
      } catch (e) {
        if (e.code.includes("applicationIsAlreadyConnected") && e.paramMap.id) {
          logger.warn(`Awsc already exists id=${e.paramMap.id}.`, e);
          awscId = e.paramMap.id;
        } else {
          throw new Errors.Init.CreateAwscFailed({ uuAppErrorMap }, { location: dtoIn.uuBtLocationUri }, e);
        }
      }

      const artifactUri = uuBtUriBuilder.setUseCase(null).clearParameters().setParameter("id", awscId).toUri();

      await UuAppWorkspace.connectArtifact(
        baseUri,
        {
          artifactUri: artifactUri.toString(),
          synchronizeArtifactBasicAttributes: false,
        },
        session
      );
    }

    // HDS 3
    if (dtoIn.uuAppProfileAuthorities) {
      try {
        await Profile.set(awid, "Authorities", dtoIn.uuAppProfileAuthorities);
      } catch (e) {
        if (e instanceof UuAppWorkspaceError) {
          // A4
          throw new Errors.Init.SysSetProfileFailed({ uuAppErrorMap }, { role: dtoIn.uuAppProfileAuthorities }, e);
        }
        throw e;
      }
    }

    // HDS 4 - HDS N
    // TODO Implement according to application needs...

    // HDS N+1
    const workspace = UuAppWorkspace.get(awid);

    return {
      ...workspace,
      uuAppErrorMap: uuAppErrorMap,
    };
  }

  async load(uri, session, uuAppErrorMap = {}) {
    // HDS 1
    const dtoOut = await UuAppWorkspace.load(uri, session, uuAppErrorMap);

    // TODO Implement according to application needs...
    // if (dtoOut.sysData.awidData.sysState !== "created") {
    //   const awid = uri.getAwid();
    //   const appData = await this.dao.get(awid);
    //   dtoOut.data = { ...appData, relatedObjectsMap: {} };
    // }

    // HDS 2
    return dtoOut;
  }

  async loadBasicData(uri, session, uuAppErrorMap = {}) {
    // HDS 1
    const dtoOut = await UuAppWorkspace.loadBasicData(uri, session, uuAppErrorMap);

    // TODO Implement according to application needs...
    // const awid = uri.getAwid();
    // const workspace = await UuAppWorkspace.get(awid);
    // if (workspace.sysState !== "created") {
    //   const appData = await this.dao.get(awid);
    //   dtoOut.data = { ...appData, relatedObjectsMap: {} };
    // }

    // HDS 2
    return dtoOut;
  }
}

module.exports = new JokesMainAbl();
