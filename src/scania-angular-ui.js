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

    angular.module('scania.angular.ui').service('device', ['$rootScope', '$window', device]);

    /**
     * @ngdoc module
     * @name scania.angular.lightbox
     *
     * @description
     * Scania lightbox module
     */
    angular.module('scania.angular.lightbox', ['flow', 'ui.bootstrap']).directive('scLightbox', ['$scmodal', '$timeout', '$q', '$window', scLightbox]);
    /**
     /**
     * @ngdoc directive
     * @name scLightbox
     * @module scania.angular.lightbox
     *
     * @description file upload and gallery extension on angularJs framework
     * @param $scmodal a custom $modal service to avoid conflict angularStrap and ui-bootstrap.
     * @returns {{restrict: string, templateUrl: string, controllerAs: string, controller: Function}}
     */

    function scLightbox($scmodal, $timeout, $q, $window) {

        return {
            restrict: 'AEC',
            template: '<ng-include src="getTemplateUrl()" />',
            controllerAs: 'lightbox',
            scope: {
                ngModel: '='
            },
            controller: function ($scope, $attrs, flowFactory) {
                var self = this;
                self.files = []

                $timeout(function () {
                    $scope.$watch('ngModel', function () {
                        if (!$scope.ngModel) return;
                        self.defaultImageSrcs = $scope.ngModel;
                        $scope.flowObj = flowFactory.create();
                        _.each($scope.ngModel, function (imgSrc) {
                            convertToBlob(imgSrc).then(function (file) {
                                file.src = imgSrc;
                                $scope.flowObj.addFile(file);
                            });
                        });
                    });
                });

                self.interval = $attrs.interval;
                self.open = function (index) {
                    $scope.slides = ($scope.flowObj) ? $scope.flowObj.files : self.flow.files;
                    $scope.slides[index].active = true;
                    if (!$scope.ngModel) {
                        _.each($scope.slides, function (slide) {
                            slide.file.src = $window.URL.createObjectURL(slide.file);
                        });
                    }

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
                        }
                    });
                };
                self.deleteImage = function () {
                    $scope.slides.splice(_.findIndex($scope.slides, function (slide) {
                        if (slide.active) {
                            var nextSlide = $scope.slides[$scope.slides.indexOf(slide) + 1] ? $scope.slides[$scope.slides.indexOf(slide) + 1] : $scope.slides[0];
                            if (nextSlide) nextSlide.active = true;
                            slide.active = false;

                            return true;
                        }
                        ;
                    }), 1);
                    if ($scope.slides.length === 0) {
                        self.modalInstance.dismiss('cancel');
                    }

                };
                self.close = function () {
                    self.modalInstance.dismiss('cancel');
                }

                function convertToBlob(url) {
                    var deferred = $q.defer(), img = new Image();
                    img.crossOrigin = '';
                    img.onload = function () {
                        var canvas = document.createElement('CANVAS');
                        var ctx = canvas.getContext('2d');
                        var dataURL;
                        canvas.height = this.height;
                        canvas.width = this.width;
                        ctx.drawImage(this, 0, 0);
                        dataURL = canvas.toDataURL('image/png');
                        var byteString = dataURL.split(',')[1];
                        var mimeString = dataURL.split(',')[0].split(':')[1].split(';')[0];

                        var byteBuffer = new ArrayBuffer(byteString.length);
                        var ia = new Uint8Array(byteBuffer);
                        for (var i = 0; i < byteString.length; i++) {
                            ia[i] = byteString.charCodeAt(i);
                        }

                        var file = new File([byteBuffer], 'image-' + Math.floor((Math.random() * 1000) + 1) + '.' + mimeString.split('/')[1], {
                            type: mimeString,
                            lastModified: new Date()
                        });
                        deferred.resolve(file);
                        canvas = null;
                    };
                    img.src = url;
                    return deferred.promise;
                }

                $scope.getTemplateUrl = function () {
                    return ($scope.ngModel) ? 'template/scania-angular-preview.html' : 'template/scania-angular-upload.html';
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
    angular.module('scania.angular.select2', []);
    /**
     * @ngdoc directive
     * @name scSingleSelect
     * @module scania.angular.select2
     *
     * @description AngularJS directive for single select
     * @param $compile
     * @param $timeout
     * @returns {{restrict: string, scope: {ngModel: string, templateSelection: Function, templateResult: Function, matcher: Function, createSearchChoice: Function}, link: Function}}
     */
    angular.module('scania.angular.select2').directive('scSingleSelect', ['$compile', '$timeout', scSingleSelect]);
    /**
     * @ngdoc directive
     * @name scMultiSelect
     * @module scania.angular.select2
     *
     * @description AngularJS directive for multi select
     * @param $compile
     * @param $timeout
     * @returns {{restrict: string, scope: {ngModel: string, templateSelection: Function, templateResult: Function, matcher: Function, createSearchChoice: Function}, link: Function}}
     */
    angular.module('scania.angular.select2').directive('scMultiSelect', ['$compile', '$timeout', scMultiSelect]);
    /**
     * @ngdoc directive
     * @name scInputSelect
     * @module scania.angular.select2
     *
     * @description AngularJS directive for input select tokenizer
     * @param $compile
     * @param $timeout
     * @returns {{restrict: string, scope: {ngModel: string, templateSelection: Function, templateResult: Function, matcher: Function, createSearchChoice: Function, tokenSeparators: Function}, link: Function}}
     */
    angular.module('scania.angular.select2').directive('scInputSelect', ['$compile', '$timeout', scInputSelect]);
    /**
     * @ngdoc method
     * @name scania.angular.select2#init
     * @methodOf scania.angular.select2
     *
     * @description
     * Initialize a select component
     *
     */
    function init($scope, element, $attr, $compile) {
        if ($attr.language) {
            var domElem = '<script src="/bower_components/select2/select2_locale_' + $attr.language + '.js" async defer></script>';
            $(element).append($compile(domElem)($scope));
        }
        var options = _.pickBy($(element).data(), function (value, key) {
                return !startsWith(key, '$');
            }),
            minimumResultsForSearch = 10,
            defaultWidth = '100%',
            events = 'input keyup';

        options.formatSelection = $scope.templateSelection || $.fn.select2.defaults.formatSelection;
        options.formatResult = $scope.templateResult || $.fn.select2.defaults.formatResult;
        options.matcher = $scope.matcher || $.fn.select2.defaults.matcher;
        options.minimumResultsForSearch = (options.minimumResultsForSearch > 10) ? options.minimumResultsForSearch : minimumResultsForSearch;
        if ($(element).innerWidth() < 49 || !_.includes($(element).attr('style'), 'width')) {
            $(element).attr('style', 'width: ' + defaultWidth);
        }
        $('.select2-input').bind(events, function (event) {
            var minimumInputLength = (options.minimumInputLength) ? options.minimumInputLength : 3;
            if (event.currentTarget.value.length >= minimumInputLength) {
                $scope.$emit('select.search-input', event.currentTarget.value);
            }
        });
        return options;
    }

    /**
     * @ngdoc method
     * @name scania.angular.select2#updateSelectedItemsOnDisplay
     * @methodOf scania.angular.select2
     *
     * @description
     * Updates selected items
     *
     */
    function updateSelectedItemsOnDisplay($scope, select, options, inputOptionsLabelProperty, input) {
        if (!$scope.ngModel) {
            select.select2("val", "");
            return;
        }

        //True for both single and multiselect
        if ($scope.ngModel.then && typeof $scope.ngModel.then === 'function') {
            $scope.ngModel.then(function (response) {
                //Multi select can have 1 or several default selected options,use each to initialize the select
                //Single select has 1 default selected option, no iteration is needed to initialize the select
                var selectedItems = $attr.multiple ? response.data : new Array(response.data);
                if (input) {
                    populatePreselectedInputOptions(select, selectedItems, options.id, inputOptionsLabelProperty);
                } else {
                    populatePreselectedOptions(select, selectedItems, options.value);
                }
            });
        }
        else {
            if (!_.isArray($scope.ngModel) && !_.isObject($scope.ngModel)) return;
            var selectedItems = _.isArray($scope.ngModel) ? $scope.ngModel : new Array($scope.ngModel);
            if (input) {
                populatePreselectedInputOptions(select, selectedItems, options.id, inputOptionsLabelProperty);
            } else {
                populatePreselectedOptions(select, selectedItems, options.value);
            }
        }
    }
    /**
     * @ngdoc method
     * @name scania.angular.select2#populatePreselectedOptions
     * @methodOf scania.angular.select2
     *
     * @description
     * Prepopulate the select component
     *
     */
    function populatePreselectedOptions(scSelect, selectedItems, key) {
        //throw "Data-value for " + scSelect[0].id +" must have the same value as its track by.";
        var selectedOptions = [];
        _.each(selectedItems, function (selectedItem) {
            var selectedId = selectedItem[key];
            var selectedOption = _.find(scSelect[0], function (option) {
                return selectedId == option.value;
            });
            if (!selectedOption) {
                console.error("Data-value for " + scSelect[0] + " must have the same value as its track by.");
                return;
            }
            selectedOptions.push({id: selectedId, text: selectedOption.label});

        });
        if (selectedItems.length == 1) selectedOptions = selectedOptions.pop();
        scSelect.select2('data', selectedOptions);
    }
    /**
     * @ngdoc method
     * @name scania.angular.select2#populatePreselectedInputOptions
     * @methodOf scania.angular.select2
     *
     * @description
     * Prepopulate the input component
     *
     */
    function populatePreselectedInputOptions(scSelect, selectedItems, key, inputOptionsLabelProperty) {
        var selectedOptions = [];
        _.each(selectedItems, function (selectedItem) {
            var option = {};
            option[key] = selectedItem[key];
            option[inputOptionsLabelProperty] = selectedItem[inputOptionsLabelProperty];
            selectedOptions.push(option);
        });
        if (selectedItems.length == 1) selectedOptions = selectedOptions.pop();
        scSelect.select2('data', selectedOptions);
    }
    /**
     * @ngdoc method
     * @name scania.angular.select2#createSelect
     * @methodOf scania.angular.select2
     *
     * @description
     * Creates the select component
     *
     */
    function createSelect($scope, element, $attr, $compile, $timeout) {
        var options = init($scope, element, $attr, $compile),
            select = {},
            scSelect;

        $timeout(function () {
            select = $('select[id="' + $attr.id + '"]');
            scSelect = select.select2(options);

            updateSelectedItemsOnDisplay($scope, select, options);
            $scope.watchFunction = _.isArray($scope.ngModel) ? $scope.$watchCollection : $scope.$watch;
            $scope.watchFunction('ngModel', function () {
                updateSelectedItemsOnDisplay($scope, select, options);
            });
            $($(select)[0].previousSibling).find('div.select2-search').prepend('<i class="scania-icon-search sm"></i>');
            registerEvents($scope, scSelect, options);
        });
    }
    /**
     * @ngdoc method
     * @name scania.angular.select2#registerEvents
     * @methodOf scania.angular.select2
     *
     * @description
     * Register select2 events
     *
     */
    function registerEvents($scope, scSelect, options) {

        scSelect.on('select2-closing', function(event) {
            if(angular.isDefined(options.preventClose)) {
                event.preventDefault();
            }
            $scope.$emit('select.closing', event);
        });
        scSelect.on('select2-close', function(event) {
            $scope.$emit('select.close', event);
        });
        scSelect.on('select2-opening', function(event) {
            if(angular.isDefined(options.preventOpen)) {
                event.preventDefault();
            }
            $scope.$emit('select.opening', event);
        });
        scSelect.on('select2-open', function(event) {
            $scope.$emit('select.open', event);
        });
        scSelect.on('select2-selecting', function(event) {
            if(angular.isDefined(options.preventSelect)) {
                event.preventDefault();
            }
            $scope.$emit('select.selecting', event);
        });
        scSelect.on('select2-selected', function(event) {
            $scope.$emit('select.selected', event);
        });
        scSelect.on('select2-unselecting', function(event) {
            if(angular.isDefined(options.preventUnselect)) {
                event.preventDefault();
            }
            $scope.$emit('select.unselecting', event);
        });
        scSelect.on('select2-unselect', function(event) {
            $scope.$emit('select.unselect', event);
        });
        scSelect.on('select2-clearing', function(event) {
            $scope.$emit('select.clearing', event);
        });
        scSelect.on('select2-removing', function(event) {
            $scope.$emit('select.removing', event);
        });
        scSelect.on('select2-focus select2-blur', function(event) {
            $scope.$emit('select.focus', event);
        });
        scSelect.on('change', function(event) {
            $scope.$emit('select.change', event);
        });
    }
    /**
     * @ngdoc method
     * @name scania.angular.select2#startsWith
     * @methodOf scania.angular.select2
     *
     * @description
     * Check the leading character in a string agains a predicate
     *
     */
    function startsWith(str, target) {
        return str.indexOf(target) === 0;
    }

    /**
     * @ngdoc method
     * @name scania.angular.select2#scSingleSelect
     * @module scania.angular.select2
     *
     * @description AngularJS directive for single select
     * @param $compile
     * @param $timeout
     * @returns {{restrict: string, scope: {ngModel: string, templateSelection: Function, templateResult: Function, matcher: Function, createSearchChoice: Function}, link: Function}}
     */
    function scSingleSelect($compile, $timeout) {
        return {
            restrict: 'A',
            scope: {
                ngModel: '=',
                templateSelection: '=',
                templateResult: '=',
                matcher: '=',
                createSearchChoice: '='
            },
            link: function ($scope, element, $attr) {
                createSelect($scope, element, $attr, $compile, $timeout);
            }
        };

    }
    /**
     * @ngdoc method
     * @name scania.angular.select2#scMultiSelect
     * @module scania.angular.select2
     *
     * @description AngularJS directive for multi select
     * @param $compile
     * @param $timeout
     * @returns {{restrict: string, scope: {ngModel: string, templateSelection: Function, templateResult: Function, matcher: Function, createSearchChoice: Function}, link: Function}}
     */
    function scMultiSelect($compile, $timeout) {
        return {
            restrict: 'A',
            scope: {
                ngModel: '=',
                templateSelection: '=',
                templateResult: '=',
                matcher: '=',
                createSearchChoice: '='
            },
            link: function ($scope, element, $attr) {
                createSelect($scope, element, $attr, $compile, $timeout);
            }
        };
    }
    /**
     * @ngdoc method
     * @name scania.angular.select2#scInputSelect
     * @module scania.angular.select2
     *
     * @description AngularJS directive for input select
     * @param $compile
     * @param $timeout
     * @returns {{restrict: string, scope: {ngModel: string, templateSelection: Function, templateResult: Function, matcher: Function, createSearchChoice: Function, tokenSeparators: Function}, link: Function}}
     */
    function scInputSelect($compile, $timeout) {
        return {
            restrict: 'A',
            scope: {
                ngModel: '=',
                templateSelection: '=',
                templateResult: '=',
                matcher: '=',
                createSearchChoice: '=',
                tokenSeparators: '='
            },
            link: function ($scope, element, $attr) {
                var options = init($scope, element, $attr, $compile),
                    select = {},
                    tokenSeparators = [",", " "],
                    inputOptionsLabelProperty = '';

                $timeout(function () {
                    options.data = {results: JSON.parse($attr.data), text: $attr.label};
                    options.createSearchChoice = $scope.createSearchChoice;
                    options.tokenSeparators = $scope.tokenSeparators || tokenSeparators;
                    options.id = $attr.itemId;
                    inputOptionsLabelProperty = options.label;

                    select = $('input[id="' + $attr.id + '"]');
                    select.select2(options);

                    $($(select)[0].previousSibling).find('div.select2-search').prepend('<i class="scania-icon-search sm"></i>');

                    updateSelectedItemsOnDisplay($scope, select, options, inputOptionsLabelProperty, 'input');
                    $scope.$watch('ngModel', function () {
                        updateSelectedItemsOnDisplay($scope, select, options, inputOptionsLabelProperty, 'input');
                    });
                });
            }
        };
    }

    /**
     * @ngdoc service
     * @name device
     * @module scania.bootstrap.ui
     *
     * @description
     * Provide a service for detector if the device is a mobile or desktop
     *
     * @returns {{service: Object}}
     *
     */

    function device($rootScope, $window) {

        $rootScope.$watch(function () {
            return $window.innerWidth;
        }, function () {
            _emitDetectedDevice();
        });

        var _events = {
            device: 'device.detected',
            largedevice: 'large.device.detected',
            phone: 'phone.detected',
            portraittablet: 'portrait.tablet.detected',
            landscapetablet: 'landscape.tablet.detected',
            desktop: 'desktop.detected',
            smdevice: 'sm.device.detected'
        }
        var service = {
            isDevice: _isDevice,
            isLargeDevice: _isLargeDevice,
            isMediumDevice: _isSMDevice,
            events: _events
        }

        return service;

        function _isDevice() {
            return _isSmallPhone() || _isMediumDevice() || _isPortraitTablet();
        }

        function _isLargeDevice() {
            return _isLandscapeTablet() || _isDesktop() || _isLargeDesktop();
        }

        function _isSMDevice() {
            return _isMediumDevice() || _isPortraitTablet();
        }

        function _emitDetectedDevice() {
            //4 break points including phones (portrait and landscape), tablets (portrait or landscape), laptops and desktop
            $rootScope.$emit(_events.phone, _isSmallPhone() || _isMediumDevice());
            $rootScope.$emit(_events.portraittablet, _isPortraitTablet());
            $rootScope.$emit(_events.landscapetablet, _isLandscapeTablet());
            $rootScope.$emit(_events.desktop, _isDesktop() || _isLargeDesktop());

            //1 break point between mobile/tablet and desktop
            $rootScope.$emit(_events.device, _isDevice());
            $rootScope.$emit(_events.largedevice, _isLargeDevice());
            $rootScope.$emit(_events.smdevice, _isSMDevice());
        }

        function _isSmallPhone() {
            return window.matchMedia("only screen and (max-width: 480px)").matches;
        }

        //Landscape phone and portrait small tablets
        function _isMediumDevice() {
            return window.matchMedia("only screen and (min-width: 481px) and (max-width: 767px)").matches;
        }

        function _isPortraitTablet() {
            return window.matchMedia("only screen and (min-width: 768px) and (max-width: 1024px) and (orientation: portrait)").matches;
        }

        function _isLandscapeTablet() {
            return window.matchMedia("only screen and (min-width: 768px) and (max-width: 1024px) and (orientation: landscape)").matches;
        }

        function _isDesktop() {
            return window.matchMedia("only screen and (min-width: 1024px) and (max-width: 1199px)").matches;
        }

        function _isLargeDesktop() {
            return window.matchMedia("only screen and (min-width: 1200px)").matches;
        }
    }
})();