import badActors from '../data/bad-actors.json';

export default ($scope, $rootScope, $timeout, $filter, $uibModalInstance, autoCancelTimeout, dpayService, dpayAuthenticatedService, afterSuccess) => {

  $scope.to = '';
  $scope.auto = {val: false};
  $scope.toErr = null;
  $scope.toData = null;

  $scope.percSlider = {
    value: 25,
    options: {
      floor: 0,
      ceil: 100,
      step: 1,
      precision: 1,
      ticksArray: [0, 25, 50, 75, 100],
      translate: function (value, sliderId, label) {
        return value + '%';
      }
    }
  };

  $scope.toChanged = () => {
    $scope.toErr = null;
    $scope.toData = null;

    autoCancelTimeout(() => {
      if (!$scope.to) {
        return false;
      }

      if (badActors.includes($scope.to)) {
        $scope.toErr = $filter('__')('TRANSFER_BAD_ACTOR_ERR');
      }

      $scope.toData = null;
      $scope.fetchingTo = true;

      dpayService.getAccounts([$scope.to]).then((resp) => {
        if (resp.length === 0) {
          $scope.toErr = $filter('translate')('NONEXIST_USER');
          return;
        }

        $scope.toData = resp[0];
      }).catch((e) => {
        $rootScope.showError(e);
      }).then((resp) => {
        $scope.fetchingTo = false;
      });
    }, 700);
  };

  $scope.canSubmit = () => {
    return $scope.toData && !$scope.fetchingTo;
  };

  $scope.submit = () => {
    const _submit = () => {
      const to = $scope.to.trim();
      const perc = parseInt($scope.percSlider.value) * 100;
      const auto = $scope.auto.val;

      $scope.processing = true;
      dpayAuthenticatedService.setWithdrawVestingRoute(to, perc, auto).then((resp) => {
        afterSuccess();
        $scope.close();
      }).catch((e) => {
        $rootScope.showError(e);
      }).then((resp) => {
        $scope.processing = false;
      });
    };

    $rootScope.pinDialog(true).result.then((p) => {
      _submit();
    });
  };

  $scope.close = () => {
    $uibModalInstance.dismiss('cancel');
  };

  // Refresh slider in order to render properly
  $timeout(function () {
    $scope.$broadcast('rzSliderForceRender');
  }, 200);

};
