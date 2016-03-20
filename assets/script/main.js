function Project() {
    this.id = "";
    this.title = "";
    this.text = "";
}


var app = angular.module('app', ["ngRoute"])

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
            .when('/addProject', {
                templateUrl: 'components/addProjectPage/addProjectPage.html',
                controller: 'addProjectPageCtrl'
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
                Backendless.Persistence.of(Project).save({
                    id: Utils.uuid(),
                    title: title,
                    text: Utils.translit(title)
                });
            }
        }
    })

    .controller("choseActionCtrl", ($scope, APPconfig) => {

    })

    .controller("adminPageCtrl", ($scope, APPconfig) => {
        $scope.currentAction = 'addProgect';
        $scope.setCurrentAction = (action) => {
            $scope.currentAction = action;
        }
    })

    .controller("selectActionPageCtrl", ($scope) => {
        $scope.isLoginFall = false;

        $scope.loginFunc = () => {
            let user = $scope.userID;
            let pswrd = $scope.userPassword;

            try {
                let isLogin = Backendless.UserService.login(user, pswrd);

                if (isLogin != null){
                    window.location = '/#/admin'
                    $scope.isLoginFall = false;
                } else {
                    $scope.isLoginFall = true;
                }

            } catch (e) {
                $scope.isLoginFall = true;
            }
        }
    })

    .controller("addProjectPageCtrl", ($scope, APPconfig) => {

        $scope.addProject = () => {
            APPconfig.saveProject($scope.getNameProject)
            $scope.getProject()
        }

        $scope.getProject = () => {
            $scope.categories = Backendless.Persistence.of(Project).find().data;
        }

        $scope.deleteProject = (item) => {
            Backendless.Persistence.of(Project).remove(item);
            $scope.getProject()
        }

        $scope.getProject();
    })
