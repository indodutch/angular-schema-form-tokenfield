(function () {
    'use strict';
    angular.module('schemaForm').config(
        ['schemaFormProvider', 'schemaFormDecoratorsProvider', 'sfPathProvider',
            function (schemaFormProvider, schemaFormDecoratorsProvider, sfPathProvider) {
                var tokenfield = function (name, schema, options) {
                    if ((schema.type === 'array') && (schema.format === 'tokenfield')) {
                        var f = schemaFormProvider.stdFormObj(name, schema, options);
                        f.key = options.path;
                        f.type = 'tokenfield';
                        // Override type to disable array validation
                        f.schema.type = 'string';
                        options.lookup[sfPathProvider.stringify(options.path)] = f;
                        return f;
                    }
                };

                schemaFormProvider.defaults.array.unshift(tokenfield);

                //Add to the bootstrap directive
                schemaFormDecoratorsProvider.addMapping(
                    'bootstrapDecorator',
                    'tokenfield',
                    'directives/decorators/bootstrap/tokenfield/angular-schema-form-tokenfield.html'
                );

                schemaFormDecoratorsProvider.createDirective(
                    'tokenfield',
                    'directives/decorators/bootstrap/tokenfield/angular-schema-form-tokenfield.html'
                );
            }
        ]);

    angular.module('schemaForm').directive('angularBootstrapTokenfield', function () {
        return {
            restrict: 'A',
            require: '^ngModel',
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
            },
            link: function (scope, element, attrs) {
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

                // Add custom validation
                var schema = scope.$parent.form.schema;
                // tokenfield uses jquery events
                $(newElement)
                    .on('tokenfield:createdtoken', function (e) {
                        console.log('New token created!');
                        var value = e.attrs.value;
                        if (schema.items.type === 'number' || schema.items.type === 'integer') {
                            if ($.isNumeric(value)) {
                                value = Number(value);
                            } else {
                                value = "";
                            }
                        }
                        
                        var valid = tv4.validate(value, schema.items);
                        if (!valid){
                            scope.$broadcast('schemaForm.error.'+this.name,'tv4-0',tv4.error.message);
                            scope.$broadcast('schemaForm.error.'+this.name,'tv4-0',false);
                            $(e.relatedTarget).addClass('invalid');
                        }
                    });
                    /*
                    .on('tokenfield:edittoken', function (e) {
                        console.log('Token was edited, new value: ' + e.attrs.value)
                    })
                    .on('tokenfield:removedtoken', function (e) {
                        alert('Token removed! Token value was: ' + e.attrs.value)
                    });
                    */
            }
        };
    });
})();