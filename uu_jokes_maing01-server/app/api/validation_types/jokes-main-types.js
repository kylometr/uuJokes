/* eslint-disable */

const JOKE_NAME_FORMAT = string(255);
const JOKE_TEXT_FORMAT = uu5String(6000);

const initDtoInType = shape({
  uuAppProfileAuthorities: uri().isRequired("uuBtLocationUri"),
  uuBtLocationUri: uri(),
  name: uu5String(512),
  sysState: oneOf(["active", "restricted", "readOnly"]),
  adviceNote: shape({
    message: uu5String().isRequired(),
    severity: oneOf(["debug", "info", "warning", "error", "fatal"]),
    estimatedEndTime: datetime(),
  }),
});

const helloWorldDtoInType = shape({
  name: string(20).isRequired()
});

const jokeCreateDtoInType = shape({
  name: JOKE_NAME_FORMAT.isRequired(),
  text: JOKE_TEXT_FORMAT.isRequired("image"),
  categoryIdList: array(id(), 1, 10),
  image: binary().isRequired("text")
});

const jokeGetDtoInType = shape({
  id: id().isRequired()
});

const jokeListDtoInType = shape({
  sortBy: string(20),
  order: oneOf(["asc", "desc"]),
  pageInfo: shape({
    pageIndex: integer(),
    pageSize: integer()
  })
});

const jokeUpdateDtoInType = shape({
  id: id().isRequired(),
  name: JOKE_NAME_FORMAT,
  text: JOKE_TEXT_FORMAT.isRequired("image"),
  categoryIdList: array(id(), 10),
  visibility: boolean(),
  image: binary().isRequired("text")
});

const jokeDeleteDtoInType = jokeGetDtoInType;

