(function (factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['jquery'], factory);
    } else if (typeof module === 'object' && module.exports) {
        // Node/CommonJS
        module.exports = function( root, jQuery ) {
            if ( jQuery === undefined ) {
                // require('jQuery') returns a factory that requires window to
                // build a jQuery instance, we normalize how we use modules
                // that require this pattern but the window provided is a noop
                // if it's defined (how jquery works)
                if ( typeof window !== 'undefined' ) {
                    jQuery = require('jquery');
                }
                else {
                    jQuery = require('jquery')(root);
                }
            }
            factory(jQuery);
            return jQuery;
        };
    } else {
        // Browser globals
        factory(jQuery);
    }
}(function ($) {

    var _keydown = function(e) {
        if (e.key === 'ArrowLeft' && !e.shiftKey && this.type !== 'number') {
            e.preventDefault();
            e.stopImmediatePropagation();
            return false;
        }
    };

    var _selectionEndReparo = function(e) {
        if (e.shiftKey || e.ctrlKey || e.key === 'Shift' || e.key === 'Control') {
            return;
        }

        try {
            this.selectionStart = this.selectionEnd = this.value.length;
        } catch (x) {}
    };

    var _input = function(e, el) {
        var _this = el || this;

        var decimals = typeof $(_this).data('decimals') === 'undefined' ? 2 : $(_this).data('decimals'),
            thousands_sep = typeof $(_this).data('thousands_sep') === 'undefined' ? (_this.type === 'number' ? '' : ',') : $(_this).data('thousands_sep'),
            dec_point = typeof $(_this).data('dec_point') === 'undefined' ? '.' : $(_this).data('dec_point');

        var data = $(_this).data('numfcs') || [];

        var val = _this.value;
        data = ['+'];

        for (var i = 0; i < decimals; i++) {
            data.push(0);
        }
        data.push(0);

        for (var x in val) {
            var y = val[x];
            if (y === '+' || y === '-') {
                data[0] = y;
            } else if (/[0-9]/i.test(y)) {
                data.push(y * 1);
            }
        }

        val = '';
        if (data[0] === '-') {
            val += '-';
        }

        var nentero = '',
            ndecimales = '',
            indec = false;

        for (var ix = 1; ix < data.length; ix++) {
            indec = (data.length - ix) <= decimals;

            if (indec) {
                ndecimales += data[ix];
            } else {
                nentero += data[ix];
            }
        }

        nentero = (nentero * 1) + '';
        var nentero_length = nentero.length,
            nentero_sep = (nentero_length % 3) + 1,
            nentero_string = '';

        for (var nentero_ind = 0; nentero_ind < nentero_length; nentero_ind++) {
            nentero_sep--;
            if (nentero_sep <= 0) {
                nentero_sep = 3;
            }

            if (nentero_ind > 0 && nentero_sep === 3) {
                nentero_string += thousands_sep;
            }

            nentero_string += nentero[nentero_ind];
        }

        val += nentero_string + dec_point + (ndecimales);

        if (e && e.originalEvent && e.originalEvent.inputType && /delete/i.test(e.originalEvent.inputType) && val === '0.00') {
            val = '';
        }

        $(_this).data('numfcs', data);
        _this.value = val;

        return _this.value;
    };

    var _output = function(e, el) {
        var _this = el || this;

        var decimals = typeof $(_this).data('decimals') === 'undefined' ? 2 : $(_this).data('decimals');

        var data = $(_this).data('numfcs');

        if (!data) {
            return _this.value;
        }

        var val = '';
        if (data[0] === '-') {
            val += '-';
        }

        var nentero = '',
            ndecimales = '',
            indec = false;

        for (var ix = 1; ix < data.length; ix++) {
            indec = (data.length - ix) <= decimals;

            if (indec) {
                ndecimales += data[ix];
            } else {
                nentero += data[ix];
            }
        }

        nentero = nentero * 1;
        val += nentero;
        if (ndecimales !== '00') {
            val += '.' + ndecimales;
        }

        return parseFloat(val);
    };

    $(document)
        .on('keydown', '[data-toggle="numfcs"]', _keydown)
        .on('click keyup focus', '[data-toggle="numfcs"]', _selectionEndReparo)
        .on('input', '[data-toggle="numfcs"]', _input);

    var origHookGet = null,
        origHookSet = null;

    if ($.isPlainObject($.valHooks.text)) {
        if ($.isFunction($.valHooks.text.get)) origHookGet = $.valHooks.text.get;
        if ($.isFunction($.valHooks.text.set)) origHookSet = $.valHooks.text.set;
    } else {
        $.valHooks.text = {};
    }

    $.valHooks.text.get = function(el) {
        var _this = el;

        // Does this element have our data field?
        if ($(_this).data('toggle') === 'numfcs') {
            return _output(null, el);
        } else {
            if ($.isFunction(origHookGet)) {
                return origHookGet(el);
            } else {
                return undefined;
            }
        }
    };

    $.valHooks.text.set = function(el, val) {
        var _this = el;

        if ($(_this).data('toggle') === 'numfcs') {
            _this.value = val;
            return _input(null, el);
        } else {
            if ($.isFunction(origHookSet)) {
                return origHookSet(el, val);
            } else {
                // No previous function, return undefined to have jQuery
                // take care of retrieving the value
                return undefined;
            }
        }
    };
    
    $.fn.numfcs = function (val, decimals, dec_point, thousands_sep)
    {
        $(this)
        .each(function(){
        	var _decimals = typeof decimals !== 'undefined' ? decimals : (typeof $(this).data('decimals') === 'undefined' ? 2 : $(this).data('decimals')),
            	_thousands_sep = typeof thousands_sep !== 'undefined' ? thousands_sep : (typeof $(this).data('thousands_sep') === 'undefined' ? (this.type === 'number' ? '' : ',') : $(this).data('thousands_sep')),
            	_dec_point = typeof dec_point !== 'undefined' ? dec_point : (typeof $(this).data('dec_point') === 'undefined' ? '.' : $(this).data('dec_point'));

            $(this)
            .attr('data-toggle', 'numfcs')
            .data('decimals', _decimals)
            .data('thousands_sep', _thousands_sep)
            .data('dec_point', _dec_point)
            ;

            if (val)
            {
                $(this).val(val);
            }

            if (this.value !== '') 
            {
                _input(null, this);
            }
        });
    }
        

    $(document).ready(function() {
        $('[data-toggle="numfcs"]')
            .each(function() {
                if (this.value !== '') {
                    _input(null, this);
                }
            })
            .change();
    });
}));
