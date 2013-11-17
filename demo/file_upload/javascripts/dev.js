/*global $, jQuery, alert, console, angular, window, document, xmlHttpRequest*/
/**
 *
 * @authors Ted Shiu (tedshd@gmail.com)
 * @date    2013-11-06 17:54:36
 * @version $Id$
 */

(function () {
    console.log('load(I) - init uploadFiles');
    // init uploadFiles
    // var uploadFiles;
    function uploadFiles(options) {
        console.log('load(II) - uploadFiles');
        var defaultSetting,
            setting,
            inputFileNode,
            fileCount,
            files,
            /*-- function --*/
            _filesInfo,
            upload,
            /*-- loop --*/
            i;

        defaultSetting = {
            inputFileSelector: 'upload_files',
            fileName: 'UplpadFiles[]',
            server: '/server/upload.php',
            dropArea: 'body'
        };
        setting = options || defaultSetting;

        // get input
        inputFileNode = document.querySelector(setting.inputFileSelector);
        console.log('uploadNode', inputFileNode);

        // create event
        // selectFiles
        function _selectFiles(files) {
            if (inputFileNode && window.CustomEvent) {
                var event = new CustomEvent(
                    "selectFiles",
                    {
                        detail: {
                            fileList: files
                        },
                        bubbles: true,
                        cancelable: true
                    }
                );
                event.fileList = event.detail.fileList;
                inputFileNode.dispatchEvent(event);
                // console.log('selectFiles', event);
            }
        }

        _filesInfo = function () {
            _selectFiles(inputFileNode.files);
        };

        // uploadError
        // uploadProgress
        function _uploadProgress(file) {
            if (inputFileNode && window.CustomEvent) {
                var event = new CustomEvent(
                    "uploadProgress",
                    {
                        detail: {
                            bytesLoaded: file.loaded,
                            bytesTotal: file.total,
                            percentLoaded: Math.ceil((file.loaded / file.total) * 100)
                        },
                        bubbles: true,
                        cancelable: true
                    }
                );
                event.bytesLoaded = event.detail.bytesLoaded;
                event.bytesTotal = event.detail.bytesTotal;
                event.percentLoaded = event.detail.percentLoaded;
                inputFileNode.dispatchEvent(event);
            }
        }

        _progress = function (e) {
            _uploadProgress(e);
        };

        // uploadComplete
        // dragenter
        // dragover
        // drop
        // drag


        // method

        upload = function () {

            // console.log('files', document.getElementById('select').files);
            fileCount = inputFileNode.files.length;

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
                // xmlHttpRequest.upload.onprogress = function (e) {
                //     console.log('onprogress', e);
                //     console.log(e.loaded);
                //     console.log(Math.ceil((e.loaded / e.total) * 100) + '%');
                // };
                xmlHttpRequest.upload.onprogress = _progress;
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

        cancel = function () {
            // body...
        }

        // bind event
        // inputFileNode.addEventListener('change', _filesInfo);
        // inputFileNode.addEventListener('change', _filesInfo, false, true);
        inputFileNode.onchange = _filesInfo;
        document.getElementById('upload').addEventListener('click', upload);

        // define method
        this.upload = upload;
        this.cancel = cancel;
        console.log('this', this);
    }
    window.uploadFiles = uploadFiles;
})();