import React, { useMemo, Fragment } from 'react';
import { version, Typography, Tag, Menu, Popconfirm, Dropdown, Button, Tooltip, Modal } from 'antd';
import { omit, inRange, kebabCase, find, flatten, isString, isObject, get, merge, filter } from 'lodash';
import { classNames, getTooltipHtml, isEmptyValue, getLabelByValue, formatTime, isEmptyObject, stringifyUrl, isEmptyArray } from '@nbfe/tools';
import RcImage from 'rc-image';

function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);

  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);

    if (enumerableOnly) {
      symbols = symbols.filter(function (sym) {
        return Object.getOwnPropertyDescriptor(object, sym).enumerable;
      });
    }

    keys.push.apply(keys, symbols);
  }

  return keys;
}

function _objectSpread2(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};

    if (i % 2) {
      ownKeys(Object(source), true).forEach(function (key) {
        _defineProperty(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      ownKeys(Object(source)).forEach(function (key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }
  }

  return target;
}

function _typeof(obj) {
  "@babel/helpers - typeof";

  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof = function (obj) {
      return typeof obj;
    };
  } else {
    _typeof = function (obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
  }

  return _typeof(obj);
}

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }

  if (info.done) {
    resolve(value);
  } else {
    Promise.resolve(value).then(_next, _throw);
  }
}

function _asyncToGenerator(fn) {
  return function () {
    var self = this,
        args = arguments;
    return new Promise(function (resolve, reject) {
      var gen = fn.apply(self, args);

      function _next(value) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
      }

      function _throw(err) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
      }

      _next(undefined);
    });
  };
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function _extends() {
  _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  return _extends.apply(this, arguments);
}

function _objectWithoutPropertiesLoose(source, excluded) {
  if (source == null) return {};
  var target = {};
  var sourceKeys = Object.keys(source);
  var key, i;

  for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i];
    if (excluded.indexOf(key) >= 0) continue;
    target[key] = source[key];
  }

  return target;
}

function _objectWithoutProperties(source, excluded) {
  if (source == null) return {};

  var target = _objectWithoutPropertiesLoose(source, excluded);

  var key, i;

  if (Object.getOwnPropertySymbols) {
    var sourceSymbolKeys = Object.getOwnPropertySymbols(source);

    for (i = 0; i < sourceSymbolKeys.length; i++) {
      key = sourceSymbolKeys[i];
      if (excluded.indexOf(key) >= 0) continue;
      if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
      target[key] = source[key];
    }
  }

  return target;
}

function _toConsumableArray(arr) {
  return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
}

function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) return _arrayLikeToArray(arr);
}

function _iterableToArray(iter) {
  if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter);
}

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}

function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;

  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

  return arr2;
}

function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

var defaultSvgProps = {
  viewBox: '64 64 896 896',
  focusable: 'false',
  xmlns: 'http://www.w3.org/2000/svg',
  fill: 'currentColor',
  width: '1em',
  height: '1em'
};

