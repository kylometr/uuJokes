/* eslint-disable */

const categoryCreateDtoInType = shape({
  name: uu5String(255).isRequired(),
  icon: string(40)
})

const categoryGetDtoInType = shape({
  id: id().isRequired("name"),
  name: uu5String(255).isRequired("id"),
});

const categoryListDtoInType = shape({
  order: oneOf(["asc", "desc"]),
  pageInfo: shape({
    pageIndex: integer(),
    pageSize: integer()
  })
})

const categoryUpdateDtoInType = shape({
  id: id().isRequired(),
  name: uu5String(255)
})

const categoryDeleteDtoInType = shape({
  id: id().isRequired()
})
