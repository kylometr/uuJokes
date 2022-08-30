const { TestHelper } = require("uu_appg01_server-test");

const USE_CASE = "joke/list";
const jokeArray = [
  { name: "Funny Joke", text: "A very funny joke." },
  { name: "Unfunny Joke", text: "Not so funny joke." },
];

beforeAll(async () => {
  await TestHelper.setup({ authEnabled: false, sysStatesEnabled: false });
  await TestHelper.initUuSubAppInstance();
  await TestHelper.createUuAppWorkspace();
});

beforeEach(async () => {
  await TestHelper.dropDatabase();

  await TestHelper.executePostCommand("joke/create", jokeArray[0]);
  await TestHelper.executePostCommand("joke/create", jokeArray[1]);
});

afterAll(async () => {
  await TestHelper.teardown();
});

describe(`${USE_CASE} - uuCmd tests`, () => {
  test(`${USE_CASE} - invalid dtoIn test`, async () => {
    expect.assertions(2)
    try {
      await TestHelper.executeGetCommand(USE_CASE, { order: "invalid" });
    } catch (e) {
      expect(e.code).toEqual(`uu-jokes-main/${USE_CASE}/invalidDtoIn`);
      expect(e.status).toEqual(400);
    }
  });

  test(`${USE_CASE} - valid dtoIn test`, async () => {
    expect.assertions(9)
    const result = await TestHelper.executeGetCommand(USE_CASE, { sortBy: "name", order: "desc" });
    expect(result.data.itemList.length).toEqual(2);
    expect(result.data.itemList[0].name).toEqual(jokeArray[1].name);
    expect(result.data.itemList[0].text).toEqual(jokeArray[1].text);
    expect(result.data.itemList[1].name).toEqual(jokeArray[0].name);
    expect(result.data.itemList[1].text).toEqual(jokeArray[0].text);
    expect(result.data.itemList[0].awid).toEqual(TestHelper.getAwid());
    expect(result.data.itemList[1].awid).toEqual(TestHelper.getAwid());
    expect(result.data.uuAppErrorMap).toEqual({});
    expect(result.status).toEqual(200);
  });
});
