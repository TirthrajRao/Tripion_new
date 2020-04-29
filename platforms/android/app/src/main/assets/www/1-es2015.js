(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[1],{

/***/ "./node_modules/@ionic-super-tabs/core/dist/esm/super-tab-indicator.entry.js":
/*!***********************************************************************************!*\
  !*** ./node_modules/@ionic-super-tabs/core/dist/esm/super-tab-indicator.entry.js ***!
  \***********************************************************************************/
/*! exports provided: super_tab_indicator */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "super_tab_indicator", function() { return SuperTabIndicatorComponent; });
/* harmony import */ var _core_4ed83284_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./core-4ed83284.js */ "./node_modules/@ionic-super-tabs/core/dist/esm/core-4ed83284.js");


const SuperTabIndicatorComponent = class {
    constructor(hostRef) {
        Object(_core_4ed83284_js__WEBPACK_IMPORTED_MODULE_0__["r"])(this, hostRef);
        /**
         * Toolbar position
         * This determines the position of the indicator
         */
        this.toolbarPosition = 'top';
    }
    render() {
        const style = {};
        if (this.toolbarPosition === 'bottom') {
            style.top = 0;
        }
        else {
            style.bottom = 0;
        }
        return (Object(_core_4ed83284_js__WEBPACK_IMPORTED_MODULE_0__["h"])(_core_4ed83284_js__WEBPACK_IMPORTED_MODULE_0__["H"], { style: style }));
    }
    static get style() { return ":host{display:block;height:var(--st-indicator-height,2px);width:100px;background:var(--st-indicator-color,var(--ion-color-contrast,#fff));position:absolute;pointer-events:none;-ms-touch-action:none;touch-action:none;left:0;-webkit-transform-origin:0;transform-origin:0;-webkit-transform:translate3d(var(--st-indicator-position-x,0),0,0) scaleX(var(--st-indicator-scale-x,0));transform:translate3d(var(--st-indicator-position-x,0),0,0) scaleX(var(--st-indicator-scale-x,0));-webkit-transition:-webkit-transform var(--st-indicator-transition-duration,.3s) cubic-bezier(.4,0,.2,1);transition:-webkit-transform var(--st-indicator-transition-duration,.3s) cubic-bezier(.4,0,.2,1);transition:transform var(--st-indicator-transition-duration,.3s) cubic-bezier(.4,0,.2,1);transition:transform var(--st-indicator-transition-duration,.3s) cubic-bezier(.4,0,.2,1),-webkit-transform var(--st-indicator-transition-duration,.3s) cubic-bezier(.4,0,.2,1);will-change:transform;-webkit-box-sizing:border-box;box-sizing:border-box;-ms-flex-order:-1;order:-1;-webkit-user-select:none;-webkit-touch-callout:none;-webkit-text-size-adjust:none;-webkit-tap-highlight-color:rgba(0,0,0,0);-webkit-font-smoothing:antialiased}"; }
};




/***/ })

}]);
//# sourceMappingURL=1-es2015.js.map