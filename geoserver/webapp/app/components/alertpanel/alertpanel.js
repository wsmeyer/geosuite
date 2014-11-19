angular.module('gsApp.alertpanel', [
  'ui.bootstrap'
])
.directive('alertPanel', ['$modal', '$interval', '$log', '$rootScope',
    function($modal, $interval, $log, $rootScope) {
      return {
        restrict: 'EA',
        scope: {
          alerts: '=?'
        },
        templateUrl: '/components/alertpanel/alertpanel.tpl.html',
        controller: function($scope, $element) {
          $scope.showMessages = false;

          $scope.$watch('alerts', function(newVal) {
            if (newVal != null) {
              $scope.messages = newVal.map(function(val) {
                var msg = angular.extend({show: $scope.showMessages}, val);
                if (msg.fadeout == true) {
                  $interval(function() {
                    msg.show = false;
                  }, 5000, 1);
                }
                return msg;
              });
            }
          });
          $scope.$watch(function() {
            return $rootScope.enableAlerts; // set to true on login
          }, function(newVal) {
            if (newVal) {
              $scope.showMessages = true;
            }
          }, true);

          $scope.closeAlert = function(i) {
            $scope.messages.splice(i, 1);
          };
          $scope.showDetails = function(message) {
            var modal = $modal.open({
              templateUrl: 'alert-modal',
              size: 'lg',
              resolve: {
                message: function() {
                  return message;
                }
              },
              controller: function($scope, $modalInstance, message) {
                $scope.message = message;
                $scope.copy = function(message) {
                  $modalInstance.close();
                };
                $scope.close = function() {
                  $modalInstance.close();
                };
              }
            });
          };
        }
      };
    }]);