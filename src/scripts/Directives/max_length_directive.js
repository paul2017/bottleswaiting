(function() {
    'use strict'

    angular.module('bwcapp.max_length', [])
        .directive('bwMaxlength', ['$log', '$window', bwMaxlength]);

    function bwMaxlength($log, $window) {
        return {
            require: 'ngModel',
            link: function(scope, element, attrs, ngModelCtrl) {
                var maxlength = Number(attrs.bwMaxlength);

                function fromUser(text) {
                    var str = text + "";
                    if (str.length > maxlength) {
                        var transformedInput = str.substring(0, maxlength);
                        ngModelCtrl.$setViewValue(transformedInput);
                        ngModelCtrl.$render();
                        return Number(transformedInput);
                    }
                    return Number(str);
                }
                ngModelCtrl.$parsers.push(fromUser);
            }
        };
    }
})();