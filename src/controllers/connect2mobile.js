import QRCode from 'qrcode'

export default ($scope, $rootScope, $uibModal, $uibModalInstance, cryptoService) => {

  const showQr = (title, code, imgData) => {
    $uibModal.open({
      templateUrl: `templates/private-key-qr.html`,
      controller: 'privateKeyQrCtrl',
      windowClass: 'private-key-qr-modal',
      resolve: {
        title: () => {
          return title;
        },
        code: () => {
          return code
        },
        img: () => {
          return imgData
        }
      }
    }).result.then((data) => {
      // Success
    }, () => {
      // Cancel
    });

  };

  $scope.qrClicked = (key) => {

    if ($rootScope.user.type === 'sc') {
      $rootScope.showError('You cannot see private keys with dPayID login.');
      return;
    }

    $rootScope.pinDialog(true).result.then((p) => {

      const selectedKey = $rootScope.user.keys[key];
      const code = cryptoService.decryptKey(selectedKey);

      QRCode.toDataURL(code, {errorCorrectionLevel: 'H', width: 300})
        .then((url) => {
          showQr(key, code, url);
        })
        .catch((e) => {
          $rootScope.showError(e)
        });
    });
  };

  $scope.close = () => {
    $uibModalInstance.dismiss('cancel');
  };
}
