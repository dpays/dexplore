import {amountFormatCheck, formatStrAmount} from './helper';
import badActors from '../data/bad-actors.json';
import dpay from 'dpayjs';


export default ($scope, $rootScope, $routeParams, $timeout, $location, $filter, autoCancelTimeout, dpayService, dpayAuthenticatedService, userService, activeUsername, cryptoService) => {
  const mode = $routeParams.mode ? $routeParams.mode : 'normal';
  $scope.mode = mode;

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
  $scope.account = null;
  $scope.from = curAccount;

  $scope.to = '';
  $scope.amount = '0.001';
  $scope.asset = 'BEX';
  $scope.memo = '';
  $scope.balance = '0';
  $scope.toData = null;

  $scope.keyRequiredErr = false;
  $scope.toErr = null;
  $scope.amountErr = null;

  const checkForKey = () => {
    $scope.keyRequiredErr = false;
    const a = getAccount(curAccount);
    if (a.type === 's' && !a.keys.active) {
      $scope.keyRequiredErr = true;
    }
  };

  checkForKey();

  $scope.fromChanged = () => {
    let e = mode === 'mode' ? 'transfer' : `transfer/${mode}`;
    $location.path(`/${ $scope.from }/${e}`);
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

  $scope.amountChanged = () => {
    $scope.amountErr = null;

    if (!amountFormatCheck($scope.amount)) {
      $scope.amountErr = $filter('__')('WRONG_AMOUNT_VALUE');
      return;
    }

    const dotParts = $scope.amount.split('.');
    if (dotParts.length > 1) {
      const precision = dotParts[1];
      if (precision.length > 3) {
        $scope.amountErr = $filter('__')('AMOUNT_PRECISION_ERR');
        return;
      }
    }

    if (parseFloat($scope.amount) > parseFloat($scope.balance)) {
      $scope.amountErr = $filter('__')('INSUFFICIENT_FUNDS');
      return;
    }
  };

  $scope.assetChanged = (a) => {
    $scope.asset = a;
    $scope.balance = getBalance(a);
    $scope.amountChanged();
  };

  $scope.copyBalance = () => {
    $scope.amount = $scope.balance;
    $scope.amountChanged();
  };

  const loadFromAccount = () => {
    $scope.fetchingFromAccount = true;

    return dpayService.getAccounts([$scope.from]).then((resp) => {
      return resp[0];
    }).catch((e) => {
      $rootScope.showError(e);
    }).then((resp) => {
      $scope.fetchingFromAccount = false;
      $scope.account = resp;
      $scope.balance = getBalance($scope.asset);
      $scope.amountChanged();
    });
  };

  const getBalance = (asset) => {

    if (mode === 'from_savings') {
      const k = (asset === 'BEX' ? 'savings_balance' : 'savings_bbd_balance');
      return $scope.account[k].split(' ')[0];
    }

    const k = (asset === 'BEX' ? 'balance' : 'bbd_balance');
    return $scope.account[k].split(' ')[0];
  };

  $scope.canSubmit = () => {
    return $scope.toData &&
      !$scope.amountErr &&
      !$scope.keyRequiredErr &&
      !$scope.fetchingTo &&
      !$scope.fetchingFromAccount;
  };

  $scope.submit = () => {

    const _submit = () => {
      const from = $scope.from;
      const to = $scope.to.trim();
      const amount = formatStrAmount($scope.amount, $scope.asset);
      let memo = $scope.memo.trim();

      if (memo.startsWith('#')) {
        if (!$rootScope.user.keys['memo']) {
          $rootScope.showError('Memo private key required to create encrypted memo');
          return;
        }

        const senderPrivateKey = cryptoService.decryptKey($rootScope.user.keys['memo']);
        const receiverPublicKey = $scope.toData.memo_key;

        memo = dpay.memo.encode(senderPrivateKey, receiverPublicKey, memo);
      }

      const fromAccount = getAccount(from);
      const wif = fromAccount.type === 's' ? fromAccount.keys.active : null;

      $scope.processing = true;
      let prms = '';
      switch (mode) {
        case 'normal':
          prms = dpayAuthenticatedService.transfer(wif, from, to, amount, memo);
          break;
        case 'to_savings':
          prms = dpayAuthenticatedService.transferToSavings(wif, from, to, amount, memo);
          break;
        case 'from_savings':
          const requestId = (new Date().getTime()) >>> 0;
          prms = dpayAuthenticatedService.transferFromSavings(wif, from, requestId, to, amount, memo);
          break;
      }

      prms.then((resp) => {
        $rootScope.showSuccess($filter('translate')('TX_BROADCASTED'));
        $location.path(`/account/${from}/wallet`);
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

  loadFromAccount().then(() => {
    $timeout(() => {
      if (mode === 'normal') {
        document.getElementById('transfer-to').focus();
      } else {
        document.getElementById('transfer-amount').focus();

        $scope.to = activeUsername();
        $scope.toChanged();
      }
    }, 200)
  });
};
