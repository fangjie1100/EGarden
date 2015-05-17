 function MyController($scope, $timeout) {
     $scope.clock = {
         now: dateFormat(new Date())
     };
     var updateClock = function () {
         $scope.clock.now = dateFormat(new Date())
     };

     setInterval(function () {
         $scope.$apply(updateClock)
     }, 1000);
 };

 var dateFormat = function (date) {
     return moment(date).format('YYYY-MM-DD HH:mm ss');
 };

 function FirstController($scope) {
     $scope.message = 'hello';
     $scope.counter = 0;
     $scope.add = function (amount) {
         console.log('is click');
         $scope.counter += amount;
     };

     $scope.subtract = function (amount) {
         $scope.counter -= amount;
     };
 };

 function MyController2($scope, $parse) {
     $scope.$watch('expr', function (newVal, oldVal, scope) {
         if (newVal !== oldVal) {
             var parseFun = $parse('expr');
             $scope.parsedValue = parseFun(scope);
         }
     });
 }