/*global angular */
"use strict";

/**
 * The main app module
 * @name testApp
 * @type {angular.Module}
 */

var testApp = angular.module("testApp", ["schemaForm", "angularTokenfield"]);

testApp.controller("appController", ["$scope", "$http", function ($scope, $http) {
    $scope.schema = {
        type: "object",
        title: "Tokenfield",
        properties: {
            tokenfield1: {
                title: "Tokenfield",
                type: "string",
                format: "tokenfield"
            },
            minlength: {
                title: "Minimum length: 5",
                type: "string",
                format: "tokenfield"
            },
            autocomplete: {
                title: "With autocomplete",
                type: "string",
                format: "tokenfield"
            }
        }
    };

    $scope.form = [
        "tokenfield1",
        {
            key: "minlength",
            minLength: 5
        },
        {
            key: "autocomplete",
            autocomplete: {
                source: ['red','blue','green','yellow','violet','brown','purple','black','white'],
                delay: 100
            },
            showAutocompleteOnFocus: true,
            placeholder: "Autocomplete requires jquery-ui"
        }
    ];
}]);