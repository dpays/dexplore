export default ($scope, $rootScope, $filter, $routeParams, $timeout, $location, userService, dpayService, dExplorerService, dpayAuthenticatedService) => {

  const curAccount = $routeParams.account;
  const accountList = userService.getAll();

  const getAccount = (a) => {
    for (let i of accountList) {
      if (i.username === a) {
        return i;
      }
    }
  };

  $scope.accountList = accountList.map(x => x.username);
  $scope.accountName = curAccount;
  $scope.escrowId = '';
  $scope.escrowData = null;
  $scope.processing = false;

  const checkForKey = () => {
    $scope.keyRequiredErr = false;
    const a = getAccount(curAccount);
    if (a.type === 's' && !a.keys.active) {
      $scope.keyRequiredErr = true;
    }
  };

  checkForKey();

  $scope.fromChanged = () => {
    $location.path(`/${ $scope.accountName }/escrow-actions`);
  };

  $scope.search = () => {
    const id = $scope.escrowId.trim();
    if (!id) {
      document.getElementById('escrow-id').focus();
      return;
    }

    $scope.searching = true;
    $scope.notFound = false;
    $scope.escrowData = null;

    dExplorerService.searchEscrow(id).then((resp) => {
      if (resp.data.length === 0) {
        $scope.notFound = true;
        return;
      }

      $scope.escrowData = resp.data[0];

    }).catch((e) => {
      $rootScope.showError('Server error!');
    }).then(() => {
      $scope.searching = false;
    });

  };

  $scope.canSubmit = () => {
    return !$scope.keyRequiredErr;
  };

  $scope.submit = (action, releaseTo = null) => {

    const _submit = (action, releaseTo) => {
      const escrowId = parseInt($scope.escrowId.trim());
      const who = $scope.accountName;
      const whoAccount = getAccount(who);
      const wif = whoAccount.type === 's' ? whoAccount.keys.active : null;

      $scope.processing = true;
      let prms = null;

      switch (action) {
        case 'approve':
          prms = dpayAuthenticatedService.escrowApprove(wif, $scope.escrowData.from, $scope.escrowData.to, $scope.escrowData.agent, who, escrowId, true);
          break;
        case 'dispute':
          prms = dpayAuthenticatedService.escrowDispute(wif, $scope.escrowData.from, $scope.escrowData.to, $scope.escrowData.agent, who, escrowId);
          break;
        case 'release':
          prms = dpayAuthenticatedService.escrowRelease(wif, $scope.escrowData.from, $scope.escrowData.to, $scope.escrowData.agent, who, releaseTo, escrowId, $scope.escrowData.bbd_amount, $scope.escrowData.dpay_amount);
          break;
      }

      prms.then((resp) => {
        $rootScope.showSuccess($filter('translate')('TX_BROADCASTED'));

        $scope.escrowId = '';
        $scope.escrowData = null;
      }).catch((e) => {
        $rootScope.showError(e);
      }).then((resp) => {
        $scope.processing = false;
      });
    };

    $rootScope.pinDialog(true).result.then((p) => {
      _submit(action, releaseTo);
    });
  };

  const loadAccount = () => {
    $scope.fetchingAccount = true;

    return dpayService.getAccounts([curAccount]).then((resp) => {
      const account = resp[0];

    }).catch((e) => {
      $rootScope.showError(e);
    }).then(() => {
      $scope.fetchingAccount = false;
    });
  };

  loadAccount().then(() => {
    $timeout(function () {
      document.getElementById('escrow-id').focus();
    }, 200);
  });
}