var getSvgProps = function getSvgProps(props) {
  return _objectSpread2(_objectSpread2({}, defaultSvgProps), omit(props, 'className'));
};
var EllipsisOutlined = function EllipsisOutlined(props) {
  var svgProps = getSvgProps(props);
  return /*#__PURE__*/React.createElement("span", {
    className: classNames('anticon', props.className)
  }, /*#__PURE__*/React.createElement("svg", svgProps, /*#__PURE__*/React.createElement("path", {
    d: "M176 511a56 56 0 10112 0 56 56 0 10-112 0zm280 0a56 56 0 10112 0 56 56 0 10-112 0zm280 0a56 56 0 10112 0 56 56 0 10-112 0z"
  })));
};
var FileImageOutlined = function FileImageOutlined(props) {
  var svgProps = getSvgProps(props);
  return /*#__PURE__*/React.createElement("span", {
    className: classNames('anticon', props.className)
  }, /*#__PURE__*/React.createElement("svg", svgProps, /*#__PURE__*/React.createElement("path", {
    d: "M553.1 509.1l-77.8 99.2-41.1-52.4a8 8 0 00-12.6 0l-99.8 127.2a7.98 7.98 0 006.3 12.9H696c6.7 0 10.4-7.7 6.3-12.9l-136.5-174a8.1 8.1 0 00-12.7 0zM360 442a40 40 0 1080 0 40 40 0 10-80 0zm494.6-153.4L639.4 73.4c-6-6-14.1-9.4-22.6-9.4H192c-17.7 0-32 14.3-32 32v832c0 17.7 14.3 32 32 32h640c17.7 0 32-14.3 32-32V311.3c0-8.5-3.4-16.7-9.4-22.7zM790.2 326H602V137.8L790.2 326zm1.8 562H232V136h302v216a42 42 0 0042 42h216v494z"
  })));
};
var EyeOutlined = function EyeOutlined(props) {
  var svgProps = getSvgProps(props);
  return /*#__PURE__*/React.createElement("span", {
    className: classNames('anticon', props.className)
  }, /*#__PURE__*/React.createElement("svg", svgProps, /*#__PURE__*/React.createElement("path", {
    d: "M942.2 486.2C847.4 286.5 704.1 186 512 186c-192.2 0-335.4 100.5-430.2 300.3a60.3 60.3 0 000 51.5C176.6 737.5 319.9 838 512 838c192.2 0 335.4-100.5 430.2-300.3 7.7-16.2 7.7-35 0-51.5zM512 766c-161.3 0-279.4-81.8-362.7-254C232.6 339.8 350.7 258 512 258c161.3 0 279.4 81.8 362.7 254C791.5 684.2 673.4 766 512 766zm-4-430c-97.2 0-176 78.8-176 176s78.8 176 176 176 176-78.8 176-176-78.8-176-176-176zm0 288c-61.9 0-112-50.1-112-112s50.1-112 112-112 112 50.1 112 112-50.1 112-112 112z"
  })));
};
var RotateLeftOutlined = function RotateLeftOutlined(props) {
  var svgProps = getSvgProps(props);
  return /*#__PURE__*/React.createElement("span", {
    className: classNames('anticon', props.className)
  }, /*#__PURE__*/React.createElement("svg", svgProps, /*#__PURE__*/React.createElement("defs", null, /*#__PURE__*/React.createElement("style", null)), /*#__PURE__*/React.createElement("path", {
    d: "M672 418H144c-17.7 0-32 14.3-32 32v414c0 17.7 14.3 32 32 32h528c17.7 0 32-14.3 32-32V450c0-17.7-14.3-32-32-32zm-44 402H188V494h440v326z"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M819.3 328.5c-78.8-100.7-196-153.6-314.6-154.2l-.2-64c0-6.5-7.6-10.1-12.6-6.1l-128 101c-4 3.1-3.9 9.1 0 12.3L492 318.6c5.1 4 12.7.4 12.6-6.1v-63.9c12.9.1 25.9.9 38.8 2.5 42.1 5.2 82.1 18.2 119 38.7 38.1 21.2 71.2 49.7 98.4 84.3 27.1 34.7 46.7 73.7 58.1 115.8a325.95 325.95 0 016.5 140.9h74.9c14.8-103.6-11.3-213-81-302.3z"
  })));
};
var RotateRightOutlined = function RotateRightOutlined(props) {
  var svgProps = getSvgProps(props);
  return /*#__PURE__*/React.createElement("span", {
    className: classNames('anticon', props.className)
  }, /*#__PURE__*/React.createElement("svg", svgProps, /*#__PURE__*/React.createElement("defs", null, /*#__PURE__*/React.createElement("style", null)), /*#__PURE__*/React.createElement("path", {
    d: "M480.5 251.2c13-1.6 25.9-2.4 38.8-2.5v63.9c0 6.5 7.5 10.1 12.6 6.1L660 217.6c4-3.2 4-9.2 0-12.3l-128-101c-5.1-4-12.6-.4-12.6 6.1l-.2 64c-118.6.5-235.8 53.4-314.6 154.2A399.75 399.75 0 00123.5 631h74.9c-.9-5.3-1.7-10.7-2.4-16.1-5.1-42.1-2.1-84.1 8.9-124.8 11.4-42.2 31-81.1 58.1-115.8 27.2-34.7 60.3-63.2 98.4-84.3 37-20.6 76.9-33.6 119.1-38.8z"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M880 418H352c-17.7 0-32 14.3-32 32v414c0 17.7 14.3 32 32 32h528c17.7 0 32-14.3 32-32V450c0-17.7-14.3-32-32-32zm-44 402H396V494h440v326z"
  })));
};
var ZoomInOutlined = function ZoomInOutlined(props) {
  var svgProps = getSvgProps(props);
  return /*#__PURE__*/React.createElement("span", {
    className: classNames('anticon', props.className)
  }, /*#__PURE__*/React.createElement("svg", svgProps, /*#__PURE__*/React.createElement("path", {
    d: "M637 443H519V309c0-4.4-3.6-8-8-8h-60c-4.4 0-8 3.6-8 8v134H325c-4.4 0-8 3.6-8 8v60c0 4.4 3.6 8 8 8h118v134c0 4.4 3.6 8 8 8h60c4.4 0 8-3.6 8-8V519h118c4.4 0 8-3.6 8-8v-60c0-4.4-3.6-8-8-8zm284 424L775 721c122.1-148.9 113.6-369.5-26-509-148-148.1-388.4-148.1-537 0-148.1 148.6-148.1 389 0 537 139.5 139.6 360.1 148.1 509 26l146 146c3.2 2.8 8.3 2.8 11 0l43-43c2.8-2.7 2.8-7.8 0-11zM696 696c-118.8 118.7-311.2 118.7-430 0-118.7-118.8-118.7-311.2 0-430 118.8-118.7 311.2-118.7 430 0 118.7 118.8 118.7 311.2 0 430z"
  })));
};
var ZoomOutOutlined = function ZoomOutOutlined(props) {
  var svgProps = getSvgProps(props);
  return /*#__PURE__*/React.createElement("span", {
    className: classNames('anticon', props.className)
  }, /*#__PURE__*/React.createElement("svg", svgProps, /*#__PURE__*/React.createElement("path", {
    d: "M637 443H325c-4.4 0-8 3.6-8 8v60c0 4.4 3.6 8 8 8h312c4.4 0 8-3.6 8-8v-60c0-4.4-3.6-8-8-8zm284 424L775 721c122.1-148.9 113.6-369.5-26-509-148-148.1-388.4-148.1-537 0-148.1 148.6-148.1 389 0 537 139.5 139.6 360.1 148.1 509 26l146 146c3.2 2.8 8.3 2.8 11 0l43-43c2.8-2.7 2.8-7.8 0-11zM696 696c-118.8 118.7-311.2 118.7-430 0-118.7-118.8-118.7-311.2 0-430 118.8-118.7 311.2-118.7 430 0 118.7 118.8 118.7 311.2 0 430z"
  })));
};
var CloseOutlined = function CloseOutlined(props) {
  var svgProps = getSvgProps(props);
  return /*#__PURE__*/React.createElement("span", {
    className: classNames('anticon', props.className)
  }, /*#__PURE__*/React.createElement("svg", svgProps, /*#__PURE__*/React.createElement("path", {
    d: "M563.8 512l262.5-312.9c4.4-5.2.7-13.1-6.1-13.1h-79.8c-4.7 0-9.2 2.1-12.3 5.7L511.6 449.8 295.1 191.7c-3-3.6-7.5-5.7-12.3-5.7H203c-6.8 0-10.5 7.9-6.1 13.1L459.4 512 196.9 824.9A7.95 7.95 0 00203 838h79.8c4.7 0 9.2-2.1 12.3-5.7l216.5-258.1 216.5 258.1c3 3.6 7.5 5.7 12.3 5.7h79.8c6.8 0 10.5-7.9 6.1-13.1L563.8 512z"
  })));
};
var LeftOutlined = function LeftOutlined(props) {
  var svgProps = getSvgProps(props);
  return /*#__PURE__*/React.createElement("span", {
    className: classNames('anticon', props.className)
  }, /*#__PURE__*/React.createElement("svg", svgProps, /*#__PURE__*/React.createElement("path", {
    d: "M724 218.3V141c0-6.7-7.7-10.4-12.9-6.3L260.3 486.8a31.86 31.86 0 000 50.3l450.8 352.1c5.3 4.1 12.9.4 12.9-6.3v-77.3c0-4.9-2.3-9.6-6.1-12.6l-360-281 360-281.1c3.8-3 6.1-7.7 6.1-12.6z"
  })));
};
var RightOutlined = function RightOutlined(props) {
  var svgProps = getSvgProps(props);
  return /*#__PURE__*/React.createElement("span", {
    className: classNames('anticon', props.className)
  }, /*#__PURE__*/React.createElement("svg", svgProps, /*#__PURE__*/React.createElement("path", {
    d: "M765.7 486.8L314.9 134.7A7.97 7.97 0 00302 141v77.3c0 4.9 2.3 9.6 6.1 12.6l360 281.1-360 281.1c-3.9 3-6.1 7.7-6.1 12.6V883c0 6.7 7.7 10.4 12.9 6.3l450.8-352.1a31.96 31.96 0 000-50.4z"
  })));
};

