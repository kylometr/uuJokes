const { TestHelper } = require("uu_appg01_server-test");

const USE_CASE = "category/update";

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
      await TestHelper.executePostCommand(USE_CASE, { id: "00719762fas13" });
    } catch (e) {
      expect(e.code).toEqual(`uu-jokes-main/${USE_CASE}/invalidDtoIn`);
      expect(e.status).toEqual(400);
    }
  });

  test(`${USE_CASE} - id not found test`, async () => {
    expect.assertions(2)
    const invalidId = "1111a1a11aaa1111a111a111";
    try {
      await TestHelper.executePostCommand(USE_CASE, { id: invalidId, name: "newName" });
    } catch (e) {
      expect(e.code).toEqual(`uu-jokes-main/${USE_CASE}/categoryDaoUpdateFailed`);
      expect(e.status).toEqual(400);
    }
  });

  test(`${USE_CASE} - valid dtoIn`, async () => {
    expect.assertions(5);
    let dtoIn = {
      id: categoryId,
      name: "updated category",
    };

    const result = await TestHelper.executePostCommand(USE_CASE, dtoIn);
    expect(result.data.id).toEqual(dtoIn.id);
    expect(result.data.name).toEqual(dtoIn.name);
    expect(result.data.uuAppErrorMap).toEqual({});

    expect(result.awid).toEqual(TestHelper.getAwid());
    expect(result.status).toEqual(200);
  });
});
