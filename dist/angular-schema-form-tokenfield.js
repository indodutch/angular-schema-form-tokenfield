angular.module('schemaForm').run(['$templateCache', function($templateCache) {$templateCache.put('directives/decorators/bootstrap/tokenfield/angular-schema-form-tokenfield.html','<div class="form-group schema-form-{{form.type}} {{form.htmlClass}}" sf-field-model="sf-new-array" sf-new-array="tokenfield.modelValue" schema-validate="form" data-ng-controller="angularBootstrapTokenfieldController" data-ng-class="{\'has-error\': form.disableErrorState !== true && hasError(), \'has-success\': form.disableSuccessState !== true && hasSuccess(), \'has-feedback\': form.feedback !== false }" data-ng-model="tokenfield.modelValue">\n  <label class="control-label {{form.labelHtmlClass}}" data-ng-class="{\'sr-only\': !showTitle()}">{{form.title}}</label>\n    <input tokens="form.tokens" limit="form.limit" min-length="form.minLength" min-width="form.minWidth" show-autocomplete-on-focus="form.showAutocompleteOnFocus" autocomplete="form.autocomplete" create-tokens-on-blur="form.createTokensOnBlur" delimiter="form.delimiter" beautify="form.beautify" input-type="form.schema.items.type" type="form.schema.items.type" angular-bootstrap-tokenfield="" data-ng-model="tokenfield.viewValue">\n\n    <div class="help-block" sf-message="form.description"></div>\n\n</div>');}]);
(function () {
    'use strict';
    angular.module('schemaForm').config(
        ['schemaFormProvider', 'schemaFormDecoratorsProvider', 'sfPathProvider', 'sfBuilderProvider',
            function (schemaFormProvider, schemaFormDecoratorsProvider, sfPathProvider, sfBuilderProvider) {
                var tokenfield = function (name, schema, options) {
                    if ((schema.type === 'array') && (schema.format === 'tokenfield')) {
                        var itemSchema = schema.items;
                        if (itemSchema.type === 'object' || itemSchema.type === 'array') {
                            console.warn("Cannot use tokenfield for arrays of arrays or objects");
                        } else {
                            var f = schemaFormProvider.stdFormObj(name, schema, options);
                            f.key = options.path;
                            f.type = 'tokenfield';

                            // There should be a better way to do this, but I don't know it.
                            f.validationMessage = {
                                // Numeric Errors
                                100: 'Value is not a multiple of {{schema.items.multipleOf}}',
                                101: '{{value}} contains an item that is less than the minimum of {{schema.items.minimum}}',
                                102: '{{value}} contains an item that is equal to the exclusive minimum {{schema.items.minimum}}',
                                103: '{{value}} contains an item that is greater than the allowed maximum of {{schema.items.maximum}}',
                                104: '{{value}} contains an item that is equal to the exclusive maximum {{schema.items.maximum}}',
                                105: '{{value}} contains an item that is not a valid number',
                                // String errors
                                200: '{{value}} contains a string that is too short, minimum {{schema.items.minLength}}',
                                201: '{{value}} contains a string that is too long ({{value.length}} chars), maximum {{schema.items.maxLength}}',
                                202: '{{value}} contains a string that does not match pattern: {{schema.items.pattern}}'
                            };

                            options.lookup[sfPathProvider.stringify(options.path)] = f;
                            return f;
                        }
                    }
                };

                schemaFormProvider.defaults.array.unshift(tokenfield);

                //Add to the bootstrap directive
                schemaFormDecoratorsProvider.defineAddOn(
                    'bootstrapDecorator',
                    'tokenfield',
                    'directives/decorators/bootstrap/tokenfield/angular-schema-form-tokenfield.html',
                    sfBuilderProvider.stdBuilders
                );
            }
    ]);

    angular.module('schemaForm').controller('angularBootstrapTokenfieldController',
        ['$scope', function($scope) {

        // Our view binds schemaForm to modelValue
        // while the tokenfield is bound to viewValue
        $scope.tokenfield = {
            viewValue: "",
            modelValue: []
        };

        $scope.parseValue = function(value) {
            var conversiontype = $scope.form.schema.items.type;
            if (conversiontype === 'number' || conversiontype === 'integer') {
                return Number(value);
            } else if (conversiontype === 'boolean') {
                return Boolean(value);
            } else {
                // We're going to assume it is a string here
                // We exclude objects and arrays
                return value;
            }
        };

        $scope.$watch(function() {
            return $scope.tokenfield.viewValue;
        }, function(newValue, oldValue){
            console.log("Tokenfield value changed from: " + oldValue + "  to: " + newValue);
            if (typeof(newValue) === 'string'){
                if (newValue.indexOf(",") >= 0) {
                    $scope.tokenfield.modelValue = newValue.split(",").map(function(value) {
                        return $scope.parseValue(value);
                    });
                } else if (newValue.length > 0) {
                    $scope.tokenfield.modelValue = [];
                    $scope.tokenfield.modelValue.push($scope.parseValue(newValue));
                } else {
                    $scope.tokenfield.modelValue = [];
                }
            } else {
                $scope.tokenfield.modelValue = newValue;
            }
        });
    }]);

    angular.module('schemaForm').directive('angularBootstrapTokenfield',
        function () {
        return {
            restrict: 'A',
            scope: {
                'tokens': '=',
                'limit': '=',
                'minLength': '=',
                'minWidth': '=',
                'showAutocompleteOnFocus': '=',
                'autocomplete': '=',
                'createTokensOnBlur': '=',
                'delimiter': '=',
                'beautify': '=',
                'inputType': '=',
                'schemaFormModel': '='
            },
            link: function (scope, element, attrs, ctrl) {
                // The placeholder is not correctly propagated
                // So here is some ugly code to extract the original one
                // and put it in place when the dom changes are done.
                var newElement = element.tokenfield(scope)[0];
                scope.original = element[0];
                scope.tokenInput = element.siblings('.token-input')[0];
                scope.tokenInput.placeholder = '';
                scope.$watch(
                    function () {
                        return element[0];
                    },
                    function () {
                        scope.tokenInput.placeholder = scope.original.placeholder;
                    });
            }
        };
    });
})();