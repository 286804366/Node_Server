(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["group-foo"],{

/***/ "12f7":
/*!***********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules/.cache/vue-loader","cacheIdentifier":"106f9187-vue-loader-template"}!./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/views/main/Config.vue?vue&type=template&id=408a9ca0&scoped=true& ***!
  \***********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "render", function() { return render; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return staticRenderFns; });
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"config-main"},[_c('div',{staticClass:"main-top"},[_c('el-card',{staticClass:"box-card",attrs:{"body-style":{ color: '#eee' }}},[_c('div',{class:("card-header " + (_vm.mqttIsConnected ? 'is-connected' : '')),attrs:{"slot":"header"},slot:"header"},[_c('span',[_vm._v("MQTT服务器")])]),_c('div',{staticClass:"card-item"},[_c('div',{staticClass:"card-item-left"},[_c('ul',[_c('li',[_vm._v(" 复位云控制连接："),_c('el-button',{attrs:{"type":"primary","size":"mini","loading":_vm.loading.cloudControl},on:{"click":_vm.handleResetCloudControl}},[_c('i',{staticClass:"iconfont icon-fuwei1"})])],1),_c('li',[_vm._v(" 需同步的数据： "),_c('el-select',{staticClass:"sync-select",attrs:{"multiple":"","placeholder":"请选择同步的数据"},model:{value:(_vm.syncData),callback:function ($$v) {_vm.syncData=$$v},expression:"syncData"}},_vm._l((_vm.syncGroup),function(group){return _c('el-option-group',{key:group.label,attrs:{"label":group.label}},_vm._l((group.data),function(item){return _c('el-option',{key:item.label,attrs:{"label":item.label,"value":item.value}})}),1)}),1),_c('el-button',{staticStyle:{"margin-left":"10px"},attrs:{"type":"primary","size":"mini"},on:{"click":_vm.handleChangeSyncData}},[_vm._v("保存")])],1)])]),_c('div',{staticClass:"card-item-right"})])]),_c('el-card',{staticClass:"box-card"},[_c('div',{class:("card-header " + (_vm.controlIsConnected ? 'is-connected' : '')),attrs:{"slot":"header"},slot:"header"},[_c('span',[_vm._v("云控制服务器")])]),_c('div',{staticClass:"card-item"},[_c('div',{staticClass:"card-item-left"},[_c('ul',[_c('li',[_vm._v(" Bootloader操作："),_c('el-button',{attrs:{"type":"warning","size":"mini"},on:{"click":_vm.handleEntryBootloader}},[_vm._v("进入引导程序")]),_c('el-button',{attrs:{"type":"primary","size":"mini","loading":_vm.loading.entryApp},on:{"click":_vm.handleQuitBootloader}},[_vm._v("退出并进入应用程序")])],1),_c('li',[_vm._v(" 在线固件升级："),_c('el-upload',{ref:"upload",staticClass:"upload",attrs:{"action":"http://49.234.11.185/updatefirmware/","auto-upload":false,"multiple":false,"show-file-list":true,"limit":1,"on-success":_vm.handleUploadSuccess,"on-error":_vm.handleUploadError,"file-list":_vm.fileList,"http-request":_vm.uploadFile}},[_c('el-button',{attrs:{"slot":"trigger","size":"small","type":"primary"},slot:"trigger"},[_vm._v("选取固件")]),_c('el-button',{staticStyle:{"margin-left":"10px"},attrs:{"size":"small","type":"success","loading":_vm.loading.upload},on:{"click":_vm.submitUpload}},[_vm._v(_vm._s(_vm.loading.upload ? '更新中...' : '更新到设备'))])],1)],1)])]),_c('div',{staticClass:"card-item-right"})])])],1),_c('div',{staticClass:"main-bottom"},[_c('el-card',{staticClass:"box-card",attrs:{"body-style":{ color: '#eee' }}},[_c('div',{staticClass:"card-header",attrs:{"slot":"header"},slot:"header"},[_c('span',[_vm._v("默认配置")]),_c('el-button',{staticStyle:{"float":"right","padding":"3px 0"},attrs:{"type":"text"},on:{"click":_vm.handleChangeDefaultConfig}},[_vm._v("保存")])],1),_c('div',{staticClass:"config-body"},[_c('div',{staticClass:"camera-left"},[_c('ul',[_c('li',[_c('i',{staticClass:"iconfont icon-14"}),_vm._v("对比度："),_c('el-select',{class:'select-item ',attrs:{"placeholder":"请选择","popper-class":"option-list"},model:{value:(_vm.carState.camera_contrast),callback:function ($$v) {_vm.$set(_vm.carState, "camera_contrast", $$v)},expression:"carState.camera_contrast"}},_vm._l((_vm.selectList),function(item){return _c('el-option',{key:item,attrs:{"label":item + '级',"value":item}},[_vm._v(_vm._s(item)+" 级 ")])}),1)],1),_c('li',[_c('i',{staticClass:"iconfont icon-saturation"}),_vm._v("饱和度："),_c('el-select',{class:'select-item ',attrs:{"placeholder":"请选择","popper-class":"option-list"},model:{value:(_vm.carState.camera_saturation),callback:function ($$v) {_vm.$set(_vm.carState, "camera_saturation", $$v)},expression:"carState.camera_saturation"}},_vm._l((_vm.selectList),function(item){return _c('el-option',{key:item,attrs:{"label":item + '级',"value":item}},[_vm._v(_vm._s(item)+" 级 ")])}),1)],1),_c('li',[_c('i',{staticClass:"iconfont icon-heibaipingheng"}),_vm._v("白平衡："),_c('el-select',{class:'select-item ',attrs:{"placeholder":"请选择","popper-class":"option-list"},model:{value:(_vm.carState.camera_light_mode),callback:function ($$v) {_vm.$set(_vm.carState, "camera_light_mode", $$v)},expression:"carState.camera_light_mode"}},_vm._l((_vm.selectList),function(item){return _c('el-option',{key:item,attrs:{"label":item + '级',"value":item}},[_vm._v(_vm._s(item)+" 级 ")])}),1)],1),_c('li',[_c('i',{staticClass:"iconfont icon-football_name"}),_vm._v("模式："),_c('el-select',{class:'select-item ',attrs:{"placeholder":"请选择","popper-class":"option-list"},model:{value:(_vm.carState.camera_mode),callback:function ($$v) {_vm.$set(_vm.carState, "camera_mode", $$v)},expression:"carState.camera_mode"}},[_c('el-option',{attrs:{"label":"连续","value":0}})],1)],1),_c('li',[_c('i',{staticClass:"iconfont icon-geshi_tupianjpg"}),_vm._v("格式："),_c('el-select',{class:'select-item ',attrs:{"placeholder":"请选择","popper-class":"option-list"},model:{value:(_vm.carState.camera_workmode),callback:function ($$v) {_vm.$set(_vm.carState, "camera_workmode", $$v)},expression:"carState.camera_workmode"}},[_c('el-option',{attrs:{"label":"JPG","value":1}})],1)],1)])]),_c('div',{staticClass:"camera-right"},[_c('ul',[_c('li',[_c('i',{staticClass:"iconfont icon-brightj2"}),_vm._v("亮度："),_c('el-select',{class:'select-item ',attrs:{"placeholder":"请选择","popper-class":"option-list"},model:{value:(_vm.carState.camera_brightness),callback:function ($$v) {_vm.$set(_vm.carState, "camera_brightness", $$v)},expression:"carState.camera_brightness"}},_vm._l((_vm.selectList),function(item){return _c('el-option',{key:item,attrs:{"label":item + '级',"value":item}},[_vm._v(_vm._s(item)+" 级 ")])}),1)],1),_c('li',[_c('i',{staticClass:"iconfont icon-texiao"}),_vm._v("特效："),_c('el-select',{class:'select-item ',attrs:{"placeholder":"请选择","popper-class":"option-list"},model:{value:(_vm.carState.camera_effect),callback:function ($$v) {_vm.$set(_vm.carState, "camera_effect", $$v)},expression:"carState.camera_effect"}},_vm._l((_vm.camera_effectList),function(item,index){return _c('el-option',{key:index,attrs:{"label":item,"value":index}})}),1)],1),_c('li',[_c('i',{staticClass:"iconfont icon-puguang"}),_vm._v("曝光："),_c('el-select',{class:'select-item ',attrs:{"placeholder":"请选择","popper-class":"option-list"},model:{value:(_vm.carState.camera_autoexposure_level),callback:function ($$v) {_vm.$set(_vm.carState, "camera_autoexposure_level", $$v)},expression:"carState.camera_autoexposure_level"}},_vm._l((_vm.selectList),function(item){return _c('el-option',{key:item,attrs:{"label":item + '级',"value":item}},[_vm._v(_vm._s(item)+" 级 ")])}),1)],1),_c('li',[_c('i',{staticClass:"iconfont icon-tiaoxingma"}),_vm._v("彩条："),_c('el-select',{class:'select-item ',attrs:{"placeholder":"请选择","popper-class":"option-list"},model:{value:(_vm.carState.camera_color_bar),callback:function ($$v) {_vm.$set(_vm.carState, "camera_color_bar", $$v)},expression:"carState.camera_color_bar"}},[_c('el-option',{attrs:{"label":"关闭","value":0}}),_c('el-option',{attrs:{"label":"开启","value":1}})],1)],1),_c('li',[_c('i',{staticClass:"iconfont icon-quanping_huaban1"}),_vm._v("尺寸："),_c('el-select',{class:'select-item ',attrs:{"placeholder":"请选择","popper-class":"option-list"},model:{value:(_vm.carState.camera_size),callback:function ($$v) {_vm.$set(_vm.carState, "camera_size", $$v)},expression:"carState.camera_size"}},_vm._l((_vm.camera_size),function(item,index){return _c('el-option',{key:index,attrs:{"label":item,"value":index}})}),1)],1)])]),_c('div',{staticClass:"duoji-setting"},[_c('ul',[_c('li',[_c('i',{staticClass:"iconfont icon-duoji1"}),_vm._v("一维舵机角度： "),_c('el-slider',{staticClass:"duoji",attrs:{"min":-135,"max":135,"step":5,"show-tooltip":""},model:{value:(_vm.carState.cur_duoji_1_angle),callback:function ($$v) {_vm.$set(_vm.carState, "cur_duoji_1_angle", $$v)},expression:"carState.cur_duoji_1_angle"}})],1),_c('li',[_c('i',{staticClass:"iconfont icon-chuangyipingtai_duoji"}),_vm._v("二维舵机角度： "),_c('el-slider',{staticClass:"duoji",attrs:{"min":-45,"max":135,"step":5,"show-tooltip":""},model:{value:(_vm.carState.cur_duoji_2_angle),callback:function ($$v) {_vm.$set(_vm.carState, "cur_duoji_2_angle", $$v)},expression:"carState.cur_duoji_2_angle"}})],1),_c('li',[_c('i',{staticClass:"iconfont icon-xuanzhuan"}),_vm._v("设置旋转速度： "),_c('el-slider',{staticClass:"duoji",attrs:{"min":0,"max":200,"step":1,"show-tooltip":""},model:{value:(_vm.carState.set_dir_speed_whole),callback:function ($$v) {_vm.$set(_vm.carState, "set_dir_speed_whole", $$v)},expression:"carState.set_dir_speed_whole"}})],1),_c('li',[_c('i',{staticClass:"iconfont icon-shipin2"}),_vm._v("默认开启视频： "),_c('el-switch',{staticClass:"img-open",attrs:{"inactive-value":1,"active-value":0},model:{value:(_vm.carState.camera_is_abort),callback:function ($$v) {_vm.$set(_vm.carState, "camera_is_abort", $$v)},expression:"carState.camera_is_abort"}})],1)])])])]),_c('el-card',{staticClass:"box-card-mini"},[_c('div',{attrs:{"slot":"header"},slot:"header"},[_c('span',[_vm._v("设备管理")]),_c('el-button',{staticStyle:{"float":"right","padding":"3px 0"},attrs:{"type":"text"},on:{"click":_vm.handleAddDevice}},[_vm._v("添加设备")])],1),_c('div',{staticClass:"device-manage"},[_c('div',{staticClass:"device-manage-left"},[_vm._v(" 已有设备： "),_c('el-card',{staticClass:"device-manage-card"},[_c('ul',_vm._l((_vm.deviceList),function(car,index){return _c('li',{key:index},[_c('div',{staticClass:"car-name",on:{"click":function($event){return _vm.handleShowDevice(index)}}},[_vm._v(" "+_vm._s(car.name)+" ")]),_c('el-button',{staticStyle:{"flex":"1","padding":"3px 0"},attrs:{"type":"text"},on:{"click":function($event){return _vm.handleDeleteDevice(car.secret, index)}}},[_vm._v("删除")])],1)}),0)])],1),_c('div',{staticClass:"device-manage-right"},[_vm._v(" 设备详情： "),_c('el-button',{staticStyle:{"float":"right","padding":"5px"},attrs:{"size":"mini","type":"text"},on:{"click":function($event){return _vm.handleSaveDevice('edit')}}},[_vm._v("保存设备")]),_c('el-card',{staticClass:"device-manage-card"},[_c('div',[_c('ul',[_c('li',[_vm._v(" 设备名："),_c('el-input',{staticClass:"car-manage-input",attrs:{"size":"mini","placeholder":"请输入设备名"},model:{value:(_vm.curDevice.name),callback:function ($$v) {_vm.$set(_vm.curDevice, "name", $$v)},expression:"curDevice.name"}})],1),_c('li',[_vm._v(" 设备密钥："),_c('el-input',{staticClass:"car-manage-input",attrs:{"size":"mini","placeholder":"请输入设备密钥"},model:{value:(_vm.curDevice.secret),callback:function ($$v) {_vm.$set(_vm.curDevice, "secret", $$v)},expression:"curDevice.secret"}})],1)])])])],1)])])],1)])}
var staticRenderFns = []



/***/ }),

