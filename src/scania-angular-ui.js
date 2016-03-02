/**
 * scania-angular-ui
 * https://github.com/scania-bootstrap/scania-angular-ui
 * License: MIT
 *
 *
 */

(function () {
    'use strict';

    angular.module('scania.angular.ui', ['scania.angular.lightbox', 'scania.angular.select2']);

    /**
     * @ngdoc module
     * @name scania.angular.lightbox
     *
     * @description
     * Scania lightbox module
     */
    angular.module('scania.angular.lightbox', ['flow', 'ui.bootstrap']).directive('scLightbox', ['$scmodal', scLightbox]);
    /**
     /**
     * @ngdoc directive
     * @name scLightbox
     * @module scania.angular.lightbox
     *
     * @description file upload and gallery extension on angularJs framework
     * @param $scmodal
     * @returns {{restrict: string, templateUrl: string, controllerAs: string, controller: Function}}
     */

    function scLightbox($scmodal) {

        return {
            restrict: 'AEC',
            templateUrl: 'template/scania-angular-upload.html',
            controllerAs: 'lightbox',
            controller: function ($scope, $attrs) {
                $animate.enabled(false); // to solve the conflict between ngAnimate and ui-bootstrap animate
                var self = this;

                self.interval = $attrs.interval;
                self.open = function (index) {
                    $scope.slides = self.flow.files;
                    $scope.slides[index].active = true;
                    self.activeImage = $scope.slides[index];

                    self.modalInstance = $scmodal.open({
                        animation: $attrs.animation,
                        templateUrl: 'template/scania-angular-lightbox.html',
                        size: $attrs.size,
                        windowClass: $attrs.windowclass,
                        scope: $scope,
                        resolve: {
                            slides: function () {
                                return $scope.slides;
                            }
                        },
                        controller: function ($scope) {
                            $scope.setAsActive = function (slide) {
                                if (slide.active) {
                                    self.activeImage = slide;
                                }
                            };
                        }
                    });
                };
                self.deleteImage = function () {
                    self.activeImage.cancel();
                    if ($scope.slides.length === 0) {
                        self.modalInstance.dismiss();
                    }
                };
            }
        };
    }

    /**
     * @ngdoc module
     * @name scania.angular.select2
     *
     * @description
     * Scania select2 directive module
     */
    angular.module('scania.angular.select2', []).directive('scSelect2', ['$compile', '$timeout', scSelect2]);

    /**
     * @ngdoc directive
     * @name scLightbox
     * @module scania.angular.select2
     *
     * @description AngularJS directive for Select2
     * @param $compile
     * @param $timeout
     * @returns {{restrict: string, scope: {ngModel: string, templateSelection: string, templateResult: string}, link: Function}}
     */
    function scSelect2($compile, $timeout) {
        return {
            restrict: 'A',
            scope: {
                ngModel: '=',
                templateSelection: '=',
                templateResult: '=',
                matcher: '='
            },
            link: function ($scope, element, $attr) {
                if ($attr.language) {
                    var domElem = '<script src="/bower_components/select2/select2_locale_' + $attr.language + '.js" async defer></script>';
                    $(element).append($compile(domElem)($scope));
                }
                var options = _.pick($(element).data(), function (value, key) {
                    return !startsWith(key, '$');
                });
                options.formatSelection = $scope.templateSelection || $.fn.select2.defaults.formatSelection;
                options.formatResult = $scope.templateResult || $.fn.select2.defaults.formatResult;
                options.matcher = $scope.matcher || $.fn.select2.defaults.matcher;
                options.minimumResultsForSearch = (options.minimumResultsForSearch > 10) ? options.minimumResultsForSearch : 10;

                var selectorName = $attr.multiple ? 'multiselect' : 'select',
                    select = {},
                    events = 'input keyup';

                $timeout(function () {
                    select = $('select.sc-' + selectorName + '[id="' + $attr.id + '"]');
                    select.select2(options);
                    updateSelectedItemsOnDisplay();

                    $scope.$watch( 'ngModel', function() {
                        updateSelectedItemsOnDisplay();
                    });
                    registerSearchInputEvents();
                });

                // Access ngModel, $attr.multiple, select, options.value,
                function updateSelectedItemsOnDisplay() {
                    if (!$scope.ngModel) return;

                    //True for both single and multiselect
                    if ($scope.ngModel.then && typeof $scope.ngModel.then === 'function') {
                        $scope.ngModel.then(function (response) {
                            //Multi select can have 1 or several default selected options,use each to initialize the select
                            //Single select has 1 default selected option, no iteration is needed to initialize the select
                            var selectedItems = $attr.multiple ? response.data : new Array(response.data);
                            populatePreselectedOptions(select, selectedItems, options.value);
                        });
                    }
                    else {
                        if (!_.isArray($scope.ngModel) && !_.isObject($scope.ngModel)) return;
                        var selectedItems = _.isArray($scope.ngModel) ? $scope.ngModel : new Array($scope.ngModel);
                        populatePreselectedOptions(select, selectedItems, options.value);
                    }
                }

                function registerSearchInputEvents() {
                    $('.select2-input').bind(events, function (event) {
                        var minimumInputLength = (options.minimumInputLength) ? options.minimumInputLength : 3;
                        if (event.currentTarget.value.length >= minimumInputLength) {
                            $scope.$emit('select.search-input', event.currentTarget.value);
                        }
                    });
                }

            }
        };

        function populatePreselectedOptions(scSelect, selectedItems, key) {
            //throw "Data-value for " + scSelect[0].id +" must have the same value as its track by.";
            var selectedOptions = [];
            _.each(selectedItems, function (selectedItem) {
                var selectedId = selectedItem[key];
                var selectedOption = _.find(scSelect[0], function (option) {
                    return selectedId == option.value;
                });
                if(!selectedOption) {
                    console.error("Data-value for " + scSelect[0].id +" must have the same value as its track by.");
                    return;
                }
                selectedOptions.push({id: selectedId, text: selectedOption.label});

            });
            if (selectedItems.length == 1) selectedOptions = selectedOptions.pop();
            scSelect.select2('data', selectedOptions);
        }

        function startsWith(str, target) {
            return str.indexOf(target) === 0;
        }
    }

})();
