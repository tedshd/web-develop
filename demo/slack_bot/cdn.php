<!-- #!/usr/bin/php -q -->
<?php
function cdn($value='')
{

    /**
     * CDN: flush($user_name, $password, $flushtype, $site_id, $paths, $wildcard, $use_ims);
     * user_name: login CDN username
     * password: login CDN password
     * flushtype: paths / all (a newline-separated list of paths to flush. empty if flushtype is "all".)
     * site_id: the numeric id of the site to flush from.
     * pahts: a newline-separated list of paths to flush. empty if flushtype is "all".
     * wildcard: true / false (a boolean to activate wildcard mode. may be true only when flushtype is "paths".)
     * use_ims: true / false (a boolean to activate fetching with If-Modified-Since. may be true only when flushtype is "all" or wildcard is true.)
     */
    define('AKAMAI_CDN_FLUSH',     'https://ccuapi.akamai.com/ccuapi.wsdl');
    define('AKAMAI_CDN_URI',       'http://ccuapi.akamai.com/purge');
    define('AKAMAI_CDN_PROXY',     'https://ccuapi.akamai.com/soap/servlet/soap/purge');
    define('AKAMAI_CDN_USER_NAME', 'ts.ung.hao@gmail.com');
    define('AKAMAI_CDN_PASSWORD',  'devCDN168');

    $host = 'ad.sitemaji.com';

    // {{{ function cdn_flush_host($host)
    /**
     * Example: cdn_flush_host($host)
     *  $host = 'apis.sitetag.us';
     *  var_dump(cdn_flush_host($host));
     *
     *  input:
     *      $host = 'static.sitetag.us'
     */
    function cdn_flush_host($host)
    {
        if (empty($host))
            return false;

        if (is_url($host)) {
            $host = 'http://' . normalize_url($host);
            $url_array = parse_url($host);
            $host = $url_array['host'];
        }

        $site_id = intval(get_cdn_site_id($host));
        if ($site_id <= 0)
            return false;

        try {
            $api      = new SoapClient(AKAMAI_CDN_FLUSH, array('uri' => AKAMAI_CDN_URI, 'proxy' => AKAMAI_CDN_PROXY,));
            $options  = array('action=remove', 'domain=production', 'type=cpcode');
            $response = $api->purgeRequest(AKAMAI_CDN_USER_NAME, AKAMAI_CDN_PASSWORD, '', $options, array(strval($site_id)));

            if ($response->resultCode == 100) { // 100 = success
                return true;
            } else {
                $mes = sprintf('Date: %s, Akamai purge request failed: (%s) occurred: %s', date('Y-m-d H:i:s'), $response->resultCode, $response->resultMsg);
                echo $mes;

                return false;
            }
        } catch (Exception $e) {
            $response = null;
        }

        return ($response) ? true : false;
    }
    // }}}
    // {{{ function get_cdn_site_id($domain)
    function get_cdn_site_id($domain)
    {
        $sites = array(
                //'apis.sitetag.us'   => 6785,
                //'pub.sitetag.us'    => 6743,
                'ad.sitemaji.com' => '160032',
                //'track.sitetag.us'  => 6958,
                );

        return isset($sites[$domain]) ? $sites[$domain] : false;
    }
    // }}}
    // {{{ function is_url($url)
    function is_url($url)
    {
        if (empty($url))
            return false;

        $url = str_replace('　', ' ', $url);
        if (strstr($url, ' '))
            return false;

        return preg_match('/^((http|https):\/\/)?[\w\-\.]+\.[\w\-\.]*/', $url);
    }
    // }}}
    // {{{ function normalize_url($url)
    function normalize_url($url)
    {
        if (empty($url))
            return false;

        $url = str_replace('http://', '', $url);
        $url = str_replace('https://', '', $url);
        $url = rtrim($url, '/');

        return ($url) ? $url : '';
    }
    // }}}
    cdn_flush_host($host);
    if (cdn_flush_host($host)) {
        echo "\n$host, cdn host flush finish ... \n";
    } else {
        echo "\n$host, cdn host flush fail ... \n";
    }
    echo "\n";
}
cdn();
?>
