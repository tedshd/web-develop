<?php
/**
 *
 * @authors Your Name (you@example.org)
 * @date    2016-02-04 15:11:06
 * @version $Id$
 */

$str_1 = 'msi微星 Nightblade X2B-043TW i7-6700 GTX980 WIN10(電競桌機)';

echo mb_strimwidth($str_1, 0, 50, '...');

echo '<br>';

$str_2 = 'Qmishop 韓國新款療癒 迷你糖果扭蛋機玩具 / 存錢筒 存錢罐 扭蛋玩具 糖果 【J900】';

echo mb_strimwidth($str_2, 0, 100, '...');

echo '<br>';

?>