/***/ "34a0":
/*!******************************************************************************!*\
  !*** ./src/views/main/Config.vue?vue&type=template&id=408a9ca0&scoped=true& ***!
  \******************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_cache_loader_dist_cjs_js_cacheDirectory_node_modules_cache_vue_loader_cacheIdentifier_106f9187_vue_loader_template_node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_Config_vue_vue_type_template_id_408a9ca0_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules/.cache/vue-loader","cacheIdentifier":"106f9187-vue-loader-template"}!../../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../../node_modules/cache-loader/dist/cjs.js??ref--0-0!../../../node_modules/vue-loader/lib??vue-loader-options!./Config.vue?vue&type=template&id=408a9ca0&scoped=true& */ "12f7");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _node_modules_cache_loader_dist_cjs_js_cacheDirectory_node_modules_cache_vue_loader_cacheIdentifier_106f9187_vue_loader_template_node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_Config_vue_vue_type_template_id_408a9ca0_scoped_true___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _node_modules_cache_loader_dist_cjs_js_cacheDirectory_node_modules_cache_vue_loader_cacheIdentifier_106f9187_vue_loader_template_node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_Config_vue_vue_type_template_id_408a9ca0_scoped_true___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });



/***/ }),

/***/ "58de":
/*!************************************************************!*\
  !*** ./src/views/main/Config.vue?vue&type=script&lang=js& ***!
  \************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_cache_loader_dist_cjs_js_ref_12_0_node_modules_thread_loader_dist_cjs_js_node_modules_babel_loader_lib_index_js_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_Config_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../node_modules/cache-loader/dist/cjs.js??ref--12-0!../../../node_modules/thread-loader/dist/cjs.js!../../../node_modules/babel-loader/lib!../../../node_modules/cache-loader/dist/cjs.js??ref--0-0!../../../node_modules/vue-loader/lib??vue-loader-options!./Config.vue?vue&type=script&lang=js& */ "c1a5");
