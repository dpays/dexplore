export default ($scope, $rootScope, dExplorerService, activeUsername) => {

  $scope.loadingImages = true;
  $scope.images = [];

  const fetchImages = () => {
    dExplorerService.getImages(activeUsername()).then((resp) => {
      $scope.images = resp.data;
    }).catch((e) => {
      $rootScope.showError('Could not fetch images!');
    }).then(() => {
      $scope.loadingImages = false;
    });
  };

  fetchImages();
};
