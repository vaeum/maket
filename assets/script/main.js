function Category() {
    this.id = "";
    this.title = "";
    this.text = "";
}

var app = angular.module('app', [])

    .config(() => {
        let appID =  '0C97B595-4726-D457-FF45-E73E75B06000';
        let secretKEY = '0F38A868-7AEF-4DD0-FF3F-F80AD1599C00';
        let version = 'v1';

        Backendless.initApp(appID, secretKEY, version);
    })

    .factory('APPconfig', () => {
        let deviceID = 'Mac OSX';
        let folderName = 'testFolder';

        return {
            deviceID: deviceID,
            folderName: folderName,
            saveCategory: (title) => {
                Backendless.Persistence.of(Category).save({
                    id: Utils.uuid(),
                    title: title,
                    text: Utils.translit(title)
                });
            }
        }
    })

    .controller("choseActionCtrl", ($scope, APPconfig) => {
        $scope.teat = "APPconfig.appID"

        $scope.addCategory = () => {
            APPconfig.saveCategory($scope.getNameCaterory)
            $scope.getCategory()
        }

        $scope.getCategory = () => {
            $scope.categories = Backendless.Persistence.of(Category).find().data;
        }

        $scope.deleteCategory = (item) => {
            Backendless.Persistence.of(Category).remove(item);
            $scope.getCategory()
        }

        $scope.getCategory();
    })