/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__["default"] = (_node_modules_cache_loader_dist_cjs_js_ref_12_0_node_modules_thread_loader_dist_cjs_js_node_modules_babel_loader_lib_index_js_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_Config_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "76ca":
/*!********************************************************************************************!*\
  !*** ./src/views/main/Config.vue?vue&type=style&index=0&id=408a9ca0&scoped=true&lang=css& ***!
  \********************************************************************************************/
/*! no static exports found */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_mini_css_extract_plugin_dist_loader_js_ref_6_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_6_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_2_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_Config_vue_vue_type_style_index_0_id_408a9ca0_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../node_modules/mini-css-extract-plugin/dist/loader.js??ref--6-oneOf-1-0!../../../node_modules/css-loader/dist/cjs.js??ref--6-oneOf-1-1!../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../node_modules/postcss-loader/src??ref--6-oneOf-1-2!../../../node_modules/cache-loader/dist/cjs.js??ref--0-0!../../../node_modules/vue-loader/lib??vue-loader-options!./Config.vue?vue&type=style&index=0&id=408a9ca0&scoped=true&lang=css& */ "a906");
/* harmony import */ var _node_modules_mini_css_extract_plugin_dist_loader_js_ref_6_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_6_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_2_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_Config_vue_vue_type_style_index_0_id_408a9ca0_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_mini_css_extract_plugin_dist_loader_js_ref_6_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_6_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_2_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_Config_vue_vue_type_style_index_0_id_408a9ca0_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _node_modules_mini_css_extract_plugin_dist_loader_js_ref_6_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_6_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_2_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_Config_vue_vue_type_style_index_0_id_408a9ca0_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_0__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _node_modules_mini_css_extract_plugin_dist_loader_js_ref_6_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_6_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_2_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_Config_vue_vue_type_style_index_0_id_408a9ca0_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));


