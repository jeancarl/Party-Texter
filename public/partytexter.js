// Filename: public/partytexter.js

angular.module('smsListenFilters', [])
.filter('phone', function() {
  return function(input, showLast) {
  	if(!angular.isString(input)) return input;
  	if(!showLast) showLast = input.length;

    return input.substring(0, input.length-showLast).replace(/\d/g, '*')+input.substring(input.length-showLast, input.length);
  };
})
.filter('orderObjectBy', function(){
 return function(input, attribute) {
    if (!angular.isObject(input)) return input;

    var array = [];
    for(var objectKey in input) {
        array.push(input[objectKey]);
    }

    array.sort(function(a, b){
        a = parseInt(a[attribute]);
        b = parseInt(b[attribute]);
        return a - b;
    });
    return array;
 }
});

angular.module('PartyTexterApp', ['smsListenFilters'])
.controller('PartyTexterCtrl', ['$scope', function($scope) {
	$scope.lastMessage = null;
	$scope.leaderBoard = {};
	$scope.phoneNumber = 'PHONENUMBER';

	var incoming = PUBNUB.init({
        subscribe_key: 'SUBSCRIBEKEY'
    });	

    incoming.subscribe({
	    channel: 'sms',
	    message: function(m) {
	    	$scope.$apply(function() {
    			$scope.lastMessage = m;

    			if(!(m.from in $scope.leaderBoard)) {
    				$scope.leaderBoard[m.from] = {number: m.from, count: 0};
    			}

    			$scope.leaderBoard[m.from].count++;
    		});
	    }
	});
}]);