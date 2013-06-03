YUI({filter: 'raw'}).use('uploader', 'event', function(Y) {
    window.Y = Y;
    var _fileList,
        _fileListlength,
        _getthisList = [],
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
        // handle not drag area
            // _uploaderOut = new Y.Uploader({
            //     width: '0',
            //     height: '0'
            // });

        // render upload
        _uploader.render('.upload');
        // _uploaderOut.render('body');

        // drag message
        Y.one('.upload').append('<div><strong class="drop_message">Drop here!</strong></div>');

        // drag & drop
        if (Y.Uploader.TYPE === 'html5') {
            Y.one('body').append('<div class="dd_area"></div>');
            var ddArea = Y.one('.dd_area'),
                nodeMessage = Y.one('strong');

            // drag area
            _uploader.set('dragAndDropArea', 'body');
            // _uploaderOut.set('dragAndDropArea', 'body');

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

            // _uploaderOut.on(['dragenter', 'dragover'], function () {
            //     if (ddArea) {
            //         nodeMessage.removeClass('drop_message');
            //     }
            // });

            // _uploaderOut.on(['dragleave', 'drop'], function () {
            //     if (ddArea) {
                    nodeMessage.addClass('drop_message');
            //     }
            // });
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

            if (_uploadDone) {
                _uploadDone = false;
                fileTable.setHTML('');
            }

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
                // var totalSize = 0;
                // for (var i = 0; (_getthisList.length - 1) >= i; i++) {
                //     // Y.log('size' + i);
                //     // Y.log(_fileList[i].get('size'));
                //     var fileSize = _getthisList[i].get('size');
                //     totalSize = fileSize + totalSize;
                // }
                // Y.log('total----' + totalSize);
                //var uploadList = _uploader.get('fileList');
                var uploadList = _fileList;
                _uploader.uploadThese(uploadList);
                Y.log("get");
                Y.log(_getthisList);
            }

            // render filestatus
            Y.each(_fileList, function (fileInstance) {
                _fileStatus.append('<div id="' + fileInstance.get('id') + '" class="file_status cancel">' +
                                      '<div class="progress">' +
                                          '<div class="bar"></div>' +
                                      '</div>' +
                                      '<span>' +
                                          fileInstance.get('name') +
                                      '</span>' +
                                      '<button type="buttonr" class="close cancel_close">&times;</button>' +
                                  '</div>');

                fileTable.append('<tr id="' + fileInstance.get('id') + '_row' + '">' +
                '<td class="filename">' + fileInstance.get('name') + '</td>' +
                '<td class="filesize">' + fileInstance.get('size') + '</td>' +
                '<td class="percentdone">Hasnt started yet</td>');
            });
            // Y.one('.upload_total').setHTML('<div class='total_status'>' +
            //                       '<div class='progress'>' +
            //                           '<div class='bar'></div>' +
            //                       '</div>' +
            //                       '<span></span>' +
            //                   '</div>');

            var listlength = this.get('fileList').length;

            // handle cancel uploade
            Y.delegate('click', function (e) {
                Y.log('--Cancel--');
                e.preventDefault();
                var offset = _fileStatus.all('.cancel_close');
                // Y.log('cancel...');
                // Y.log(_fileList);
                Y.log(_getthisList);
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
                    // Y.log('--Cancelupload--');
                    // Y.log(_uploader.queue);
                }
                // _getthisList[offset.indexOf(e.currentTarget)].cancelUpload();
                // _uploader.get('fileList')[offset.indexOf(e.currentTarget)].cancelUpload();
                // Y.log(offset.indexOf(e.currentTarget));
                Y.log(e.currentTarget);
                Y.log(e.currentTarget._yuid);
                _getthisList.splice(offset.indexOf(e.currentTarget),1);
                // _uploader.set('enabled', true);
                _uploadDone = true;
                _uploader.set('fileList', _getthisList);
                // _uploader.set('fileList', []);
                // Y.log(_fileStatus.all('.file_status')._nodes[offset.indexOf(e.currentTarget)]);
                Y.log(_fileStatus);
                Y.log(_fileStatus.all('.cancel'));
                Y.log(_fileStatus.all('.cancel').item(0));
                Y.log(_fileStatus.all('.cancel')._nodes[offset.indexOf(e.currentTarget)]);
                Y.log(Y.one("#filelist"));
                // Y.one("#filelist").remove();
                _fileStatus.all('.cancel').item(offset.indexOf(e.currentTarget)).remove();
                // _fileStatus.all('.cancel')._nodes[offset.indexOf(e.currentTarget)].remove();
                // Y.log(_fileStatus.all('.file_status').size());
                // Y.log(offset);
                // var lastTotalSize = 0;
                // for (var i = 0; (_getthisList.length - 1) >= i; i++) {
                //     // Y.log('size' + i);
                //     // Y.log(_fileList[i].get('size'));
                //     var fileSize = _fileList[i].get('size');
                //     lastTotalSize = fileSize + lastTotalSize;
                // }
                // Y.log('canceltotal----' + lastTotalSize);
                // for (var aMultiples = ['KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'], nMultiple = 0, nApprox = lastTotalSize / 1024; nApprox > 1; nApprox /= 1024, nMultiple++) {
                //     lastTotalSize = nApprox.toFixed(3) + ' ' + aMultiples[nMultiple];
                // }
                // Y.one('.total_status span').setHTML('Number: ' + _fileStatus.all('.file_status').size() + ' Total: ' + lastTotalSize);
            }, _fileStatus, '.close');

            // Y.log('offset:' + listlength);
            // total upload
            // for (var aMultiples = ['KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'], nMultiple = 0, nApprox = totalSize / 1024; nApprox > 1; nApprox /= 1024, nMultiple++) {
            //     totalSize = nApprox.toFixed(3) + ' ' + aMultiples[nMultiple];
            // }
            // Y.one('.total_status span').setHTML('Number: ' + _fileStatus.all('.file_status').size() + ' Total: ' + totalSize);
        });

        _uploader.on('uploadprogress', function (e) {
            // Y.log('--Uploadprogress--');
            // Y.log(_uploader);
            // Y.log(e);
            // Y.log(e.file);
            var fileRow = Y.one('#' + e.file.get('id') + '_row');
            var statusList = Y.one('#' + e.file.get('id') + '');
            // fileRow.one('.percentdone').set('text', e.percentLoaded + '%');
            statusList.one('.progress .bar').setStyle('width', e.percentLoaded + '%');
            if (e.percentLoaded === 100) {
                statusList.removeClass('cancel');
                statusList.one('.close').removeClass('cancel_close');
            }
        });

        _uploader.on('uploadstart', function (e) {
            Y.log('--UploadStart--');
            // _uploader.set('enabled', false);
            Y.log('START');
            Y.log(_fileList);
        });

        _uploader.on('uploadcomplete', function (e) {
            Y.log('--UploadComplete--');
            var fileRow = Y.one('#' + e.file.get('id') + '_row');
            fileRow.one('.percentdone').set('text', 'Finished!');
        });

        _uploader.on('totaluploadprogress', function (e) {
            // Y.log('--ALLUploadprogress--');
            Y.one('#overallProgress').setHTML('Total uploaded: <strong>' +
            // e.bytesTotal + 'Bytes' +
            Math.floor((e.bytesLoaded/e.bytesTotal)*100) + '%' +
            // e.percentLoaded + '%' +
            '</strong>');

            // Y.one('.total_status').one('.progress .bar').setStyle('width', Math.floor((e.bytesLoaded/e.bytesTotal)*100) + '%');
            // Y.log('TOTAL%');
            // Y.log(e.percentLoaded);
            // total upload
            // Y.one('.total_status span').append('<span>' + ' Total: ' + e.bytesTotal + 'Bytes' + '</span>');
        });

        _uploader.on('alluploadscomplete', function (e) {
            Y.log('--ALLUploadComplete--');
            // _uploader.set('enabled', true);
            _uploader.set('fileList', []);
            _uploadDone = true;
        });

    } else {
        Y.one('#uploaderContainer').set('text', 'We are sorry, but to use the uploader, you either need a browser that support HTML5 or have the Flash player installed on your computer.');
    }
});
