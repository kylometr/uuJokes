const { TestHelper } = require("uu_appg01_server-test");

const USE_CASE = "joke/get";
const jokeCreateDtoIn = {
  name: "Joke",
  text: "A very funny joke."
}
let jokeId;

beforeAll(async () => {
  await TestHelper.setup({ authEnabled: false, sysStatesEnabled: false });
  await TestHelper.initUuSubAppInstance();
  await TestHelper.createUuAppWorkspace();
});

beforeEach(async () => {
  await TestHelper.dropDatabase();

  const result = await TestHelper.executePostCommand("joke/create", jokeCreateDtoIn);
  jokeId = result.id;
});

afterAll(async () => {
  await TestHelper.teardown();
});

describe(`${USE_CASE} - uuCmd tests`, () => {
  test(`${USE_CASE} - invalid dtoIn test`, async () => {
    expect.assertions(2)
    try {
      await TestHelper.executeGetCommand(USE_CASE, { id: "00719762fas13" });
    } catch (e) {
      expect(e.code).toEqual(`uu-jokes-main/${USE_CASE}/invalidDtoIn`);
      expect(e.status).toEqual(400);
    }
  });

  test(`${USE_CASE} - invalid id test`, async () => {
    expect.assertions(2)
    const invalidId = "1111a1a11aaa1111a111a111";
    try {
      await TestHelper.executeGetCommand(USE_CASE, { id: invalidId });
    } catch (e) {
      expect(e.code).toEqual(`uu-jokes-main/${USE_CASE}/jokeDaoGetFailed`);
      expect(e.status).toEqual(400);
    }
  });

  test(`${USE_CASE} - valid test`, async () => {
    expect.assertions(6);
    let dtoIn = {
      id: jokeId,
    };

    const expectedResult = {
      id: jokeId,
      ...jokeCreateDtoIn
    }
    const result = await TestHelper.executeGetCommand(USE_CASE, dtoIn);
    expect(result.data.id).toEqual(expectedResult.id);
    expect(result.data.name).toEqual(expectedResult.name);
    expect(result.data.text).toEqual(expectedResult.text);
    expect(result.data.uuAppErrorMap).toEqual({});

    expect(result.awid).toEqual(TestHelper.getAwid());
    expect(result.status).toEqual(200);
  });
});