/***/ }),

/***/ "8c43":
/*!***********************************!*\
  !*** ./src/views/main/Config.vue ***!
  \***********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _Config_vue_vue_type_template_id_408a9ca0_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Config.vue?vue&type=template&id=408a9ca0&scoped=true& */ "34a0");
/* harmony import */ var _Config_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Config.vue?vue&type=script&lang=js& */ "58de");
/* empty/unused harmony star reexport *//* harmony import */ var _Config_vue_vue_type_style_index_0_id_408a9ca0_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Config.vue?vue&type=style&index=0&id=408a9ca0&scoped=true&lang=css& */ "76ca");
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "2877");






/* normalize component */

var component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__["default"])(
  _Config_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _Config_vue_vue_type_template_id_408a9ca0_scoped_true___WEBPACK_IMPORTED_MODULE_0__["render"],
  _Config_vue_vue_type_template_id_408a9ca0_scoped_true___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  "408a9ca0",
  null
  
)

/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "a906":
/*!*********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/mini-css-extract-plugin/dist/loader.js??ref--6-oneOf-1-0!./node_modules/css-loader/dist/cjs.js??ref--6-oneOf-1-1!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src??ref--6-oneOf-1-2!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/views/main/Config.vue?vue&type=style&index=0&id=408a9ca0&scoped=true&lang=css& ***!
  \*********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "c1a5":
/*!********************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/cache-loader/dist/cjs.js??ref--12-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/views/main/Config.vue?vue&type=script&lang=js& ***!
  \********************************************************************************************************************************************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var C_Users_lc_git_internet_of_things_control_iotc_node_modules_babel_runtime_helpers_esm_asyncToGenerator__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./node_modules/@babel/runtime/helpers/esm/asyncToGenerator */ "1da1");