var _excluded = ["preview"];
var icons = {
  rotateLeft: /*#__PURE__*/React.createElement(RotateLeftOutlined, null),
  rotateRight: /*#__PURE__*/React.createElement(RotateRightOutlined, null),
  zoomIn: /*#__PURE__*/React.createElement(ZoomInOutlined, null),
  zoomOut: /*#__PURE__*/React.createElement(ZoomOutOutlined, null),
  close: /*#__PURE__*/React.createElement(CloseOutlined, null),
  left: /*#__PURE__*/React.createElement(LeftOutlined, null),
  right: /*#__PURE__*/React.createElement(RightOutlined, null)
};
var fallback = 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/Pgo8c3ZnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgY2xhc3M9Imljb24iIHZpZXdCb3g9IjAgMCAxMDI0IDEwMjQiPgogIDxwYXRoIGQ9Ik01NTMuMSA1MDkuMWwtNzcuOCA5OS4yLTQxLjEtNTIuNGE4IDggMCAwIDAtMTIuNiAwbC05OS44IDEyNy4yYTcuOTggNy45OCAwIDAgMCA2LjMgMTIuOUg2OTZjNi43IDAgMTAuNC03LjcgNi4zLTEyLjlsLTEzNi41LTE3NGE4LjEgOC4xIDAgMCAwLTEyLjcgMHpNMzYwIDQ0MmE0MCA0MCAwIDEgMCA4MCAwIDQwIDQwIDAgMSAwLTgwIDB6bTQ5NC42LTE1My40TDYzOS40IDczLjRjLTYtNi0xNC4xLTkuNC0yMi42LTkuNEgxOTJjLTE3LjcgMC0zMiAxNC4zLTMyIDMydjgzMmMwIDE3LjcgMTQuMyAzMiAzMiAzMmg2NDBjMTcuNyAwIDMyLTE0LjMgMzItMzJWMzExLjNjMC04LjUtMy40LTE2LjctOS40LTIyLjd6TTc5MC4yIDMyNkg2MDJWMTM3LjhMNzkwLjIgMzI2em0xLjggNTYySDIzMlYxMzZoMzAydjIxNmE0MiA0MiAwIDAgMCA0MiA0MmgyMTZ2NDk0eiIvPgo8L3N2Zz4K';

