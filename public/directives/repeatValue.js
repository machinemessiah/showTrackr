angular.module('MyApp')
  .directive('repeatValue', function() {
    return {
      require: 'ngModel',
      link: function(scope, elem, attrs, ctrl) {
        // get the element we're matching against 
        // (elem.inheritedData("$formController") returns the form)
        var otherInput = elem.inheritedData("$formController")[attrs.repeatValue];

        // add our check (which sets validity of the form based on whether the value matches that of the otherInput)
        // to the controller's form parsers for elements matching this directive
        ctrl.$parsers.push(function(value) {
          if (value === otherInput.$viewValue) {
            ctrl.$setValidity('repeat', true);
            return value;
          }
          ctrl.$setValidity('repeat', false);
        });

        // do the same for the otherInput (when parses it checks for value matching)
        otherInput.$parsers.push(function(value) {
          ctrl.$setValidity('repeat', value === ctrl.$viewValue);
          return value;
        });
      }
    };
  });