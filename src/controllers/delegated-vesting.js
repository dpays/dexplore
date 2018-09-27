export default ($scope, $rootScope, $filter, $uibModalInstance, $location, $confirm, dpayService, dpayAuthenticatedService, activeUsername, account) => {

  $scope.list = [];
  $scope.canUndelegate = activeUsername() === account;
  $scope.undelegating = false;

  const main = () => {
    $scope.list = [];
    $scope.loading = true;
    dpayService.getVestingDelegations(account).then((resp) => {

      $scope.list = resp;
    }).catch((e) => {
      $rootScope.showError(e);
    }).then(() => {
      $scope.loading = false;
    });
  };

  main();

  $scope.unDelegate = (delegatee) => {
    $confirm($filter('translate')('ARE_YOU_SURE'), '', () => {
      $scope.undelegating = true;

      dpayAuthenticatedService.unDelegateVestingShares(delegatee).then((resp) => {
        main();
      }).catch((e) => {
        $rootScope.showError(e);
      }).then(() => {
        $scope.undelegating = false;
      });
    })
  };

  $scope.authorClicked = (author) => {
    let u = `/account/${author}`;
    $location.path(u);
    $scope.close();
  };

  $scope.close = () => {
    $uibModalInstance.dismiss('cancel');
  };
}