var Image = function Image(_ref) {
  var preview = _ref.preview,
      otherProps = _objectWithoutProperties(_ref, _excluded);

  var mergedPreview = useMemo(function () {
    if (preview === false) {
      return preview;
    }

    var _preview = _typeof(preview) === 'object' ? preview : {};

    return _objectSpread2({
      mask: /*#__PURE__*/React.createElement(Fragment, null, /*#__PURE__*/React.createElement(EyeOutlined, null), /*#__PURE__*/React.createElement("span", null, "\u9884\u89C8")),
      icons: icons
    }, _preview);
  }, [preview]);
  return /*#__PURE__*/React.createElement(RcImage, _extends({
    previewPrefixCls: "dynamic-table-image rc-image-preview",
    preview: mergedPreview,
    fallback: fallback
  }, otherProps));
};

var isAntdV3 = inRange(parseInt(version, 10), 3, 4);
inRange(parseInt(version, 10), 4, 5);
var componentName = 'DynamicTable';
var prefixClassName = kebabCase(componentName);
var getClassNames = function getClassNames() {
  for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  return classNames(args).split(' ').map(function (v) {
    return [prefixClassName, v].join('-');
  }).join(' ');
}; // Tooltip 支持链接的写法

var getTooltipTitleNode = function getTooltipTitleNode(tooltip) {
  return getTooltipHtml(tooltip).map(function (v, i) {
    return /*#__PURE__*/React.createElement("div", {
      key: [i].join(),
      dangerouslySetInnerHTML: {
        __html: v
      }
    });
  });
};

