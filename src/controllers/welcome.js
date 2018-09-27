export default ($scope, $sce, $location, helperService, dExplorerService, appVersion) => {

  $scope.description = (h) => {
    return $sce.trustAsHtml(h);
  };

  $scope.myInterval = 60000;
  $scope.active = 0;
  $scope.slides = [];

  dExplorerService.getWelcome().then(resp => {
    let c = 0;
    for (let s of resp.data) {
      const i = Object.assign({}, s, {id: c});
      $scope.slides.push(i);
      c += 1;
    }
  }).catch((e) => {
    // Skip welcome screen if on http error
    $scope.start();
  });

  $scope.next = () => {
    $scope.active += 1;
  };

  $scope.hasNext = () => {
    return $scope.active < ($scope.slides.length - 1);
  };

  $scope.prev = () => {
    $scope.active -= 1;
  };

  $scope.hasPrev = () => {
    return !($scope.active === 0);
  };

  $scope.start = () => {
    helperService.setWelcomeFlag(appVersion);
    $location.path('/')
  }
};
