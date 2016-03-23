'use strict';

var Utils = {
    uuid: function uuid(a, b) {
        for (b = a = ''; a++ < 36; b += a * 51 & 52 ? (a ^ 15 ? 8 ^ Math.random() * (a ^ 20 ? 16 : 4) : 4).toString(16) : '-') {}return b;
    },

    translit: function translit(text) {
        return text.replace(/([а-яё])|([\s_-])|([^a-z\d])/gi, function (all, ch, space, words, i) {
            if (space || words) {
                return space ? '-' : '';
            }
            var code = ch.charCodeAt(0),
                index = code == 1025 || code == 1105 ? 0 : code > 1071 ? code - 1071 : code - 1039,
                t = ['yo', 'a', 'b', 'v', 'g', 'd', 'e', 'zh', 'z', 'i', 'y', 'k', 'l', 'm', 'n', 'o', 'p', 'r', 's', 't', 'u', 'f', 'h', 'c', 'ch', 'sh', 'shch', '', 'y', '', 'e', 'yu', 'ya'];
            return t[index];
        });
    }

};
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Project = function Project() {
    _classCallCheck(this, Project);

    this.id = "";
    this.title = "";
    this.text = "";
    this.pages = '';
};

var Page = function Page() {
    _classCallCheck(this, Page);

    this.id = "";
    this.title = "";
    this.text = "";
};

var app = angular.module('app', ["ngRoute", "ngStorage"]).config(['$routeProvider', function ($routeProvider) {

    $routeProvider.when('/', {
        templateUrl: 'components/selectActionPage/selectActionPage.html',
        controller: 'selectActionPageCtrl'
    }).when('/admin', {
        templateUrl: 'components/adminPage/adminPage.html',
        controller: 'adminPageCtrl'
    }).otherwise({
        redirectTo: '/'
    });

    var appID = '0C97B595-4726-D457-FF45-E73E75B06000';
    var secretKEY = '0F38A868-7AEF-4DD0-FF3F-F80AD1599C00';
    var version = 'v1';

    Backendless.initApp(appID, secretKEY, version);
}]).factory('APPconfig', function () {
    var deviceID = 'Mac OSX';
    var folderName = 'testFolder';

    return {
        deviceID: deviceID,
        folderName: folderName,
        saveProject: function saveProject(title) {
            var action = Backendless.Persistence.of(Project).save({
                id: Utils.uuid(),
                title: title,
                text: Utils.translit(title)
            });

            return action;
        }
    };
}).controller("adminPageCtrl", function ($scope, APPconfig, $rootScope) {
    $scope.currentAction = 'addProgect';
    $scope.setCurrentAction = function (action) {
        $scope.currentAction = action;
    };

    $scope.addProject = function (name) {
        APPconfig.saveProject(name);
        $rootScope.$broadcast("changeProjectList");
        $scope.getProject();
        $scope.getNameProject = "";
    };

    $scope.getProject = function () {
        $scope.progects = Backendless.Persistence.of(Project).find().data;
    };

    $scope.deleteProject = function (item) {
        Backendless.Persistence.of(Project).remove(item);
        $rootScope.$broadcast("changeProjectList");
        $scope.getProject();
    };

    $scope.getProject();
}).controller("selectActionPageCtrl", function ($scope, $localStorage) {
    $scope.isLoginFall = false;

    if ($localStorage.isLogin) {
        window.location = window.location.pathname + '#/admin';
    }

    $scope.loginFunc = function () {
        var user = $scope.userID;
        var pswrd = $scope.userPassword;

        try {
            var isLogin = Backendless.UserService.login(user, pswrd);

            if (isLogin != null) {
                window.location = window.location.pathname + '#/admin';
                $scope.isLoginFall = false;
                $localStorage.isLogin = true;
            } else {
                $scope.isLoginFall = true;
                $localStorage.isLogin = false;
            }
        } catch (e) {
            $scope.isLoginFall = true;
            $localStorage.isLogin = false;
        }
    };
}).controller("getProject", function ($scope, $rootScope) {
    var init = function init() {
        $scope.progects = Backendless.Persistence.of(Project).find().data;
    };

    $rootScope.$on("changeProjectList", function () {
        init();
    });

    init();
}).controller("toggleSidebar", function ($scope) {});