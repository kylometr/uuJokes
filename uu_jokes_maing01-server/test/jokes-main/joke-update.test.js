const { TestHelper } = require("uu_appg01_server-test");
const path = require("path");
const fs = require("fs");

const USE_CASE = "joke/update";

let jokeId;
let categoryId;

beforeAll(async () => {
  await TestHelper.setup({ authEnabled: false, sysStatesEnabled: false });
  await TestHelper.initUuSubAppInstance();
  await TestHelper.createUuAppWorkspace();
});

beforeEach(async () => {
  await TestHelper.dropDatabase();
  let catDtoIn = {
    name: "category"
  }
  const catResult = await TestHelper.executePostCommand("category/create", catDtoIn);
  categoryId = catResult.id;

  const jokeCreateDtoIn = {
    name: "Joke",
    text: "A very funny joke."
  }
  const result = await TestHelper.executePostCommand("joke/create", jokeCreateDtoIn);
  jokeId = result.id;
});

afterAll(async () => {
  await TestHelper.teardown();
});

describe(`${USE_CASE} uuCmd tests`, () => {
  test(`${USE_CASE} - invalid dtoIn test`, async () => {
    expect.assertions(2)
    try {
      await TestHelper.executePostCommand(USE_CASE, { id: "00719762fas13" });
    } catch (e) {
      expect(e.code).toEqual(`uu-jokes-main/${USE_CASE}/invalidDtoIn`);
      expect(e.status).toEqual(400);
    }
  });

  test(`${USE_CASE} - invalid id test`, async () => {
    //expect.assertions(2)
    const invalidId = "1111a1a11aaa1111a111a111";
    try {
      await TestHelper.executePostCommand(USE_CASE, { id: invalidId, text: "Updated joke." });
    } catch (e) {
      expect(e.code).toEqual(`uu-jokes-main/${USE_CASE}/jokeDaoNotFound`);
      expect(e.status).toEqual(400);
    }
  });

  test(`${USE_CASE} - with valid name & text test`, async () => {
    expect.assertions(6);
    let dtoIn = {
      id: jokeId,
      name: "Updated joke",
      text: "A very funny updated joke."
    };

    const result = await TestHelper.executePostCommand(USE_CASE, dtoIn);
    expect(result.data.id).toEqual(dtoIn.id);
    expect(result.data.name).toEqual(dtoIn.name);
    expect(result.data.text).toEqual(dtoIn.text);
    expect(result.data.uuAppErrorMap).toEqual({});

    expect(result.awid).toEqual(TestHelper.getAwid());
    expect(result.status).toEqual(200);
  });

  test(`${USE_CASE} - with valid name, with text & with categoryIdList test`, async () => {
    expect.assertions(7);
    let dtoIn = {
      id: jokeId,
      name: "Updated joke",
      text: "A very funny updated joke.",
      categoryIdList: [categoryId]
    };

    const result = await TestHelper.executePostCommand(USE_CASE, dtoIn);
    expect(result.data.id).toEqual(dtoIn.id);
    expect(result.data.name).toEqual(dtoIn.name);
    expect(result.data.text).toEqual(dtoIn.text);
    expect(result.data.categoryIdList).toEqual(dtoIn.categoryIdList);
    expect(result.data.uuAppErrorMap).toEqual({});

    expect(result.awid).toEqual(TestHelper.getAwid());
    expect(result.status).toEqual(200);
  });

  test(`${USE_CASE} - with image test`, async () => {
    expect.assertions(6);
    let imagePath = path.resolve(__dirname, "../test_files/joke.jpg");
    let dtoIn = {
      id: jokeId,
      name: "Very Funny Joke",
      text: "Something very funny",
      image: fs.createReadStream(imagePath)
    };

    const jokeResult = await TestHelper.executePostCommand(USE_CASE, dtoIn);
    expect(jokeResult.name).toEqual(dtoIn.name);
    expect(jokeResult.text).toEqual(dtoIn.text);
    expect(jokeResult.image).toBeDefined();

    expect(jokeResult.awid).toEqual(TestHelper.getAwid());
    expect(jokeResult.data.uuAppErrorMap).toEqual({});
    expect(jokeResult.status).toEqual(200);
  });

  test(`${USE_CASE} - invalid file type test`, async () => {
    //expect.assertions(2);
    let filePath = path.resolve(__dirname, "../package.json");
    let dtoIn = {
      id: jokeId,
      name: "Very Funny Joke",
      text: "Something very funny",
      image: fs.createReadStream(filePath)
    };

    try{
      await TestHelper.executePostCommand(USE_CASE, dtoIn);
    }catch (e) {
      expect(e.code).toEqual(`uu-jokes-main/${USE_CASE}/invalidDtoInImageType`);
      expect(e.status).toEqual(400);
    }
  });
});
