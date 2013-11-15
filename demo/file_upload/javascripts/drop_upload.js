/*global window, document, alert, console, FileReader, XMLHttpRequest, dashes, boundary, crlf, unescape, FormData*/
/**
 *
 * @authors Ted Shiu (tedshd@gmail.com)
 * @date    2013-09-26 22:05:13
 * @version $Id$
 */

/**
 * init drag area and bind event
 */
var imageTypes = ['image/png', 'image/jpeg', 'image/gif', 'image/bmp'],
    defaultArea = document.body.setAttribute('id', 'dropArea'),
    dropArea = document.getElementById('dropArea') || defaultArea,
    dragenter,
    dragover,
    drop,
    handleFiles,
    uploadDropFile;
var list = document.createElement('ul'),
    img = document.createElement('img'),
    div = document.createElement('div'),
    li,
    info,
    defaultFileList = document.body.appendChild(div),
    fileList = document.getElementById('fileList') || defaultFileList;
div.setAttribute('id', 'fileList');
fileList.appendChild(list);

console.log('init drop area', dropArea);

dropArea.addEventListener('dragenter', dragenter, false);
dropArea.addEventListener('dragover', dragover, false);
dropArea.addEventListener('drop', drop, false);

// stop default event
function dragenter(e) {
    e.stopPropagation();
    e.preventDefault();
}

// stop default event
function dragover(e) {
    e.stopPropagation();
    e.preventDefault();
}

function drop(e, i) {
    e.stopPropagation();
    e.preventDefault();

    console.log('--drop--');
    // console.log('dataTransfer', e.dataTransfer);
    // console.log('files', e.dataTransfer.files);
    // console.log('webkitGetAsEntry', e.dataTransfer.items[0].webkitGetAsEntry());
    console.log('--drop end--');

    // use files API handle drop file
    var dt = e.dataTransfer,
        files = dt.files,
        // length = dt.items.length,
        entry;
    // for (i = 0; i < length; i++) {
    //     entry = e.dataTransfer.items[i].webkitGetAsEntry();
    //     console.log(entry);
    //     if (entry.isFile) {
    //         console.log(entry.isFile);
    //     } else if (entry.isDirectory) {
    //         console.log(entry.isDirectory);
    //         alert('Don\'t drop folder');
    //         return;
    //     }
    // }

    handleFiles(files);
}

/**
 * [handleFiles show file on view]
 * @param  {[type]} file [drop file]
 * @param  {[type]} i    [init for]
 * @return {[type]}      [description]
 */
function handleFiles(file, i) {
    if (!file.length) {
        fileList.innerHTML = '<p>No file selected!</p>';
        alert('No file selected');
        console.log('no file selected');
    } else {
        for (i = 0; i < file.length; i++) {
            li = document.createElement('li');
            list.appendChild(li);
            // check drop file is image
            if (imageTypes.indexOf(file[i].type) !== -1) {
                img = document.createElement('img');
                img.src = window.URL.createObjectURL(file[i]);
                img.height = 60;
                img.onload = function() {
                    window.URL.revokeObjectURL(this.src);
                };
                li.appendChild(img);
            }

            // show name, type, size
            info = document.createElement('span');
            if (file[i].size > (1000 * 1000)) {
                info.innerHTML = file[i].name +
                    '- type: ' +
                    file[i].type +
                    ':' +
                    ((file[i].size) / (1000 * 1000)) +
                    ' mbytes';
            } else {
                info.innerHTML = file[i].name +
                    '- type: ' +
                    file[i].type +
                    ':' +
                    ((file[i].size) / 1000) +
                    ' kbytes';
            }

            li.appendChild(info);

            uploadDropFile(file, i);
        }
    }
}

/**
 * [uploadDropFile upload file]
 * @param  {[type]} file [drop file]
 * @param  {[type]} i    [for]
 * @return {[type]}      [description]
 */
