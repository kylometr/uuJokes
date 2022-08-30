const { TestHelper } = require("uu_appg01_server-test");

const path = require("path");
const fs = require("fs");

const USE_CASE = "joke/create";

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
});

afterAll(async () => {
  await TestHelper.teardown();
});

describe(`${USE_CASE} uuCmd tests`, () => {
  test(`${USE_CASE} - invalid dtoIn test`, async () => {
    expect.assertions(2)
    try {
      await TestHelper.executePostCommand(USE_CASE, { name: 123, text: 456 });
    } catch (e) {
      expect(e.code).toEqual(`uu-jokes-main/${USE_CASE}/invalidDtoIn`);
      expect(e.status).toEqual(400);
    }
  });
  test(`${USE_CASE} - no image, no category test`, async () => {
    expect.assertions(5);
    let dtoIn = {
      name: "Very Funny Joke",
      text: "Something very funny",
    };
    let result = await TestHelper.executePostCommand(USE_CASE, dtoIn);

    expect(result.data.name).toEqual(dtoIn.name);
    expect(result.data.text).toEqual(dtoIn.text);

    expect(result.awid).toEqual(TestHelper.getAwid());
    expect(result.data.uuAppErrorMap).toEqual({});
    expect(result.status).toEqual(200);
  });

  test(`${USE_CASE} - no image, invalid category test`, async () => {
    expect.assertions(2);

    let dtoIn = {
      name: "Very Funny Joke",
      text: "Something very funny",
      categoryIdList: ["1111a1a11aaa1111a111a111"]
    };

    try {
      await TestHelper.executePostCommand(USE_CASE, dtoIn);
    } catch (e) {
      expect(e.code).toEqual(`uu-jokes-main/${USE_CASE}/jokeDaoCategoryNotFound`);
      expect(e.status).toEqual(400);
    }
  });

  test(`${USE_CASE} - no image, with category test`, async () => {
    expect.assertions(6);
    let dtoIn = {
      name: "Very Funny Joke",
      text: "Something very funny",
      categoryIdList: [categoryId]
    };

    const jokeResult = await TestHelper.executePostCommand(USE_CASE, dtoIn);
    expect(jokeResult.name).toEqual(dtoIn.name);
    expect(jokeResult.text).toEqual(dtoIn.text);
    expect(jokeResult.categoryIdList).toEqual(dtoIn.categoryIdList);

    expect(jokeResult.awid).toEqual(TestHelper.getAwid());
    expect(jokeResult.data.uuAppErrorMap).toEqual({});
    expect(jokeResult.status).toEqual(200);

  });
  test(`${USE_CASE} - with image test`, async () => {
    expect.assertions(6);
    let imagePath = path.resolve(__dirname, "../test_files/joke.jpg");
    let dtoIn = {
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
    expect.assertions(2);
    let filePath = path.resolve(__dirname, "../package.json");
    let dtoIn = {
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
