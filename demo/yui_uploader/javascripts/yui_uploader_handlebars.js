YUI({filter: 'raw'}).use('uploader', 'event', 'handlebars', function(Y) {
    window.Y = Y;
    var _fileList,
        _fileListlength,
        _getthisList,
        _statusList,
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
                    ddArea.addClass('ddtip');
                }
            });

            _uploader.on(['dragleave', 'drop'], function () {
                if (ddArea) {
                    nodeMessage.addClass('drop_message');
                    ddArea.removeClass('ddtip');
                }
            });

        }

        // handle fileselect & render filestatus
        _uploader.after('fileselect', function (e) {
            Y.log('--FileSelect--');
            var cancelList;
            _getthisList = this.get('fileList');
            _fileList = e.fileList;
            var fileTable = Y.one('#filenames tbody');
            if (_fileList.length > 0 && Y.one('#nofiles')) {
                Y.one('#nofiles').remove();
            }
            // Y.log('Total-' + _fileList.length);

            if (!_uploadDone && _uploader.get('fileList').length > 0) {
                Y.log('QUEUE');
                Y.log(_uploader.queue);
                if (_uploader.queue) {
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

            // render filestatus
            Y.each(_fileList, function (fileInstance) {
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
                _fileStatus.append(html);
            });

            var listlength = this.get('fileList').length;

            // handle cancel uploade
            Y.delegate('click', function (e) {
                Y.log('--Cancel--');
                e.preventDefault();
                var offset = _fileStatus.all('.cancel_close');
                // Y.log('cancel...');
                // Y.log(_fileList);
                // Y.log(_getthisList);
                // Y.log(_uploader.get('fileList'));
                // Y.log(_fileList[offset.indexOf(e.currentTarget)]);
                // Y.log(offset.indexOf(e.currentTarget));
                // Y.log(_getthisList.indexOf(e.currentTarget));
                // Y.log(_uploader.get('fileList'));
                Y.log('-----------------------------');
                // Y.log(_uploader.queue);
                // Y.log(_fileStatus.all('.cancel .progress .bar'));
                // Y.log(_fileStatus.all('.cancel .progress .bar').getStyle('width'));
                // Y.log(_fileStatus.all('.cancel .progress .bar').getStyle('width')[offset.indexOf(e.currentTarget)]);
                if (_fileStatus.all('.cancel .progress .bar').getStyle('width')[offset.indexOf(e.currentTarget)] !== '0px' ) {
                    Y.log(_getthisList[offset.indexOf(e.currentTarget)]);
                    _getthisList[offset.indexOf(e.currentTarget)].cancelUpload();
                    Y.log('--Cancelupload--');
                    Y.log(_uploader.queue);
                }
                // _getthisList[offset.indexOf(e.currentTarget)].cancelUpload();
                // _uploader.get('fileList')[offset.indexOf(e.currentTarget)].cancelUpload();
                // Y.log(offset.indexOf(e.currentTarget));
                _getthisList.splice(offset.indexOf(e.currentTarget),1);
                // _uploader.set('enabled', true);
                _uploader.set('fileList', _getthisList);
                // _uploader.set('fileList', []);
                // Y.log(_fileStatus.all('.file_status')._nodes[offset.indexOf(e.currentTarget)]);
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
            _statusList = Y.one('#' + e.file.get('id') + '');
            _statusList.one(".file_progress").set("text", e.percentLoaded + "%");
            _statusList.one('.progress .bar').setStyle('width', e.percentLoaded + '%');
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
            _statusList.one(".file_progress").set("text", "Complete");
            _statusList.one('.progress .bar').setStyle('width', '100%');
            _statusList.removeClass('cancel');
            _statusList.one('.close').removeClass('cancel_close');
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
