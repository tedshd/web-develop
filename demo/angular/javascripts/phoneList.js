/*global $, jQuery, alert, console, angular*/
/**
 * Mockup:
 *
 * @authors Ted Shiu (you@example.org)
 * @date    2013-07-11 00:04:35
 * @version $Id$
 */

function phoneList($scope) {
    $scope.phones = [
        {
            name: 'Xperia S',
            brand: 'SONY',
            year: '2012'
        },
        {
            name: 'Galaxy S4',
            brand: 'Samsung',
            year: '2012'
        },
        {
            name: 'Xperia Z',
            brand: 'SONY',
            year: '2013'
        },
        {
            name: 'iPhone 5',
            brand: 'Apple',
            year: '2013'
        }
    ];

    // default sort
    $scope.sort = 'name';
}