var Paragraph = Typography.Paragraph;

var getValue = function getValue(dataIndex, template, record) {
  var tpl = template.tpl,
      emptyText = template.emptyText;
  var value = get(record, dataIndex);
  var tempEmptyText = ['image', 'date'].includes(tpl) ? '' : emptyText;
  return isEmptyValue(value) ? tempEmptyText : value;
};

var renderButtonList = function renderButtonList(list, context) {
  return list.map(function (v) {
    var text = v.text,
        key = v.key,
        visible = v.visible,
        query = v.query,
        tooltip = v.tooltip,
        PopconfirmConfig = v.PopconfirmConfig,
        ModalConfirmConfig = v.ModalConfirmConfig;
    var props = omit(v, ['key', 'text', 'visible', 'query', 'tooltip', 'isMore', 'PopconfirmConfig', 'ModalConfirmConfig']);
    var defaultProps = {
      type: 'link',
      size: 'small',
      children: text
    };

    if (!isEmptyObject(query)) {
      props.href = stringifyUrl(props.href || '', query);
    }

    if (!visible) {
      return null;
    }

    var getButtonNode = function getButtonNode() {
      var extraProps = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var buttonNode = /*#__PURE__*/React.createElement(Button, _extends({
        key: key,
        type: "link",
        size: "small"
      }, _objectSpread2(_objectSpread2(_objectSpread2({}, defaultProps), props), extraProps)));

      if (tooltip) {
        return /*#__PURE__*/React.createElement(Tooltip, {
          title: getTooltipTitleNode(tooltip),
          key: key
        }, buttonNode);
      }

      return buttonNode;
    };

    if (PopconfirmConfig) {
      return /*#__PURE__*/React.createElement(Popconfirm, _extends({}, PopconfirmConfig, {
        key: key,
        onConfirm: /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
          return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  _context.next = 2;
                  return PopconfirmConfig.onConfirm();

                case 2:
                  if (context && context.handleSearch) {
                    context.handleSearch({}, false);
                  }

                case 3:
                case "end":
                  return _context.stop();
              }
            }
          }, _callee);
        }))
      }), getButtonNode());
    }

    if (ModalConfirmConfig) {
      var handleClick = function handleClick() {
        Modal.confirm(_objectSpread2(_objectSpread2({}, ModalConfirmConfig), {}, {
          onOk: function () {
            var _onOk = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
              return regeneratorRuntime.wrap(function _callee2$(_context2) {
                while (1) {
                  switch (_context2.prev = _context2.next) {
                    case 0:
                      _context2.next = 2;
                      return ModalConfirmConfig.onOk();

                    case 2:
                      if (context && context.handleSearch) {
                        context.handleSearch({}, false);
                      }

                    case 3:
                    case "end":
                      return _context2.stop();
                  }
                }
              }, _callee2);
            }));

            function onOk() {
              return _onOk.apply(this, arguments);
            }

            return onOk;
          }()
        }));
      };

      return getButtonNode({
        onClick: handleClick
      });
    }

    return getButtonNode();
  });
};

