export default () => {
  return {
    restrict: 'E',
    replace: true,
    scope: {},
    template: `<a ng-click="" uib-popover-template="'templates/directives/activities-popover.html'" popover-class="activities-popover" popover-placement="bottom" popover-trigger="'outsideClick'" popover-enable="enabled"  uib-tooltip="{{ 'ACTIVITIES' | __ }}" tooltip-popup-delay="1000" tooltip-placement="left"><span class="has-activity" ng-if="$root.unreadActivities">{{ $root.unreadActivities < 100 ? $root.unreadActivities : '&#8226;&#8226;&#8226;' }}</span><i class="fa fa-bell"></i></a>`,
    controller: ($scope, $rootScope, $location, dpayService, dExplorerService, activeUsername) => {

      // disabled popover on activities page
      $scope.enabled = $rootScope.curCtrl !== 'activitiesCtrl';

      const account = activeUsername();

      if ($rootScope.activityType === undefined) {
        $rootScope.activityType = {selected: ''};
      }


      $scope.activities = [];
      $scope.loading = false;

      const loadActivities = () => {
        $scope.loading = true;

        let prms;

        switch ($rootScope.activityType.selected) {
          case 'votes':
            prms = dExplorerService.getMyVotes(account);
            break;
          case 'replies':
            prms = dExplorerService.getMyReplies(account);
            break;
          case 'mentions':
            prms = dExplorerService.getMyMentions(account);
            break;
          case 'follows':
            prms = dExplorerService.getMyFollows(account);
            break;
          case 'reblogs':
            prms = dExplorerService.getMyReblogs(account);
            break;
          default:
            prms = dExplorerService.getActivities(account);
        }

        prms.then((resp) => {
          $scope.activities = resp.data.slice(0, 5);
        }).catch((e) => {
          $rootScope.showError('Could not fetch activities!');
        }).then(() => {
          $scope.loading = false;
        });
      };

      loadActivities();

      $scope.typeChanged = () => {
        $scope.activities = [];
        loadActivities();
      };

      $scope.marking = false;

      $scope.markAllRead = () => {
        $scope.marking = true;
        dExplorerService.marActivityAsRead(activeUsername()).then((resp) => {
          $rootScope.unreadActivities = resp.data.unread;

          $rootScope.$broadcast('activitiesMarked');
        }).catch((e) => {
          $rootScope.showError('Could not marked as read');
        }).then(() => {
          $scope.marking = false;
        });
      };

      $scope.reload = () => {
        $scope.activities = [];
        loadActivities();
      };

      $scope.activitiesClicked = () => {
        $location.path(`/${activeUsername()}/activities`);
      };

    }
  };
};
