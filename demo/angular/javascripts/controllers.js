/*global $, jQuery, alert, console, angular*/
/**
 * Mockup:
 *
 * @authors Ted Shiu (you@example.org)
 * @date    2013-07-13 23:40:36
 * @version $Id$
 */

function PhoneListCtrl($scope, $http) {
    $http.post('phonelist/phones.json').success(
        function(data) {
            $scope.phones = data;
        }
    ).error(
        function() {
            $scope.error = true;
        }
    );
    $scope.orderProp = 'age';
}

function PhoneDetailCtrl($scope, $routeParams, $http) {
    $http.post('phonelist/' + $routeParams.phoneId + '.json').success(
        function(data) {
            $scope.phone = data;
        }
    );
}