var Render = (function (dataIndex, template, context) {
  var tpl = template.tpl,
      emptyText = template.emptyText;
  return function (text, record, index) {
    var value = getValue(dataIndex, template, record); // 行号

    if (tpl === 'numbering') {
      return index + 1;
    } // 普通文本


    if (tpl === 'text') {
      var props = omit(template, ['tpl', 'emptyText', 'separator']);

      if (Array.isArray(value)) {
        // 分隔符
        var _template$separator = template.separator,
            separator = _template$separator === void 0 ? '' : _template$separator;

        if (separator === 'div') {
          return value.map(function (v, i) {
            return /*#__PURE__*/React.createElement("div", {
              key: [i].join()
            }, v);
          });
        }

        return value.join(separator);
      }

      if (props.ellipsis) {
        props.ellipsis = _objectSpread2({
          tooltip: /*#__PURE__*/React.createElement("div", {
            style: {
              maxHeight: 400,
              overflowY: 'auto'
            }
          }, value)
        }, props.ellipsis);
      }

      return /*#__PURE__*/React.createElement(Paragraph, props, value);
    } // 枚举


    if (tpl === 'enum') {
      var _template$options = template.options,
          options = _template$options === void 0 ? [] : _template$options,
          _template$shape = template.shape,
          shape = _template$shape === void 0 ? 'text' : _template$shape;
      var valueText = getLabelByValue(value, options, emptyText);

      if (valueText === emptyText) {
        return valueText;
      }

      var itemProps = omit(find(options, {
        value: value
      }), ['value', 'label']);

      if (shape === 'tag') {
        return /*#__PURE__*/React.createElement(Tag, itemProps, valueText);
      }

      if (shape === 'circle') {
        var _itemProps$color = itemProps.color,
            color = _itemProps$color === void 0 ? 'rgba(0, 0, 0, 0.65)' : _itemProps$color;
        var style = {
          color: color,
          border: "1px solid ".concat(color)
        };
        return /*#__PURE__*/React.createElement("span", {
          style: style,
          className: getClassNames(['render-enum', shape].join('-'))
        }, valueText);
      }

      if (['dot', 'square'].includes(shape)) {
        var _itemProps$color2 = itemProps.color,
            _color = _itemProps$color2 === void 0 ? 'rgba(0, 0, 0, 0.85)' : _itemProps$color2;

        return /*#__PURE__*/React.createElement("span", {
          className: getClassNames(['render-enum', shape].join('-'))
        }, /*#__PURE__*/React.createElement("span", {
          className: getClassNames('render-enum-badge'),
          style: {
            backgroundColor: _color
          }
        }), /*#__PURE__*/React.createElement("span", {
          className: getClassNames('render-enum-text'),
          style: {
            color: _color
          }
        }, valueText));
      }

      return valueText;
    } // 图片


    if (tpl === 'image') {
      var _template$width = template.width,
          width = _template$width === void 0 ? 50 : _template$width,
          _template$height = template.height,
          height = _template$height === void 0 ? 50 : _template$height;

      var _props = omit(template, ['tpl', 'emptyText']);

      if (value) {
        var ImageProps = _objectSpread2({
          src: value,
          alt: '',
          width: width,
          height: height
        }, _props);

        return /*#__PURE__*/React.createElement(Image, ImageProps);
      }

      return /*#__PURE__*/React.createElement(FileImageOutlined, {
        style: {
          fontSize: width
        }
      });
    } // 日期


    if (tpl === 'date') {
      var _template$format = template.format,
          format = _template$format === void 0 ? 'YYYY-MM-DD' : _template$format;
      return formatTime(value, format, emptyText);
    } // 链接


    if (tpl === 'link') {
      var render = template.render;
      var list = flatten([render(text, record, index)]).map(function (v, i) {
        var icon = v.icon,
            tooltip = v.tooltip;
        var iconName = '';

        if (isString(icon)) {
          iconName = icon;
        }

        if (isObject(icon)) {
          iconName = get(icon, 'type.render.displayName');
        }

        var key = [i, v.text, iconName, tooltip].join();
        return merge({}, {
          key: key,
          visible: true,
          query: {},
          tooltip: '',
          isMore: false
        }, v);
      });
      var dropdownList = filter(list, {
        isMore: true
      });
      var menu = /*#__PURE__*/React.createElement(Menu, null, dropdownList.map(function (v) {
        return /*#__PURE__*/React.createElement(Menu.Item, {
          key: v.key
        }, renderButtonList([v], context));
      }));
      return [].concat(_toConsumableArray(renderButtonList(filter(list, {
        isMore: false
      }), context)), [!isEmptyArray(dropdownList) && /*#__PURE__*/React.createElement(Dropdown, {
        key: "Dropdown",
        overlayClassName: getClassNames('render-link-dropdown'),
        overlay: menu,
        placement: "bottomRight",
        arrow: true
      }, /*#__PURE__*/React.createElement(Button, {
        icon: isAntdV3 ? 'ellipsis' : /*#__PURE__*/React.createElement(EllipsisOutlined, null),
        type: "link",
        size: "small"
      }))]);
    }

    return null;
  };
});

export { Render as default };
