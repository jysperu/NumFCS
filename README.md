# $.Number For Contable Systems
A small library that replaces the `$.number` plugin for typing numbers from right to left with 2 decimal digits

## Usage

#### Params

##### val _number_  
- Optional
- Default: *null*

The value what want to force set in the input

##### decimals  _number_  
- Optional
- Default: 2

The number of decimal length

##### dec_point  _string_  
- Optional
- Default: "."

The separator string for integer and decimal number

##### thousands_sep  _string_  
- Optional
- Default in input[type="number"]: ""
- Default: ","

The separator string for thousands integer

_In input[type="number"] controls the thousands separator not allowed by default_

#### Way Nº 1

At very Easy way as put an attribute ```data-toogle="numfcs"``` in the input control.

```HTML
<!-- Taking default config in input type text -->
<input type="text" data-toogle="numfcs" />

<!-- Taking default config in input type number -->
<input type="number" data-toogle="numfcs" />

<!-- Setting personalized config in input type text -->
<input type="text" data-toogle="numfcs" data-decimals="2" data-dec_point="." data-thousands_sep="," />
```

#### Way Nº 2

The second way is using the JQuery Plugin Extension ```$.numfcs```:

```Javascript
/* Simple */
$(input).numfcs();

/* Setting a new value */
$(input).numfcs(13245600); // Result: 132456.00

/* Setting a new negative value */
$(input).numfcs(-13245600); // Result: -132456.00

/* Setting personalized config without new value */
$(input).numfcs(null, 2, '.', ',');
```

_**Remember Nº 1**, when you set a value with JQuery, you need to add the decimals with or without decimal point_
_**Remember Nº 2**, If you write the negative symbol in the end of the value, this will be automatically setted in the first position_
_**Remember Nº 3**, All character not in [0-9\-\+], will be ignored for the formatting_
_**Remember Nº 4**, The decimal part is automatically calculated while the user write, so the point character is ignored too_

```
$(input).val(123456); // Result: 1,234.56
$(input).val('12345600-'); // Result: -123,456.00
$(input).val('123456002-'); // Result: -1,234,560.02
```

## Mobile Typing Allowed

Yes, This scripts has an compatibility for the mobile typing
