/**
 * scania-angular-ui
 * https://github.com/scania-bootstrap/scania-angular-ui
 * License: MIT
 *
 *
 */

(function () {
    'use strict';

    angular.module('scania.angular.ui', ['scania.angular.lightbox']);

    /**
     * @ngdoc module
     * @name scania.angular.lightbox
     *
     * @description
     * Scania lightbox module
     */
    angular.module('scania.angular.lightbox', [])
    /**
     * @ngdoc directive
     * @name scLightbox
     * @module scania.angular.lightbox
     *
     * @description file upload and gallery extension on angularJs framework
     */

        .directive('scLightbox', ['$animate','$modal', function($animate, $modal){

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

                    self.modalInstance = $modal.open({
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
    }]);

    /**
     * @ngdoc module
     * @name scania.angular.select2
     *
     * @description
     * Scania select2 directive module
     */
    angular.module('scania.angular.select2', [])
    /**
     * @ngdoc directive
     * @name scLightbox
     * @module scania.angular.select2
     *
     * @description AngularJS directive for Select2
     */

        .directive('scSelect2', ['$compile','$timeout', function($compile, $timeout){

            return {
                restrict: 'A',
                scope: {
                    ngModel: '=',
                    templateSelection: '=',
                    templateResult: '='
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

                    if ($attr.multiple) {
                        var multiselect = $('select.sc-multiselect[id="' + $attr.id + '"]');
                        multiselect.select2(options);
                        $timeout(function () {
                            var selectedItems = $scope.ngModel;
                            if (selectedItems) {
                                if(selectedItems.then && typeof selectedItems.then === 'function'){
                                    selectedItems.then(function (response) {
                                        multiselect.val(_.pluck(response.data, options.value)).trigger('change');
                                    });
                                }
                                if(_.isArray(selectedItems)){
                                    multiselect.val(_.pluck(selectedItems, options.value)).trigger('change');
                                }
                            }
                        });
                        options.placeholderOption = '';
                    } else {
                        var select = $('select.sc-select[id="' + $attr.id + '"]');
                        select.select2(options);
                        $timeout(function () {
                            var selectedItem = $scope.ngModel;
                            if (selectedItem) {
                                if(selectedItem.then && typeof selectedItem.then === 'function'){
                                    selectedItem.then(function (response) {
                                        select.val(response.data[options.value]).trigger('change');
                                    });
                                }
                                if(_.isObject(selectedItem)){
                                    select.val(selectedItem[options.value]).trigger('change');
                                }
                            }
                        });
                        options.placeholderOption = 'first';
                    }
                }
            };

            function startsWith(str, target) {
                return str.indexOf(target) === 0;
            }
        }]);
})();
