app.controller('HomeController', ['$scope', '$http', '$cordovaSpinnerDialog', function ($scope, $http, $cordovaSpinnerDialog) {

  $scope.videos = [];
  $scope.seachQuery = "";
//   $scope.playerVars = {
//     rel: 0,
//     showinfo: 0,
//     modestbranding: 0,
//   };
  $scope.nextPageToken = "";
  $scope.youtubeParams = {
    key: 'AIzaSyAz3csA79f7VXLIZcBr8JMoySN0UUY6gWc', // My App Key From Google Developer Console
    type: 'video',
    maxResults: '5',
    part: 'id,snippet',
    q: $scope.seachQuery,
    //player: 0,
    order: 'date',
    //channelId: '',
  }

  $scope.onSearchSubmitted = function (seachQuery) {
    $scope.youtubeParams['q'] = seachQuery;
    loadVideos($scope.youtubeParams, function (returnedVideos) {
      if (returnedVideos) {
        $scope.videos = returnedVideos;
      }
    });
  }
  /**
   * This is the Main function for loading the videos
   * @param {*} params : youtube v3 parameters 
   * @param {*} callback : callback function to handle returned video results in other functions
   */
  function loadVideos(params, callback) {

    ionic.Platform.ready(function () {
      // this try-catch only for browser testing purposes
      try {
        $cordovaSpinnerDialog.show("Loading", "Please Wait A Moment..", true);
      } catch (error) {}

      $http.get('https://www.googleapis.com/youtube/v3/search', {
        params: params
      }).success(function (response) {
        // this try-catch only for browser testing purposes
        try {
          $cordovaSpinnerDialog.hide();
        } catch (error) {}

        var videos = [];
        if (response.nextPageToken) {
          $scope.nextPageToken = response.nextPageToken;
          console.log($scope.nextPageToken);
          angular.forEach(response.items, function (child) {
            videos.push(child);
          });
        }
        callback(videos);
      });
    });

  }

  /**
   * This Function for Getting more Videos While scrolling 
   */
  $scope.loadMoreOlderVideos = function () {
    var params = $scope.youtubeParams;
    if ($scope.nextPageToken) {
      params['pageToken'] = $scope.nextPageToken;
    }
    loadVideos(params, function (olderVideos) {
      if (olderVideos) {
        $scope.videos = $scope.videos.concat(olderVideos);
      }
      $scope.$broadcast('scroll.infiniteScrollComplete');
    });
  };

  /**
   * This Function for Getting more Videos on Pull to Refresh
   */
  $scope.loadMoreNewerVideos = function () {
    var params = $scope.youtubeParams;
    params['pageToken'] = '';
    loadVideos(params, function (newerVideos) {
      $scope.videos = newerVideos;
      $scope.$broadcast('scroll.refreshComplete');
    });

  };

}]);
