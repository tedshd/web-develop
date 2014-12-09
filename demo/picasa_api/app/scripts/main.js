/*!
 *
 *  Web Starter Kit
 *  Copyright 2014 Google Inc. All rights reserved.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License
 *
 */
(function () {
  'use strict';

  var querySelector = document.querySelector.bind(document);

  var navdrawerContainer = querySelector('.navdrawer-container');
  var body = document.body;
  var appbarElement = querySelector('.app-bar');
  var menuBtn = querySelector('.menu');
  var main = querySelector('main');

  function closeMenu() {
    body.classList.remove('open');
    appbarElement.classList.remove('open');
    navdrawerContainer.classList.remove('open');
  }

  function toggleMenu() {
    body.classList.toggle('open');
    appbarElement.classList.toggle('open');
    navdrawerContainer.classList.toggle('open');
  }

  main.addEventListener('click', closeMenu);
  menuBtn.addEventListener('click', toggleMenu);
  navdrawerContainer.addEventListener('click', function (event) {
    if (event.target.nodeName === 'A' || event.target.nodeName === 'LI') {
      closeMenu();
    }
  });

})();

// add class
function addClass(dom, className) {
    if (dom.classList) {
        dom.classList.add(className);
    } else {
        dom.className += ' ' + className;
    }
}

// remove class
function removeClass(dom, className) {
    if (dom.classList) {
        dom.classList.remove(className);
    } else {
        var reg = new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi');
        dom.className = dom.className.replace(reg, ' ');
    }
}

function navActive (index) {
  var navList = document.querySelectorAll('#nav_bar li');
  for (var i = navList.length - 1; i >= 0; i--) {
    navList[i].setAttribute('class', '');
  };
  navList[index].setAttribute('class', 'active');
}

function loaderView (status) {
  if (status === 'show') {
    document.querySelector('.loading').setAttribute('id', 'loader');
  } else {
    document.querySelector('.loading').setAttribute('id', '');
  }
}


var angularModule = angular.module('route', ['ngRoute', 'ngResource', 'ngSanitize']);

function RouteConfig($routeProvider, $locationProvider) {
  $routeProvider.
  when('/', {
    controller: blogController,
    templateUrl: 'blog.html'
  }).
  when('/blog', {
    controller: blogController,
    templateUrl: 'blog.html'
  }).
  when('/dev_note', {
    controller: devNoteController,
    templateUrl: 'dev_note.html'
  }).
  when('/screen_shot', {
    controller: screenShotController,
    templateUrl: 'screen_shot.html'
  }).
  when('/logo_design', {
    controller: logoDesignController,
    templateUrl: 'logo_design.html'
  }).
  when('/about', {
    controller: aboutController,
    templateUrl: 'about.html'
  }).
  otherwise({
    redirectTo: '/'
  });

  // $locationProvider.html5Mode(true);
};

angularModule.config(RouteConfig);

window.onkeydown = routing;
var tabList = ['#/blog', '#/dev_note', '#/screen_shot', '#/logo_design'];
var tabCount = 0;
function routing(e) {
  if (e.keyCode === 39) {
    tabCount++;
    if (tabCount >= tabList.length) {
      tabCount = 0;
    }
    console.log(document.querySelector('#routing'));
    document.querySelector('#routing').setAttribute('href', tabList[tabCount]);
    document.querySelector('#routing').click();
  }
}

