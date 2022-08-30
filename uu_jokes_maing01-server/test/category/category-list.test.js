const { TestHelper } = require("uu_appg01_server-test");

const USE_CASE = "category/list";
const categoryArray = [
  { name: "dad joke"},
  { name: "dark humour"},
];

beforeAll(async () => {
  await TestHelper.setup({ authEnabled: false, sysStatesEnabled: false });
  await TestHelper.initUuSubAppInstance();
  await TestHelper.createUuAppWorkspace();
});

beforeEach(async () => {
  await TestHelper.dropDatabase();

  await TestHelper.executePostCommand("category/create", categoryArray[0]);
  await TestHelper.executePostCommand("category/create", categoryArray[1]);
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
    expect.assertions(7)
    const result = await TestHelper.executeGetCommand(USE_CASE, { order: "desc" });
    expect(result.data.itemList.length).toEqual(2);
    expect(result.data.itemList[0].name).toEqual(categoryArray[1].name);
    expect(result.data.itemList[1].name).toEqual(categoryArray[0].name);
    expect(result.data.itemList[0].awid).toEqual(TestHelper.getAwid());
    expect(result.data.itemList[1].awid).toEqual(TestHelper.getAwid());
    expect(result.data.uuAppErrorMap).toEqual({});
    expect(result.status).toEqual(200);
  });
});
