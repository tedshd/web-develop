<?php
/**
 *
 * @authors Your Name (you@example.org)
 * @date    2017-09-23 19:18:56
 * @version $Id$
 */


$private_key = '-----BEGIN RSA PRIVATE KEY-----
MIICXAIBAAKBgQC0acrAV8/vUOQlgH1oUhgRfeyMdJGIJ90RsE+a9EhaimyOUn6V
mXKt+f7J9dYyPLqM6PlFb0sXz+3w5ozK+eJ/tBfyfK/yB7X0AQNnAu/zd3jHmCx+
fJ1U00J6bv96FivRCCeudGVSq0hp/+/Kc96wR2RVpPOm1BQP1bV91HY2lwIDAQAB
AoGAFqlTNmXRUJYwkiVZm0j0jP3sQJhDz35yXk5vMV+N1xGcISRrkg78QK4uOuAO
T7EhHaIF7ZrVK+CKWsAa30QUFxBLzFMXJMWhDnlmTJk+hsHv2M+j0cMFLhXBtFkS
sFhgIrmsWTmIAWnf+E3FPnqRzl0EWPDv+Efngw0iHOTIAoECQQDjp707WiMl9SHM
+RdzZCTihxVMsT5fhSmS1h2hydH1uTCdLZDEMGYolAmXZ5Z4hOIMkQrl4+rwEkBa
NKA6Hc65AkEAyuBEN4ZTVgDhTYRHHcEMBHF8kr0ii1bUFeM3Zb6xfDwL1jt01D4J
j1mAkmd65DR1czceTFfYAd4kbCq5EN0HzwJAHV+fQvE2Z8dhPRlGtVTOjYvwa5zS
93AvFQsbd6yasqHaa+1dKHM2OzYeprJu7831fLmaNl9aCO/R7dGsetMtwQJAQdS4
DhRmYlfyxAaSVRNZZO+2bp804GYSd++9ACT6zsdlR+UPKffffkaas+ckN3zWR8aw
7DDtBN4ij37lgpVWfQJBAIgFts/fUnfEFaaRgPKV6bCTxWo2g8KguAm2qGJl+BdL
alvWmdbjnlbIJEQ88Kcwwn1LKlUTwIDyG0RqPQDy+TI=
-----END RSA PRIVATE KEY-----';
$PUBLIC_KEY  = '-----BEGIN PUBLIC KEY-----
MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC0acrAV8/vUOQlgH1oUhgRfeyM
dJGIJ90RsE+a9EhaimyOUn6VmXKt+f7J9dYyPLqM6PlFb0sXz+3w5ozK+eJ/tBfy
fK/yB7X0AQNnAu/zd3jHmCx+fJ1U00J6bv96FivRCCeudGVSq0hp/+/Kc96wR2RV
pPOm1BQP1bV91HY2lwIDAQAB
-----END PUBLIC KEY-----';


$data = '{"data":[{"icon_image_1x":"static\/app_icon_1@1x.png","icon_image_2x":"static\/app_icon_1@2x.png",
{"data":[{"icon_ssd';


echo openssl_private_encrypt($data,$encrypted, openssl_pkey_get_private($private_key)) ? base64_encode($encrypted) : null;


?>