<?php
/**
 *
 * @authors Your Name (you@example.org)
 * @date    2015-09-27 17:10:32
 * @version $Id$
 */


exec('find ./ .jpg', $output, $return_var);

// var_dump($output);

foreach ($output as $file) {
    list($width, $height, $type, $attr) = getimagesize($file);
    echo $width . "\n";
    if ($width === 160) {
        exec('rm ' . $file, $output_tmp, $return_var_tmp);
    }
}

?>