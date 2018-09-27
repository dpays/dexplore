const strShareSuffix = 'shared via dExplorer';

const makeDSiteUrl = (cat, author, permlink) => {
  return `https://dsite.io/${cat}/@${author}/${permlink}`;
};

const makeDSocialUrl = (author, permlink) => {
  return `https://dsocial.io/@${author}/${permlink}`;
};

const makeCopyAddress = (title, cat, author, permlink) => {
  return `[${title}](/${cat}/@${author}/${permlink})`;
};

const makeShareUrlReddit = (cat, author, permlink, title) => {
  const u = makeDSiteUrl(cat, author, permlink);
  const t = `${title} | ${strShareSuffix}`;
  return `https://reddit.com/submit?url=${encodeURIComponent(u)}&title=${encodeURIComponent(t)}`;
};

const makeShareUrlTwitter = (cat, author, permlink, title) => {
  const u = makeDSiteUrl(cat, author, permlink);
  const t = `${title} | ${strShareSuffix}`;
  return `https://twitter.com/intent/tweet?url=${encodeURIComponent(u)}&text=${encodeURIComponent(t)}`;
};

const makeShareUrlFacebook = (cat, author, permlink) => {
  const u = makeDSiteUrl(cat, author, permlink);
  return `https://www.facebook.com/sharer.php?u=${encodeURIComponent(u)}`;
};

export default () => {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      linkedElSelector: '<',
      content: '<'
    },
    link: ($scope, $element) => {
      const el = $element[0];
      const mainEl = document.querySelector('#content-main');
      const checkEl = document.querySelector($scope.linkedElSelector);

      const detect = () => {
        el.style.display = 'block';
        const bounding = checkEl.getBoundingClientRect();

        // Reading mode activated
        if (bounding.top === 0) {
          return;
        }

        el.style.display = bounding.top < 250 ? 'none' : 'block';
      };

      detect();

      angular.element(mainEl).bind("scroll", function (e) {
        detect();
      });
    },
    templateUrl: 'templates/directives/post-floating-menu.html',
    controller: ($scope, $rootScope, $timeout, $filter, $uibModal, $confirm, dpayAuthenticatedService, dpayService, dExplorerService, helperService, activeUsername) => {
      const activeUser = activeUsername();

      const author = $scope.content.author;
      const permlink = $scope.content.permlink;

      // Rebblogging
      // Hide reblog button if active user's content or it is a comment
      $scope.hideReblog = (
        $scope.content.author === activeUser ||
        $scope.content.parent_author.trim().length > 0
      );

      $scope.reblogged = helperService.isPostReblogged(activeUser, author, permlink);
      $scope.canReblog = !(activeUser === author);
      $scope.reblogging = false;

      if (!$scope.reblogged &&
        $scope.canReblog &&
        activeUser) {
        dpayService.getDiscussionsBy('Blog', activeUser, null, null, 20).then((contents) => {
          for (let content of contents) {
            if (content.author === author && content.permlink === permlink) {
              helperService.setPostReblogged(activeUser, author, permlink);
              $scope.reblogged = true;
            }
          }
        });
      }

      $scope.reblog = () => {
        $confirm($filter('translate')('ARE_YOU_SURE'), null, () => {
          $scope.reblogging = true;
          dpayAuthenticatedService.reblog(author, permlink).then(() => {
            helperService.setPostReblogged(activeUser, author, permlink);
            $scope.reblogged = true;
          }).catch((e) => {
            $rootScope.showError(e)
          }).then(() => {
            $scope.reblogging = false;
          });
        });
      };

      // Downvoting && Flagging

      $scope.flagged = false;
      $scope.canFlag = !(activeUser === author);
      $scope.flagging = false;

      if ($scope.canFlag && activeUser) {
        for (let vote of $scope.content.active_votes) {
          if (vote.voter === activeUser && vote.percent < 0) {
            $scope.flagged = true;
          }
        }
      }

      $scope.flag = () => {
        $confirm($filter('translate')('ARE_YOU_SURE'), $filter('translate')('FLAGGING_TEXT'), () => {
          $scope.flagging = true;
          dpayAuthenticatedService.vote(author, permlink, -10000).then((resp) => {
            $rootScope.$broadcast('CONTENT_VOTED', {
              author: author,
              permlink: permlink,
              weight: -1
            });
          }).catch((e) => {
            $rootScope.showError(e);
          }).then(() => {
            $scope.flagging = false;
          });
        });
      };

      $rootScope.$on('CONTENT_VOTED', (r, d) => {
        if (author === d.author && permlink === d.permlink) {
          $scope.flagged = d.weight < 0;
        }
      });

      $scope.dSiteUrl = makeDSiteUrl($scope.content.parent_permlink, $scope.content.author, $scope.content.permlink);
      $scope.openDSite = () => {
        window.openInBrowser($scope.dSiteUrl);
      };

      $scope.dSocialUrl = makeDSocialUrl($scope.content.author, $scope.content.permlink);
      $scope.openDSocial = () => {
        window.openInBrowser($scope.dSocialUrl);
      };

      $scope.copyAddress = () => {
        const s = makeCopyAddress($scope.content.title, $scope.content.parent_permlink, $scope.content.author, $scope.content.permlink);
        window.writeClipboard(s);
        $rootScope.showSuccess($filter('__')('POST_MENU_COPIED'))
      };

      $scope.shareReddit = () => {
        const u = makeShareUrlReddit($scope.content.parent_permlink, $scope.content.author, $scope.content.permlink, $scope.content.title);
        window.openInBrowser(u);
      };

      $scope.shareTwitter = () => {
        const u = makeShareUrlTwitter($scope.content.parent_permlink, $scope.content.author, $scope.content.permlink, $scope.content.title);
        window.openInBrowser(u);
      };

      $scope.shareFacebook = () => {
        const u = makeShareUrlFacebook($scope.content.parent_permlink, $scope.content.author, $scope.content.permlink);
        window.openInBrowser(u);
      };

      $scope.switchReadMode = () => {
        if ($rootScope.readMode) {
          $rootScope.readMode = false;
        } else {
          window.setSizeForReadMode();
          $rootScope.readMode = true;
        }
      };

      $scope.hasHistory = false;
      dExplorerService.commentHistory($scope.content.author, $scope.content.permlink, true).then((resp) => {
        if (resp.data.meta.count > 1) {
          $scope.hasHistory = true;
        }
      });

      $scope.openPostHistory = () => {
        $uibModal.open({
          templateUrl: 'templates/post-history.html',
          controller: 'postHistoryCtrl',
          windowClass: 'post-history-modal',
          resolve: {
            content: () => {
              return $scope.content;
            }
          }
        }).result.then((data) => {
          // Success
        }, () => {
          // Cancel
        });
      }
    }
  };
};
