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
        
        if (e.key === '.')
        {
        	var decimals = typeof $(this).data('decimals') === 'undefined' ? 2 : $(this).data('decimals');
            for (var i = 0; i < decimals; i++) 
            {
        		this.value += '0';
            }
        }
    };

    var _selectionEndReparo = function(e) {
    	if (e.shiftKey || e.ctrlKey || e.key === 'Shift' || e.key === 'Control') {
            return;
        }

        try {
        	if (e.key === '.')
        	{
        	    var decimals = typeof $(this).data('decimals') === 'undefined' ? 2 : $(this).data('decimals');
        	    this.selectionStart = this.value.length - decimals;
                this.selectionEnd = this.value.length - decimals + 1;
        	}
            else
            {
            	this.selectionStart = this.selectionEnd = this.value.length;
            }
        } catch (x) {}
    };

	var _force_dec = function (val, decimals)
    {
    	if (val === null || val === true || val === false || typeof val === 'undefined')
        {
            val = 0;
        }

    	if (typeof decimals === 'undefined')
        {
        	decimals = 2;
        }

        val = val.toString();

        var negative = /\-/gi.test(val);

        val = (negative ? '-' : '') + val.replace(/[^0-9\.]/gi, '');

        if ( ! (/\./gi.test(val)))
       	{
        	val += '.';
        }
        
        var val_ = val.split('.', 2),
        	entero = val_[0],
            decimal = val_[1].replace(/\./gi, '');
        
		if (/[1-9]+[0]+[1-9]$/gi.test(decimal))
        {
        	decimal = decimal.replace(/([1-9]+)[0]+[1-9]$/gi, '$1');
        }
        else if (/[0-8]+[9]+[1-9]$/gi.test(decimal))
        {
        	decimal = decimal.replace(/([0-8]+)[9]+[1-9]$/gi, '$1');
            decimal = decimal.replace(/[0-8]$/gi, val[val.length-1]*1+1);
        }

        if (decimals < decimal.length)
        {
        	val = entero + '.' + decimal;

        	var k = '1';
            for(ki = 1; ki <= decimals; ki++)
            {
            	k+= '0';
            }
            k = k*1;

			val = Math.round(val*k) / k;

			val = val.toString();
            val_ = val.split('.', 2);
            entero = val_[0];
            decimal = val_[1];
        }

	if (typeof decimal === 'undefined')
	{
		decimal = '';
	}

	while (decimals > decimal.length)
        {
        	decimal += '0';
        }
        
        val = entero + '.' + decimal;

        return val;
    };

	var _stringify = function (val, decimals, dec_point, thousands_sep, data)
    {
    	if (val === null || val === true || val === false || typeof val === 'undefined')
        {
            val = 0;
        }

    	if (typeof decimals === 'undefined')
        {
        	decimals = 2;
        }
        
    	if (typeof dec_point === 'undefined')
        {
        	dec_point = '.';
        }
        
    	if (typeof thousands_sep === 'undefined')
        {
        	thousands_sep = ',';
        }
        
    	if (typeof data === 'undefined')
        {
        	data = [];
        }
        
        // limpiando data
        var dl = data.length;
        if (dl > 0)
        {
        	for (var di = 0; di < dl; di++) 
        	{
        	    data.shift();
        	}
        }
        
        // añadiendo signo por defecto
    	data.push('+');

		// añadiendo entero por defecto
        data.push(0);
        
        // añadiendo decimal por defecto
        for (var i = 0; i < decimals; i++) 
        {
            data.push(0);
        }

		// añadiendo caracteres del valor
        val = val.toString();
        for (var x in val) 
        {
            var y = val[x];
            if (y === '+' || y === '-') 
            {
                data[0] = y;
            }
            else if (/^[0-9]+$/i.test(y))
            {
                data.push(y * 1);
            }
        }

		// reseteando el valor
		val = '';
        
        // añadiendo signo solo si es negativo
        if (data[0] === '-') 
        {
            val += '-';
        }

        // generando la parte entera y decimal
        var nentero = '',
            ndecimales = '',
            indec = false;

        for (var ix = 1; ix < data.length; ix++) {
            indec = (data.length - ix) <= decimals;

            if (indec) 
            {
                ndecimales += data[ix];
            } 
            else 
            {
                nentero += data[ix];
            }
        }

		// quitando ceros de la izquierda del entero
        nentero = (nentero * 1) + '';
        
        // formateando el caracter de los miles en el entero
        var nentero_length = nentero.length,
            nentero_sep = (nentero_length % 3) + 1,
            nentero_string = '';

        for (var nentero_ind = 0; nentero_ind < nentero_length; nentero_ind++)
        {
            nentero_sep--;
            if (nentero_sep <= 0) 
            {
                nentero_sep = 3;
            }

            if (nentero_ind > 0 && nentero_sep === 3) 
            {
                nentero_string += thousands_sep;
            }

            nentero_string += nentero[nentero_ind];
        }

		// generando el nuevo valor formateado
        val += nentero_string + dec_point + (ndecimales);

		return val;
    };

    var _input = function(e, el) {
        var _this = el || this;

        var decimals = typeof $(_this).data('decimals') === 'undefined' ? 2 : $(_this).data('decimals'),
            thousands_sep = typeof $(_this).data('thousands_sep') === 'undefined' ? (_this.type === 'number' ? '' : ',') : $(_this).data('thousands_sep'),
            dec_point = typeof $(_this).data('dec_point') === 'undefined' ? '.' : $(_this).data('dec_point');

        var data = $(_this).data('numfcs') || [],
        	val  = _this.value;

        val = _stringify (val, decimals, dec_point, thousands_sep, data);

		if (e && e.originalEvent && e.originalEvent.inputType && /delete/i.test(e.originalEvent.inputType) && val === '0.00') 
        {
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

        return parseFloat(val).toString();
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
        	var _decimals = typeof $(_this).data('decimals') === 'undefined' ? 2 : $(_this).data('decimals');
            _this.value = _force_dec(val, _decimals);
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

    $.fn.numfcs = $.fn.number2 = function (val, decimals, dec_point, thousands_sep)
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

            if (val !== null && val !== true && val !== false && typeof val !== 'undefined')
            {
            	val = _force_dec(val, _decimals);
                $(this).val(val);
            }

            if (this.value !== '') 
            {
            	this.value = _force_dec(this.value, _decimals);
                _input(null, this);
            }
        });
        
        return $(this);
    }

	if ( ! $.fn.number)
    {
    	$.fn.number = $.fn.numfcs;
    }

	if ( ! $.number)
    {
    	$.number = function (val, decimals, dec_point, thousands_sep)
        {
        	val = _force_dec(val, decimals);
        	return _stringify(val, decimals, dec_point, thousands_sep);
        };
    }

    $(document).ready(function() {
        $('[data-toggle="numfcs"]')
            .each(function() {
                if (this.value !== '') {
                	this.value = _force_dec(this.value, _decimals);
                    _input(null, this);
                }
            })
            .change();
    });
}));
