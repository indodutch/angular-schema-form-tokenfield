angular.module('schemaForm').config(
    ['schemaFormProvider', 'schemaFormDecoratorsProvider', 'sfPathProvider',
        function (schemaFormProvider, schemaFormDecoratorsProvider, sfPathProvider) {
            var tokenfield = function (name, schema, options) {
                if ((schema.type === 'string') && (schema.format === 'tokenfield')) {
                    var f = schemaFormProvider.stdFormObj(name, schema, options);
                    f.key = options.path;
                    f.type = 'tokenfield';
                    options.lookup[sfPathProvider.stringify(options.path)] = f;
                    return f;
                }
            };

            schemaFormProvider.defaults.string.unshift(tokenfield);

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