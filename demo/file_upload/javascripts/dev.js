/*global $, jQuery, alert, console, angular, window, document, xmlHttpRequest*/
/**
 *
 * @authors Ted Shiu (tedshd@gmail.com)
 * @date    2013-11-06 17:54:36
 * @version $Id$
 */

(function () {
    console.log('init uploadFiles');
    // init uploadFiles
    // var uploadFiles;
    function uploadFiles(options) {
        console.log('uploadFiles');
        var defaultSetting,
            setting,
            inputFileNode,
            fileCount,
            /*-- function --*/
            filesInfo,
            upload,
            /*-- loop --*/
            i;
        defaultSetting = {
            inputFileNode: 'upload_files',
            fileName: 'UplpadFiles[]'
        };
        setting = options || defaultSetting;

        // get input
        inputFileNode = document.getElementById(setting.inputFileNode) ||
                        document.getElementsByTagName(setting.inputFileNode);
        console.log(inputFileNode);

        filesInfo = function () {
            fileCount = inputFileNode.files.length;
            console.log(fileCount);
            for (i = 0; fileCount > i; i++) {
                console.log(inputFileNode.files);
                console.log(inputFileNode.files[i].name);
                console.log(inputFileNode.files[i].size);
                console.log(inputFileNode.files[i].type);
            }
        };

        upload = function () {
            console.log('files', document.getElementById('select').files);
            fileCount = document.getElementById('select').files.length;

            for (i = 0; fileCount > i; i++) {
                // var length = document.getElementById('select').files.length;
                // init FormData object
                var formData = new FormData();
                // use append method append upload file
                formData.append(setting.fileName, document.getElementById('select').files[i]);
                // init XMLHttpRequest object
                var xmlHttpRequest = new XMLHttpRequest();
                // init to backend
                xmlHttpRequest.open('POST', 'upload_mult.php');
                // upload progress
                xmlHttpRequest.upload.onprogress = function (e) {
                    console.log('onprogress', e);
                    console.log(e.loaded);
                    console.log(Math.ceil((e.loaded / e.total) * 100) + '%');
                };
                // check ajax status
                xmlHttpRequest.onreadystatechange = function () {
                    if (xmlHttpRequest.readyState === 4) {
                        if (xmlHttpRequest.status === 200) {
                            // alert('upload');
                        }
                    }
                };
                // post to backend
                xmlHttpRequest.send(formData);
            }
        }

        // bind event
        // inputFileNode.addEventListener('change', filesInfo);
        // inputFileNode.addEventListener('change', filesInfo, false, true);
        inputFileNode.onchange = filesInfo;
        document.getElementById('upload').addEventListener('click', upload);

        // define method
        this.filesInfo = filesInfo;
        this.upload = upload;
        console.log('this', this);
    }
    window.uploadFiles = uploadFiles;
})();