/*!
* Aloha Editor
* Copyright (c) 2010 Gentics Software GmbH
* aloha-sales@gentics.com
* Author Nicolas Karageuzian
* Licensed unter the terms of http://www.aloha-editor.com/license.html
# https://github.com/temistokles/Aloha-Plugin-InputControl
*/
define(["aloha/plugin","aloha"],function(e,t){"use strict";return e.create("inputcontrol",{_constructor:function(){this._super("inputcontrol")},init:function(){var e=this;e.bindEvents()},config:{enableFilter:!1,allowchars:new RegExp("."),enableMask:!1},bindEvents:function(){var e=this;t.bind("aloha-editable-created",function(n,r){var i=e.getEditableConfig(r.obj);i.enableFilter&&r.obj.keypress(function(e){var n=e.which,r,s=!0;return r=String.fromCharCode(n),i.allowchars instanceof RegExp&&(t.Log.debug(t,"Keycode : ["+n+"] char : '"+r+"'"),s=s&&i.allowchars.test(r)),s}),i.disableEnter&&(r.obj.unbind("keydown"),r.obj.keydown(function(e){return e.keyCode===13?!1:!0})),i.enableMask&&r.obj.blur(function(e){var t=$(this);return i.type===Number&&((new Number(t.text())).toString()==="NaN"?t.addClass("aloha-input-invalid"):t.removeClass("aloha-input-invalid")),typeof i.maxlength=="number"&&(i.striphtml?t.text().length>=i.maxlength?t.addClass("aloha-input-invalid"):t.removeClass("aloha-input-invalid"):t.html().length>=i.maxlength?t.addClass("aloha-input-invalid"):t.removeClass("aloha-input-invalid")),!0})})}})});