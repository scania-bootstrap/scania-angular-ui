/**
 * scania-angular-ui-tpls
 * https://github.com/scania-bootstrap/scania-angular-ui
 * License: MIT
 *
 *
 */

(function () {
    'use strict';

    angular.module('scania.angular.ui.tpls', ['scania.angular.lightbox.tpls', 'scania.angular.select2']);

    /**
     * @ngdoc module
     * @name scania.angular.lightbox.tpls
     *
     * @description
     * Scania lightbox module including templates
     */
    angular.module('scania.angular.lightbox.tpls', ['flow', 'template/scania-angular-upload.html', 'template/scania-angular-lightbox.html']).directive('scLightbox', ['$animate', '$modal', scLightbox]);
    /**
     * @ngdoc directive
     * @name scLightbox
     * @module scania.angular.lightbox
     *
     * @description file upload and gallery extension on angularJs framework including templates
     * @param $animate
     * @param $modal
     * @returns {{restrict: string, templateUrl: string, controllerAs: string, controller: Function}}
     */

    function scLightbox($animate, $modal) {
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
    }

    angular.module("template/scania-angular-upload.html", []).run(["$templateCache", function ($templateCache) {
        $templateCache.put("template/scania-angular-upload.html",
            "<div flow-init=\"\" flow-name=\"lightbox.flow\" class=\"sc-angular-upload\" flow-file-added=\"!!{png:1,gif:1,jpg:1,jpeg:1}[$file.getExtension()]\" class=\"row ng-scope\">\n" +
            "  <div class=\"btn btn-default icon-upload-alt\" flow-btn=\"\">\n" +
            "       <input type=\"file\" multiple=\"multiple\" style=\"visibility: hidden; position: absolute;\">\n" +
            "  </div>\n" +
            "  <div class=\"form-group\">\n" +
            "       <div ng-repeat=\"file in $flow.files\" class=\"gallery-box ng-scope image-with-delete-icon\">\n" +
            "	        <a ng-click=\"lightbox.open($index)\">\n" +
            "               <img class=\"thumbnail img-responsive\" flow-img=\"file\"/>\n" +
            "           </a>\n" +
            "       </div>\n" +
            "  </div>\n" +
            "</div>\n" +
            "");
    }]);
    angular.module("template/scania-angular-lightbox.html", []).run(["$templateCache", function ($templateCache) {
        $templateCache.put("template/scania-angular-lightbox.html",
            "<div flow-init=\"\" class=\"lightbox\">\n" +
            "   <div class=\"modal-header\">\n" +
            "       <div class=\"pull-right\">\n" +
            "           <a ng-click=\"lightbox.deleteImage()\"><i class=\"text-muted icon-trash icon-2x type--padding-right\"></i></a>\n" +
            "           <a ng-click=\"lightbox.modalInstance.dismiss('cancel')\"><i class=\"text-muted icon-remove-sign icon-2x\"></i></a>\n" +
            "       </div>\n" +
            "   </div>\n" +
            "   <div class=\"modal-body\">\n" +
            "       <carousel interval=\"lightbox.interval\">\n" +
            "           <slide ng-repeat=\"slide in slides\" active=\"slide.active\">\n" +
            "                <img class=\"img-responsive\" ng-attr-flow-img=\"slide\" ng-bind=\"setAsActive(slide)\"/>\n" +
            "           </slide>\n" +
            "       </carousel>\n" +
            "    </div>\n" +
            " </div>\n" +
            "");
    }]);

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
                            if (selectedItems.then && typeof selectedItems.then === 'function') {
                                selectedItems.then(function (response) {
                                    multiselect.val(_.pluck(response.data, options.value)).trigger('change');
                                });
                            }
                            if (_.isArray(selectedItems)) {
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
                            if (selectedItem.then && typeof selectedItem.then === 'function') {
                                selectedItem.then(function (response) {
                                    select.val(response.data[options.value]).trigger('change');
                                });
                            }
                            if (_.isObject(selectedItem)) {
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
    }
})();