function uploadDropFile(file, i) {
    var settings = {
            "name": "Upfile",
            "postUrl": "upload_one.php",
            "onClientAbort": null,
            "onClientError": null,
            "onClientLoad": null,
            "onClientLoadEnd": null,
            "onClientLoadStart": null,
            "onClientProgress": null,
            "onServerAbort": null,
            "onServerError": null,
            "onServerLoad": null,
            "onServerLoadStart": null,
            "onServerProgress": null,
            "onServerReadyStateChange": null,
            "onSuccess": null
        };
    var fileReader = new FileReader();
    fileReader.onabort = function (e) {
        if (settings.onClientAbort) {
            settings.onClientAbort(e, file[i]);
        }
    };
    fileReader.onerror = function (e) {
        if (settings.onClientError) {
            settings.onClientError(e, file[i]);
        }
    };
    fileReader.onload = function (e) {
        if (settings.onClientLoad) {
            settings.onClientLoad(e, file[i]);
        }
    };
    fileReader.onloadend = function (e) {
        if (settings.onClientLoadEnd) {
            settings.onClientLoadEnd(e, file[i]);
        }
    };
    fileReader.onloadstart = function (e) {
        if (settings.onClientLoadStart) {
            settings.onClientLoadStart(e, file[i]);
        }
    };
    fileReader.onprogress = function (e) {
        if (settings.onClientProgress) {
            settings.onClientProgress(e, file[i]);
        }
    };
    fileReader.readAsDataURL(file[i]);

    var xmlHttpRequest = new XMLHttpRequest();
    xmlHttpRequest.upload.onabort = function (e) {
        console.log('onabort', e);
        if (settings.onServerAbort) {
            settings.onServerAbort(e, file[i]);
        }
    };
    xmlHttpRequest.upload.onerror = function (e) {
        console.log('onerror', e);
        if (settings.onServerError) {
            settings.onServerError(e, file[i]);
        }
    };
    xmlHttpRequest.upload.onload = function (e) {
        console.log('onload', e);
        if (settings.onServerLoad) {
            settings.onServerLoad(e, file[i]);
        }
    };
    xmlHttpRequest.upload.onloadstart = function (e) {
        console.log('onloadstart', e);
        if (settings.onServerLoadStart) {
            settings.onServerLoadStart(e, file[i]);
        }
    };
    xmlHttpRequest.upload.onprogress = function (e) {
        console.log('onprogress', e);
        console.log(e.loaded);
        if (settings.onServerProgress) {
            settings.onServerProgress(e, file[i]);
        }
    };
    xmlHttpRequest.onreadystatechange = function (e) {
        console.log('onreadystatechange', e);
        if (settings.onServerReadyStateChange) {
            settings.onServerReadyStateChange(e, file[i], xmlHttpRequest.readyState);
        }
        if (settings.onSuccess && xmlHttpRequest.readyState === 4 && xmlHttpRequest.status === 200) {
            settings.onSuccess(e, file, xmlHttpRequest.responseText);
        }
    };
    xmlHttpRequest.open("POST", settings.postUrl, true);

    // if (file.getAsBinary) { // Firefox

    //     var data = dashes + boundary + crlf +
    //         "Content-Disposition: form-data;" +
    //         "name=\"" + settings.name + "\";" +
    //         "filename=\"" + unescape(encodeURIComponent(file[i].name)) + "\"" + crlf +
    //         "Content-Type: application/octet-stream" + crlf + crlf +
    //         file.getAsBinary() + crlf +
    //         dashes + boundary + dashes;

    //     xmlHttpRequest.setRequestHeader("Content-Type", "multipart/form-data;boundary=" + boundary);
    //     xmlHttpRequest.sendAsBinary(data);

    // } else if (window.FormData) { // Chrome

        var formData = new FormData();
        formData.append(settings.name, file[i]);

        xmlHttpRequest.send(formData);

    // }
}