class Project {
    constructor () {
      this.id = "";
        this.title = "";
        this.text = "";
        this.pages = '';
    }
}

class Page {
    constructor (){
        this.id = "";
        this.title = "";
        this.text = "";
    }
}

var app = angular.module('app', ["ngRoute", "ngStorage"])

    .config(['$routeProvider', ($routeProvider) => {

        $routeProvider
            .when('/', {
                templateUrl: 'components/selectActionPage/selectActionPage.html',
                controller: 'selectActionPageCtrl'
            })
            .when('/admin', {
                templateUrl: 'components/adminPage/adminPage.html',
                controller: 'adminPageCtrl'
            })
            .otherwise({
                redirectTo: '/'
            });

        let appID = '0C97B595-4726-D457-FF45-E73E75B06000';
        let secretKEY = '0F38A868-7AEF-4DD0-FF3F-F80AD1599C00';
        let version = 'v1';

        Backendless.initApp(appID, secretKEY, version);
    }])

    .factory('APPconfig', () => {
        let deviceID = 'Mac OSX';
        let folderName = 'testFolder';

        return {
            deviceID: deviceID,
            folderName: folderName,
            saveProject: (title) => {
                let action = Backendless.Persistence.of(Project).save({
                    id: Utils.uuid(),
                    title: title,
                    text: Utils.translit(title)
                });

                return action;
            }
        }
    })

    .controller("adminPageCtrl", ($scope, APPconfig, $rootScope) => {
        $scope.currentAction = 'addProgect';
        $scope.setCurrentAction = (action) => {
            $scope.currentAction = action;
        }

        $scope.addProject = (name) => {
            APPconfig.saveProject(name);
            $rootScope.$broadcast("changeProjectList");
            $scope.getProject();
            $scope.getNameProject = "";
        }

        $scope.getProject = () => {
            $scope.progects = Backendless.Persistence.of(Project).find().data;
        }

        $scope.deleteProject = (item) => {
            Backendless.Persistence.of(Project).remove(item);
            $rootScope.$broadcast("changeProjectList");
            $scope.getProject()
        }

        $scope.getProject();
    })

    .controller("selectActionPageCtrl", ($scope, $localStorage) => {
        $scope.isLoginFall = false;

        if ($localStorage.isLogin){
            window.location = window.location.pathname + '#/admin';
        }

        $scope.loginFunc = () => {
            let user = $scope.userID;
            let pswrd = $scope.userPassword;

            try {
                let isLogin = Backendless.UserService.login(user, pswrd);

                if (isLogin != null){
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
        }
    })

    .controller("getProject", ($scope, $rootScope) => {
        let init = () => {
            $scope.progects = Backendless.Persistence.of(Project).find().data;
        }

        $rootScope.$on("changeProjectList", () => {init()})

        init();
    })
