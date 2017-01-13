angular.module('schemaForm').run(['$templateCache', function($templateCache) {$templateCache.put('directives/decorators/bootstrap/tokenfield/angular-schema-form-tokenfield.html','<div class="form-group {{form.htmlClass}}" data-ng-class="{\'has-error\': hasError()}"><label class="control-label {{form.labelHtmlClass}}" data-ng-show="showTitle()">{{form.title}}</label><div data-ng-class="{\'input-group\': (form.fieldAddonLeft || form.fieldAddonRight)}"><span class="input-group-addon" data-ng-if="form.fieldAddonLeft" data-ng-bind-html="form.fieldAddonLeft"></span> <input type="text" class="form-control {{form.fieldHtmlClass}}" schema-validate="form" placeholder="{{$scope.placeholder}}" angular-bootstrap-tokenfield="" tokens="form.tokens" limit="form.limit" min-length="form.minLength" min-width="form.minWidth" show-autocomplete-on-focus="form.showAutocompleteOnFocus" autocomplete="form.autocomplete" create-tokens-on-blur="form.createTokensOnBlur" delimiter="form.delimiter" beautify="form.beautify" inputtype="form.inputType" data-ng-show="form.key" data-ng-model="$$value$$" data-ng-disabled="form.readonly"> <span class="input-group-addon" data-ng-if="form.fieldAddonRight" data-ng-bind-html="form.fieldAddonRight"></span></div><span class="help-block">{{ (hasError() && errorMessage(schemaError())) || form.description}}</span></div>');}]);
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