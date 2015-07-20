describe('scania-angular-ui-tpls directive', function () {

    'use strict';

    var $scope, $compile, $modal, modalInstance, flow, deleteSpy;

    beforeEach(module('ui.bootstrap.transition'));
    beforeEach(module('ui.bootstrap'));
    beforeEach(module('scania.angular.ui.tpls'));

    beforeEach(inject(function (_$rootScope_, _$compile_, $controller, _$modal_) {
        $scope = _$rootScope_.$new();
        $compile = _$compile_;
        $modal = _$modal_;
        modalInstance = {
            result: {
                then: function (confirmCallback, cancelCallback) {
                    this.confirmCallBack = confirmCallback;
                    this.cancelCallback = cancelCallback;
                    return this;
                },
                catch: function (cancelCallback) {
                    this.cancelCallback = cancelCallback;
                    return this;
                },
                finally: function (finallyCallback) {
                    this.finallyCallback = finallyCallback;
                    return this;
                }
            },
            close: function (item) {
                this.result.confirmCallBack(item);
            },
            dismiss: function (item) {
                this.result.cancelCallback(item);
            },
            finally: function () {
                this.result.finallyCallback();
            }
        };

        spyOn($modal, 'open').and.returnValue(modalInstance);
        flow = {files:[{image:'image1'},{image:'image2'}]};
    }));

    it('should attache a scania-angular-upload element', function () {
        var template = '<sc-lightbox size="lg" windowclass="modal-class" animation="true" interval="0"></sc-lightbox>';
        var element = $compile(template)($scope);
        element.scope().$apply();

        expect(element.html()).toContain('sc-angular-upload');
    });


    it('should open the modal instance with the first image', function () {
        var template = '<sc-lightbox size="lg" windowclass="modal-class" animation="true" interval="0"></sc-lightbox>';
        var element = $compile(template)($scope);
        element.scope().$apply();

        var lightbox = element.controller('scLightbox');
        lightbox.flow = flow;

        spyOn(lightbox, 'open').and.callThrough();

        lightbox.open(1);
        expect($modal.open).toHaveBeenCalled();
        expect(lightbox.activeImage.active).toBe(true);
    });

    it('should open the modal instance with the first image then close it', function () {
        var template = '<sc-lightbox size="lg" windowclass="modal-class" animation="true" interval="0"></sc-lightbox>';
        var element = $compile(template)($scope);
        element.scope().$apply();

        var lightbox = element.controller('scLightbox');
        lightbox.flow = flow;

        lightbox.open(1);
        lightbox.modalInstance.result.then(function (selectedItem) {
            $scope.selected = selectedItem;
        }, function () {
            $scope.canceled = true;
            console.log('Modal dismissed at: ' + new Date());
        });

        lightbox.modalInstance.dismiss('cancel');

        expect($scope.canceled).toBe(true);

    });

    it('should open the modal instance with the first image then delete the active slide', function () {
        var template = '<sc-lightbox size="lg" windowclass="modal-class" animation="true" interval="0"></sc-lightbox>';
        var element = $compile(template)($scope);
        element.scope().$apply();

        var lightbox = element.controller('scLightbox');
        lightbox.flow = flow;

        lightbox.open(1);

        spyOn(lightbox, 'deleteImage').and.callFake(function(){
            return lightbox.flow.files.shift();
        }, lightbox);

        lightbox.deleteImage();

        expect(lightbox.activeImage.image).toBe('image2');

    });
});
