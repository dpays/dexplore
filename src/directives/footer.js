import {releasePost} from '../../package.json'

const powerLevel = (l) => {
  if (l >= 90) {
    return 4;
  }

  if (l >= 80) {
    return 3;
  }

  if (l >= 70) {
    return 2;
  }

  return 1;
};

export default () => {
  return {
    restrict: 'AE',
    replace: true,
    scope: {},
    link: ($scope, $element) => {

    },
    templateUrl: 'templates/directives/footer.html',
    controller: ($scope, $rootScope, $interval, $timeout, $location, appVersion, activeUsername) => {

      $scope.version = appVersion;

      $scope.faqClicked = () => {
        $rootScope.selectedPost = null;
        let u = `/post/dexplorer/dexplorer/dexplorer-faq`;
        $location.path(u);
      };

      $scope.verClicked = () => {
        $rootScope.selectedPost = null;

        const [t, a, p] = releasePost.split('/');
        const u = `/post/${t}/${a.replace('@', '')}/${p}`;
        $location.path(u);
      };

      const resetPower = () => {
        $scope.vp = null;
        $scope.vpLevel = 0;
        $scope.vpFullIn = '';
        $scope.notifyVp = false;

        if ($rootScope.lastVp === undefined) {
          $rootScope.lastVp = 0
        }
      };

      resetPower();

      const votingPower = () => {
        if (activeUsername() && $rootScope.userProps) {
          $scope.vp = $rootScope.userProps.voting_power / 100;
          $scope.vpLevel = powerLevel($scope.vp);
          $scope.vpFullIn = Math.ceil((100 - $scope.vp) * 0.833333); // 100% / 120h = 0.833333h for %1

          $rootScope.lastVp = $scope.vp;

        } else {
          resetPower();
        }
      };

      $rootScope.$on('userLoggedIn', () => {
        resetPower();
        $rootScope.lastVp = 0;
      });

      $rootScope.$on('userLoggedOut', () => {
        resetPower();
        $rootScope.lastVp = 0;
      });

      $rootScope.$on('userPropsRefreshed', () => {
        votingPower();
      });

      votingPower();

      $rootScope.$watch('lastVp', (newVal, oldVal) => {
        if (!oldVal) {
          return;
        }

        if (newVal === oldVal) {
          return;
        }

        $scope.notifyVp = true;

        $timeout(() => {
          $scope.notifyVp = false;
        }, 2000);
      })
    }
  };
};
