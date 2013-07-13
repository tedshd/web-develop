/*global $, jQuery, alert, console, angular*/
/**
 * Mockup:
 *
 * @authors Ted Shiu (you@example.org)
 * @date    2013-07-13 20:57:10
 * @version $Id$
 */

angular.module(
    'phonecat',
    []
).config(
    [
        '$routeProvider',
        function($routeProvider) {
            $routeProvider.when(
                '/phones',
                {
                    templateUrl: 'phone_list.html',
                    controller: PhoneListCtrl
                }
            ).when(
                '/phones/:phoneId',
                {
                    templateUrl: 'phone_detail.html',
                    controller: PhoneDetailCtrl
                }
            ).otherwise( //default url
                {
                    redirectTo: '/phones'
                }
            );
        }
    ]
);