function blogController ($scope, $http, $sce) {
  navActive(0);
  loaderView('show');
  var transEndEventNames = {
    'WebkitTransition' : 'webkitTransitionEnd',
    'MozTransition'    : 'transitionend',
    'OTransition'      : 'oTransitionEnd otransitionend',
    'msTransition'     : 'MSTransitionEnd',
    'transition'       : 'transitionend'
  },
  transEndEventName = transEndEventNames[ Modernizr.prefixed('transition') ];
  document.querySelector('.content_layer').addEventListener(transEndEventName, function(){
      addClass(document.querySelector('.content_layer'), 'hide');
  });
  document.querySelector('.content_layer .icon-close').addEventListener('click', function() {
    removeClass(document.querySelector('.blog ul'), 'move_to_back');
    addClass(document.querySelector('.content_layer'), 'fade_out');
    removeClass(document.querySelector('.content_layer'), 'fade_in');
  });
  $scope.title = '';
  $scope.content = '';
  $scope.data = [];
  var list = document.querySelector('.blog ul'),
      arrayList,
      li,
      a;
  list.setAttribute('class', 'effeckt-list');
  list.setAttribute('data-effeckt-type', 'fall-in');
  var apiUrl = 'https://www.googleapis.com/blogger/v3/blogs/3745840663688762132/posts?maxResults=999&key=AIzaSyBn8vkfct3dQn6RndSM_23da0a_PtbgIyc';
  $http.jsonp(apiUrl + '&callback=JSON_CALLBACK').success(
  function(data) {
          console.log(data);
          $scope.data = data.items;
          arrayList = data.items;
          // for (var i = 0; i < arrayList.length; i++) {
          //   li = document.createElement('li');
          //   a = document.createElement('a');
          //   li.setAttribute('class', 'new-item');
          //   a.setAttribute('data-list-count', i);
          //   a.setAttribute('href', arrayList[i].url);
          //   a.setAttribute('ng-click', 'showContent($index, $event)');
          //   a.innerHTML = arrayList[i].title;
          //   li.appendChild(a);
          //   list.appendChild(li);
          // }
          loaderView('hide');
          // $scope.tag = data.items.category;
      }
  );
  // list.addEventListener('click', function(e) {
  //   e.preventDefault();
  //   console.log(e);
  //   console.log(e.target);
  //   var index = e.target.getAttribute('data-list-count');
  //   console.log(index);
  //   console.log($scope.data);
  //   $scope.content = $scope.data[index].content;
  //   $scope.title = $scope.data[index].title;
  //   console.log($scope.content);
  //   console.log($scope.title);
  //   removeClass(document.querySelector('.content_layer'), 'hide');
  // });
  $scope.showContent = function($index , $event) {
    $event.preventDefault();
    console.log($index);
    // console.log($scope.data[$index].content);
    $scope.content = $scope.data[$index].content;
    $scope.title = $scope.data[$index].title;
    removeClass(document.querySelector('.content_layer'), 'hide');
    addClass(document.querySelector('.blog ul'), 'move_to_back');
    removeClass(document.querySelector('.content_layer'), 'fade_out');
    addClass(document.querySelector('.content_layer'), 'fade_in');

  };
  $scope.renderHtml = function() {
      return $sce.trustAsHtml($scope.content);
  };

}

function devNoteController ($scope, $http) {
  navActive(1);
  loaderView('show');
  // use YQL handle xml to json
  var apiUrl = "https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20atom%20where%20url%3D'http%3A%2F%2Ftedshd.logdown.com%2Fposts.atom'&format=json&diagnostics=true";
  $http.jsonp(apiUrl + '&callback=JSON_CALLBACK').success(
  function(data) {
          console.log(data);
          $scope.data = data.query.results.entry;
          loaderView('hide');
      }
  );
}

function screenShotController ($scope, $http) {
  navActive(2);
  loaderView('show');
  var apiUrl = 'http://picasaweb.google.com/data/feed/base/user/TEDsHD/albumid/5263807088660719009?alt=json';
  $http.jsonp(apiUrl + '&callback=JSON_CALLBACK').success(
    function(data) {
      console.log(data);
      $scope.data = data.feed.entry;
      var arrayList = data.feed.entry,
          list = document.querySelector('.content'),
          div,
          img;
      for (var i = arrayList.length - 1; i >= 0; i--) {
        div = document.createElement('div');
        img = document.createElement('img');
        div.setAttribute('class', 'effeckt-list');
        div.setAttribute('data-effeckt-type', 'fall-in');
        img.setAttribute('class', 'new-item');
        img.setAttribute('width', 512);
        img.setAttribute('src', arrayList[i].content.src);
        img.setAttribute('alt', arrayList[i].title.$t);
        div.appendChild(img);
        list.appendChild(div);
      }
      loaderView('hide');
    }
  );
}

function logoDesignController ($scope, $http) {
  navActive(3);
  loaderView('show');
  var apiUrl = 'http://picasaweb.google.com/data/feed/base/user/TEDsHD/albumid/5647072520335396993?alt=json';
  $http.jsonp(apiUrl + '&callback=JSON_CALLBACK').success(
    function(data) {
      console.log(data);
      $scope.data = data.feed.entry;
      loaderView('hide');
    }
  );
}

function aboutController ($scope, $http) {
  navActive(4);
}