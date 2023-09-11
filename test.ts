const test = () => {
  const wrongRequest = () => {
    const requestData = {
      path: "client/update",
      METHOD: "DELETE",
      data: {
        where: {
          id: 5,
        },
        data: {
          name: "joao",
        },
      },
    }
  }

  const ringhtrequestData = {
    path: "client/update",
    METHOD: "DELETE",
    data: {
      id: 5,
      name: "joao",
    },
  }
}
export default test
