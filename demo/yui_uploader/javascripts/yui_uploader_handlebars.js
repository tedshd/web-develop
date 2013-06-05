YUI({filter: 'raw'}).use('uploader', 'event', 'handlebars', function(Y) {
    window.Y = Y;
    var _fileList,
        _fileListlength,
        _getthisList,
        _uploadDone = false,
        _fileStatus = Y.one('.upload_status');
    if (Y.Uploader.TYPE !== 'none' && !Y.UA.ios) {
        var _uploader = new Y.Uploader({
            width: '150px',
            selectButtonLabel: 'Upload',
            multipleFiles: true,
            fileFieldName: 'pic', //A String specifying what should be the POST field name for the file content in the upload request.(Default:'Filedata')
            swfURL: 'http://yui.yahooapis.com/3.10.1/build/uploader/assets/flashuploader.swf?t=' + Math.random(),
            uploadURL: 'post_file.php', // The URL to which file upload requested are POSTed. Only used if a different url is not passed to the upload method call.
            simLimit: 5, // upload files number 2~5
            withCredentials: false
        });

        // render upload
        _uploader.render('.upload');

        // drag message
        Y.one('.upload').append('<div><strong class="drop_message">Drop here!</strong></div>');

        // drag & drop
        if (Y.Uploader.TYPE === 'html5') {
            Y.one('body').append('<div class="dd_area"></div>');
            var ddArea = Y.one('.dd_area'),
                nodeMessage = Y.one('strong');

            // drag area
            _uploader.set('dragAndDropArea', 'body');

            // handle area not drag
            _uploader.on(['dragenter', 'dragover'], function () {
                if (ddArea) {
                    nodeMessage.removeClass('drop_message');
                    ddArea.addClass('miii-ddtip');
                }
            });

            _uploader.on(['dragleave', 'drop'], function () {
                if (ddArea) {
                    nodeMessage.addClass('drop_message');
                    ddArea.removeClass('miii-ddtip');
                }
            });

        }

        // handle fileselect & render filestatus
        _uploader.after('fileselect', function (e) {
            Y.log('--FileSelect--');
            _getthisList = this.get('fileList');
            Y.log("_getthisList");
            Y.log(_getthisList);
            _fileList = e.fileList;

            if (_uploadDone) {
                _uploadDone = false;
            }

            if (!_uploadDone && _uploader.get('fileList').length > 0) {
                Y.log('QUEUE');
                Y.log(_uploader.queue);
                if (_uploader.queue) {
                    _uploader.queue._startNextFile();
                    _uploader.queue = null;
                }
                // _uploader.uploadAll();
                Y.log('uploadlist');
                // Y.log(this.get('fileList'));
                // Y.log(_uploader.get('fileList'));
                Y.log(_fileList);
                // Y.log(_fileList[0].get('size'));
                // Y.log('total----' + totalSize);
                //var uploadList = _uploader.get('fileList');
                var uploadList = _fileList;
                _uploader.uploadThese(uploadList);
            }

            // handlebars render filestatus
            var fileStatusTpl = Y.one("#tpl-file-status").getHTML(),
                items = [],
                html = '';
            Y.each(_fileList, function(fileInstance) {
                items.push({
                    id   : fileInstance.get('id'),
                    name : fileInstance.get('name')
                });
            });
            html = Y.Handlebars.render(fileStatusTpl, {
                items: items
            });
            // _fileStatus.append(html);
            // _fileStatus.insert(html, Y.one('.file_status'));
            _fileStatus.append(html);

            var listlength = this.get('fileList').length;

            // handle cancel uploade
            Y.delegate('click', function (e) {
                Y.log('--Cancel--');
                e.preventDefault();
                var offset = _fileStatus.all('.cancel_close');
                // Y.log('cancel...');
                Y.log("uploadList");
                Y.log(_fileList);
                Y.log("_getthisList");
                Y.log(_getthisList);
                // Y.log(_uploader.get('fileList'));
                // Y.log(_fileList[offset.indexOf(e.currentTarget)]);
                // Y.log(offset.indexOf(e.currentTarget));
                // Y.log(_getthisList.indexOf(e.currentTarget));
                // Y.log(_uploader.get('fileList'));
                // Y.log(_uploader.queue);
                // Y.log(_fileStatus.all('.cancel .progress .bar'));
                // Y.log(_fileStatus.all('.cancel .progress .bar').getStyle('width'));
                // Y.log(_fileStatus.all('.cancel .progress .bar').getStyle('width')[offset.indexOf(e.currentTarget)]);
                if (_fileStatus.all('.cancel .progress .bar').getStyle('width')[offset.indexOf(e.currentTarget)] !== '0px' ) {
                    Y.log(offset.indexOf(e.currentTarget));
                    Y.log(_getthisList[offset.indexOf(e.currentTarget)]);
                    _getthisList[offset.indexOf(e.currentTarget)].cancelUpload();
                    Y.log('--Cancelupload--');
                    Y.log("QUEUE");
                    Y.log(_uploader.queue);
                    Y.log(_uploader.queue.queuedFiles);
                    _uploader.queue._startNextFile();
                    // _uploader.queue.startUpload();
                    // _uploader.fire("uploadstart");
                }
                // _getthisList[offset.indexOf(e.currentTarget)].cancelUpload();
                // _uploader.get('fileList')[offset.indexOf(e.currentTarget)].cancelUpload();
                // Y.log(offset.indexOf(e.currentTarget));
                _getthisList.splice(offset.indexOf(e.currentTarget),1);
                // _uploader.set('enabled', true);
                _uploadDone = true;
                _uploader.set('fileList', _getthisList);
                Y.log("SetList(_getthisList)");
                Y.log(_getthisList);
                // _uploader.set('fileList', []);
                // Y.log(_fileStatus.all('.file_status')._nodes[offset.indexOf(e.currentTarget)]);
                Y.log("--removeNode--");
                Y.log(_fileStatus.all('.cancel'));
                Y.log(offset.indexOf(e.currentTarget));
                _fileStatus.all('.cancel').item(offset.indexOf(e.currentTarget)).remove();
                // _fileStatus.all('.cancel')._nodes[offset.indexOf(e.currentTarget)].remove();
                // Y.log(_fileStatus.all('.file_status').size());
                // Y.log(offset);
                // Y.log('canceltotal----' + lastTotalSize);
            }, _fileStatus, '.close');

            // Y.log('offset:' + listlength);
        });

        _uploader.on('uploadprogress', function (e) {
            Y.log('--Uploadprogress--');
            // Y.log(_uploader);
            // Y.log(e);
            // Y.log(e.file);
            // var fileRow = Y.one('#' + e.file.get('id') + '_row');
            var statusList = Y.one('#' + e.file.get('id') + '');
            statusList.one('.file_progress').set('text', e.percentLoaded + '%');
            statusList.one('.progress .bar').setStyle('width', e.percentLoaded + '%');
        });

        _uploader.on('uploadstart', function (e) {
            Y.log('--UploadStart--');
            Y.log('START');
            Y.log(_fileList);
        });

        _uploader.on('uploadcomplete', function (e) {
            Y.log('--UploadComplete--');
            // var fileRow = Y.one('#' + e.file.get('id') + '_row');
            // fileRow.one('.percentdone').set('text', 'Finished!');
            var statusList = Y.one('#' + e.file.get('id') + '');
            statusList.one('.file_progress').set('text', 'Complete');
            statusList.one('.progress .bar').setStyle('width', '100%');
            statusList.one('.progress .bar').addClass('miii-finish-bar');
            // statusList.removeClass('cancel');
            statusList.one('.close').removeClass('cancel_close');
        });

        _uploader.on('totaluploadprogress', function (e) {
            // Y.log('--ALLUploadprogress--');
        });

        _uploader.on('alluploadscomplete', function (e) {
            Y.log('--ALLUploadComplete--');
            _uploader.set('fileList', []);
            _uploadDone = true;
        });

    } else {
        Y.one('#uploaderContainer').set('text', 'We are sorry, but to use the uploader, you either need a browser that support HTML5 or have the Flash player installed on your computer.');
    }
});
