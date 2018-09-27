String.prototype.hashCode = function () {
  // See: https://stackoverflow.com/a/8831937/3720614

  let hash = 0;
  if (this.length === 0) {
    return hash;
  }
  for (let i = 0; i < this.length; i++) {
    let char = this.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return hash;
};

const genRandom = function () {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

window.genRandom = genRandom;

import {remote, clipboard, shell, ipcRenderer} from "electron";

window.writeClipboard = (s) => {
  clipboard.writeText(s);
};

window.openInBrowser = (href) => {
  shell.openExternal(href);
};

window.setSizeForReadMode = () => {
  const win_ = remote.getCurrentWindow();
  win_.maximize();
};

// New version/update relative functions

ipcRenderer.on('update-available', (event, ver) => {
  document.querySelector('#new-version-alert').style.display = 'block';
  document.querySelector('#new-version-alert .release-name').innerText = ver;
});

ipcRenderer.on('download-started', () => {
  document.querySelector('#new-version-alert .btn-download').style.display = 'none';
  document.querySelector('#new-version-alert .btn-dismiss').style.display = 'none';
  document.querySelector('#new-version-alert .download-progress').style.display = 'inline-block';
});

ipcRenderer.on('download-progress', (event, perc) => {
  document.querySelector('#new-version-alert .download-progress').innerText = parseInt(perc).toString();
});

ipcRenderer.on('update-downloaded', () => {
  document.querySelector('#new-version-alert .download-progress').style.display = 'none';
  document.querySelector('#new-version-alert .btn-restart').style.display = 'inline-block';
});

window.dismissUpdate = () => {
  document.querySelector('#new-version-alert').style.display = 'none';
};

window.downloadUpdate = () => {
  ipcRenderer.send('download-update');
};

window.updateRestart = () => {
  ipcRenderer.send('update-restart');
};

// Custom protocol handler
window.protocolHandler = (url) => {
  const root = document.querySelector('html');
  const rootScope = angular.element(root).scope();
  rootScope.protocolHandler(url);
};

import env from "env";
import jetpack from "fs-jetpack";
import dpay from 'dpayjs';
import path from 'path';
import jq from 'jquery';
import {protocolUrl2Obj} from './helpers/protocol';

// Angular and related dependencies
import angular from 'angular';
import {angularRoute} from 'angular-route';
import {angularTranslate} from 'angular-translate';
import ui from 'angular-ui-bootstrap';
import {slider} from 'angularjs-slider';


// Controllers
import postsCtrl from './controllers/posts';
import postCtrl from './controllers/post';
import authorCtrl from './controllers/author';
import contentVotersCtrl from './controllers/content-voters';
import settingsCtrl from './controllers/settings';
import loginCtrl from './controllers/login'
import feedCtrl from './controllers/feed';
import bookmarksCtrl from './controllers/bookmarks';
import tagsCtrl from './controllers/tags';
import editorCtrl from './controllers/editor';
import searchCtrl from './controllers/search';
import draftsCtrl from './controllers/drafts';
import schedulesCtrl from './controllers/schedules';
import galleryCtrl from './controllers/gallery';
import transferCtrl from './controllers/transfer';
import escrowCtrl from './controllers/escrow';
import escrowActionsCtrl from './controllers/escrow-actions';
import powerUpCtrl from './controllers/power-up';
import powerDownCtrl from './controllers/power-down';
import addWithDrawAccountCtrl from './controllers/add-withdraw-account';
import profileEditCtrl from './controllers/profile-edit';
import welcomeCtrl from './controllers/welcome';
import pinCreateCtrl from './controllers/pin-create';
import pinDialogCtrl from './controllers/pin-dialog';
import favoritesCtrl from './controllers/favorites';
import followersCtrl from './controllers/followers';
import followingCtrl from './controllers/following';
import witnessesCtrl from './controllers/witnesses';
import galleryModalCtrl from './controllers/gallery-modal'
import delegatedVestingCtrl from './controllers/delegated-vesting';
import delegateCtrl from './controllers/delegate';
import activitiesCtrl from './controllers/activities';
import postHistoryCtrl from './controllers/post-history'


import tokenExchangeCtrl from './controllers/token-exchange';
import marketPlaceCtrl from './controllers/market-place';
import discoverCtrl from './controllers/discover';
import connect2mobileCtrl from './controllers/connect2mobile';
import privateKeyQrCtrl from './controllers/private-key-qr'


// Directives
import navBarDir from './directives/navbar';
import footerDir from './directives/footer';
import postListItemDir from './directives/post-list-item';
import sideTagListDir from './directives/side-tag-list';
import scrolledBottomDir from './directives/scrolled-bottom';
import authorBgImgStyleDir from './directives/author-bg-img-style';
import commentListDir from './directives/comment-list';
import commentListItemDir from './directives/comment-list-item';
import authorNameDir from './directives/author-name';
import contentPayoutInfoDir from './directives/content-payout-info';
import contentVotersInfoDir from './directives/content-voters-info';
import contentListItemChildDir from './directives/content-list-item-child'
import autoFocusDir from './directives/autofocus';
import loginRequiredDir from './directives/login-required';
import contentVoteDir from './directives/content-vote';
import contentEditorDir from './directives/content-editor';
import contentEditorControlsDir from './directives/content-editor-controls';
import fallbackSrcDir from './directives/fallback-src';
import contentListItemSearchDir from './directives/content-list-item-search';
import commentEditorDir from './directives/comment-editor';
import draftListItemDir from './directives/draft-list-item';
import scheduleListItemDir from './directives/schedule-list-item';
import galleryListItemDir from './directives/gallery-list-item';
import transferNavBarDir from './directives/transfer-navbar';
import contentListLoadingItemDir from './directives/content-list-loading-item';
import showBgImageOnModalDir from './directives/show-bg-image-on-modal';
import postFloatingMenuDir from './directives/post-floating-menu';
import toggleListStyleDir from './directives/toggle-list-style';
import activityListItemDir from './directives/activity-list-item';
import activitiesPopoverDir from './directives/activities-popover';


// Services
import dpayService from './services/dpay';
import {helperService} from './services/helper';
import storageService from './services/storage';
import settingsService from './services/settings';
import userService from './services/user';
import dpayAuthenticatedService from './services/dpay-authenticated';
import dExplorerService from './services/dexplorer';
import editorService from './services/editor';
import cryptoService from './services/crypto';
import pinService from './services/pin'
import $confirm from './services/confirm';

// Filters
import {catchPostImageFilter} from './filters/catch-post-image';
import sumPostTotalFilter from './filters/sum-post-total';
import {authorReputationFilter} from './filters/author-reputation';
import timeAgoFilter from './filters/time-ago';
import {postSummaryFilter} from './filters/post-summary';
import {markDown2Html, markDown2HtmlFilter} from './filters/markdown-2-html'
import {capWordFilter} from './filters/cap-word';
import currencySymbolFilter from './filters/currency-symbol';
import dateFormattedDir from './filters/date-formatted.js';
import {contentSummaryChildFilter} from './filters/content-summary-child';
import dpayPowerFilter from './filters/dpay-power';
import dpayDollarFilter from './filters/dpay-dollar';
import {appNameFilter} from './filters/app-name';
import transferMemoFilter from './filters/transfer-memo';
import commentBodyFilter from './filters/comment-body';
import __ from './filters/__';


import constants from './constants';
import {version, releasePost} from '../package.json'


const app = remote.app;

const ngApp = angular.module('dExplorer', ['ngRoute', 'ui.bootstrap', 'pascalprecht.translate', 'rzModule']);

import config from './config';

config(ngApp);

ngApp.config(($translateProvider, $routeProvider, $httpProvider) => {

  // Translations
  $translateProvider.translations('en-US', require('./locales/en-US')); //English

  $translateProvider.useSanitizeValueStrategy(null);
  $translateProvider.preferredLanguage('en-US');
  $translateProvider.fallbackLanguage('en-US');

  // Routing
  $routeProvider
    .when('/', {
      template: '',
      controller: ($rootScope, $location, activeUsername, helperService, pinService, constants) => {
        if (!helperService.getWelcomeFlag()) {
          $location.path(`/welcome`);
          return;
        }

        if (!pinService.getPinHash()) {
          $location.path(`/pin-create`);
          return;
        }

        if (!helperService.isReleasePostRead(version)) {
          const [t, a, p] = releasePost.split('/');
          const u = `/post/${t}/${a.replace('@', '')}/${p}`;
          $location.path(u);
          helperService.setReleasePostRead(version);
          return;
        }

        if (activeUsername()) {
          // If user logged in redirect to feed
          $location.path(`/feed/${activeUsername()}`);
        } else {
          // Redirect to default filter page
          $location.path('/posts/' + constants.defaultFilter);
        }
      }
    })
    .when('/posts/:filter', {
      templateUrl: 'templates/posts.html',
      controller: 'postsCtrl',
    })
    .when('/posts/:filter/:tag', {
      templateUrl: 'templates/posts.html',
      controller: 'postsCtrl',
    })
    .when('/post/:parent/:author/:permlink', {
      templateUrl: 'templates/post.html',
      controller: 'postCtrl',
    })
    .when('/post/:parent/:author/:permlink/:comment', {
      templateUrl: 'templates/post.html',
      controller: 'postCtrl',
    })
    .when('/account/:username', {
      templateUrl: 'templates/author.html',
      controller: 'authorCtrl',
    })
    .when('/account/:username/:section', {
      templateUrl: 'templates/author.html',
      controller: 'authorCtrl',
    })
    .when('/token-exchange', {
      templateUrl: 'templates/token-exchange.html',
      controller: 'tokenExchangeCtrl',
    })
    .when('/discover', {
      templateUrl: 'templates/discover.html',
      controller: 'discoverCtrl',
    })
    .when('/market-place', {
      templateUrl: 'templates/market-place.html',
      controller: 'marketPlaceCtrl',
    })
    .when('/feed/:username', {
      templateUrl: 'templates/feed.html',
      controller: 'feedCtrl'
    })
    .when('/tags', {
      templateUrl: 'templates/tags.html',
      controller: 'tagsCtrl'
    })
    .when('/editor', {
      templateUrl: 'templates/editor.html',
      controller: 'editorCtrl'
    })
    .when('/editor/:author/:permlink', {
      templateUrl: 'templates/editor.html',
      controller: 'editorCtrl'
    })
    .when('/search/:obj', {
      templateUrl: 'templates/search.html',
      controller: 'searchCtrl'
    })
    .when('/drafts', {
      templateUrl: 'templates/drafts.html',
      controller: 'draftsCtrl'
    })
    .when('/schedules', {
      templateUrl: 'templates/schedules.html',
      controller: 'schedulesCtrl'
    })
    .when('/gallery', {
      templateUrl: 'templates/gallery.html',
      controller: 'galleryCtrl'
    })
    .when('/:account/transfer', {
      templateUrl: 'templates/transfer.html',
      controller: 'transferCtrl'
    })
    .when('/:account/transfer/:mode', {
      templateUrl: 'templates/transfer.html',
      controller: 'transferCtrl'
    })
    .when('/:account/transfer/:mode', {
      templateUrl: 'templates/transfer.html',
      controller: 'transferCtrl'
    })
    .when('/:account/escrow', {
      templateUrl: 'templates/escrow.html',
      controller: 'escrowCtrl'
    })
    .when('/:account/escrow-actions', {
      templateUrl: 'templates/escrow-actions.html',
      controller: 'escrowActionsCtrl'
    })
    .when('/:account/power-up', {
      templateUrl: 'templates/power-up.html',
      controller: 'powerUpCtrl'
    })
    .when('/:account/power-down', {
      templateUrl: 'templates/power-down.html',
      controller: 'powerDownCtrl'
    })
    .when('/:account/delegate', {
      templateUrl: 'templates/delegate.html',
      controller: 'delegateCtrl'
    })
    .when('/:account/activities', {
      templateUrl: 'templates/activities.html',
      controller: 'activitiesCtrl',
    })
    .when('/:account/activities/:type', {
      templateUrl: 'templates/activities.html',
      controller: 'activitiesCtrl',
    })
    .when('/welcome', {
      templateUrl: 'templates/welcome.html',
      controller: 'welcomeCtrl'
    })
    .when('/pin-create', {
      templateUrl: 'templates/pin-create.html',
      controller: 'pinCreateCtrl'
    })
    .when('/witnesses', {
      templateUrl: 'templates/witnesses.html',
      controller: 'witnessesCtrl'
    })
    .otherwise({redirectTo: '/'});

  // $http
  // Prevent caching
  if (!$httpProvider.defaults.headers.get) {
    $httpProvider.defaults.headers.get = {};
  }
  $httpProvider.defaults.headers.get['If-Modified-Since'] = 'Mon, 26 Jul 1997 05:00:00 GMT';
  $httpProvider.defaults.headers.get['Cache-Control'] = 'no-cache';
  $httpProvider.defaults.headers.get['Pragma'] = 'no-cache';

})

  .factory('constants', () => {
    return constants;
  })
  .factory('appVersion', () => {
    return version;
  })
  .factory('dpayApi', () => {
    return {
      getApi: () => {
        return dpay.api;
      },
      setServer: (u) => {
        dpay.api.stop();
        dpay.api.setOptions({url: u});
      }
    }
  })
  .factory('dExplorerService', dExplorerService)
  .factory('dpayService', dpayService)
  .factory('dpayAuthenticatedService', dpayAuthenticatedService)
  .factory('storageService', storageService)
  .factory('settingsService', settingsService)
  .factory('userService', userService)
  .factory('helperService', helperService)
  .factory('editorService', editorService)
  .factory('activeUsername', ($rootScope) => {
    return () => {
      if ($rootScope.user) {
        return $rootScope.user.username
      }
      return null;
    };
  })
  .factory('activePostFilter', ($rootScope) => {
    return () => {
      return $rootScope.selectedFilter !== 'feed' ? $rootScope.selectedFilter : constants.defaultFilter;
    };
  })
  .factory('autoCancelTimeout', ($rootScope, $timeout) => {
    return (fn, delay) => {
      if ($rootScope.__timeouts === undefined) {
        $rootScope.__timeouts = {};
      }

      const identifier = String(fn).hashCode();

      if ($rootScope.__timeouts[identifier] !== undefined) {
        $timeout.cancel($rootScope.__timeouts[identifier]);
        $rootScope.__timeouts[identifier] = undefined;
      }

      $rootScope.__timeouts[identifier] = $timeout(() => {
        fn();
        $rootScope.__timeouts[identifier] = undefined;
      }, delay);
    }
  })
  .factory('cryptoService', cryptoService)
  .factory('pinService', pinService)
  .factory('$confirm', $confirm)

  .directive('navBar', navBarDir)
  .directive('appFooter', footerDir)
  .directive('sideTagList', sideTagListDir)
  .directive('postListItem', postListItemDir)
  .directive('scrolledBottom', scrolledBottomDir)
  .directive('authorBgImgStyle', authorBgImgStyleDir)
  .directive('commentList', commentListDir)
  .directive('commentListItem', commentListItemDir)
  .directive('authorName', authorNameDir)
  .directive('contentPayoutInfo', contentPayoutInfoDir)
  .directive('contentVotersInfo', contentVotersInfoDir)
  .directive('contentListItemChild', contentListItemChildDir)
  .directive('autoFocus', autoFocusDir)
  .directive('loginRequired', loginRequiredDir)
  .directive('contentVote', contentVoteDir)
  .directive('contentEditor', contentEditorDir)
  .directive('contentEditorControls', contentEditorControlsDir)
  .directive('fallbackSrc', fallbackSrcDir)
  .directive('contentListItemSearch', contentListItemSearchDir)
  .directive('commentEditor', commentEditorDir)
  .directive('draftListItem', draftListItemDir)
  .directive('scheduleListItem', scheduleListItemDir)
  .directive('galleryListItem', galleryListItemDir)
  .directive('transferNavBar', transferNavBarDir)
  .directive('contentListLoadingItem', contentListLoadingItemDir)
  .directive('showBgImageOnModal', showBgImageOnModalDir)
  .directive('postFloatingMenu', postFloatingMenuDir)
  .directive('toggleListStyle', toggleListStyleDir)
  .directive('activityListItem', activityListItemDir)
  .directive('activitiesPopover', activitiesPopoverDir)

  .controller('postsCtrl', postsCtrl)
  .controller('settingsCtrl', settingsCtrl)
  .controller('loginCtrl', loginCtrl)
  .controller('contentVotersCtrl', contentVotersCtrl)
  .controller('postCtrl', postCtrl)
  .controller('authorCtrl', authorCtrl)
  .controller('tokenExchangeCtrl', tokenExchangeCtrl)
  .controller('discoverCtrl', discoverCtrl)
  .controller('marketPlaceCtrl', marketPlaceCtrl)
  .controller('feedCtrl', feedCtrl)
  .controller('bookmarksCtrl', bookmarksCtrl)
  .controller('tagsCtrl', tagsCtrl)
  .controller('editorCtrl', editorCtrl)
  .controller('searchCtrl', searchCtrl)
  .controller('draftsCtrl', draftsCtrl)
  .controller('schedulesCtrl', schedulesCtrl)
  .controller('galleryCtrl', galleryCtrl)
  .controller('transferCtrl', transferCtrl)
  .controller('escrowCtrl', escrowCtrl)
  .controller('escrowActionsCtrl', escrowActionsCtrl)
  .controller('powerUpCtrl', powerUpCtrl)
  .controller('powerDownCtrl', powerDownCtrl)
  .controller('addWithDrawAccountCtrl', addWithDrawAccountCtrl)
  .controller('profileEditCtrl', profileEditCtrl)
  .controller('welcomeCtrl', welcomeCtrl)
  .controller('pinCreateCtrl', pinCreateCtrl)
  .controller('pinDialogCtrl', pinDialogCtrl)
  .controller('favoritesCtrl', favoritesCtrl)
  .controller('followersCtrl', followersCtrl)
  .controller('followingCtrl', followingCtrl)
  .controller('witnessesCtrl', witnessesCtrl)
  .controller('galleryModalCtrl', galleryModalCtrl)
  .controller('delegatedVestingCtrl', delegatedVestingCtrl)
  .controller('delegateCtrl', delegateCtrl)
  .controller('activitiesCtrl', activitiesCtrl)
  .controller('connect2mobileCtrl', connect2mobileCtrl)
  .controller('privateKeyQrCtrl', privateKeyQrCtrl)
  .controller('postHistoryCtrl', postHistoryCtrl)


  .filter('catchPostImage', catchPostImageFilter)
  .filter('sumPostTotal', sumPostTotalFilter)
  .filter('authorReputation', authorReputationFilter)
  .filter('timeAgo', timeAgoFilter)
  .filter('postSummary', postSummaryFilter)
  .filter('markDown2Html', markDown2HtmlFilter)
  .filter('capWord', capWordFilter)
  .filter('currencySymbol', currencySymbolFilter)
  .filter('dateFormatted', dateFormattedDir)
  .filter('contentSummaryChild', contentSummaryChildFilter)
  .filter('dpayPower', dpayPowerFilter)
  .filter('dpayDollar', dpayDollarFilter)
  .filter('appName', appNameFilter)
  .filter('money2Number', () => {
    return (input) => {
      if (input) {
        return (Number(input.split(" ")[0]).toFixed(3));
      }

      return ''
    }
  })
  .filter('transferMemo', transferMemoFilter)
  .filter('commentBody', commentBodyFilter)
  .filter('__', __)

  .run(function ($rootScope, $uibModal, $routeParams, $filter, $translate, $timeout, $interval, $location, $window, $q, $http, dExplorerService, dpayService, dpayAuthenticatedService, settingsService, userService, activeUsername, activePostFilter, dpayApi, pinService, constants, NWS_ADDRESS) {


    // SETTINGS
    /*
    Creates default application settings
    */
    $rootScope.setDefaultSettings = () => {
      settingsService.set('theme', 'light-theme');
      settingsService.set('language', constants.defaultLanguage);
      settingsService.set('server', constants.defaultServer);
      settingsService.set('currency', constants.defaultCurrency);
    };

    /*
    Reads application settings from local storage
    */
    $rootScope.readSettings = () => {
      $rootScope.theme = settingsService.get('theme');
      $rootScope.language = settingsService.get('language');
      $rootScope.server = settingsService.get('server');
      $rootScope.currency = settingsService.get('currency');
      $rootScope.listStyle = settingsService.get('list-style', 1);
      $rootScope.allowPushNotify = settingsService.get('push-notify', 1);
    };

    // If there is no setting configured (probably first run) create default settings.
    if (!settingsService.hasSettings()) {
      $rootScope.setDefaultSettings();
    }

    // Read settings on startup
    $rootScope.readSettings();

    // Watch language setting changes and set translate language
    // It can only change from settingsService
    $rootScope.$watch('language', (n, o) => {

      // Change locale
      $translate.use(n);

      // Detect and change text direction
      if (['ar-SA', 'he-IL', 'fa-IR', 'ur-PK'].indexOf(n) !== -1) {
        $rootScope.textDir = 'rtl';
      } else {
        $rootScope.textDir = 'ltr';
      }
    });

    // Set dPay api server address initially
    dpayApi.setServer($rootScope.server);

    // CURRENCY
    // Default currency's (USD) rate = 1
    $rootScope.currencyRate = 1;

    const fetchCurrencyRate = (broadcast = false) => {
      dExplorerService.getCurrencyRate($rootScope.currency).then((resp) => {
        let newCurrRate = resp.data;
        if (newCurrRate !== $rootScope.currencyRate) {
          $rootScope.currencyRate = newCurrRate;
          if (broadcast) {
            $rootScope.$broadcast('currencyChanged')
          }
        }
      }); // TODO: Handle catch
    };

    if ($rootScope.currency !== constants.defaultCurrency) {
      // Fetch currency rate data on startup if selected currency is not default currency.
      fetchCurrencyRate();
    }

    // Refresh currency rate in every minute. Broadcast if changed.
    $interval(() => fetchCurrencyRate(true), 60000);

    // DPAY GLOBAL PROPERTIES
    $rootScope.dpayPerMVests = 1;
    $rootScope.base = 1;
    $rootScope.fundRecentClaims = 1;
    $rootScope.fundRewardBalance = 1;

    const fetchDPayGlobalProperties = () => {
      dpayService.getDynamicGlobalProperties()
        .then(r => {
          let dpayPerMVests = (Number(r.total_vesting_fund_dpay.substring(0, r.total_vesting_fund_dpay.length - 6)) / Number(r.total_vesting_shares.substring(0, r.total_vesting_shares.length - 6))) * 1e6;
          $rootScope.dpayPerMVests = dpayPerMVests;

          return dpayService.getFeedHistory()
        })
        .then(r => {
          let base = r.current_median_history.base.split(" ")[0];
          $rootScope.base = base;
          return dpayService.getRewardFund();
        }).then(r => {
        $rootScope.fundRecentClaims = r.recent_claims;
        $rootScope.fundRewardBalance = r.reward_balance.split(" ")[0];
      })
    };

    fetchDPayGlobalProperties();

    // Refresh global properties in every minute.
    $interval(() => fetchDPayGlobalProperties(), 60000);

    // Last logged user
    $rootScope.user = userService.getActive();

    // Set active user when new user logged in
    $rootScope.$on('userLoggedIn', () => {
      $rootScope.user = userService.getActive();
    });

    $rootScope.$on('userLoggedOut', () => {
      $rootScope.user = null;
    });

    // USER PROPS. Account data detail for active user.
    $rootScope.userProps = null;
    const fetchUserProps = () => {
      const a = activeUsername();
      if (!a) {
        $rootScope.userProps = null;
        return;
      }
      dpayService.getAccounts([a]).then(r => {
        $rootScope.userProps = r[0];
        $rootScope.$broadcast('userPropsRefreshed');
      });
    };

    fetchUserProps();

    // Refresh users props in every minute.
    $interval(() => fetchUserProps(), 10000);

    // Invalidate when user logged in
    $rootScope.$on('userLoggedIn', () => {
      $rootScope.userProps = null;
      fetchUserProps();
    });

    // or logged out
    $rootScope.$on('userLoggedOut', () => {
      $rootScope.userProps = null;

      // Redirect root path (/trending) if current page is feed after logout
      // https://github.com/dpays/dexplorer-desktop/issues/89
      if ($rootScope.curCtrl === 'feedCtrl') {
        $location.path('/');
      }
    });


    // NAVIGATION CACHE
    // The purpose of navigation caching is show last position and data of the page to user without
    // reloading when the user clicks back button.
    // It is not nice to scroll the page at the top and reload when the user clicks the back button.

    // HISTORY MANAGER
    $rootScope.navHistory = [];

    // A flag to find out user triggered $rootScope.goBack (clicked back button)
    $rootScope.isBack = false;

    // Pops last path from navHistory and redirects.
    $rootScope.goBack = () => {
      if (!$rootScope.navHistory.length) {
        return false;
      }

      let l = $rootScope.navHistory.pop();
      $rootScope.isBack = true;
      $location.path(l);
    };

    $rootScope.lastVisitedPath = null;

    $rootScope.$on('$routeChangeSuccess', () => {

      /* Before push a path to navHistory:
      Last visited path should be not empty (at least one path visited)
      $rootScope.goBack should not be triggered (go back button should not be clicked)
      Path should not be root (there is a redirect rule for /), welcome page and pin creation page
      */
      if ($rootScope.lastVisitedPath && !$rootScope.isBack && ['/', '/welcome', '/pin-create'].indexOf($rootScope.lastVisitedPath) === -1) {
        // push last visited path to history
        $rootScope.navHistory.push($rootScope.lastVisitedPath);
      }

      // update last visited path
      $rootScope.lastVisitedPath = $location.$$path;
    });

    // POSITION MANAGER
    $rootScope.navPosCache = {};

    $rootScope.$on('$routeChangeStart', function () {
      // Save last position of main content when leaving
      let mainEl = document.querySelector('#content-main.keep-pos');
      if (mainEl) {
        let key = $window.location.href.hashCode();

        $rootScope.navPosCache[key] = mainEl.scrollTop;
      }
    });

    $rootScope.$on('$routeChangeSuccess', function () {

      // Do nothing if back button not clicked
      if (!$rootScope.isBack) {
        return false;
      }

      $timeout(function () {
        let mainEl = document.querySelector('#content-main.keep-pos');
        if (mainEl) {
          let key = $window.location.href.hashCode();
          let top = $rootScope.navPosCache[key];
          if (top) {
            mainEl.scrollTop = top;
          }
        }
      }, 0);
    });

    // DATA MANAGER
    let cacheData = {};
    $rootScope.Data = {};

    $rootScope.setNavVar = (varKey, val) => {
      const key = $window.location.href.hashCode();

      if (!cacheData[key]) {
        cacheData[key] = {};
      }

      cacheData[key][varKey] = val;
    };

    $rootScope.$on('$routeChangeSuccess', () => {
      // When route changed pass relative data from cacheData to $rootScope.Data
      let key = $window.location.href.hashCode();

      $rootScope.Data = cacheData[key] || {};
    });

    // After all navigation cache managers, toggle $rootScope.isBack if true
    $rootScope.$on('$routeChangeSuccess', () => {
      if ($rootScope.isBack) {
        $rootScope.isBack = false;
      }
    });

    // The last selected filter from navbar
    $rootScope.selectedFilter = constants.defaultFilter;

    // The last selected post from post list
    $rootScope.selectedPost = {};

    // Click handler for external links
    jq('body').on('click', 'a[target="_external"]', function (event) {
      event.preventDefault();
      let href = jq(this).attr('href');
      shell.openExternal(href);
    });

    // Click handlers for markdown
    $rootScope.$on('go-to-path', (o, u) => {
      $location.path(u);
      if (!$rootScope.$$phase) {
        $rootScope.$apply();
      }
    });

    jq('body').on('click', '.markdown-view .markdown-external-link', function (event) {
      event.preventDefault();
      let href = jq(this).data('href');
      shell.openExternal(href);
    });

    jq('body').on('click', '.markdown-view .markdown-witnesses-link', function (event) {
      event.preventDefault();
      if (activeUsername()) {
        $rootScope.$broadcast('go-to-path', '/witnesses');
      } else {
        let href = jq(this).data('href');
        shell.openExternal(href);
      }
    });

    jq('body').on('click', '.markdown-view .markdown-post-link', function (event) {
      event.preventDefault();
      let tag = jq(this).data('tag');
      let author = jq(this).data('author');
      let permLink = jq(this).data('permlink');
      let u = `/post/${tag}/${author}/${permLink}`;
      $rootScope.$broadcast('go-to-path', u);
    });

    jq('body').on('click', '.markdown-view .markdown-author-link', function (event) {
      event.preventDefault();
      let author = jq(this).data('author');
      let u = `/account/${author}`;
      $rootScope.$broadcast('go-to-path', u);
    });

    jq('body').on('click', '.markdown-view .markdown-tag-link', function (event) {
      event.preventDefault();
      let tag = jq(this).data('tag');
      let u = `/posts/${activePostFilter()}/${tag}`;
      $rootScope.$broadcast('go-to-path', u);
    });

    // BOOKMARKS
    $rootScope.bookmarks = [];
    const fetchBookmarks = () => {
      $rootScope.bookmarks = [];
      dExplorerService.getBookmarks($rootScope.user.username).then((resp) => {
        let temp = [];

        // Create timestamps and search titles for each bookmark item. Timestamps will be used for sorting.
        for (let i of resp.data) {
          temp.push(Object.assign(
            {},
            i,
            {searchTitle: `${i.author} ${i.permlink} ${i.author.replace(/-/g, ' ')} ${i.permlink.replace(/-/g, ' ')}`.toLowerCase()}
          ));
        }

        $rootScope.bookmarks = temp;
      });
    };

    if ($rootScope.user) {
      fetchBookmarks();
    }

    // Fetch bookmarks on login
    $rootScope.$on('userLoggedIn', () => {
      fetchBookmarks();
    });

    // Set bookmarks to empty list when user logged out
    $rootScope.$on('userLoggedOut', () => {
      $rootScope.bookmarks = [];
    });

    // Refresh bookmarks when new bookmark created
    $rootScope.$on('newBookmark', () => {
      fetchBookmarks();
    });

    // FAVORITES
    $rootScope.favorites = [];
    const fetchFavorites = () => {
      $rootScope.favorites = [];
      dExplorerService.getFavorites($rootScope.user.username).then((resp) => {
        let temp = [];

        // Create timestamps and search titles for each bookmark item. Timestamps will be used for sorting.
        for (let i of resp.data) {
          temp.push(Object.assign(
            {},
            i,
            {searchTitle: `${i.account}`.toLowerCase()}
          ));
        }

        $rootScope.favorites = temp;
      });
    };

    if ($rootScope.user) {
      fetchFavorites();
    }

    // Fetch favorites on login
    $rootScope.$on('userLoggedIn', () => {
      fetchFavorites();
    });

    // Set favorites to empty list when user logged out
    $rootScope.$on('userLoggedOut', () => {
      $rootScope.favorites = [];
    });

    // Refresh favorites when new bookmark created
    $rootScope.$on('favoritesChanged', () => {
      fetchFavorites();
    });

    // SIDE TAG LIST
    $rootScope.sideTagFilter = false;
    $rootScope.sideAfterTag = '';

    // REPLYING/COMMENTING
    // This will help to persist user comments between transitions.
    $rootScope.commentEditorCache = {};

    // EDITOR
    $rootScope.editorDraft = null;

    // CONTENT UPDATING
    $rootScope.refreshContent = (c) => {
      $rootScope.$broadcast('CONTENT_REFRESH', {content: c});
    };

    $rootScope.$on('CONTENT_VOTED', (r, d) => {
      dpayService.getContent(d.author, d.permlink).then(resp => {
        $rootScope.refreshContent(resp);
      });
    });

    // Update contents which are in navigation cache
    $rootScope.$on('CONTENT_REFRESH', (r, d) => {
      for (let navKey in cacheData) {
        for (let i of ['posts', 'feed', 'dataList']) {
          if (cacheData[navKey][i] !== undefined) {
            for (let k in cacheData[navKey][i]) {
              if (cacheData[navKey][i][k].id === d.content.id) {
                cacheData[navKey][i][k] = d.content;
              }
            }
          }
        }
      }
    });

    // Delete post from local cache when updated to show latest version
    $rootScope.$on('CONTENT_UPDATED', (r, d) => {
      for (let navKey in cacheData) {
        if (cacheData[navKey]['post'] && cacheData[navKey]['post'].id === d.contentId) {
          cacheData[navKey] = null;
          break;
        }
      }
    });

    // PIN CODE
    $rootScope.pinCode = null;

    $rootScope.getPinCode = () => {
      if (!$rootScope.pinCode) {
        throw 'Pin code not found';
      }
      return $rootScope.pinCode;
    };

    $rootScope.pinDialogOpen = false;
    $rootScope.pinDialog = (cancelable = false) => {
      return $uibModal.open({
        templateUrl: 'templates/pin-dialog.html',
        controller: 'pinDialogCtrl',
        windowClass: 'pin-dialog-modal',
        backdrop: 'static',
        keyboard: false,
        resolve: {
          cancelable: () => {
            return cancelable;
          },
        }
      });
    };

    $interval(() => {
      const loc = $window.location.href.split('#!')[1];
      if (['/', '/welcome', '/pin-create'].indexOf(loc) !== -1) {
        return;
      }

      const h = pinService.getPinHash();
      if (!h) {
        $location.path('/');
      }

      if (!$rootScope.pinCode && !$rootScope.pinDialogOpen) {
        $rootScope.pinDialog().result.then((pinCode) => {
          $rootScope.pinCode = pinCode;
        });
      }
    }, 2000);

    // Error messages to show user when remote server errors occurred
    $rootScope.errorMessages = [];
    $rootScope.showError = (message) => {
      $rootScope.errorMessages.push({
        id: genRandom(),
        text: message
      });
      $timeout(() => {
        $rootScope.errorMessages.shift();
      }, 5000)
    };

    // Success messages
    $rootScope.successMessages = [];
    $rootScope.showSuccess = (message) => {
      $rootScope.successMessages.push({
        id: genRandom(),
        text: message
      });
      $timeout(() => {
        $rootScope.successMessages.shift();
      }, 5000)
    };

    $rootScope.curCtrl = null;
    $rootScope.$on('$routeChangeSuccess', function (e, cur, prev) {
      $rootScope.curCtrl = cur.$$route.controller;
    });

    // Custom protocol handler
    $rootScope.protocolHandler = (url) => {
      const obj = protocolUrl2Obj(url);

      if (!obj) {
        return;
      }

      if (obj.type === 'filter') {
        const u = `/posts/${obj.filter}`;
        $location.path(u);
        return;
      }

      if (obj.type === 'filter-tag') {
        const u = `/posts/${obj.filter}/${obj.tag}`;
        $location.path(u);
        return;
      }

      if (obj.type === 'post') {
        dpayService.getContent(obj.author, obj.permlink).then(resp => {
          if (resp.id) {
            $rootScope.selectedPost = null;
            const u = `/post/${obj.cat}/${obj.author}/${obj.permlink}`;
            $location.path(u);
          }
        });
        return;
      }

      if (obj.type === 'account') {
        dpayService.getAccounts([obj.account]).then(resp => {
          if (resp.length === 1) {
            const u = `/account/${obj.account}`;
            $location.path(u);
          }
        });
        return;
      }
    };

    // dPayID token expire control
    const checkSCToken = () => {
      const user = userService.getActive();
      if (user && user.type === 'sc' && $rootScope.pinCode) {
        dpayAuthenticatedService.meSc().then(resp => {

        }).catch((e) => {
          if (e.toString().trim() === 'SDKError: dpayid error') {
            userService.setActive(null);
            $rootScope.$broadcast('userLoggedOut');
            $location.path('/');

            $window.alert($filter('__')('Looks like your dPayID access token expired. Please login again.'));
          }
        });
      }
    };

    $interval(() => {
      checkSCToken();
    }, 20000);

    // Notifications
    // Web socket connection for push notifications
    let nws = null;

    const nwsMessageBody = (data) => {
      switch (data.type) {
        case 'vote':
          return `${data.source} ${$filter('__')('voted your post')}`;
        case 'mention':
          if(data.extra.is_post){
            return `${data.source} ${$filter('__')('mentioned you in a post')}`;
          } else {
            return `${data.source} ${$filter('__')('mentioned you in a comment')}`;
          }
        case 'follow':
          return `${data.source} ${$filter('__')('followed you')}`;
        case 'reply':
          return `${data.source} ${$filter('__')('replied you')}`;
        case 'reblog':
          return `${data.source} ${$filter('__')('reblogged your post')}`;
      }
    };

    const connectNws = () => {
      if (!activeUsername()) {
        return
      }

      const u = `${NWS_ADDRESS}?user=${activeUsername()}`;
      nws = new WebSocket(u);

      nws.onopen = function (evt) {
        // console.log("connected to nws");
      };

      nws.onmessage = function (evt) {
        $rootScope.$broadcast('newNotification');

        if(!$rootScope.allowPushNotify){
          return;
        }

        const data = JSON.parse(evt.data);
        const msg = nwsMessageBody(data);

        if (msg) {
          let myNotification = new Notification($filter('__')('You have a new notification'), {
            body: msg
          });

          myNotification.onclick = () => {
            const u = `${activeUsername()}/activities`;
            $location.path(u);
            $rootScope.$applyAsync();
          }
        }
      };

      nws.onclose = function (evt) {
        // console.log("disconnected from nws");
        nws = null;

        if (!evt.wasClean) {
          // if disconnected due connection error try to auto connect
          setTimeout(() => {
            connectNws();
          }, 2000);
        }
      };
    };

    connectNws();

    // Disconnect for previous user and reconnect to socket for new logged in user
    $rootScope.$on('userLoggedIn', () => {
      if (nws !== null) {
        nws.close();
      }

      connectNws();
    });

    // Disconnect from socket when user logout
    $rootScope.$on('userLoggedOut', () => {
      if (nws !== null) {
        nws.close();
      }
    });

    $rootScope.unreadActivities = 0;
    const fetchUnreadActivityCount = () => {
      dExplorerService.getUnreadActivityCount(activeUsername()).then((resp) => {
        $rootScope.unreadActivities = resp.data.count;
      });
    };

    if (activeUsername()) {
      fetchUnreadActivityCount();
    }

    // Refetch unread notifications on new message
    $rootScope.$on('newNotification', () => {
      fetchUnreadActivityCount();
    });

    // Reset notification count to 0 and reload it for new logged in user
    $rootScope.$on('userLoggedIn', () => {
      $rootScope.unreadActivities = 0;
      fetchUnreadActivityCount();
    });

    // Reset notification count to 0 when user logged out
    $rootScope.$on('userLoggedOut', () => {
      $rootScope.unreadActivities = 0;
    });

    // An helper to collect post body samples
    $rootScope.showMarkdownResultHelper = (env.name === 'development');
    $rootScope.saveMarkdownResult = (id, markdown) => {

      let savePath = path.join(app.getAppPath(), 'test-data', 'markdown-2-html', id + '.json');
      if (jetpack.exists(savePath)) {
        if (!confirm(savePath + ' exists. Overwrite?')) {
          return false;
        }
      }

      let html = markDown2Html(markdown);
      let writeData = {'id': id, input: markdown, result: html};

      jetpack.write(savePath, writeData);
      console.log('Saved to: ' + savePath);
    };
  });
