export default ($scope, $rootScope, $routeParams, $filter, $location, $uibModal, $timeout, $window, autoCancelTimeout, userService, dpayService, dpayAuthenticatedService) => {
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
  $scope.isPoweringDown = false;

  $scope.amountVest = 0.001;
  $scope.amountVestFormatted = 0.001;
  $scope.amountSp = 0.000;
  $scope.dpayPerWeek = 0.000;

  $scope.withdrawRoutes = [];

  $scope.nextPowerDown = null;
  $scope.withdrawVesting = null;
  $scope.withdrawVesting2sp = null;

  const checkForKey = () => {
    $scope.keyRequiredErr = false;
    const a = getAccount(curAccount);
    if (a.type === 's' && !a.keys.active) {
      $scope.keyRequiredErr = true;
    }
  };

  checkForKey();

  $scope.amountSlider = {
    value: 0.001,
    options: {
      floor: 0,
      ceil: 0,
      step: 1,
      precision: 6,
      onChange: function (id, v) {
        $scope.amountVest = v;
        $scope.amountVestFormatted = formatVests(v);

        const sp = vests2sp(v);
        $scope.amountSp = sp;
        $scope.dpayPerWeek = Math.round(sp / 13 * 1000) / 1000;
      },
      translate: function (value, sliderId, label) {
        if (label === 'model') {
          return value + `.000000 VESTS`;
        }

        return value;
      }
    }
  };

  $scope.fromChanged = () => {
    $location.path(`/${ $scope.accountName }/power-down`);
  };

  $scope.deleteWithDrawAccount = (a) => {
    const _delete = (a) => {
      $scope.deletingWithDrawAccount = true;
      dpayAuthenticatedService.setWithdrawVestingRoute(a, 0, false).then((resp) => {
        loadWithdrawRoutes();
      }).catch((e) => {
        $rootScope.showError(e);
      }).then((resp) => {
        $scope.deletingWithDrawAccount = false;
      });
    };

    $rootScope.pinDialog(true).result.then((p) => {
      _delete(a);
    });
  };

  $scope.addWithDrawAccountClicked = () => {
    $uibModal.open({
      templateUrl: `templates/add-withdraw-account.html`,
      controller: 'addWithDrawAccountCtrl',
      windowClass: 'withdraw-account-modal',
      resolve: {
        afterSuccess: () => {
          return () => {
            loadWithdrawRoutes();
          }
        }
      }
    }).result.then((data) => {
      // Success
    }, () => {
      // Cancel
    });
  };

  $scope.canStart = () => {
    return $scope.amountVest > 0 &&
      !$scope.fetchingAccount &&
      !$scope.fetchingWithdrawRoutes &&
      !$scope.keyRequiredErr;
  };

  $scope.canStop = () => {
    return !$scope.keyRequiredErr;
  };

  $scope.start = () => {

    const _start = () => {
      const vestingShares = `${$scope.amountVest}.000000 VESTS`;

      const fromAccount = getAccount(curAccount);
      const wif = fromAccount.type === 's' ? fromAccount.keys.active : null;

      $scope.processing = true;
      dpayAuthenticatedService.withdrawVesting(wif, curAccount, vestingShares).then((resp) => {

      }).catch((e) => {
        $rootScope.showError(e);
      }).then(() => {
        $scope.processing = false;

        loadAccount();
      });
    };

    $rootScope.pinDialog(true).result.then((p) => {
      _start();
    });
  };

  $scope.stop = () => {
    const _stop = () => {
      const vestingShares = `0.000000 VESTS`;

      const fromAccount = getAccount(curAccount);
      const wif = fromAccount.type === 's' ? fromAccount.keys.active : null;

      $scope.processing = true;
      dpayAuthenticatedService.withdrawVesting(wif, curAccount, vestingShares).then((resp) => {

      }).catch((e) => {
        $rootScope.showError(e);
      }).then(() => {
        $scope.processing = false;

        loadAccount();
      });
    };

    $rootScope.pinDialog(true).result.then((p) => {
      _stop();
    });
  };

  const loadAccount = () => {
    $scope.fetchingAccount = true;

    return dpayService.getAccounts([curAccount]).then((resp) => {
      const account = resp[0];

      $scope.amountSlider.options.ceil = account.vesting_shares.split(' ')[0];
      $scope.isPoweringDown = (account.next_vesting_withdrawal !== '1969-12-31T23:59:59');

      $scope.nextPowerDown = new Date(account.next_vesting_withdrawal);
      const rate = account.vesting_withdraw_rate;
      const vests = parseFloat(rate.split(" ")[0]);
      $scope.withdrawVesting = formatVests(vests);
      $scope.withdrawVesting2sp = vests2sp(vests);

    }).catch((e) => {
      $rootScope.showError(e);
    }).then(() => {
      $scope.fetchingAccount = false;
    });
  };

  const loadWithdrawRoutes = () => {
    $scope.fetchingWithdrawRoutes = true;

    return dpayService.getWithdrawRoutes(curAccount).then((resp) => {
      resp.sort((a, b) => {
        return a.percent - b.percent
      });
      $scope.withdrawRoutes = resp;
    }).catch((e) => {
      $rootScope.showError(e);
    }).then(() => {
      $scope.fetchingWithdrawRoutes = false;
    });
  };

  const vests2sp = (vests) => {
    return $filter('dpayPower')(vests.toString());
  };

  const formatVests = (v) => {
    return $filter('number')(parseFloat(v).toFixed(0)).replace(',', '.');
  };

  loadAccount().then(() => {
    loadWithdrawRoutes();

    $timeout(function () {
      $scope.$broadcast('rzSliderForceRender');
    }, 200);
  });
}
