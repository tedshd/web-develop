/*global $, jQuery, alert, console, angular*/
/**
 *
 * @authors Your Name (you@example.org)
 * @date    2013-06-27 22:44:00
 * @version $Id$
 */

$(function() {
    var arr = [
            {
                a: 1,
                b: 2,
                c: 3
            },
            {
                a: 4,
                b: 5,
                c: 6
            },
            {
                a: 1,
                b: 2,
                c: 3
            }
        ],
        arr_1 = [],
        tree = [
            {
                a: 4,
                b: 5,
                c: 6
            }
        ],
        tree_1 = [],
        arr_n = [1, 10, 20],
        arr_2 = ['a', 'b', 'c'],
        arr_3 = ['a'];
    // console.log('arr');
    // console.log(arr);
    // console.log(arr[0].Object.toString());
    // console.log(arr.length);
    // console.log('tree');
    // console.log(tree);
    // console.log(tree.length);
    // for (var i = 0; arr.length > i; i++) {
    //     arr_1.push(jQuery.param(arr[i]));
    // }
    // for (var i = 0; tree.length > i; i++) {
    //     tree_1.push(jQuery.param(tree[i]));
    // }
    // console.log(arr_1);
    // console.log(tree_1);

    // for (var i = 0; arr_1.length > i; i++) {
    //     console.log('loop--');
    //     console.log(arr_1[i]);
    //     console.log(tree_1.indexOf(arr_1[i]));
    //     function newtree(element) {
    //         return (element = tree_1[i]);
    //     }
    //     console.log(newtree());
    //     // console.log(arr_1.indexOf(newtree()));
    //     var newarr = arr_1.filter(newtree);
    //     console.log(newarr);
    // }
    // console.log(arr_2.indexOf('c'));
    /**
     * Array_filter
     * @param  {[type]} element [description]
     * @param  {[type]} index   [description]
     * @param  {[type]} array   [description]
     * @return {[type]}         [description]
     */
    console.log('--filter--');
    function fill(element, index, array, value) {
        return (element == 5);
    }
    var filt = [12, 5, 8, 130, 44, '5'].filter(fill);
    console.log(filt);

    console.log('--filter_2--');
    function isBigEnough(element, index, array) {
        return (element >= 10);
    }
    var filtered = [12, 5, 8, 130, 44].filter(isBigEnough);
    console.log(filtered);

    console.log('--filter_3--');
    // function filterObj(element, index, array, key) {
    //     return (value = '1');
    // }
    // var objfiled = arr.filter(filterObj);
    // console.log(objfiled);
});