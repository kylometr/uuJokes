const { TestHelper } = require("uu_appg01_server-test");

const USE_CASE = "category/create";

beforeAll(async () => {
  await TestHelper.setup({ authEnabled: false, sysStatesEnabled: false });
  await TestHelper.initUuSubAppInstance();
  await TestHelper.createUuAppWorkspace();
});

beforeEach(async () => {
  await TestHelper.dropDatabase();
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

  test(`${USE_CASE} - valid dtoIn test`, async () => {
    expect.assertions(4);
    let dtoIn = {
      name: "new category"
    };

    const result = await TestHelper.executePostCommand(USE_CASE, dtoIn);
    expect(result.name).toEqual(dtoIn.name);

    expect(result.awid).toEqual(TestHelper.getAwid());
    expect(result.data.uuAppErrorMap).toEqual({});
    expect(result.status).toEqual(200);

  });
});
