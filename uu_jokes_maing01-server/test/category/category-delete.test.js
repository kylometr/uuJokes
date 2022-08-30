const { TestHelper } = require("uu_appg01_server-test");

const USE_CASE = "category/delete";

let categoryId;

beforeAll(async () => {
  await TestHelper.setup({ authEnabled: false, sysStatesEnabled: false });
  await TestHelper.initUuSubAppInstance();
  await TestHelper.createUuAppWorkspace();
});

beforeEach(async () => {
  await TestHelper.dropDatabase();

  const result = await TestHelper.executePostCommand("category/create", { name: "new category" });
  categoryId = result.id;
});

afterAll(async () => {
  await TestHelper.teardown();
});

describe(`${USE_CASE} uuCmd tests`, () => {
  test(`${USE_CASE} - invalid dtoIn test`, async () => {
    expect.assertions(2)
    try {
      await TestHelper.executePostCommand(USE_CASE, { name: 123 });
    } catch (e) {
      expect(e.code).toEqual(`uu-jokes-main/${USE_CASE}/invalidDtoIn`);
      expect(e.status).toEqual(400);
    }
  });

  test(`${USE_CASE} - id not found test`, async () => {
    expect.assertions(2)
    const invalidId = "6308c99ca2da844e10dc9d2a";
    try {
      await TestHelper.executePostCommand(USE_CASE, { id: invalidId });
    } catch (e) {
      expect(e.code).toEqual(`uu-jokes-main/${USE_CASE}/categoryDaoNotFound`);
      expect(e.status).toEqual(400);
    }
  });

  test(`${USE_CASE} - valid dtoIn test`, async () => {
    expect.assertions(5);
    let dtoIn = {
      id: categoryId,
    };

    const expectedResult = {
      id: categoryId,
      name: "new category"
    }
    const result = await TestHelper.executePostCommand(USE_CASE, dtoIn);
    expect(result.data.id).toEqual(expectedResult.id);
    expect(result.data.name).toEqual(expectedResult.name);
    expect(result.data.uuAppErrorMap).toEqual({});

    expect(result.awid).toEqual(TestHelper.getAwid());
    expect(result.status).toEqual(200);
  });
});
