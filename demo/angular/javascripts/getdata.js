/*global $, jQuery, alert, console, angular*/
/**
 * Mockup:
 *
 * @authors Ted Shiu (you@example.org)
 * @date    2013-07-11 23:10:53
 * @version $Id$
 */

function phoneList($scope, $http) {
    $http.post('phone.json').success(
        function(data) {
            $scope.phones = data;
        }
    );
}