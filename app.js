/*global angular */
"use strict";

/**
 * The main app module
 * @name testApp
 * @type {angular.Module}
 */

var testApp = angular.module('app', ['ngRoute', 'schemaForm'])
.config(function($routeProvider) {
    $routeProvider.
      when('/', {controller: 'appController'});
  });
  
testApp.controller('appController', ['$scope', '$http', function ($scope, $http) {
        $scope.schema = {
            type: "object",
            title: "Tokenfield",
            properties: {
                nummer: {
                    type: "number",
                    minimum: 3,
                    maximum: 5
                },
                tokenfield1: {
                    title: "Tokenfield",
                    type: "array",
                    format: "tokenfield",
                    items: {
                        type: 'number',
                        minimum: 3,
                        maximum: 5
                    }
                },
                minlength: {
                    title: "Minimum length: 5",
                    type: "array",
                    format: "tokenfield",
                    items: {
                        type: "string"
                    }
                },
                autocomplete: {
                    title: "With autocomplete",
                    type: "array",
                    format: "tokenfield",
                    items: {
                        type: "string"
                    }
                }
            }
        };

        $scope.form = [
            "nummer",
            {
                key: "tokenfield1",
            },
            {
                description: "This is a simple field with minimum length 5",
                key: "minlength",
                minLength: 5
            },
            {
                key: "autocomplete",
                autocomplete: {
                    source: ['red', 'blue', 'green', 'yellow', 'violet', 'brown', 'purple', 'black', 'white'],
                    delay: 100
                },
                showAutocompleteOnFocus: true,
                placeholder: "Autocomplete requires jquery-ui"
            },
            {
                type: 'submit',
                title: 'Submit'
            }
        ];


        $scope.model = {};

        $scope.submit = function(tokenfieldForm) {
            console.log("Form submitted!")
        }
    }]);