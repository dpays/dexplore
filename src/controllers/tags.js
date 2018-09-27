export default ($scope, dpayService) => {

  dpayService.getState('/tags').then((resp) => {
    console.log(resp)
  })
};