/* harmony import */ var core_js_modules_es_regexp_exec_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! core-js/modules/es.regexp.exec.js */ "ac1f");
/* harmony import */ var core_js_modules_es_regexp_exec_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_regexp_exec_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var core_js_modules_es_string_split_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! core-js/modules/es.string.split.js */ "1276");
/* harmony import */ var core_js_modules_es_string_split_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_string_split_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var core_js_modules_es_function_name_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! core-js/modules/es.function.name.js */ "b0c0");
/* harmony import */ var core_js_modules_es_function_name_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_function_name_js__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var core_js_modules_es_array_splice_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! core-js/modules/es.array.splice.js */ "a434");
/* harmony import */ var core_js_modules_es_array_splice_js__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_array_splice_js__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var regenerator_runtime_runtime_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! regenerator-runtime/runtime.js */ "96cf");
/* harmony import */ var regenerator_runtime_runtime_js__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(regenerator_runtime_runtime_js__WEBPACK_IMPORTED_MODULE_5__);






//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
/* harmony default export */ __webpack_exports__["default"] = ({
  data: function data() {
    return {
      camera_effectList: ['正常', '负片', '黑白', '偏红色', '偏绿色', '偏蓝色', '复古'],
      camera_size: ['160*120', //QQVGA
      '176*144', //QCIF
      '320*240', //QVGA
      '400*240', //WQVGA 3
      '352*288', //CIF
      '640*480', //VGA 5
      '800*600', //SVGA 6
      '1024*768', //XGA
      '1280*800', //WXGA
      '1280*960', //XVGA  9
      '1440*900', //WXGA+
      '1280*1024', //SXGA
      '1600*1200' //UXGA	12
      ],
      selectList: [0, 1, 2, 3, 4],
      mqttIsConnected: false,
      controlIsConnected: false,
      // 小车数据
      carState: {
        camera_is_abort: 1,
        // 舵机
        cur_duoji_1_angle: 0,
        cur_duoji_2_angle: 0,
        set_dir_speed_whole: 20,
        // 相机设置
        camera_mode: 0,
        // 模式
        camera_workmode: 1,
        // 格式
        camera_contrast: 2,
        // 对比度
        camera_saturation: 4,
        // 饱和度
        camera_effect: 0,
        // 特效
        camera_autoexposure_level: 0,
        // 曝光
        camera_light_mode: 4,
        // 白平衡
        camera_brightness: 3,
        // 亮度
        camera_color_bar: 0,
        // 彩条
        camera_size: 5 // 尺寸

      },
      fileList: [],
      loading: {
        entryApp: false,
        upload: false,
        cloudControl: false
      },
      // 同步的数据字段
      syncData: ['cur_speed_whole', 'cur_speed_lq', 'cur_speed_rq', 'cur_speed_lh', 'cur_speed_rh', 'cur_duoji_1_angle', 'cur_duoji_2_angle', 'camera_mode', 'camera_workmode', 'camera_contrast', 'camera_saturation', 'camera_effect', 'camera_autoexposure_level', 'camera_light_mode', 'camera_brightness', 'camera_color_bar', 'camera_size', 'camera_frame', 'camera_is_abort', 'history_speed', 'history_frame'],
      // 同步的字段分组
      syncGroup: [{
        label: '车速数据',
        data: [{
          value: 'cur_speed_whole',
          label: '整体车速'
        }, {
          value: 'cur_speed_lq',
          label: '左前轮车速'
        }, {
          value: 'cur_speed_rq',
          label: '右前轮车速'
        }, {
          value: 'cur_speed_lh',
          label: '左后轮车速'
        }, {
          value: 'cur_speed_rh',
          label: '右后轮车速'
        }]
      }, {
        label: '舵机数据',
        data: [{
          value: 'cur_duoji_1_angle',
          label: '一维舵机角度'
        }, {
          value: 'cur_duoji_2_angle',
          label: '二维舵机角度'
        }]
      }, {
        label: '摄像头数据',
        data: [{
          value: 'camera_mode',
          label: '模式'
        }, {
          value: 'camera_workmode',
          label: '格式'
        }, {
          value: 'camera_contrast',
          label: '对比度'
        }, {
          value: 'camera_saturation',
          label: '饱和度'
        }, {
          value: 'camera_effect',
          label: '特效'
        }, {
          value: 'camera_autoexposure_level',
          label: '曝光'
        }, {
          value: 'camera_light_mode',
          label: '白平衡'
        }, {
          value: 'camera_brightness',
          label: '亮度'
        }, {
          value: 'camera_color_bar',
          label: '彩条'
        }, {
          value: 'camera_size',
          label: '尺寸'
        }, {
          value: 'camera_frame',
          label: '帧率'
        }, {
          value: 'camera_is_abort',
          label: '视频状态'
        }]
      }, {
        label: '历史数据',
        data: [{
          value: 'history_speed',
          label: '小车车速'
        }, {
          value: 'history_frame',
          label: '视频帧率'
        }]
      }],
      deviceList: [],
      curDevice: {
        name: '',
        secret: ''
      }
    };
  },
  mounted: function mounted() {
    var _this = this;

    // 获取同步数据
    this.getSyncData(); // 获取默认配置

    this.getDefaultConfig(); // 获取设备列表

    this.getDeviceList();
    setInterval(function () {
      var state = sessionStorage.getItem('iotc_state');

      if (state) {
        state = JSON.parse(state);

        if (!_this.mqttIsConnected && state.mqttIsConnected) {
          _this.loading.upload = false;
          _this.loading.entryApp = false;
        }

        _this.mqttIsConnected = state.mqttIsConnected;
        _this.controlIsConnected = state.controlIsConnected;
      }
    }, 1000);
  },
  methods: {
    /* 处理 */
    // 处理响应通知
    showMessage: function showMessage(state, message) {
      var show = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

      switch (state) {
        case 0:
          // 成功
          show && this.$message.success(message);
          break;

        case -1:
          // 登录过期
          break;

        default:
          // 其他
          show && this.$message.warning(message);
          break;
      }
    },

    /* 请求 */
    // 通用请求
    commonRequest: function commonRequest(url) {
      var _arguments = arguments,
          _this2 = this;

      return Object(C_Users_lc_git_internet_of_things_control_iotc_node_modules_babel_runtime_helpers_esm_asyncToGenerator__WEBPACK_IMPORTED_MODULE_0__["default"])( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
        var show, data, method, user, secret, preData, res;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                show = _arguments.length > 1 && _arguments[1] !== undefined ? _arguments[1] : false;
                data = _arguments.length > 2 && _arguments[2] !== undefined ? _arguments[2] : {};
                method = _arguments.length > 3 && _arguments[3] !== undefined ? _arguments[3] : 'post';
                user = localStorage.getItem('iotc_user') || '';
                secret = localStorage.getItem('iotc_secret') || '';
                preData = {
                  user: user,
                  secret: secret
                };
                _context.prev = 6;
                _context.next = 9;
                return _this2.$http[method](url, Object.assign(preData, data));

              case 9:
                res = _context.sent;
                _context.next = 14;
                break;

              case 12:
                _context.prev = 12;
                _context.t0 = _context["catch"](6);

              case 14:
                _this2.showMessage(res.data.state, res.data.message, show);

                return _context.abrupt("return", res);

              case 16:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, null, [[6, 12]]);
      }))();
    },
    // 上传文件
    uploadFile: function uploadFile(req) {
      var _this3 = this;

      return Object(C_Users_lc_git_internet_of_things_control_iotc_node_modules_babel_runtime_helpers_esm_asyncToGenerator__WEBPACK_IMPORTED_MODULE_0__["default"])( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
        var forms, user, secret, configs, res;
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                forms = new FormData();
                user = localStorage.getItem('iotc_user') || '';
                secret = localStorage.getItem('iotc_secret') || '';
                configs = {
                  headers: {
                    'Content-Type': 'multipart/form-data'
                  }
                };
                forms.append('file', req.file);
                forms.append('user', user);
                forms.append('secret', secret);

                if (!_this3.mqttIsConnected) {
                  _context3.next = 13;
                  break;
                }

                _context3.next = 10;
                return _this3.commonRequest("/command/r-2", false, {
                  data: '1'
                });

              case 10:
                setTimeout( /*#__PURE__*/Object(C_Users_lc_git_internet_of_things_control_iotc_node_modules_babel_runtime_helpers_esm_asyncToGenerator__WEBPACK_IMPORTED_MODULE_0__["default"])( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
                  var res;
                  return regeneratorRuntime.wrap(function _callee2$(_context2) {
                    while (1) {
                      switch (_context2.prev = _context2.next) {
                        case 0:
                          _context2.next = 2;
                          return _this3.commonRequest("/command/r-3", false, {
                            data: '1'
                          });

                        case 2:
                          _context2.prev = 2;
                          _context2.next = 5;
                          return _this3.$http.post('/upload/firmware', forms, configs);

                        case 5:
                          res = _context2.sent;
                          _context2.next = 11;
                          break;

                        case 8:
                          _context2.prev = 8;
                          _context2.t0 = _context2["catch"](2);

                          _this3.$message.warning('上传失败');

                        case 11:
                        case "end":
                          return _context2.stop();
                      }
                    }
                  }, _callee2, null, [[2, 8]]);
                })), 18000);
                _context3.next = 24;
                break;

              case 13:
                _context3.next = 15;
                return _this3.commonRequest("/command/r-3", false, {
                  data: '1'
                });

              case 15:
                _context3.prev = 15;
                _context3.next = 18;
                return _this3.$http.post('/upload/firmware', forms, configs);

              case 18:
                res = _context3.sent;
                _context3.next = 24;
                break;

              case 21:
                _context3.prev = 21;
                _context3.t0 = _context3["catch"](15);

                _this3.$message.warning('上传失败');

              case 24:
                _this3.showMessage(res.data.state, res.data.message, true);

              case 25:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, null, [[15, 21]]);
      }))();
    },
    // 获取需同步的数据
    getSyncData: function getSyncData() {
      var _this4 = this;

      return Object(C_Users_lc_git_internet_of_things_control_iotc_node_modules_babel_runtime_helpers_esm_asyncToGenerator__WEBPACK_IMPORTED_MODULE_0__["default"])( /*#__PURE__*/regeneratorRuntime.mark(function _callee4() {
        var res;
        return regeneratorRuntime.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                _context4.next = 2;
                return _this4.commonRequest("/get/sync");

              case 2:
                res = _context4.sent;

                if (res.data.data) {
                  _this4.syncData = res.data.data.split(',') || [];
                }

              case 4:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4);
      }))();
    },
    // 获取默认配置
    getDefaultConfig: function getDefaultConfig() {
      var _this5 = this;

      return Object(C_Users_lc_git_internet_of_things_control_iotc_node_modules_babel_runtime_helpers_esm_asyncToGenerator__WEBPACK_IMPORTED_MODULE_0__["default"])( /*#__PURE__*/regeneratorRuntime.mark(function _callee5() {
        var res;
        return regeneratorRuntime.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                _context5.next = 2;
                return _this5.commonRequest("/get/default");

              case 2:
                res = _context5.sent;

                if (res.data.data) {
                  Object.assign(_this5.carState, JSON.parse(res.data.data) || {});
                }

              case 4:
              case "end":
                return _context5.stop();
            }
          }
        }, _callee5);
      }))();
    },
    // 设备管理
    deviceManage: function deviceManage(type, secret, name) {
      var _this6 = this;

      return Object(C_Users_lc_git_internet_of_things_control_iotc_node_modules_babel_runtime_helpers_esm_asyncToGenerator__WEBPACK_IMPORTED_MODULE_0__["default"])( /*#__PURE__*/regeneratorRuntime.mark(function _callee6() {
        var res;
        return regeneratorRuntime.wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                _context6.next = 2;
                return _this6.commonRequest("/manage/".concat(type), true, {
                  secret: secret,
                  name: name
                });

              case 2:
                res = _context6.sent;

                if (res.data.data) {
                  _this6.deviceList = JSON.parse(res.data.data) || [];
                }

              case 4:
              case "end":
                return _context6.stop();
            }
          }
        }, _callee6);
      }))();
    },
    // 获取设备列表
    getDeviceList: function getDeviceList() {
      var _this7 = this;

      return Object(C_Users_lc_git_internet_of_things_control_iotc_node_modules_babel_runtime_helpers_esm_asyncToGenerator__WEBPACK_IMPORTED_MODULE_0__["default"])( /*#__PURE__*/regeneratorRuntime.mark(function _callee7() {
        var res;
        return regeneratorRuntime.wrap(function _callee7$(_context7) {
          while (1) {
            switch (_context7.prev = _context7.next) {
              case 0:
                _context7.next = 2;
                return _this7.commonRequest("/public/deviceList");

              case 2:
                res = _context7.sent;

                if (res.data.data) {
                  // console.log(res.data)
                  _this7.deviceList = JSON.parse(res.data.data) || [];
                }

              case 4:
              case "end":
                return _context7.stop();
            }
          }
        }, _callee7);
      }))();
    },

    /* 事件 */
    // 展示设备详情
    handleShowDevice: function handleShowDevice(index) {
      this.curDevice.name = this.deviceList[index].name;
      this.curDevice.secret = this.deviceList[index].secret;
    },
    // 保存设备
    handleSaveDevice: function handleSaveDevice(type) {
      var dev = this.curDevice;

      if (dev.secret && dev.name) {
        this.deviceManage(type, dev.secret, dev.name);
      } else {
        this.$message.warning('字段不符合,请重新填写');
      }
    },
    // 添加设备
    handleAddDevice: function handleAddDevice() {
      this.deviceList.push({
        name: '',
        secret: ''
      });
    },
    // 删除设备
    handleDeleteDevice: function handleDeleteDevice(secret, index) {
      if (secret) {
        this.deviceManage('delete', secret);
      }

      this.deviceList.splice(index, 1);
    },
    // 保存默认配置
    handleChangeDefaultConfig: function handleChangeDefaultConfig() {
      this.commonRequest('/modify/default', true, {
        data: this.carState
      });
    },
    // 修改同步的字段
    handleChangeSyncData: function handleChangeSyncData() {
      this.commonRequest('/modify/sync', true, {
        data: this.syncData
      });
    },
    // 进入bootloader
    handleEntryBootloader: function handleEntryBootloader() {
      var _this8 = this;

      if (!this.controlIsConnected) {
        return this.$message.warning('云控制服务器未连接,无法执行指令');
      }

      this.commonRequest("/command/r-2", true, {
        data: '1'
      });
      setTimeout(function () {
        _this8.commonRequest("/command/c-0", true, {
          data: '1'
        });
      }, 18000);
      setTimeout(function () {
        _this8.$message.warning('请等待重新连接云控制服务器');
      }, 5000);
    },
    // 退出bootloader
    handleQuitBootloader: function handleQuitBootloader() {
      if (!this.controlIsConnected) {
        return this.$message.warning('云控制服务器未连接,无法执行指令');
      }

      if (this.mqttIsConnected) {
        return this.$message.warning('请先进入Bootloader模式');
      }

      this.loading.entryApp = true;
      this.commonRequest("/command/a-1", true, {
        data: '0'
      });
    },
    // 重置云控制服务器连接
    handleResetCloudControl: function handleResetCloudControl() {
      // mqtt未连接
      if (!this.mqttIsConnected) {
        return this.$message.warning('MQTT服务器未连接,无法执行指令');
      }

      sessionStorage.setItem('reset_wifi2', '1'); // 重置云控制服务器连接
    },
    // 上传固件更新小车
    submitUpload: function submitUpload() {
      if (!this.controlIsConnected) {
        return this.$message.warning('云控制服务器未连接,无法更新');
      }

      this.loading.upload = true;
      this.$refs.upload.submit();
    },
    // 上传成功,回调
    handleUploadSuccess: function handleUploadSuccess() {
      // 清空列表
      this.fileList = []; // this.loading.upload = false
    },
    // 上传失败回调
    handleUploadError: function handleUploadError() {// this.loading.upload = false
    }
  }
});

/***/ })

}]);