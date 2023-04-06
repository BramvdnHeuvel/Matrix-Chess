(function(scope){
'use strict';

function F(arity, fun, wrapper) {
  wrapper.a = arity;
  wrapper.f = fun;
  return wrapper;
}

function F2(fun) {
  return F(2, fun, function(a) { return function(b) { return fun(a,b); }; })
}
function F3(fun) {
  return F(3, fun, function(a) {
    return function(b) { return function(c) { return fun(a, b, c); }; };
  });
}
function F4(fun) {
  return F(4, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return fun(a, b, c, d); }; }; };
  });
}
function F5(fun) {
  return F(5, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return fun(a, b, c, d, e); }; }; }; };
  });
}
function F6(fun) {
  return F(6, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return fun(a, b, c, d, e, f); }; }; }; }; };
  });
}
function F7(fun) {
  return F(7, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return fun(a, b, c, d, e, f, g); }; }; }; }; }; };
  });
}
function F8(fun) {
  return F(8, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return function(h) {
    return fun(a, b, c, d, e, f, g, h); }; }; }; }; }; }; };
  });
}
function F9(fun) {
  return F(9, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return function(h) { return function(i) {
    return fun(a, b, c, d, e, f, g, h, i); }; }; }; }; }; }; }; };
  });
}

function A2(fun, a, b) {
  return fun.a === 2 ? fun.f(a, b) : fun(a)(b);
}
function A3(fun, a, b, c) {
  return fun.a === 3 ? fun.f(a, b, c) : fun(a)(b)(c);
}
function A4(fun, a, b, c, d) {
  return fun.a === 4 ? fun.f(a, b, c, d) : fun(a)(b)(c)(d);
}
function A5(fun, a, b, c, d, e) {
  return fun.a === 5 ? fun.f(a, b, c, d, e) : fun(a)(b)(c)(d)(e);
}
function A6(fun, a, b, c, d, e, f) {
  return fun.a === 6 ? fun.f(a, b, c, d, e, f) : fun(a)(b)(c)(d)(e)(f);
}
function A7(fun, a, b, c, d, e, f, g) {
  return fun.a === 7 ? fun.f(a, b, c, d, e, f, g) : fun(a)(b)(c)(d)(e)(f)(g);
}
function A8(fun, a, b, c, d, e, f, g, h) {
  return fun.a === 8 ? fun.f(a, b, c, d, e, f, g, h) : fun(a)(b)(c)(d)(e)(f)(g)(h);
}
function A9(fun, a, b, c, d, e, f, g, h, i) {
  return fun.a === 9 ? fun.f(a, b, c, d, e, f, g, h, i) : fun(a)(b)(c)(d)(e)(f)(g)(h)(i);
}




// EQUALITY

function _Utils_eq(x, y)
{
	for (
		var pair, stack = [], isEqual = _Utils_eqHelp(x, y, 0, stack);
		isEqual && (pair = stack.pop());
		isEqual = _Utils_eqHelp(pair.a, pair.b, 0, stack)
		)
	{}

	return isEqual;
}

function _Utils_eqHelp(x, y, depth, stack)
{
	if (x === y)
	{
		return true;
	}

	if (typeof x !== 'object' || x === null || y === null)
	{
		typeof x === 'function' && _Debug_crash(5);
		return false;
	}

	if (depth > 100)
	{
		stack.push(_Utils_Tuple2(x,y));
		return true;
	}

	/**_UNUSED/
	if (x.$ === 'Set_elm_builtin')
	{
		x = $elm$core$Set$toList(x);
		y = $elm$core$Set$toList(y);
	}
	if (x.$ === 'RBNode_elm_builtin' || x.$ === 'RBEmpty_elm_builtin')
	{
		x = $elm$core$Dict$toList(x);
		y = $elm$core$Dict$toList(y);
	}
	//*/

	/**/
	if (x.$ < 0)
	{
		x = $elm$core$Dict$toList(x);
		y = $elm$core$Dict$toList(y);
	}
	//*/

	for (var key in x)
	{
		if (!_Utils_eqHelp(x[key], y[key], depth + 1, stack))
		{
			return false;
		}
	}
	return true;
}

var _Utils_equal = F2(_Utils_eq);
var _Utils_notEqual = F2(function(a, b) { return !_Utils_eq(a,b); });



// COMPARISONS

// Code in Generate/JavaScript.hs, Basics.js, and List.js depends on
// the particular integer values assigned to LT, EQ, and GT.

function _Utils_cmp(x, y, ord)
{
	if (typeof x !== 'object')
	{
		return x === y ? /*EQ*/ 0 : x < y ? /*LT*/ -1 : /*GT*/ 1;
	}

	/**_UNUSED/
	if (x instanceof String)
	{
		var a = x.valueOf();
		var b = y.valueOf();
		return a === b ? 0 : a < b ? -1 : 1;
	}
	//*/

	/**/
	if (typeof x.$ === 'undefined')
	//*/
	/**_UNUSED/
	if (x.$[0] === '#')
	//*/
	{
		return (ord = _Utils_cmp(x.a, y.a))
			? ord
			: (ord = _Utils_cmp(x.b, y.b))
				? ord
				: _Utils_cmp(x.c, y.c);
	}

	// traverse conses until end of a list or a mismatch
	for (; x.b && y.b && !(ord = _Utils_cmp(x.a, y.a)); x = x.b, y = y.b) {} // WHILE_CONSES
	return ord || (x.b ? /*GT*/ 1 : y.b ? /*LT*/ -1 : /*EQ*/ 0);
}

var _Utils_lt = F2(function(a, b) { return _Utils_cmp(a, b) < 0; });
var _Utils_le = F2(function(a, b) { return _Utils_cmp(a, b) < 1; });
var _Utils_gt = F2(function(a, b) { return _Utils_cmp(a, b) > 0; });
var _Utils_ge = F2(function(a, b) { return _Utils_cmp(a, b) >= 0; });

var _Utils_compare = F2(function(x, y)
{
	var n = _Utils_cmp(x, y);
	return n < 0 ? $elm$core$Basics$LT : n ? $elm$core$Basics$GT : $elm$core$Basics$EQ;
});


// COMMON VALUES

var _Utils_Tuple0 = 0;
var _Utils_Tuple0_UNUSED = { $: '#0' };

function _Utils_Tuple2(a, b) { return { a: a, b: b }; }
function _Utils_Tuple2_UNUSED(a, b) { return { $: '#2', a: a, b: b }; }

function _Utils_Tuple3(a, b, c) { return { a: a, b: b, c: c }; }
function _Utils_Tuple3_UNUSED(a, b, c) { return { $: '#3', a: a, b: b, c: c }; }

function _Utils_chr(c) { return c; }
function _Utils_chr_UNUSED(c) { return new String(c); }


// RECORDS

function _Utils_update(oldRecord, updatedFields)
{
	var newRecord = {};

	for (var key in oldRecord)
	{
		newRecord[key] = oldRecord[key];
	}

	for (var key in updatedFields)
	{
		newRecord[key] = updatedFields[key];
	}

	return newRecord;
}


// APPEND

var _Utils_append = F2(_Utils_ap);

function _Utils_ap(xs, ys)
{
	// append Strings
	if (typeof xs === 'string')
	{
		return xs + ys;
	}

	// append Lists
	if (!xs.b)
	{
		return ys;
	}
	var root = _List_Cons(xs.a, ys);
	xs = xs.b
	for (var curr = root; xs.b; xs = xs.b) // WHILE_CONS
	{
		curr = curr.b = _List_Cons(xs.a, ys);
	}
	return root;
}



var _List_Nil = { $: 0 };
var _List_Nil_UNUSED = { $: '[]' };

function _List_Cons(hd, tl) { return { $: 1, a: hd, b: tl }; }
function _List_Cons_UNUSED(hd, tl) { return { $: '::', a: hd, b: tl }; }


var _List_cons = F2(_List_Cons);

function _List_fromArray(arr)
{
	var out = _List_Nil;
	for (var i = arr.length; i--; )
	{
		out = _List_Cons(arr[i], out);
	}
	return out;
}

function _List_toArray(xs)
{
	for (var out = []; xs.b; xs = xs.b) // WHILE_CONS
	{
		out.push(xs.a);
	}
	return out;
}

var _List_map2 = F3(function(f, xs, ys)
{
	for (var arr = []; xs.b && ys.b; xs = xs.b, ys = ys.b) // WHILE_CONSES
	{
		arr.push(A2(f, xs.a, ys.a));
	}
	return _List_fromArray(arr);
});

var _List_map3 = F4(function(f, xs, ys, zs)
{
	for (var arr = []; xs.b && ys.b && zs.b; xs = xs.b, ys = ys.b, zs = zs.b) // WHILE_CONSES
	{
		arr.push(A3(f, xs.a, ys.a, zs.a));
	}
	return _List_fromArray(arr);
});

var _List_map4 = F5(function(f, ws, xs, ys, zs)
{
	for (var arr = []; ws.b && xs.b && ys.b && zs.b; ws = ws.b, xs = xs.b, ys = ys.b, zs = zs.b) // WHILE_CONSES
	{
		arr.push(A4(f, ws.a, xs.a, ys.a, zs.a));
	}
	return _List_fromArray(arr);
});

var _List_map5 = F6(function(f, vs, ws, xs, ys, zs)
{
	for (var arr = []; vs.b && ws.b && xs.b && ys.b && zs.b; vs = vs.b, ws = ws.b, xs = xs.b, ys = ys.b, zs = zs.b) // WHILE_CONSES
	{
		arr.push(A5(f, vs.a, ws.a, xs.a, ys.a, zs.a));
	}
	return _List_fromArray(arr);
});

var _List_sortBy = F2(function(f, xs)
{
	return _List_fromArray(_List_toArray(xs).sort(function(a, b) {
		return _Utils_cmp(f(a), f(b));
	}));
});

var _List_sortWith = F2(function(f, xs)
{
	return _List_fromArray(_List_toArray(xs).sort(function(a, b) {
		var ord = A2(f, a, b);
		return ord === $elm$core$Basics$EQ ? 0 : ord === $elm$core$Basics$LT ? -1 : 1;
	}));
});



var _JsArray_empty = [];

function _JsArray_singleton(value)
{
    return [value];
}

function _JsArray_length(array)
{
    return array.length;
}

var _JsArray_initialize = F3(function(size, offset, func)
{
    var result = new Array(size);

    for (var i = 0; i < size; i++)
    {
        result[i] = func(offset + i);
    }

    return result;
});

var _JsArray_initializeFromList = F2(function (max, ls)
{
    var result = new Array(max);

    for (var i = 0; i < max && ls.b; i++)
    {
        result[i] = ls.a;
        ls = ls.b;
    }

    result.length = i;
    return _Utils_Tuple2(result, ls);
});

var _JsArray_unsafeGet = F2(function(index, array)
{
    return array[index];
});

var _JsArray_unsafeSet = F3(function(index, value, array)
{
    var length = array.length;
    var result = new Array(length);

    for (var i = 0; i < length; i++)
    {
        result[i] = array[i];
    }

    result[index] = value;
    return result;
});

var _JsArray_push = F2(function(value, array)
{
    var length = array.length;
    var result = new Array(length + 1);

    for (var i = 0; i < length; i++)
    {
        result[i] = array[i];
    }

    result[length] = value;
    return result;
});

var _JsArray_foldl = F3(function(func, acc, array)
{
    var length = array.length;

    for (var i = 0; i < length; i++)
    {
        acc = A2(func, array[i], acc);
    }

    return acc;
});

var _JsArray_foldr = F3(function(func, acc, array)
{
    for (var i = array.length - 1; i >= 0; i--)
    {
        acc = A2(func, array[i], acc);
    }

    return acc;
});

var _JsArray_map = F2(function(func, array)
{
    var length = array.length;
    var result = new Array(length);

    for (var i = 0; i < length; i++)
    {
        result[i] = func(array[i]);
    }

    return result;
});

var _JsArray_indexedMap = F3(function(func, offset, array)
{
    var length = array.length;
    var result = new Array(length);

    for (var i = 0; i < length; i++)
    {
        result[i] = A2(func, offset + i, array[i]);
    }

    return result;
});

var _JsArray_slice = F3(function(from, to, array)
{
    return array.slice(from, to);
});

var _JsArray_appendN = F3(function(n, dest, source)
{
    var destLen = dest.length;
    var itemsToCopy = n - destLen;

    if (itemsToCopy > source.length)
    {
        itemsToCopy = source.length;
    }

    var size = destLen + itemsToCopy;
    var result = new Array(size);

    for (var i = 0; i < destLen; i++)
    {
        result[i] = dest[i];
    }

    for (var i = 0; i < itemsToCopy; i++)
    {
        result[i + destLen] = source[i];
    }

    return result;
});



// LOG

var _Debug_log = F2(function(tag, value)
{
	return value;
});

var _Debug_log_UNUSED = F2(function(tag, value)
{
	console.log(tag + ': ' + _Debug_toString(value));
	return value;
});


// TODOS

function _Debug_todo(moduleName, region)
{
	return function(message) {
		_Debug_crash(8, moduleName, region, message);
	};
}

function _Debug_todoCase(moduleName, region, value)
{
	return function(message) {
		_Debug_crash(9, moduleName, region, value, message);
	};
}


// TO STRING

function _Debug_toString(value)
{
	return '<internals>';
}

function _Debug_toString_UNUSED(value)
{
	return _Debug_toAnsiString(false, value);
}

function _Debug_toAnsiString(ansi, value)
{
	if (typeof value === 'function')
	{
		return _Debug_internalColor(ansi, '<function>');
	}

	if (typeof value === 'boolean')
	{
		return _Debug_ctorColor(ansi, value ? 'True' : 'False');
	}

	if (typeof value === 'number')
	{
		return _Debug_numberColor(ansi, value + '');
	}

	if (value instanceof String)
	{
		return _Debug_charColor(ansi, "'" + _Debug_addSlashes(value, true) + "'");
	}

	if (typeof value === 'string')
	{
		return _Debug_stringColor(ansi, '"' + _Debug_addSlashes(value, false) + '"');
	}

	if (typeof value === 'object' && '$' in value)
	{
		var tag = value.$;

		if (typeof tag === 'number')
		{
			return _Debug_internalColor(ansi, '<internals>');
		}

		if (tag[0] === '#')
		{
			var output = [];
			for (var k in value)
			{
				if (k === '$') continue;
				output.push(_Debug_toAnsiString(ansi, value[k]));
			}
			return '(' + output.join(',') + ')';
		}

		if (tag === 'Set_elm_builtin')
		{
			return _Debug_ctorColor(ansi, 'Set')
				+ _Debug_fadeColor(ansi, '.fromList') + ' '
				+ _Debug_toAnsiString(ansi, $elm$core$Set$toList(value));
		}

		if (tag === 'RBNode_elm_builtin' || tag === 'RBEmpty_elm_builtin')
		{
			return _Debug_ctorColor(ansi, 'Dict')
				+ _Debug_fadeColor(ansi, '.fromList') + ' '
				+ _Debug_toAnsiString(ansi, $elm$core$Dict$toList(value));
		}

		if (tag === 'Array_elm_builtin')
		{
			return _Debug_ctorColor(ansi, 'Array')
				+ _Debug_fadeColor(ansi, '.fromList') + ' '
				+ _Debug_toAnsiString(ansi, $elm$core$Array$toList(value));
		}

		if (tag === '::' || tag === '[]')
		{
			var output = '[';

			value.b && (output += _Debug_toAnsiString(ansi, value.a), value = value.b)

			for (; value.b; value = value.b) // WHILE_CONS
			{
				output += ',' + _Debug_toAnsiString(ansi, value.a);
			}
			return output + ']';
		}

		var output = '';
		for (var i in value)
		{
			if (i === '$') continue;
			var str = _Debug_toAnsiString(ansi, value[i]);
			var c0 = str[0];
			var parenless = c0 === '{' || c0 === '(' || c0 === '[' || c0 === '<' || c0 === '"' || str.indexOf(' ') < 0;
			output += ' ' + (parenless ? str : '(' + str + ')');
		}
		return _Debug_ctorColor(ansi, tag) + output;
	}

	if (typeof DataView === 'function' && value instanceof DataView)
	{
		return _Debug_stringColor(ansi, '<' + value.byteLength + ' bytes>');
	}

	if (typeof File !== 'undefined' && value instanceof File)
	{
		return _Debug_internalColor(ansi, '<' + value.name + '>');
	}

	if (typeof value === 'object')
	{
		var output = [];
		for (var key in value)
		{
			var field = key[0] === '_' ? key.slice(1) : key;
			output.push(_Debug_fadeColor(ansi, field) + ' = ' + _Debug_toAnsiString(ansi, value[key]));
		}
		if (output.length === 0)
		{
			return '{}';
		}
		return '{ ' + output.join(', ') + ' }';
	}

	return _Debug_internalColor(ansi, '<internals>');
}

function _Debug_addSlashes(str, isChar)
{
	var s = str
		.replace(/\\/g, '\\\\')
		.replace(/\n/g, '\\n')
		.replace(/\t/g, '\\t')
		.replace(/\r/g, '\\r')
		.replace(/\v/g, '\\v')
		.replace(/\0/g, '\\0');

	if (isChar)
	{
		return s.replace(/\'/g, '\\\'');
	}
	else
	{
		return s.replace(/\"/g, '\\"');
	}
}

function _Debug_ctorColor(ansi, string)
{
	return ansi ? '\x1b[96m' + string + '\x1b[0m' : string;
}

function _Debug_numberColor(ansi, string)
{
	return ansi ? '\x1b[95m' + string + '\x1b[0m' : string;
}

function _Debug_stringColor(ansi, string)
{
	return ansi ? '\x1b[93m' + string + '\x1b[0m' : string;
}

function _Debug_charColor(ansi, string)
{
	return ansi ? '\x1b[92m' + string + '\x1b[0m' : string;
}

function _Debug_fadeColor(ansi, string)
{
	return ansi ? '\x1b[37m' + string + '\x1b[0m' : string;
}

function _Debug_internalColor(ansi, string)
{
	return ansi ? '\x1b[36m' + string + '\x1b[0m' : string;
}

function _Debug_toHexDigit(n)
{
	return String.fromCharCode(n < 10 ? 48 + n : 55 + n);
}


// CRASH


function _Debug_crash(identifier)
{
	throw new Error('https://github.com/elm/core/blob/1.0.0/hints/' + identifier + '.md');
}


function _Debug_crash_UNUSED(identifier, fact1, fact2, fact3, fact4)
{
	switch(identifier)
	{
		case 0:
			throw new Error('What node should I take over? In JavaScript I need something like:\n\n    Elm.Main.init({\n        node: document.getElementById("elm-node")\n    })\n\nYou need to do this with any Browser.sandbox or Browser.element program.');

		case 1:
			throw new Error('Browser.application programs cannot handle URLs like this:\n\n    ' + document.location.href + '\n\nWhat is the root? The root of your file system? Try looking at this program with `elm reactor` or some other server.');

		case 2:
			var jsonErrorString = fact1;
			throw new Error('Problem with the flags given to your Elm program on initialization.\n\n' + jsonErrorString);

		case 3:
			var portName = fact1;
			throw new Error('There can only be one port named `' + portName + '`, but your program has multiple.');

		case 4:
			var portName = fact1;
			var problem = fact2;
			throw new Error('Trying to send an unexpected type of value through port `' + portName + '`:\n' + problem);

		case 5:
			throw new Error('Trying to use `(==)` on functions.\nThere is no way to know if functions are "the same" in the Elm sense.\nRead more about this at https://package.elm-lang.org/packages/elm/core/latest/Basics#== which describes why it is this way and what the better version will look like.');

		case 6:
			var moduleName = fact1;
			throw new Error('Your page is loading multiple Elm scripts with a module named ' + moduleName + '. Maybe a duplicate script is getting loaded accidentally? If not, rename one of them so I know which is which!');

		case 8:
			var moduleName = fact1;
			var region = fact2;
			var message = fact3;
			throw new Error('TODO in module `' + moduleName + '` ' + _Debug_regionToString(region) + '\n\n' + message);

		case 9:
			var moduleName = fact1;
			var region = fact2;
			var value = fact3;
			var message = fact4;
			throw new Error(
				'TODO in module `' + moduleName + '` from the `case` expression '
				+ _Debug_regionToString(region) + '\n\nIt received the following value:\n\n    '
				+ _Debug_toString(value).replace('\n', '\n    ')
				+ '\n\nBut the branch that handles it says:\n\n    ' + message.replace('\n', '\n    ')
			);

		case 10:
			throw new Error('Bug in https://github.com/elm/virtual-dom/issues');

		case 11:
			throw new Error('Cannot perform mod 0. Division by zero error.');
	}
}

function _Debug_regionToString(region)
{
	if (region.c_.bn === region.cf.bn)
	{
		return 'on line ' + region.c_.bn;
	}
	return 'on lines ' + region.c_.bn + ' through ' + region.cf.bn;
}



// MATH

var _Basics_add = F2(function(a, b) { return a + b; });
var _Basics_sub = F2(function(a, b) { return a - b; });
var _Basics_mul = F2(function(a, b) { return a * b; });
var _Basics_fdiv = F2(function(a, b) { return a / b; });
var _Basics_idiv = F2(function(a, b) { return (a / b) | 0; });
var _Basics_pow = F2(Math.pow);

var _Basics_remainderBy = F2(function(b, a) { return a % b; });

// https://www.microsoft.com/en-us/research/wp-content/uploads/2016/02/divmodnote-letter.pdf
var _Basics_modBy = F2(function(modulus, x)
{
	var answer = x % modulus;
	return modulus === 0
		? _Debug_crash(11)
		:
	((answer > 0 && modulus < 0) || (answer < 0 && modulus > 0))
		? answer + modulus
		: answer;
});


// TRIGONOMETRY

var _Basics_pi = Math.PI;
var _Basics_e = Math.E;
var _Basics_cos = Math.cos;
var _Basics_sin = Math.sin;
var _Basics_tan = Math.tan;
var _Basics_acos = Math.acos;
var _Basics_asin = Math.asin;
var _Basics_atan = Math.atan;
var _Basics_atan2 = F2(Math.atan2);


// MORE MATH

function _Basics_toFloat(x) { return x; }
function _Basics_truncate(n) { return n | 0; }
function _Basics_isInfinite(n) { return n === Infinity || n === -Infinity; }

var _Basics_ceiling = Math.ceil;
var _Basics_floor = Math.floor;
var _Basics_round = Math.round;
var _Basics_sqrt = Math.sqrt;
var _Basics_log = Math.log;
var _Basics_isNaN = isNaN;


// BOOLEANS

function _Basics_not(bool) { return !bool; }
var _Basics_and = F2(function(a, b) { return a && b; });
var _Basics_or  = F2(function(a, b) { return a || b; });
var _Basics_xor = F2(function(a, b) { return a !== b; });



var _String_cons = F2(function(chr, str)
{
	return chr + str;
});

function _String_uncons(string)
{
	var word = string.charCodeAt(0);
	return !isNaN(word)
		? $elm$core$Maybe$Just(
			0xD800 <= word && word <= 0xDBFF
				? _Utils_Tuple2(_Utils_chr(string[0] + string[1]), string.slice(2))
				: _Utils_Tuple2(_Utils_chr(string[0]), string.slice(1))
		)
		: $elm$core$Maybe$Nothing;
}

var _String_append = F2(function(a, b)
{
	return a + b;
});

function _String_length(str)
{
	return str.length;
}

var _String_map = F2(function(func, string)
{
	var len = string.length;
	var array = new Array(len);
	var i = 0;
	while (i < len)
	{
		var word = string.charCodeAt(i);
		if (0xD800 <= word && word <= 0xDBFF)
		{
			array[i] = func(_Utils_chr(string[i] + string[i+1]));
			i += 2;
			continue;
		}
		array[i] = func(_Utils_chr(string[i]));
		i++;
	}
	return array.join('');
});

var _String_filter = F2(function(isGood, str)
{
	var arr = [];
	var len = str.length;
	var i = 0;
	while (i < len)
	{
		var char = str[i];
		var word = str.charCodeAt(i);
		i++;
		if (0xD800 <= word && word <= 0xDBFF)
		{
			char += str[i];
			i++;
		}

		if (isGood(_Utils_chr(char)))
		{
			arr.push(char);
		}
	}
	return arr.join('');
});

function _String_reverse(str)
{
	var len = str.length;
	var arr = new Array(len);
	var i = 0;
	while (i < len)
	{
		var word = str.charCodeAt(i);
		if (0xD800 <= word && word <= 0xDBFF)
		{
			arr[len - i] = str[i + 1];
			i++;
			arr[len - i] = str[i - 1];
			i++;
		}
		else
		{
			arr[len - i] = str[i];
			i++;
		}
	}
	return arr.join('');
}

var _String_foldl = F3(function(func, state, string)
{
	var len = string.length;
	var i = 0;
	while (i < len)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		i++;
		if (0xD800 <= word && word <= 0xDBFF)
		{
			char += string[i];
			i++;
		}
		state = A2(func, _Utils_chr(char), state);
	}
	return state;
});

var _String_foldr = F3(function(func, state, string)
{
	var i = string.length;
	while (i--)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		if (0xDC00 <= word && word <= 0xDFFF)
		{
			i--;
			char = string[i] + char;
		}
		state = A2(func, _Utils_chr(char), state);
	}
	return state;
});

var _String_split = F2(function(sep, str)
{
	return str.split(sep);
});

var _String_join = F2(function(sep, strs)
{
	return strs.join(sep);
});

var _String_slice = F3(function(start, end, str) {
	return str.slice(start, end);
});

function _String_trim(str)
{
	return str.trim();
}

function _String_trimLeft(str)
{
	return str.replace(/^\s+/, '');
}

function _String_trimRight(str)
{
	return str.replace(/\s+$/, '');
}

function _String_words(str)
{
	return _List_fromArray(str.trim().split(/\s+/g));
}

function _String_lines(str)
{
	return _List_fromArray(str.split(/\r\n|\r|\n/g));
}

function _String_toUpper(str)
{
	return str.toUpperCase();
}

function _String_toLower(str)
{
	return str.toLowerCase();
}

var _String_any = F2(function(isGood, string)
{
	var i = string.length;
	while (i--)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		if (0xDC00 <= word && word <= 0xDFFF)
		{
			i--;
			char = string[i] + char;
		}
		if (isGood(_Utils_chr(char)))
		{
			return true;
		}
	}
	return false;
});

var _String_all = F2(function(isGood, string)
{
	var i = string.length;
	while (i--)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		if (0xDC00 <= word && word <= 0xDFFF)
		{
			i--;
			char = string[i] + char;
		}
		if (!isGood(_Utils_chr(char)))
		{
			return false;
		}
	}
	return true;
});

var _String_contains = F2(function(sub, str)
{
	return str.indexOf(sub) > -1;
});

var _String_startsWith = F2(function(sub, str)
{
	return str.indexOf(sub) === 0;
});

var _String_endsWith = F2(function(sub, str)
{
	return str.length >= sub.length &&
		str.lastIndexOf(sub) === str.length - sub.length;
});

var _String_indexes = F2(function(sub, str)
{
	var subLen = sub.length;

	if (subLen < 1)
	{
		return _List_Nil;
	}

	var i = 0;
	var is = [];

	while ((i = str.indexOf(sub, i)) > -1)
	{
		is.push(i);
		i = i + subLen;
	}

	return _List_fromArray(is);
});


// TO STRING

function _String_fromNumber(number)
{
	return number + '';
}


// INT CONVERSIONS

function _String_toInt(str)
{
	var total = 0;
	var code0 = str.charCodeAt(0);
	var start = code0 == 0x2B /* + */ || code0 == 0x2D /* - */ ? 1 : 0;

	for (var i = start; i < str.length; ++i)
	{
		var code = str.charCodeAt(i);
		if (code < 0x30 || 0x39 < code)
		{
			return $elm$core$Maybe$Nothing;
		}
		total = 10 * total + code - 0x30;
	}

	return i == start
		? $elm$core$Maybe$Nothing
		: $elm$core$Maybe$Just(code0 == 0x2D ? -total : total);
}


// FLOAT CONVERSIONS

function _String_toFloat(s)
{
	// check if it is a hex, octal, or binary number
	if (s.length === 0 || /[\sxbo]/.test(s))
	{
		return $elm$core$Maybe$Nothing;
	}
	var n = +s;
	// faster isNaN check
	return n === n ? $elm$core$Maybe$Just(n) : $elm$core$Maybe$Nothing;
}

function _String_fromList(chars)
{
	return _List_toArray(chars).join('');
}




function _Char_toCode(char)
{
	var code = char.charCodeAt(0);
	if (0xD800 <= code && code <= 0xDBFF)
	{
		return (code - 0xD800) * 0x400 + char.charCodeAt(1) - 0xDC00 + 0x10000
	}
	return code;
}

function _Char_fromCode(code)
{
	return _Utils_chr(
		(code < 0 || 0x10FFFF < code)
			? '\uFFFD'
			:
		(code <= 0xFFFF)
			? String.fromCharCode(code)
			:
		(code -= 0x10000,
			String.fromCharCode(Math.floor(code / 0x400) + 0xD800, code % 0x400 + 0xDC00)
		)
	);
}

function _Char_toUpper(char)
{
	return _Utils_chr(char.toUpperCase());
}

function _Char_toLower(char)
{
	return _Utils_chr(char.toLowerCase());
}

function _Char_toLocaleUpper(char)
{
	return _Utils_chr(char.toLocaleUpperCase());
}

function _Char_toLocaleLower(char)
{
	return _Utils_chr(char.toLocaleLowerCase());
}



/**_UNUSED/
function _Json_errorToString(error)
{
	return $elm$json$Json$Decode$errorToString(error);
}
//*/


// CORE DECODERS

function _Json_succeed(msg)
{
	return {
		$: 0,
		a: msg
	};
}

function _Json_fail(msg)
{
	return {
		$: 1,
		a: msg
	};
}

function _Json_decodePrim(decoder)
{
	return { $: 2, b: decoder };
}

var _Json_decodeInt = _Json_decodePrim(function(value) {
	return (typeof value !== 'number')
		? _Json_expecting('an INT', value)
		:
	(-2147483647 < value && value < 2147483647 && (value | 0) === value)
		? $elm$core$Result$Ok(value)
		:
	(isFinite(value) && !(value % 1))
		? $elm$core$Result$Ok(value)
		: _Json_expecting('an INT', value);
});

var _Json_decodeBool = _Json_decodePrim(function(value) {
	return (typeof value === 'boolean')
		? $elm$core$Result$Ok(value)
		: _Json_expecting('a BOOL', value);
});

var _Json_decodeFloat = _Json_decodePrim(function(value) {
	return (typeof value === 'number')
		? $elm$core$Result$Ok(value)
		: _Json_expecting('a FLOAT', value);
});

var _Json_decodeValue = _Json_decodePrim(function(value) {
	return $elm$core$Result$Ok(_Json_wrap(value));
});

var _Json_decodeString = _Json_decodePrim(function(value) {
	return (typeof value === 'string')
		? $elm$core$Result$Ok(value)
		: (value instanceof String)
			? $elm$core$Result$Ok(value + '')
			: _Json_expecting('a STRING', value);
});

function _Json_decodeList(decoder) { return { $: 3, b: decoder }; }
function _Json_decodeArray(decoder) { return { $: 4, b: decoder }; }

function _Json_decodeNull(value) { return { $: 5, c: value }; }

var _Json_decodeField = F2(function(field, decoder)
{
	return {
		$: 6,
		d: field,
		b: decoder
	};
});

var _Json_decodeIndex = F2(function(index, decoder)
{
	return {
		$: 7,
		e: index,
		b: decoder
	};
});

function _Json_decodeKeyValuePairs(decoder)
{
	return {
		$: 8,
		b: decoder
	};
}

function _Json_mapMany(f, decoders)
{
	return {
		$: 9,
		f: f,
		g: decoders
	};
}

var _Json_andThen = F2(function(callback, decoder)
{
	return {
		$: 10,
		b: decoder,
		h: callback
	};
});

function _Json_oneOf(decoders)
{
	return {
		$: 11,
		g: decoders
	};
}


// DECODING OBJECTS

var _Json_map1 = F2(function(f, d1)
{
	return _Json_mapMany(f, [d1]);
});

var _Json_map2 = F3(function(f, d1, d2)
{
	return _Json_mapMany(f, [d1, d2]);
});

var _Json_map3 = F4(function(f, d1, d2, d3)
{
	return _Json_mapMany(f, [d1, d2, d3]);
});

var _Json_map4 = F5(function(f, d1, d2, d3, d4)
{
	return _Json_mapMany(f, [d1, d2, d3, d4]);
});

var _Json_map5 = F6(function(f, d1, d2, d3, d4, d5)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5]);
});

var _Json_map6 = F7(function(f, d1, d2, d3, d4, d5, d6)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5, d6]);
});

var _Json_map7 = F8(function(f, d1, d2, d3, d4, d5, d6, d7)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5, d6, d7]);
});

var _Json_map8 = F9(function(f, d1, d2, d3, d4, d5, d6, d7, d8)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5, d6, d7, d8]);
});


// DECODE

var _Json_runOnString = F2(function(decoder, string)
{
	try
	{
		var value = JSON.parse(string);
		return _Json_runHelp(decoder, value);
	}
	catch (e)
	{
		return $elm$core$Result$Err(A2($elm$json$Json$Decode$Failure, 'This is not valid JSON! ' + e.message, _Json_wrap(string)));
	}
});

var _Json_run = F2(function(decoder, value)
{
	return _Json_runHelp(decoder, _Json_unwrap(value));
});

function _Json_runHelp(decoder, value)
{
	switch (decoder.$)
	{
		case 2:
			return decoder.b(value);

		case 5:
			return (value === null)
				? $elm$core$Result$Ok(decoder.c)
				: _Json_expecting('null', value);

		case 3:
			if (!_Json_isArray(value))
			{
				return _Json_expecting('a LIST', value);
			}
			return _Json_runArrayDecoder(decoder.b, value, _List_fromArray);

		case 4:
			if (!_Json_isArray(value))
			{
				return _Json_expecting('an ARRAY', value);
			}
			return _Json_runArrayDecoder(decoder.b, value, _Json_toElmArray);

		case 6:
			var field = decoder.d;
			if (typeof value !== 'object' || value === null || !(field in value))
			{
				return _Json_expecting('an OBJECT with a field named `' + field + '`', value);
			}
			var result = _Json_runHelp(decoder.b, value[field]);
			return ($elm$core$Result$isOk(result)) ? result : $elm$core$Result$Err(A2($elm$json$Json$Decode$Field, field, result.a));

		case 7:
			var index = decoder.e;
			if (!_Json_isArray(value))
			{
				return _Json_expecting('an ARRAY', value);
			}
			if (index >= value.length)
			{
				return _Json_expecting('a LONGER array. Need index ' + index + ' but only see ' + value.length + ' entries', value);
			}
			var result = _Json_runHelp(decoder.b, value[index]);
			return ($elm$core$Result$isOk(result)) ? result : $elm$core$Result$Err(A2($elm$json$Json$Decode$Index, index, result.a));

		case 8:
			if (typeof value !== 'object' || value === null || _Json_isArray(value))
			{
				return _Json_expecting('an OBJECT', value);
			}

			var keyValuePairs = _List_Nil;
			// TODO test perf of Object.keys and switch when support is good enough
			for (var key in value)
			{
				if (value.hasOwnProperty(key))
				{
					var result = _Json_runHelp(decoder.b, value[key]);
					if (!$elm$core$Result$isOk(result))
					{
						return $elm$core$Result$Err(A2($elm$json$Json$Decode$Field, key, result.a));
					}
					keyValuePairs = _List_Cons(_Utils_Tuple2(key, result.a), keyValuePairs);
				}
			}
			return $elm$core$Result$Ok($elm$core$List$reverse(keyValuePairs));

		case 9:
			var answer = decoder.f;
			var decoders = decoder.g;
			for (var i = 0; i < decoders.length; i++)
			{
				var result = _Json_runHelp(decoders[i], value);
				if (!$elm$core$Result$isOk(result))
				{
					return result;
				}
				answer = answer(result.a);
			}
			return $elm$core$Result$Ok(answer);

		case 10:
			var result = _Json_runHelp(decoder.b, value);
			return (!$elm$core$Result$isOk(result))
				? result
				: _Json_runHelp(decoder.h(result.a), value);

		case 11:
			var errors = _List_Nil;
			for (var temp = decoder.g; temp.b; temp = temp.b) // WHILE_CONS
			{
				var result = _Json_runHelp(temp.a, value);
				if ($elm$core$Result$isOk(result))
				{
					return result;
				}
				errors = _List_Cons(result.a, errors);
			}
			return $elm$core$Result$Err($elm$json$Json$Decode$OneOf($elm$core$List$reverse(errors)));

		case 1:
			return $elm$core$Result$Err(A2($elm$json$Json$Decode$Failure, decoder.a, _Json_wrap(value)));

		case 0:
			return $elm$core$Result$Ok(decoder.a);
	}
}

function _Json_runArrayDecoder(decoder, value, toElmValue)
{
	var len = value.length;
	var array = new Array(len);
	for (var i = 0; i < len; i++)
	{
		var result = _Json_runHelp(decoder, value[i]);
		if (!$elm$core$Result$isOk(result))
		{
			return $elm$core$Result$Err(A2($elm$json$Json$Decode$Index, i, result.a));
		}
		array[i] = result.a;
	}
	return $elm$core$Result$Ok(toElmValue(array));
}

function _Json_isArray(value)
{
	return Array.isArray(value) || (typeof FileList !== 'undefined' && value instanceof FileList);
}

function _Json_toElmArray(array)
{
	return A2($elm$core$Array$initialize, array.length, function(i) { return array[i]; });
}

function _Json_expecting(type, value)
{
	return $elm$core$Result$Err(A2($elm$json$Json$Decode$Failure, 'Expecting ' + type, _Json_wrap(value)));
}


// EQUALITY

function _Json_equality(x, y)
{
	if (x === y)
	{
		return true;
	}

	if (x.$ !== y.$)
	{
		return false;
	}

	switch (x.$)
	{
		case 0:
		case 1:
			return x.a === y.a;

		case 2:
			return x.b === y.b;

		case 5:
			return x.c === y.c;

		case 3:
		case 4:
		case 8:
			return _Json_equality(x.b, y.b);

		case 6:
			return x.d === y.d && _Json_equality(x.b, y.b);

		case 7:
			return x.e === y.e && _Json_equality(x.b, y.b);

		case 9:
			return x.f === y.f && _Json_listEquality(x.g, y.g);

		case 10:
			return x.h === y.h && _Json_equality(x.b, y.b);

		case 11:
			return _Json_listEquality(x.g, y.g);
	}
}

function _Json_listEquality(aDecoders, bDecoders)
{
	var len = aDecoders.length;
	if (len !== bDecoders.length)
	{
		return false;
	}
	for (var i = 0; i < len; i++)
	{
		if (!_Json_equality(aDecoders[i], bDecoders[i]))
		{
			return false;
		}
	}
	return true;
}


// ENCODE

var _Json_encode = F2(function(indentLevel, value)
{
	return JSON.stringify(_Json_unwrap(value), null, indentLevel) + '';
});

function _Json_wrap_UNUSED(value) { return { $: 0, a: value }; }
function _Json_unwrap_UNUSED(value) { return value.a; }

function _Json_wrap(value) { return value; }
function _Json_unwrap(value) { return value; }

function _Json_emptyArray() { return []; }
function _Json_emptyObject() { return {}; }

var _Json_addField = F3(function(key, value, object)
{
	object[key] = _Json_unwrap(value);
	return object;
});

function _Json_addEntry(func)
{
	return F2(function(entry, array)
	{
		array.push(_Json_unwrap(func(entry)));
		return array;
	});
}

var _Json_encodeNull = _Json_wrap(null);



// TASKS

function _Scheduler_succeed(value)
{
	return {
		$: 0,
		a: value
	};
}

function _Scheduler_fail(error)
{
	return {
		$: 1,
		a: error
	};
}

function _Scheduler_binding(callback)
{
	return {
		$: 2,
		b: callback,
		c: null
	};
}

var _Scheduler_andThen = F2(function(callback, task)
{
	return {
		$: 3,
		b: callback,
		d: task
	};
});

var _Scheduler_onError = F2(function(callback, task)
{
	return {
		$: 4,
		b: callback,
		d: task
	};
});

function _Scheduler_receive(callback)
{
	return {
		$: 5,
		b: callback
	};
}


// PROCESSES

var _Scheduler_guid = 0;

function _Scheduler_rawSpawn(task)
{
	var proc = {
		$: 0,
		e: _Scheduler_guid++,
		f: task,
		g: null,
		h: []
	};

	_Scheduler_enqueue(proc);

	return proc;
}

function _Scheduler_spawn(task)
{
	return _Scheduler_binding(function(callback) {
		callback(_Scheduler_succeed(_Scheduler_rawSpawn(task)));
	});
}

function _Scheduler_rawSend(proc, msg)
{
	proc.h.push(msg);
	_Scheduler_enqueue(proc);
}

var _Scheduler_send = F2(function(proc, msg)
{
	return _Scheduler_binding(function(callback) {
		_Scheduler_rawSend(proc, msg);
		callback(_Scheduler_succeed(_Utils_Tuple0));
	});
});

function _Scheduler_kill(proc)
{
	return _Scheduler_binding(function(callback) {
		var task = proc.f;
		if (task.$ === 2 && task.c)
		{
			task.c();
		}

		proc.f = null;

		callback(_Scheduler_succeed(_Utils_Tuple0));
	});
}


/* STEP PROCESSES

type alias Process =
  { $ : tag
  , id : unique_id
  , root : Task
  , stack : null | { $: SUCCEED | FAIL, a: callback, b: stack }
  , mailbox : [msg]
  }

*/


var _Scheduler_working = false;
var _Scheduler_queue = [];


function _Scheduler_enqueue(proc)
{
	_Scheduler_queue.push(proc);
	if (_Scheduler_working)
	{
		return;
	}
	_Scheduler_working = true;
	while (proc = _Scheduler_queue.shift())
	{
		_Scheduler_step(proc);
	}
	_Scheduler_working = false;
}


function _Scheduler_step(proc)
{
	while (proc.f)
	{
		var rootTag = proc.f.$;
		if (rootTag === 0 || rootTag === 1)
		{
			while (proc.g && proc.g.$ !== rootTag)
			{
				proc.g = proc.g.i;
			}
			if (!proc.g)
			{
				return;
			}
			proc.f = proc.g.b(proc.f.a);
			proc.g = proc.g.i;
		}
		else if (rootTag === 2)
		{
			proc.f.c = proc.f.b(function(newRoot) {
				proc.f = newRoot;
				_Scheduler_enqueue(proc);
			});
			return;
		}
		else if (rootTag === 5)
		{
			if (proc.h.length === 0)
			{
				return;
			}
			proc.f = proc.f.b(proc.h.shift());
		}
		else // if (rootTag === 3 || rootTag === 4)
		{
			proc.g = {
				$: rootTag === 3 ? 0 : 1,
				b: proc.f.b,
				i: proc.g
			};
			proc.f = proc.f.d;
		}
	}
}



function _Process_sleep(time)
{
	return _Scheduler_binding(function(callback) {
		var id = setTimeout(function() {
			callback(_Scheduler_succeed(_Utils_Tuple0));
		}, time);

		return function() { clearTimeout(id); };
	});
}




// PROGRAMS


var _Platform_worker = F4(function(impl, flagDecoder, debugMetadata, args)
{
	return _Platform_initialize(
		flagDecoder,
		args,
		impl.fU,
		impl.hm,
		impl.g_,
		function() { return function() {} }
	);
});



// INITIALIZE A PROGRAM


function _Platform_initialize(flagDecoder, args, init, update, subscriptions, stepperBuilder)
{
	var result = A2(_Json_run, flagDecoder, _Json_wrap(args ? args['flags'] : undefined));
	$elm$core$Result$isOk(result) || _Debug_crash(2 /**_UNUSED/, _Json_errorToString(result.a) /**/);
	var managers = {};
	var initPair = init(result.a);
	var model = initPair.a;
	var stepper = stepperBuilder(sendToApp, model);
	var ports = _Platform_setupEffects(managers, sendToApp);

	function sendToApp(msg, viewMetadata)
	{
		var pair = A2(update, msg, model);
		stepper(model = pair.a, viewMetadata);
		_Platform_enqueueEffects(managers, pair.b, subscriptions(model));
	}

	_Platform_enqueueEffects(managers, initPair.b, subscriptions(model));

	return ports ? { ports: ports } : {};
}



// TRACK PRELOADS
//
// This is used by code in elm/browser and elm/http
// to register any HTTP requests that are triggered by init.
//


var _Platform_preload;


function _Platform_registerPreload(url)
{
	_Platform_preload.add(url);
}



// EFFECT MANAGERS


var _Platform_effectManagers = {};


function _Platform_setupEffects(managers, sendToApp)
{
	var ports;

	// setup all necessary effect managers
	for (var key in _Platform_effectManagers)
	{
		var manager = _Platform_effectManagers[key];

		if (manager.a)
		{
			ports = ports || {};
			ports[key] = manager.a(key, sendToApp);
		}

		managers[key] = _Platform_instantiateManager(manager, sendToApp);
	}

	return ports;
}


function _Platform_createManager(init, onEffects, onSelfMsg, cmdMap, subMap)
{
	return {
		b: init,
		c: onEffects,
		d: onSelfMsg,
		e: cmdMap,
		f: subMap
	};
}


function _Platform_instantiateManager(info, sendToApp)
{
	var router = {
		g: sendToApp,
		h: undefined
	};

	var onEffects = info.c;
	var onSelfMsg = info.d;
	var cmdMap = info.e;
	var subMap = info.f;

	function loop(state)
	{
		return A2(_Scheduler_andThen, loop, _Scheduler_receive(function(msg)
		{
			var value = msg.a;

			if (msg.$ === 0)
			{
				return A3(onSelfMsg, router, value, state);
			}

			return cmdMap && subMap
				? A4(onEffects, router, value.i, value.j, state)
				: A3(onEffects, router, cmdMap ? value.i : value.j, state);
		}));
	}

	return router.h = _Scheduler_rawSpawn(A2(_Scheduler_andThen, loop, info.b));
}



// ROUTING


var _Platform_sendToApp = F2(function(router, msg)
{
	return _Scheduler_binding(function(callback)
	{
		router.g(msg);
		callback(_Scheduler_succeed(_Utils_Tuple0));
	});
});


var _Platform_sendToSelf = F2(function(router, msg)
{
	return A2(_Scheduler_send, router.h, {
		$: 0,
		a: msg
	});
});



// BAGS


function _Platform_leaf(home)
{
	return function(value)
	{
		return {
			$: 1,
			k: home,
			l: value
		};
	};
}


function _Platform_batch(list)
{
	return {
		$: 2,
		m: list
	};
}


var _Platform_map = F2(function(tagger, bag)
{
	return {
		$: 3,
		n: tagger,
		o: bag
	}
});



// PIPE BAGS INTO EFFECT MANAGERS
//
// Effects must be queued!
//
// Say your init contains a synchronous command, like Time.now or Time.here
//
//   - This will produce a batch of effects (FX_1)
//   - The synchronous task triggers the subsequent `update` call
//   - This will produce a batch of effects (FX_2)
//
// If we just start dispatching FX_2, subscriptions from FX_2 can be processed
// before subscriptions from FX_1. No good! Earlier versions of this code had
// this problem, leading to these reports:
//
//   https://github.com/elm/core/issues/980
//   https://github.com/elm/core/pull/981
//   https://github.com/elm/compiler/issues/1776
//
// The queue is necessary to avoid ordering issues for synchronous commands.


// Why use true/false here? Why not just check the length of the queue?
// The goal is to detect "are we currently dispatching effects?" If we
// are, we need to bail and let the ongoing while loop handle things.
//
// Now say the queue has 1 element. When we dequeue the final element,
// the queue will be empty, but we are still actively dispatching effects.
// So you could get queue jumping in a really tricky category of cases.
//
var _Platform_effectsQueue = [];
var _Platform_effectsActive = false;


function _Platform_enqueueEffects(managers, cmdBag, subBag)
{
	_Platform_effectsQueue.push({ p: managers, q: cmdBag, r: subBag });

	if (_Platform_effectsActive) return;

	_Platform_effectsActive = true;
	for (var fx; fx = _Platform_effectsQueue.shift(); )
	{
		_Platform_dispatchEffects(fx.p, fx.q, fx.r);
	}
	_Platform_effectsActive = false;
}


function _Platform_dispatchEffects(managers, cmdBag, subBag)
{
	var effectsDict = {};
	_Platform_gatherEffects(true, cmdBag, effectsDict, null);
	_Platform_gatherEffects(false, subBag, effectsDict, null);

	for (var home in managers)
	{
		_Scheduler_rawSend(managers[home], {
			$: 'fx',
			a: effectsDict[home] || { i: _List_Nil, j: _List_Nil }
		});
	}
}


function _Platform_gatherEffects(isCmd, bag, effectsDict, taggers)
{
	switch (bag.$)
	{
		case 1:
			var home = bag.k;
			var effect = _Platform_toEffect(isCmd, home, taggers, bag.l);
			effectsDict[home] = _Platform_insert(isCmd, effect, effectsDict[home]);
			return;

		case 2:
			for (var list = bag.m; list.b; list = list.b) // WHILE_CONS
			{
				_Platform_gatherEffects(isCmd, list.a, effectsDict, taggers);
			}
			return;

		case 3:
			_Platform_gatherEffects(isCmd, bag.o, effectsDict, {
				s: bag.n,
				t: taggers
			});
			return;
	}
}


function _Platform_toEffect(isCmd, home, taggers, value)
{
	function applyTaggers(x)
	{
		for (var temp = taggers; temp; temp = temp.t)
		{
			x = temp.s(x);
		}
		return x;
	}

	var map = isCmd
		? _Platform_effectManagers[home].e
		: _Platform_effectManagers[home].f;

	return A2(map, applyTaggers, value)
}


function _Platform_insert(isCmd, newEffect, effects)
{
	effects = effects || { i: _List_Nil, j: _List_Nil };

	isCmd
		? (effects.i = _List_Cons(newEffect, effects.i))
		: (effects.j = _List_Cons(newEffect, effects.j));

	return effects;
}



// PORTS


function _Platform_checkPortName(name)
{
	if (_Platform_effectManagers[name])
	{
		_Debug_crash(3, name)
	}
}



// OUTGOING PORTS


function _Platform_outgoingPort(name, converter)
{
	_Platform_checkPortName(name);
	_Platform_effectManagers[name] = {
		e: _Platform_outgoingPortMap,
		u: converter,
		a: _Platform_setupOutgoingPort
	};
	return _Platform_leaf(name);
}


var _Platform_outgoingPortMap = F2(function(tagger, value) { return value; });


function _Platform_setupOutgoingPort(name)
{
	var subs = [];
	var converter = _Platform_effectManagers[name].u;

	// CREATE MANAGER

	var init = _Process_sleep(0);

	_Platform_effectManagers[name].b = init;
	_Platform_effectManagers[name].c = F3(function(router, cmdList, state)
	{
		for ( ; cmdList.b; cmdList = cmdList.b) // WHILE_CONS
		{
			// grab a separate reference to subs in case unsubscribe is called
			var currentSubs = subs;
			var value = _Json_unwrap(converter(cmdList.a));
			for (var i = 0; i < currentSubs.length; i++)
			{
				currentSubs[i](value);
			}
		}
		return init;
	});

	// PUBLIC API

	function subscribe(callback)
	{
		subs.push(callback);
	}

	function unsubscribe(callback)
	{
		// copy subs into a new array in case unsubscribe is called within a
		// subscribed callback
		subs = subs.slice();
		var index = subs.indexOf(callback);
		if (index >= 0)
		{
			subs.splice(index, 1);
		}
	}

	return {
		subscribe: subscribe,
		unsubscribe: unsubscribe
	};
}



// INCOMING PORTS


function _Platform_incomingPort(name, converter)
{
	_Platform_checkPortName(name);
	_Platform_effectManagers[name] = {
		f: _Platform_incomingPortMap,
		u: converter,
		a: _Platform_setupIncomingPort
	};
	return _Platform_leaf(name);
}


var _Platform_incomingPortMap = F2(function(tagger, finalTagger)
{
	return function(value)
	{
		return tagger(finalTagger(value));
	};
});


function _Platform_setupIncomingPort(name, sendToApp)
{
	var subs = _List_Nil;
	var converter = _Platform_effectManagers[name].u;

	// CREATE MANAGER

	var init = _Scheduler_succeed(null);

	_Platform_effectManagers[name].b = init;
	_Platform_effectManagers[name].c = F3(function(router, subList, state)
	{
		subs = subList;
		return init;
	});

	// PUBLIC API

	function send(incomingValue)
	{
		var result = A2(_Json_run, converter, _Json_wrap(incomingValue));

		$elm$core$Result$isOk(result) || _Debug_crash(4, name, result.a);

		var value = result.a;
		for (var temp = subs; temp.b; temp = temp.b) // WHILE_CONS
		{
			sendToApp(temp.a(value));
		}
	}

	return { send: send };
}



// EXPORT ELM MODULES
//
// Have DEBUG and PROD versions so that we can (1) give nicer errors in
// debug mode and (2) not pay for the bits needed for that in prod mode.
//


function _Platform_export(exports)
{
	scope['Elm']
		? _Platform_mergeExportsProd(scope['Elm'], exports)
		: scope['Elm'] = exports;
}


function _Platform_mergeExportsProd(obj, exports)
{
	for (var name in exports)
	{
		(name in obj)
			? (name == 'init')
				? _Debug_crash(6)
				: _Platform_mergeExportsProd(obj[name], exports[name])
			: (obj[name] = exports[name]);
	}
}


function _Platform_export_UNUSED(exports)
{
	scope['Elm']
		? _Platform_mergeExportsDebug('Elm', scope['Elm'], exports)
		: scope['Elm'] = exports;
}


function _Platform_mergeExportsDebug(moduleName, obj, exports)
{
	for (var name in exports)
	{
		(name in obj)
			? (name == 'init')
				? _Debug_crash(6, moduleName)
				: _Platform_mergeExportsDebug(moduleName + '.' + name, obj[name], exports[name])
			: (obj[name] = exports[name]);
	}
}




// HELPERS


var _VirtualDom_divertHrefToApp;

var _VirtualDom_doc = typeof document !== 'undefined' ? document : {};


function _VirtualDom_appendChild(parent, child)
{
	parent.appendChild(child);
}

var _VirtualDom_init = F4(function(virtualNode, flagDecoder, debugMetadata, args)
{
	// NOTE: this function needs _Platform_export available to work

	/**/
	var node = args['node'];
	//*/
	/**_UNUSED/
	var node = args && args['node'] ? args['node'] : _Debug_crash(0);
	//*/

	node.parentNode.replaceChild(
		_VirtualDom_render(virtualNode, function() {}),
		node
	);

	return {};
});



// TEXT


function _VirtualDom_text(string)
{
	return {
		$: 0,
		a: string
	};
}



// NODE


var _VirtualDom_nodeNS = F2(function(namespace, tag)
{
	return F2(function(factList, kidList)
	{
		for (var kids = [], descendantsCount = 0; kidList.b; kidList = kidList.b) // WHILE_CONS
		{
			var kid = kidList.a;
			descendantsCount += (kid.b || 0);
			kids.push(kid);
		}
		descendantsCount += kids.length;

		return {
			$: 1,
			c: tag,
			d: _VirtualDom_organizeFacts(factList),
			e: kids,
			f: namespace,
			b: descendantsCount
		};
	});
});


var _VirtualDom_node = _VirtualDom_nodeNS(undefined);



// KEYED NODE


var _VirtualDom_keyedNodeNS = F2(function(namespace, tag)
{
	return F2(function(factList, kidList)
	{
		for (var kids = [], descendantsCount = 0; kidList.b; kidList = kidList.b) // WHILE_CONS
		{
			var kid = kidList.a;
			descendantsCount += (kid.b.b || 0);
			kids.push(kid);
		}
		descendantsCount += kids.length;

		return {
			$: 2,
			c: tag,
			d: _VirtualDom_organizeFacts(factList),
			e: kids,
			f: namespace,
			b: descendantsCount
		};
	});
});


var _VirtualDom_keyedNode = _VirtualDom_keyedNodeNS(undefined);



// CUSTOM


function _VirtualDom_custom(factList, model, render, diff)
{
	return {
		$: 3,
		d: _VirtualDom_organizeFacts(factList),
		g: model,
		h: render,
		i: diff
	};
}



// MAP


var _VirtualDom_map = F2(function(tagger, node)
{
	return {
		$: 4,
		j: tagger,
		k: node,
		b: 1 + (node.b || 0)
	};
});



// LAZY


function _VirtualDom_thunk(refs, thunk)
{
	return {
		$: 5,
		l: refs,
		m: thunk,
		k: undefined
	};
}

var _VirtualDom_lazy = F2(function(func, a)
{
	return _VirtualDom_thunk([func, a], function() {
		return func(a);
	});
});

var _VirtualDom_lazy2 = F3(function(func, a, b)
{
	return _VirtualDom_thunk([func, a, b], function() {
		return A2(func, a, b);
	});
});

var _VirtualDom_lazy3 = F4(function(func, a, b, c)
{
	return _VirtualDom_thunk([func, a, b, c], function() {
		return A3(func, a, b, c);
	});
});

var _VirtualDom_lazy4 = F5(function(func, a, b, c, d)
{
	return _VirtualDom_thunk([func, a, b, c, d], function() {
		return A4(func, a, b, c, d);
	});
});

var _VirtualDom_lazy5 = F6(function(func, a, b, c, d, e)
{
	return _VirtualDom_thunk([func, a, b, c, d, e], function() {
		return A5(func, a, b, c, d, e);
	});
});

var _VirtualDom_lazy6 = F7(function(func, a, b, c, d, e, f)
{
	return _VirtualDom_thunk([func, a, b, c, d, e, f], function() {
		return A6(func, a, b, c, d, e, f);
	});
});

var _VirtualDom_lazy7 = F8(function(func, a, b, c, d, e, f, g)
{
	return _VirtualDom_thunk([func, a, b, c, d, e, f, g], function() {
		return A7(func, a, b, c, d, e, f, g);
	});
});

var _VirtualDom_lazy8 = F9(function(func, a, b, c, d, e, f, g, h)
{
	return _VirtualDom_thunk([func, a, b, c, d, e, f, g, h], function() {
		return A8(func, a, b, c, d, e, f, g, h);
	});
});



// FACTS


var _VirtualDom_on = F2(function(key, handler)
{
	return {
		$: 'a0',
		n: key,
		o: handler
	};
});
var _VirtualDom_style = F2(function(key, value)
{
	return {
		$: 'a1',
		n: key,
		o: value
	};
});
var _VirtualDom_property = F2(function(key, value)
{
	return {
		$: 'a2',
		n: key,
		o: value
	};
});
var _VirtualDom_attribute = F2(function(key, value)
{
	return {
		$: 'a3',
		n: key,
		o: value
	};
});
var _VirtualDom_attributeNS = F3(function(namespace, key, value)
{
	return {
		$: 'a4',
		n: key,
		o: { f: namespace, o: value }
	};
});



// XSS ATTACK VECTOR CHECKS
//
// For some reason, tabs can appear in href protocols and it still works.
// So '\tjava\tSCRIPT:alert("!!!")' and 'javascript:alert("!!!")' are the same
// in practice. That is why _VirtualDom_RE_js and _VirtualDom_RE_js_html look
// so freaky.
//
// Pulling the regular expressions out to the top level gives a slight speed
// boost in small benchmarks (4-10%) but hoisting values to reduce allocation
// can be unpredictable in large programs where JIT may have a harder time with
// functions are not fully self-contained. The benefit is more that the js and
// js_html ones are so weird that I prefer to see them near each other.


var _VirtualDom_RE_script = /^script$/i;
var _VirtualDom_RE_on_formAction = /^(on|formAction$)/i;
var _VirtualDom_RE_js = /^\s*j\s*a\s*v\s*a\s*s\s*c\s*r\s*i\s*p\s*t\s*:/i;
var _VirtualDom_RE_js_html = /^\s*(j\s*a\s*v\s*a\s*s\s*c\s*r\s*i\s*p\s*t\s*:|d\s*a\s*t\s*a\s*:\s*t\s*e\s*x\s*t\s*\/\s*h\s*t\s*m\s*l\s*(,|;))/i;


function _VirtualDom_noScript(tag)
{
	return _VirtualDom_RE_script.test(tag) ? 'p' : tag;
}

function _VirtualDom_noOnOrFormAction(key)
{
	return _VirtualDom_RE_on_formAction.test(key) ? 'data-' + key : key;
}

function _VirtualDom_noInnerHtmlOrFormAction(key)
{
	return key == 'innerHTML' || key == 'formAction' ? 'data-' + key : key;
}

function _VirtualDom_noJavaScriptUri(value)
{
	return _VirtualDom_RE_js.test(value)
		? /**/''//*//**_UNUSED/'javascript:alert("This is an XSS vector. Please use ports or web components instead.")'//*/
		: value;
}

function _VirtualDom_noJavaScriptOrHtmlUri(value)
{
	return _VirtualDom_RE_js_html.test(value)
		? /**/''//*//**_UNUSED/'javascript:alert("This is an XSS vector. Please use ports or web components instead.")'//*/
		: value;
}

function _VirtualDom_noJavaScriptOrHtmlJson(value)
{
	return (typeof _Json_unwrap(value) === 'string' && _VirtualDom_RE_js_html.test(_Json_unwrap(value)))
		? _Json_wrap(
			/**/''//*//**_UNUSED/'javascript:alert("This is an XSS vector. Please use ports or web components instead.")'//*/
		) : value;
}



// MAP FACTS


var _VirtualDom_mapAttribute = F2(function(func, attr)
{
	return (attr.$ === 'a0')
		? A2(_VirtualDom_on, attr.n, _VirtualDom_mapHandler(func, attr.o))
		: attr;
});

function _VirtualDom_mapHandler(func, handler)
{
	var tag = $elm$virtual_dom$VirtualDom$toHandlerInt(handler);

	// 0 = Normal
	// 1 = MayStopPropagation
	// 2 = MayPreventDefault
	// 3 = Custom

	return {
		$: handler.$,
		a:
			!tag
				? A2($elm$json$Json$Decode$map, func, handler.a)
				:
			A3($elm$json$Json$Decode$map2,
				tag < 3
					? _VirtualDom_mapEventTuple
					: _VirtualDom_mapEventRecord,
				$elm$json$Json$Decode$succeed(func),
				handler.a
			)
	};
}

var _VirtualDom_mapEventTuple = F2(function(func, tuple)
{
	return _Utils_Tuple2(func(tuple.a), tuple.b);
});

var _VirtualDom_mapEventRecord = F2(function(func, record)
{
	return {
		aq: func(record.aq),
		c$: record.c$,
		cQ: record.cQ
	}
});



// ORGANIZE FACTS


function _VirtualDom_organizeFacts(factList)
{
	for (var facts = {}; factList.b; factList = factList.b) // WHILE_CONS
	{
		var entry = factList.a;

		var tag = entry.$;
		var key = entry.n;
		var value = entry.o;

		if (tag === 'a2')
		{
			(key === 'className')
				? _VirtualDom_addClass(facts, key, _Json_unwrap(value))
				: facts[key] = _Json_unwrap(value);

			continue;
		}

		var subFacts = facts[tag] || (facts[tag] = {});
		(tag === 'a3' && key === 'class')
			? _VirtualDom_addClass(subFacts, key, value)
			: subFacts[key] = value;
	}

	return facts;
}

function _VirtualDom_addClass(object, key, newClass)
{
	var classes = object[key];
	object[key] = classes ? classes + ' ' + newClass : newClass;
}



// RENDER


function _VirtualDom_render(vNode, eventNode)
{
	var tag = vNode.$;

	if (tag === 5)
	{
		return _VirtualDom_render(vNode.k || (vNode.k = vNode.m()), eventNode);
	}

	if (tag === 0)
	{
		return _VirtualDom_doc.createTextNode(vNode.a);
	}

	if (tag === 4)
	{
		var subNode = vNode.k;
		var tagger = vNode.j;

		while (subNode.$ === 4)
		{
			typeof tagger !== 'object'
				? tagger = [tagger, subNode.j]
				: tagger.push(subNode.j);

			subNode = subNode.k;
		}

		var subEventRoot = { j: tagger, p: eventNode };
		var domNode = _VirtualDom_render(subNode, subEventRoot);
		domNode.elm_event_node_ref = subEventRoot;
		return domNode;
	}

	if (tag === 3)
	{
		var domNode = vNode.h(vNode.g);
		_VirtualDom_applyFacts(domNode, eventNode, vNode.d);
		return domNode;
	}

	// at this point `tag` must be 1 or 2

	var domNode = vNode.f
		? _VirtualDom_doc.createElementNS(vNode.f, vNode.c)
		: _VirtualDom_doc.createElement(vNode.c);

	if (_VirtualDom_divertHrefToApp && vNode.c == 'a')
	{
		domNode.addEventListener('click', _VirtualDom_divertHrefToApp(domNode));
	}

	_VirtualDom_applyFacts(domNode, eventNode, vNode.d);

	for (var kids = vNode.e, i = 0; i < kids.length; i++)
	{
		_VirtualDom_appendChild(domNode, _VirtualDom_render(tag === 1 ? kids[i] : kids[i].b, eventNode));
	}

	return domNode;
}



// APPLY FACTS


function _VirtualDom_applyFacts(domNode, eventNode, facts)
{
	for (var key in facts)
	{
		var value = facts[key];

		key === 'a1'
			? _VirtualDom_applyStyles(domNode, value)
			:
		key === 'a0'
			? _VirtualDom_applyEvents(domNode, eventNode, value)
			:
		key === 'a3'
			? _VirtualDom_applyAttrs(domNode, value)
			:
		key === 'a4'
			? _VirtualDom_applyAttrsNS(domNode, value)
			:
		((key !== 'value' && key !== 'checked') || domNode[key] !== value) && (domNode[key] = value);
	}
}



// APPLY STYLES


function _VirtualDom_applyStyles(domNode, styles)
{
	var domNodeStyle = domNode.style;

	for (var key in styles)
	{
		domNodeStyle[key] = styles[key];
	}
}



// APPLY ATTRS


function _VirtualDom_applyAttrs(domNode, attrs)
{
	for (var key in attrs)
	{
		var value = attrs[key];
		typeof value !== 'undefined'
			? domNode.setAttribute(key, value)
			: domNode.removeAttribute(key);
	}
}



// APPLY NAMESPACED ATTRS


function _VirtualDom_applyAttrsNS(domNode, nsAttrs)
{
	for (var key in nsAttrs)
	{
		var pair = nsAttrs[key];
		var namespace = pair.f;
		var value = pair.o;

		typeof value !== 'undefined'
			? domNode.setAttributeNS(namespace, key, value)
			: domNode.removeAttributeNS(namespace, key);
	}
}



// APPLY EVENTS


function _VirtualDom_applyEvents(domNode, eventNode, events)
{
	var allCallbacks = domNode.elmFs || (domNode.elmFs = {});

	for (var key in events)
	{
		var newHandler = events[key];
		var oldCallback = allCallbacks[key];

		if (!newHandler)
		{
			domNode.removeEventListener(key, oldCallback);
			allCallbacks[key] = undefined;
			continue;
		}

		if (oldCallback)
		{
			var oldHandler = oldCallback.q;
			if (oldHandler.$ === newHandler.$)
			{
				oldCallback.q = newHandler;
				continue;
			}
			domNode.removeEventListener(key, oldCallback);
		}

		oldCallback = _VirtualDom_makeCallback(eventNode, newHandler);
		domNode.addEventListener(key, oldCallback,
			_VirtualDom_passiveSupported
			&& { passive: $elm$virtual_dom$VirtualDom$toHandlerInt(newHandler) < 2 }
		);
		allCallbacks[key] = oldCallback;
	}
}



// PASSIVE EVENTS


var _VirtualDom_passiveSupported;

try
{
	window.addEventListener('t', null, Object.defineProperty({}, 'passive', {
		get: function() { _VirtualDom_passiveSupported = true; }
	}));
}
catch(e) {}



// EVENT HANDLERS


function _VirtualDom_makeCallback(eventNode, initialHandler)
{
	function callback(event)
	{
		var handler = callback.q;
		var result = _Json_runHelp(handler.a, event);

		if (!$elm$core$Result$isOk(result))
		{
			return;
		}

		var tag = $elm$virtual_dom$VirtualDom$toHandlerInt(handler);

		// 0 = Normal
		// 1 = MayStopPropagation
		// 2 = MayPreventDefault
		// 3 = Custom

		var value = result.a;
		var message = !tag ? value : tag < 3 ? value.a : value.aq;
		var stopPropagation = tag == 1 ? value.b : tag == 3 && value.c$;
		var currentEventNode = (
			stopPropagation && event.stopPropagation(),
			(tag == 2 ? value.b : tag == 3 && value.cQ) && event.preventDefault(),
			eventNode
		);
		var tagger;
		var i;
		while (tagger = currentEventNode.j)
		{
			if (typeof tagger == 'function')
			{
				message = tagger(message);
			}
			else
			{
				for (var i = tagger.length; i--; )
				{
					message = tagger[i](message);
				}
			}
			currentEventNode = currentEventNode.p;
		}
		currentEventNode(message, stopPropagation); // stopPropagation implies isSync
	}

	callback.q = initialHandler;

	return callback;
}

function _VirtualDom_equalEvents(x, y)
{
	return x.$ == y.$ && _Json_equality(x.a, y.a);
}



// DIFF


// TODO: Should we do patches like in iOS?
//
// type Patch
//   = At Int Patch
//   | Batch (List Patch)
//   | Change ...
//
// How could it not be better?
//
function _VirtualDom_diff(x, y)
{
	var patches = [];
	_VirtualDom_diffHelp(x, y, patches, 0);
	return patches;
}


function _VirtualDom_pushPatch(patches, type, index, data)
{
	var patch = {
		$: type,
		r: index,
		s: data,
		t: undefined,
		u: undefined
	};
	patches.push(patch);
	return patch;
}


function _VirtualDom_diffHelp(x, y, patches, index)
{
	if (x === y)
	{
		return;
	}

	var xType = x.$;
	var yType = y.$;

	// Bail if you run into different types of nodes. Implies that the
	// structure has changed significantly and it's not worth a diff.
	if (xType !== yType)
	{
		if (xType === 1 && yType === 2)
		{
			y = _VirtualDom_dekey(y);
			yType = 1;
		}
		else
		{
			_VirtualDom_pushPatch(patches, 0, index, y);
			return;
		}
	}

	// Now we know that both nodes are the same $.
	switch (yType)
	{
		case 5:
			var xRefs = x.l;
			var yRefs = y.l;
			var i = xRefs.length;
			var same = i === yRefs.length;
			while (same && i--)
			{
				same = xRefs[i] === yRefs[i];
			}
			if (same)
			{
				y.k = x.k;
				return;
			}
			y.k = y.m();
			var subPatches = [];
			_VirtualDom_diffHelp(x.k, y.k, subPatches, 0);
			subPatches.length > 0 && _VirtualDom_pushPatch(patches, 1, index, subPatches);
			return;

		case 4:
			// gather nested taggers
			var xTaggers = x.j;
			var yTaggers = y.j;
			var nesting = false;

			var xSubNode = x.k;
			while (xSubNode.$ === 4)
			{
				nesting = true;

				typeof xTaggers !== 'object'
					? xTaggers = [xTaggers, xSubNode.j]
					: xTaggers.push(xSubNode.j);

				xSubNode = xSubNode.k;
			}

			var ySubNode = y.k;
			while (ySubNode.$ === 4)
			{
				nesting = true;

				typeof yTaggers !== 'object'
					? yTaggers = [yTaggers, ySubNode.j]
					: yTaggers.push(ySubNode.j);

				ySubNode = ySubNode.k;
			}

			// Just bail if different numbers of taggers. This implies the
			// structure of the virtual DOM has changed.
			if (nesting && xTaggers.length !== yTaggers.length)
			{
				_VirtualDom_pushPatch(patches, 0, index, y);
				return;
			}

			// check if taggers are "the same"
			if (nesting ? !_VirtualDom_pairwiseRefEqual(xTaggers, yTaggers) : xTaggers !== yTaggers)
			{
				_VirtualDom_pushPatch(patches, 2, index, yTaggers);
			}

			// diff everything below the taggers
			_VirtualDom_diffHelp(xSubNode, ySubNode, patches, index + 1);
			return;

		case 0:
			if (x.a !== y.a)
			{
				_VirtualDom_pushPatch(patches, 3, index, y.a);
			}
			return;

		case 1:
			_VirtualDom_diffNodes(x, y, patches, index, _VirtualDom_diffKids);
			return;

		case 2:
			_VirtualDom_diffNodes(x, y, patches, index, _VirtualDom_diffKeyedKids);
			return;

		case 3:
			if (x.h !== y.h)
			{
				_VirtualDom_pushPatch(patches, 0, index, y);
				return;
			}

			var factsDiff = _VirtualDom_diffFacts(x.d, y.d);
			factsDiff && _VirtualDom_pushPatch(patches, 4, index, factsDiff);

			var patch = y.i(x.g, y.g);
			patch && _VirtualDom_pushPatch(patches, 5, index, patch);

			return;
	}
}

// assumes the incoming arrays are the same length
function _VirtualDom_pairwiseRefEqual(as, bs)
{
	for (var i = 0; i < as.length; i++)
	{
		if (as[i] !== bs[i])
		{
			return false;
		}
	}

	return true;
}

function _VirtualDom_diffNodes(x, y, patches, index, diffKids)
{
	// Bail if obvious indicators have changed. Implies more serious
	// structural changes such that it's not worth it to diff.
	if (x.c !== y.c || x.f !== y.f)
	{
		_VirtualDom_pushPatch(patches, 0, index, y);
		return;
	}

	var factsDiff = _VirtualDom_diffFacts(x.d, y.d);
	factsDiff && _VirtualDom_pushPatch(patches, 4, index, factsDiff);

	diffKids(x, y, patches, index);
}



// DIFF FACTS


// TODO Instead of creating a new diff object, it's possible to just test if
// there *is* a diff. During the actual patch, do the diff again and make the
// modifications directly. This way, there's no new allocations. Worth it?
function _VirtualDom_diffFacts(x, y, category)
{
	var diff;

	// look for changes and removals
	for (var xKey in x)
	{
		if (xKey === 'a1' || xKey === 'a0' || xKey === 'a3' || xKey === 'a4')
		{
			var subDiff = _VirtualDom_diffFacts(x[xKey], y[xKey] || {}, xKey);
			if (subDiff)
			{
				diff = diff || {};
				diff[xKey] = subDiff;
			}
			continue;
		}

		// remove if not in the new facts
		if (!(xKey in y))
		{
			diff = diff || {};
			diff[xKey] =
				!category
					? (typeof x[xKey] === 'string' ? '' : null)
					:
				(category === 'a1')
					? ''
					:
				(category === 'a0' || category === 'a3')
					? undefined
					:
				{ f: x[xKey].f, o: undefined };

			continue;
		}

		var xValue = x[xKey];
		var yValue = y[xKey];

		// reference equal, so don't worry about it
		if (xValue === yValue && xKey !== 'value' && xKey !== 'checked'
			|| category === 'a0' && _VirtualDom_equalEvents(xValue, yValue))
		{
			continue;
		}

		diff = diff || {};
		diff[xKey] = yValue;
	}

	// add new stuff
	for (var yKey in y)
	{
		if (!(yKey in x))
		{
			diff = diff || {};
			diff[yKey] = y[yKey];
		}
	}

	return diff;
}



// DIFF KIDS


function _VirtualDom_diffKids(xParent, yParent, patches, index)
{
	var xKids = xParent.e;
	var yKids = yParent.e;

	var xLen = xKids.length;
	var yLen = yKids.length;

	// FIGURE OUT IF THERE ARE INSERTS OR REMOVALS

	if (xLen > yLen)
	{
		_VirtualDom_pushPatch(patches, 6, index, {
			v: yLen,
			i: xLen - yLen
		});
	}
	else if (xLen < yLen)
	{
		_VirtualDom_pushPatch(patches, 7, index, {
			v: xLen,
			e: yKids
		});
	}

	// PAIRWISE DIFF EVERYTHING ELSE

	for (var minLen = xLen < yLen ? xLen : yLen, i = 0; i < minLen; i++)
	{
		var xKid = xKids[i];
		_VirtualDom_diffHelp(xKid, yKids[i], patches, ++index);
		index += xKid.b || 0;
	}
}



// KEYED DIFF


function _VirtualDom_diffKeyedKids(xParent, yParent, patches, rootIndex)
{
	var localPatches = [];

	var changes = {}; // Dict String Entry
	var inserts = []; // Array { index : Int, entry : Entry }
	// type Entry = { tag : String, vnode : VNode, index : Int, data : _ }

	var xKids = xParent.e;
	var yKids = yParent.e;
	var xLen = xKids.length;
	var yLen = yKids.length;
	var xIndex = 0;
	var yIndex = 0;

	var index = rootIndex;

	while (xIndex < xLen && yIndex < yLen)
	{
		var x = xKids[xIndex];
		var y = yKids[yIndex];

		var xKey = x.a;
		var yKey = y.a;
		var xNode = x.b;
		var yNode = y.b;

		var newMatch = undefined;
		var oldMatch = undefined;

		// check if keys match

		if (xKey === yKey)
		{
			index++;
			_VirtualDom_diffHelp(xNode, yNode, localPatches, index);
			index += xNode.b || 0;

			xIndex++;
			yIndex++;
			continue;
		}

		// look ahead 1 to detect insertions and removals.

		var xNext = xKids[xIndex + 1];
		var yNext = yKids[yIndex + 1];

		if (xNext)
		{
			var xNextKey = xNext.a;
			var xNextNode = xNext.b;
			oldMatch = yKey === xNextKey;
		}

		if (yNext)
		{
			var yNextKey = yNext.a;
			var yNextNode = yNext.b;
			newMatch = xKey === yNextKey;
		}


		// swap x and y
		if (newMatch && oldMatch)
		{
			index++;
			_VirtualDom_diffHelp(xNode, yNextNode, localPatches, index);
			_VirtualDom_insertNode(changes, localPatches, xKey, yNode, yIndex, inserts);
			index += xNode.b || 0;

			index++;
			_VirtualDom_removeNode(changes, localPatches, xKey, xNextNode, index);
			index += xNextNode.b || 0;

			xIndex += 2;
			yIndex += 2;
			continue;
		}

		// insert y
		if (newMatch)
		{
			index++;
			_VirtualDom_insertNode(changes, localPatches, yKey, yNode, yIndex, inserts);
			_VirtualDom_diffHelp(xNode, yNextNode, localPatches, index);
			index += xNode.b || 0;

			xIndex += 1;
			yIndex += 2;
			continue;
		}

		// remove x
		if (oldMatch)
		{
			index++;
			_VirtualDom_removeNode(changes, localPatches, xKey, xNode, index);
			index += xNode.b || 0;

			index++;
			_VirtualDom_diffHelp(xNextNode, yNode, localPatches, index);
			index += xNextNode.b || 0;

			xIndex += 2;
			yIndex += 1;
			continue;
		}

		// remove x, insert y
		if (xNext && xNextKey === yNextKey)
		{
			index++;
			_VirtualDom_removeNode(changes, localPatches, xKey, xNode, index);
			_VirtualDom_insertNode(changes, localPatches, yKey, yNode, yIndex, inserts);
			index += xNode.b || 0;

			index++;
			_VirtualDom_diffHelp(xNextNode, yNextNode, localPatches, index);
			index += xNextNode.b || 0;

			xIndex += 2;
			yIndex += 2;
			continue;
		}

		break;
	}

	// eat up any remaining nodes with removeNode and insertNode

	while (xIndex < xLen)
	{
		index++;
		var x = xKids[xIndex];
		var xNode = x.b;
		_VirtualDom_removeNode(changes, localPatches, x.a, xNode, index);
		index += xNode.b || 0;
		xIndex++;
	}

	while (yIndex < yLen)
	{
		var endInserts = endInserts || [];
		var y = yKids[yIndex];
		_VirtualDom_insertNode(changes, localPatches, y.a, y.b, undefined, endInserts);
		yIndex++;
	}

	if (localPatches.length > 0 || inserts.length > 0 || endInserts)
	{
		_VirtualDom_pushPatch(patches, 8, rootIndex, {
			w: localPatches,
			x: inserts,
			y: endInserts
		});
	}
}



// CHANGES FROM KEYED DIFF


var _VirtualDom_POSTFIX = '_elmW6BL';


function _VirtualDom_insertNode(changes, localPatches, key, vnode, yIndex, inserts)
{
	var entry = changes[key];

	// never seen this key before
	if (!entry)
	{
		entry = {
			c: 0,
			z: vnode,
			r: yIndex,
			s: undefined
		};

		inserts.push({ r: yIndex, A: entry });
		changes[key] = entry;

		return;
	}

	// this key was removed earlier, a match!
	if (entry.c === 1)
	{
		inserts.push({ r: yIndex, A: entry });

		entry.c = 2;
		var subPatches = [];
		_VirtualDom_diffHelp(entry.z, vnode, subPatches, entry.r);
		entry.r = yIndex;
		entry.s.s = {
			w: subPatches,
			A: entry
		};

		return;
	}

	// this key has already been inserted or moved, a duplicate!
	_VirtualDom_insertNode(changes, localPatches, key + _VirtualDom_POSTFIX, vnode, yIndex, inserts);
}


function _VirtualDom_removeNode(changes, localPatches, key, vnode, index)
{
	var entry = changes[key];

	// never seen this key before
	if (!entry)
	{
		var patch = _VirtualDom_pushPatch(localPatches, 9, index, undefined);

		changes[key] = {
			c: 1,
			z: vnode,
			r: index,
			s: patch
		};

		return;
	}

	// this key was inserted earlier, a match!
	if (entry.c === 0)
	{
		entry.c = 2;
		var subPatches = [];
		_VirtualDom_diffHelp(vnode, entry.z, subPatches, index);

		_VirtualDom_pushPatch(localPatches, 9, index, {
			w: subPatches,
			A: entry
		});

		return;
	}

	// this key has already been removed or moved, a duplicate!
	_VirtualDom_removeNode(changes, localPatches, key + _VirtualDom_POSTFIX, vnode, index);
}



// ADD DOM NODES
//
// Each DOM node has an "index" assigned in order of traversal. It is important
// to minimize our crawl over the actual DOM, so these indexes (along with the
// descendantsCount of virtual nodes) let us skip touching entire subtrees of
// the DOM if we know there are no patches there.


function _VirtualDom_addDomNodes(domNode, vNode, patches, eventNode)
{
	_VirtualDom_addDomNodesHelp(domNode, vNode, patches, 0, 0, vNode.b, eventNode);
}


// assumes `patches` is non-empty and indexes increase monotonically.
function _VirtualDom_addDomNodesHelp(domNode, vNode, patches, i, low, high, eventNode)
{
	var patch = patches[i];
	var index = patch.r;

	while (index === low)
	{
		var patchType = patch.$;

		if (patchType === 1)
		{
			_VirtualDom_addDomNodes(domNode, vNode.k, patch.s, eventNode);
		}
		else if (patchType === 8)
		{
			patch.t = domNode;
			patch.u = eventNode;

			var subPatches = patch.s.w;
			if (subPatches.length > 0)
			{
				_VirtualDom_addDomNodesHelp(domNode, vNode, subPatches, 0, low, high, eventNode);
			}
		}
		else if (patchType === 9)
		{
			patch.t = domNode;
			patch.u = eventNode;

			var data = patch.s;
			if (data)
			{
				data.A.s = domNode;
				var subPatches = data.w;
				if (subPatches.length > 0)
				{
					_VirtualDom_addDomNodesHelp(domNode, vNode, subPatches, 0, low, high, eventNode);
				}
			}
		}
		else
		{
			patch.t = domNode;
			patch.u = eventNode;
		}

		i++;

		if (!(patch = patches[i]) || (index = patch.r) > high)
		{
			return i;
		}
	}

	var tag = vNode.$;

	if (tag === 4)
	{
		var subNode = vNode.k;

		while (subNode.$ === 4)
		{
			subNode = subNode.k;
		}

		return _VirtualDom_addDomNodesHelp(domNode, subNode, patches, i, low + 1, high, domNode.elm_event_node_ref);
	}

	// tag must be 1 or 2 at this point

	var vKids = vNode.e;
	var childNodes = domNode.childNodes;
	for (var j = 0; j < vKids.length; j++)
	{
		low++;
		var vKid = tag === 1 ? vKids[j] : vKids[j].b;
		var nextLow = low + (vKid.b || 0);
		if (low <= index && index <= nextLow)
		{
			i = _VirtualDom_addDomNodesHelp(childNodes[j], vKid, patches, i, low, nextLow, eventNode);
			if (!(patch = patches[i]) || (index = patch.r) > high)
			{
				return i;
			}
		}
		low = nextLow;
	}
	return i;
}



// APPLY PATCHES


function _VirtualDom_applyPatches(rootDomNode, oldVirtualNode, patches, eventNode)
{
	if (patches.length === 0)
	{
		return rootDomNode;
	}

	_VirtualDom_addDomNodes(rootDomNode, oldVirtualNode, patches, eventNode);
	return _VirtualDom_applyPatchesHelp(rootDomNode, patches);
}

function _VirtualDom_applyPatchesHelp(rootDomNode, patches)
{
	for (var i = 0; i < patches.length; i++)
	{
		var patch = patches[i];
		var localDomNode = patch.t
		var newNode = _VirtualDom_applyPatch(localDomNode, patch);
		if (localDomNode === rootDomNode)
		{
			rootDomNode = newNode;
		}
	}
	return rootDomNode;
}

function _VirtualDom_applyPatch(domNode, patch)
{
	switch (patch.$)
	{
		case 0:
			return _VirtualDom_applyPatchRedraw(domNode, patch.s, patch.u);

		case 4:
			_VirtualDom_applyFacts(domNode, patch.u, patch.s);
			return domNode;

		case 3:
			domNode.replaceData(0, domNode.length, patch.s);
			return domNode;

		case 1:
			return _VirtualDom_applyPatchesHelp(domNode, patch.s);

		case 2:
			if (domNode.elm_event_node_ref)
			{
				domNode.elm_event_node_ref.j = patch.s;
			}
			else
			{
				domNode.elm_event_node_ref = { j: patch.s, p: patch.u };
			}
			return domNode;

		case 6:
			var data = patch.s;
			for (var i = 0; i < data.i; i++)
			{
				domNode.removeChild(domNode.childNodes[data.v]);
			}
			return domNode;

		case 7:
			var data = patch.s;
			var kids = data.e;
			var i = data.v;
			var theEnd = domNode.childNodes[i];
			for (; i < kids.length; i++)
			{
				domNode.insertBefore(_VirtualDom_render(kids[i], patch.u), theEnd);
			}
			return domNode;

		case 9:
			var data = patch.s;
			if (!data)
			{
				domNode.parentNode.removeChild(domNode);
				return domNode;
			}
			var entry = data.A;
			if (typeof entry.r !== 'undefined')
			{
				domNode.parentNode.removeChild(domNode);
			}
			entry.s = _VirtualDom_applyPatchesHelp(domNode, data.w);
			return domNode;

		case 8:
			return _VirtualDom_applyPatchReorder(domNode, patch);

		case 5:
			return patch.s(domNode);

		default:
			_Debug_crash(10); // 'Ran into an unknown patch!'
	}
}


function _VirtualDom_applyPatchRedraw(domNode, vNode, eventNode)
{
	var parentNode = domNode.parentNode;
	var newNode = _VirtualDom_render(vNode, eventNode);

	if (!newNode.elm_event_node_ref)
	{
		newNode.elm_event_node_ref = domNode.elm_event_node_ref;
	}

	if (parentNode && newNode !== domNode)
	{
		parentNode.replaceChild(newNode, domNode);
	}
	return newNode;
}


function _VirtualDom_applyPatchReorder(domNode, patch)
{
	var data = patch.s;

	// remove end inserts
	var frag = _VirtualDom_applyPatchReorderEndInsertsHelp(data.y, patch);

	// removals
	domNode = _VirtualDom_applyPatchesHelp(domNode, data.w);

	// inserts
	var inserts = data.x;
	for (var i = 0; i < inserts.length; i++)
	{
		var insert = inserts[i];
		var entry = insert.A;
		var node = entry.c === 2
			? entry.s
			: _VirtualDom_render(entry.z, patch.u);
		domNode.insertBefore(node, domNode.childNodes[insert.r]);
	}

	// add end inserts
	if (frag)
	{
		_VirtualDom_appendChild(domNode, frag);
	}

	return domNode;
}


function _VirtualDom_applyPatchReorderEndInsertsHelp(endInserts, patch)
{
	if (!endInserts)
	{
		return;
	}

	var frag = _VirtualDom_doc.createDocumentFragment();
	for (var i = 0; i < endInserts.length; i++)
	{
		var insert = endInserts[i];
		var entry = insert.A;
		_VirtualDom_appendChild(frag, entry.c === 2
			? entry.s
			: _VirtualDom_render(entry.z, patch.u)
		);
	}
	return frag;
}


function _VirtualDom_virtualize(node)
{
	// TEXT NODES

	if (node.nodeType === 3)
	{
		return _VirtualDom_text(node.textContent);
	}


	// WEIRD NODES

	if (node.nodeType !== 1)
	{
		return _VirtualDom_text('');
	}


	// ELEMENT NODES

	var attrList = _List_Nil;
	var attrs = node.attributes;
	for (var i = attrs.length; i--; )
	{
		var attr = attrs[i];
		var name = attr.name;
		var value = attr.value;
		attrList = _List_Cons( A2(_VirtualDom_attribute, name, value), attrList );
	}

	var tag = node.tagName.toLowerCase();
	var kidList = _List_Nil;
	var kids = node.childNodes;

	for (var i = kids.length; i--; )
	{
		kidList = _List_Cons(_VirtualDom_virtualize(kids[i]), kidList);
	}
	return A3(_VirtualDom_node, tag, attrList, kidList);
}

function _VirtualDom_dekey(keyedNode)
{
	var keyedKids = keyedNode.e;
	var len = keyedKids.length;
	var kids = new Array(len);
	for (var i = 0; i < len; i++)
	{
		kids[i] = keyedKids[i].b;
	}

	return {
		$: 1,
		c: keyedNode.c,
		d: keyedNode.d,
		e: kids,
		f: keyedNode.f,
		b: keyedNode.b
	};
}




// ELEMENT


var _Debugger_element;

var _Browser_element = _Debugger_element || F4(function(impl, flagDecoder, debugMetadata, args)
{
	return _Platform_initialize(
		flagDecoder,
		args,
		impl.fU,
		impl.hm,
		impl.g_,
		function(sendToApp, initialModel) {
			var view = impl.ho;
			/**/
			var domNode = args['node'];
			//*/
			/**_UNUSED/
			var domNode = args && args['node'] ? args['node'] : _Debug_crash(0);
			//*/
			var currNode = _VirtualDom_virtualize(domNode);

			return _Browser_makeAnimator(initialModel, function(model)
			{
				var nextNode = view(model);
				var patches = _VirtualDom_diff(currNode, nextNode);
				domNode = _VirtualDom_applyPatches(domNode, currNode, patches, sendToApp);
				currNode = nextNode;
			});
		}
	);
});



// DOCUMENT


var _Debugger_document;

var _Browser_document = _Debugger_document || F4(function(impl, flagDecoder, debugMetadata, args)
{
	return _Platform_initialize(
		flagDecoder,
		args,
		impl.fU,
		impl.hm,
		impl.g_,
		function(sendToApp, initialModel) {
			var divertHrefToApp = impl.cX && impl.cX(sendToApp)
			var view = impl.ho;
			var title = _VirtualDom_doc.title;
			var bodyNode = _VirtualDom_doc.body;
			var currNode = _VirtualDom_virtualize(bodyNode);
			return _Browser_makeAnimator(initialModel, function(model)
			{
				_VirtualDom_divertHrefToApp = divertHrefToApp;
				var doc = view(model);
				var nextNode = _VirtualDom_node('body')(_List_Nil)(doc.e5);
				var patches = _VirtualDom_diff(currNode, nextNode);
				bodyNode = _VirtualDom_applyPatches(bodyNode, currNode, patches, sendToApp);
				currNode = nextNode;
				_VirtualDom_divertHrefToApp = 0;
				(title !== doc.hg) && (_VirtualDom_doc.title = title = doc.hg);
			});
		}
	);
});



// ANIMATION


var _Browser_cancelAnimationFrame =
	typeof cancelAnimationFrame !== 'undefined'
		? cancelAnimationFrame
		: function(id) { clearTimeout(id); };

var _Browser_requestAnimationFrame =
	typeof requestAnimationFrame !== 'undefined'
		? requestAnimationFrame
		: function(callback) { return setTimeout(callback, 1000 / 60); };


function _Browser_makeAnimator(model, draw)
{
	draw(model);

	var state = 0;

	function updateIfNeeded()
	{
		state = state === 1
			? 0
			: ( _Browser_requestAnimationFrame(updateIfNeeded), draw(model), 1 );
	}

	return function(nextModel, isSync)
	{
		model = nextModel;

		isSync
			? ( draw(model),
				state === 2 && (state = 1)
				)
			: ( state === 0 && _Browser_requestAnimationFrame(updateIfNeeded),
				state = 2
				);
	};
}



// APPLICATION


function _Browser_application(impl)
{
	var onUrlChange = impl.gj;
	var onUrlRequest = impl.gk;
	var key = function() { key.a(onUrlChange(_Browser_getUrl())); };

	return _Browser_document({
		cX: function(sendToApp)
		{
			key.a = sendToApp;
			_Browser_window.addEventListener('popstate', key);
			_Browser_window.navigator.userAgent.indexOf('Trident') < 0 || _Browser_window.addEventListener('hashchange', key);

			return F2(function(domNode, event)
			{
				if (!event.ctrlKey && !event.metaKey && !event.shiftKey && event.button < 1 && !domNode.target && !domNode.hasAttribute('download'))
				{
					event.preventDefault();
					var href = domNode.href;
					var curr = _Browser_getUrl();
					var next = $elm$url$Url$fromString(href).a;
					sendToApp(onUrlRequest(
						(next
							&& curr.d8 === next.d8
							&& curr.dF === next.dF
							&& curr.d3.a === next.d3.a
						)
							? $elm$browser$Browser$Internal(next)
							: $elm$browser$Browser$External(href)
					));
				}
			});
		},
		fU: function(flags)
		{
			return A3(impl.fU, flags, _Browser_getUrl(), key);
		},
		ho: impl.ho,
		hm: impl.hm,
		g_: impl.g_
	});
}

function _Browser_getUrl()
{
	return $elm$url$Url$fromString(_VirtualDom_doc.location.href).a || _Debug_crash(1);
}

var _Browser_go = F2(function(key, n)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function() {
		n && history.go(n);
		key();
	}));
});

var _Browser_pushUrl = F2(function(key, url)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function() {
		history.pushState({}, '', url);
		key();
	}));
});

var _Browser_replaceUrl = F2(function(key, url)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function() {
		history.replaceState({}, '', url);
		key();
	}));
});



// GLOBAL EVENTS


var _Browser_fakeNode = { addEventListener: function() {}, removeEventListener: function() {} };
var _Browser_doc = typeof document !== 'undefined' ? document : _Browser_fakeNode;
var _Browser_window = typeof window !== 'undefined' ? window : _Browser_fakeNode;

var _Browser_on = F3(function(node, eventName, sendToSelf)
{
	return _Scheduler_spawn(_Scheduler_binding(function(callback)
	{
		function handler(event)	{ _Scheduler_rawSpawn(sendToSelf(event)); }
		node.addEventListener(eventName, handler, _VirtualDom_passiveSupported && { passive: true });
		return function() { node.removeEventListener(eventName, handler); };
	}));
});

var _Browser_decodeEvent = F2(function(decoder, event)
{
	var result = _Json_runHelp(decoder, event);
	return $elm$core$Result$isOk(result) ? $elm$core$Maybe$Just(result.a) : $elm$core$Maybe$Nothing;
});



// PAGE VISIBILITY


function _Browser_visibilityInfo()
{
	return (typeof _VirtualDom_doc.hidden !== 'undefined')
		? { fL: 'hidden', fe: 'visibilitychange' }
		:
	(typeof _VirtualDom_doc.mozHidden !== 'undefined')
		? { fL: 'mozHidden', fe: 'mozvisibilitychange' }
		:
	(typeof _VirtualDom_doc.msHidden !== 'undefined')
		? { fL: 'msHidden', fe: 'msvisibilitychange' }
		:
	(typeof _VirtualDom_doc.webkitHidden !== 'undefined')
		? { fL: 'webkitHidden', fe: 'webkitvisibilitychange' }
		: { fL: 'hidden', fe: 'visibilitychange' };
}



// ANIMATION FRAMES


function _Browser_rAF()
{
	return _Scheduler_binding(function(callback)
	{
		var id = _Browser_requestAnimationFrame(function() {
			callback(_Scheduler_succeed(Date.now()));
		});

		return function() {
			_Browser_cancelAnimationFrame(id);
		};
	});
}


function _Browser_now()
{
	return _Scheduler_binding(function(callback)
	{
		callback(_Scheduler_succeed(Date.now()));
	});
}



// DOM STUFF


function _Browser_withNode(id, doStuff)
{
	return _Scheduler_binding(function(callback)
	{
		_Browser_requestAnimationFrame(function() {
			var node = document.getElementById(id);
			callback(node
				? _Scheduler_succeed(doStuff(node))
				: _Scheduler_fail($elm$browser$Browser$Dom$NotFound(id))
			);
		});
	});
}


function _Browser_withWindow(doStuff)
{
	return _Scheduler_binding(function(callback)
	{
		_Browser_requestAnimationFrame(function() {
			callback(_Scheduler_succeed(doStuff()));
		});
	});
}


// FOCUS and BLUR


var _Browser_call = F2(function(functionName, id)
{
	return _Browser_withNode(id, function(node) {
		node[functionName]();
		return _Utils_Tuple0;
	});
});



// WINDOW VIEWPORT


function _Browser_getViewport()
{
	return {
		ej: _Browser_getScene(),
		eF: {
			eI: _Browser_window.pageXOffset,
			eJ: _Browser_window.pageYOffset,
			Y: _Browser_doc.documentElement.clientWidth,
			dB: _Browser_doc.documentElement.clientHeight
		}
	};
}

function _Browser_getScene()
{
	var body = _Browser_doc.body;
	var elem = _Browser_doc.documentElement;
	return {
		Y: Math.max(body.scrollWidth, body.offsetWidth, elem.scrollWidth, elem.offsetWidth, elem.clientWidth),
		dB: Math.max(body.scrollHeight, body.offsetHeight, elem.scrollHeight, elem.offsetHeight, elem.clientHeight)
	};
}

var _Browser_setViewport = F2(function(x, y)
{
	return _Browser_withWindow(function()
	{
		_Browser_window.scroll(x, y);
		return _Utils_Tuple0;
	});
});



// ELEMENT VIEWPORT


function _Browser_getViewportOf(id)
{
	return _Browser_withNode(id, function(node)
	{
		return {
			ej: {
				Y: node.scrollWidth,
				dB: node.scrollHeight
			},
			eF: {
				eI: node.scrollLeft,
				eJ: node.scrollTop,
				Y: node.clientWidth,
				dB: node.clientHeight
			}
		};
	});
}


var _Browser_setViewportOf = F3(function(id, x, y)
{
	return _Browser_withNode(id, function(node)
	{
		node.scrollLeft = x;
		node.scrollTop = y;
		return _Utils_Tuple0;
	});
});



// ELEMENT


function _Browser_getElement(id)
{
	return _Browser_withNode(id, function(node)
	{
		var rect = node.getBoundingClientRect();
		var x = _Browser_window.pageXOffset;
		var y = _Browser_window.pageYOffset;
		return {
			ej: _Browser_getScene(),
			eF: {
				eI: x,
				eJ: y,
				Y: _Browser_doc.documentElement.clientWidth,
				dB: _Browser_doc.documentElement.clientHeight
			},
			_: {
				eI: x + rect.left,
				eJ: y + rect.top,
				Y: rect.width,
				dB: rect.height
			}
		};
	});
}



// LOAD and RELOAD


function _Browser_reload(skipCache)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function(callback)
	{
		_VirtualDom_doc.location.reload(skipCache);
	}));
}

function _Browser_load(url)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function(callback)
	{
		try
		{
			_Browser_window.location = url;
		}
		catch(err)
		{
			// Only Firefox can throw a NS_ERROR_MALFORMED_URI exception here.
			// Other browsers reload the page, so let's be consistent about that.
			_VirtualDom_doc.location.reload(false);
		}
	}));
}



function _Time_now(millisToPosix)
{
	return _Scheduler_binding(function(callback)
	{
		callback(_Scheduler_succeed(millisToPosix(Date.now())));
	});
}

var _Time_setInterval = F2(function(interval, task)
{
	return _Scheduler_binding(function(callback)
	{
		var id = setInterval(function() { _Scheduler_rawSpawn(task); }, interval);
		return function() { clearInterval(id); };
	});
});

function _Time_here()
{
	return _Scheduler_binding(function(callback)
	{
		callback(_Scheduler_succeed(
			A2($elm$time$Time$customZone, -(new Date().getTimezoneOffset()), _List_Nil)
		));
	});
}


function _Time_getZoneName()
{
	return _Scheduler_binding(function(callback)
	{
		try
		{
			var name = $elm$time$Time$Name(Intl.DateTimeFormat().resolvedOptions().timeZone);
		}
		catch (e)
		{
			var name = $elm$time$Time$Offset(new Date().getTimezoneOffset());
		}
		callback(_Scheduler_succeed(name));
	});
}



// SEND REQUEST

var _Http_toTask = F3(function(router, toTask, request)
{
	return _Scheduler_binding(function(callback)
	{
		function done(response) {
			callback(toTask(request.ch.a(response)));
		}

		var xhr = new XMLHttpRequest();
		xhr.addEventListener('error', function() { done($elm$http$Http$NetworkError_); });
		xhr.addEventListener('timeout', function() { done($elm$http$Http$Timeout_); });
		xhr.addEventListener('load', function() { done(_Http_toResponse(request.ch.b, xhr)); });
		$elm$core$Maybe$isJust(request.ex) && _Http_track(router, xhr, request.ex.a);

		try {
			xhr.open(request.bp, request.hn, true);
		} catch (e) {
			return done($elm$http$Http$BadUrl_(request.hn));
		}

		_Http_configureRequest(xhr, request);

		request.e5.a && xhr.setRequestHeader('Content-Type', request.e5.a);
		xhr.send(request.e5.b);

		return function() { xhr.c = true; xhr.abort(); };
	});
});


// CONFIGURE

function _Http_configureRequest(xhr, request)
{
	for (var headers = request.fJ; headers.b; headers = headers.b) // WHILE_CONS
	{
		xhr.setRequestHeader(headers.a.a, headers.a.b);
	}
	xhr.timeout = request.hf.a || 0;
	xhr.responseType = request.ch.d;
	xhr.withCredentials = request.eW;
}


// RESPONSES

function _Http_toResponse(toBody, xhr)
{
	return A2(
		200 <= xhr.status && xhr.status < 300 ? $elm$http$Http$GoodStatus_ : $elm$http$Http$BadStatus_,
		_Http_toMetadata(xhr),
		toBody(xhr.response)
	);
}


// METADATA

function _Http_toMetadata(xhr)
{
	return {
		hn: xhr.responseURL,
		eu: xhr.status,
		gU: xhr.statusText,
		fJ: _Http_parseHeaders(xhr.getAllResponseHeaders())
	};
}


// HEADERS

function _Http_parseHeaders(rawHeaders)
{
	if (!rawHeaders)
	{
		return $elm$core$Dict$empty;
	}

	var headers = $elm$core$Dict$empty;
	var headerPairs = rawHeaders.split('\r\n');
	for (var i = headerPairs.length; i--; )
	{
		var headerPair = headerPairs[i];
		var index = headerPair.indexOf(': ');
		if (index > 0)
		{
			var key = headerPair.substring(0, index);
			var value = headerPair.substring(index + 2);

			headers = A3($elm$core$Dict$update, key, function(oldValue) {
				return $elm$core$Maybe$Just($elm$core$Maybe$isJust(oldValue)
					? value + ', ' + oldValue.a
					: value
				);
			}, headers);
		}
	}
	return headers;
}


// EXPECT

var _Http_expect = F3(function(type, toBody, toValue)
{
	return {
		$: 0,
		d: type,
		b: toBody,
		a: toValue
	};
});

var _Http_mapExpect = F2(function(func, expect)
{
	return {
		$: 0,
		d: expect.d,
		b: expect.b,
		a: function(x) { return func(expect.a(x)); }
	};
});

function _Http_toDataView(arrayBuffer)
{
	return new DataView(arrayBuffer);
}


// BODY and PARTS

var _Http_emptyBody = { $: 0 };
var _Http_pair = F2(function(a, b) { return { $: 0, a: a, b: b }; });

function _Http_toFormData(parts)
{
	for (var formData = new FormData(); parts.b; parts = parts.b) // WHILE_CONS
	{
		var part = parts.a;
		formData.append(part.a, part.b);
	}
	return formData;
}

var _Http_bytesToBlob = F2(function(mime, bytes)
{
	return new Blob([bytes], { type: mime });
});


// PROGRESS

function _Http_track(router, xhr, tracker)
{
	// TODO check out lengthComputable on loadstart event

	xhr.upload.addEventListener('progress', function(event) {
		if (xhr.c) { return; }
		_Scheduler_rawSpawn(A2($elm$core$Platform$sendToSelf, router, _Utils_Tuple2(tracker, $elm$http$Http$Sending({
			gL: event.loaded,
			ep: event.total
		}))));
	});
	xhr.addEventListener('progress', function(event) {
		if (xhr.c) { return; }
		_Scheduler_rawSpawn(A2($elm$core$Platform$sendToSelf, router, _Utils_Tuple2(tracker, $elm$http$Http$Receiving({
			gw: event.loaded,
			ep: event.lengthComputable ? $elm$core$Maybe$Just(event.total) : $elm$core$Maybe$Nothing
		}))));
	});
}

function _Url_percentEncode(string)
{
	return encodeURIComponent(string);
}

function _Url_percentDecode(string)
{
	try
	{
		return $elm$core$Maybe$Just(decodeURIComponent(string));
	}
	catch (e)
	{
		return $elm$core$Maybe$Nothing;
	}
}


var _Bitwise_and = F2(function(a, b)
{
	return a & b;
});

var _Bitwise_or = F2(function(a, b)
{
	return a | b;
});

var _Bitwise_xor = F2(function(a, b)
{
	return a ^ b;
});

function _Bitwise_complement(a)
{
	return ~a;
};

var _Bitwise_shiftLeftBy = F2(function(offset, a)
{
	return a << offset;
});

var _Bitwise_shiftRightBy = F2(function(offset, a)
{
	return a >> offset;
});

var _Bitwise_shiftRightZfBy = F2(function(offset, a)
{
	return a >>> offset;
});


// CREATE

var _Regex_never = /.^/;

var _Regex_fromStringWith = F2(function(options, string)
{
	var flags = 'g';
	if (options.gb) { flags += 'm'; }
	if (options.fd) { flags += 'i'; }

	try
	{
		return $elm$core$Maybe$Just(new RegExp(string, flags));
	}
	catch(error)
	{
		return $elm$core$Maybe$Nothing;
	}
});


// USE

var _Regex_contains = F2(function(re, string)
{
	return string.match(re) !== null;
});


var _Regex_findAtMost = F3(function(n, re, str)
{
	var out = [];
	var number = 0;
	var string = str;
	var lastIndex = re.lastIndex;
	var prevLastIndex = -1;
	var result;
	while (number++ < n && (result = re.exec(string)))
	{
		if (prevLastIndex == re.lastIndex) break;
		var i = result.length - 1;
		var subs = new Array(i);
		while (i > 0)
		{
			var submatch = result[i];
			subs[--i] = submatch
				? $elm$core$Maybe$Just(submatch)
				: $elm$core$Maybe$Nothing;
		}
		out.push(A4($elm$regex$Regex$Match, result[0], result.index, number, _List_fromArray(subs)));
		prevLastIndex = re.lastIndex;
	}
	re.lastIndex = lastIndex;
	return _List_fromArray(out);
});


var _Regex_replaceAtMost = F4(function(n, re, replacer, string)
{
	var count = 0;
	function jsReplacer(match)
	{
		if (count++ >= n)
		{
			return match;
		}
		var i = arguments.length - 3;
		var submatches = new Array(i);
		while (i > 0)
		{
			var submatch = arguments[i];
			submatches[--i] = submatch
				? $elm$core$Maybe$Just(submatch)
				: $elm$core$Maybe$Nothing;
		}
		return replacer(A4($elm$regex$Regex$Match, match, arguments[arguments.length - 2], count, _List_fromArray(submatches)));
	}
	return string.replace(re, jsReplacer);
});

var _Regex_splitAtMost = F3(function(n, re, str)
{
	var string = str;
	var out = [];
	var start = re.lastIndex;
	var restoreLastIndex = re.lastIndex;
	while (n--)
	{
		var result = re.exec(string);
		if (!result) break;
		out.push(string.slice(start, result.index));
		start = re.lastIndex;
	}
	out.push(string.slice(start));
	re.lastIndex = restoreLastIndex;
	return _List_fromArray(out);
});

var _Regex_infinity = Infinity;




// STRINGS


var _Parser_isSubString = F5(function(smallString, offset, row, col, bigString)
{
	var smallLength = smallString.length;
	var isGood = offset + smallLength <= bigString.length;

	for (var i = 0; isGood && i < smallLength; )
	{
		var code = bigString.charCodeAt(offset);
		isGood =
			smallString[i++] === bigString[offset++]
			&& (
				code === 0x000A /* \n */
					? ( row++, col=1 )
					: ( col++, (code & 0xF800) === 0xD800 ? smallString[i++] === bigString[offset++] : 1 )
			)
	}

	return _Utils_Tuple3(isGood ? offset : -1, row, col);
});



// CHARS


var _Parser_isSubChar = F3(function(predicate, offset, string)
{
	return (
		string.length <= offset
			? -1
			:
		(string.charCodeAt(offset) & 0xF800) === 0xD800
			? (predicate(_Utils_chr(string.substr(offset, 2))) ? offset + 2 : -1)
			:
		(predicate(_Utils_chr(string[offset]))
			? ((string[offset] === '\n') ? -2 : (offset + 1))
			: -1
		)
	);
});


var _Parser_isAsciiCode = F3(function(code, offset, string)
{
	return string.charCodeAt(offset) === code;
});



// NUMBERS


var _Parser_chompBase10 = F2(function(offset, string)
{
	for (; offset < string.length; offset++)
	{
		var code = string.charCodeAt(offset);
		if (code < 0x30 || 0x39 < code)
		{
			return offset;
		}
	}
	return offset;
});


var _Parser_consumeBase = F3(function(base, offset, string)
{
	for (var total = 0; offset < string.length; offset++)
	{
		var digit = string.charCodeAt(offset) - 0x30;
		if (digit < 0 || base <= digit) break;
		total = base * total + digit;
	}
	return _Utils_Tuple2(offset, total);
});


var _Parser_consumeBase16 = F2(function(offset, string)
{
	for (var total = 0; offset < string.length; offset++)
	{
		var code = string.charCodeAt(offset);
		if (0x30 <= code && code <= 0x39)
		{
			total = 16 * total + code - 0x30;
		}
		else if (0x41 <= code && code <= 0x46)
		{
			total = 16 * total + code - 55;
		}
		else if (0x61 <= code && code <= 0x66)
		{
			total = 16 * total + code - 87;
		}
		else
		{
			break;
		}
	}
	return _Utils_Tuple2(offset, total);
});



// FIND STRING


var _Parser_findSubString = F5(function(smallString, offset, row, col, bigString)
{
	var newOffset = bigString.indexOf(smallString, offset);
	var target = newOffset < 0 ? bigString.length : newOffset + smallString.length;

	while (offset < target)
	{
		var code = bigString.charCodeAt(offset++);
		code === 0x000A /* \n */
			? ( col=1, row++ )
			: ( col++, (code & 0xF800) === 0xD800 && offset++ )
	}

	return _Utils_Tuple3(newOffset, row, col);
});
var $elm$core$Basics$EQ = 1;
var $elm$core$Basics$GT = 2;
var $elm$core$Basics$LT = 0;
var $elm$core$List$cons = _List_cons;
var $elm$core$Dict$foldr = F3(
	function (func, acc, t) {
		foldr:
		while (true) {
			if (t.$ === -2) {
				return acc;
			} else {
				var key = t.b;
				var value = t.c;
				var left = t.d;
				var right = t.e;
				var $temp$func = func,
					$temp$acc = A3(
					func,
					key,
					value,
					A3($elm$core$Dict$foldr, func, acc, right)),
					$temp$t = left;
				func = $temp$func;
				acc = $temp$acc;
				t = $temp$t;
				continue foldr;
			}
		}
	});
var $elm$core$Dict$toList = function (dict) {
	return A3(
		$elm$core$Dict$foldr,
		F3(
			function (key, value, list) {
				return A2(
					$elm$core$List$cons,
					_Utils_Tuple2(key, value),
					list);
			}),
		_List_Nil,
		dict);
};
var $elm$core$Dict$keys = function (dict) {
	return A3(
		$elm$core$Dict$foldr,
		F3(
			function (key, value, keyList) {
				return A2($elm$core$List$cons, key, keyList);
			}),
		_List_Nil,
		dict);
};
var $elm$core$Set$toList = function (_v0) {
	var dict = _v0;
	return $elm$core$Dict$keys(dict);
};
var $elm$core$Elm$JsArray$foldr = _JsArray_foldr;
var $elm$core$Array$foldr = F3(
	function (func, baseCase, _v0) {
		var tree = _v0.c;
		var tail = _v0.d;
		var helper = F2(
			function (node, acc) {
				if (!node.$) {
					var subTree = node.a;
					return A3($elm$core$Elm$JsArray$foldr, helper, acc, subTree);
				} else {
					var values = node.a;
					return A3($elm$core$Elm$JsArray$foldr, func, acc, values);
				}
			});
		return A3(
			$elm$core$Elm$JsArray$foldr,
			helper,
			A3($elm$core$Elm$JsArray$foldr, func, baseCase, tail),
			tree);
	});
var $elm$core$Array$toList = function (array) {
	return A3($elm$core$Array$foldr, $elm$core$List$cons, _List_Nil, array);
};
var $elm$core$Result$Err = function (a) {
	return {$: 1, a: a};
};
var $elm$json$Json$Decode$Failure = F2(
	function (a, b) {
		return {$: 3, a: a, b: b};
	});
var $elm$json$Json$Decode$Field = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var $elm$json$Json$Decode$Index = F2(
	function (a, b) {
		return {$: 1, a: a, b: b};
	});
var $elm$core$Result$Ok = function (a) {
	return {$: 0, a: a};
};
var $elm$json$Json$Decode$OneOf = function (a) {
	return {$: 2, a: a};
};
var $elm$core$Basics$False = 1;
var $elm$core$Basics$add = _Basics_add;
var $elm$core$Maybe$Just = function (a) {
	return {$: 0, a: a};
};
var $elm$core$Maybe$Nothing = {$: 1};
var $elm$core$String$all = _String_all;
var $elm$core$Basics$and = _Basics_and;
var $elm$core$Basics$append = _Utils_append;
var $elm$json$Json$Encode$encode = _Json_encode;
var $elm$core$String$fromInt = _String_fromNumber;
var $elm$core$String$join = F2(
	function (sep, chunks) {
		return A2(
			_String_join,
			sep,
			_List_toArray(chunks));
	});
var $elm$core$String$split = F2(
	function (sep, string) {
		return _List_fromArray(
			A2(_String_split, sep, string));
	});
var $elm$json$Json$Decode$indent = function (str) {
	return A2(
		$elm$core$String$join,
		'\n    ',
		A2($elm$core$String$split, '\n', str));
};
var $elm$core$List$foldl = F3(
	function (func, acc, list) {
		foldl:
		while (true) {
			if (!list.b) {
				return acc;
			} else {
				var x = list.a;
				var xs = list.b;
				var $temp$func = func,
					$temp$acc = A2(func, x, acc),
					$temp$list = xs;
				func = $temp$func;
				acc = $temp$acc;
				list = $temp$list;
				continue foldl;
			}
		}
	});
var $elm$core$List$length = function (xs) {
	return A3(
		$elm$core$List$foldl,
		F2(
			function (_v0, i) {
				return i + 1;
			}),
		0,
		xs);
};
var $elm$core$List$map2 = _List_map2;
var $elm$core$Basics$le = _Utils_le;
var $elm$core$Basics$sub = _Basics_sub;
var $elm$core$List$rangeHelp = F3(
	function (lo, hi, list) {
		rangeHelp:
		while (true) {
			if (_Utils_cmp(lo, hi) < 1) {
				var $temp$lo = lo,
					$temp$hi = hi - 1,
					$temp$list = A2($elm$core$List$cons, hi, list);
				lo = $temp$lo;
				hi = $temp$hi;
				list = $temp$list;
				continue rangeHelp;
			} else {
				return list;
			}
		}
	});
var $elm$core$List$range = F2(
	function (lo, hi) {
		return A3($elm$core$List$rangeHelp, lo, hi, _List_Nil);
	});
var $elm$core$List$indexedMap = F2(
	function (f, xs) {
		return A3(
			$elm$core$List$map2,
			f,
			A2(
				$elm$core$List$range,
				0,
				$elm$core$List$length(xs) - 1),
			xs);
	});
var $elm$core$Char$toCode = _Char_toCode;
var $elm$core$Char$isLower = function (_char) {
	var code = $elm$core$Char$toCode(_char);
	return (97 <= code) && (code <= 122);
};
var $elm$core$Char$isUpper = function (_char) {
	var code = $elm$core$Char$toCode(_char);
	return (code <= 90) && (65 <= code);
};
var $elm$core$Basics$or = _Basics_or;
var $elm$core$Char$isAlpha = function (_char) {
	return $elm$core$Char$isLower(_char) || $elm$core$Char$isUpper(_char);
};
var $elm$core$Char$isDigit = function (_char) {
	var code = $elm$core$Char$toCode(_char);
	return (code <= 57) && (48 <= code);
};
var $elm$core$Char$isAlphaNum = function (_char) {
	return $elm$core$Char$isLower(_char) || ($elm$core$Char$isUpper(_char) || $elm$core$Char$isDigit(_char));
};
var $elm$core$List$reverse = function (list) {
	return A3($elm$core$List$foldl, $elm$core$List$cons, _List_Nil, list);
};
var $elm$core$String$uncons = _String_uncons;
var $elm$json$Json$Decode$errorOneOf = F2(
	function (i, error) {
		return '\n\n(' + ($elm$core$String$fromInt(i + 1) + (') ' + $elm$json$Json$Decode$indent(
			$elm$json$Json$Decode$errorToString(error))));
	});
var $elm$json$Json$Decode$errorToString = function (error) {
	return A2($elm$json$Json$Decode$errorToStringHelp, error, _List_Nil);
};
var $elm$json$Json$Decode$errorToStringHelp = F2(
	function (error, context) {
		errorToStringHelp:
		while (true) {
			switch (error.$) {
				case 0:
					var f = error.a;
					var err = error.b;
					var isSimple = function () {
						var _v1 = $elm$core$String$uncons(f);
						if (_v1.$ === 1) {
							return false;
						} else {
							var _v2 = _v1.a;
							var _char = _v2.a;
							var rest = _v2.b;
							return $elm$core$Char$isAlpha(_char) && A2($elm$core$String$all, $elm$core$Char$isAlphaNum, rest);
						}
					}();
					var fieldName = isSimple ? ('.' + f) : ('[\'' + (f + '\']'));
					var $temp$error = err,
						$temp$context = A2($elm$core$List$cons, fieldName, context);
					error = $temp$error;
					context = $temp$context;
					continue errorToStringHelp;
				case 1:
					var i = error.a;
					var err = error.b;
					var indexName = '[' + ($elm$core$String$fromInt(i) + ']');
					var $temp$error = err,
						$temp$context = A2($elm$core$List$cons, indexName, context);
					error = $temp$error;
					context = $temp$context;
					continue errorToStringHelp;
				case 2:
					var errors = error.a;
					if (!errors.b) {
						return 'Ran into a Json.Decode.oneOf with no possibilities' + function () {
							if (!context.b) {
								return '!';
							} else {
								return ' at json' + A2(
									$elm$core$String$join,
									'',
									$elm$core$List$reverse(context));
							}
						}();
					} else {
						if (!errors.b.b) {
							var err = errors.a;
							var $temp$error = err,
								$temp$context = context;
							error = $temp$error;
							context = $temp$context;
							continue errorToStringHelp;
						} else {
							var starter = function () {
								if (!context.b) {
									return 'Json.Decode.oneOf';
								} else {
									return 'The Json.Decode.oneOf at json' + A2(
										$elm$core$String$join,
										'',
										$elm$core$List$reverse(context));
								}
							}();
							var introduction = starter + (' failed in the following ' + ($elm$core$String$fromInt(
								$elm$core$List$length(errors)) + ' ways:'));
							return A2(
								$elm$core$String$join,
								'\n\n',
								A2(
									$elm$core$List$cons,
									introduction,
									A2($elm$core$List$indexedMap, $elm$json$Json$Decode$errorOneOf, errors)));
						}
					}
				default:
					var msg = error.a;
					var json = error.b;
					var introduction = function () {
						if (!context.b) {
							return 'Problem with the given value:\n\n';
						} else {
							return 'Problem with the value at json' + (A2(
								$elm$core$String$join,
								'',
								$elm$core$List$reverse(context)) + ':\n\n    ');
						}
					}();
					return introduction + ($elm$json$Json$Decode$indent(
						A2($elm$json$Json$Encode$encode, 4, json)) + ('\n\n' + msg));
			}
		}
	});
var $elm$core$Array$branchFactor = 32;
var $elm$core$Array$Array_elm_builtin = F4(
	function (a, b, c, d) {
		return {$: 0, a: a, b: b, c: c, d: d};
	});
var $elm$core$Elm$JsArray$empty = _JsArray_empty;
var $elm$core$Basics$ceiling = _Basics_ceiling;
var $elm$core$Basics$fdiv = _Basics_fdiv;
var $elm$core$Basics$logBase = F2(
	function (base, number) {
		return _Basics_log(number) / _Basics_log(base);
	});
var $elm$core$Basics$toFloat = _Basics_toFloat;
var $elm$core$Array$shiftStep = $elm$core$Basics$ceiling(
	A2($elm$core$Basics$logBase, 2, $elm$core$Array$branchFactor));
var $elm$core$Array$empty = A4($elm$core$Array$Array_elm_builtin, 0, $elm$core$Array$shiftStep, $elm$core$Elm$JsArray$empty, $elm$core$Elm$JsArray$empty);
var $elm$core$Elm$JsArray$initialize = _JsArray_initialize;
var $elm$core$Array$Leaf = function (a) {
	return {$: 1, a: a};
};
var $elm$core$Basics$apL = F2(
	function (f, x) {
		return f(x);
	});
var $elm$core$Basics$apR = F2(
	function (x, f) {
		return f(x);
	});
var $elm$core$Basics$eq = _Utils_equal;
var $elm$core$Basics$floor = _Basics_floor;
var $elm$core$Elm$JsArray$length = _JsArray_length;
var $elm$core$Basics$gt = _Utils_gt;
var $elm$core$Basics$max = F2(
	function (x, y) {
		return (_Utils_cmp(x, y) > 0) ? x : y;
	});
var $elm$core$Basics$mul = _Basics_mul;
var $elm$core$Array$SubTree = function (a) {
	return {$: 0, a: a};
};
var $elm$core$Elm$JsArray$initializeFromList = _JsArray_initializeFromList;
var $elm$core$Array$compressNodes = F2(
	function (nodes, acc) {
		compressNodes:
		while (true) {
			var _v0 = A2($elm$core$Elm$JsArray$initializeFromList, $elm$core$Array$branchFactor, nodes);
			var node = _v0.a;
			var remainingNodes = _v0.b;
			var newAcc = A2(
				$elm$core$List$cons,
				$elm$core$Array$SubTree(node),
				acc);
			if (!remainingNodes.b) {
				return $elm$core$List$reverse(newAcc);
			} else {
				var $temp$nodes = remainingNodes,
					$temp$acc = newAcc;
				nodes = $temp$nodes;
				acc = $temp$acc;
				continue compressNodes;
			}
		}
	});
var $elm$core$Tuple$first = function (_v0) {
	var x = _v0.a;
	return x;
};
var $elm$core$Array$treeFromBuilder = F2(
	function (nodeList, nodeListSize) {
		treeFromBuilder:
		while (true) {
			var newNodeSize = $elm$core$Basics$ceiling(nodeListSize / $elm$core$Array$branchFactor);
			if (newNodeSize === 1) {
				return A2($elm$core$Elm$JsArray$initializeFromList, $elm$core$Array$branchFactor, nodeList).a;
			} else {
				var $temp$nodeList = A2($elm$core$Array$compressNodes, nodeList, _List_Nil),
					$temp$nodeListSize = newNodeSize;
				nodeList = $temp$nodeList;
				nodeListSize = $temp$nodeListSize;
				continue treeFromBuilder;
			}
		}
	});
var $elm$core$Array$builderToArray = F2(
	function (reverseNodeList, builder) {
		if (!builder.h) {
			return A4(
				$elm$core$Array$Array_elm_builtin,
				$elm$core$Elm$JsArray$length(builder.i),
				$elm$core$Array$shiftStep,
				$elm$core$Elm$JsArray$empty,
				builder.i);
		} else {
			var treeLen = builder.h * $elm$core$Array$branchFactor;
			var depth = $elm$core$Basics$floor(
				A2($elm$core$Basics$logBase, $elm$core$Array$branchFactor, treeLen - 1));
			var correctNodeList = reverseNodeList ? $elm$core$List$reverse(builder.j) : builder.j;
			var tree = A2($elm$core$Array$treeFromBuilder, correctNodeList, builder.h);
			return A4(
				$elm$core$Array$Array_elm_builtin,
				$elm$core$Elm$JsArray$length(builder.i) + treeLen,
				A2($elm$core$Basics$max, 5, depth * $elm$core$Array$shiftStep),
				tree,
				builder.i);
		}
	});
var $elm$core$Basics$idiv = _Basics_idiv;
var $elm$core$Basics$lt = _Utils_lt;
var $elm$core$Array$initializeHelp = F5(
	function (fn, fromIndex, len, nodeList, tail) {
		initializeHelp:
		while (true) {
			if (fromIndex < 0) {
				return A2(
					$elm$core$Array$builderToArray,
					false,
					{j: nodeList, h: (len / $elm$core$Array$branchFactor) | 0, i: tail});
			} else {
				var leaf = $elm$core$Array$Leaf(
					A3($elm$core$Elm$JsArray$initialize, $elm$core$Array$branchFactor, fromIndex, fn));
				var $temp$fn = fn,
					$temp$fromIndex = fromIndex - $elm$core$Array$branchFactor,
					$temp$len = len,
					$temp$nodeList = A2($elm$core$List$cons, leaf, nodeList),
					$temp$tail = tail;
				fn = $temp$fn;
				fromIndex = $temp$fromIndex;
				len = $temp$len;
				nodeList = $temp$nodeList;
				tail = $temp$tail;
				continue initializeHelp;
			}
		}
	});
var $elm$core$Basics$remainderBy = _Basics_remainderBy;
var $elm$core$Array$initialize = F2(
	function (len, fn) {
		if (len <= 0) {
			return $elm$core$Array$empty;
		} else {
			var tailLen = len % $elm$core$Array$branchFactor;
			var tail = A3($elm$core$Elm$JsArray$initialize, tailLen, len - tailLen, fn);
			var initialFromIndex = (len - tailLen) - $elm$core$Array$branchFactor;
			return A5($elm$core$Array$initializeHelp, fn, initialFromIndex, len, _List_Nil, tail);
		}
	});
var $elm$core$Basics$True = 0;
var $elm$core$Result$isOk = function (result) {
	if (!result.$) {
		return true;
	} else {
		return false;
	}
};
var $elm$json$Json$Decode$map = _Json_map1;
var $elm$json$Json$Decode$map2 = _Json_map2;
var $elm$json$Json$Decode$succeed = _Json_succeed;
var $elm$virtual_dom$VirtualDom$toHandlerInt = function (handler) {
	switch (handler.$) {
		case 0:
			return 0;
		case 1:
			return 1;
		case 2:
			return 2;
		default:
			return 3;
	}
};
var $elm$browser$Browser$External = function (a) {
	return {$: 1, a: a};
};
var $elm$browser$Browser$Internal = function (a) {
	return {$: 0, a: a};
};
var $elm$core$Basics$identity = function (x) {
	return x;
};
var $elm$browser$Browser$Dom$NotFound = $elm$core$Basics$identity;
var $elm$url$Url$Http = 0;
var $elm$url$Url$Https = 1;
var $elm$url$Url$Url = F6(
	function (protocol, host, port_, path, query, fragment) {
		return {dz: fragment, dF: host, d1: path, d3: port_, d8: protocol, d9: query};
	});
var $elm$core$String$contains = _String_contains;
var $elm$core$String$length = _String_length;
var $elm$core$String$slice = _String_slice;
var $elm$core$String$dropLeft = F2(
	function (n, string) {
		return (n < 1) ? string : A3(
			$elm$core$String$slice,
			n,
			$elm$core$String$length(string),
			string);
	});
var $elm$core$String$indexes = _String_indexes;
var $elm$core$String$isEmpty = function (string) {
	return string === '';
};
var $elm$core$String$left = F2(
	function (n, string) {
		return (n < 1) ? '' : A3($elm$core$String$slice, 0, n, string);
	});
var $elm$core$String$toInt = _String_toInt;
var $elm$url$Url$chompBeforePath = F5(
	function (protocol, path, params, frag, str) {
		if ($elm$core$String$isEmpty(str) || A2($elm$core$String$contains, '@', str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, ':', str);
			if (!_v0.b) {
				return $elm$core$Maybe$Just(
					A6($elm$url$Url$Url, protocol, str, $elm$core$Maybe$Nothing, path, params, frag));
			} else {
				if (!_v0.b.b) {
					var i = _v0.a;
					var _v1 = $elm$core$String$toInt(
						A2($elm$core$String$dropLeft, i + 1, str));
					if (_v1.$ === 1) {
						return $elm$core$Maybe$Nothing;
					} else {
						var port_ = _v1;
						return $elm$core$Maybe$Just(
							A6(
								$elm$url$Url$Url,
								protocol,
								A2($elm$core$String$left, i, str),
								port_,
								path,
								params,
								frag));
					}
				} else {
					return $elm$core$Maybe$Nothing;
				}
			}
		}
	});
var $elm$url$Url$chompBeforeQuery = F4(
	function (protocol, params, frag, str) {
		if ($elm$core$String$isEmpty(str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, '/', str);
			if (!_v0.b) {
				return A5($elm$url$Url$chompBeforePath, protocol, '/', params, frag, str);
			} else {
				var i = _v0.a;
				return A5(
					$elm$url$Url$chompBeforePath,
					protocol,
					A2($elm$core$String$dropLeft, i, str),
					params,
					frag,
					A2($elm$core$String$left, i, str));
			}
		}
	});
var $elm$url$Url$chompBeforeFragment = F3(
	function (protocol, frag, str) {
		if ($elm$core$String$isEmpty(str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, '?', str);
			if (!_v0.b) {
				return A4($elm$url$Url$chompBeforeQuery, protocol, $elm$core$Maybe$Nothing, frag, str);
			} else {
				var i = _v0.a;
				return A4(
					$elm$url$Url$chompBeforeQuery,
					protocol,
					$elm$core$Maybe$Just(
						A2($elm$core$String$dropLeft, i + 1, str)),
					frag,
					A2($elm$core$String$left, i, str));
			}
		}
	});
var $elm$url$Url$chompAfterProtocol = F2(
	function (protocol, str) {
		if ($elm$core$String$isEmpty(str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, '#', str);
			if (!_v0.b) {
				return A3($elm$url$Url$chompBeforeFragment, protocol, $elm$core$Maybe$Nothing, str);
			} else {
				var i = _v0.a;
				return A3(
					$elm$url$Url$chompBeforeFragment,
					protocol,
					$elm$core$Maybe$Just(
						A2($elm$core$String$dropLeft, i + 1, str)),
					A2($elm$core$String$left, i, str));
			}
		}
	});
var $elm$core$String$startsWith = _String_startsWith;
var $elm$url$Url$fromString = function (str) {
	return A2($elm$core$String$startsWith, 'http://', str) ? A2(
		$elm$url$Url$chompAfterProtocol,
		0,
		A2($elm$core$String$dropLeft, 7, str)) : (A2($elm$core$String$startsWith, 'https://', str) ? A2(
		$elm$url$Url$chompAfterProtocol,
		1,
		A2($elm$core$String$dropLeft, 8, str)) : $elm$core$Maybe$Nothing);
};
var $elm$core$Basics$never = function (_v0) {
	never:
	while (true) {
		var nvr = _v0;
		var $temp$_v0 = nvr;
		_v0 = $temp$_v0;
		continue never;
	}
};
var $elm$core$Task$Perform = $elm$core$Basics$identity;
var $elm$core$Task$succeed = _Scheduler_succeed;
var $elm$core$Task$init = $elm$core$Task$succeed(0);
var $elm$core$List$foldrHelper = F4(
	function (fn, acc, ctr, ls) {
		if (!ls.b) {
			return acc;
		} else {
			var a = ls.a;
			var r1 = ls.b;
			if (!r1.b) {
				return A2(fn, a, acc);
			} else {
				var b = r1.a;
				var r2 = r1.b;
				if (!r2.b) {
					return A2(
						fn,
						a,
						A2(fn, b, acc));
				} else {
					var c = r2.a;
					var r3 = r2.b;
					if (!r3.b) {
						return A2(
							fn,
							a,
							A2(
								fn,
								b,
								A2(fn, c, acc)));
					} else {
						var d = r3.a;
						var r4 = r3.b;
						var res = (ctr > 500) ? A3(
							$elm$core$List$foldl,
							fn,
							acc,
							$elm$core$List$reverse(r4)) : A4($elm$core$List$foldrHelper, fn, acc, ctr + 1, r4);
						return A2(
							fn,
							a,
							A2(
								fn,
								b,
								A2(
									fn,
									c,
									A2(fn, d, res))));
					}
				}
			}
		}
	});
var $elm$core$List$foldr = F3(
	function (fn, acc, ls) {
		return A4($elm$core$List$foldrHelper, fn, acc, 0, ls);
	});
var $elm$core$List$map = F2(
	function (f, xs) {
		return A3(
			$elm$core$List$foldr,
			F2(
				function (x, acc) {
					return A2(
						$elm$core$List$cons,
						f(x),
						acc);
				}),
			_List_Nil,
			xs);
	});
var $elm$core$Task$andThen = _Scheduler_andThen;
var $elm$core$Task$map = F2(
	function (func, taskA) {
		return A2(
			$elm$core$Task$andThen,
			function (a) {
				return $elm$core$Task$succeed(
					func(a));
			},
			taskA);
	});
var $elm$core$Task$map2 = F3(
	function (func, taskA, taskB) {
		return A2(
			$elm$core$Task$andThen,
			function (a) {
				return A2(
					$elm$core$Task$andThen,
					function (b) {
						return $elm$core$Task$succeed(
							A2(func, a, b));
					},
					taskB);
			},
			taskA);
	});
var $elm$core$Task$sequence = function (tasks) {
	return A3(
		$elm$core$List$foldr,
		$elm$core$Task$map2($elm$core$List$cons),
		$elm$core$Task$succeed(_List_Nil),
		tasks);
};
var $elm$core$Platform$sendToApp = _Platform_sendToApp;
var $elm$core$Task$spawnCmd = F2(
	function (router, _v0) {
		var task = _v0;
		return _Scheduler_spawn(
			A2(
				$elm$core$Task$andThen,
				$elm$core$Platform$sendToApp(router),
				task));
	});
var $elm$core$Task$onEffects = F3(
	function (router, commands, state) {
		return A2(
			$elm$core$Task$map,
			function (_v0) {
				return 0;
			},
			$elm$core$Task$sequence(
				A2(
					$elm$core$List$map,
					$elm$core$Task$spawnCmd(router),
					commands)));
	});
var $elm$core$Task$onSelfMsg = F3(
	function (_v0, _v1, _v2) {
		return $elm$core$Task$succeed(0);
	});
var $elm$core$Task$cmdMap = F2(
	function (tagger, _v0) {
		var task = _v0;
		return A2($elm$core$Task$map, tagger, task);
	});
_Platform_effectManagers['Task'] = _Platform_createManager($elm$core$Task$init, $elm$core$Task$onEffects, $elm$core$Task$onSelfMsg, $elm$core$Task$cmdMap);
var $elm$core$Task$command = _Platform_leaf('Task');
var $elm$core$Task$perform = F2(
	function (toMessage, task) {
		return $elm$core$Task$command(
			A2($elm$core$Task$map, toMessage, task));
	});
var $elm$browser$Browser$document = _Browser_document;
var $author$project$Model$AccessTokenScreen = 1;
var $author$project$Model$LoginScreen = function (a) {
	return {$: 0, a: a};
};
var $elm$core$Platform$Cmd$batch = _Platform_batch;
var $elm$core$Platform$Cmd$none = $elm$core$Platform$Cmd$batch(_List_Nil);
var $author$project$Main$init = function (_v0) {
	return _Utils_Tuple2(
		$author$project$Model$LoginScreen(
			{b0: '', aV: 'https://', ao: $elm$core$Maybe$Nothing, as: '', ek: 1, aA: ''}),
		$elm$core$Platform$Cmd$none);
};
var $author$project$Msg$SyncTime = {$: 3};
var $elm$core$Basics$always = F2(
	function (a, _v0) {
		return a;
	});
var $elm$time$Time$Every = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var $elm$time$Time$State = F2(
	function (taggers, processes) {
		return {d7: processes, ew: taggers};
	});
var $elm$core$Dict$RBEmpty_elm_builtin = {$: -2};
var $elm$core$Dict$empty = $elm$core$Dict$RBEmpty_elm_builtin;
var $elm$time$Time$init = $elm$core$Task$succeed(
	A2($elm$time$Time$State, $elm$core$Dict$empty, $elm$core$Dict$empty));
var $elm$core$Basics$compare = _Utils_compare;
var $elm$core$Dict$get = F2(
	function (targetKey, dict) {
		get:
		while (true) {
			if (dict.$ === -2) {
				return $elm$core$Maybe$Nothing;
			} else {
				var key = dict.b;
				var value = dict.c;
				var left = dict.d;
				var right = dict.e;
				var _v1 = A2($elm$core$Basics$compare, targetKey, key);
				switch (_v1) {
					case 0:
						var $temp$targetKey = targetKey,
							$temp$dict = left;
						targetKey = $temp$targetKey;
						dict = $temp$dict;
						continue get;
					case 1:
						return $elm$core$Maybe$Just(value);
					default:
						var $temp$targetKey = targetKey,
							$temp$dict = right;
						targetKey = $temp$targetKey;
						dict = $temp$dict;
						continue get;
				}
			}
		}
	});
var $elm$core$Dict$Black = 1;
var $elm$core$Dict$RBNode_elm_builtin = F5(
	function (a, b, c, d, e) {
		return {$: -1, a: a, b: b, c: c, d: d, e: e};
	});
var $elm$core$Dict$Red = 0;
var $elm$core$Dict$balance = F5(
	function (color, key, value, left, right) {
		if ((right.$ === -1) && (!right.a)) {
			var _v1 = right.a;
			var rK = right.b;
			var rV = right.c;
			var rLeft = right.d;
			var rRight = right.e;
			if ((left.$ === -1) && (!left.a)) {
				var _v3 = left.a;
				var lK = left.b;
				var lV = left.c;
				var lLeft = left.d;
				var lRight = left.e;
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					0,
					key,
					value,
					A5($elm$core$Dict$RBNode_elm_builtin, 1, lK, lV, lLeft, lRight),
					A5($elm$core$Dict$RBNode_elm_builtin, 1, rK, rV, rLeft, rRight));
			} else {
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					color,
					rK,
					rV,
					A5($elm$core$Dict$RBNode_elm_builtin, 0, key, value, left, rLeft),
					rRight);
			}
		} else {
			if ((((left.$ === -1) && (!left.a)) && (left.d.$ === -1)) && (!left.d.a)) {
				var _v5 = left.a;
				var lK = left.b;
				var lV = left.c;
				var _v6 = left.d;
				var _v7 = _v6.a;
				var llK = _v6.b;
				var llV = _v6.c;
				var llLeft = _v6.d;
				var llRight = _v6.e;
				var lRight = left.e;
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					0,
					lK,
					lV,
					A5($elm$core$Dict$RBNode_elm_builtin, 1, llK, llV, llLeft, llRight),
					A5($elm$core$Dict$RBNode_elm_builtin, 1, key, value, lRight, right));
			} else {
				return A5($elm$core$Dict$RBNode_elm_builtin, color, key, value, left, right);
			}
		}
	});
var $elm$core$Dict$insertHelp = F3(
	function (key, value, dict) {
		if (dict.$ === -2) {
			return A5($elm$core$Dict$RBNode_elm_builtin, 0, key, value, $elm$core$Dict$RBEmpty_elm_builtin, $elm$core$Dict$RBEmpty_elm_builtin);
		} else {
			var nColor = dict.a;
			var nKey = dict.b;
			var nValue = dict.c;
			var nLeft = dict.d;
			var nRight = dict.e;
			var _v1 = A2($elm$core$Basics$compare, key, nKey);
			switch (_v1) {
				case 0:
					return A5(
						$elm$core$Dict$balance,
						nColor,
						nKey,
						nValue,
						A3($elm$core$Dict$insertHelp, key, value, nLeft),
						nRight);
				case 1:
					return A5($elm$core$Dict$RBNode_elm_builtin, nColor, nKey, value, nLeft, nRight);
				default:
					return A5(
						$elm$core$Dict$balance,
						nColor,
						nKey,
						nValue,
						nLeft,
						A3($elm$core$Dict$insertHelp, key, value, nRight));
			}
		}
	});
var $elm$core$Dict$insert = F3(
	function (key, value, dict) {
		var _v0 = A3($elm$core$Dict$insertHelp, key, value, dict);
		if ((_v0.$ === -1) && (!_v0.a)) {
			var _v1 = _v0.a;
			var k = _v0.b;
			var v = _v0.c;
			var l = _v0.d;
			var r = _v0.e;
			return A5($elm$core$Dict$RBNode_elm_builtin, 1, k, v, l, r);
		} else {
			var x = _v0;
			return x;
		}
	});
var $elm$time$Time$addMySub = F2(
	function (_v0, state) {
		var interval = _v0.a;
		var tagger = _v0.b;
		var _v1 = A2($elm$core$Dict$get, interval, state);
		if (_v1.$ === 1) {
			return A3(
				$elm$core$Dict$insert,
				interval,
				_List_fromArray(
					[tagger]),
				state);
		} else {
			var taggers = _v1.a;
			return A3(
				$elm$core$Dict$insert,
				interval,
				A2($elm$core$List$cons, tagger, taggers),
				state);
		}
	});
var $elm$core$Process$kill = _Scheduler_kill;
var $elm$core$Dict$foldl = F3(
	function (func, acc, dict) {
		foldl:
		while (true) {
			if (dict.$ === -2) {
				return acc;
			} else {
				var key = dict.b;
				var value = dict.c;
				var left = dict.d;
				var right = dict.e;
				var $temp$func = func,
					$temp$acc = A3(
					func,
					key,
					value,
					A3($elm$core$Dict$foldl, func, acc, left)),
					$temp$dict = right;
				func = $temp$func;
				acc = $temp$acc;
				dict = $temp$dict;
				continue foldl;
			}
		}
	});
var $elm$core$Dict$merge = F6(
	function (leftStep, bothStep, rightStep, leftDict, rightDict, initialResult) {
		var stepState = F3(
			function (rKey, rValue, _v0) {
				stepState:
				while (true) {
					var list = _v0.a;
					var result = _v0.b;
					if (!list.b) {
						return _Utils_Tuple2(
							list,
							A3(rightStep, rKey, rValue, result));
					} else {
						var _v2 = list.a;
						var lKey = _v2.a;
						var lValue = _v2.b;
						var rest = list.b;
						if (_Utils_cmp(lKey, rKey) < 0) {
							var $temp$rKey = rKey,
								$temp$rValue = rValue,
								$temp$_v0 = _Utils_Tuple2(
								rest,
								A3(leftStep, lKey, lValue, result));
							rKey = $temp$rKey;
							rValue = $temp$rValue;
							_v0 = $temp$_v0;
							continue stepState;
						} else {
							if (_Utils_cmp(lKey, rKey) > 0) {
								return _Utils_Tuple2(
									list,
									A3(rightStep, rKey, rValue, result));
							} else {
								return _Utils_Tuple2(
									rest,
									A4(bothStep, lKey, lValue, rValue, result));
							}
						}
					}
				}
			});
		var _v3 = A3(
			$elm$core$Dict$foldl,
			stepState,
			_Utils_Tuple2(
				$elm$core$Dict$toList(leftDict),
				initialResult),
			rightDict);
		var leftovers = _v3.a;
		var intermediateResult = _v3.b;
		return A3(
			$elm$core$List$foldl,
			F2(
				function (_v4, result) {
					var k = _v4.a;
					var v = _v4.b;
					return A3(leftStep, k, v, result);
				}),
			intermediateResult,
			leftovers);
	});
var $elm$core$Platform$sendToSelf = _Platform_sendToSelf;
var $elm$time$Time$Name = function (a) {
	return {$: 0, a: a};
};
var $elm$time$Time$Offset = function (a) {
	return {$: 1, a: a};
};
var $elm$time$Time$Zone = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var $elm$time$Time$customZone = $elm$time$Time$Zone;
var $elm$time$Time$setInterval = _Time_setInterval;
var $elm$core$Process$spawn = _Scheduler_spawn;
var $elm$time$Time$spawnHelp = F3(
	function (router, intervals, processes) {
		if (!intervals.b) {
			return $elm$core$Task$succeed(processes);
		} else {
			var interval = intervals.a;
			var rest = intervals.b;
			var spawnTimer = $elm$core$Process$spawn(
				A2(
					$elm$time$Time$setInterval,
					interval,
					A2($elm$core$Platform$sendToSelf, router, interval)));
			var spawnRest = function (id) {
				return A3(
					$elm$time$Time$spawnHelp,
					router,
					rest,
					A3($elm$core$Dict$insert, interval, id, processes));
			};
			return A2($elm$core$Task$andThen, spawnRest, spawnTimer);
		}
	});
var $elm$time$Time$onEffects = F3(
	function (router, subs, _v0) {
		var processes = _v0.d7;
		var rightStep = F3(
			function (_v6, id, _v7) {
				var spawns = _v7.a;
				var existing = _v7.b;
				var kills = _v7.c;
				return _Utils_Tuple3(
					spawns,
					existing,
					A2(
						$elm$core$Task$andThen,
						function (_v5) {
							return kills;
						},
						$elm$core$Process$kill(id)));
			});
		var newTaggers = A3($elm$core$List$foldl, $elm$time$Time$addMySub, $elm$core$Dict$empty, subs);
		var leftStep = F3(
			function (interval, taggers, _v4) {
				var spawns = _v4.a;
				var existing = _v4.b;
				var kills = _v4.c;
				return _Utils_Tuple3(
					A2($elm$core$List$cons, interval, spawns),
					existing,
					kills);
			});
		var bothStep = F4(
			function (interval, taggers, id, _v3) {
				var spawns = _v3.a;
				var existing = _v3.b;
				var kills = _v3.c;
				return _Utils_Tuple3(
					spawns,
					A3($elm$core$Dict$insert, interval, id, existing),
					kills);
			});
		var _v1 = A6(
			$elm$core$Dict$merge,
			leftStep,
			bothStep,
			rightStep,
			newTaggers,
			processes,
			_Utils_Tuple3(
				_List_Nil,
				$elm$core$Dict$empty,
				$elm$core$Task$succeed(0)));
		var spawnList = _v1.a;
		var existingDict = _v1.b;
		var killTask = _v1.c;
		return A2(
			$elm$core$Task$andThen,
			function (newProcesses) {
				return $elm$core$Task$succeed(
					A2($elm$time$Time$State, newTaggers, newProcesses));
			},
			A2(
				$elm$core$Task$andThen,
				function (_v2) {
					return A3($elm$time$Time$spawnHelp, router, spawnList, existingDict);
				},
				killTask));
	});
var $elm$time$Time$Posix = $elm$core$Basics$identity;
var $elm$time$Time$millisToPosix = $elm$core$Basics$identity;
var $elm$time$Time$now = _Time_now($elm$time$Time$millisToPosix);
var $elm$time$Time$onSelfMsg = F3(
	function (router, interval, state) {
		var _v0 = A2($elm$core$Dict$get, interval, state.ew);
		if (_v0.$ === 1) {
			return $elm$core$Task$succeed(state);
		} else {
			var taggers = _v0.a;
			var tellTaggers = function (time) {
				return $elm$core$Task$sequence(
					A2(
						$elm$core$List$map,
						function (tagger) {
							return A2(
								$elm$core$Platform$sendToApp,
								router,
								tagger(time));
						},
						taggers));
			};
			return A2(
				$elm$core$Task$andThen,
				function (_v1) {
					return $elm$core$Task$succeed(state);
				},
				A2($elm$core$Task$andThen, tellTaggers, $elm$time$Time$now));
		}
	});
var $elm$core$Basics$composeL = F3(
	function (g, f, x) {
		return g(
			f(x));
	});
var $elm$time$Time$subMap = F2(
	function (f, _v0) {
		var interval = _v0.a;
		var tagger = _v0.b;
		return A2(
			$elm$time$Time$Every,
			interval,
			A2($elm$core$Basics$composeL, f, tagger));
	});
_Platform_effectManagers['Time'] = _Platform_createManager($elm$time$Time$init, $elm$time$Time$onEffects, $elm$time$Time$onSelfMsg, 0, $elm$time$Time$subMap);
var $elm$time$Time$subscription = _Platform_leaf('Time');
var $elm$time$Time$every = F2(
	function (interval, tagger) {
		return $elm$time$Time$subscription(
			A2($elm$time$Time$Every, interval, tagger));
	});
var $elm$core$Platform$Sub$batch = _Platform_batch;
var $elm$core$Platform$Sub$none = $elm$core$Platform$Sub$batch(_List_Nil);
var $author$project$Main$subscriptions = function (model) {
	switch (model.$) {
		case 0:
			return $elm$core$Platform$Sub$none;
		case 1:
			return $elm$core$Platform$Sub$none;
		default:
			return A2(
				$elm$time$Time$every,
				2000,
				$elm$core$Basics$always($author$project$Msg$SyncTime));
	}
};
var $author$project$Model$BrowsingGames = function (a) {
	return {$: 0, a: a};
};
var $author$project$Model$InitialSync = F2(
	function (a, b) {
		return {$: 1, a: a, b: b};
	});
var $author$project$Msg$InitialSync = function (a) {
	return {$: 2, a: a};
};
var $author$project$Model$LoggedIn = F2(
	function (a, b) {
		return {$: 2, a: a, b: b};
	});
var $author$project$Msg$LoggedIn = function (a) {
	return {$: 4, a: a};
};
var $author$project$Msg$VaultUpdate = function (a) {
	return {$: 0, a: a};
};
var $elm$core$Task$onError = _Scheduler_onError;
var $elm$core$Task$attempt = F2(
	function (resultToMessage, task) {
		return $elm$core$Task$command(
			A2(
				$elm$core$Task$onError,
				A2(
					$elm$core$Basics$composeL,
					A2($elm$core$Basics$composeL, $elm$core$Task$succeed, resultToMessage),
					$elm$core$Result$Err),
				A2(
					$elm$core$Task$andThen,
					A2(
						$elm$core$Basics$composeL,
						A2($elm$core$Basics$composeL, $elm$core$Task$succeed, resultToMessage),
						$elm$core$Result$Ok),
					task)));
	});
var $elm$core$Basics$composeR = F3(
	function (f, g, x) {
		return g(
			f(x));
	});
var $author$project$Internal$Vault$Vault = $elm$core$Basics$identity;
var $author$project$Internal$Api$Credentials$Credentials = $elm$core$Basics$identity;
var $author$project$Internal$Tools$LoginValues$RawAccessToken = function (a) {
	return {$: 1, a: a};
};
var $author$project$Internal$Tools$LoginValues$UsernameAndPassword = function (a) {
	return {$: 3, a: a};
};
var $author$project$Internal$Tools$LoginValues$addToken = F2(
	function (s, t) {
		switch (t.$) {
			case 0:
				return $author$project$Internal$Tools$LoginValues$RawAccessToken(s);
			case 1:
				return $author$project$Internal$Tools$LoginValues$RawAccessToken(s);
			case 2:
				return $author$project$Internal$Tools$LoginValues$RawAccessToken(s);
			default:
				var data = t.a;
				return $author$project$Internal$Tools$LoginValues$UsernameAndPassword(
					_Utils_update(
						data,
						{
							hh: $elm$core$Maybe$Just(s)
						}));
		}
	});
var $author$project$Internal$Api$Credentials$addToken = F2(
	function (token, _v0) {
		var data = _v0;
		var access = data.J;
		return _Utils_update(
			data,
			{
				J: A2($author$project$Internal$Tools$LoginValues$addToken, token, access)
			});
	});
var $author$project$Internal$Tools$LoginValues$NoAccess = {$: 0};
var $author$project$Internal$Api$Credentials$fromBaseUrl = function (url) {
	return {J: $author$project$Internal$Tools$LoginValues$NoAccess, dE: url, c7: $elm$core$Maybe$Nothing};
};
var $author$project$Internal$Values$Vault$IVault = $elm$core$Basics$identity;
var $author$project$Internal$Tools$Hashdict$Hashdict = $elm$core$Basics$identity;
var $author$project$Internal$Tools$Hashdict$empty = function (hash) {
	return {bk: hash, X: $elm$core$Dict$empty};
};
var $author$project$Internal$Config$Leaking$originServerTs = $elm$time$Time$millisToPosix(0);
var $author$project$Internal$Values$Room$roomId = function (_v0) {
	var room = _v0;
	return room.eg;
};
var $author$project$Internal$Values$Vault$init = {
	Z: $elm$core$Dict$empty,
	a2: _List_Nil,
	cx: $author$project$Internal$Config$Leaking$originServerTs,
	cT: $author$project$Internal$Tools$Hashdict$empty($author$project$Internal$Values$Room$roomId),
	cY: $elm$core$Maybe$Nothing
};
var $author$project$Internal$Vault$fromAccessToken = function (_v0) {
	var baseUrl = _v0.aV;
	var accessToken = _v0.b0;
	return function (context) {
		return {bP: context, n: $author$project$Internal$Values$Vault$init};
	}(
		A2(
			$author$project$Internal$Api$Credentials$addToken,
			accessToken,
			$author$project$Internal$Api$Credentials$fromBaseUrl(baseUrl)));
};
var $author$project$Matrix$fromAccessToken = $author$project$Internal$Vault$fromAccessToken;
var $author$project$Internal$Tools$LoginValues$fromUsernameAndPassword = F2(
	function (username, password) {
		return $author$project$Internal$Tools$LoginValues$UsernameAndPassword(
			{a_: $elm$core$Maybe$Nothing, a1: $elm$core$Maybe$Nothing, as: password, hh: $elm$core$Maybe$Nothing, c6: $elm$core$Maybe$Nothing, aA: username});
	});
var $author$project$Internal$Tools$LoginValues$addUsernameAndPassword = F2(
	function (_v0, t) {
		var username = _v0.aA;
		var password = _v0.as;
		switch (t.$) {
			case 0:
				return A2($author$project$Internal$Tools$LoginValues$fromUsernameAndPassword, username, password);
			case 1:
				var a = t.a;
				return $author$project$Internal$Tools$LoginValues$UsernameAndPassword(
					{
						a_: $elm$core$Maybe$Nothing,
						a1: $elm$core$Maybe$Nothing,
						as: password,
						hh: $elm$core$Maybe$Just(a),
						c6: $elm$core$Maybe$Nothing,
						aA: username
					});
			case 2:
				var accessToken = t.a.b0;
				var deviceId = t.a.a_;
				var userId = t.a.c6;
				return $author$project$Internal$Tools$LoginValues$UsernameAndPassword(
					{
						a_: deviceId,
						a1: $elm$core$Maybe$Nothing,
						as: password,
						hh: $elm$core$Maybe$Just(accessToken),
						c6: $elm$core$Maybe$Just(userId),
						aA: username
					});
			default:
				var data = t.a;
				return $author$project$Internal$Tools$LoginValues$UsernameAndPassword(
					_Utils_update(
						data,
						{as: password, aA: username}));
		}
	});
var $author$project$Internal$Api$Credentials$addUsernameAndPassword = F2(
	function (uap, _v0) {
		var data = _v0;
		var access = data.J;
		return _Utils_update(
			data,
			{
				J: A2($author$project$Internal$Tools$LoginValues$addUsernameAndPassword, uap, access)
			});
	});
var $author$project$Internal$Vault$fromLoginVault = function (_v0) {
	var username = _v0.aA;
	var password = _v0.as;
	var baseUrl = _v0.aV;
	return function (context) {
		return {bP: context, n: $author$project$Internal$Values$Vault$init};
	}(
		A2(
			$author$project$Internal$Api$Credentials$addUsernameAndPassword,
			{as: password, aA: username},
			$author$project$Internal$Api$Credentials$fromBaseUrl(baseUrl)));
};
var $author$project$Matrix$fromLoginCredentials = $author$project$Internal$Vault$fromLoginVault;
var $elm$core$Maybe$map = F2(
	function (f, maybe) {
		if (!maybe.$) {
			var value = maybe.a;
			return $elm$core$Maybe$Just(
				f(value));
		} else {
			return $elm$core$Maybe$Nothing;
		}
	});
var $elm$core$Task$fail = _Scheduler_fail;
var $author$project$Internal$Values$Vault$getSince = function (_v0) {
	var since = _v0.cY;
	return since;
};
var $author$project$Internal$Tools$Exceptions$NoAccessToken = {$: 2};
var $author$project$Internal$Tools$Exceptions$SDKException = function (a) {
	return {$: 1, a: a};
};
var $author$project$Internal$Api$Chain$TaskChainPiece = $elm$core$Basics$identity;
var $elm$core$List$append = F2(
	function (xs, ys) {
		if (!ys.b) {
			return xs;
		} else {
			return A3($elm$core$List$foldr, $elm$core$List$cons, ys, xs);
		}
	});
var $author$project$Internal$Api$Chain$andThen = F2(
	function (f2, f1) {
		return function (context) {
			return A2(
				$elm$core$Task$andThen,
				function (_v0) {
					var old = _v0;
					return A2(
						$elm$core$Task$map,
						function (_v1) {
							var _new = _v1;
							return {
								bh: A2($elm$core$Basics$composeR, old.bh, _new.bh),
								bo: A2($elm$core$List$append, old.bo, _new.bo)
							};
						},
						f2(
							old.bh(context)));
				},
				f1(context));
		};
	});
var $author$project$Internal$Api$VaultUpdate$UpdateWhoAmI = function (a) {
	return {$: 17, a: a};
};
var $author$project$Internal$Tools$Context$Context = $elm$core$Basics$identity;
var $author$project$Internal$Tools$Context$setUserId = F2(
	function (userId, _v0) {
		var data = _v0;
		return _Utils_update(
			data,
			{c6: userId});
	});
var $author$project$Internal$Api$VaultUpdate$toChain = F4(
	function (transform, task, input, context) {
		return A2(
			$elm$core$Task$map,
			transform,
			A2(task, context, input));
	});
var $author$project$Internal$Tools$Exceptions$UnsupportedSpecVersion = {$: 3};
var $author$project$Internal$Tools$VersionControl$VersionControl = $elm$core$Basics$identity;
var $elm$core$Dict$map = F2(
	function (func, dict) {
		if (dict.$ === -2) {
			return $elm$core$Dict$RBEmpty_elm_builtin;
		} else {
			var color = dict.a;
			var key = dict.b;
			var value = dict.c;
			var left = dict.d;
			var right = dict.e;
			return A5(
				$elm$core$Dict$RBNode_elm_builtin,
				color,
				key,
				A2(func, key, value),
				A2($elm$core$Dict$map, func, left),
				A2($elm$core$Dict$map, func, right));
		}
	});
var $author$project$Internal$Tools$VersionControl$addMiddleLayer = F2(
	function (_v0, _v1) {
		var current = _v0.dq;
		var downcast = _v0.fy;
		var upcast = _v0.hl;
		var version = _v0.eC;
		var d = _v1;
		return {
			cy: current,
			a5: A2($elm$core$List$cons, version, d.a5),
			eD: A3(
				$elm$core$Dict$insert,
				version,
				current,
				A2(
					$elm$core$Dict$map,
					F2(
						function (_v2, f) {
							return A2(
								$elm$core$Basics$composeR,
								downcast,
								A2($elm$core$Basics$composeR, f, upcast));
						}),
					d.eD))
		};
	});
var $author$project$Internal$Tools$Context$getVersions = function (_v0) {
	var versions = _v0.eD;
	return versions;
};
var $elm$core$List$filter = F2(
	function (isGood, list) {
		return A3(
			$elm$core$List$foldr,
			F2(
				function (x, xs) {
					return isGood(x) ? A2($elm$core$List$cons, x, xs) : xs;
				}),
			_List_Nil,
			list);
	});
var $elm$core$List$maybeCons = F3(
	function (f, mx, xs) {
		var _v0 = f(mx);
		if (!_v0.$) {
			var x = _v0.a;
			return A2($elm$core$List$cons, x, xs);
		} else {
			return xs;
		}
	});
var $elm$core$List$filterMap = F2(
	function (f, xs) {
		return A3(
			$elm$core$List$foldr,
			$elm$core$List$maybeCons(f),
			_List_Nil,
			xs);
	});
var $author$project$Internal$Tools$VersionControl$fromVersion = F2(
	function (version, _v0) {
		var versions = _v0.eD;
		return A2($elm$core$Dict$get, version, versions);
	});
var $elm$core$List$head = function (list) {
	if (list.b) {
		var x = list.a;
		var xs = list.b;
		return $elm$core$Maybe$Just(x);
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $elm$core$List$any = F2(
	function (isOkay, list) {
		any:
		while (true) {
			if (!list.b) {
				return false;
			} else {
				var x = list.a;
				var xs = list.b;
				if (isOkay(x)) {
					return true;
				} else {
					var $temp$isOkay = isOkay,
						$temp$list = xs;
					isOkay = $temp$isOkay;
					list = $temp$list;
					continue any;
				}
			}
		}
	});
var $elm$core$List$member = F2(
	function (x, xs) {
		return A2(
			$elm$core$List$any,
			function (a) {
				return _Utils_eq(a, x);
			},
			xs);
	});
var $author$project$Internal$Tools$VersionControl$mostRecentFromVersionList = F2(
	function (versionList, vc) {
		var order = vc.a5;
		return $elm$core$List$head(
			A2(
				$elm$core$List$filterMap,
				function (v) {
					return A2($author$project$Internal$Tools$VersionControl$fromVersion, v, vc);
				},
				A2(
					$elm$core$List$filter,
					function (o) {
						return A2($elm$core$List$member, o, versionList);
					},
					order)));
	});
var $author$project$Internal$Tools$VersionControl$sameForVersion = F2(
	function (version, _v0) {
		var data = _v0;
		return _Utils_update(
			data,
			{
				a5: A2($elm$core$List$cons, version, data.a5),
				eD: A3($elm$core$Dict$insert, version, data.cy, data.eD)
			});
	});
var $author$project$Internal$Api$WhoAmI$V2$Upcast$upcastWhoAmIResponse = function (old) {
	return {a_: $elm$core$Maybe$Nothing, c6: old.c6};
};
var $author$project$Internal$Api$WhoAmI$V3$Upcast$upcastWhoAmIResponse = function (old) {
	return {a_: old.a_, cs: false, c6: old.c6};
};
var $author$project$Internal$Api$Request$Header = function (a) {
	return {$: 2, a: a};
};
var $author$project$Internal$Tools$Context$getAccessToken = function (_v0) {
	var accessToken = _v0.b0;
	return accessToken;
};
var $elm$http$Http$Header = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var $elm$http$Http$header = $elm$http$Http$Header;
var $author$project$Internal$Api$Request$accessToken = A2(
	$elm$core$Basics$composeR,
	$author$project$Internal$Tools$Context$getAccessToken,
	A2(
		$elm$core$Basics$composeR,
		$elm$core$Basics$append('Bearer '),
		A2(
			$elm$core$Basics$composeR,
			$elm$http$Http$header('Authorization'),
			$author$project$Internal$Api$Request$Header)));
var $author$project$Internal$Api$Request$ApiCall = $elm$core$Basics$identity;
var $author$project$Internal$Api$Request$UrlPath = function (a) {
	return {$: 7, a: a};
};
var $author$project$Internal$Tools$Context$getBaseUrl = function (_v0) {
	var baseUrl = _v0.aV;
	return baseUrl;
};
var $author$project$Internal$Api$Request$callApi = F3(
	function (method, path, context) {
		return {
			ah: _List_fromArray(
				[
					$author$project$Internal$Api$Request$UrlPath(path)
				]),
			aV: $author$project$Internal$Tools$Context$getBaseUrl(context),
			bP: context,
			bp: method
		};
	});
var $elm$url$Url$Builder$toQueryPair = function (_v0) {
	var key = _v0.a;
	var value = _v0.b;
	return key + ('=' + value);
};
var $elm$url$Url$Builder$toQuery = function (parameters) {
	if (!parameters.b) {
		return '';
	} else {
		return '?' + A2(
			$elm$core$String$join,
			'&',
			A2($elm$core$List$map, $elm$url$Url$Builder$toQueryPair, parameters));
	}
};
var $elm$url$Url$Builder$crossOrigin = F3(
	function (prePath, pathSegments, parameters) {
		return prePath + ('/' + (A2($elm$core$String$join, '/', pathSegments) + $elm$url$Url$Builder$toQuery(parameters)));
	});
var $author$project$Internal$Api$Request$removeStartingSlashes = function (url) {
	return A2($elm$core$String$startsWith, '/', url) ? $author$project$Internal$Api$Request$removeStartingSlashes(
		A2($elm$core$String$dropLeft, 1, url)) : url;
};
var $elm$core$String$replace = F3(
	function (before, after, string) {
		return A2(
			$elm$core$String$join,
			after,
			A2($elm$core$String$split, before, string));
	});
var $author$project$Internal$Api$Request$getPath = A2(
	$elm$core$Basics$composeR,
	A2(
		$elm$core$List$foldl,
		F2(
			function (attr, prior) {
				switch (attr.$) {
					case 7:
						var posterior = attr.a;
						return posterior;
					case 5:
						var from = attr.a;
						var to = attr.b;
						return A3($elm$core$String$replace, from, to, prior);
					default:
						return prior;
				}
			}),
		''),
	A2(
		$elm$core$Basics$composeR,
		$author$project$Internal$Api$Request$removeStartingSlashes,
		$elm$core$String$split('/')));
var $author$project$Internal$Api$Request$getQueryParams = $elm$core$List$filterMap(
	function (attr) {
		if (attr.$ === 4) {
			var q = attr.a;
			return $elm$core$Maybe$Just(q);
		} else {
			return $elm$core$Maybe$Nothing;
		}
	});
var $author$project$Internal$Api$Request$getUrl = function (_v0) {
	var baseUrl = _v0.aV;
	var attributes = _v0.ah;
	return A3(
		$elm$url$Url$Builder$crossOrigin,
		baseUrl,
		$author$project$Internal$Api$Request$getPath(attributes),
		$author$project$Internal$Api$Request$getQueryParams(attributes));
};
var $elm$http$Http$BadStatus_ = F2(
	function (a, b) {
		return {$: 3, a: a, b: b};
	});
var $elm$http$Http$BadUrl_ = function (a) {
	return {$: 0, a: a};
};
var $elm$http$Http$GoodStatus_ = F2(
	function (a, b) {
		return {$: 4, a: a, b: b};
	});
var $elm$http$Http$NetworkError_ = {$: 2};
var $elm$http$Http$Receiving = function (a) {
	return {$: 1, a: a};
};
var $elm$http$Http$Sending = function (a) {
	return {$: 0, a: a};
};
var $elm$http$Http$Timeout_ = {$: 1};
var $elm$core$Maybe$isJust = function (maybe) {
	if (!maybe.$) {
		return true;
	} else {
		return false;
	}
};
var $elm$core$Dict$getMin = function (dict) {
	getMin:
	while (true) {
		if ((dict.$ === -1) && (dict.d.$ === -1)) {
			var left = dict.d;
			var $temp$dict = left;
			dict = $temp$dict;
			continue getMin;
		} else {
			return dict;
		}
	}
};
var $elm$core$Dict$moveRedLeft = function (dict) {
	if (((dict.$ === -1) && (dict.d.$ === -1)) && (dict.e.$ === -1)) {
		if ((dict.e.d.$ === -1) && (!dict.e.d.a)) {
			var clr = dict.a;
			var k = dict.b;
			var v = dict.c;
			var _v1 = dict.d;
			var lClr = _v1.a;
			var lK = _v1.b;
			var lV = _v1.c;
			var lLeft = _v1.d;
			var lRight = _v1.e;
			var _v2 = dict.e;
			var rClr = _v2.a;
			var rK = _v2.b;
			var rV = _v2.c;
			var rLeft = _v2.d;
			var _v3 = rLeft.a;
			var rlK = rLeft.b;
			var rlV = rLeft.c;
			var rlL = rLeft.d;
			var rlR = rLeft.e;
			var rRight = _v2.e;
			return A5(
				$elm$core$Dict$RBNode_elm_builtin,
				0,
				rlK,
				rlV,
				A5(
					$elm$core$Dict$RBNode_elm_builtin,
					1,
					k,
					v,
					A5($elm$core$Dict$RBNode_elm_builtin, 0, lK, lV, lLeft, lRight),
					rlL),
				A5($elm$core$Dict$RBNode_elm_builtin, 1, rK, rV, rlR, rRight));
		} else {
			var clr = dict.a;
			var k = dict.b;
			var v = dict.c;
			var _v4 = dict.d;
			var lClr = _v4.a;
			var lK = _v4.b;
			var lV = _v4.c;
			var lLeft = _v4.d;
			var lRight = _v4.e;
			var _v5 = dict.e;
			var rClr = _v5.a;
			var rK = _v5.b;
			var rV = _v5.c;
			var rLeft = _v5.d;
			var rRight = _v5.e;
			if (clr === 1) {
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					1,
					k,
					v,
					A5($elm$core$Dict$RBNode_elm_builtin, 0, lK, lV, lLeft, lRight),
					A5($elm$core$Dict$RBNode_elm_builtin, 0, rK, rV, rLeft, rRight));
			} else {
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					1,
					k,
					v,
					A5($elm$core$Dict$RBNode_elm_builtin, 0, lK, lV, lLeft, lRight),
					A5($elm$core$Dict$RBNode_elm_builtin, 0, rK, rV, rLeft, rRight));
			}
		}
	} else {
		return dict;
	}
};
var $elm$core$Dict$moveRedRight = function (dict) {
	if (((dict.$ === -1) && (dict.d.$ === -1)) && (dict.e.$ === -1)) {
		if ((dict.d.d.$ === -1) && (!dict.d.d.a)) {
			var clr = dict.a;
			var k = dict.b;
			var v = dict.c;
			var _v1 = dict.d;
			var lClr = _v1.a;
			var lK = _v1.b;
			var lV = _v1.c;
			var _v2 = _v1.d;
			var _v3 = _v2.a;
			var llK = _v2.b;
			var llV = _v2.c;
			var llLeft = _v2.d;
			var llRight = _v2.e;
			var lRight = _v1.e;
			var _v4 = dict.e;
			var rClr = _v4.a;
			var rK = _v4.b;
			var rV = _v4.c;
			var rLeft = _v4.d;
			var rRight = _v4.e;
			return A5(
				$elm$core$Dict$RBNode_elm_builtin,
				0,
				lK,
				lV,
				A5($elm$core$Dict$RBNode_elm_builtin, 1, llK, llV, llLeft, llRight),
				A5(
					$elm$core$Dict$RBNode_elm_builtin,
					1,
					k,
					v,
					lRight,
					A5($elm$core$Dict$RBNode_elm_builtin, 0, rK, rV, rLeft, rRight)));
		} else {
			var clr = dict.a;
			var k = dict.b;
			var v = dict.c;
			var _v5 = dict.d;
			var lClr = _v5.a;
			var lK = _v5.b;
			var lV = _v5.c;
			var lLeft = _v5.d;
			var lRight = _v5.e;
			var _v6 = dict.e;
			var rClr = _v6.a;
			var rK = _v6.b;
			var rV = _v6.c;
			var rLeft = _v6.d;
			var rRight = _v6.e;
			if (clr === 1) {
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					1,
					k,
					v,
					A5($elm$core$Dict$RBNode_elm_builtin, 0, lK, lV, lLeft, lRight),
					A5($elm$core$Dict$RBNode_elm_builtin, 0, rK, rV, rLeft, rRight));
			} else {
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					1,
					k,
					v,
					A5($elm$core$Dict$RBNode_elm_builtin, 0, lK, lV, lLeft, lRight),
					A5($elm$core$Dict$RBNode_elm_builtin, 0, rK, rV, rLeft, rRight));
			}
		}
	} else {
		return dict;
	}
};
var $elm$core$Dict$removeHelpPrepEQGT = F7(
	function (targetKey, dict, color, key, value, left, right) {
		if ((left.$ === -1) && (!left.a)) {
			var _v1 = left.a;
			var lK = left.b;
			var lV = left.c;
			var lLeft = left.d;
			var lRight = left.e;
			return A5(
				$elm$core$Dict$RBNode_elm_builtin,
				color,
				lK,
				lV,
				lLeft,
				A5($elm$core$Dict$RBNode_elm_builtin, 0, key, value, lRight, right));
		} else {
			_v2$2:
			while (true) {
				if ((right.$ === -1) && (right.a === 1)) {
					if (right.d.$ === -1) {
						if (right.d.a === 1) {
							var _v3 = right.a;
							var _v4 = right.d;
							var _v5 = _v4.a;
							return $elm$core$Dict$moveRedRight(dict);
						} else {
							break _v2$2;
						}
					} else {
						var _v6 = right.a;
						var _v7 = right.d;
						return $elm$core$Dict$moveRedRight(dict);
					}
				} else {
					break _v2$2;
				}
			}
			return dict;
		}
	});
var $elm$core$Dict$removeMin = function (dict) {
	if ((dict.$ === -1) && (dict.d.$ === -1)) {
		var color = dict.a;
		var key = dict.b;
		var value = dict.c;
		var left = dict.d;
		var lColor = left.a;
		var lLeft = left.d;
		var right = dict.e;
		if (lColor === 1) {
			if ((lLeft.$ === -1) && (!lLeft.a)) {
				var _v3 = lLeft.a;
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					color,
					key,
					value,
					$elm$core$Dict$removeMin(left),
					right);
			} else {
				var _v4 = $elm$core$Dict$moveRedLeft(dict);
				if (_v4.$ === -1) {
					var nColor = _v4.a;
					var nKey = _v4.b;
					var nValue = _v4.c;
					var nLeft = _v4.d;
					var nRight = _v4.e;
					return A5(
						$elm$core$Dict$balance,
						nColor,
						nKey,
						nValue,
						$elm$core$Dict$removeMin(nLeft),
						nRight);
				} else {
					return $elm$core$Dict$RBEmpty_elm_builtin;
				}
			}
		} else {
			return A5(
				$elm$core$Dict$RBNode_elm_builtin,
				color,
				key,
				value,
				$elm$core$Dict$removeMin(left),
				right);
		}
	} else {
		return $elm$core$Dict$RBEmpty_elm_builtin;
	}
};
var $elm$core$Dict$removeHelp = F2(
	function (targetKey, dict) {
		if (dict.$ === -2) {
			return $elm$core$Dict$RBEmpty_elm_builtin;
		} else {
			var color = dict.a;
			var key = dict.b;
			var value = dict.c;
			var left = dict.d;
			var right = dict.e;
			if (_Utils_cmp(targetKey, key) < 0) {
				if ((left.$ === -1) && (left.a === 1)) {
					var _v4 = left.a;
					var lLeft = left.d;
					if ((lLeft.$ === -1) && (!lLeft.a)) {
						var _v6 = lLeft.a;
						return A5(
							$elm$core$Dict$RBNode_elm_builtin,
							color,
							key,
							value,
							A2($elm$core$Dict$removeHelp, targetKey, left),
							right);
					} else {
						var _v7 = $elm$core$Dict$moveRedLeft(dict);
						if (_v7.$ === -1) {
							var nColor = _v7.a;
							var nKey = _v7.b;
							var nValue = _v7.c;
							var nLeft = _v7.d;
							var nRight = _v7.e;
							return A5(
								$elm$core$Dict$balance,
								nColor,
								nKey,
								nValue,
								A2($elm$core$Dict$removeHelp, targetKey, nLeft),
								nRight);
						} else {
							return $elm$core$Dict$RBEmpty_elm_builtin;
						}
					}
				} else {
					return A5(
						$elm$core$Dict$RBNode_elm_builtin,
						color,
						key,
						value,
						A2($elm$core$Dict$removeHelp, targetKey, left),
						right);
				}
			} else {
				return A2(
					$elm$core$Dict$removeHelpEQGT,
					targetKey,
					A7($elm$core$Dict$removeHelpPrepEQGT, targetKey, dict, color, key, value, left, right));
			}
		}
	});
var $elm$core$Dict$removeHelpEQGT = F2(
	function (targetKey, dict) {
		if (dict.$ === -1) {
			var color = dict.a;
			var key = dict.b;
			var value = dict.c;
			var left = dict.d;
			var right = dict.e;
			if (_Utils_eq(targetKey, key)) {
				var _v1 = $elm$core$Dict$getMin(right);
				if (_v1.$ === -1) {
					var minKey = _v1.b;
					var minValue = _v1.c;
					return A5(
						$elm$core$Dict$balance,
						color,
						minKey,
						minValue,
						left,
						$elm$core$Dict$removeMin(right));
				} else {
					return $elm$core$Dict$RBEmpty_elm_builtin;
				}
			} else {
				return A5(
					$elm$core$Dict$balance,
					color,
					key,
					value,
					left,
					A2($elm$core$Dict$removeHelp, targetKey, right));
			}
		} else {
			return $elm$core$Dict$RBEmpty_elm_builtin;
		}
	});
var $elm$core$Dict$remove = F2(
	function (key, dict) {
		var _v0 = A2($elm$core$Dict$removeHelp, key, dict);
		if ((_v0.$ === -1) && (!_v0.a)) {
			var _v1 = _v0.a;
			var k = _v0.b;
			var v = _v0.c;
			var l = _v0.d;
			var r = _v0.e;
			return A5($elm$core$Dict$RBNode_elm_builtin, 1, k, v, l, r);
		} else {
			var x = _v0;
			return x;
		}
	});
var $elm$core$Dict$update = F3(
	function (targetKey, alter, dictionary) {
		var _v0 = alter(
			A2($elm$core$Dict$get, targetKey, dictionary));
		if (!_v0.$) {
			var value = _v0.a;
			return A3($elm$core$Dict$insert, targetKey, value, dictionary);
		} else {
			return A2($elm$core$Dict$remove, targetKey, dictionary);
		}
	});
var $elm$http$Http$jsonBody = function (value) {
	return A2(
		_Http_pair,
		'application/json',
		A2($elm$json$Json$Encode$encode, 0, value));
};
var $elm$json$Json$Encode$object = function (pairs) {
	return _Json_wrap(
		A3(
			$elm$core$List$foldl,
			F2(
				function (_v0, obj) {
					var k = _v0.a;
					var v = _v0.b;
					return A3(_Json_addField, k, v, obj);
				}),
			_Json_emptyObject(0),
			pairs));
};
var $elm$core$Process$sleep = _Process_sleep;
var $author$project$Internal$Api$Helpers$ratelimited = function (task) {
	return A2(
		$elm$core$Task$onError,
		function (e) {
			_v0$2:
			while (true) {
				switch (e.$) {
					case 2:
						if (e.a.$ === 6) {
							var retryAfterMs = e.a.a.gA;
							if (!retryAfterMs.$) {
								var interval = retryAfterMs.a;
								return $author$project$Internal$Api$Helpers$ratelimited(
									A2(
										$elm$core$Task$andThen,
										function (_v2) {
											return task;
										},
										$elm$core$Process$sleep(1 + interval)));
							} else {
								return $elm$core$Task$fail(e);
							}
						} else {
							break _v0$2;
						}
					case 0:
						if ((e.a.$ === 3) && (e.a.a === 429)) {
							return $author$project$Internal$Api$Helpers$ratelimited(
								A2(
									$elm$core$Task$andThen,
									function (_v3) {
										return task;
									},
									$elm$core$Process$sleep(1000)));
						} else {
							break _v0$2;
						}
					default:
						break _v0$2;
				}
			}
			return $elm$core$Task$fail(e);
		},
		task);
};
var $elm$http$Http$BadUrl = function (a) {
	return {$: 0, a: a};
};
var $author$project$Internal$Tools$Exceptions$InternetException = function (a) {
	return {$: 0, a: a};
};
var $elm$http$Http$NetworkError = {$: 2};
var $elm$http$Http$Timeout = {$: 1};
var $author$project$Internal$Tools$Exceptions$ServerException = function (a) {
	return {$: 2, a: a};
};
var $author$project$Internal$Tools$Exceptions$ServerReturnsBadJSON = function (a) {
	return {$: 0, a: a};
};
var $elm$json$Json$Decode$decodeString = _Json_runOnString;
var $author$project$Internal$Tools$Exceptions$M_BAD_JSON = function (a) {
	return {$: 3, a: a};
};
var $author$project$Internal$Tools$Exceptions$M_BAD_STATE = function (a) {
	return {$: 22, a: a};
};
var $author$project$Internal$Tools$Exceptions$M_CANNOT_LEAVE_SERVER_NOTICE_ROOM = function (a) {
	return {$: 31, a: a};
};
var $author$project$Internal$Tools$Exceptions$M_CAPTCHA_INVALID = function (a) {
	return {$: 25, a: a};
};
var $author$project$Internal$Tools$Exceptions$M_CAPTCHA_NEEDED = function (a) {
	return {$: 24, a: a};
};
var $author$project$Internal$Tools$Exceptions$M_EXCLUSIVE = function (a) {
	return {$: 29, a: a};
};
var $author$project$Internal$Tools$Exceptions$M_FORBIDDEN = function (a) {
	return {$: 0, a: a};
};
var $author$project$Internal$Tools$Exceptions$M_GUEST_ACCESS_FORBIDDEN = function (a) {
	return {$: 23, a: a};
};
var $author$project$Internal$Tools$Exceptions$M_INCOMPATIBLE_ROOM_VERSION = function (a) {
	return {$: 21, a: a};
};
var $author$project$Internal$Tools$Exceptions$M_INVALID_PARAM = function (a) {
	return {$: 27, a: a};
};
var $author$project$Internal$Tools$Exceptions$M_INVALID_ROOM_STATE = function (a) {
	return {$: 14, a: a};
};
var $author$project$Internal$Tools$Exceptions$M_INVALID_USERNAME = function (a) {
	return {$: 12, a: a};
};
var $author$project$Internal$Tools$Exceptions$M_LIMIT_EXCEEDED = function (a) {
	return {$: 6, a: a};
};
var $author$project$Internal$Tools$Exceptions$M_MISSING_PARAM = function (a) {
	return {$: 26, a: a};
};
var $author$project$Internal$Tools$Exceptions$M_MISSING_TOKEN = function (a) {
	return {$: 2, a: a};
};
var $author$project$Internal$Tools$Exceptions$M_NOT_FOUND = function (a) {
	return {$: 5, a: a};
};
var $author$project$Internal$Tools$Exceptions$M_NOT_JSON = function (a) {
	return {$: 4, a: a};
};
var $author$project$Internal$Tools$Exceptions$M_RESOURCE_LIMIT_EXCEEDED = function (a) {
	return {$: 30, a: a};
};
var $author$project$Internal$Tools$Exceptions$M_ROOM_IN_USE = function (a) {
	return {$: 13, a: a};
};
var $author$project$Internal$Tools$Exceptions$M_SERVER_NOT_TRUSTED = function (a) {
	return {$: 19, a: a};
};
var $author$project$Internal$Tools$Exceptions$M_THREEPID_AUTH_FAILED = function (a) {
	return {$: 17, a: a};
};
var $author$project$Internal$Tools$Exceptions$M_THREEPID_DENIED = function (a) {
	return {$: 18, a: a};
};
var $author$project$Internal$Tools$Exceptions$M_THREEPID_IN_USE = function (a) {
	return {$: 15, a: a};
};
var $author$project$Internal$Tools$Exceptions$M_THREEPID_NOT_FOUND = function (a) {
	return {$: 16, a: a};
};
var $author$project$Internal$Tools$Exceptions$M_TOO_LARGE = function (a) {
	return {$: 28, a: a};
};
var $author$project$Internal$Tools$Exceptions$M_UNAUTHORIZED = function (a) {
	return {$: 9, a: a};
};
var $author$project$Internal$Tools$Exceptions$M_UNKNOWN = function (a) {
	return {$: 7, a: a};
};
var $author$project$Internal$Tools$Exceptions$M_UNKNOWN_TOKEN = function (a) {
	return {$: 1, a: a};
};
var $author$project$Internal$Tools$Exceptions$M_UNRECOGNIZED = function (a) {
	return {$: 8, a: a};
};
var $author$project$Internal$Tools$Exceptions$M_UNSUPPORTED_ROOM_VERSION = function (a) {
	return {$: 20, a: a};
};
var $author$project$Internal$Tools$Exceptions$M_USER_DEACTIVATED = function (a) {
	return {$: 10, a: a};
};
var $author$project$Internal$Tools$Exceptions$M_USER_IN_USE = function (a) {
	return {$: 11, a: a};
};
var $elm$json$Json$Decode$bool = _Json_decodeBool;
var $elm$json$Json$Decode$andThen = _Json_andThen;
var $elm$json$Json$Decode$fail = _Json_fail;
var $elm$json$Json$Decode$field = _Json_decodeField;
var $elm$json$Json$Decode$string = _Json_decodeString;
var $author$project$Internal$Tools$Exceptions$errorDecoder = F3(
	function (name, code, decoder) {
		return A2(
			$elm$json$Json$Decode$andThen,
			function (errcode) {
				return _Utils_eq(errcode, name) ? A2($elm$json$Json$Decode$map, code, decoder) : $elm$json$Json$Decode$fail('Not the right errcode');
			},
			A2($elm$json$Json$Decode$field, 'errcode', $elm$json$Json$Decode$string));
	});
var $elm$json$Json$Decode$int = _Json_decodeInt;
var $elm$json$Json$Decode$oneOf = _Json_oneOf;
var $elm$json$Json$Decode$maybe = function (decoder) {
	return $elm$json$Json$Decode$oneOf(
		_List_fromArray(
			[
				A2($elm$json$Json$Decode$map, $elm$core$Maybe$Just, decoder),
				$elm$json$Json$Decode$succeed($elm$core$Maybe$Nothing)
			]));
};
var $elm$json$Json$Decode$null = _Json_decodeNull;
var $elm$json$Json$Decode$value = _Json_decodeValue;
var $author$project$Internal$Tools$DecodeExtra$opField = F2(
	function (fieldName, decoder) {
		return A2(
			$elm$json$Json$Decode$andThen,
			function (v) {
				if (!v.$) {
					return A2(
						$elm$json$Json$Decode$field,
						fieldName,
						$elm$json$Json$Decode$oneOf(
							_List_fromArray(
								[
									$elm$json$Json$Decode$null($elm$core$Maybe$Nothing),
									A2($elm$json$Json$Decode$map, $elm$core$Maybe$Just, decoder)
								])));
				} else {
					return $elm$json$Json$Decode$succeed($elm$core$Maybe$Nothing);
				}
			},
			$elm$json$Json$Decode$maybe(
				A2($elm$json$Json$Decode$field, fieldName, $elm$json$Json$Decode$value)));
	});
var $author$project$Internal$Tools$Exceptions$standardErrorDescription = A2(
	$elm$json$Json$Decode$map,
	function (err) {
		return {ao: err};
	},
	A2($author$project$Internal$Tools$DecodeExtra$opField, 'error', $elm$json$Json$Decode$string));
var $author$project$Internal$Tools$Exceptions$errorCatches = $elm$json$Json$Decode$oneOf(
	_List_fromArray(
		[
			A3($author$project$Internal$Tools$Exceptions$errorDecoder, 'M_FORBIDDEN', $author$project$Internal$Tools$Exceptions$M_FORBIDDEN, $author$project$Internal$Tools$Exceptions$standardErrorDescription),
			A3(
			$author$project$Internal$Tools$Exceptions$errorDecoder,
			'M_UNKNOWN_TOKEN',
			$author$project$Internal$Tools$Exceptions$M_UNKNOWN_TOKEN,
			A3(
				$elm$json$Json$Decode$map2,
				F2(
					function (err, slg) {
						return {ao: err, eq: slg};
					}),
				A2($author$project$Internal$Tools$DecodeExtra$opField, 'error', $elm$json$Json$Decode$string),
				A2($author$project$Internal$Tools$DecodeExtra$opField, 'soft_logout', $elm$json$Json$Decode$bool))),
			A3(
			$author$project$Internal$Tools$Exceptions$errorDecoder,
			'M_MISSING_TOKEN',
			$author$project$Internal$Tools$Exceptions$M_MISSING_TOKEN,
			A3(
				$elm$json$Json$Decode$map2,
				F2(
					function (err, slg) {
						return {ao: err, eq: slg};
					}),
				A2($author$project$Internal$Tools$DecodeExtra$opField, 'error', $elm$json$Json$Decode$string),
				A2($author$project$Internal$Tools$DecodeExtra$opField, 'soft_logout', $elm$json$Json$Decode$bool))),
			A3($author$project$Internal$Tools$Exceptions$errorDecoder, 'M_BAD_JSON', $author$project$Internal$Tools$Exceptions$M_BAD_JSON, $author$project$Internal$Tools$Exceptions$standardErrorDescription),
			A3($author$project$Internal$Tools$Exceptions$errorDecoder, 'M_NOT_JSON', $author$project$Internal$Tools$Exceptions$M_NOT_JSON, $author$project$Internal$Tools$Exceptions$standardErrorDescription),
			A3($author$project$Internal$Tools$Exceptions$errorDecoder, 'M_NOT_FOUND', $author$project$Internal$Tools$Exceptions$M_NOT_FOUND, $author$project$Internal$Tools$Exceptions$standardErrorDescription),
			A3(
			$author$project$Internal$Tools$Exceptions$errorDecoder,
			'M_LIMIT_EXCEEDED',
			$author$project$Internal$Tools$Exceptions$M_LIMIT_EXCEEDED,
			A3(
				$elm$json$Json$Decode$map2,
				F2(
					function (err, rams) {
						return {ao: err, gA: rams};
					}),
				A2($author$project$Internal$Tools$DecodeExtra$opField, 'error', $elm$json$Json$Decode$string),
				A2($author$project$Internal$Tools$DecodeExtra$opField, 'retry_after_ms', $elm$json$Json$Decode$int))),
			A3($author$project$Internal$Tools$Exceptions$errorDecoder, 'M_UNKNOWN', $author$project$Internal$Tools$Exceptions$M_UNKNOWN, $author$project$Internal$Tools$Exceptions$standardErrorDescription),
			A3($author$project$Internal$Tools$Exceptions$errorDecoder, 'M_UNRECOGNIZED', $author$project$Internal$Tools$Exceptions$M_UNRECOGNIZED, $author$project$Internal$Tools$Exceptions$standardErrorDescription),
			A3($author$project$Internal$Tools$Exceptions$errorDecoder, 'M_UNAUTHORIZED', $author$project$Internal$Tools$Exceptions$M_UNAUTHORIZED, $author$project$Internal$Tools$Exceptions$standardErrorDescription),
			A3($author$project$Internal$Tools$Exceptions$errorDecoder, 'M_USER_DEACTIVATED', $author$project$Internal$Tools$Exceptions$M_USER_DEACTIVATED, $author$project$Internal$Tools$Exceptions$standardErrorDescription),
			A3($author$project$Internal$Tools$Exceptions$errorDecoder, 'M_USER_IN_USE', $author$project$Internal$Tools$Exceptions$M_USER_IN_USE, $author$project$Internal$Tools$Exceptions$standardErrorDescription),
			A3($author$project$Internal$Tools$Exceptions$errorDecoder, 'M_INVALID_USERNAME', $author$project$Internal$Tools$Exceptions$M_INVALID_USERNAME, $author$project$Internal$Tools$Exceptions$standardErrorDescription),
			A3($author$project$Internal$Tools$Exceptions$errorDecoder, 'M_ROOM_IN_USE', $author$project$Internal$Tools$Exceptions$M_ROOM_IN_USE, $author$project$Internal$Tools$Exceptions$standardErrorDescription),
			A3($author$project$Internal$Tools$Exceptions$errorDecoder, 'M_INVALID_ROOM_STATE', $author$project$Internal$Tools$Exceptions$M_INVALID_ROOM_STATE, $author$project$Internal$Tools$Exceptions$standardErrorDescription),
			A3($author$project$Internal$Tools$Exceptions$errorDecoder, 'M_THREEPID_IN_USE', $author$project$Internal$Tools$Exceptions$M_THREEPID_IN_USE, $author$project$Internal$Tools$Exceptions$standardErrorDescription),
			A3($author$project$Internal$Tools$Exceptions$errorDecoder, 'M_THREEPID_NOT_FOUND', $author$project$Internal$Tools$Exceptions$M_THREEPID_NOT_FOUND, $author$project$Internal$Tools$Exceptions$standardErrorDescription),
			A3($author$project$Internal$Tools$Exceptions$errorDecoder, 'M_THREEPID_AUTH_FAILED', $author$project$Internal$Tools$Exceptions$M_THREEPID_AUTH_FAILED, $author$project$Internal$Tools$Exceptions$standardErrorDescription),
			A3($author$project$Internal$Tools$Exceptions$errorDecoder, 'M_THREEPID_DENIED', $author$project$Internal$Tools$Exceptions$M_THREEPID_DENIED, $author$project$Internal$Tools$Exceptions$standardErrorDescription),
			A3($author$project$Internal$Tools$Exceptions$errorDecoder, 'M_SERVER_NOT_TRUSTED', $author$project$Internal$Tools$Exceptions$M_SERVER_NOT_TRUSTED, $author$project$Internal$Tools$Exceptions$standardErrorDescription),
			A3($author$project$Internal$Tools$Exceptions$errorDecoder, 'M_UNSUPPORTED_ROOM_VERSION', $author$project$Internal$Tools$Exceptions$M_UNSUPPORTED_ROOM_VERSION, $author$project$Internal$Tools$Exceptions$standardErrorDescription),
			A3(
			$author$project$Internal$Tools$Exceptions$errorDecoder,
			'M_INCOMPATIBLE_ROOM_VERSION',
			$author$project$Internal$Tools$Exceptions$M_INCOMPATIBLE_ROOM_VERSION,
			A3(
				$elm$json$Json$Decode$map2,
				F2(
					function (err, rv) {
						return {ao: err, gD: rv};
					}),
				A2($author$project$Internal$Tools$DecodeExtra$opField, 'error', $elm$json$Json$Decode$string),
				A2($author$project$Internal$Tools$DecodeExtra$opField, 'room_version', $elm$json$Json$Decode$string))),
			A3($author$project$Internal$Tools$Exceptions$errorDecoder, 'M_BAD_STATE', $author$project$Internal$Tools$Exceptions$M_BAD_STATE, $author$project$Internal$Tools$Exceptions$standardErrorDescription),
			A3($author$project$Internal$Tools$Exceptions$errorDecoder, 'M_GUEST_ACCESS_FORBIDDEN', $author$project$Internal$Tools$Exceptions$M_GUEST_ACCESS_FORBIDDEN, $author$project$Internal$Tools$Exceptions$standardErrorDescription),
			A3($author$project$Internal$Tools$Exceptions$errorDecoder, 'M_CAPTCHA_NEEDED', $author$project$Internal$Tools$Exceptions$M_CAPTCHA_NEEDED, $author$project$Internal$Tools$Exceptions$standardErrorDescription),
			A3($author$project$Internal$Tools$Exceptions$errorDecoder, 'M_CAPTCHA_INVALID', $author$project$Internal$Tools$Exceptions$M_CAPTCHA_INVALID, $author$project$Internal$Tools$Exceptions$standardErrorDescription),
			A3($author$project$Internal$Tools$Exceptions$errorDecoder, 'M_MISSING_PARAM', $author$project$Internal$Tools$Exceptions$M_MISSING_PARAM, $author$project$Internal$Tools$Exceptions$standardErrorDescription),
			A3($author$project$Internal$Tools$Exceptions$errorDecoder, 'M_INVALID_PARAM', $author$project$Internal$Tools$Exceptions$M_INVALID_PARAM, $author$project$Internal$Tools$Exceptions$standardErrorDescription),
			A3($author$project$Internal$Tools$Exceptions$errorDecoder, 'M_TOO_LARGE', $author$project$Internal$Tools$Exceptions$M_TOO_LARGE, $author$project$Internal$Tools$Exceptions$standardErrorDescription),
			A3($author$project$Internal$Tools$Exceptions$errorDecoder, 'M_EXCLUSIVE', $author$project$Internal$Tools$Exceptions$M_EXCLUSIVE, $author$project$Internal$Tools$Exceptions$standardErrorDescription),
			A3(
			$author$project$Internal$Tools$Exceptions$errorDecoder,
			'M_RESOURCE_LIMIT_EXCEEDED',
			$author$project$Internal$Tools$Exceptions$M_RESOURCE_LIMIT_EXCEEDED,
			A3(
				$elm$json$Json$Decode$map2,
				F2(
					function (err, ac) {
						return {eN: ac, ao: err};
					}),
				A2($author$project$Internal$Tools$DecodeExtra$opField, 'error', $elm$json$Json$Decode$string),
				A2($elm$json$Json$Decode$field, 'admin_contact', $elm$json$Json$Decode$string))),
			A3($author$project$Internal$Tools$Exceptions$errorDecoder, 'M_CANNOT_LEAVE_SERVER_NOTICE_ROOM', $author$project$Internal$Tools$Exceptions$M_CANNOT_LEAVE_SERVER_NOTICE_ROOM, $author$project$Internal$Tools$Exceptions$standardErrorDescription)
		]));
var $author$project$Internal$Api$Request$decodeServerResponse = F2(
	function (decoder, body) {
		var _v0 = A2($elm$json$Json$Decode$decodeString, $elm$json$Json$Decode$value, body);
		if (_v0.$ === 1) {
			var e = _v0.a;
			return $elm$core$Result$Err(
				$author$project$Internal$Tools$Exceptions$SDKException(
					$author$project$Internal$Tools$Exceptions$ServerReturnsBadJSON(
						$elm$json$Json$Decode$errorToString(e))));
		} else {
			var _v1 = A2($elm$json$Json$Decode$decodeString, decoder, body);
			if (!_v1.$) {
				var v = _v1.a;
				return $elm$core$Result$Ok(v);
			} else {
				var err = _v1.a;
				var _v2 = A2($elm$json$Json$Decode$decodeString, $author$project$Internal$Tools$Exceptions$errorCatches, body);
				if (!_v2.$) {
					var v = _v2.a;
					return $elm$core$Result$Err(
						$author$project$Internal$Tools$Exceptions$ServerException(v));
				} else {
					return $elm$core$Result$Err(
						$author$project$Internal$Tools$Exceptions$SDKException(
							$author$project$Internal$Tools$Exceptions$ServerReturnsBadJSON(
								$elm$json$Json$Decode$errorToString(err))));
				}
			}
		}
	});
var $elm$http$Http$stringResolver = A2(_Http_expect, '', $elm$core$Basics$identity);
var $author$project$Internal$Api$Request$rawApiCallResolver = function (decoder) {
	return $elm$http$Http$stringResolver(
		function (response) {
			switch (response.$) {
				case 0:
					var s = response.a;
					return $elm$core$Result$Err(
						$author$project$Internal$Tools$Exceptions$InternetException(
							$elm$http$Http$BadUrl(s)));
				case 1:
					return $elm$core$Result$Err(
						$author$project$Internal$Tools$Exceptions$InternetException($elm$http$Http$Timeout));
				case 2:
					return $elm$core$Result$Err(
						$author$project$Internal$Tools$Exceptions$InternetException($elm$http$Http$NetworkError));
				case 3:
					var metadata = response.a;
					var body = response.b;
					return A2(
						$author$project$Internal$Api$Request$decodeServerResponse,
						decoder(metadata.eu),
						body);
				default:
					var metadata = response.a;
					var body = response.b;
					return A2(
						$author$project$Internal$Api$Request$decodeServerResponse,
						decoder(metadata.eu),
						body);
			}
		});
};
var $elm$http$Http$resultToTask = function (result) {
	if (!result.$) {
		var a = result.a;
		return $elm$core$Task$succeed(a);
	} else {
		var x = result.a;
		return $elm$core$Task$fail(x);
	}
};
var $elm$http$Http$task = function (r) {
	return A3(
		_Http_toTask,
		0,
		$elm$http$Http$resultToTask,
		{eW: false, e5: r.e5, ch: r.gy, fJ: r.fJ, bp: r.bp, hf: r.hf, ex: $elm$core$Maybe$Nothing, hn: r.hn});
};
var $elm$core$Maybe$withDefault = F2(
	function (_default, maybe) {
		if (!maybe.$) {
			var value = maybe.a;
			return value;
		} else {
			return _default;
		}
	});
var $author$project$Internal$Api$Request$toTask = F2(
	function (decoder, _v0) {
		var data = _v0;
		return $author$project$Internal$Api$Helpers$ratelimited(
			$elm$http$Http$task(
				{
					e5: $elm$http$Http$jsonBody(
						A2(
							$elm$core$Maybe$withDefault,
							$elm$json$Json$Encode$object(
								A2(
									$elm$core$List$filterMap,
									function (attr) {
										if (!attr.$) {
											var key = attr.a;
											var value = attr.b;
											return $elm$core$Maybe$Just(
												_Utils_Tuple2(key, value));
										} else {
											return $elm$core$Maybe$Nothing;
										}
									},
									data.ah)),
							$elm$core$List$head(
								$elm$core$List$reverse(
									A2(
										$elm$core$List$filterMap,
										function (attr) {
											if (attr.$ === 1) {
												var v = attr.a;
												return $elm$core$Maybe$Just(v);
											} else {
												return $elm$core$Maybe$Nothing;
											}
										},
										data.ah))))),
					fJ: A2(
						$elm$core$List$filterMap,
						function (attr) {
							if (attr.$ === 2) {
								var h = attr.a;
								return $elm$core$Maybe$Just(h);
							} else {
								return $elm$core$Maybe$Nothing;
							}
						},
						data.ah),
					bp: data.bp,
					gy: $author$project$Internal$Api$Request$rawApiCallResolver(
						$elm$core$Basics$always(decoder)),
					hf: $elm$core$List$head(
						$elm$core$List$reverse(
							A2(
								$elm$core$List$filterMap,
								function (attr) {
									if (attr.$ === 6) {
										var t = attr.a;
										return $elm$core$Maybe$Just(t);
									} else {
										return $elm$core$Maybe$Nothing;
									}
								},
								data.ah))),
					hn: $author$project$Internal$Api$Request$getUrl(data)
				}));
	});
var $author$project$Internal$Api$WhoAmI$V1$SpecObjects$whoAmIResponseDecoder = A2(
	$elm$json$Json$Decode$map,
	function (a) {
		return {c6: a};
	},
	A2($elm$json$Json$Decode$field, 'user_id', $elm$json$Json$Decode$string));
var $author$project$Internal$Api$Request$withAttributes = F2(
	function (attrs, _v0) {
		var data = _v0;
		return {
			ah: A2(
				$elm$core$List$append,
				data.ah,
				A2(
					$elm$core$List$map,
					function (attr) {
						return attr(data.bP);
					},
					attrs)),
			aV: data.aV,
			bP: data.bP,
			bp: data.bp
		};
	});
var $author$project$Internal$Api$WhoAmI$Api$whoAmIV1 = function (_v0) {
	return A2(
		$elm$core$Basics$composeR,
		A2($author$project$Internal$Api$Request$callApi, 'GET', '/_matrix/client/r0/account/whoami'),
		A2(
			$elm$core$Basics$composeR,
			$author$project$Internal$Api$Request$withAttributes(
				_List_fromArray(
					[$author$project$Internal$Api$Request$accessToken])),
			$author$project$Internal$Api$Request$toTask($author$project$Internal$Api$WhoAmI$V1$SpecObjects$whoAmIResponseDecoder)));
};
var $author$project$Internal$Api$WhoAmI$V2$SpecObjects$whoAmIResponseDecoder = A3(
	$elm$json$Json$Decode$map2,
	F2(
		function (a, b) {
			return {a_: a, c6: b};
		}),
	A2($author$project$Internal$Tools$DecodeExtra$opField, 'device_id', $elm$json$Json$Decode$string),
	A2($elm$json$Json$Decode$field, 'user_id', $elm$json$Json$Decode$string));
var $author$project$Internal$Api$WhoAmI$Api$whoAmIV2 = function (_v0) {
	return A2(
		$elm$core$Basics$composeR,
		A2($author$project$Internal$Api$Request$callApi, 'GET', '/_matrix/client/v3/account/whoami'),
		A2(
			$elm$core$Basics$composeR,
			$author$project$Internal$Api$Request$withAttributes(
				_List_fromArray(
					[$author$project$Internal$Api$Request$accessToken])),
			$author$project$Internal$Api$Request$toTask($author$project$Internal$Api$WhoAmI$V2$SpecObjects$whoAmIResponseDecoder)));
};
var $elm$json$Json$Decode$map3 = _Json_map3;
var $author$project$Internal$Tools$DecodeExtra$opFieldWithDefault = F3(
	function (fieldName, _default, decoder) {
		return A2(
			$elm$json$Json$Decode$map,
			$elm$core$Maybe$withDefault(_default),
			A2($author$project$Internal$Tools$DecodeExtra$opField, fieldName, decoder));
	});
var $author$project$Internal$Api$WhoAmI$V3$SpecObjects$whoAmIResponseDecoder = A4(
	$elm$json$Json$Decode$map3,
	F3(
		function (a, b, c) {
			return {a_: a, cs: b, c6: c};
		}),
	A2($author$project$Internal$Tools$DecodeExtra$opField, 'device_id', $elm$json$Json$Decode$string),
	A3($author$project$Internal$Tools$DecodeExtra$opFieldWithDefault, 'is_guest', false, $elm$json$Json$Decode$bool),
	A2($elm$json$Json$Decode$field, 'user_id', $elm$json$Json$Decode$string));
var $author$project$Internal$Api$WhoAmI$Api$whoAmIV3 = function (_v0) {
	return A2(
		$elm$core$Basics$composeR,
		A2($author$project$Internal$Api$Request$callApi, 'GET', '/_matrix/client/v3/account/whoami'),
		A2(
			$elm$core$Basics$composeR,
			$author$project$Internal$Api$Request$withAttributes(
				_List_fromArray(
					[$author$project$Internal$Api$Request$accessToken])),
			$author$project$Internal$Api$Request$toTask($author$project$Internal$Api$WhoAmI$V3$SpecObjects$whoAmIResponseDecoder)));
};
var $elm$core$Dict$singleton = F2(
	function (key, value) {
		return A5($elm$core$Dict$RBNode_elm_builtin, 1, key, value, $elm$core$Dict$RBEmpty_elm_builtin, $elm$core$Dict$RBEmpty_elm_builtin);
	});
var $elm$core$List$singleton = function (value) {
	return _List_fromArray(
		[value]);
};
var $author$project$Internal$Tools$VersionControl$withBottomLayer = function (_v0) {
	var current = _v0.dq;
	var version = _v0.eC;
	return {
		cy: current,
		a5: $elm$core$List$singleton(version),
		eD: A2($elm$core$Dict$singleton, version, current)
	};
};
var $author$project$Internal$Api$WhoAmI$Main$whoAmI = F2(
	function (context, input) {
		return A3(
			$elm$core$Basics$apR,
			A2(
				$elm$core$Maybe$withDefault,
				$elm$core$Basics$always(
					$elm$core$Basics$always(
						$elm$core$Task$fail($author$project$Internal$Tools$Exceptions$UnsupportedSpecVersion))),
				A2(
					$author$project$Internal$Tools$VersionControl$mostRecentFromVersionList,
					$author$project$Internal$Tools$Context$getVersions(context),
					A2(
						$author$project$Internal$Tools$VersionControl$sameForVersion,
						'v1.6',
						A2(
							$author$project$Internal$Tools$VersionControl$sameForVersion,
							'v1.5',
							A2(
								$author$project$Internal$Tools$VersionControl$sameForVersion,
								'v1.4',
								A2(
									$author$project$Internal$Tools$VersionControl$sameForVersion,
									'v1.3',
									A2(
										$author$project$Internal$Tools$VersionControl$addMiddleLayer,
										{
											dq: $author$project$Internal$Api$WhoAmI$Api$whoAmIV3,
											fy: $elm$core$Basics$identity,
											hl: F2(
												function (f, c) {
													return A2(
														$elm$core$Task$map,
														$author$project$Internal$Api$WhoAmI$V3$Upcast$upcastWhoAmIResponse,
														f(c));
												}),
											eC: 'v1.2'
										},
										A2(
											$author$project$Internal$Tools$VersionControl$addMiddleLayer,
											{
												dq: $author$project$Internal$Api$WhoAmI$Api$whoAmIV2,
												fy: $elm$core$Basics$identity,
												hl: F2(
													function (f, c) {
														return A2(
															$elm$core$Task$map,
															$author$project$Internal$Api$WhoAmI$V2$Upcast$upcastWhoAmIResponse,
															f(c));
													}),
												eC: 'v1.1'
											},
											A2(
												$author$project$Internal$Tools$VersionControl$sameForVersion,
												'r0.6.1',
												A2(
													$author$project$Internal$Tools$VersionControl$sameForVersion,
													'r0.6.0',
													A2(
														$author$project$Internal$Tools$VersionControl$sameForVersion,
														'r0.5.0',
														A2(
															$author$project$Internal$Tools$VersionControl$sameForVersion,
															'r0.4.0',
															$author$project$Internal$Tools$VersionControl$withBottomLayer(
																{dq: $author$project$Internal$Api$WhoAmI$Api$whoAmIV1, eC: 'r0.3.0'}))))))))))))),
			$elm$core$Basics$apR(input),
			context);
	});
var $author$project$Internal$Api$VaultUpdate$getWhoAmI = A3(
	$author$project$Internal$Api$VaultUpdate$toChain,
	function (output) {
		return {
			bh: $author$project$Internal$Tools$Context$setUserId(output.c6),
			bo: _List_fromArray(
				[
					$author$project$Internal$Api$VaultUpdate$UpdateWhoAmI(output)
				])
		};
	},
	$author$project$Internal$Api$WhoAmI$Main$whoAmI,
	0);
var $author$project$Internal$Api$VaultUpdate$LoggedInWithUsernameAndPassword = F2(
	function (a, b) {
		return {$: 10, a: a, b: b};
	});
var $author$project$Internal$Api$Request$BodyParam = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var $author$project$Internal$Api$Request$bodyValue = F3(
	function (key, value, _v0) {
		return A2($author$project$Internal$Api$Request$BodyParam, key, value);
	});
var $elm$json$Json$Encode$string = _Json_wrap;
var $author$project$Internal$Api$Request$bodyString = F2(
	function (key, value) {
		return A2(
			$author$project$Internal$Api$Request$bodyValue,
			key,
			$elm$json$Json$Encode$string(value));
	});
var $elm$json$Json$Decode$map4 = _Json_map4;
var $author$project$Internal$Api$LoginWithUsernameAndPassword$V1$Login$loggedInResponseDecoder = A5(
	$elm$json$Json$Decode$map4,
	F4(
		function (a, b, c, d) {
			return {b0: a, cp: b, cS: c, c6: d};
		}),
	A2($elm$json$Json$Decode$field, 'access_token', $elm$json$Json$Decode$string),
	A2($elm$json$Json$Decode$field, 'home_server', $elm$json$Json$Decode$string),
	A2($author$project$Internal$Tools$DecodeExtra$opField, 'refresh_token', $elm$json$Json$Decode$string),
	A2($elm$json$Json$Decode$field, 'user_id', $elm$json$Json$Decode$string));
var $author$project$Internal$Api$LoginWithUsernameAndPassword$Api$loginWithUsernameAndPasswordV1 = function (_v0) {
	var username = _v0.aA;
	var password = _v0.as;
	return A2(
		$elm$core$Basics$composeR,
		A2($author$project$Internal$Api$Request$callApi, 'POST', '/_matrix/client/r0/login'),
		A2(
			$elm$core$Basics$composeR,
			$author$project$Internal$Api$Request$withAttributes(
				_List_fromArray(
					[
						A2($author$project$Internal$Api$Request$bodyString, 'password', password),
						A2($author$project$Internal$Api$Request$bodyString, 'type', 'm.login.password'),
						A2($author$project$Internal$Api$Request$bodyString, 'user', username)
					])),
			$author$project$Internal$Api$Request$toTask($author$project$Internal$Api$LoginWithUsernameAndPassword$V1$Login$loggedInResponseDecoder)));
};
var $author$project$Internal$Api$Request$NoAttr = {$: 3};
var $author$project$Internal$Api$Request$bodyOpString = F2(
	function (key, value) {
		if (!value.$) {
			var s = value.a;
			return A2($author$project$Internal$Api$Request$bodyString, key, s);
		} else {
			return $elm$core$Basics$always($author$project$Internal$Api$Request$NoAttr);
		}
	});
var $elm$json$Json$Decode$map5 = _Json_map5;
var $author$project$Internal$Api$LoginWithUsernameAndPassword$V2$SpecObjects$loggedInResponseDecoder = A6(
	$elm$json$Json$Decode$map5,
	F5(
		function (a, b, c, d, e) {
			return {b0: a, a_: b, cp: c, cS: d, c6: e};
		}),
	A2($elm$json$Json$Decode$field, 'access_token', $elm$json$Json$Decode$string),
	A2(
		$elm$json$Json$Decode$map,
		$elm$core$Maybe$Just,
		A2($elm$json$Json$Decode$field, 'device_id', $elm$json$Json$Decode$string)),
	A2($elm$json$Json$Decode$field, 'home_server', $elm$json$Json$Decode$string),
	$elm$json$Json$Decode$succeed($elm$core$Maybe$Nothing),
	A2($elm$json$Json$Decode$field, 'user_id', $elm$json$Json$Decode$string));
var $author$project$Internal$Api$LoginWithUsernameAndPassword$Api$loginWithUsernameAndPasswordV2 = function (_v0) {
	var deviceId = _v0.a_;
	var initialDeviceDisplayName = _v0.a1;
	var password = _v0.as;
	var username = _v0.aA;
	return A2(
		$elm$core$Basics$composeR,
		A2($author$project$Internal$Api$Request$callApi, 'POST', '/_matrix/client/r0/login'),
		A2(
			$elm$core$Basics$composeR,
			$author$project$Internal$Api$Request$withAttributes(
				_List_fromArray(
					[
						A2($author$project$Internal$Api$Request$bodyString, 'type', 'm.login.password'),
						A2($author$project$Internal$Api$Request$bodyString, 'user', username),
						A2($author$project$Internal$Api$Request$bodyString, 'password', password),
						A2($author$project$Internal$Api$Request$bodyOpString, 'device_id', deviceId),
						A2($author$project$Internal$Api$Request$bodyOpString, 'initial_device_display_name', initialDeviceDisplayName)
					])),
			$author$project$Internal$Api$Request$toTask($author$project$Internal$Api$LoginWithUsernameAndPassword$V2$SpecObjects$loggedInResponseDecoder)));
};
var $author$project$Internal$Api$LoginWithUsernameAndPassword$V3$SpecObjects$loggedInResponseDecoder = A6(
	$elm$json$Json$Decode$map5,
	F5(
		function (a, b, c, d, e) {
			return {b0: a, a_: b, cp: c, cS: d, c6: e};
		}),
	A2($elm$json$Json$Decode$field, 'access_token', $elm$json$Json$Decode$string),
	A2(
		$elm$json$Json$Decode$map,
		$elm$core$Maybe$Just,
		A2($elm$json$Json$Decode$field, 'device_id', $elm$json$Json$Decode$string)),
	$elm$json$Json$Decode$succeed($elm$core$Maybe$Nothing),
	$elm$json$Json$Decode$succeed($elm$core$Maybe$Nothing),
	A2($elm$json$Json$Decode$field, 'user_id', $elm$json$Json$Decode$string));
var $author$project$Internal$Api$LoginWithUsernameAndPassword$Api$loginWithUsernameAndPasswordV3 = function (_v0) {
	var deviceId = _v0.a_;
	var initialDeviceDisplayName = _v0.a1;
	var password = _v0.as;
	var username = _v0.aA;
	return A2(
		$elm$core$Basics$composeR,
		A2($author$project$Internal$Api$Request$callApi, 'POST', '/_matrix/client/r0/login'),
		A2(
			$elm$core$Basics$composeR,
			$author$project$Internal$Api$Request$withAttributes(
				_List_fromArray(
					[
						A2($author$project$Internal$Api$Request$bodyString, 'type', 'm.login.password'),
						A2($author$project$Internal$Api$Request$bodyString, 'password', password),
						A2($author$project$Internal$Api$Request$bodyOpString, 'device_id', deviceId),
						A2($author$project$Internal$Api$Request$bodyOpString, 'initial_device_display_name', initialDeviceDisplayName),
						A2(
						$author$project$Internal$Api$Request$bodyValue,
						'identifier',
						$elm$json$Json$Encode$object(
							_List_fromArray(
								[
									_Utils_Tuple2(
									'type',
									$elm$json$Json$Encode$string('m.id.user')),
									_Utils_Tuple2(
									'user',
									$elm$json$Json$Encode$string(username))
								])))
					])),
			$author$project$Internal$Api$Request$toTask($author$project$Internal$Api$LoginWithUsernameAndPassword$V3$SpecObjects$loggedInResponseDecoder)));
};
var $author$project$Internal$Api$LoginWithUsernameAndPassword$V4$SpecObjects$homeserverInformationDecoder = A2(
	$elm$json$Json$Decode$map,
	function (a) {
		return {aV: a};
	},
	A2($elm$json$Json$Decode$field, 'base_url', $elm$json$Json$Decode$string));
var $author$project$Internal$Api$LoginWithUsernameAndPassword$V4$SpecObjects$identityServerInformationDecoder = A2(
	$elm$json$Json$Decode$map,
	function (a) {
		return {aV: a};
	},
	A2($elm$json$Json$Decode$field, 'base_url', $elm$json$Json$Decode$string));
var $author$project$Internal$Api$LoginWithUsernameAndPassword$V4$SpecObjects$discoveryInformationDecoder = A3(
	$elm$json$Json$Decode$map2,
	F2(
		function (a, b) {
			return {cC: a, cD: b};
		}),
	A2($elm$json$Json$Decode$field, 'm.homeserver', $author$project$Internal$Api$LoginWithUsernameAndPassword$V4$SpecObjects$homeserverInformationDecoder),
	A2($author$project$Internal$Tools$DecodeExtra$opField, 'm.identity_server', $author$project$Internal$Api$LoginWithUsernameAndPassword$V4$SpecObjects$identityServerInformationDecoder));
var $elm$json$Json$Decode$map6 = _Json_map6;
var $author$project$Internal$Api$LoginWithUsernameAndPassword$V4$SpecObjects$loggedInResponseDecoder = A7(
	$elm$json$Json$Decode$map6,
	F6(
		function (a, b, c, d, e, f) {
			return {b0: a, a_: b, cp: c, cS: d, c6: e, c8: f};
		}),
	A2($elm$json$Json$Decode$field, 'access_token', $elm$json$Json$Decode$string),
	A2(
		$elm$json$Json$Decode$map,
		$elm$core$Maybe$Just,
		A2($elm$json$Json$Decode$field, 'device_id', $elm$json$Json$Decode$string)),
	$elm$json$Json$Decode$succeed($elm$core$Maybe$Nothing),
	$elm$json$Json$Decode$succeed($elm$core$Maybe$Nothing),
	A2($elm$json$Json$Decode$field, 'user_id', $elm$json$Json$Decode$string),
	A2($author$project$Internal$Tools$DecodeExtra$opField, 'well_known', $author$project$Internal$Api$LoginWithUsernameAndPassword$V4$SpecObjects$discoveryInformationDecoder));
var $author$project$Internal$Api$LoginWithUsernameAndPassword$Api$loginWithUsernameAndPasswordV4 = function (_v0) {
	var deviceId = _v0.a_;
	var initialDeviceDisplayName = _v0.a1;
	var password = _v0.as;
	var username = _v0.aA;
	return A2(
		$elm$core$Basics$composeR,
		A2($author$project$Internal$Api$Request$callApi, 'POST', '/_matrix/client/r0/login'),
		A2(
			$elm$core$Basics$composeR,
			$author$project$Internal$Api$Request$withAttributes(
				_List_fromArray(
					[
						A2($author$project$Internal$Api$Request$bodyString, 'type', 'm.login.password'),
						A2($author$project$Internal$Api$Request$bodyString, 'password', password),
						A2($author$project$Internal$Api$Request$bodyOpString, 'device_id', deviceId),
						A2($author$project$Internal$Api$Request$bodyOpString, 'initial_device_display_name', initialDeviceDisplayName),
						A2(
						$author$project$Internal$Api$Request$bodyValue,
						'identifier',
						$elm$json$Json$Encode$object(
							_List_fromArray(
								[
									_Utils_Tuple2(
									'type',
									$elm$json$Json$Encode$string('m.id.user')),
									_Utils_Tuple2(
									'user',
									$elm$json$Json$Encode$string(username))
								])))
					])),
			$author$project$Internal$Api$Request$toTask($author$project$Internal$Api$LoginWithUsernameAndPassword$V4$SpecObjects$loggedInResponseDecoder)));
};
var $author$project$Internal$Api$LoginWithUsernameAndPassword$Api$loginWithUsernameAndPasswordV5 = function (_v0) {
	var deviceId = _v0.a_;
	var initialDeviceDisplayName = _v0.a1;
	var password = _v0.as;
	var username = _v0.aA;
	return A2(
		$elm$core$Basics$composeR,
		A2($author$project$Internal$Api$Request$callApi, 'POST', '/_matrix/client/v3/login'),
		A2(
			$elm$core$Basics$composeR,
			$author$project$Internal$Api$Request$withAttributes(
				_List_fromArray(
					[
						A2($author$project$Internal$Api$Request$bodyString, 'type', 'm.login.password'),
						A2($author$project$Internal$Api$Request$bodyString, 'password', password),
						A2($author$project$Internal$Api$Request$bodyOpString, 'device_id', deviceId),
						A2($author$project$Internal$Api$Request$bodyOpString, 'initial_device_display_name', initialDeviceDisplayName),
						A2(
						$author$project$Internal$Api$Request$bodyValue,
						'identifier',
						$elm$json$Json$Encode$object(
							_List_fromArray(
								[
									_Utils_Tuple2(
									'type',
									$elm$json$Json$Encode$string('m.id.user')),
									_Utils_Tuple2(
									'user',
									$elm$json$Json$Encode$string(username))
								])))
					])),
			$author$project$Internal$Api$Request$toTask($author$project$Internal$Api$LoginWithUsernameAndPassword$V4$SpecObjects$loggedInResponseDecoder)));
};
var $elm$json$Json$Encode$bool = _Json_wrap;
var $author$project$Internal$Api$Request$bodyBool = F2(
	function (key, value) {
		return A2(
			$author$project$Internal$Api$Request$bodyValue,
			key,
			$elm$json$Json$Encode$bool(value));
	});
var $author$project$Internal$Api$LoginWithUsernameAndPassword$V5$Login$homeserverInformationDecoder = A2(
	$elm$json$Json$Decode$map,
	function (a) {
		return {aV: a};
	},
	A2($elm$json$Json$Decode$field, 'base_url', $elm$json$Json$Decode$string));
var $author$project$Internal$Api$LoginWithUsernameAndPassword$V5$Login$identityServerInformationDecoder = A2(
	$elm$json$Json$Decode$map,
	function (a) {
		return {aV: a};
	},
	A2($elm$json$Json$Decode$field, 'base_url', $elm$json$Json$Decode$string));
var $author$project$Internal$Api$LoginWithUsernameAndPassword$V5$Login$discoveryInformationDecoder = A3(
	$elm$json$Json$Decode$map2,
	F2(
		function (a, b) {
			return {cC: a, cD: b};
		}),
	A2($elm$json$Json$Decode$field, 'm.homeserver', $author$project$Internal$Api$LoginWithUsernameAndPassword$V5$Login$homeserverInformationDecoder),
	A2($author$project$Internal$Tools$DecodeExtra$opField, 'm.identity_server', $author$project$Internal$Api$LoginWithUsernameAndPassword$V5$Login$identityServerInformationDecoder));
var $elm$json$Json$Decode$map7 = _Json_map7;
var $author$project$Internal$Api$LoginWithUsernameAndPassword$V5$Login$loggedInResponseDecoder = A8(
	$elm$json$Json$Decode$map7,
	F7(
		function (a, b, c, d, e, f, g) {
			return {b0: a, a_: b, ci: c, cp: d, cS: e, c6: f, c8: g};
		}),
	A2($elm$json$Json$Decode$field, 'access_token', $elm$json$Json$Decode$string),
	A2(
		$elm$json$Json$Decode$map,
		$elm$core$Maybe$Just,
		A2($elm$json$Json$Decode$field, 'device_id', $elm$json$Json$Decode$string)),
	A2($author$project$Internal$Tools$DecodeExtra$opField, 'expires_in_ms', $elm$json$Json$Decode$int),
	$elm$json$Json$Decode$succeed($elm$core$Maybe$Nothing),
	A2($author$project$Internal$Tools$DecodeExtra$opField, 'refresh_token', $elm$json$Json$Decode$string),
	A2($elm$json$Json$Decode$field, 'user_id', $elm$json$Json$Decode$string),
	A2($author$project$Internal$Tools$DecodeExtra$opField, 'well_known', $author$project$Internal$Api$LoginWithUsernameAndPassword$V5$Login$discoveryInformationDecoder));
var $author$project$Internal$Api$LoginWithUsernameAndPassword$Api$loginWithUsernameAndPasswordV6 = function (_v0) {
	var deviceId = _v0.a_;
	var initialDeviceDisplayName = _v0.a1;
	var password = _v0.as;
	var username = _v0.aA;
	return A2(
		$elm$core$Basics$composeR,
		A2($author$project$Internal$Api$Request$callApi, 'POST', '/_matrix/client/v3/login'),
		A2(
			$elm$core$Basics$composeR,
			$author$project$Internal$Api$Request$withAttributes(
				_List_fromArray(
					[
						A2($author$project$Internal$Api$Request$bodyString, 'type', 'm.login.password'),
						A2($author$project$Internal$Api$Request$bodyString, 'password', password),
						A2($author$project$Internal$Api$Request$bodyOpString, 'device_id', deviceId),
						A2($author$project$Internal$Api$Request$bodyOpString, 'initial_device_display_name', initialDeviceDisplayName),
						A2($author$project$Internal$Api$Request$bodyBool, 'refresh_token', true),
						A2(
						$author$project$Internal$Api$Request$bodyValue,
						'identifier',
						$elm$json$Json$Encode$object(
							_List_fromArray(
								[
									_Utils_Tuple2(
									'type',
									$elm$json$Json$Encode$string('m.id.user')),
									_Utils_Tuple2(
									'user',
									$elm$json$Json$Encode$string(username))
								])))
					])),
			$author$project$Internal$Api$Request$toTask($author$project$Internal$Api$LoginWithUsernameAndPassword$V5$Login$loggedInResponseDecoder)));
};
var $author$project$Internal$Api$LoginWithUsernameAndPassword$V2$Upcast$upcastLoggedInResponse = function (old) {
	return {b0: old.b0, a_: $elm$core$Maybe$Nothing, cp: old.cp, cS: old.cS, c6: old.c6};
};
var $author$project$Internal$Api$LoginWithUsernameAndPassword$V3$Upcast$upcastLoggedInResponse = function (old) {
	return {
		b0: old.b0,
		a_: $elm$core$Maybe$Nothing,
		cp: $elm$core$Maybe$Just(old.cp),
		cS: old.cS,
		c6: old.c6
	};
};
var $author$project$Internal$Api$LoginWithUsernameAndPassword$V4$Upcast$upcastLoggedInResponse = function (old) {
	return {b0: old.b0, a_: old.a_, cp: old.cp, cS: old.cS, c6: old.c6, c8: $elm$core$Maybe$Nothing};
};
var $author$project$Internal$Api$LoginWithUsernameAndPassword$V5$Upcast$upcastLoggedInResponse = function (old) {
	return {b0: old.b0, a_: old.a_, ci: $elm$core$Maybe$Nothing, cp: old.cp, cS: old.cS, c6: old.c6, c8: old.c8};
};
var $author$project$Internal$Api$LoginWithUsernameAndPassword$Main$loginWithUsernameAndPassword = F2(
	function (context, input) {
		return A3(
			$elm$core$Basics$apR,
			A2(
				$elm$core$Maybe$withDefault,
				$elm$core$Basics$always(
					$elm$core$Basics$always(
						$elm$core$Task$fail($author$project$Internal$Tools$Exceptions$UnsupportedSpecVersion))),
				A2(
					$author$project$Internal$Tools$VersionControl$mostRecentFromVersionList,
					$author$project$Internal$Tools$Context$getVersions(context),
					A2(
						$author$project$Internal$Tools$VersionControl$sameForVersion,
						'v1.6',
						A2(
							$author$project$Internal$Tools$VersionControl$sameForVersion,
							'v1.5',
							A2(
								$author$project$Internal$Tools$VersionControl$sameForVersion,
								'v1.4',
								A2(
									$author$project$Internal$Tools$VersionControl$addMiddleLayer,
									{
										dq: $author$project$Internal$Api$LoginWithUsernameAndPassword$Api$loginWithUsernameAndPasswordV6,
										fy: $elm$core$Basics$identity,
										hl: F2(
											function (f, c) {
												return A2(
													$elm$core$Task$map,
													$author$project$Internal$Api$LoginWithUsernameAndPassword$V5$Upcast$upcastLoggedInResponse,
													f(c));
											}),
										eC: 'v1.3'
									},
									A2(
										$author$project$Internal$Tools$VersionControl$sameForVersion,
										'v1.2',
										A2(
											$author$project$Internal$Tools$VersionControl$addMiddleLayer,
											{dq: $author$project$Internal$Api$LoginWithUsernameAndPassword$Api$loginWithUsernameAndPasswordV5, fy: $elm$core$Basics$identity, hl: $elm$core$Basics$identity, eC: 'v1.1'},
											A2(
												$author$project$Internal$Tools$VersionControl$sameForVersion,
												'r0.6.1',
												A2(
													$author$project$Internal$Tools$VersionControl$sameForVersion,
													'r0.6.0',
													A2(
														$author$project$Internal$Tools$VersionControl$addMiddleLayer,
														{
															dq: $author$project$Internal$Api$LoginWithUsernameAndPassword$Api$loginWithUsernameAndPasswordV4,
															fy: $elm$core$Basics$identity,
															hl: F2(
																function (f, c) {
																	return A2(
																		$elm$core$Task$map,
																		$author$project$Internal$Api$LoginWithUsernameAndPassword$V4$Upcast$upcastLoggedInResponse,
																		f(c));
																}),
															eC: 'r0.5.0'
														},
														A2(
															$author$project$Internal$Tools$VersionControl$addMiddleLayer,
															{
																dq: $author$project$Internal$Api$LoginWithUsernameAndPassword$Api$loginWithUsernameAndPasswordV3,
																fy: $elm$core$Basics$identity,
																hl: F2(
																	function (f, c) {
																		return A2(
																			$elm$core$Task$map,
																			$author$project$Internal$Api$LoginWithUsernameAndPassword$V3$Upcast$upcastLoggedInResponse,
																			f(c));
																	}),
																eC: 'r0.4.0'
															},
															A2(
																$author$project$Internal$Tools$VersionControl$addMiddleLayer,
																{
																	dq: $author$project$Internal$Api$LoginWithUsernameAndPassword$Api$loginWithUsernameAndPasswordV2,
																	fy: function (_v0) {
																		var username = _v0.aA;
																		var password = _v0.as;
																		return {as: password, aA: username};
																	},
																	hl: F2(
																		function (f, c) {
																			return A2(
																				$elm$core$Task$map,
																				$author$project$Internal$Api$LoginWithUsernameAndPassword$V2$Upcast$upcastLoggedInResponse,
																				f(c));
																		}),
																	eC: 'r0.3.0'
																},
																A2(
																	$author$project$Internal$Tools$VersionControl$sameForVersion,
																	'r0.2.0',
																	A2(
																		$author$project$Internal$Tools$VersionControl$sameForVersion,
																		'r0.1.0',
																		A2(
																			$author$project$Internal$Tools$VersionControl$sameForVersion,
																			'r0.0.1',
																			$author$project$Internal$Tools$VersionControl$withBottomLayer(
																				{dq: $author$project$Internal$Api$LoginWithUsernameAndPassword$Api$loginWithUsernameAndPasswordV1, eC: 'r0.0.0'}))))))))))))))))),
			$elm$core$Basics$apR(input),
			context);
	});
var $author$project$Internal$Tools$Context$setAccessToken = F2(
	function (_v0, _v1) {
		var accessToken = _v0.b0;
		var loginParts = _v0.bU;
		var data = _v1;
		return _Utils_update(
			data,
			{b0: accessToken, bU: loginParts});
	});
var $author$project$Internal$Api$VaultUpdate$loginWithUsernameAndPassword = function (input) {
	return A3(
		$author$project$Internal$Api$VaultUpdate$toChain,
		function (output) {
			return {
				bh: $author$project$Internal$Tools$Context$setAccessToken(
					{
						b0: output.b0,
						bU: $elm$core$Maybe$Just(input)
					}),
				bo: _List_fromArray(
					[
						A2($author$project$Internal$Api$VaultUpdate$LoggedInWithUsernameAndPassword, input, output)
					])
			};
		},
		$author$project$Internal$Api$LoginWithUsernameAndPassword$Main$loginWithUsernameAndPassword,
		input);
};
var $author$project$Internal$Api$Chain$otherwise = F3(
	function (f2, f1, context) {
		return A2(
			$elm$core$Task$onError,
			$elm$core$Basics$always(
				f2(context)),
			f1(context));
	});
var $author$project$Internal$Api$VaultUpdate$withUserId = function (userId) {
	return $elm$core$Basics$always(
		$elm$core$Task$succeed(
			{
				bh: $author$project$Internal$Tools$Context$setUserId(userId),
				bo: _List_Nil
			}));
};
var $author$project$Internal$Api$VaultUpdate$whoAmI = function (muserId) {
	if (!muserId.$) {
		var userId = muserId.a;
		return $author$project$Internal$Api$VaultUpdate$withUserId(userId);
	} else {
		return $author$project$Internal$Api$VaultUpdate$getWhoAmI;
	}
};
var $author$project$Internal$Api$VaultUpdate$accessToken = function (ctoken) {
	switch (ctoken.$) {
		case 0:
			return $elm$core$Basics$always(
				$elm$core$Task$fail(
					$author$project$Internal$Tools$Exceptions$SDKException($author$project$Internal$Tools$Exceptions$NoAccessToken)));
		case 1:
			var t = ctoken.a;
			return A2(
				$author$project$Internal$Api$Chain$andThen,
				$author$project$Internal$Api$VaultUpdate$getWhoAmI,
				$elm$core$Basics$always(
					$elm$core$Task$succeed(
						{
							bh: $author$project$Internal$Tools$Context$setAccessToken(
								{b0: t, bU: $elm$core$Maybe$Nothing}),
							bo: _List_Nil
						})));
		case 2:
			var data = ctoken.a;
			return $elm$core$Basics$always(
				$elm$core$Task$succeed(
					{
						bh: A2(
							$elm$core$Basics$composeR,
							$author$project$Internal$Tools$Context$setAccessToken(
								{b0: data.b0, bU: $elm$core$Maybe$Nothing}),
							$author$project$Internal$Tools$Context$setUserId(data.c6)),
						bo: _List_Nil
					}));
		default:
			var username = ctoken.a.aA;
			var password = ctoken.a.as;
			var token = ctoken.a.hh;
			var deviceId = ctoken.a.a_;
			var initialDeviceDisplayName = ctoken.a.a1;
			var userId = ctoken.a.c6;
			if (!token.$) {
				var t = token.a;
				return A2(
					$author$project$Internal$Api$Chain$andThen,
					$author$project$Internal$Api$VaultUpdate$whoAmI(userId),
					$elm$core$Basics$always(
						$elm$core$Task$succeed(
							{
								bh: $author$project$Internal$Tools$Context$setAccessToken(
									{b0: t, bU: $elm$core$Maybe$Nothing}),
								bo: _List_Nil
							})));
			} else {
				return A2(
					$author$project$Internal$Api$Chain$andThen,
					function () {
						if (!userId.$) {
							var user = userId.a;
							return A2(
								$author$project$Internal$Api$Chain$otherwise,
								$author$project$Internal$Api$VaultUpdate$withUserId(user),
								$author$project$Internal$Api$VaultUpdate$getWhoAmI);
						} else {
							return $author$project$Internal$Api$VaultUpdate$getWhoAmI;
						}
					}(),
					$author$project$Internal$Api$VaultUpdate$loginWithUsernameAndPassword(
						{a_: deviceId, a1: initialDeviceDisplayName, as: password, aA: username}));
			}
	}
};
var $author$project$Internal$Api$Credentials$baseUrl = function (_v0) {
	var homeserver = _v0.dE;
	return homeserver;
};
var $author$project$Internal$Api$Credentials$versions = function (_v0) {
	var vs = _v0.c7;
	return vs;
};
var $author$project$Internal$Api$VaultUpdate$UpdateVersions = function (a) {
	return {$: 16, a: a};
};
var $elm$core$Dict$fromList = function (assocs) {
	return A3(
		$elm$core$List$foldl,
		F2(
			function (_v0, dict) {
				var key = _v0.a;
				var value = _v0.b;
				return A3($elm$core$Dict$insert, key, value, dict);
			}),
		$elm$core$Dict$empty,
		assocs);
};
var $elm$json$Json$Decode$keyValuePairs = _Json_decodeKeyValuePairs;
var $elm$json$Json$Decode$dict = function (decoder) {
	return A2(
		$elm$json$Json$Decode$map,
		$elm$core$Dict$fromList,
		$elm$json$Json$Decode$keyValuePairs(decoder));
};
var $elm$json$Json$Decode$list = _Json_decodeList;
var $author$project$Internal$Api$Versions$V1$Versions$versionsDecoder = A3(
	$elm$json$Json$Decode$map2,
	F2(
		function (a, b) {
			return {c5: a, eD: b};
		}),
	A3(
		$author$project$Internal$Tools$DecodeExtra$opFieldWithDefault,
		'unstable_features',
		$elm$core$Dict$empty,
		$elm$json$Json$Decode$dict($elm$json$Json$Decode$bool)),
	A2(
		$elm$json$Json$Decode$field,
		'versions',
		$elm$json$Json$Decode$list($elm$json$Json$Decode$string)));
var $author$project$Internal$Api$Versions$Api$versionsV1 = A2(
	$elm$core$Basics$composeR,
	A2($author$project$Internal$Api$Request$callApi, 'GET', '/_matrix/client/versions'),
	$author$project$Internal$Api$Request$toTask($author$project$Internal$Api$Versions$V1$Versions$versionsDecoder));
var $author$project$Internal$Api$Versions$Main$getVersions = function (context) {
	return $author$project$Internal$Api$Versions$Api$versionsV1(context);
};
var $author$project$Internal$Tools$Context$setVersions = F2(
	function (versions, _v0) {
		var data = _v0;
		return _Utils_update(
			data,
			{eD: versions});
	});
var $author$project$Internal$Api$VaultUpdate$getVersions = A3(
	$author$project$Internal$Api$VaultUpdate$toChain,
	function (output) {
		return {
			bh: $author$project$Internal$Tools$Context$setVersions(output.eD),
			bo: _List_fromArray(
				[
					$author$project$Internal$Api$VaultUpdate$UpdateVersions(output)
				])
		};
	},
	F2(
		function (context, _v0) {
			return $author$project$Internal$Api$Versions$Main$getVersions(context);
		}),
	0);
var $author$project$Internal$Api$Helpers$retryTask = F2(
	function (n, task) {
		return (n <= 0) ? task : A2(
			$elm$core$Task$onError,
			function (err) {
				var retry = A2($author$project$Internal$Api$Helpers$retryTask, n - 1, task);
				switch (err.$) {
					case 0:
						if (!err.a.$) {
							return $elm$core$Task$fail(err);
						} else {
							return retry;
						}
					case 1:
						if (!err.a.$) {
							return retry;
						} else {
							return $elm$core$Task$fail(err);
						}
					case 2:
						return $elm$core$Task$fail(err);
					default:
						return $elm$core$Task$fail(err);
				}
			},
			task);
	});
var $author$project$Internal$Api$Chain$tryNTimes = F3(
	function (n, f, context) {
		return A2(
			$author$project$Internal$Api$Helpers$retryTask,
			n - 1,
			f(context));
	});
var $author$project$Internal$Api$VaultUpdate$withVersions = function (vs) {
	return $elm$core$Basics$always(
		$elm$core$Task$succeed(
			{
				bh: $author$project$Internal$Tools$Context$setVersions(vs.eD),
				bo: _List_Nil
			}));
};
var $author$project$Internal$Api$VaultUpdate$versions = function (mVersions) {
	return A2(
		$author$project$Internal$Api$Chain$tryNTimes,
		5,
		function () {
			if (!mVersions.$) {
				var vs = mVersions.a;
				return $author$project$Internal$Api$VaultUpdate$withVersions(vs);
			} else {
				return $author$project$Internal$Api$VaultUpdate$getVersions;
			}
		}());
};
var $author$project$Internal$Tools$Context$setBaseUrl = F2(
	function (baseUrl, _v0) {
		var data = _v0;
		return _Utils_update(
			data,
			{aV: baseUrl});
	});
var $author$project$Internal$Api$VaultUpdate$withBaseUrl = function (baseUrl) {
	return $elm$core$Basics$always(
		$elm$core$Task$succeed(
			{
				bh: $author$project$Internal$Tools$Context$setBaseUrl(baseUrl),
				bo: _List_Nil
			}));
};
var $author$project$Internal$Api$VaultUpdate$makeVB = function (cred) {
	return A2(
		$author$project$Internal$Api$Chain$andThen,
		$author$project$Internal$Api$VaultUpdate$versions(
			$author$project$Internal$Api$Credentials$versions(cred)),
		$author$project$Internal$Api$VaultUpdate$withBaseUrl(
			$author$project$Internal$Api$Credentials$baseUrl(cred)));
};
var $author$project$Internal$Api$Chain$maybe = function (f) {
	return A2(
		$elm$core$Basics$composeR,
		f,
		$elm$core$Task$onError(
			$elm$core$Basics$always(
				$elm$core$Task$succeed(
					{bh: $elm$core$Basics$identity, bo: _List_Nil}))));
};
var $author$project$Internal$Tools$LoginValues$removeToken = function (t) {
	switch (t.$) {
		case 0:
			return $author$project$Internal$Tools$LoginValues$NoAccess;
		case 1:
			return $author$project$Internal$Tools$LoginValues$NoAccess;
		case 2:
			return $author$project$Internal$Tools$LoginValues$NoAccess;
		default:
			var data = t.a;
			return $author$project$Internal$Tools$LoginValues$UsernameAndPassword(
				_Utils_update(
					data,
					{hh: $elm$core$Maybe$Nothing}));
	}
};
var $author$project$Internal$Api$Credentials$refreshedAccessToken = function (_v0) {
	var access = _v0.J;
	return $author$project$Internal$Tools$LoginValues$removeToken(access);
};
var $author$project$Internal$Api$VaultUpdate$SyncUpdate = F2(
	function (a, b) {
		return {$: 14, a: a, b: b};
	});
var $author$project$Internal$Tools$SpecEnums$fromUserPresence = function (_enum) {
	switch (_enum) {
		case 0:
			return 'offline';
		case 1:
			return 'online';
		default:
			return 'unavailable';
	}
};
var $author$project$Internal$Api$Request$QueryParam = function (a) {
	return {$: 4, a: a};
};
var $elm$url$Url$Builder$QueryParameter = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var $elm$url$Url$percentEncode = _Url_percentEncode;
var $elm$url$Url$Builder$string = F2(
	function (key, value) {
		return A2(
			$elm$url$Url$Builder$QueryParameter,
			$elm$url$Url$percentEncode(key),
			$elm$url$Url$percentEncode(value));
	});
var $author$project$Internal$Api$Request$queryBool = F3(
	function (key, value, _v0) {
		return $author$project$Internal$Api$Request$QueryParam(
			A2(
				$elm$url$Url$Builder$string,
				key,
				value ? 'true' : 'false'));
	});
var $author$project$Internal$Api$Request$queryOpBool = F2(
	function (key, value) {
		if (!value.$) {
			var b = value.a;
			return A2($author$project$Internal$Api$Request$queryBool, key, b);
		} else {
			return $elm$core$Basics$always($author$project$Internal$Api$Request$NoAttr);
		}
	});
var $elm$url$Url$Builder$int = F2(
	function (key, value) {
		return A2(
			$elm$url$Url$Builder$QueryParameter,
			$elm$url$Url$percentEncode(key),
			$elm$core$String$fromInt(value));
	});
var $author$project$Internal$Api$Request$queryInt = F3(
	function (key, value, _v0) {
		return $author$project$Internal$Api$Request$QueryParam(
			A2($elm$url$Url$Builder$int, key, value));
	});
var $author$project$Internal$Api$Request$queryOpInt = F2(
	function (key, value) {
		if (!value.$) {
			var i = value.a;
			return A2($author$project$Internal$Api$Request$queryInt, key, i);
		} else {
			return $elm$core$Basics$always($author$project$Internal$Api$Request$NoAttr);
		}
	});
var $author$project$Internal$Api$Request$queryString = F3(
	function (key, value, _v0) {
		return $author$project$Internal$Api$Request$QueryParam(
			A2($elm$url$Url$Builder$string, key, value));
	});
var $author$project$Internal$Api$Request$queryOpString = F2(
	function (key, value) {
		if (!value.$) {
			var s = value.a;
			return A2($author$project$Internal$Api$Request$queryString, key, s);
		} else {
			return $elm$core$Basics$always($author$project$Internal$Api$Request$NoAttr);
		}
	});
var $author$project$Internal$Api$Sync$V1$SpecObjects$eventDecoder = A3(
	$elm$json$Json$Decode$map2,
	F2(
		function (a, b) {
			return {bf: a, fB: b};
		}),
	A2($elm$json$Json$Decode$field, 'content', $elm$json$Json$Decode$value),
	A2($elm$json$Json$Decode$field, 'type', $elm$json$Json$Decode$string));
var $author$project$Internal$Api$Sync$V1$SpecObjects$accountDataDecoder = A2(
	$elm$json$Json$Decode$map,
	function (a) {
		return {e: a};
	},
	A3(
		$author$project$Internal$Tools$DecodeExtra$opFieldWithDefault,
		'events',
		_List_Nil,
		$elm$json$Json$Decode$list($author$project$Internal$Api$Sync$V1$SpecObjects$eventDecoder)));
var $author$project$Internal$Api$Sync$V1$SpecObjects$presenceDecoder = A2(
	$elm$json$Json$Decode$map,
	function (a) {
		return {e: a};
	},
	A3(
		$author$project$Internal$Tools$DecodeExtra$opFieldWithDefault,
		'events',
		_List_Nil,
		$elm$json$Json$Decode$list($author$project$Internal$Api$Sync$V1$SpecObjects$eventDecoder)));
var $author$project$Internal$Api$Sync$V1$SpecObjects$strippedStateEventDecoder = A5(
	$elm$json$Json$Decode$map4,
	F4(
		function (a, b, c, d) {
			return {bf: a, fB: d, cU: b, gT: c};
		}),
	A2($elm$json$Json$Decode$field, 'content', $elm$json$Json$Decode$value),
	A2($elm$json$Json$Decode$field, 'sender', $elm$json$Json$Decode$string),
	A2($elm$json$Json$Decode$field, 'state_key', $elm$json$Json$Decode$string),
	A2($elm$json$Json$Decode$field, 'type', $elm$json$Json$Decode$string));
var $author$project$Internal$Api$Sync$V1$SpecObjects$inviteStateDecoder = A2(
	$elm$json$Json$Decode$map,
	function (a) {
		return {e: a};
	},
	A3(
		$author$project$Internal$Tools$DecodeExtra$opFieldWithDefault,
		'events',
		_List_Nil,
		$elm$json$Json$Decode$list($author$project$Internal$Api$Sync$V1$SpecObjects$strippedStateEventDecoder)));
var $author$project$Internal$Api$Sync$V1$SpecObjects$invitedRoomDecoder = A2(
	$elm$json$Json$Decode$map,
	function (a) {
		return {cr: a};
	},
	A2($author$project$Internal$Tools$DecodeExtra$opField, 'invite_state', $author$project$Internal$Api$Sync$V1$SpecObjects$inviteStateDecoder));
var $author$project$Internal$Api$Sync$V1$SpecObjects$ephemeralDecoder = A2(
	$elm$json$Json$Decode$map,
	function (a) {
		return {e: a};
	},
	A3(
		$author$project$Internal$Tools$DecodeExtra$opFieldWithDefault,
		'events',
		_List_Nil,
		$elm$json$Json$Decode$list($author$project$Internal$Api$Sync$V1$SpecObjects$eventDecoder)));
var $author$project$Internal$Api$Sync$V1$SpecObjects$roomSummaryDecoder = A4(
	$elm$json$Json$Decode$map3,
	F3(
		function (a, b, c) {
			return {cB: a, cE: b, cF: c};
		}),
	A2(
		$author$project$Internal$Tools$DecodeExtra$opField,
		'm.heroes',
		$elm$json$Json$Decode$list($elm$json$Json$Decode$string)),
	A2($author$project$Internal$Tools$DecodeExtra$opField, 'm.invited_member_count', $elm$json$Json$Decode$int),
	A2($author$project$Internal$Tools$DecodeExtra$opField, 'm.joined_member_count', $elm$json$Json$Decode$int));
var $author$project$Internal$Api$Sync$V1$SpecObjects$UnsignedData = $elm$core$Basics$identity;
var $elm$json$Json$Decode$lazy = function (thunk) {
	return A2(
		$elm$json$Json$Decode$andThen,
		thunk,
		$elm$json$Json$Decode$succeed(0));
};
var $author$project$Internal$Tools$Timestamp$timestampDecoder = A2($elm$json$Json$Decode$map, $elm$time$Time$millisToPosix, $elm$json$Json$Decode$int);
function $author$project$Internal$Api$Sync$V1$SpecObjects$cyclic$unsignedDataDecoder() {
	return A5(
		$elm$json$Json$Decode$map4,
		F4(
			function (a, b, c, d) {
				return {df: a, d4: b, ea: c, ez: d};
			}),
		A2($author$project$Internal$Tools$DecodeExtra$opField, 'age', $elm$json$Json$Decode$int),
		A2($author$project$Internal$Tools$DecodeExtra$opField, 'prev_content', $elm$json$Json$Decode$value),
		A2(
			$author$project$Internal$Tools$DecodeExtra$opField,
			'redacted_because',
			$author$project$Internal$Api$Sync$V1$SpecObjects$cyclic$clientEventWithoutRoomIdDecoder()),
		A2($author$project$Internal$Tools$DecodeExtra$opField, 'transaction_id', $elm$json$Json$Decode$string));
}
function $author$project$Internal$Api$Sync$V1$SpecObjects$cyclic$clientEventWithoutRoomIdDecoder() {
	return A8(
		$elm$json$Json$Decode$map7,
		F7(
			function (a, b, c, d, e, f, g) {
				return {bf: a, du: b, fB: f, cN: c, cU: d, gT: e, c4: g};
			}),
		A2($elm$json$Json$Decode$field, 'content', $elm$json$Json$Decode$value),
		A2($elm$json$Json$Decode$field, 'event_id', $elm$json$Json$Decode$string),
		A2($elm$json$Json$Decode$field, 'origin_server_ts', $author$project$Internal$Tools$Timestamp$timestampDecoder),
		A2($elm$json$Json$Decode$field, 'sender', $elm$json$Json$Decode$string),
		A2($author$project$Internal$Tools$DecodeExtra$opField, 'state_key', $elm$json$Json$Decode$string),
		A2($elm$json$Json$Decode$field, 'type', $elm$json$Json$Decode$string),
		A2(
			$author$project$Internal$Tools$DecodeExtra$opField,
			'unsigned',
			$elm$json$Json$Decode$lazy(
				function (_v0) {
					return $author$project$Internal$Api$Sync$V1$SpecObjects$cyclic$unsignedDataDecoder();
				})));
}
var $author$project$Internal$Api$Sync$V1$SpecObjects$unsignedDataDecoder = $author$project$Internal$Api$Sync$V1$SpecObjects$cyclic$unsignedDataDecoder();
$author$project$Internal$Api$Sync$V1$SpecObjects$cyclic$unsignedDataDecoder = function () {
	return $author$project$Internal$Api$Sync$V1$SpecObjects$unsignedDataDecoder;
};
var $author$project$Internal$Api$Sync$V1$SpecObjects$clientEventWithoutRoomIdDecoder = $author$project$Internal$Api$Sync$V1$SpecObjects$cyclic$clientEventWithoutRoomIdDecoder();
$author$project$Internal$Api$Sync$V1$SpecObjects$cyclic$clientEventWithoutRoomIdDecoder = function () {
	return $author$project$Internal$Api$Sync$V1$SpecObjects$clientEventWithoutRoomIdDecoder;
};
var $author$project$Internal$Api$Sync$V1$SpecObjects$stateDecoder = A2(
	$elm$json$Json$Decode$map,
	function (a) {
		return {e: a};
	},
	A3(
		$author$project$Internal$Tools$DecodeExtra$opFieldWithDefault,
		'events',
		_List_Nil,
		$elm$json$Json$Decode$list($author$project$Internal$Api$Sync$V1$SpecObjects$clientEventWithoutRoomIdDecoder)));
var $author$project$Internal$Api$Sync$V1$SpecObjects$timelineDecoder = A4(
	$elm$json$Json$Decode$map3,
	F3(
		function (a, b, c) {
			return {e: a, cA: b, cP: c};
		}),
	A3(
		$author$project$Internal$Tools$DecodeExtra$opFieldWithDefault,
		'events',
		_List_Nil,
		$elm$json$Json$Decode$list($author$project$Internal$Api$Sync$V1$SpecObjects$clientEventWithoutRoomIdDecoder)),
	A3($author$project$Internal$Tools$DecodeExtra$opFieldWithDefault, 'limited', false, $elm$json$Json$Decode$bool),
	A2($author$project$Internal$Tools$DecodeExtra$opField, 'prev_batch', $elm$json$Json$Decode$string));
var $author$project$Internal$Api$Sync$V1$SpecObjects$unreadNotificationCountsDecoder = A3(
	$elm$json$Json$Decode$map2,
	F2(
		function (a, b) {
			return {co: a, cL: b};
		}),
	A2($author$project$Internal$Tools$DecodeExtra$opField, 'highlight_count', $elm$json$Json$Decode$int),
	A2($author$project$Internal$Tools$DecodeExtra$opField, 'notification_count', $elm$json$Json$Decode$int));
var $author$project$Internal$Api$Sync$V1$SpecObjects$joinedRoomDecoder = A7(
	$elm$json$Json$Decode$map6,
	F6(
		function (a, b, c, d, e, f) {
			return {Z: a, cg: b, es: c, c0: d, ba: e, c2: f};
		}),
	A2($author$project$Internal$Tools$DecodeExtra$opField, 'account_data', $author$project$Internal$Api$Sync$V1$SpecObjects$accountDataDecoder),
	A2($author$project$Internal$Tools$DecodeExtra$opField, 'ephemeral', $author$project$Internal$Api$Sync$V1$SpecObjects$ephemeralDecoder),
	A2($author$project$Internal$Tools$DecodeExtra$opField, 'state', $author$project$Internal$Api$Sync$V1$SpecObjects$stateDecoder),
	A2($author$project$Internal$Tools$DecodeExtra$opField, 'summary', $author$project$Internal$Api$Sync$V1$SpecObjects$roomSummaryDecoder),
	A2($author$project$Internal$Tools$DecodeExtra$opField, 'timeline', $author$project$Internal$Api$Sync$V1$SpecObjects$timelineDecoder),
	A2($author$project$Internal$Tools$DecodeExtra$opField, 'unread_notifications', $author$project$Internal$Api$Sync$V1$SpecObjects$unreadNotificationCountsDecoder));
var $author$project$Internal$Api$Sync$V1$SpecObjects$knockStateDecoder = A2(
	$elm$json$Json$Decode$map,
	function (a) {
		return {e: a};
	},
	A3(
		$author$project$Internal$Tools$DecodeExtra$opFieldWithDefault,
		'events',
		_List_Nil,
		$elm$json$Json$Decode$list($author$project$Internal$Api$Sync$V1$SpecObjects$strippedStateEventDecoder)));
var $author$project$Internal$Api$Sync$V1$SpecObjects$knockedRoomDecoder = A2(
	$elm$json$Json$Decode$map,
	function (a) {
		return {cw: a};
	},
	A2($author$project$Internal$Tools$DecodeExtra$opField, 'knock_state', $author$project$Internal$Api$Sync$V1$SpecObjects$knockStateDecoder));
var $author$project$Internal$Api$Sync$V1$SpecObjects$leftRoomDecoder = A4(
	$elm$json$Json$Decode$map3,
	F3(
		function (a, b, c) {
			return {Z: a, es: b, ba: c};
		}),
	A2($author$project$Internal$Tools$DecodeExtra$opField, 'account_data', $author$project$Internal$Api$Sync$V1$SpecObjects$accountDataDecoder),
	A2($author$project$Internal$Tools$DecodeExtra$opField, 'state', $author$project$Internal$Api$Sync$V1$SpecObjects$stateDecoder),
	A2($author$project$Internal$Tools$DecodeExtra$opField, 'timeline', $author$project$Internal$Api$Sync$V1$SpecObjects$timelineDecoder));
var $author$project$Internal$Api$Sync$V1$SpecObjects$roomsDecoder = A5(
	$elm$json$Json$Decode$map4,
	F4(
		function (a, b, c, d) {
			return {cq: a, ct: b, cv: c, cz: d};
		}),
	A3(
		$author$project$Internal$Tools$DecodeExtra$opFieldWithDefault,
		'invite',
		$elm$core$Dict$empty,
		$elm$json$Json$Decode$dict($author$project$Internal$Api$Sync$V1$SpecObjects$invitedRoomDecoder)),
	A3(
		$author$project$Internal$Tools$DecodeExtra$opFieldWithDefault,
		'join',
		$elm$core$Dict$empty,
		$elm$json$Json$Decode$dict($author$project$Internal$Api$Sync$V1$SpecObjects$joinedRoomDecoder)),
	A3(
		$author$project$Internal$Tools$DecodeExtra$opFieldWithDefault,
		'knock',
		$elm$core$Dict$empty,
		$elm$json$Json$Decode$dict($author$project$Internal$Api$Sync$V1$SpecObjects$knockedRoomDecoder)),
	A3(
		$author$project$Internal$Tools$DecodeExtra$opFieldWithDefault,
		'leave',
		$elm$core$Dict$empty,
		$elm$json$Json$Decode$dict($author$project$Internal$Api$Sync$V1$SpecObjects$leftRoomDecoder)));
var $author$project$Internal$Api$Sync$V1$SpecObjects$syncDecoder = A5(
	$elm$json$Json$Decode$map4,
	F4(
		function (a, b, c, d) {
			return {Z: a, cK: b, cO: c, cT: d};
		}),
	A2($author$project$Internal$Tools$DecodeExtra$opField, 'account_data', $author$project$Internal$Api$Sync$V1$SpecObjects$accountDataDecoder),
	A2($elm$json$Json$Decode$field, 'next_batch', $elm$json$Json$Decode$string),
	A2($author$project$Internal$Tools$DecodeExtra$opField, 'presence', $author$project$Internal$Api$Sync$V1$SpecObjects$presenceDecoder),
	A2($author$project$Internal$Tools$DecodeExtra$opField, 'rooms', $author$project$Internal$Api$Sync$V1$SpecObjects$roomsDecoder));
var $author$project$Internal$Api$Request$Timeout = function (a) {
	return {$: 6, a: a};
};
var $author$project$Internal$Api$Request$timeout = F2(
	function (mf, _v0) {
		if (!mf.$) {
			var f = mf.a;
			return $author$project$Internal$Api$Request$Timeout(f);
		} else {
			return $author$project$Internal$Api$Request$NoAttr;
		}
	});
var $author$project$Internal$Api$Sync$Api$syncV1 = function (data) {
	return A2(
		$elm$core$Basics$composeR,
		A2($author$project$Internal$Api$Request$callApi, 'GET', '/_matrix/client/v3/sync'),
		A2(
			$elm$core$Basics$composeR,
			$author$project$Internal$Api$Request$withAttributes(
				_List_fromArray(
					[
						$author$project$Internal$Api$Request$accessToken,
						A2($author$project$Internal$Api$Request$queryOpString, 'filter', data.ap),
						A2($author$project$Internal$Api$Request$queryOpBool, 'full_state', data.cj),
						A2(
						$author$project$Internal$Api$Request$queryOpString,
						'set_presence',
						A2($elm$core$Maybe$map, $author$project$Internal$Tools$SpecEnums$fromUserPresence, data.cW)),
						A2($author$project$Internal$Api$Request$queryOpString, 'since', data.cY),
						A2($author$project$Internal$Api$Request$queryOpInt, 'timeout', data.hf),
						$author$project$Internal$Api$Request$timeout(
						A2(
							$elm$core$Maybe$map,
							A2(
								$elm$core$Basics$composeR,
								$elm$core$Basics$mul(1000),
								$elm$core$Basics$toFloat),
							data.hf))
					])),
			$author$project$Internal$Api$Request$toTask($author$project$Internal$Api$Sync$V1$SpecObjects$syncDecoder)));
};
var $author$project$Internal$Api$Sync$V2$SpecObjects$eventDecoder = A3(
	$elm$json$Json$Decode$map2,
	F2(
		function (a, b) {
			return {bf: a, fB: b};
		}),
	A2($elm$json$Json$Decode$field, 'content', $elm$json$Json$Decode$value),
	A2($elm$json$Json$Decode$field, 'type', $elm$json$Json$Decode$string));
var $author$project$Internal$Api$Sync$V2$SpecObjects$accountDataDecoder = A2(
	$elm$json$Json$Decode$map,
	function (a) {
		return {e: a};
	},
	A3(
		$author$project$Internal$Tools$DecodeExtra$opFieldWithDefault,
		'events',
		_List_Nil,
		$elm$json$Json$Decode$list($author$project$Internal$Api$Sync$V2$SpecObjects$eventDecoder)));
var $author$project$Internal$Api$Sync$V2$SpecObjects$presenceDecoder = A2(
	$elm$json$Json$Decode$map,
	function (a) {
		return {e: a};
	},
	A3(
		$author$project$Internal$Tools$DecodeExtra$opFieldWithDefault,
		'events',
		_List_Nil,
		$elm$json$Json$Decode$list($author$project$Internal$Api$Sync$V2$SpecObjects$eventDecoder)));
var $author$project$Internal$Api$Sync$V2$SpecObjects$strippedStateEventDecoder = A5(
	$elm$json$Json$Decode$map4,
	F4(
		function (a, b, c, d) {
			return {bf: a, fB: d, cU: b, gT: c};
		}),
	A2($elm$json$Json$Decode$field, 'content', $elm$json$Json$Decode$value),
	A2($elm$json$Json$Decode$field, 'sender', $elm$json$Json$Decode$string),
	A2($elm$json$Json$Decode$field, 'state_key', $elm$json$Json$Decode$string),
	A2($elm$json$Json$Decode$field, 'type', $elm$json$Json$Decode$string));
var $author$project$Internal$Api$Sync$V2$SpecObjects$inviteStateDecoder = A2(
	$elm$json$Json$Decode$map,
	function (a) {
		return {e: a};
	},
	A3(
		$author$project$Internal$Tools$DecodeExtra$opFieldWithDefault,
		'events',
		_List_Nil,
		$elm$json$Json$Decode$list($author$project$Internal$Api$Sync$V2$SpecObjects$strippedStateEventDecoder)));
var $author$project$Internal$Api$Sync$V2$SpecObjects$invitedRoomDecoder = A2(
	$elm$json$Json$Decode$map,
	function (a) {
		return {cr: a};
	},
	A2($author$project$Internal$Tools$DecodeExtra$opField, 'invite_state', $author$project$Internal$Api$Sync$V2$SpecObjects$inviteStateDecoder));
var $author$project$Internal$Api$Sync$V2$SpecObjects$ephemeralDecoder = A2(
	$elm$json$Json$Decode$map,
	function (a) {
		return {e: a};
	},
	A3(
		$author$project$Internal$Tools$DecodeExtra$opFieldWithDefault,
		'events',
		_List_Nil,
		$elm$json$Json$Decode$list($author$project$Internal$Api$Sync$V2$SpecObjects$eventDecoder)));
var $author$project$Internal$Api$Sync$V2$SpecObjects$roomSummaryDecoder = A4(
	$elm$json$Json$Decode$map3,
	F3(
		function (a, b, c) {
			return {cB: a, cE: b, cF: c};
		}),
	A2(
		$author$project$Internal$Tools$DecodeExtra$opField,
		'm.heroes',
		$elm$json$Json$Decode$list($elm$json$Json$Decode$string)),
	A2($author$project$Internal$Tools$DecodeExtra$opField, 'm.invited_member_count', $elm$json$Json$Decode$int),
	A2($author$project$Internal$Tools$DecodeExtra$opField, 'm.joined_member_count', $elm$json$Json$Decode$int));
var $author$project$Internal$Api$Sync$V2$SpecObjects$UnsignedData = $elm$core$Basics$identity;
function $author$project$Internal$Api$Sync$V2$SpecObjects$cyclic$unsignedDataDecoder() {
	return A5(
		$elm$json$Json$Decode$map4,
		F4(
			function (a, b, c, d) {
				return {df: a, d4: b, ea: c, ez: d};
			}),
		A2($author$project$Internal$Tools$DecodeExtra$opField, 'age', $elm$json$Json$Decode$int),
		A2($author$project$Internal$Tools$DecodeExtra$opField, 'prev_content', $elm$json$Json$Decode$value),
		A2(
			$author$project$Internal$Tools$DecodeExtra$opField,
			'redacted_because',
			$author$project$Internal$Api$Sync$V2$SpecObjects$cyclic$clientEventWithoutRoomIdDecoder()),
		A2($author$project$Internal$Tools$DecodeExtra$opField, 'transaction_id', $elm$json$Json$Decode$string));
}
function $author$project$Internal$Api$Sync$V2$SpecObjects$cyclic$clientEventWithoutRoomIdDecoder() {
	return A8(
		$elm$json$Json$Decode$map7,
		F7(
			function (a, b, c, d, e, f, g) {
				return {bf: a, du: b, fB: f, cN: c, cU: d, gT: e, c4: g};
			}),
		A2($elm$json$Json$Decode$field, 'content', $elm$json$Json$Decode$value),
		A2($elm$json$Json$Decode$field, 'event_id', $elm$json$Json$Decode$string),
		A2($elm$json$Json$Decode$field, 'origin_server_ts', $author$project$Internal$Tools$Timestamp$timestampDecoder),
		A2($elm$json$Json$Decode$field, 'sender', $elm$json$Json$Decode$string),
		A2($author$project$Internal$Tools$DecodeExtra$opField, 'state_key', $elm$json$Json$Decode$string),
		A2($elm$json$Json$Decode$field, 'type', $elm$json$Json$Decode$string),
		A2(
			$author$project$Internal$Tools$DecodeExtra$opField,
			'unsigned',
			$elm$json$Json$Decode$lazy(
				function (_v0) {
					return $author$project$Internal$Api$Sync$V2$SpecObjects$cyclic$unsignedDataDecoder();
				})));
}
var $author$project$Internal$Api$Sync$V2$SpecObjects$unsignedDataDecoder = $author$project$Internal$Api$Sync$V2$SpecObjects$cyclic$unsignedDataDecoder();
$author$project$Internal$Api$Sync$V2$SpecObjects$cyclic$unsignedDataDecoder = function () {
	return $author$project$Internal$Api$Sync$V2$SpecObjects$unsignedDataDecoder;
};
var $author$project$Internal$Api$Sync$V2$SpecObjects$clientEventWithoutRoomIdDecoder = $author$project$Internal$Api$Sync$V2$SpecObjects$cyclic$clientEventWithoutRoomIdDecoder();
$author$project$Internal$Api$Sync$V2$SpecObjects$cyclic$clientEventWithoutRoomIdDecoder = function () {
	return $author$project$Internal$Api$Sync$V2$SpecObjects$clientEventWithoutRoomIdDecoder;
};
var $author$project$Internal$Api$Sync$V2$SpecObjects$stateDecoder = A2(
	$elm$json$Json$Decode$map,
	function (a) {
		return {e: a};
	},
	A3(
		$author$project$Internal$Tools$DecodeExtra$opFieldWithDefault,
		'events',
		_List_Nil,
		$elm$json$Json$Decode$list($author$project$Internal$Api$Sync$V2$SpecObjects$clientEventWithoutRoomIdDecoder)));
var $author$project$Internal$Api$Sync$V2$SpecObjects$threadNotificationCountsDecoder = A3(
	$elm$json$Json$Decode$map2,
	F2(
		function (a, b) {
			return {co: a, cL: b};
		}),
	A2($author$project$Internal$Tools$DecodeExtra$opField, 'highlight_count', $elm$json$Json$Decode$int),
	A2($author$project$Internal$Tools$DecodeExtra$opField, 'notification_count', $elm$json$Json$Decode$int));
var $author$project$Internal$Api$Sync$V2$SpecObjects$timelineDecoder = A4(
	$elm$json$Json$Decode$map3,
	F3(
		function (a, b, c) {
			return {e: a, cA: b, cP: c};
		}),
	A3(
		$author$project$Internal$Tools$DecodeExtra$opFieldWithDefault,
		'events',
		_List_Nil,
		$elm$json$Json$Decode$list($author$project$Internal$Api$Sync$V2$SpecObjects$clientEventWithoutRoomIdDecoder)),
	A3($author$project$Internal$Tools$DecodeExtra$opFieldWithDefault, 'limited', false, $elm$json$Json$Decode$bool),
	A2($author$project$Internal$Tools$DecodeExtra$opField, 'prev_batch', $elm$json$Json$Decode$string));
var $author$project$Internal$Api$Sync$V2$SpecObjects$unreadNotificationCountsDecoder = A3(
	$elm$json$Json$Decode$map2,
	F2(
		function (a, b) {
			return {co: a, cL: b};
		}),
	A2($author$project$Internal$Tools$DecodeExtra$opField, 'highlight_count', $elm$json$Json$Decode$int),
	A2($author$project$Internal$Tools$DecodeExtra$opField, 'notification_count', $elm$json$Json$Decode$int));
var $author$project$Internal$Api$Sync$V2$SpecObjects$joinedRoomDecoder = A8(
	$elm$json$Json$Decode$map7,
	F7(
		function (a, b, c, d, e, f, g) {
			return {Z: a, cg: b, es: c, c0: d, ba: e, c2: f, c3: g};
		}),
	A2($author$project$Internal$Tools$DecodeExtra$opField, 'account_data', $author$project$Internal$Api$Sync$V2$SpecObjects$accountDataDecoder),
	A2($author$project$Internal$Tools$DecodeExtra$opField, 'ephemeral', $author$project$Internal$Api$Sync$V2$SpecObjects$ephemeralDecoder),
	A2($author$project$Internal$Tools$DecodeExtra$opField, 'state', $author$project$Internal$Api$Sync$V2$SpecObjects$stateDecoder),
	A2($author$project$Internal$Tools$DecodeExtra$opField, 'summary', $author$project$Internal$Api$Sync$V2$SpecObjects$roomSummaryDecoder),
	A2($author$project$Internal$Tools$DecodeExtra$opField, 'timeline', $author$project$Internal$Api$Sync$V2$SpecObjects$timelineDecoder),
	A2($author$project$Internal$Tools$DecodeExtra$opField, 'unread_notifications', $author$project$Internal$Api$Sync$V2$SpecObjects$unreadNotificationCountsDecoder),
	A3(
		$author$project$Internal$Tools$DecodeExtra$opFieldWithDefault,
		'unread_thread_notifications',
		$elm$core$Dict$empty,
		$elm$json$Json$Decode$dict($author$project$Internal$Api$Sync$V2$SpecObjects$threadNotificationCountsDecoder)));
var $author$project$Internal$Api$Sync$V2$SpecObjects$knockStateDecoder = A2(
	$elm$json$Json$Decode$map,
	function (a) {
		return {e: a};
	},
	A3(
		$author$project$Internal$Tools$DecodeExtra$opFieldWithDefault,
		'events',
		_List_Nil,
		$elm$json$Json$Decode$list($author$project$Internal$Api$Sync$V2$SpecObjects$strippedStateEventDecoder)));
var $author$project$Internal$Api$Sync$V2$SpecObjects$knockedRoomDecoder = A2(
	$elm$json$Json$Decode$map,
	function (a) {
		return {cw: a};
	},
	A2($author$project$Internal$Tools$DecodeExtra$opField, 'knock_state', $author$project$Internal$Api$Sync$V2$SpecObjects$knockStateDecoder));
var $author$project$Internal$Api$Sync$V2$SpecObjects$leftRoomDecoder = A4(
	$elm$json$Json$Decode$map3,
	F3(
		function (a, b, c) {
			return {Z: a, es: b, ba: c};
		}),
	A2($author$project$Internal$Tools$DecodeExtra$opField, 'account_data', $author$project$Internal$Api$Sync$V2$SpecObjects$accountDataDecoder),
	A2($author$project$Internal$Tools$DecodeExtra$opField, 'state', $author$project$Internal$Api$Sync$V2$SpecObjects$stateDecoder),
	A2($author$project$Internal$Tools$DecodeExtra$opField, 'timeline', $author$project$Internal$Api$Sync$V2$SpecObjects$timelineDecoder));
var $author$project$Internal$Api$Sync$V2$SpecObjects$roomsDecoder = A5(
	$elm$json$Json$Decode$map4,
	F4(
		function (a, b, c, d) {
			return {cq: a, ct: b, cv: c, cz: d};
		}),
	A3(
		$author$project$Internal$Tools$DecodeExtra$opFieldWithDefault,
		'invite',
		$elm$core$Dict$empty,
		$elm$json$Json$Decode$dict($author$project$Internal$Api$Sync$V2$SpecObjects$invitedRoomDecoder)),
	A3(
		$author$project$Internal$Tools$DecodeExtra$opFieldWithDefault,
		'join',
		$elm$core$Dict$empty,
		$elm$json$Json$Decode$dict($author$project$Internal$Api$Sync$V2$SpecObjects$joinedRoomDecoder)),
	A3(
		$author$project$Internal$Tools$DecodeExtra$opFieldWithDefault,
		'knock',
		$elm$core$Dict$empty,
		$elm$json$Json$Decode$dict($author$project$Internal$Api$Sync$V2$SpecObjects$knockedRoomDecoder)),
	A3(
		$author$project$Internal$Tools$DecodeExtra$opFieldWithDefault,
		'leave',
		$elm$core$Dict$empty,
		$elm$json$Json$Decode$dict($author$project$Internal$Api$Sync$V2$SpecObjects$leftRoomDecoder)));
var $author$project$Internal$Api$Sync$V2$SpecObjects$syncDecoder = A5(
	$elm$json$Json$Decode$map4,
	F4(
		function (a, b, c, d) {
			return {Z: a, cK: b, cO: c, cT: d};
		}),
	A2($author$project$Internal$Tools$DecodeExtra$opField, 'account_data', $author$project$Internal$Api$Sync$V2$SpecObjects$accountDataDecoder),
	A2($elm$json$Json$Decode$field, 'next_batch', $elm$json$Json$Decode$string),
	A2($author$project$Internal$Tools$DecodeExtra$opField, 'presence', $author$project$Internal$Api$Sync$V2$SpecObjects$presenceDecoder),
	A2($author$project$Internal$Tools$DecodeExtra$opField, 'rooms', $author$project$Internal$Api$Sync$V2$SpecObjects$roomsDecoder));
var $author$project$Internal$Api$Sync$Api$syncV2 = function (data) {
	return A2(
		$elm$core$Basics$composeR,
		A2($author$project$Internal$Api$Request$callApi, 'GET', '/_matrix/client/v3/sync'),
		A2(
			$elm$core$Basics$composeR,
			$author$project$Internal$Api$Request$withAttributes(
				_List_fromArray(
					[
						$author$project$Internal$Api$Request$accessToken,
						A2($author$project$Internal$Api$Request$queryOpString, 'filter', data.ap),
						A2($author$project$Internal$Api$Request$queryOpBool, 'full_state', data.cj),
						A2(
						$author$project$Internal$Api$Request$queryOpString,
						'set_presence',
						A2($elm$core$Maybe$map, $author$project$Internal$Tools$SpecEnums$fromUserPresence, data.cW)),
						A2($author$project$Internal$Api$Request$queryOpString, 'since', data.cY),
						A2($author$project$Internal$Api$Request$queryOpInt, 'timeout', data.hf),
						$author$project$Internal$Api$Request$timeout(
						A2(
							$elm$core$Maybe$map,
							A2(
								$elm$core$Basics$composeR,
								$elm$core$Basics$mul(1000),
								$elm$core$Basics$toFloat),
							data.hf))
					])),
			$author$project$Internal$Api$Request$toTask($author$project$Internal$Api$Sync$V2$SpecObjects$syncDecoder)));
};
var $author$project$Internal$Api$Sync$V2$Upcast$upcastClientEventWithoutRoomId = function (old) {
	return {
		bf: old.bf,
		du: old.du,
		fB: old.fB,
		cN: old.cN,
		cU: old.cU,
		gT: old.gT,
		c4: A2($elm$core$Maybe$map, $author$project$Internal$Api$Sync$V2$Upcast$upcastUnsigned, old.c4)
	};
};
var $author$project$Internal$Api$Sync$V2$Upcast$upcastUnsigned = function (_v0) {
	var old = _v0;
	return {
		df: old.df,
		d4: old.d4,
		ea: A2($elm$core$Maybe$map, $author$project$Internal$Api$Sync$V2$Upcast$upcastClientEventWithoutRoomId, old.ea),
		ez: old.ez
	};
};
var $author$project$Internal$Api$Sync$V2$Upcast$upcastState = function (old) {
	return {
		e: A2($elm$core$List$map, $author$project$Internal$Api$Sync$V2$Upcast$upcastClientEventWithoutRoomId, old.e)
	};
};
var $author$project$Internal$Api$Sync$V2$Upcast$upcastTimeline = function (old) {
	return {
		e: A2($elm$core$List$map, $author$project$Internal$Api$Sync$V2$Upcast$upcastClientEventWithoutRoomId, old.e),
		cA: old.cA,
		cP: old.cP
	};
};
var $author$project$Internal$Api$Sync$V2$Upcast$upcastJoinedRoom = function (old) {
	return {
		Z: old.Z,
		cg: old.cg,
		es: A2($elm$core$Maybe$map, $author$project$Internal$Api$Sync$V2$Upcast$upcastState, old.es),
		c0: old.c0,
		ba: A2($elm$core$Maybe$map, $author$project$Internal$Api$Sync$V2$Upcast$upcastTimeline, old.ba),
		c2: old.c2,
		c3: $elm$core$Dict$empty
	};
};
var $author$project$Internal$Api$Sync$V2$Upcast$upcastLeftRoom = function (old) {
	return {
		Z: old.Z,
		es: A2($elm$core$Maybe$map, $author$project$Internal$Api$Sync$V2$Upcast$upcastState, old.es),
		ba: A2($elm$core$Maybe$map, $author$project$Internal$Api$Sync$V2$Upcast$upcastTimeline, old.ba)
	};
};
var $author$project$Internal$Api$Sync$V2$Upcast$upcastRooms = function (old) {
	return {
		cq: old.cq,
		ct: A2(
			$elm$core$Dict$map,
			function (_v0) {
				return $author$project$Internal$Api$Sync$V2$Upcast$upcastJoinedRoom;
			},
			old.ct),
		cv: old.cv,
		cz: A2(
			$elm$core$Dict$map,
			function (_v1) {
				return $author$project$Internal$Api$Sync$V2$Upcast$upcastLeftRoom;
			},
			old.cz)
	};
};
var $author$project$Internal$Api$Sync$V2$Upcast$upcastSync = function (old) {
	return {
		Z: old.Z,
		cK: old.cK,
		cO: old.cO,
		cT: A2($elm$core$Maybe$map, $author$project$Internal$Api$Sync$V2$Upcast$upcastRooms, old.cT)
	};
};
var $author$project$Internal$Api$Sync$Main$sync = F2(
	function (context, input) {
		return A3(
			$elm$core$Basics$apR,
			A2(
				$elm$core$Maybe$withDefault,
				$elm$core$Basics$always(
					$elm$core$Basics$always(
						$elm$core$Task$fail($author$project$Internal$Tools$Exceptions$UnsupportedSpecVersion))),
				A2(
					$author$project$Internal$Tools$VersionControl$mostRecentFromVersionList,
					$author$project$Internal$Tools$Context$getVersions(context),
					A2(
						$author$project$Internal$Tools$VersionControl$sameForVersion,
						'v1.6',
						A2(
							$author$project$Internal$Tools$VersionControl$sameForVersion,
							'v1.5',
							A2(
								$author$project$Internal$Tools$VersionControl$addMiddleLayer,
								{
									dq: $author$project$Internal$Api$Sync$Api$syncV2,
									fy: $elm$core$Basics$identity,
									hl: F2(
										function (f, c) {
											return A2(
												$elm$core$Task$map,
												$author$project$Internal$Api$Sync$V2$Upcast$upcastSync,
												f(c));
										}),
									eC: 'v1.4'
								},
								A2(
									$author$project$Internal$Tools$VersionControl$sameForVersion,
									'v1.3',
									$author$project$Internal$Tools$VersionControl$withBottomLayer(
										{dq: $author$project$Internal$Api$Sync$Api$syncV1, eC: 'v1.2'}))))))),
			$elm$core$Basics$apR(input),
			context);
	});
var $author$project$Internal$Api$VaultUpdate$sync = function (input) {
	return A3(
		$author$project$Internal$Api$VaultUpdate$toChain,
		function (output) {
			return {
				bh: $elm$core$Basics$identity,
				bo: _List_fromArray(
					[
						A2($author$project$Internal$Api$VaultUpdate$SyncUpdate, input, output)
					])
			};
		},
		$author$project$Internal$Api$Sync$Main$sync,
		input);
};
var $author$project$Internal$Api$VaultUpdate$MultipleUpdates = function (a) {
	return {$: 0, a: a};
};
var $author$project$Internal$Config$Leaking$accessToken = 'mistaken_access_token';
var $author$project$Internal$Config$Leaking$baseUrl = 'https://matrix.example.org';
var $author$project$Internal$Config$Leaking$eventId = '$unknown-event-id';
var $author$project$Internal$Config$Leaking$sender = '@alice:example.org';
var $Evelios$elm_hash$Hash$expTolerance = 6;
var $Evelios$elm_hash$Hash$Hash = $elm$core$Basics$identity;
var $chain_partners$elm_bignum$Integer$Integer = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var $chain_partners$elm_bignum$Integer$Negative = 1;
var $chain_partners$elm_bignum$Integer$Positive = 0;
var $chain_partners$elm_bignum$Integer$Zero = {$: 1};
var $elm$core$Basics$negate = function (n) {
	return -n;
};
var $elm$core$Basics$abs = function (n) {
	return (n < 0) ? (-n) : n;
};
var $elm$core$Basics$pow = _Basics_pow;
var $chain_partners$elm_bignum$Integer$defaultBase = A2($elm$core$Basics$pow, 10, 7);
var $chain_partners$elm_bignum$Integer$magnitudeFromInt_ = F2(
	function (acc, i) {
		magnitudeFromInt_:
		while (true) {
			var q = (i / $chain_partners$elm_bignum$Integer$defaultBase) | 0;
			if (!q) {
				return $elm$core$List$reverse(
					A2($elm$core$List$cons, i, acc));
			} else {
				var $temp$acc = A2($elm$core$List$cons, i % $chain_partners$elm_bignum$Integer$defaultBase, acc),
					$temp$i = q;
				acc = $temp$acc;
				i = $temp$i;
				continue magnitudeFromInt_;
			}
		}
	});
var $chain_partners$elm_bignum$Integer$magnitudeFromInt = $chain_partners$elm_bignum$Integer$magnitudeFromInt_(_List_Nil);
var $chain_partners$elm_bignum$Integer$fromInt = function (i) {
	var _v0 = A2($elm$core$Basics$compare, i, 0);
	switch (_v0) {
		case 2:
			return A2(
				$chain_partners$elm_bignum$Integer$Integer,
				0,
				$chain_partners$elm_bignum$Integer$magnitudeFromInt(i));
		case 1:
			return $chain_partners$elm_bignum$Integer$Zero;
		default:
			return A2(
				$chain_partners$elm_bignum$Integer$Integer,
				1,
				$chain_partners$elm_bignum$Integer$magnitudeFromInt(
					$elm$core$Basics$abs(i)));
	}
};
var $Evelios$elm_hash$Hash$fromInt = A2($elm$core$Basics$composeR, $chain_partners$elm_bignum$Integer$fromInt, $elm$core$Basics$identity);
var $bonzaico$murmur3$Murmur3$HashData = F4(
	function (shift, seed, hash, charsProcessed) {
		return {aY: charsProcessed, bk: hash, aP: seed, a8: shift};
	});
var $bonzaico$murmur3$Murmur3$c1 = 3432918353;
var $bonzaico$murmur3$Murmur3$c2 = 461845907;
var $elm$core$Bitwise$and = _Bitwise_and;
var $elm$core$Bitwise$shiftLeftBy = _Bitwise_shiftLeftBy;
var $elm$core$Bitwise$shiftRightZfBy = _Bitwise_shiftRightZfBy;
var $bonzaico$murmur3$Murmur3$multiplyBy = F2(
	function (b, a) {
		return ((a & 65535) * b) + ((((a >>> 16) * b) & 65535) << 16);
	});
var $elm$core$Basics$neq = _Utils_notEqual;
var $elm$core$Bitwise$or = _Bitwise_or;
var $bonzaico$murmur3$Murmur3$rotlBy = F2(
	function (b, a) {
		return (a << b) | (a >>> (32 - b));
	});
var $elm$core$Bitwise$xor = _Bitwise_xor;
var $bonzaico$murmur3$Murmur3$finalize = function (data) {
	var acc = (!(!data.bk)) ? (data.aP ^ A2(
		$bonzaico$murmur3$Murmur3$multiplyBy,
		$bonzaico$murmur3$Murmur3$c2,
		A2(
			$bonzaico$murmur3$Murmur3$rotlBy,
			15,
			A2($bonzaico$murmur3$Murmur3$multiplyBy, $bonzaico$murmur3$Murmur3$c1, data.bk)))) : data.aP;
	var h0 = acc ^ data.aY;
	var h1 = A2($bonzaico$murmur3$Murmur3$multiplyBy, 2246822507, h0 ^ (h0 >>> 16));
	var h2 = A2($bonzaico$murmur3$Murmur3$multiplyBy, 3266489909, h1 ^ (h1 >>> 13));
	return (h2 ^ (h2 >>> 16)) >>> 0;
};
var $elm$core$String$foldl = _String_foldl;
var $bonzaico$murmur3$Murmur3$mix = F2(
	function (h1, k1) {
		return A2(
			$bonzaico$murmur3$Murmur3$multiplyBy,
			5,
			A2(
				$bonzaico$murmur3$Murmur3$rotlBy,
				13,
				h1 ^ A2(
					$bonzaico$murmur3$Murmur3$multiplyBy,
					$bonzaico$murmur3$Murmur3$c2,
					A2(
						$bonzaico$murmur3$Murmur3$rotlBy,
						15,
						A2($bonzaico$murmur3$Murmur3$multiplyBy, $bonzaico$murmur3$Murmur3$c1, k1))))) + 3864292196;
	});
var $bonzaico$murmur3$Murmur3$hashFold = F2(
	function (c, data) {
		var res = data.bk | ((255 & $elm$core$Char$toCode(c)) << data.a8);
		var _v0 = data.a8;
		if (_v0 === 24) {
			return {
				aY: data.aY + 1,
				bk: 0,
				aP: A2($bonzaico$murmur3$Murmur3$mix, data.aP, res),
				a8: 0
			};
		} else {
			return {aY: data.aY + 1, bk: res, aP: data.aP, a8: data.a8 + 8};
		}
	});
var $bonzaico$murmur3$Murmur3$hashString = F2(
	function (seed, str) {
		return $bonzaico$murmur3$Murmur3$finalize(
			A3(
				$elm$core$String$foldl,
				$bonzaico$murmur3$Murmur3$hashFold,
				A4($bonzaico$murmur3$Murmur3$HashData, 0, seed, 0, 0),
				str));
	});
var $Evelios$elm_hash$Hash$fromString = A2(
	$elm$core$Basics$composeR,
	$bonzaico$murmur3$Murmur3$hashString($Evelios$elm_hash$Hash$expTolerance),
	$Evelios$elm_hash$Hash$fromInt);
var $elm$core$String$cons = _String_cons;
var $elm$core$String$fromChar = function (_char) {
	return A2($elm$core$String$cons, _char, '');
};
var $elm$core$Bitwise$shiftRightBy = _Bitwise_shiftRightBy;
var $elm$core$String$repeatHelp = F3(
	function (n, chunk, result) {
		return (n <= 0) ? result : A3(
			$elm$core$String$repeatHelp,
			n >> 1,
			_Utils_ap(chunk, chunk),
			(!(n & 1)) ? result : _Utils_ap(result, chunk));
	});
var $elm$core$String$repeat = F2(
	function (n, chunk) {
		return A3($elm$core$String$repeatHelp, n, chunk, '');
	});
var $elm$core$String$padLeft = F3(
	function (n, _char, string) {
		return _Utils_ap(
			A2(
				$elm$core$String$repeat,
				n - $elm$core$String$length(string),
				$elm$core$String$fromChar(_char)),
			string);
	});
var $elm$regex$Regex$Match = F4(
	function (match, index, number, submatches) {
		return {fT: index, f7: match, gd: number, gZ: submatches};
	});
var $elm$regex$Regex$fromStringWith = _Regex_fromStringWith;
var $elm$regex$Regex$fromString = function (string) {
	return A2(
		$elm$regex$Regex$fromStringWith,
		{fd: false, gb: false},
		string);
};
var $elm$regex$Regex$never = _Regex_never;
var $elm$regex$Regex$replace = _Regex_replaceAtMost(_Regex_infinity);
var $chain_partners$elm_bignum$Integer$trimLeadingZeroFromStr = A2(
	$elm$regex$Regex$replace,
	A2(
		$elm$core$Maybe$withDefault,
		$elm$regex$Regex$never,
		$elm$regex$Regex$fromString('^0*')),
	function (_v0) {
		return '';
	});
var $chain_partners$elm_bignum$Integer$toString = function (i) {
	if (i.$ === 1) {
		return '0';
	} else {
		var s = i.a;
		var m = i.b;
		var sign = (s === 1) ? '-' : '';
		var num = $chain_partners$elm_bignum$Integer$trimLeadingZeroFromStr(
			A3(
				$elm$core$List$foldl,
				$elm$core$Basics$append,
				'',
				A2(
					$elm$core$List$map,
					A2(
						$elm$core$Basics$composeR,
						$elm$core$String$fromInt,
						A2($elm$core$String$padLeft, 7, '0')),
					m)));
		return _Utils_ap(sign, num);
	}
};
var $Evelios$elm_hash$Hash$toString = function (_v0) {
	var integer = _v0;
	return $chain_partners$elm_bignum$Integer$toString(integer);
};
var $author$project$Internal$Config$Leaking$transactionId = 'elm' + $Evelios$elm_hash$Hash$toString(
	$Evelios$elm_hash$Hash$fromString('leaked_transactionId'));
var $author$project$Internal$Config$Leaking$versions = _List_Nil;
var $author$project$Internal$Tools$Context$init = {b0: $author$project$Internal$Config$Leaking$accessToken, aV: $author$project$Internal$Config$Leaking$baseUrl, bU: $elm$core$Maybe$Nothing, cV: $author$project$Internal$Config$Leaking$eventId, c1: $author$project$Internal$Config$Leaking$originServerTs, ez: $author$project$Internal$Config$Leaking$transactionId, c6: $author$project$Internal$Config$Leaking$sender, eD: $author$project$Internal$Config$Leaking$versions};
var $author$project$Internal$Api$Chain$toTask = function (f1) {
	return A2(
		$elm$core$Task$map,
		function (_v0) {
			var data = _v0;
			return data.bo;
		},
		f1($author$project$Internal$Tools$Context$init));
};
var $author$project$Internal$Api$VaultUpdate$toTask = A2(
	$elm$core$Basics$composeR,
	$author$project$Internal$Api$Chain$toTask,
	$elm$core$Task$map(
		function (updates) {
			if (updates.b && (!updates.b.b)) {
				var item = updates.a;
				return item;
			} else {
				return $author$project$Internal$Api$VaultUpdate$MultipleUpdates(updates);
			}
		}));
var $author$project$Internal$Api$Task$loginMaybeSync = F2(
	function (data, cred) {
		return $author$project$Internal$Api$VaultUpdate$toTask(
			A2(
				$author$project$Internal$Api$Chain$andThen,
				$author$project$Internal$Api$Chain$maybe(
					$author$project$Internal$Api$VaultUpdate$sync(data)),
				A2(
					$author$project$Internal$Api$Chain$andThen,
					$author$project$Internal$Api$VaultUpdate$accessToken(
						$author$project$Internal$Api$Credentials$refreshedAccessToken(cred)),
					$author$project$Internal$Api$VaultUpdate$makeVB(cred))));
	});
var $author$project$Internal$Api$Credentials$accessToken = function (_v0) {
	var access = _v0.J;
	return access;
};
var $author$project$Internal$Api$VaultUpdate$makeVBA = function (cred) {
	return A2(
		$author$project$Internal$Api$Chain$andThen,
		$author$project$Internal$Api$VaultUpdate$accessToken(
			$author$project$Internal$Api$Credentials$accessToken(cred)),
		$author$project$Internal$Api$VaultUpdate$makeVB(cred));
};
var $author$project$Internal$Api$Task$sync = F2(
	function (data, cred) {
		return $author$project$Internal$Api$VaultUpdate$toTask(
			A2(
				$author$project$Internal$Api$Chain$andThen,
				$author$project$Internal$Api$VaultUpdate$sync(data),
				$author$project$Internal$Api$VaultUpdate$makeVBA(cred)));
	});
var $author$project$Internal$Vault$sync = function (_v0) {
	var cred = _v0.n;
	var context = _v0.bP;
	var syncInput = {
		ap: $elm$core$Maybe$Nothing,
		cj: $elm$core$Maybe$Nothing,
		cW: $elm$core$Maybe$Nothing,
		cY: $author$project$Internal$Values$Vault$getSince(cred),
		hf: $elm$core$Maybe$Just(30)
	};
	return A2(
		$elm$core$Task$onError,
		function (err) {
			switch (err.$) {
				case 3:
					return $elm$core$Task$fail(err);
				case 1:
					return $elm$core$Task$fail(err);
				case 0:
					return $elm$core$Task$fail(err);
				default:
					switch (err.a.$) {
						case 1:
							return A2($author$project$Internal$Api$Task$loginMaybeSync, syncInput, context);
						case 2:
							return A2($author$project$Internal$Api$Task$loginMaybeSync, syncInput, context);
						default:
							return $elm$core$Task$fail(err);
					}
			}
		},
		A2($author$project$Internal$Api$Task$sync, syncInput, context));
};
var $author$project$Matrix$sync = $author$project$Internal$Vault$sync;
var $author$project$Model$CreateGame = $elm$core$Basics$identity;
var $author$project$Model$PlayGame = F2(
	function (a, b) {
		return {$: 1, a: a, b: b};
	});
var $author$project$Chess$acceptChessEventType = 'me.noordstar.game.chess.accept';
var $author$project$Chess$accountDataEventType = 'me.noordstar.game.chess';
var $pilatch$elm_chess$Game$Game = $elm$core$Basics$identity;
var $pilatch$elm_chess$Internal$Position$Position = $elm$core$Basics$identity;
var $pilatch$elm_chess$Internal$Square$Square = $elm$core$Basics$identity;
var $pilatch$elm_chess$Internal$Square$unwrap = function (square) {
	var square_ = square;
	return square_;
};
var $pilatch$elm_chess$Internal$SquareDelta$unwrap = function (delta) {
	var delta_ = delta;
	return delta_;
};
var $pilatch$elm_chess$Internal$Square$add = F2(
	function (square, delta_) {
		return $pilatch$elm_chess$Internal$Square$unwrap(square) + $pilatch$elm_chess$Internal$SquareDelta$unwrap(delta_);
	});
var $pilatch$elm_chess$Internal$PieceColor$PieceColor = $elm$core$Basics$identity;
var $pilatch$elm_chess$Internal$PieceColor$black = 1;
var $pilatch$elm_chess$Internal$PieceType$PieceType = $elm$core$Basics$identity;
var $pilatch$elm_chess$Internal$PieceType$king = 6;
var $pilatch$elm_chess$Internal$Piece$Piece = $elm$core$Basics$identity;
var $pilatch$elm_chess$Internal$PieceColor$unwrap = function (color) {
	var color_ = color;
	return color_;
};
var $pilatch$elm_chess$Internal$PieceType$unwrap = function (kind) {
	var kind_ = kind;
	return kind_;
};
var $pilatch$elm_chess$Internal$Piece$make = F2(
	function (color_, kind_) {
		return ($pilatch$elm_chess$Internal$PieceColor$unwrap(color_) << 3) | $pilatch$elm_chess$Internal$PieceType$unwrap(kind_);
	});
var $pilatch$elm_chess$Internal$Piece$blackKing = A2($pilatch$elm_chess$Internal$Piece$make, $pilatch$elm_chess$Internal$PieceColor$black, $pilatch$elm_chess$Internal$PieceType$king);
var $pilatch$elm_chess$Internal$PieceType$pawn = 1;
var $pilatch$elm_chess$Internal$Piece$blackPawn = A2($pilatch$elm_chess$Internal$Piece$make, $pilatch$elm_chess$Internal$PieceColor$black, $pilatch$elm_chess$Internal$PieceType$pawn);
var $pilatch$elm_chess$Internal$Piece$unwrap = function (piece) {
	var piece_ = piece;
	return piece_;
};
var $pilatch$elm_chess$Internal$Piece$color = function (piece) {
	return $pilatch$elm_chess$Internal$Piece$unwrap(piece) >> 3;
};
var $pilatch$elm_chess$Internal$SquareDelta$SquareDelta = $elm$core$Basics$identity;
var $pilatch$elm_chess$Internal$SquareDelta$e = 1;
var $pilatch$elm_chess$Internal$SquareFile$SquareFile = $elm$core$Basics$identity;
var $pilatch$elm_chess$Internal$BoardDimensions$fileCount = 8;
var $pilatch$elm_chess$Internal$BoardDimensions$extendedFileCount = (2 * $pilatch$elm_chess$Internal$BoardDimensions$fileCount) - 1;
var $elm$core$Basics$modBy = _Basics_modBy;
var $pilatch$elm_chess$Internal$Square$file = function (square) {
	return A2(
		$elm$core$Basics$modBy,
		$pilatch$elm_chess$Internal$BoardDimensions$extendedFileCount,
		$pilatch$elm_chess$Internal$Square$unwrap(square));
};
var $pilatch$elm_chess$Internal$BoardDimensions$fileMin = 1;
var $pilatch$elm_chess$Internal$BoardDimensions$rankMin = 2;
var $pilatch$elm_chess$Internal$Square$expand = function (i) {
	var r = (i / $pilatch$elm_chess$Internal$BoardDimensions$fileCount) | 0;
	var f = A2($elm$core$Basics$modBy, $pilatch$elm_chess$Internal$BoardDimensions$fileCount, i);
	return (f + $pilatch$elm_chess$Internal$BoardDimensions$fileMin) + ((r + $pilatch$elm_chess$Internal$BoardDimensions$rankMin) * $pilatch$elm_chess$Internal$BoardDimensions$extendedFileCount);
};
var $pilatch$elm_chess$Internal$Move$unwrap = function (move) {
	var move_ = move;
	return move_;
};
var $pilatch$elm_chess$Internal$Move$from = function (move) {
	return $pilatch$elm_chess$Internal$Square$expand(
		($pilatch$elm_chess$Internal$Move$unwrap(move) >> 6) & 63);
};
var $pilatch$elm_chess$Internal$Move$isEp = function (move) {
	return !(!((1 << 16) & $pilatch$elm_chess$Internal$Move$unwrap(move)));
};
var $pilatch$elm_chess$Internal$Move$isCastle = function (move) {
	return !(!((1 << 15) & $pilatch$elm_chess$Internal$Move$unwrap(move)));
};
var $pilatch$elm_chess$Internal$Move$to = function (move) {
	return $pilatch$elm_chess$Internal$Square$expand(
		$pilatch$elm_chess$Internal$Move$unwrap(move) & 63);
};
var $pilatch$elm_chess$Internal$Move$isKingsideCastle = function (move) {
	return $pilatch$elm_chess$Internal$Move$isCastle(move) && (_Utils_cmp(
		$pilatch$elm_chess$Internal$Square$unwrap(
			$pilatch$elm_chess$Internal$Move$from(move)),
		$pilatch$elm_chess$Internal$Square$unwrap(
			$pilatch$elm_chess$Internal$Move$to(move))) < 0);
};
var $pilatch$elm_chess$Internal$Move$isQueensideCastle = function (move) {
	return $pilatch$elm_chess$Internal$Move$isCastle(move) && (_Utils_cmp(
		$pilatch$elm_chess$Internal$Square$unwrap(
			$pilatch$elm_chess$Internal$Move$from(move)),
		$pilatch$elm_chess$Internal$Square$unwrap(
			$pilatch$elm_chess$Internal$Move$to(move))) > 0);
};
var $pilatch$elm_chess$Internal$SquareFile$unwrap = function (file) {
	var file_ = file;
	return file_;
};
var $pilatch$elm_chess$Internal$SquareRank$unwrap = function (rank) {
	var rank_ = rank;
	return rank_;
};
var $pilatch$elm_chess$Internal$Square$make = F2(
	function (file_, rank_) {
		return $pilatch$elm_chess$Internal$SquareFile$unwrap(file_) + ($pilatch$elm_chess$Internal$SquareRank$unwrap(rank_) * $pilatch$elm_chess$Internal$BoardDimensions$extendedFileCount);
	});
var $elm$core$Array$bitMask = 4294967295 >>> (32 - $elm$core$Array$shiftStep);
var $elm$core$Basics$ge = _Utils_ge;
var $elm$core$Elm$JsArray$unsafeGet = _JsArray_unsafeGet;
var $elm$core$Array$getHelp = F3(
	function (shift, index, tree) {
		getHelp:
		while (true) {
			var pos = $elm$core$Array$bitMask & (index >>> shift);
			var _v0 = A2($elm$core$Elm$JsArray$unsafeGet, pos, tree);
			if (!_v0.$) {
				var subTree = _v0.a;
				var $temp$shift = shift - $elm$core$Array$shiftStep,
					$temp$index = index,
					$temp$tree = subTree;
				shift = $temp$shift;
				index = $temp$index;
				tree = $temp$tree;
				continue getHelp;
			} else {
				var values = _v0.a;
				return A2($elm$core$Elm$JsArray$unsafeGet, $elm$core$Array$bitMask & index, values);
			}
		}
	});
var $elm$core$Array$tailIndex = function (len) {
	return (len >>> 5) << 5;
};
var $elm$core$Array$get = F2(
	function (index, _v0) {
		var len = _v0.a;
		var startShift = _v0.b;
		var tree = _v0.c;
		var tail = _v0.d;
		return ((index < 0) || (_Utils_cmp(index, len) > -1)) ? $elm$core$Maybe$Nothing : ((_Utils_cmp(
			index,
			$elm$core$Array$tailIndex(len)) > -1) ? $elm$core$Maybe$Just(
			A2($elm$core$Elm$JsArray$unsafeGet, $elm$core$Array$bitMask & index, tail)) : $elm$core$Maybe$Just(
			A3($elm$core$Array$getHelp, startShift, index, tree)));
	});
var $pilatch$elm_chess$Internal$PieceType$none = 0;
var $pilatch$elm_chess$Internal$PieceColor$outside = 3;
var $pilatch$elm_chess$Internal$Piece$outside = A2($pilatch$elm_chess$Internal$Piece$make, $pilatch$elm_chess$Internal$PieceColor$outside, $pilatch$elm_chess$Internal$PieceType$none);
var $pilatch$elm_chess$Internal$Board$pieceOn = F2(
	function (square, board) {
		return A2(
			$elm$core$Maybe$withDefault,
			$pilatch$elm_chess$Internal$Piece$outside,
			A2(
				$elm$core$Array$get,
				$pilatch$elm_chess$Internal$Square$unwrap(square),
				board));
	});
var $elm$core$Elm$JsArray$unsafeSet = _JsArray_unsafeSet;
var $elm$core$Array$setHelp = F4(
	function (shift, index, value, tree) {
		var pos = $elm$core$Array$bitMask & (index >>> shift);
		var _v0 = A2($elm$core$Elm$JsArray$unsafeGet, pos, tree);
		if (!_v0.$) {
			var subTree = _v0.a;
			var newSub = A4($elm$core$Array$setHelp, shift - $elm$core$Array$shiftStep, index, value, subTree);
			return A3(
				$elm$core$Elm$JsArray$unsafeSet,
				pos,
				$elm$core$Array$SubTree(newSub),
				tree);
		} else {
			var values = _v0.a;
			var newLeaf = A3($elm$core$Elm$JsArray$unsafeSet, $elm$core$Array$bitMask & index, value, values);
			return A3(
				$elm$core$Elm$JsArray$unsafeSet,
				pos,
				$elm$core$Array$Leaf(newLeaf),
				tree);
		}
	});
var $elm$core$Array$set = F3(
	function (index, value, array) {
		var len = array.a;
		var startShift = array.b;
		var tree = array.c;
		var tail = array.d;
		return ((index < 0) || (_Utils_cmp(index, len) > -1)) ? array : ((_Utils_cmp(
			index,
			$elm$core$Array$tailIndex(len)) > -1) ? A4(
			$elm$core$Array$Array_elm_builtin,
			len,
			startShift,
			tree,
			A3($elm$core$Elm$JsArray$unsafeSet, $elm$core$Array$bitMask & index, value, tail)) : A4(
			$elm$core$Array$Array_elm_builtin,
			len,
			startShift,
			A4($elm$core$Array$setHelp, startShift, index, value, tree),
			tail));
	});
var $pilatch$elm_chess$Internal$Board$putPiece = F2(
	function (piece, square) {
		return A2(
			$elm$core$Array$set,
			$pilatch$elm_chess$Internal$Square$unwrap(square),
			piece);
	});
var $pilatch$elm_chess$Internal$PieceColor$empty = 2;
var $pilatch$elm_chess$Internal$Piece$empty = A2($pilatch$elm_chess$Internal$Piece$make, $pilatch$elm_chess$Internal$PieceColor$empty, $pilatch$elm_chess$Internal$PieceType$none);
var $pilatch$elm_chess$Internal$Board$removePiece = function (square) {
	return A2(
		$elm$core$Array$set,
		$pilatch$elm_chess$Internal$Square$unwrap(square),
		$pilatch$elm_chess$Internal$Piece$empty);
};
var $pilatch$elm_chess$Internal$Board$movePiece = F3(
	function (from, to, board) {
		var piece = A2($pilatch$elm_chess$Internal$Board$pieceOn, from, board);
		return A3(
			$pilatch$elm_chess$Internal$Board$putPiece,
			piece,
			to,
			A2($pilatch$elm_chess$Internal$Board$removePiece, from, board));
	});
var $pilatch$elm_chess$Internal$SquareDelta$multiply = F2(
	function (i, delta) {
		return i * $pilatch$elm_chess$Internal$SquareDelta$unwrap(delta);
	});
var $pilatch$elm_chess$Internal$Move$promotion = function (move) {
	var p = ($pilatch$elm_chess$Internal$Move$unwrap(move) >> 12) & 7;
	return _Utils_eq(p, $pilatch$elm_chess$Internal$PieceType$none) ? $elm$core$Maybe$Nothing : $elm$core$Maybe$Just(p);
};
var $pilatch$elm_chess$Internal$SquareRank$SquareRank = $elm$core$Basics$identity;
var $pilatch$elm_chess$Internal$Square$rank = function (square) {
	return ($pilatch$elm_chess$Internal$Square$unwrap(square) / $pilatch$elm_chess$Internal$BoardDimensions$extendedFileCount) | 0;
};
var $pilatch$elm_chess$Internal$SquareDelta$negate = function (delta) {
	return A2($pilatch$elm_chess$Internal$SquareDelta$multiply, -1, delta);
};
var $pilatch$elm_chess$Internal$SquareDelta$w = $pilatch$elm_chess$Internal$SquareDelta$negate($pilatch$elm_chess$Internal$SquareDelta$e);
var $pilatch$elm_chess$Internal$Board$doMove = F2(
	function (move, board) {
		var us = $pilatch$elm_chess$Internal$Piece$color(
			A2(
				$pilatch$elm_chess$Internal$Board$pieceOn,
				$pilatch$elm_chess$Internal$Move$from(move),
				board));
		var to = $pilatch$elm_chess$Internal$Move$to(move);
		var from = $pilatch$elm_chess$Internal$Move$from(move);
		var _v0 = $pilatch$elm_chess$Internal$Move$promotion(move);
		if (_v0.$ === 1) {
			if ($pilatch$elm_chess$Internal$Move$isKingsideCastle(move)) {
				return A3(
					$pilatch$elm_chess$Internal$Board$movePiece,
					A2($pilatch$elm_chess$Internal$Square$add, to, $pilatch$elm_chess$Internal$SquareDelta$e),
					A2($pilatch$elm_chess$Internal$Square$add, from, $pilatch$elm_chess$Internal$SquareDelta$e),
					A3($pilatch$elm_chess$Internal$Board$movePiece, from, to, board));
			} else {
				if ($pilatch$elm_chess$Internal$Move$isQueensideCastle(move)) {
					return A3(
						$pilatch$elm_chess$Internal$Board$movePiece,
						A2(
							$pilatch$elm_chess$Internal$Square$add,
							to,
							A2($pilatch$elm_chess$Internal$SquareDelta$multiply, 2, $pilatch$elm_chess$Internal$SquareDelta$w)),
						A2($pilatch$elm_chess$Internal$Square$add, from, $pilatch$elm_chess$Internal$SquareDelta$w),
						A3($pilatch$elm_chess$Internal$Board$movePiece, from, to, board));
				} else {
					if ($pilatch$elm_chess$Internal$Move$isEp(move)) {
						var toFile = $pilatch$elm_chess$Internal$Square$file(to);
						var fromRank = $pilatch$elm_chess$Internal$Square$rank(from);
						return A2(
							$pilatch$elm_chess$Internal$Board$removePiece,
							A2($pilatch$elm_chess$Internal$Square$make, toFile, fromRank),
							A3($pilatch$elm_chess$Internal$Board$movePiece, from, to, board));
					} else {
						return A3($pilatch$elm_chess$Internal$Board$movePiece, from, to, board);
					}
				}
			}
		} else {
			var kind = _v0.a;
			return A3(
				$pilatch$elm_chess$Internal$Board$putPiece,
				A2($pilatch$elm_chess$Internal$Piece$make, us, kind),
				to,
				A2($pilatch$elm_chess$Internal$Board$removePiece, from, board));
		}
	});
var $pilatch$elm_chess$Internal$SquareFile$a = $pilatch$elm_chess$Internal$BoardDimensions$fileMin;
var $pilatch$elm_chess$Internal$SquareRank$one = $pilatch$elm_chess$Internal$BoardDimensions$rankMin;
var $pilatch$elm_chess$Internal$Square$a1 = A2($pilatch$elm_chess$Internal$Square$make, $pilatch$elm_chess$Internal$SquareFile$a, $pilatch$elm_chess$Internal$SquareRank$one);
var $pilatch$elm_chess$Internal$SquareRank$eight = $pilatch$elm_chess$Internal$BoardDimensions$rankMin + 7;
var $pilatch$elm_chess$Internal$Square$a8 = A2($pilatch$elm_chess$Internal$Square$make, $pilatch$elm_chess$Internal$SquareFile$a, $pilatch$elm_chess$Internal$SquareRank$eight);
var $pilatch$elm_chess$Internal$CastleRights$CastleRights = $elm$core$Basics$identity;
var $elm$core$Bitwise$complement = _Bitwise_complement;
var $pilatch$elm_chess$Internal$CastleRights$unwrap = function (rights) {
	var rights_ = rights;
	return rights_;
};
var $pilatch$elm_chess$Internal$CastleRights$disableKingsideCastling = F2(
	function (color, rights) {
		return $pilatch$elm_chess$Internal$CastleRights$unwrap(rights) & (~(1 << (2 * $pilatch$elm_chess$Internal$PieceColor$unwrap(color))));
	});
var $pilatch$elm_chess$Internal$CastleRights$disableQueensideCastling = F2(
	function (color, rights) {
		return $pilatch$elm_chess$Internal$CastleRights$unwrap(rights) & (~(1 << ((2 * $pilatch$elm_chess$Internal$PieceColor$unwrap(color)) + 1)));
	});
var $pilatch$elm_chess$Internal$CastleRights$disableAllCastling = F2(
	function (color, rights) {
		return A2(
			$pilatch$elm_chess$Internal$CastleRights$disableQueensideCastling,
			color,
			A2($pilatch$elm_chess$Internal$CastleRights$disableKingsideCastling, color, rights));
	});
var $pilatch$elm_chess$Internal$SquareFile$e = $pilatch$elm_chess$Internal$BoardDimensions$fileMin + 4;
var $pilatch$elm_chess$Internal$Square$e1 = A2($pilatch$elm_chess$Internal$Square$make, $pilatch$elm_chess$Internal$SquareFile$e, $pilatch$elm_chess$Internal$SquareRank$one);
var $pilatch$elm_chess$Internal$Square$e8 = A2($pilatch$elm_chess$Internal$Square$make, $pilatch$elm_chess$Internal$SquareFile$e, $pilatch$elm_chess$Internal$SquareRank$eight);
var $pilatch$elm_chess$Internal$SquareFile$h = $pilatch$elm_chess$Internal$BoardDimensions$fileMin + 7;
var $pilatch$elm_chess$Internal$Square$h1 = A2($pilatch$elm_chess$Internal$Square$make, $pilatch$elm_chess$Internal$SquareFile$h, $pilatch$elm_chess$Internal$SquareRank$one);
var $pilatch$elm_chess$Internal$Square$h8 = A2($pilatch$elm_chess$Internal$Square$make, $pilatch$elm_chess$Internal$SquareFile$h, $pilatch$elm_chess$Internal$SquareRank$eight);
var $pilatch$elm_chess$Internal$PieceColor$white = 0;
var $pilatch$elm_chess$Internal$CastleRights$doMove = F2(
	function (move, rights) {
		var to = $pilatch$elm_chess$Internal$Move$to(move);
		var from = $pilatch$elm_chess$Internal$Move$from(move);
		return (_Utils_eq(from, $pilatch$elm_chess$Internal$Square$e8) ? $pilatch$elm_chess$Internal$CastleRights$disableAllCastling($pilatch$elm_chess$Internal$PieceColor$black) : $elm$core$Basics$identity)(
			(_Utils_eq(from, $pilatch$elm_chess$Internal$Square$e1) ? $pilatch$elm_chess$Internal$CastleRights$disableAllCastling($pilatch$elm_chess$Internal$PieceColor$white) : $elm$core$Basics$identity)(
				((_Utils_eq(from, $pilatch$elm_chess$Internal$Square$h8) || _Utils_eq(to, $pilatch$elm_chess$Internal$Square$h8)) ? $pilatch$elm_chess$Internal$CastleRights$disableKingsideCastling($pilatch$elm_chess$Internal$PieceColor$black) : $elm$core$Basics$identity)(
					((_Utils_eq(from, $pilatch$elm_chess$Internal$Square$h1) || _Utils_eq(to, $pilatch$elm_chess$Internal$Square$h1)) ? $pilatch$elm_chess$Internal$CastleRights$disableKingsideCastling($pilatch$elm_chess$Internal$PieceColor$white) : $elm$core$Basics$identity)(
						((_Utils_eq(from, $pilatch$elm_chess$Internal$Square$a8) || _Utils_eq(to, $pilatch$elm_chess$Internal$Square$a8)) ? $pilatch$elm_chess$Internal$CastleRights$disableQueensideCastling($pilatch$elm_chess$Internal$PieceColor$black) : $elm$core$Basics$identity)(
							((_Utils_eq(from, $pilatch$elm_chess$Internal$Square$a1) || _Utils_eq(to, $pilatch$elm_chess$Internal$Square$a1)) ? $pilatch$elm_chess$Internal$CastleRights$disableQueensideCastling($pilatch$elm_chess$Internal$PieceColor$white) : $elm$core$Basics$identity)(rights))))));
	});
var $pilatch$elm_chess$Internal$Piece$kind = function (piece) {
	return $pilatch$elm_chess$Internal$Piece$unwrap(piece) & 7;
};
var $pilatch$elm_chess$Internal$SquareDelta$n = $pilatch$elm_chess$Internal$BoardDimensions$extendedFileCount;
var $pilatch$elm_chess$Internal$SquareDelta$add = F2(
	function (delta0, delta1) {
		return $pilatch$elm_chess$Internal$SquareDelta$unwrap(delta0) + $pilatch$elm_chess$Internal$SquareDelta$unwrap(delta1);
	});
var $pilatch$elm_chess$Internal$SquareDelta$nn = A2($pilatch$elm_chess$Internal$SquareDelta$add, $pilatch$elm_chess$Internal$SquareDelta$n, $pilatch$elm_chess$Internal$SquareDelta$n);
var $pilatch$elm_chess$Internal$PieceColor$opposite = A2(
	$elm$core$Basics$composeR,
	$pilatch$elm_chess$Internal$PieceColor$unwrap,
	A2(
		$elm$core$Basics$composeR,
		$elm$core$Bitwise$xor(1),
		$elm$core$Basics$identity));
var $pilatch$elm_chess$Internal$Position$unwrap = function (pos) {
	var pos_ = pos;
	return pos_;
};
var $pilatch$elm_chess$Internal$Position$pieceOn = F2(
	function (square, pos) {
		return A2(
			$pilatch$elm_chess$Internal$Board$pieceOn,
			square,
			$pilatch$elm_chess$Internal$Position$unwrap(pos).bD);
	});
var $pilatch$elm_chess$Internal$SquareDelta$s = $pilatch$elm_chess$Internal$SquareDelta$negate($pilatch$elm_chess$Internal$SquareDelta$n);
var $pilatch$elm_chess$Internal$SquareDelta$ss = A2($pilatch$elm_chess$Internal$SquareDelta$add, $pilatch$elm_chess$Internal$SquareDelta$s, $pilatch$elm_chess$Internal$SquareDelta$s);
var $pilatch$elm_chess$Internal$Square$subtract = F2(
	function (square0, square1) {
		return $pilatch$elm_chess$Internal$Square$unwrap(square0) - $pilatch$elm_chess$Internal$Square$unwrap(square1);
	});
var $pilatch$elm_chess$Internal$Piece$whiteKing = A2($pilatch$elm_chess$Internal$Piece$make, $pilatch$elm_chess$Internal$PieceColor$white, $pilatch$elm_chess$Internal$PieceType$king);
var $pilatch$elm_chess$Internal$Piece$whitePawn = A2($pilatch$elm_chess$Internal$Piece$make, $pilatch$elm_chess$Internal$PieceColor$white, $pilatch$elm_chess$Internal$PieceType$pawn);
var $pilatch$elm_chess$Internal$Position$doMove = F2(
	function (move, position) {
		var to = $pilatch$elm_chess$Internal$Move$to(move);
		var from = $pilatch$elm_chess$Internal$Move$from(move);
		var piece = A2($pilatch$elm_chess$Internal$Position$pieceOn, from, position);
		var pos = position;
		return {
			aj: _Utils_eq(piece, $pilatch$elm_chess$Internal$Piece$blackKing) ? $elm$core$Maybe$Just(to) : pos.aj,
			bD: A2($pilatch$elm_chess$Internal$Board$doMove, move, pos.bD),
			ak: A2($pilatch$elm_chess$Internal$CastleRights$doMove, move, pos.ak),
			a0: (_Utils_eq(piece, $pilatch$elm_chess$Internal$Piece$whitePawn) && _Utils_eq(
				A2($pilatch$elm_chess$Internal$Square$subtract, to, from),
				$pilatch$elm_chess$Internal$SquareDelta$nn)) ? $elm$core$Maybe$Just(
				A2($pilatch$elm_chess$Internal$Square$add, from, $pilatch$elm_chess$Internal$SquareDelta$n)) : ((_Utils_eq(piece, $pilatch$elm_chess$Internal$Piece$blackPawn) && _Utils_eq(
				A2($pilatch$elm_chess$Internal$Square$subtract, to, from),
				$pilatch$elm_chess$Internal$SquareDelta$ss)) ? $elm$core$Maybe$Just(
				A2($pilatch$elm_chess$Internal$Square$add, from, $pilatch$elm_chess$Internal$SquareDelta$s)) : $elm$core$Maybe$Nothing),
			aG: pos.aG + 1,
			M: $elm$core$Maybe$Just(move),
			a: $elm$core$Maybe$Just(position),
			aO: (_Utils_eq(
				$pilatch$elm_chess$Internal$Piece$kind(piece),
				$pilatch$elm_chess$Internal$PieceType$pawn) || (!_Utils_eq(
				A2($pilatch$elm_chess$Internal$Position$pieceOn, to, position),
				$pilatch$elm_chess$Internal$Piece$empty))) ? 0 : (pos.aO + 1),
			aQ: $pilatch$elm_chess$Internal$PieceColor$opposite(pos.aQ),
			aB: _Utils_eq(piece, $pilatch$elm_chess$Internal$Piece$whiteKing) ? $elm$core$Maybe$Just(to) : pos.aB
		};
	});
var $pilatch$elm_chess$Internal$Game$position = function (game) {
	return game.aZ;
};
var $elm$core$Elm$JsArray$push = _JsArray_push;
var $elm$core$Elm$JsArray$singleton = _JsArray_singleton;
var $elm$core$Array$insertTailInTree = F4(
	function (shift, index, tail, tree) {
		var pos = $elm$core$Array$bitMask & (index >>> shift);
		if (_Utils_cmp(
			pos,
			$elm$core$Elm$JsArray$length(tree)) > -1) {
			if (shift === 5) {
				return A2(
					$elm$core$Elm$JsArray$push,
					$elm$core$Array$Leaf(tail),
					tree);
			} else {
				var newSub = $elm$core$Array$SubTree(
					A4($elm$core$Array$insertTailInTree, shift - $elm$core$Array$shiftStep, index, tail, $elm$core$Elm$JsArray$empty));
				return A2($elm$core$Elm$JsArray$push, newSub, tree);
			}
		} else {
			var value = A2($elm$core$Elm$JsArray$unsafeGet, pos, tree);
			if (!value.$) {
				var subTree = value.a;
				var newSub = $elm$core$Array$SubTree(
					A4($elm$core$Array$insertTailInTree, shift - $elm$core$Array$shiftStep, index, tail, subTree));
				return A3($elm$core$Elm$JsArray$unsafeSet, pos, newSub, tree);
			} else {
				var newSub = $elm$core$Array$SubTree(
					A4(
						$elm$core$Array$insertTailInTree,
						shift - $elm$core$Array$shiftStep,
						index,
						tail,
						$elm$core$Elm$JsArray$singleton(value)));
				return A3($elm$core$Elm$JsArray$unsafeSet, pos, newSub, tree);
			}
		}
	});
var $elm$core$Array$unsafeReplaceTail = F2(
	function (newTail, _v0) {
		var len = _v0.a;
		var startShift = _v0.b;
		var tree = _v0.c;
		var tail = _v0.d;
		var originalTailLen = $elm$core$Elm$JsArray$length(tail);
		var newTailLen = $elm$core$Elm$JsArray$length(newTail);
		var newArrayLen = len + (newTailLen - originalTailLen);
		if (_Utils_eq(newTailLen, $elm$core$Array$branchFactor)) {
			var overflow = _Utils_cmp(newArrayLen >>> $elm$core$Array$shiftStep, 1 << startShift) > 0;
			if (overflow) {
				var newShift = startShift + $elm$core$Array$shiftStep;
				var newTree = A4(
					$elm$core$Array$insertTailInTree,
					newShift,
					len,
					newTail,
					$elm$core$Elm$JsArray$singleton(
						$elm$core$Array$SubTree(tree)));
				return A4($elm$core$Array$Array_elm_builtin, newArrayLen, newShift, newTree, $elm$core$Elm$JsArray$empty);
			} else {
				return A4(
					$elm$core$Array$Array_elm_builtin,
					newArrayLen,
					startShift,
					A4($elm$core$Array$insertTailInTree, startShift, len, newTail, tree),
					$elm$core$Elm$JsArray$empty);
			}
		} else {
			return A4($elm$core$Array$Array_elm_builtin, newArrayLen, startShift, tree, newTail);
		}
	});
var $elm$core$Array$push = F2(
	function (a, array) {
		var tail = array.d;
		return A2(
			$elm$core$Array$unsafeReplaceTail,
			A2($elm$core$Elm$JsArray$push, a, tail),
			array);
	});
var $elm$core$Elm$JsArray$appendN = _JsArray_appendN;
var $elm$core$Elm$JsArray$slice = _JsArray_slice;
var $elm$core$Array$appendHelpBuilder = F2(
	function (tail, builder) {
		var tailLen = $elm$core$Elm$JsArray$length(tail);
		var notAppended = ($elm$core$Array$branchFactor - $elm$core$Elm$JsArray$length(builder.i)) - tailLen;
		var appended = A3($elm$core$Elm$JsArray$appendN, $elm$core$Array$branchFactor, builder.i, tail);
		return (notAppended < 0) ? {
			j: A2(
				$elm$core$List$cons,
				$elm$core$Array$Leaf(appended),
				builder.j),
			h: builder.h + 1,
			i: A3($elm$core$Elm$JsArray$slice, notAppended, tailLen, tail)
		} : ((!notAppended) ? {
			j: A2(
				$elm$core$List$cons,
				$elm$core$Array$Leaf(appended),
				builder.j),
			h: builder.h + 1,
			i: $elm$core$Elm$JsArray$empty
		} : {j: builder.j, h: builder.h, i: appended});
	});
var $elm$core$List$drop = F2(
	function (n, list) {
		drop:
		while (true) {
			if (n <= 0) {
				return list;
			} else {
				if (!list.b) {
					return list;
				} else {
					var x = list.a;
					var xs = list.b;
					var $temp$n = n - 1,
						$temp$list = xs;
					n = $temp$n;
					list = $temp$list;
					continue drop;
				}
			}
		}
	});
var $elm$core$Array$sliceLeft = F2(
	function (from, array) {
		var len = array.a;
		var tree = array.c;
		var tail = array.d;
		if (!from) {
			return array;
		} else {
			if (_Utils_cmp(
				from,
				$elm$core$Array$tailIndex(len)) > -1) {
				return A4(
					$elm$core$Array$Array_elm_builtin,
					len - from,
					$elm$core$Array$shiftStep,
					$elm$core$Elm$JsArray$empty,
					A3(
						$elm$core$Elm$JsArray$slice,
						from - $elm$core$Array$tailIndex(len),
						$elm$core$Elm$JsArray$length(tail),
						tail));
			} else {
				var skipNodes = (from / $elm$core$Array$branchFactor) | 0;
				var helper = F2(
					function (node, acc) {
						if (!node.$) {
							var subTree = node.a;
							return A3($elm$core$Elm$JsArray$foldr, helper, acc, subTree);
						} else {
							var leaf = node.a;
							return A2($elm$core$List$cons, leaf, acc);
						}
					});
				var leafNodes = A3(
					$elm$core$Elm$JsArray$foldr,
					helper,
					_List_fromArray(
						[tail]),
					tree);
				var nodesToInsert = A2($elm$core$List$drop, skipNodes, leafNodes);
				if (!nodesToInsert.b) {
					return $elm$core$Array$empty;
				} else {
					var head = nodesToInsert.a;
					var rest = nodesToInsert.b;
					var firstSlice = from - (skipNodes * $elm$core$Array$branchFactor);
					var initialBuilder = {
						j: _List_Nil,
						h: 0,
						i: A3(
							$elm$core$Elm$JsArray$slice,
							firstSlice,
							$elm$core$Elm$JsArray$length(head),
							head)
					};
					return A2(
						$elm$core$Array$builderToArray,
						true,
						A3($elm$core$List$foldl, $elm$core$Array$appendHelpBuilder, initialBuilder, rest));
				}
			}
		}
	});
var $elm$core$Array$fetchNewTail = F4(
	function (shift, end, treeEnd, tree) {
		fetchNewTail:
		while (true) {
			var pos = $elm$core$Array$bitMask & (treeEnd >>> shift);
			var _v0 = A2($elm$core$Elm$JsArray$unsafeGet, pos, tree);
			if (!_v0.$) {
				var sub = _v0.a;
				var $temp$shift = shift - $elm$core$Array$shiftStep,
					$temp$end = end,
					$temp$treeEnd = treeEnd,
					$temp$tree = sub;
				shift = $temp$shift;
				end = $temp$end;
				treeEnd = $temp$treeEnd;
				tree = $temp$tree;
				continue fetchNewTail;
			} else {
				var values = _v0.a;
				return A3($elm$core$Elm$JsArray$slice, 0, $elm$core$Array$bitMask & end, values);
			}
		}
	});
var $elm$core$Array$hoistTree = F3(
	function (oldShift, newShift, tree) {
		hoistTree:
		while (true) {
			if ((_Utils_cmp(oldShift, newShift) < 1) || (!$elm$core$Elm$JsArray$length(tree))) {
				return tree;
			} else {
				var _v0 = A2($elm$core$Elm$JsArray$unsafeGet, 0, tree);
				if (!_v0.$) {
					var sub = _v0.a;
					var $temp$oldShift = oldShift - $elm$core$Array$shiftStep,
						$temp$newShift = newShift,
						$temp$tree = sub;
					oldShift = $temp$oldShift;
					newShift = $temp$newShift;
					tree = $temp$tree;
					continue hoistTree;
				} else {
					return tree;
				}
			}
		}
	});
var $elm$core$Array$sliceTree = F3(
	function (shift, endIdx, tree) {
		var lastPos = $elm$core$Array$bitMask & (endIdx >>> shift);
		var _v0 = A2($elm$core$Elm$JsArray$unsafeGet, lastPos, tree);
		if (!_v0.$) {
			var sub = _v0.a;
			var newSub = A3($elm$core$Array$sliceTree, shift - $elm$core$Array$shiftStep, endIdx, sub);
			return (!$elm$core$Elm$JsArray$length(newSub)) ? A3($elm$core$Elm$JsArray$slice, 0, lastPos, tree) : A3(
				$elm$core$Elm$JsArray$unsafeSet,
				lastPos,
				$elm$core$Array$SubTree(newSub),
				A3($elm$core$Elm$JsArray$slice, 0, lastPos + 1, tree));
		} else {
			return A3($elm$core$Elm$JsArray$slice, 0, lastPos, tree);
		}
	});
var $elm$core$Array$sliceRight = F2(
	function (end, array) {
		var len = array.a;
		var startShift = array.b;
		var tree = array.c;
		var tail = array.d;
		if (_Utils_eq(end, len)) {
			return array;
		} else {
			if (_Utils_cmp(
				end,
				$elm$core$Array$tailIndex(len)) > -1) {
				return A4(
					$elm$core$Array$Array_elm_builtin,
					end,
					startShift,
					tree,
					A3($elm$core$Elm$JsArray$slice, 0, $elm$core$Array$bitMask & end, tail));
			} else {
				var endIdx = $elm$core$Array$tailIndex(end);
				var depth = $elm$core$Basics$floor(
					A2(
						$elm$core$Basics$logBase,
						$elm$core$Array$branchFactor,
						A2($elm$core$Basics$max, 1, endIdx - 1)));
				var newShift = A2($elm$core$Basics$max, 5, depth * $elm$core$Array$shiftStep);
				return A4(
					$elm$core$Array$Array_elm_builtin,
					end,
					newShift,
					A3(
						$elm$core$Array$hoistTree,
						startShift,
						newShift,
						A3($elm$core$Array$sliceTree, startShift, endIdx, tree)),
					A4($elm$core$Array$fetchNewTail, startShift, end, endIdx, tree));
			}
		}
	});
var $elm$core$Array$translateIndex = F2(
	function (index, _v0) {
		var len = _v0.a;
		var posIndex = (index < 0) ? (len + index) : index;
		return (posIndex < 0) ? 0 : ((_Utils_cmp(posIndex, len) > 0) ? len : posIndex);
	});
var $elm$core$Array$slice = F3(
	function (from, to, array) {
		var correctTo = A2($elm$core$Array$translateIndex, to, array);
		var correctFrom = A2($elm$core$Array$translateIndex, from, array);
		return (_Utils_cmp(correctFrom, correctTo) > 0) ? $elm$core$Array$empty : A2(
			$elm$core$Array$sliceLeft,
			correctFrom,
			A2($elm$core$Array$sliceRight, correctTo, array));
	});
var $pilatch$elm_chess$Internal$Game$addMove = F2(
	function (move, game) {
		var pos = A2(
			$pilatch$elm_chess$Internal$Position$doMove,
			move,
			$pilatch$elm_chess$Internal$Game$position(game));
		return _Utils_update(
			game,
			{
				L: game.L + 1,
				aZ: pos,
				au: A2(
					$elm$core$Array$push,
					pos,
					A3($elm$core$Array$slice, 0, 1 + game.L, game.au))
			});
	});
var $pilatch$elm_chess$Game$addMove = F2(
	function (move, game) {
		var g = game;
		return A2($pilatch$elm_chess$Internal$Game$addMove, move, g);
	});
var $pilatch$elm_chess$Internal$BoardDimensions$fileMax = ($pilatch$elm_chess$Internal$BoardDimensions$fileMin + $pilatch$elm_chess$Internal$BoardDimensions$fileCount) - 1;
var $pilatch$elm_chess$Internal$SquareFile$all = A2(
	$elm$core$List$map,
	$elm$core$Basics$identity,
	A2($elm$core$List$range, $pilatch$elm_chess$Internal$BoardDimensions$fileMin, $pilatch$elm_chess$Internal$BoardDimensions$fileMax));
var $pilatch$elm_chess$Internal$BoardDimensions$rankCount = 8;
var $pilatch$elm_chess$Internal$BoardDimensions$rankMax = ($pilatch$elm_chess$Internal$BoardDimensions$rankMin + $pilatch$elm_chess$Internal$BoardDimensions$rankCount) - 1;
var $pilatch$elm_chess$Internal$SquareRank$all = A2(
	$elm$core$List$map,
	$elm$core$Basics$identity,
	A2($elm$core$List$range, $pilatch$elm_chess$Internal$BoardDimensions$rankMin, $pilatch$elm_chess$Internal$BoardDimensions$rankMax));
var $elm$core$List$concat = function (lists) {
	return A3($elm$core$List$foldr, $elm$core$List$append, _List_Nil, lists);
};
var $elm$core$List$concatMap = F2(
	function (f, list) {
		return $elm$core$List$concat(
			A2($elm$core$List$map, f, list));
	});
var $pilatch$elm_chess$Internal$Square$all = A2(
	$elm$core$List$concatMap,
	function (f) {
		return A2(
			$elm$core$List$map,
			$pilatch$elm_chess$Internal$Square$make(f),
			$pilatch$elm_chess$Internal$SquareRank$all);
	},
	$pilatch$elm_chess$Internal$SquareFile$all);
var $pilatch$elm_chess$Internal$BoardDimensions$extendedBoardSize = ((($pilatch$elm_chess$Internal$BoardDimensions$rankCount + 3) * $pilatch$elm_chess$Internal$BoardDimensions$extendedFileCount) + $pilatch$elm_chess$Internal$BoardDimensions$fileCount) + 2;
var $elm$core$Array$fromListHelp = F3(
	function (list, nodeList, nodeListSize) {
		fromListHelp:
		while (true) {
			var _v0 = A2($elm$core$Elm$JsArray$initializeFromList, $elm$core$Array$branchFactor, list);
			var jsArray = _v0.a;
			var remainingItems = _v0.b;
			if (_Utils_cmp(
				$elm$core$Elm$JsArray$length(jsArray),
				$elm$core$Array$branchFactor) < 0) {
				return A2(
					$elm$core$Array$builderToArray,
					true,
					{j: nodeList, h: nodeListSize, i: jsArray});
			} else {
				var $temp$list = remainingItems,
					$temp$nodeList = A2(
					$elm$core$List$cons,
					$elm$core$Array$Leaf(jsArray),
					nodeList),
					$temp$nodeListSize = nodeListSize + 1;
				list = $temp$list;
				nodeList = $temp$nodeList;
				nodeListSize = $temp$nodeListSize;
				continue fromListHelp;
			}
		}
	});
var $elm$core$Array$fromList = function (list) {
	if (!list.b) {
		return $elm$core$Array$empty;
	} else {
		return A3($elm$core$Array$fromListHelp, list, _List_Nil, 0);
	}
};
var $elm$core$List$repeatHelp = F3(
	function (result, n, value) {
		repeatHelp:
		while (true) {
			if (n <= 0) {
				return result;
			} else {
				var $temp$result = A2($elm$core$List$cons, value, result),
					$temp$n = n - 1,
					$temp$value = value;
				result = $temp$result;
				n = $temp$n;
				value = $temp$value;
				continue repeatHelp;
			}
		}
	});
var $elm$core$List$repeat = F2(
	function (n, value) {
		return A3($elm$core$List$repeatHelp, _List_Nil, n, value);
	});
var $pilatch$elm_chess$Internal$Board$empty = A3(
	$elm$core$List$foldl,
	F2(
		function (s, b) {
			return A3(
				$elm$core$Array$set,
				$pilatch$elm_chess$Internal$Square$unwrap(s),
				$pilatch$elm_chess$Internal$Piece$empty,
				b);
		}),
	$elm$core$Array$fromList(
		A2($elm$core$List$repeat, $pilatch$elm_chess$Internal$BoardDimensions$extendedBoardSize, $pilatch$elm_chess$Internal$Piece$outside)),
	$pilatch$elm_chess$Internal$Square$all);
var $pilatch$elm_chess$Internal$CastleRights$empty = 0;
var $pilatch$elm_chess$Internal$Position$empty = {aj: $elm$core$Maybe$Nothing, bD: $pilatch$elm_chess$Internal$Board$empty, ak: $pilatch$elm_chess$Internal$CastleRights$empty, a0: $elm$core$Maybe$Nothing, aG: 0, M: $elm$core$Maybe$Nothing, a: $elm$core$Maybe$Nothing, aO: 0, aQ: $pilatch$elm_chess$Internal$PieceColor$white, aB: $elm$core$Maybe$Nothing};
var $pilatch$elm_chess$Internal$Board$ReadFenState = F3(
	function (board, fileIndex, rankIndex) {
		return {bD: board, aE: fileIndex, bX: rankIndex};
	});
var $pilatch$elm_chess$Internal$PieceType$bishop = 3;
var $pilatch$elm_chess$Internal$PieceType$knight = 2;
var $pilatch$elm_chess$Internal$PieceType$queen = 5;
var $pilatch$elm_chess$Internal$PieceType$rook = 4;
var $elm$core$Char$toUpper = _Char_toUpper;
var $pilatch$elm_chess$Internal$PieceType$fromChar = function (_char) {
	var ch = $elm$core$Char$toUpper(_char);
	return (ch === 'P') ? $elm$core$Maybe$Just($pilatch$elm_chess$Internal$PieceType$pawn) : ((ch === 'N') ? $elm$core$Maybe$Just($pilatch$elm_chess$Internal$PieceType$knight) : ((ch === 'B') ? $elm$core$Maybe$Just($pilatch$elm_chess$Internal$PieceType$bishop) : ((ch === 'R') ? $elm$core$Maybe$Just($pilatch$elm_chess$Internal$PieceType$rook) : ((ch === 'Q') ? $elm$core$Maybe$Just($pilatch$elm_chess$Internal$PieceType$queen) : ((ch === 'K') ? $elm$core$Maybe$Just($pilatch$elm_chess$Internal$PieceType$king) : $elm$core$Maybe$Nothing)))));
};
var $pilatch$elm_chess$Internal$Piece$fromChar = function (_char) {
	return A2(
		$elm$core$Maybe$map,
		$pilatch$elm_chess$Internal$Piece$make(
			$elm$core$Char$isUpper(_char) ? $pilatch$elm_chess$Internal$PieceColor$white : $pilatch$elm_chess$Internal$PieceColor$black),
		$pilatch$elm_chess$Internal$PieceType$fromChar(_char));
};
var $pilatch$elm_chess$Internal$Board$readFenPiece = F2(
	function (piece, state) {
		return A3(
			$pilatch$elm_chess$Internal$Board$putPiece,
			piece,
			$pilatch$elm_chess$Internal$Square$expand(state.aE + (8 * state.bX)),
			state.bD);
	});
var $pilatch$elm_chess$Internal$Board$processFenChar = F2(
	function (_char, state) {
		var _v0 = $pilatch$elm_chess$Internal$Piece$fromChar(_char);
		if (!_v0.$) {
			var piece = _v0.a;
			return _Utils_update(
				state,
				{
					bD: A2($pilatch$elm_chess$Internal$Board$readFenPiece, piece, state),
					aE: state.aE + 1
				});
		} else {
			return $elm$core$Char$isDigit(_char) ? _Utils_update(
				state,
				{
					aE: (state.aE + $elm$core$Char$toCode(_char)) - $elm$core$Char$toCode('0')
				}) : ((_char === '/') ? _Utils_update(
				state,
				{aE: 0, bX: state.bX - 1}) : state);
		}
	});
var $elm$core$String$foldr = _String_foldr;
var $elm$core$String$toList = function (string) {
	return A3($elm$core$String$foldr, $elm$core$List$cons, _List_Nil, string);
};
var $pilatch$elm_chess$Internal$Board$fromFen = function (fen) {
	return function ($) {
		return $.bD;
	}(
		A3(
			$elm$core$List$foldl,
			$pilatch$elm_chess$Internal$Board$processFenChar,
			A3($pilatch$elm_chess$Internal$Board$ReadFenState, $pilatch$elm_chess$Internal$Board$empty, 0, $pilatch$elm_chess$Internal$BoardDimensions$rankCount - 1),
			$elm$core$String$toList(fen)));
};
var $pilatch$elm_chess$Internal$CastleRights$fromChar = function (_char) {
	return (_char === 'K') ? 1 : ((_char === 'Q') ? 2 : ((_char === 'k') ? 4 : ((_char === 'q') ? 8 : 0)));
};
var $pilatch$elm_chess$Internal$CastleRights$fromString = function (string) {
	return A3(
		$elm$core$List$foldl,
		$elm$core$Bitwise$or,
		0,
		A2(
			$elm$core$List$map,
			$pilatch$elm_chess$Internal$CastleRights$fromChar,
			$elm$core$String$toList(string)));
};
var $elm$core$Maybe$andThen = F2(
	function (callback, maybeValue) {
		if (!maybeValue.$) {
			var value = maybeValue.a;
			return callback(value);
		} else {
			return $elm$core$Maybe$Nothing;
		}
	});
var $pilatch$elm_chess$Internal$PieceColor$fromChar = function (_char) {
	return (_char === 'w') ? $elm$core$Maybe$Just($pilatch$elm_chess$Internal$PieceColor$white) : ((_char === 'b') ? $elm$core$Maybe$Just($pilatch$elm_chess$Internal$PieceColor$black) : $elm$core$Maybe$Nothing);
};
var $pilatch$elm_chess$Internal$PieceColor$fromString = function (string) {
	return A2(
		$elm$core$Maybe$andThen,
		$pilatch$elm_chess$Internal$PieceColor$fromChar,
		$elm$core$List$head(
			$elm$core$String$toList(string)));
};
var $pilatch$elm_chess$Internal$SquareFile$fromChar = function (_char) {
	var f_ = $elm$core$Char$toCode(_char) - $elm$core$Char$toCode('a');
	return ((f_ >= 0) && (_Utils_cmp(f_, $pilatch$elm_chess$Internal$BoardDimensions$fileCount) < 0)) ? $elm$core$Maybe$Just(f_ + $pilatch$elm_chess$Internal$BoardDimensions$fileMin) : $elm$core$Maybe$Nothing;
};
var $pilatch$elm_chess$Internal$SquareFile$fromString = function (string) {
	return A2(
		$elm$core$Maybe$andThen,
		$pilatch$elm_chess$Internal$SquareFile$fromChar,
		$elm$core$List$head(
			$elm$core$String$toList(string)));
};
var $pilatch$elm_chess$Internal$SquareRank$fromChar = function (_char) {
	var r = $elm$core$Char$toCode(_char) - $elm$core$Char$toCode('1');
	return ((r >= 0) && (_Utils_cmp(r, $pilatch$elm_chess$Internal$BoardDimensions$rankCount) < 0)) ? $elm$core$Maybe$Just(r + $pilatch$elm_chess$Internal$BoardDimensions$rankMin) : $elm$core$Maybe$Nothing;
};
var $pilatch$elm_chess$Internal$SquareRank$fromString = function (string) {
	return A2(
		$elm$core$Maybe$andThen,
		$pilatch$elm_chess$Internal$SquareRank$fromChar,
		$elm$core$List$head(
			$elm$core$String$toList(string)));
};
var $pilatch$elm_chess$Internal$Square$fromString = function (string) {
	var r = $pilatch$elm_chess$Internal$SquareRank$fromString(
		A2($elm$core$String$dropLeft, 1, string));
	var f = $pilatch$elm_chess$Internal$SquareFile$fromString(string);
	if (!f.$) {
		var f_ = f.a;
		return A2(
			$elm$core$Maybe$map,
			$pilatch$elm_chess$Internal$Square$make(f_),
			r);
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $pilatch$elm_chess$Internal$Position$fromFen = function (fen) {
	var components = $elm$core$Array$fromList(
		A2($elm$core$String$split, ' ', fen));
	var epSquare_ = $pilatch$elm_chess$Internal$Square$fromString(
		A2(
			$elm$core$Maybe$withDefault,
			'-',
			A2($elm$core$Array$get, 3, components)));
	var sideToMove_ = $pilatch$elm_chess$Internal$PieceColor$fromString(
		A2(
			$elm$core$Maybe$withDefault,
			'w',
			A2($elm$core$Array$get, 1, components)));
	var castleRights = $pilatch$elm_chess$Internal$CastleRights$fromString(
		A2(
			$elm$core$Maybe$withDefault,
			'-',
			A2($elm$core$Array$get, 2, components)));
	var board = $pilatch$elm_chess$Internal$Board$fromFen(
		A2(
			$elm$core$Maybe$withDefault,
			'',
			A2($elm$core$Array$get, 0, components)));
	var whiteKingSquare = $elm$core$List$head(
		A2(
			$elm$core$List$filter,
			function (s) {
				return _Utils_eq(
					A2($pilatch$elm_chess$Internal$Board$pieceOn, s, board),
					$pilatch$elm_chess$Internal$Piece$whiteKing);
			},
			$pilatch$elm_chess$Internal$Square$all));
	var blackKingSquare = $elm$core$List$head(
		A2(
			$elm$core$List$filter,
			function (s) {
				return _Utils_eq(
					A2($pilatch$elm_chess$Internal$Board$pieceOn, s, board),
					$pilatch$elm_chess$Internal$Piece$blackKing);
			},
			$pilatch$elm_chess$Internal$Square$all));
	return $elm$core$Maybe$Just(
		{
			aj: blackKingSquare,
			bD: board,
			ak: castleRights,
			a0: epSquare_,
			aG: 0,
			M: $elm$core$Maybe$Nothing,
			a: $elm$core$Maybe$Nothing,
			aO: 0,
			aQ: A2($elm$core$Maybe$withDefault, $pilatch$elm_chess$Internal$PieceColor$white, sideToMove_),
			aB: whiteKingSquare
		});
};
var $pilatch$elm_chess$Internal$Position$initial = A2(
	$elm$core$Maybe$withDefault,
	$pilatch$elm_chess$Internal$Position$empty,
	$pilatch$elm_chess$Internal$Position$fromFen('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'));
var $elm$core$Array$length = function (_v0) {
	var len = _v0.a;
	return len;
};
var $pilatch$elm_chess$Internal$Game$goToMove = F2(
	function (moveIndex, game) {
		return ((moveIndex < 0) || (_Utils_cmp(
			moveIndex,
			$elm$core$Array$length(game.au)) > -1)) ? game : _Utils_update(
			game,
			{
				L: moveIndex,
				aZ: A2(
					$elm$core$Maybe$withDefault,
					$pilatch$elm_chess$Internal$Position$initial,
					A2($elm$core$Array$get, moveIndex, game.au))
			});
	});
var $pilatch$elm_chess$Internal$Game$back = function (game) {
	return A2($pilatch$elm_chess$Internal$Game$goToMove, game.L - 1, game);
};
var $pilatch$elm_chess$Game$back = function (game) {
	var g = game;
	return $pilatch$elm_chess$Internal$Game$back(g);
};
var $pilatch$elm_chess$PieceColor$black = $pilatch$elm_chess$Internal$PieceColor$black;
var $author$project$Chess$gameMetaRelType = 'me.noordstar.game.meta';
var $elm$core$Tuple$pair = F2(
	function (a, b) {
		return _Utils_Tuple2(a, b);
	});
var $author$project$Chess$encodeAcceptChess = function (_v0) {
	var reason = _v0.bt;
	var relatedTo = _v0.C;
	return $elm$json$Json$Encode$object(
		A2(
			$elm$core$List$filterMap,
			$elm$core$Basics$identity,
			_List_fromArray(
				[
					A2(
					$elm$core$Maybe$map,
					A2(
						$elm$core$Basics$composeR,
						$elm$json$Json$Encode$string,
						$elm$core$Tuple$pair('reason')),
					reason),
					$elm$core$Maybe$Just(
					_Utils_Tuple2(
						'm.relates_to',
						$elm$json$Json$Encode$object(
							_List_fromArray(
								[
									_Utils_Tuple2(
									'event_id',
									$elm$json$Json$Encode$string(relatedTo)),
									_Utils_Tuple2(
									'relType',
									$elm$json$Json$Encode$string($author$project$Chess$gameMetaRelType))
								]))))
				])));
};
var $pilatch$elm_chess$Internal$Game$toEnd = function (game) {
	return A2(
		$pilatch$elm_chess$Internal$Game$goToMove,
		$elm$core$Array$length(game.au) - 1,
		game);
};
var $pilatch$elm_chess$Game$toEnd = function (game) {
	var g = game;
	return $pilatch$elm_chess$Internal$Game$toEnd(g);
};
var $pilatch$elm_chess$Internal$Pgn$headerToString_ = function (_v0) {
	var name = _v0.a;
	var value = _v0.b;
	return '[' + (name + (' ' + ('\"' + (value + ('\"' + (']' + '\n'))))));
};
var $pilatch$elm_chess$Internal$Pgn$headersToString_ = function (game) {
	return A3(
		$elm$core$List$foldl,
		F2(
			function (t, result) {
				return _Utils_ap(
					result,
					$pilatch$elm_chess$Internal$Pgn$headerToString_(t));
			}),
		'',
		game.bw);
};
var $pilatch$elm_chess$Internal$Position$lastMove = function (position) {
	return $pilatch$elm_chess$Internal$Position$unwrap(position).M;
};
var $pilatch$elm_chess$Internal$Position$parent = function (position) {
	return $pilatch$elm_chess$Internal$Position$unwrap(position).a;
};
var $pilatch$elm_chess$Internal$Game$moves = function (game) {
	var movesInternal = F2(
		function (result, pos) {
			movesInternal:
			while (true) {
				var _v0 = $pilatch$elm_chess$Internal$Position$lastMove(pos);
				if (_v0.$ === 1) {
					return result;
				} else {
					var m = _v0.a;
					var _v1 = $pilatch$elm_chess$Internal$Position$parent(pos);
					if (_v1.$ === 1) {
						return result;
					} else {
						var p = _v1.a;
						var $temp$result = A2($elm$core$List$cons, m, result),
							$temp$pos = p;
						result = $temp$result;
						pos = $temp$pos;
						continue movesInternal;
					}
				}
			}
		});
	return A2(
		movesInternal,
		_List_Nil,
		$pilatch$elm_chess$Internal$Game$position(
			$pilatch$elm_chess$Internal$Game$toEnd(game)));
};
var $pilatch$elm_chess$Internal$Game$toBeginning = function (game) {
	return A2($pilatch$elm_chess$Internal$Game$goToMove, 0, game);
};
var $pilatch$elm_chess$Internal$Position$moveNumber = function (position) {
	return (($pilatch$elm_chess$Internal$Position$unwrap(position).aG / 2) | 0) + 1;
};
var $pilatch$elm_chess$Internal$Position$sideToMove = function (position) {
	return $pilatch$elm_chess$Internal$Position$unwrap(position).aQ;
};
var $pilatch$elm_chess$Internal$Position$kingSquare = F2(
	function (color, position) {
		return _Utils_eq(color, $pilatch$elm_chess$Internal$PieceColor$white) ? $pilatch$elm_chess$Internal$Position$unwrap(position).aB : $pilatch$elm_chess$Internal$Position$unwrap(position).aj;
	});
var $pilatch$elm_chess$Internal$Piece$blackBishop = A2($pilatch$elm_chess$Internal$Piece$make, $pilatch$elm_chess$Internal$PieceColor$black, $pilatch$elm_chess$Internal$PieceType$bishop);
var $pilatch$elm_chess$Internal$Piece$blackKnight = A2($pilatch$elm_chess$Internal$Piece$make, $pilatch$elm_chess$Internal$PieceColor$black, $pilatch$elm_chess$Internal$PieceType$knight);
var $pilatch$elm_chess$Internal$Piece$blackQueen = A2($pilatch$elm_chess$Internal$Piece$make, $pilatch$elm_chess$Internal$PieceColor$black, $pilatch$elm_chess$Internal$PieceType$queen);
var $pilatch$elm_chess$Internal$Piece$blackRook = A2($pilatch$elm_chess$Internal$Piece$make, $pilatch$elm_chess$Internal$PieceColor$black, $pilatch$elm_chess$Internal$PieceType$rook);
var $pilatch$elm_chess$Internal$SquareDelta$ne = A2($pilatch$elm_chess$Internal$SquareDelta$add, $pilatch$elm_chess$Internal$SquareDelta$n, $pilatch$elm_chess$Internal$SquareDelta$e);
var $pilatch$elm_chess$Internal$SquareDelta$nee = A2(
	$pilatch$elm_chess$Internal$SquareDelta$add,
	$pilatch$elm_chess$Internal$SquareDelta$n,
	A2($pilatch$elm_chess$Internal$SquareDelta$multiply, 2, $pilatch$elm_chess$Internal$SquareDelta$e));
var $pilatch$elm_chess$Internal$SquareDelta$nne = A2(
	$pilatch$elm_chess$Internal$SquareDelta$add,
	A2($pilatch$elm_chess$Internal$SquareDelta$multiply, 2, $pilatch$elm_chess$Internal$SquareDelta$n),
	$pilatch$elm_chess$Internal$SquareDelta$e);
var $pilatch$elm_chess$Internal$SquareDelta$nnw = A2(
	$pilatch$elm_chess$Internal$SquareDelta$add,
	A2($pilatch$elm_chess$Internal$SquareDelta$multiply, 2, $pilatch$elm_chess$Internal$SquareDelta$n),
	$pilatch$elm_chess$Internal$SquareDelta$w);
var $pilatch$elm_chess$Internal$SquareDelta$nw = A2($pilatch$elm_chess$Internal$SquareDelta$add, $pilatch$elm_chess$Internal$SquareDelta$n, $pilatch$elm_chess$Internal$SquareDelta$w);
var $pilatch$elm_chess$Internal$SquareDelta$nww = A2(
	$pilatch$elm_chess$Internal$SquareDelta$add,
	$pilatch$elm_chess$Internal$SquareDelta$n,
	A2($pilatch$elm_chess$Internal$SquareDelta$multiply, 2, $pilatch$elm_chess$Internal$SquareDelta$w));
var $pilatch$elm_chess$Internal$SquareDelta$se = A2($pilatch$elm_chess$Internal$SquareDelta$add, $pilatch$elm_chess$Internal$SquareDelta$s, $pilatch$elm_chess$Internal$SquareDelta$e);
var $pilatch$elm_chess$Internal$SquareDelta$see = A2(
	$pilatch$elm_chess$Internal$SquareDelta$add,
	$pilatch$elm_chess$Internal$SquareDelta$s,
	A2($pilatch$elm_chess$Internal$SquareDelta$multiply, 2, $pilatch$elm_chess$Internal$SquareDelta$e));
var $pilatch$elm_chess$Internal$SquareDelta$sse = A2(
	$pilatch$elm_chess$Internal$SquareDelta$add,
	A2($pilatch$elm_chess$Internal$SquareDelta$multiply, 2, $pilatch$elm_chess$Internal$SquareDelta$s),
	$pilatch$elm_chess$Internal$SquareDelta$e);
var $pilatch$elm_chess$Internal$SquareDelta$ssw = A2(
	$pilatch$elm_chess$Internal$SquareDelta$add,
	A2($pilatch$elm_chess$Internal$SquareDelta$multiply, 2, $pilatch$elm_chess$Internal$SquareDelta$s),
	$pilatch$elm_chess$Internal$SquareDelta$w);
var $pilatch$elm_chess$Internal$SquareDelta$sw = A2($pilatch$elm_chess$Internal$SquareDelta$add, $pilatch$elm_chess$Internal$SquareDelta$s, $pilatch$elm_chess$Internal$SquareDelta$w);
var $pilatch$elm_chess$Internal$SquareDelta$sww = A2(
	$pilatch$elm_chess$Internal$SquareDelta$add,
	$pilatch$elm_chess$Internal$SquareDelta$s,
	A2($pilatch$elm_chess$Internal$SquareDelta$multiply, 2, $pilatch$elm_chess$Internal$SquareDelta$w));
var $pilatch$elm_chess$Internal$Piece$whiteBishop = A2($pilatch$elm_chess$Internal$Piece$make, $pilatch$elm_chess$Internal$PieceColor$white, $pilatch$elm_chess$Internal$PieceType$bishop);
var $pilatch$elm_chess$Internal$Piece$whiteKnight = A2($pilatch$elm_chess$Internal$Piece$make, $pilatch$elm_chess$Internal$PieceColor$white, $pilatch$elm_chess$Internal$PieceType$knight);
var $pilatch$elm_chess$Internal$Piece$whiteQueen = A2($pilatch$elm_chess$Internal$Piece$make, $pilatch$elm_chess$Internal$PieceColor$white, $pilatch$elm_chess$Internal$PieceType$queen);
var $pilatch$elm_chess$Internal$Piece$whiteRook = A2($pilatch$elm_chess$Internal$Piece$make, $pilatch$elm_chess$Internal$PieceColor$white, $pilatch$elm_chess$Internal$PieceType$rook);
var $pilatch$elm_chess$Internal$Piece$attackDirections = function (piece) {
	return _Utils_eq(piece, $pilatch$elm_chess$Internal$Piece$whitePawn) ? _List_fromArray(
		[$pilatch$elm_chess$Internal$SquareDelta$nw, $pilatch$elm_chess$Internal$SquareDelta$ne]) : (_Utils_eq(piece, $pilatch$elm_chess$Internal$Piece$whiteKnight) ? _List_fromArray(
		[$pilatch$elm_chess$Internal$SquareDelta$nnw, $pilatch$elm_chess$Internal$SquareDelta$nne, $pilatch$elm_chess$Internal$SquareDelta$nww, $pilatch$elm_chess$Internal$SquareDelta$nee, $pilatch$elm_chess$Internal$SquareDelta$ssw, $pilatch$elm_chess$Internal$SquareDelta$sse, $pilatch$elm_chess$Internal$SquareDelta$sww, $pilatch$elm_chess$Internal$SquareDelta$see]) : (_Utils_eq(piece, $pilatch$elm_chess$Internal$Piece$whiteBishop) ? _List_fromArray(
		[$pilatch$elm_chess$Internal$SquareDelta$nw, $pilatch$elm_chess$Internal$SquareDelta$ne, $pilatch$elm_chess$Internal$SquareDelta$sw, $pilatch$elm_chess$Internal$SquareDelta$se]) : (_Utils_eq(piece, $pilatch$elm_chess$Internal$Piece$whiteRook) ? _List_fromArray(
		[$pilatch$elm_chess$Internal$SquareDelta$n, $pilatch$elm_chess$Internal$SquareDelta$s, $pilatch$elm_chess$Internal$SquareDelta$w, $pilatch$elm_chess$Internal$SquareDelta$e]) : (_Utils_eq(piece, $pilatch$elm_chess$Internal$Piece$whiteQueen) ? _List_fromArray(
		[$pilatch$elm_chess$Internal$SquareDelta$nw, $pilatch$elm_chess$Internal$SquareDelta$ne, $pilatch$elm_chess$Internal$SquareDelta$sw, $pilatch$elm_chess$Internal$SquareDelta$se, $pilatch$elm_chess$Internal$SquareDelta$n, $pilatch$elm_chess$Internal$SquareDelta$s, $pilatch$elm_chess$Internal$SquareDelta$w, $pilatch$elm_chess$Internal$SquareDelta$e]) : (_Utils_eq(piece, $pilatch$elm_chess$Internal$Piece$whiteKing) ? _List_fromArray(
		[$pilatch$elm_chess$Internal$SquareDelta$nw, $pilatch$elm_chess$Internal$SquareDelta$ne, $pilatch$elm_chess$Internal$SquareDelta$sw, $pilatch$elm_chess$Internal$SquareDelta$se, $pilatch$elm_chess$Internal$SquareDelta$n, $pilatch$elm_chess$Internal$SquareDelta$s, $pilatch$elm_chess$Internal$SquareDelta$w, $pilatch$elm_chess$Internal$SquareDelta$e]) : (_Utils_eq(piece, $pilatch$elm_chess$Internal$Piece$blackPawn) ? _List_fromArray(
		[$pilatch$elm_chess$Internal$SquareDelta$sw, $pilatch$elm_chess$Internal$SquareDelta$se]) : (_Utils_eq(piece, $pilatch$elm_chess$Internal$Piece$blackKnight) ? _List_fromArray(
		[$pilatch$elm_chess$Internal$SquareDelta$nnw, $pilatch$elm_chess$Internal$SquareDelta$nne, $pilatch$elm_chess$Internal$SquareDelta$nww, $pilatch$elm_chess$Internal$SquareDelta$nee, $pilatch$elm_chess$Internal$SquareDelta$ssw, $pilatch$elm_chess$Internal$SquareDelta$sse, $pilatch$elm_chess$Internal$SquareDelta$sww, $pilatch$elm_chess$Internal$SquareDelta$see]) : (_Utils_eq(piece, $pilatch$elm_chess$Internal$Piece$blackBishop) ? _List_fromArray(
		[$pilatch$elm_chess$Internal$SquareDelta$nw, $pilatch$elm_chess$Internal$SquareDelta$ne, $pilatch$elm_chess$Internal$SquareDelta$sw, $pilatch$elm_chess$Internal$SquareDelta$se]) : (_Utils_eq(piece, $pilatch$elm_chess$Internal$Piece$blackRook) ? _List_fromArray(
		[$pilatch$elm_chess$Internal$SquareDelta$n, $pilatch$elm_chess$Internal$SquareDelta$s, $pilatch$elm_chess$Internal$SquareDelta$w, $pilatch$elm_chess$Internal$SquareDelta$e]) : (_Utils_eq(piece, $pilatch$elm_chess$Internal$Piece$blackQueen) ? _List_fromArray(
		[$pilatch$elm_chess$Internal$SquareDelta$nw, $pilatch$elm_chess$Internal$SquareDelta$ne, $pilatch$elm_chess$Internal$SquareDelta$sw, $pilatch$elm_chess$Internal$SquareDelta$se, $pilatch$elm_chess$Internal$SquareDelta$n, $pilatch$elm_chess$Internal$SquareDelta$s, $pilatch$elm_chess$Internal$SquareDelta$w, $pilatch$elm_chess$Internal$SquareDelta$e]) : (_Utils_eq(piece, $pilatch$elm_chess$Internal$Piece$blackKing) ? _List_fromArray(
		[$pilatch$elm_chess$Internal$SquareDelta$nw, $pilatch$elm_chess$Internal$SquareDelta$ne, $pilatch$elm_chess$Internal$SquareDelta$sw, $pilatch$elm_chess$Internal$SquareDelta$se, $pilatch$elm_chess$Internal$SquareDelta$n, $pilatch$elm_chess$Internal$SquareDelta$s, $pilatch$elm_chess$Internal$SquareDelta$w, $pilatch$elm_chess$Internal$SquareDelta$e]) : _List_Nil)))))))))));
};
var $pilatch$elm_chess$Internal$PieceType$isSlider = function (kind) {
	return _Utils_eq(kind, $pilatch$elm_chess$Internal$PieceType$bishop) || (_Utils_eq(kind, $pilatch$elm_chess$Internal$PieceType$rook) || _Utils_eq(kind, $pilatch$elm_chess$Internal$PieceType$queen));
};
var $pilatch$elm_chess$Internal$Piece$isSlider = A2($elm$core$Basics$composeR, $pilatch$elm_chess$Internal$Piece$kind, $pilatch$elm_chess$Internal$PieceType$isSlider);
var $pilatch$elm_chess$Internal$BoardDimensions$squareMax = $pilatch$elm_chess$Internal$BoardDimensions$fileMax + ($pilatch$elm_chess$Internal$BoardDimensions$rankMax * $pilatch$elm_chess$Internal$BoardDimensions$extendedFileCount);
var $pilatch$elm_chess$Internal$BoardDimensions$squareMin = $pilatch$elm_chess$Internal$BoardDimensions$fileMin + ($pilatch$elm_chess$Internal$BoardDimensions$rankMin * $pilatch$elm_chess$Internal$BoardDimensions$extendedFileCount);
var $pilatch$elm_chess$Internal$SquareDelta$max = $pilatch$elm_chess$Internal$BoardDimensions$squareMax - $pilatch$elm_chess$Internal$BoardDimensions$squareMin;
var $pilatch$elm_chess$Internal$SquareFile$isOutside = function (file) {
	return (_Utils_cmp(
		$pilatch$elm_chess$Internal$SquareFile$unwrap(file),
		$pilatch$elm_chess$Internal$BoardDimensions$fileMin) < 0) || (_Utils_cmp(
		$pilatch$elm_chess$Internal$SquareFile$unwrap(file),
		$pilatch$elm_chess$Internal$BoardDimensions$fileMax) > 0);
};
var $pilatch$elm_chess$Internal$SquareRank$isOutside = function (rank) {
	return (_Utils_cmp(
		$pilatch$elm_chess$Internal$SquareRank$unwrap(rank),
		$pilatch$elm_chess$Internal$BoardDimensions$rankMin) < 0) || (_Utils_cmp(
		$pilatch$elm_chess$Internal$SquareRank$unwrap(rank),
		$pilatch$elm_chess$Internal$BoardDimensions$rankMax) > 0);
};
var $pilatch$elm_chess$Internal$Square$isOutside = function (square) {
	return $pilatch$elm_chess$Internal$SquareFile$isOutside(
		$pilatch$elm_chess$Internal$Square$file(square)) || $pilatch$elm_chess$Internal$SquareRank$isOutside(
		$pilatch$elm_chess$Internal$Square$rank(square));
};
var $pilatch$elm_chess$Internal$Square$squaresInDirection = F2(
	function (startSquare, delta_) {
		var squaresInDirectionInternal = F2(
			function (square, acc) {
				squaresInDirectionInternal:
				while (true) {
					if ($pilatch$elm_chess$Internal$Square$isOutside(square)) {
						return acc;
					} else {
						var $temp$square = A2($pilatch$elm_chess$Internal$Square$add, square, delta_),
							$temp$acc = A2($elm$core$List$cons, square, acc);
						square = $temp$square;
						acc = $temp$acc;
						continue squaresInDirectionInternal;
					}
				}
			});
		return $elm$core$List$reverse(
			A2(
				squaresInDirectionInternal,
				A2($pilatch$elm_chess$Internal$Square$add, startSquare, delta_),
				_List_Nil));
	});
var $pilatch$elm_chess$Internal$Square$deltasInDirection = F2(
	function (startSquare, delta_) {
		return A2(
			$elm$core$List$map,
			function (s) {
				return A2($pilatch$elm_chess$Internal$Square$subtract, s, startSquare);
			},
			A2($pilatch$elm_chess$Internal$Square$squaresInDirection, startSquare, delta_));
	});
var $pilatch$elm_chess$Internal$Square$possibleDeltasInDirection = function (delta_) {
	return A3(
		$elm$core$List$foldl,
		F2(
			function (sq, result) {
				var deltas = A2($pilatch$elm_chess$Internal$Square$deltasInDirection, sq, delta_);
				return (_Utils_cmp(
					$elm$core$List$length(deltas),
					$elm$core$List$length(result)) > 0) ? deltas : result;
			}),
		_List_Nil,
		$pilatch$elm_chess$Internal$Square$all);
};
var $elm$core$Array$repeat = F2(
	function (n, e) {
		return A2(
			$elm$core$Array$initialize,
			n,
			function (_v0) {
				return e;
			});
	});
var $pilatch$elm_chess$Internal$Piece$computeAttackDeltas = function (piece) {
	var deltasByDirection = A2(
		$elm$core$List$concatMap,
		function (d) {
			return $pilatch$elm_chess$Internal$Piece$isSlider(piece) ? A2(
				$elm$core$List$map,
				function (d2) {
					return _Utils_Tuple2(d, d2);
				},
				$pilatch$elm_chess$Internal$Square$possibleDeltasInDirection(d)) : _List_fromArray(
				[
					_Utils_Tuple2(d, d)
				]);
		},
		$pilatch$elm_chess$Internal$Piece$attackDirections(piece));
	var deltaMax = $pilatch$elm_chess$Internal$SquareDelta$unwrap($pilatch$elm_chess$Internal$SquareDelta$max);
	return $elm$core$Array$toList(
		A3(
			$elm$core$List$foldl,
			F2(
				function (_v0, result) {
					var d0 = _v0.a;
					var d = _v0.b;
					return A3(
						$elm$core$Array$set,
						deltaMax + $pilatch$elm_chess$Internal$SquareDelta$unwrap(d),
						$elm$core$Maybe$Just(d0),
						result);
				}),
			A2($elm$core$Array$repeat, (2 * deltaMax) + 1, $elm$core$Maybe$Nothing),
			deltasByDirection));
};
var $pilatch$elm_chess$Internal$Piece$attackDeltas = $elm$core$Array$fromList(
	A2(
		$elm$core$List$concatMap,
		$pilatch$elm_chess$Internal$Piece$computeAttackDeltas,
		A2(
			$elm$core$List$map,
			$elm$core$Basics$identity,
			A2(
				$elm$core$List$range,
				0,
				$pilatch$elm_chess$Internal$Piece$unwrap($pilatch$elm_chess$Internal$Piece$blackKing)))));
var $pilatch$elm_chess$Internal$Piece$attackDelta = F3(
	function (piece, from, to) {
		var deltaMax = $pilatch$elm_chess$Internal$SquareDelta$unwrap($pilatch$elm_chess$Internal$SquareDelta$max);
		return A2(
			$elm$core$Maybe$withDefault,
			$elm$core$Maybe$Nothing,
			A2(
				$elm$core$Array$get,
				((($pilatch$elm_chess$Internal$Piece$unwrap(piece) * ((2 * deltaMax) + 1)) + $pilatch$elm_chess$Internal$Square$unwrap(to)) - $pilatch$elm_chess$Internal$Square$unwrap(from)) + deltaMax,
				$pilatch$elm_chess$Internal$Piece$attackDeltas));
	});
var $pilatch$elm_chess$Internal$Board$lineIsClear = F4(
	function (board, square0, square1, delta) {
		var lineIsClearInternal = F2(
			function (s0, s1) {
				return _Utils_eq(s0, square1) || (_Utils_eq(
					A2($pilatch$elm_chess$Internal$Board$pieceOn, s0, board),
					$pilatch$elm_chess$Internal$Piece$empty) && A2(
					lineIsClearInternal,
					A2($pilatch$elm_chess$Internal$Square$add, s0, delta),
					s1));
			});
		return A2(
			lineIsClearInternal,
			A2($pilatch$elm_chess$Internal$Square$add, square0, delta),
			square1);
	});
var $pilatch$elm_chess$Internal$Board$pieceAttacksSquare = F3(
	function (from, to, board) {
		var piece = A2($pilatch$elm_chess$Internal$Board$pieceOn, from, board);
		var _v0 = A3($pilatch$elm_chess$Internal$Piece$attackDelta, piece, from, to);
		if (_v0.$ === 1) {
			return false;
		} else {
			var delta = _v0.a;
			return $pilatch$elm_chess$Internal$Piece$isSlider(piece) ? A4($pilatch$elm_chess$Internal$Board$lineIsClear, board, from, to, delta) : true;
		}
	});
var $pilatch$elm_chess$Internal$Board$sideAttacksSquare = F3(
	function (side, square, board) {
		return A2(
			$elm$core$List$any,
			function (s) {
				return _Utils_eq(
					$pilatch$elm_chess$Internal$Piece$color(
						A2($pilatch$elm_chess$Internal$Board$pieceOn, s, board)),
					side) && A3($pilatch$elm_chess$Internal$Board$pieceAttacksSquare, s, square, board);
			},
			$pilatch$elm_chess$Internal$Square$all);
	});
var $pilatch$elm_chess$Internal$Position$sideAttacksSquare = F3(
	function (side, square, position) {
		return A3(
			$pilatch$elm_chess$Internal$Board$sideAttacksSquare,
			side,
			square,
			$pilatch$elm_chess$Internal$Position$unwrap(position).bD);
	});
var $pilatch$elm_chess$Internal$Position$isInCheck = F2(
	function (side, position) {
		var _v0 = A2($pilatch$elm_chess$Internal$Position$kingSquare, side, position);
		if (_v0.$ === 1) {
			return false;
		} else {
			var kingSquare_ = _v0.a;
			return A3(
				$pilatch$elm_chess$Internal$Position$sideAttacksSquare,
				$pilatch$elm_chess$Internal$PieceColor$opposite(side),
				kingSquare_,
				position);
		}
	});
var $pilatch$elm_chess$Internal$Position$isCheck = function (position) {
	return A2(
		$pilatch$elm_chess$Internal$Position$isInCheck,
		$pilatch$elm_chess$Internal$Position$sideToMove(position),
		position);
};
var $pilatch$elm_chess$Internal$Position$moveGivesCheck = F2(
	function (move, position) {
		return $pilatch$elm_chess$Internal$Position$isCheck(
			A2($pilatch$elm_chess$Internal$Position$doMove, move, position));
	});
var $elm$core$Basics$not = _Basics_not;
var $pilatch$elm_chess$Internal$Position$pseudoMoveIsLegal = F2(
	function (position, move) {
		return !A2(
			$pilatch$elm_chess$Internal$Position$isInCheck,
			$pilatch$elm_chess$Internal$Position$sideToMove(position),
			A2($pilatch$elm_chess$Internal$Position$doMove, move, position));
	});
var $pilatch$elm_chess$Internal$Board$isEmpty = F2(
	function (square, board) {
		return _Utils_eq(
			A2($pilatch$elm_chess$Internal$Board$pieceOn, square, board),
			$pilatch$elm_chess$Internal$Piece$empty);
	});
var $pilatch$elm_chess$Internal$Position$isEmpty = F2(
	function (square, pos) {
		return A2(
			$pilatch$elm_chess$Internal$Board$isEmpty,
			square,
			$pilatch$elm_chess$Internal$Position$unwrap(pos).bD);
	});
var $pilatch$elm_chess$Internal$Move$Move = $elm$core$Basics$identity;
var $pilatch$elm_chess$Internal$Square$compress = function (square) {
	var r = ($pilatch$elm_chess$Internal$Square$unwrap(square) / $pilatch$elm_chess$Internal$BoardDimensions$extendedFileCount) | 0;
	var f = A2(
		$elm$core$Basics$modBy,
		$pilatch$elm_chess$Internal$BoardDimensions$extendedFileCount,
		$pilatch$elm_chess$Internal$Square$unwrap(square));
	return (f - $pilatch$elm_chess$Internal$BoardDimensions$fileMin) + ($pilatch$elm_chess$Internal$BoardDimensions$fileCount * (r - $pilatch$elm_chess$Internal$BoardDimensions$rankMin));
};
var $pilatch$elm_chess$Internal$Move$make = F2(
	function (from_, to_) {
		return $pilatch$elm_chess$Internal$Square$compress(to_) | ($pilatch$elm_chess$Internal$Square$compress(from_) << 6);
	});
var $pilatch$elm_chess$Internal$Position$slidePseudoMovesFrom = F3(
	function (from, position, delta) {
		var us = $pilatch$elm_chess$Internal$Position$sideToMove(position);
		var them = $pilatch$elm_chess$Internal$PieceColor$opposite(us);
		var slidePseudoMovesFromInternal = F2(
			function (to, result) {
				slidePseudoMovesFromInternal:
				while (true) {
					if (A2($pilatch$elm_chess$Internal$Position$isEmpty, to, position)) {
						var $temp$to = A2($pilatch$elm_chess$Internal$Square$add, to, delta),
							$temp$result = A2(
							$elm$core$List$cons,
							A2($pilatch$elm_chess$Internal$Move$make, from, to),
							result);
						to = $temp$to;
						result = $temp$result;
						continue slidePseudoMovesFromInternal;
					} else {
						if (_Utils_eq(
							$pilatch$elm_chess$Internal$Piece$color(
								A2($pilatch$elm_chess$Internal$Position$pieceOn, to, position)),
							them)) {
							return A2(
								$elm$core$List$cons,
								A2($pilatch$elm_chess$Internal$Move$make, from, to),
								result);
						} else {
							return result;
						}
					}
				}
			});
		return A2(
			slidePseudoMovesFromInternal,
			A2($pilatch$elm_chess$Internal$Square$add, from, delta),
			_List_Nil);
	});
var $pilatch$elm_chess$Internal$Position$bishopPseudoMovesFrom = F2(
	function (square, position) {
		return A2(
			$elm$core$List$concatMap,
			A2($pilatch$elm_chess$Internal$Position$slidePseudoMovesFrom, square, position),
			$pilatch$elm_chess$Internal$Piece$attackDirections($pilatch$elm_chess$Internal$Piece$whiteBishop));
	});
var $pilatch$elm_chess$Internal$CastleRights$canCastleKingside = F2(
	function (color, rights) {
		return !(!($pilatch$elm_chess$Internal$CastleRights$unwrap(rights) & (1 << (2 * $pilatch$elm_chess$Internal$PieceColor$unwrap(color)))));
	});
var $pilatch$elm_chess$Internal$Position$canCastleKingside = F2(
	function (side, position) {
		return A2(
			$pilatch$elm_chess$Internal$CastleRights$canCastleKingside,
			side,
			$pilatch$elm_chess$Internal$Position$unwrap(position).ak);
	});
var $pilatch$elm_chess$Internal$CastleRights$canCastleQueenside = F2(
	function (color, rights) {
		return !(!($pilatch$elm_chess$Internal$CastleRights$unwrap(rights) & (1 << ((2 * $pilatch$elm_chess$Internal$PieceColor$unwrap(color)) + 1))));
	});
var $pilatch$elm_chess$Internal$Position$canCastleQueenside = F2(
	function (side, position) {
		return A2(
			$pilatch$elm_chess$Internal$CastleRights$canCastleQueenside,
			side,
			$pilatch$elm_chess$Internal$Position$unwrap(position).ak);
	});
var $pilatch$elm_chess$Internal$Move$makeCastle = F2(
	function (from_, to_) {
		return ($pilatch$elm_chess$Internal$Square$compress(to_) | ($pilatch$elm_chess$Internal$Square$compress(from_) << 6)) | (1 << 15);
	});
var $pilatch$elm_chess$Internal$Position$kingCastlePseudoMovesFrom = F4(
	function (us, them, square, position) {
		return _Utils_ap(
			function () {
				if (A2($pilatch$elm_chess$Internal$Position$canCastleKingside, us, position)) {
					var f1 = A2($pilatch$elm_chess$Internal$Square$add, square, $pilatch$elm_chess$Internal$SquareDelta$e);
					var g1 = A2($pilatch$elm_chess$Internal$Square$add, f1, $pilatch$elm_chess$Internal$SquareDelta$e);
					return (A2($pilatch$elm_chess$Internal$Position$isEmpty, f1, position) && (A2($pilatch$elm_chess$Internal$Position$isEmpty, g1, position) && ((!A3($pilatch$elm_chess$Internal$Position$sideAttacksSquare, them, square, position)) && ((!A3($pilatch$elm_chess$Internal$Position$sideAttacksSquare, them, f1, position)) && (!A3($pilatch$elm_chess$Internal$Position$sideAttacksSquare, them, g1, position)))))) ? _List_fromArray(
						[
							A2($pilatch$elm_chess$Internal$Move$makeCastle, square, g1)
						]) : _List_Nil;
				} else {
					return _List_Nil;
				}
			}(),
			function () {
				if (A2($pilatch$elm_chess$Internal$Position$canCastleQueenside, us, position)) {
					var d1 = A2($pilatch$elm_chess$Internal$Square$add, square, $pilatch$elm_chess$Internal$SquareDelta$w);
					var c1 = A2($pilatch$elm_chess$Internal$Square$add, d1, $pilatch$elm_chess$Internal$SquareDelta$w);
					var b1 = A2($pilatch$elm_chess$Internal$Square$add, c1, $pilatch$elm_chess$Internal$SquareDelta$w);
					return (A2($pilatch$elm_chess$Internal$Position$isEmpty, d1, position) && (A2($pilatch$elm_chess$Internal$Position$isEmpty, c1, position) && (A2($pilatch$elm_chess$Internal$Position$isEmpty, b1, position) && ((!A3($pilatch$elm_chess$Internal$Position$sideAttacksSquare, them, square, position)) && ((!A3($pilatch$elm_chess$Internal$Position$sideAttacksSquare, them, d1, position)) && (!A3($pilatch$elm_chess$Internal$Position$sideAttacksSquare, them, c1, position))))))) ? _List_fromArray(
						[
							A2($pilatch$elm_chess$Internal$Move$makeCastle, square, c1)
						]) : _List_Nil;
				} else {
					return _List_Nil;
				}
			}());
	});
var $pilatch$elm_chess$Internal$Position$kingPseudoMovesFrom = F2(
	function (square, position) {
		var us = $pilatch$elm_chess$Internal$Position$sideToMove(position);
		var them = $pilatch$elm_chess$Internal$PieceColor$opposite(us);
		return _Utils_ap(
			A2(
				$elm$core$List$map,
				function (to) {
					return A2($pilatch$elm_chess$Internal$Move$make, square, to);
				},
				A2(
					$elm$core$List$filter,
					function (s) {
						return A2($pilatch$elm_chess$Internal$Position$isEmpty, s, position) || _Utils_eq(
							$pilatch$elm_chess$Internal$Piece$color(
								A2($pilatch$elm_chess$Internal$Position$pieceOn, s, position)),
							them);
					},
					A2(
						$elm$core$List$map,
						$pilatch$elm_chess$Internal$Square$add(square),
						$pilatch$elm_chess$Internal$Piece$attackDirections($pilatch$elm_chess$Internal$Piece$whiteKing)))),
			A4($pilatch$elm_chess$Internal$Position$kingCastlePseudoMovesFrom, us, them, square, position));
	});
var $pilatch$elm_chess$Internal$Position$knightPseudoMovesFrom = F2(
	function (square, position) {
		var them = $pilatch$elm_chess$Internal$PieceColor$opposite(
			$pilatch$elm_chess$Internal$Position$sideToMove(position));
		return A2(
			$elm$core$List$map,
			function (to) {
				return A2($pilatch$elm_chess$Internal$Move$make, square, to);
			},
			A2(
				$elm$core$List$filter,
				function (s) {
					return A2($pilatch$elm_chess$Internal$Position$isEmpty, s, position) || _Utils_eq(
						$pilatch$elm_chess$Internal$Piece$color(
							A2($pilatch$elm_chess$Internal$Position$pieceOn, s, position)),
						them);
				},
				A2(
					$elm$core$List$map,
					$pilatch$elm_chess$Internal$Square$add(square),
					$pilatch$elm_chess$Internal$Piece$attackDirections($pilatch$elm_chess$Internal$Piece$whiteKnight))));
	});
var $pilatch$elm_chess$Internal$Position$colorOn = F2(
	function (square, pos) {
		return $pilatch$elm_chess$Internal$Piece$color(
			A2($pilatch$elm_chess$Internal$Position$pieceOn, square, pos));
	});
var $pilatch$elm_chess$Internal$Square$isRankTwo = F2(
	function (square, color) {
		return _Utils_eq(color, $pilatch$elm_chess$Internal$PieceColor$white) ? _Utils_eq(
			$pilatch$elm_chess$Internal$SquareRank$unwrap(
				$pilatch$elm_chess$Internal$Square$rank(square)),
			$pilatch$elm_chess$Internal$BoardDimensions$rankMin + 1) : _Utils_eq(
			$pilatch$elm_chess$Internal$SquareRank$unwrap(
				$pilatch$elm_chess$Internal$Square$rank(square)),
			$pilatch$elm_chess$Internal$BoardDimensions$rankMax - 1);
	});
var $pilatch$elm_chess$Internal$Move$makePromotion = F3(
	function (from_, to_, promotion_) {
		return ($pilatch$elm_chess$Internal$Square$compress(to_) | ($pilatch$elm_chess$Internal$Square$compress(from_) << 6)) | ($pilatch$elm_chess$Internal$PieceType$unwrap(promotion_) << 12);
	});
var $pilatch$elm_chess$Internal$Position$pawnCaptures = F4(
	function (us, them, square, position) {
		var ds = _Utils_eq(us, $pilatch$elm_chess$Internal$PieceColor$white) ? _List_fromArray(
			[$pilatch$elm_chess$Internal$SquareDelta$nw, $pilatch$elm_chess$Internal$SquareDelta$ne]) : _List_fromArray(
			[$pilatch$elm_chess$Internal$SquareDelta$sw, $pilatch$elm_chess$Internal$SquareDelta$se]);
		var toSqs = A2(
			$elm$core$List$filter,
			function (s) {
				return _Utils_eq(
					A2($pilatch$elm_chess$Internal$Position$colorOn, s, position),
					them);
			},
			A2(
				$elm$core$List$map,
				$pilatch$elm_chess$Internal$Square$add(square),
				ds));
		return A2($pilatch$elm_chess$Internal$Square$isRankTwo, square, them) ? A2(
			$elm$core$List$concatMap,
			function (to) {
				return A2(
					$elm$core$List$map,
					A2($pilatch$elm_chess$Internal$Move$makePromotion, square, to),
					_List_fromArray(
						[$pilatch$elm_chess$Internal$PieceType$queen, $pilatch$elm_chess$Internal$PieceType$rook, $pilatch$elm_chess$Internal$PieceType$bishop, $pilatch$elm_chess$Internal$PieceType$knight]));
			},
			toSqs) : A2(
			$elm$core$List$map,
			$pilatch$elm_chess$Internal$Move$make(square),
			toSqs);
	});
var $pilatch$elm_chess$Internal$Position$epSquare = function (position) {
	return $pilatch$elm_chess$Internal$Position$unwrap(position).a0;
};
var $pilatch$elm_chess$Internal$Move$makeEp = F2(
	function (from_, to_) {
		return ($pilatch$elm_chess$Internal$Square$compress(to_) | ($pilatch$elm_chess$Internal$Square$compress(from_) << 6)) | (1 << 16);
	});
var $pilatch$elm_chess$Internal$Position$pawnEpCaptures = F4(
	function (us, them, square, position) {
		var _v0 = $pilatch$elm_chess$Internal$Position$epSquare(position);
		if (_v0.$ === 1) {
			return _List_Nil;
		} else {
			var epSquare_ = _v0.a;
			var ds = _Utils_eq(us, $pilatch$elm_chess$Internal$PieceColor$white) ? _List_fromArray(
				[$pilatch$elm_chess$Internal$SquareDelta$nw, $pilatch$elm_chess$Internal$SquareDelta$ne]) : _List_fromArray(
				[$pilatch$elm_chess$Internal$SquareDelta$sw, $pilatch$elm_chess$Internal$SquareDelta$se]);
			return A2(
				$elm$core$List$map,
				$pilatch$elm_chess$Internal$Move$makeEp(square),
				A2(
					$elm$core$List$filter,
					$elm$core$Basics$eq(epSquare_),
					A2(
						$elm$core$List$map,
						$pilatch$elm_chess$Internal$Square$add(square),
						ds)));
		}
	});
var $pilatch$elm_chess$Internal$Position$pawnPushes = F4(
	function (us, them, square, position) {
		var push = _Utils_eq(us, $pilatch$elm_chess$Internal$PieceColor$white) ? $pilatch$elm_chess$Internal$SquareDelta$n : $pilatch$elm_chess$Internal$SquareDelta$s;
		var doublePush = A2($pilatch$elm_chess$Internal$SquareDelta$multiply, 2, push);
		return (!A2(
			$pilatch$elm_chess$Internal$Position$isEmpty,
			A2($pilatch$elm_chess$Internal$Square$add, square, push),
			position)) ? _List_Nil : (A2($pilatch$elm_chess$Internal$Square$isRankTwo, square, them) ? A2(
			$elm$core$List$map,
			A2(
				$pilatch$elm_chess$Internal$Move$makePromotion,
				square,
				A2($pilatch$elm_chess$Internal$Square$add, square, push)),
			_List_fromArray(
				[$pilatch$elm_chess$Internal$PieceType$queen, $pilatch$elm_chess$Internal$PieceType$rook, $pilatch$elm_chess$Internal$PieceType$bishop, $pilatch$elm_chess$Internal$PieceType$knight])) : (A2($pilatch$elm_chess$Internal$Square$isRankTwo, square, us) ? _Utils_ap(
			_List_fromArray(
				[
					A2(
					$pilatch$elm_chess$Internal$Move$make,
					square,
					A2($pilatch$elm_chess$Internal$Square$add, square, push))
				]),
			(!A2(
				$pilatch$elm_chess$Internal$Position$isEmpty,
				A2($pilatch$elm_chess$Internal$Square$add, square, doublePush),
				position)) ? _List_Nil : _List_fromArray(
				[
					A2(
					$pilatch$elm_chess$Internal$Move$make,
					square,
					A2($pilatch$elm_chess$Internal$Square$add, square, doublePush))
				])) : _List_fromArray(
			[
				A2(
				$pilatch$elm_chess$Internal$Move$make,
				square,
				A2($pilatch$elm_chess$Internal$Square$add, square, push))
			])));
	});
var $pilatch$elm_chess$Internal$Position$pawnPseudoMovesFrom = F2(
	function (square, position) {
		var us = $pilatch$elm_chess$Internal$Position$sideToMove(position);
		var them = $pilatch$elm_chess$Internal$PieceColor$opposite(us);
		return _Utils_ap(
			A4($pilatch$elm_chess$Internal$Position$pawnPushes, us, them, square, position),
			_Utils_ap(
				A4($pilatch$elm_chess$Internal$Position$pawnCaptures, us, them, square, position),
				A4($pilatch$elm_chess$Internal$Position$pawnEpCaptures, us, them, square, position)));
	});
var $pilatch$elm_chess$Internal$Position$queenPseudoMovesFrom = F2(
	function (square, position) {
		return A2(
			$elm$core$List$concatMap,
			A2($pilatch$elm_chess$Internal$Position$slidePseudoMovesFrom, square, position),
			$pilatch$elm_chess$Internal$Piece$attackDirections($pilatch$elm_chess$Internal$Piece$whiteQueen));
	});
var $pilatch$elm_chess$Internal$Position$rookPseudoMovesFrom = F2(
	function (square, position) {
		return A2(
			$elm$core$List$concatMap,
			A2($pilatch$elm_chess$Internal$Position$slidePseudoMovesFrom, square, position),
			$pilatch$elm_chess$Internal$Piece$attackDirections($pilatch$elm_chess$Internal$Piece$whiteRook));
	});
var $pilatch$elm_chess$Internal$Position$pseudoMovesFrom = F2(
	function (square, position) {
		var piece = A2($pilatch$elm_chess$Internal$Position$pieceOn, square, position);
		return (!_Utils_eq(
			$pilatch$elm_chess$Internal$Piece$color(piece),
			$pilatch$elm_chess$Internal$Position$sideToMove(position))) ? _List_Nil : (_Utils_eq(
			$pilatch$elm_chess$Internal$Piece$kind(piece),
			$pilatch$elm_chess$Internal$PieceType$pawn) ? A2($pilatch$elm_chess$Internal$Position$pawnPseudoMovesFrom, square, position) : (_Utils_eq(
			$pilatch$elm_chess$Internal$Piece$kind(piece),
			$pilatch$elm_chess$Internal$PieceType$knight) ? A2($pilatch$elm_chess$Internal$Position$knightPseudoMovesFrom, square, position) : (_Utils_eq(
			$pilatch$elm_chess$Internal$Piece$kind(piece),
			$pilatch$elm_chess$Internal$PieceType$bishop) ? A2($pilatch$elm_chess$Internal$Position$bishopPseudoMovesFrom, square, position) : (_Utils_eq(
			$pilatch$elm_chess$Internal$Piece$kind(piece),
			$pilatch$elm_chess$Internal$PieceType$rook) ? A2($pilatch$elm_chess$Internal$Position$rookPseudoMovesFrom, square, position) : (_Utils_eq(
			$pilatch$elm_chess$Internal$Piece$kind(piece),
			$pilatch$elm_chess$Internal$PieceType$queen) ? A2($pilatch$elm_chess$Internal$Position$queenPseudoMovesFrom, square, position) : (_Utils_eq(
			$pilatch$elm_chess$Internal$Piece$kind(piece),
			$pilatch$elm_chess$Internal$PieceType$king) ? A2($pilatch$elm_chess$Internal$Position$kingPseudoMovesFrom, square, position) : _List_Nil))))));
	});
var $pilatch$elm_chess$Internal$Position$movesFrom = F2(
	function (square, position) {
		return A2(
			$elm$core$List$filter,
			$pilatch$elm_chess$Internal$Position$pseudoMoveIsLegal(position),
			A2($pilatch$elm_chess$Internal$Position$pseudoMovesFrom, square, position));
	});
var $pilatch$elm_chess$Internal$Position$moves = function (position) {
	return A2(
		$elm$core$List$concatMap,
		function (s) {
			return A2($pilatch$elm_chess$Internal$Position$movesFrom, s, position);
		},
		$pilatch$elm_chess$Internal$Square$all);
};
var $pilatch$elm_chess$Internal$Position$isCheckmate = function (position) {
	return $pilatch$elm_chess$Internal$Position$isCheck(position) && (!$elm$core$List$length(
		$pilatch$elm_chess$Internal$Position$moves(position)));
};
var $pilatch$elm_chess$Internal$Position$moveGivesCheckmate = F2(
	function (move, position) {
		return $pilatch$elm_chess$Internal$Position$isCheckmate(
			A2($pilatch$elm_chess$Internal$Position$doMove, move, position));
	});
var $pilatch$elm_chess$Internal$PieceType$toChar = function (kind) {
	return _Utils_eq(kind, $pilatch$elm_chess$Internal$PieceType$pawn) ? 'P' : (_Utils_eq(kind, $pilatch$elm_chess$Internal$PieceType$knight) ? 'N' : (_Utils_eq(kind, $pilatch$elm_chess$Internal$PieceType$bishop) ? 'B' : (_Utils_eq(kind, $pilatch$elm_chess$Internal$PieceType$rook) ? 'R' : (_Utils_eq(kind, $pilatch$elm_chess$Internal$PieceType$queen) ? 'Q' : (_Utils_eq(kind, $pilatch$elm_chess$Internal$PieceType$king) ? 'K' : '?')))));
};
var $pilatch$elm_chess$Internal$PieceType$toString = A2($elm$core$Basics$composeR, $pilatch$elm_chess$Internal$PieceType$toChar, $elm$core$String$fromChar);
var $elm$core$Char$fromCode = _Char_fromCode;
var $pilatch$elm_chess$Internal$SquareFile$toChar = function (file) {
	return $elm$core$Char$fromCode(
		($pilatch$elm_chess$Internal$SquareFile$unwrap(file) - $pilatch$elm_chess$Internal$BoardDimensions$fileMin) + $elm$core$Char$toCode('a'));
};
var $pilatch$elm_chess$Internal$SquareFile$toString = A2($elm$core$Basics$composeR, $pilatch$elm_chess$Internal$SquareFile$toChar, $elm$core$String$fromChar);
var $pilatch$elm_chess$Internal$SquareRank$toChar = function (rank) {
	return $elm$core$Char$fromCode(
		($pilatch$elm_chess$Internal$SquareRank$unwrap(rank) - $pilatch$elm_chess$Internal$BoardDimensions$rankMin) + $elm$core$Char$toCode('1'));
};
var $pilatch$elm_chess$Internal$SquareRank$toString = A2($elm$core$Basics$composeR, $pilatch$elm_chess$Internal$SquareRank$toChar, $elm$core$String$fromChar);
var $pilatch$elm_chess$Internal$Square$toString = function (square) {
	return _Utils_ap(
		$pilatch$elm_chess$Internal$SquareFile$toString(
			$pilatch$elm_chess$Internal$Square$file(square)),
		$pilatch$elm_chess$Internal$SquareRank$toString(
			$pilatch$elm_chess$Internal$Square$rank(square)));
};
var $elm$core$String$toUpper = _String_toUpper;
var $pilatch$elm_chess$Internal$Notation$pawnMoveToSan = F2(
	function (move, position) {
		var to = $pilatch$elm_chess$Internal$Move$to(move);
		var promotion = $pilatch$elm_chess$Internal$Move$promotion(move);
		var from = $pilatch$elm_chess$Internal$Move$from(move);
		return _Utils_ap(
			(!_Utils_eq(
				$pilatch$elm_chess$Internal$Square$file(from),
				$pilatch$elm_chess$Internal$Square$file(to))) ? ($pilatch$elm_chess$Internal$SquareFile$toString(
				$pilatch$elm_chess$Internal$Square$file(from)) + 'x') : '',
			_Utils_ap(
				$pilatch$elm_chess$Internal$Square$toString(to),
				function () {
					if (promotion.$ === 1) {
						return '';
					} else {
						var promotion_ = promotion.a;
						return '=' + $elm$core$String$toUpper(
							$pilatch$elm_chess$Internal$PieceType$toString(promotion_));
					}
				}()));
	});
var $elm$core$List$all = F2(
	function (isOkay, list) {
		return !A2(
			$elm$core$List$any,
			A2($elm$core$Basics$composeL, $elm$core$Basics$not, isOkay),
			list);
	});
var $pilatch$elm_chess$Internal$Notation$differentFileFrom = F2(
	function (m1, m2) {
		return _Utils_eq(m1, m2) || (!_Utils_eq(
			$pilatch$elm_chess$Internal$Square$file(
				$pilatch$elm_chess$Internal$Move$from(m1)),
			$pilatch$elm_chess$Internal$Square$file(
				$pilatch$elm_chess$Internal$Move$from(m2))));
	});
var $pilatch$elm_chess$Internal$Notation$differentRankFrom = F2(
	function (m1, m2) {
		return _Utils_eq(m1, m2) || (!_Utils_eq(
			$pilatch$elm_chess$Internal$Square$rank(
				$pilatch$elm_chess$Internal$Move$from(m1)),
			$pilatch$elm_chess$Internal$Square$rank(
				$pilatch$elm_chess$Internal$Move$from(m2))));
	});
var $pilatch$elm_chess$Internal$Position$pawnCapturePseudoMovesTo = F3(
	function (us, to, position) {
		var them = $pilatch$elm_chess$Internal$PieceColor$opposite(us);
		var ourPawn = A2($pilatch$elm_chess$Internal$Piece$make, us, $pilatch$elm_chess$Internal$PieceType$pawn);
		var ds = _Utils_eq(us, $pilatch$elm_chess$Internal$PieceColor$white) ? _List_fromArray(
			[$pilatch$elm_chess$Internal$SquareDelta$sw, $pilatch$elm_chess$Internal$SquareDelta$se]) : _List_fromArray(
			[$pilatch$elm_chess$Internal$SquareDelta$nw, $pilatch$elm_chess$Internal$SquareDelta$ne]);
		return A2(
			$elm$core$List$concatMap,
			function (from) {
				return A2($pilatch$elm_chess$Internal$Square$isRankTwo, from, them) ? A2(
					$elm$core$List$map,
					A2($pilatch$elm_chess$Internal$Move$makePromotion, from, to),
					_List_fromArray(
						[$pilatch$elm_chess$Internal$PieceType$queen, $pilatch$elm_chess$Internal$PieceType$rook, $pilatch$elm_chess$Internal$PieceType$bishop, $pilatch$elm_chess$Internal$PieceType$knight])) : _List_fromArray(
					[
						A2($pilatch$elm_chess$Internal$Move$make, from, to)
					]);
			},
			A2(
				$elm$core$List$filter,
				function (s) {
					return _Utils_eq(
						A2($pilatch$elm_chess$Internal$Position$pieceOn, s, position),
						ourPawn);
				},
				A2(
					$elm$core$List$map,
					$pilatch$elm_chess$Internal$Square$add(to),
					ds)));
	});
var $pilatch$elm_chess$Internal$Position$pawnEpCapturePseudoMoves = F3(
	function (us, to, position) {
		var _v0 = $pilatch$elm_chess$Internal$Position$epSquare(position);
		if (_v0.$ === 1) {
			return _List_Nil;
		} else {
			var epSquare_ = _v0.a;
			if (!_Utils_eq(epSquare_, to)) {
				return _List_Nil;
			} else {
				var ourPawn = A2($pilatch$elm_chess$Internal$Piece$make, us, $pilatch$elm_chess$Internal$PieceType$pawn);
				var ds = _Utils_eq(us, $pilatch$elm_chess$Internal$PieceColor$white) ? _List_fromArray(
					[$pilatch$elm_chess$Internal$SquareDelta$sw, $pilatch$elm_chess$Internal$SquareDelta$se]) : _List_fromArray(
					[$pilatch$elm_chess$Internal$SquareDelta$nw, $pilatch$elm_chess$Internal$SquareDelta$ne]);
				return A2(
					$elm$core$List$map,
					function (from) {
						return A2($pilatch$elm_chess$Internal$Move$makeEp, from, to);
					},
					A2(
						$elm$core$List$filter,
						function (s) {
							return _Utils_eq(
								A2($pilatch$elm_chess$Internal$Position$pieceOn, s, position),
								ourPawn);
						},
						A2(
							$elm$core$List$map,
							$pilatch$elm_chess$Internal$Square$add(to),
							ds)));
			}
		}
	});
var $pilatch$elm_chess$Internal$Position$pawnPushPseudoMovesTo = F3(
	function (us, to, position) {
		var them = $pilatch$elm_chess$Internal$PieceColor$opposite(us);
		var push = _Utils_eq(us, $pilatch$elm_chess$Internal$PieceColor$white) ? $pilatch$elm_chess$Internal$SquareDelta$s : $pilatch$elm_chess$Internal$SquareDelta$n;
		var ourPawn = A2($pilatch$elm_chess$Internal$Piece$make, us, $pilatch$elm_chess$Internal$PieceType$pawn);
		var from = A2($pilatch$elm_chess$Internal$Square$add, to, push);
		if (_Utils_eq(
			A2($pilatch$elm_chess$Internal$Position$pieceOn, from, position),
			ourPawn)) {
			return A2($pilatch$elm_chess$Internal$Square$isRankTwo, from, them) ? A2(
				$elm$core$List$map,
				A2($pilatch$elm_chess$Internal$Move$makePromotion, from, to),
				_List_fromArray(
					[$pilatch$elm_chess$Internal$PieceType$queen, $pilatch$elm_chess$Internal$PieceType$rook, $pilatch$elm_chess$Internal$PieceType$bishop, $pilatch$elm_chess$Internal$PieceType$knight])) : _List_fromArray(
				[
					A2($pilatch$elm_chess$Internal$Move$make, from, to)
				]);
		} else {
			if (A2($pilatch$elm_chess$Internal$Position$isEmpty, from, position)) {
				var from2 = A2($pilatch$elm_chess$Internal$Square$add, from, push);
				return (A2($pilatch$elm_chess$Internal$Square$isRankTwo, from2, us) && _Utils_eq(
					A2($pilatch$elm_chess$Internal$Position$pieceOn, from2, position),
					ourPawn)) ? _List_fromArray(
					[
						A2($pilatch$elm_chess$Internal$Move$make, from2, to)
					]) : _List_Nil;
			} else {
				return _List_Nil;
			}
		}
	});
var $pilatch$elm_chess$Internal$Position$pawnPseudoMovesTo = F3(
	function (us, to, position) {
		return _Utils_ap(
			A3($pilatch$elm_chess$Internal$Position$pawnEpCapturePseudoMoves, us, to, position),
			A2($pilatch$elm_chess$Internal$Position$isEmpty, to, position) ? A3($pilatch$elm_chess$Internal$Position$pawnPushPseudoMovesTo, us, to, position) : A3($pilatch$elm_chess$Internal$Position$pawnCapturePseudoMovesTo, us, to, position));
	});
var $pilatch$elm_chess$Internal$Board$scan = F3(
	function (board, square, delta) {
		var scanInternal = function (s) {
			scanInternal:
			while (true) {
				if (!_Utils_eq(
					A2($pilatch$elm_chess$Internal$Board$pieceOn, s, board),
					$pilatch$elm_chess$Internal$Piece$empty)) {
					return s;
				} else {
					var $temp$s = A2($pilatch$elm_chess$Internal$Square$add, s, delta);
					s = $temp$s;
					continue scanInternal;
				}
			}
		};
		return scanInternal(
			A2($pilatch$elm_chess$Internal$Square$add, square, delta));
	});
var $pilatch$elm_chess$Internal$Position$scan = F3(
	function (position, square, delta) {
		return A3(
			$pilatch$elm_chess$Internal$Board$scan,
			$pilatch$elm_chess$Internal$Position$unwrap(position).bD,
			square,
			delta);
	});
var $pilatch$elm_chess$Internal$Position$piecePseudoMovesTo = F4(
	function (us, pieceType, to, position) {
		var ourPiece = A2($pilatch$elm_chess$Internal$Piece$make, us, pieceType);
		return A2(
			$elm$core$List$map,
			function (from) {
				return A2($pilatch$elm_chess$Internal$Move$make, from, to);
			},
			A2(
				$elm$core$List$filter,
				function (s) {
					return _Utils_eq(
						A2($pilatch$elm_chess$Internal$Position$pieceOn, s, position),
						ourPiece);
				},
				A2(
					$elm$core$List$map,
					$pilatch$elm_chess$Internal$Piece$isSlider(ourPiece) ? A2($pilatch$elm_chess$Internal$Position$scan, position, to) : $pilatch$elm_chess$Internal$Square$add(to),
					$pilatch$elm_chess$Internal$Piece$attackDirections(ourPiece))));
	});
var $pilatch$elm_chess$Internal$Position$pseudoMovesTo = F3(
	function (piece, square, position) {
		var us = $pilatch$elm_chess$Internal$Position$sideToMove(position);
		var them = $pilatch$elm_chess$Internal$PieceColor$opposite(us);
		var capturedPiece = A2($pilatch$elm_chess$Internal$Position$pieceOn, square, position);
		return (!(_Utils_eq(capturedPiece, $pilatch$elm_chess$Internal$Piece$empty) || _Utils_eq(
			$pilatch$elm_chess$Internal$Piece$color(capturedPiece),
			them))) ? _List_Nil : (_Utils_eq(piece, $pilatch$elm_chess$Internal$PieceType$pawn) ? A3($pilatch$elm_chess$Internal$Position$pawnPseudoMovesTo, us, square, position) : A4($pilatch$elm_chess$Internal$Position$piecePseudoMovesTo, us, piece, square, position));
	});
var $pilatch$elm_chess$Internal$Position$movesTo = F3(
	function (piece, square, position) {
		return A2(
			$elm$core$List$filter,
			$pilatch$elm_chess$Internal$Position$pseudoMoveIsLegal(position),
			A3($pilatch$elm_chess$Internal$Position$pseudoMovesTo, piece, square, position));
	});
var $pilatch$elm_chess$Internal$Notation$disambiguation = F3(
	function (piece, move, position) {
		var moves = A3(
			$pilatch$elm_chess$Internal$Position$movesTo,
			$pilatch$elm_chess$Internal$Piece$kind(piece),
			$pilatch$elm_chess$Internal$Move$to(move),
			position);
		return ($elm$core$List$length(moves) <= 1) ? '' : (A2(
			$elm$core$List$all,
			$pilatch$elm_chess$Internal$Notation$differentFileFrom(move),
			moves) ? $pilatch$elm_chess$Internal$SquareFile$toString(
			$pilatch$elm_chess$Internal$Square$file(
				$pilatch$elm_chess$Internal$Move$from(move))) : (A2(
			$elm$core$List$all,
			$pilatch$elm_chess$Internal$Notation$differentRankFrom(move),
			moves) ? $pilatch$elm_chess$Internal$SquareRank$toString(
			$pilatch$elm_chess$Internal$Square$rank(
				$pilatch$elm_chess$Internal$Move$from(move))) : $pilatch$elm_chess$Internal$Square$toString(
			$pilatch$elm_chess$Internal$Move$from(move))));
	});
var $elm$core$Char$toLower = _Char_toLower;
var $pilatch$elm_chess$Internal$Piece$toChar = function (piece) {
	return _Utils_eq(
		$pilatch$elm_chess$Internal$Piece$color(piece),
		$pilatch$elm_chess$Internal$PieceColor$white) ? $elm$core$Char$toUpper(
		$pilatch$elm_chess$Internal$PieceType$toChar(
			$pilatch$elm_chess$Internal$Piece$kind(piece))) : $elm$core$Char$toLower(
		$pilatch$elm_chess$Internal$PieceType$toChar(
			$pilatch$elm_chess$Internal$Piece$kind(piece)));
};
var $pilatch$elm_chess$Internal$Piece$toString = A2($elm$core$Basics$composeR, $pilatch$elm_chess$Internal$Piece$toChar, $elm$core$String$fromChar);
var $pilatch$elm_chess$Internal$Notation$pieceMoveToSan = F2(
	function (move, position) {
		var piece = A2(
			$pilatch$elm_chess$Internal$Position$pieceOn,
			$pilatch$elm_chess$Internal$Move$from(move),
			position);
		return _Utils_ap(
			$elm$core$String$toUpper(
				$pilatch$elm_chess$Internal$Piece$toString(piece)),
			_Utils_ap(
				A3($pilatch$elm_chess$Internal$Notation$disambiguation, piece, move, position),
				_Utils_ap(
					A2(
						$pilatch$elm_chess$Internal$Position$isEmpty,
						$pilatch$elm_chess$Internal$Move$to(move),
						position) ? '' : 'x',
					$pilatch$elm_chess$Internal$Square$toString(
						$pilatch$elm_chess$Internal$Move$to(move)))));
	});
var $pilatch$elm_chess$Internal$Notation$toSan = F2(
	function (move, position) {
		return _Utils_ap(
			function () {
				if ($pilatch$elm_chess$Internal$Move$isKingsideCastle(move)) {
					return 'O-O';
				} else {
					if ($pilatch$elm_chess$Internal$Move$isQueensideCastle(move)) {
						return 'O-O-O';
					} else {
						var piece = A2(
							$pilatch$elm_chess$Internal$Position$pieceOn,
							$pilatch$elm_chess$Internal$Move$from(move),
							position);
						return _Utils_eq(
							$pilatch$elm_chess$Internal$Piece$kind(piece),
							$pilatch$elm_chess$Internal$PieceType$pawn) ? A2($pilatch$elm_chess$Internal$Notation$pawnMoveToSan, move, position) : A2($pilatch$elm_chess$Internal$Notation$pieceMoveToSan, move, position);
					}
				}
			}(),
			A2($pilatch$elm_chess$Internal$Position$moveGivesCheckmate, move, position) ? '#' : (A2($pilatch$elm_chess$Internal$Position$moveGivesCheck, move, position) ? '+' : ''));
	});
var $pilatch$elm_chess$Internal$Notation$variationToSan = F2(
	function (variation, position) {
		return _Utils_ap(
			_Utils_eq(
				$pilatch$elm_chess$Internal$Position$sideToMove(position),
				$pilatch$elm_chess$Internal$PieceColor$black) ? ($elm$core$String$fromInt(
				$pilatch$elm_chess$Internal$Position$moveNumber(position)) + '... ') : '',
			A3(
				$elm$core$List$foldl,
				F2(
					function (move, _v0) {
						var str = _v0.a;
						var pos = _v0.b;
						return _Utils_Tuple2(
							str + (' ' + ((_Utils_eq(
								$pilatch$elm_chess$Internal$Position$sideToMove(pos),
								$pilatch$elm_chess$Internal$PieceColor$white) ? ($elm$core$String$fromInt(
								$pilatch$elm_chess$Internal$Position$moveNumber(pos)) + '. ') : '') + A2($pilatch$elm_chess$Internal$Notation$toSan, move, pos))),
							A2($pilatch$elm_chess$Internal$Position$doMove, move, pos));
					}),
				_Utils_Tuple2('', position),
				variation).a);
	});
var $pilatch$elm_chess$Internal$Pgn$movesToString_ = function (game) {
	return A2(
		$pilatch$elm_chess$Internal$Notation$variationToSan,
		$pilatch$elm_chess$Internal$Game$moves(game),
		$pilatch$elm_chess$Internal$Game$position(
			$pilatch$elm_chess$Internal$Game$toBeginning(game)));
};
var $pilatch$elm_chess$Internal$Pgn$resultToString_ = function (game) {
	var _v0 = game.ef;
	switch (_v0) {
		case 3:
			return '*';
		case 0:
			return '1-0';
		case 1:
			return '0-1';
		default:
			return '1/2-1/2';
	}
};
var $pilatch$elm_chess$Internal$Pgn$gameToString = function (game) {
	return $pilatch$elm_chess$Internal$Pgn$headersToString_(game) + ('\n' + ($pilatch$elm_chess$Internal$Pgn$movesToString_(game) + (' ' + $pilatch$elm_chess$Internal$Pgn$resultToString_(game))));
};
var $pilatch$elm_chess$Game$toPgn = function (game) {
	var g = game;
	return $pilatch$elm_chess$Internal$Pgn$gameToString(g);
};
var $author$project$Chess$encodePGN = A2(
	$elm$core$Basics$composeR,
	$pilatch$elm_chess$Game$toEnd,
	A2($elm$core$Basics$composeR, $pilatch$elm_chess$Game$toPgn, $elm$json$Json$Encode$string));
var $author$project$Chess$gameChessMoveRelType = 'me.noordstar.game.move';
var $author$project$Chess$encodeChessMove = function (_v0) {
	var newGame = _v0.bV;
	var lastMove = _v0.M;
	var relatedTo = _v0.C;
	return $elm$json$Json$Encode$object(
		_List_fromArray(
			[
				_Utils_Tuple2(
				'pgn',
				$author$project$Chess$encodePGN(newGame)),
				_Utils_Tuple2(
				'last_move',
				$elm$json$Json$Encode$string(lastMove)),
				_Utils_Tuple2(
				'm.relates_to',
				$elm$json$Json$Encode$object(
					_List_fromArray(
						[
							_Utils_Tuple2(
							'event_id',
							$elm$json$Json$Encode$string(relatedTo)),
							_Utils_Tuple2(
							'relType',
							$elm$json$Json$Encode$string($author$project$Chess$gameChessMoveRelType))
						])))
			]));
};
var $author$project$Chess$gameId = 'me.noordstar.chess.1v1';
var $author$project$Chess$encodeInviteEvent = function (_v0) {
	var black = _v0.f;
	var white = _v0.m;
	return $elm$json$Json$Encode$object(
		_List_fromArray(
			[
				_Utils_Tuple2(
				'id',
				$elm$json$Json$Encode$string($author$project$Chess$gameId)),
				_Utils_Tuple2(
				'data',
				$elm$json$Json$Encode$object(
					_List_fromArray(
						[
							_Utils_Tuple2(
							'black',
							$elm$json$Json$Encode$string(black)),
							_Utils_Tuple2(
							'white',
							$elm$json$Json$Encode$string(white))
						])))
			]));
};
var $author$project$Chess$encodeRejectChess = $author$project$Chess$encodeAcceptChess;
var $pilatch$elm_chess$Internal$Game$forward = function (game) {
	return A2($pilatch$elm_chess$Internal$Game$goToMove, game.L + 1, game);
};
var $pilatch$elm_chess$Game$forward = function (game) {
	var g = game;
	return $pilatch$elm_chess$Internal$Game$forward(g);
};
var $author$project$Chess$gameChessMoveEventType = 'me.noordstar.game.chess.move';
var $author$project$Chess$gameInviteEventType = 'me.noordstar.game.invite';
var $pilatch$elm_chess$Internal$Game$isAtEnd = function (game) {
	return _Utils_eq(
		game.L,
		$elm$core$Array$length(game.au) - 1);
};
var $pilatch$elm_chess$Game$isAtEnd = function (game) {
	var g = game;
	return $pilatch$elm_chess$Internal$Game$isAtEnd(g);
};
var $pilatch$elm_chess$Position$movesFrom = $pilatch$elm_chess$Internal$Position$movesFrom;
var $pilatch$elm_chess$Game$position = function (game) {
	var g = game;
	return $pilatch$elm_chess$Internal$Game$position(g);
};
var $author$project$Chess$rejectChessEventType = 'me.noordstar.game.chess.reject';
var $elm$json$Json$Encode$dict = F3(
	function (toKey, toValue, dictionary) {
		return _Json_wrap(
			A3(
				$elm$core$Dict$foldl,
				F3(
					function (key, value, obj) {
						return A3(
							_Json_addField,
							toKey(key),
							toValue(value),
							obj);
					}),
				_Json_emptyObject(0),
				dictionary));
	});
var $elm$json$Json$Encode$int = _Json_wrap;
var $elm$time$Time$posixToMillis = function (_v0) {
	var millis = _v0;
	return millis;
};
var $author$project$Internal$Tools$Timestamp$encodeTimestamp = A2($elm$core$Basics$composeR, $elm$time$Time$posixToMillis, $elm$json$Json$Encode$int);
var $author$project$Chess$encodeGameState = function (_v0) {
	var black = _v0.f;
	var blackAccepted = _v0.E;
	var game = _v0.o;
	var instigator = _v0.bT;
	var lastMove = _v0.M;
	var lastUpdatedAt = _v0.a3;
	var white = _v0.m;
	var whiteAccepted = _v0.I;
	return $elm$json$Json$Encode$object(
		_List_fromArray(
			[
				_Utils_Tuple2(
				'black',
				$elm$json$Json$Encode$string(black)),
				_Utils_Tuple2(
				'black_accepted',
				$elm$json$Json$Encode$bool(blackAccepted)),
				_Utils_Tuple2(
				'instigator',
				$elm$json$Json$Encode$string(instigator)),
				_Utils_Tuple2(
				'last_move',
				$elm$json$Json$Encode$string(lastMove)),
				_Utils_Tuple2(
				'origin_server_ts',
				$author$project$Internal$Tools$Timestamp$encodeTimestamp(lastUpdatedAt)),
				_Utils_Tuple2(
				'pgn',
				$author$project$Chess$encodePGN(game)),
				_Utils_Tuple2(
				'white',
				$elm$json$Json$Encode$string(white)),
				_Utils_Tuple2(
				'white_accepted',
				$elm$json$Json$Encode$bool(whiteAccepted))
			]));
};
var $author$project$Chess$encodeAccountData = A2($elm$json$Json$Encode$dict, $elm$core$Basics$identity, $author$project$Chess$encodeGameState);
var $author$project$Internal$Values$Room$accountData = F2(
	function (key, _v0) {
		var room = _v0;
		return A2($elm$core$Dict$get, key, room.Z);
	});
var $author$project$Internal$Room$withoutCredentials = function (_v0) {
	var room = _v0.bu;
	return room;
};
var $author$project$Internal$Room$accountData = function (key) {
	return A2(
		$elm$core$Basics$composeR,
		$author$project$Internal$Room$withoutCredentials,
		$author$project$Internal$Values$Room$accountData(key));
};
var $author$project$Matrix$Room$accountData = $author$project$Internal$Room$accountData;
var $elm$json$Json$Decode$map8 = _Json_map8;
var $elm$core$String$filter = _String_filter;
var $pilatch$elm_chess$Internal$Notation$isImportantCharacter = function (ch) {
	return (ch !== 'x') && ((ch !== '=') && ((ch !== '+') && (ch !== '#')));
};
var $pilatch$elm_chess$Internal$Notation$isPieceCharacter = function (ch) {
	return (ch === 'N') || ((ch === 'B') || ((ch === 'R') || ((ch === 'Q') || (ch === 'K'))));
};
var $pilatch$elm_chess$Internal$Notation$kingsideCastlingFromSan = function (position) {
	return $elm$core$List$head(
		A2(
			$elm$core$List$filter,
			$pilatch$elm_chess$Internal$Move$isKingsideCastle,
			$pilatch$elm_chess$Internal$Position$moves(position)));
};
var $elm$core$String$dropRight = F2(
	function (n, string) {
		return (n < 1) ? string : A3($elm$core$String$slice, 0, -n, string);
	});
var $pilatch$elm_chess$Internal$Notation$pawnMatch = F3(
	function (promotion, fromFile, move) {
		if (promotion.$ === 1) {
			if (fromFile.$ === 1) {
				return true;
			} else {
				var file = fromFile.a;
				return _Utils_eq(
					$pilatch$elm_chess$Internal$Square$file(
						$pilatch$elm_chess$Internal$Move$from(move)),
					file);
			}
		} else {
			var promotion_ = promotion.a;
			if (fromFile.$ === 1) {
				return _Utils_eq(
					$pilatch$elm_chess$Internal$Move$promotion(move),
					$elm$core$Maybe$Just(promotion_));
			} else {
				var file = fromFile.a;
				return _Utils_eq(
					$pilatch$elm_chess$Internal$Move$promotion(move),
					$elm$core$Maybe$Just(promotion_)) && _Utils_eq(
					$pilatch$elm_chess$Internal$Square$file(
						$pilatch$elm_chess$Internal$Move$from(move)),
					file);
			}
		}
	});
var $pilatch$elm_chess$Internal$Notation$findPawnMove = F4(
	function (to, promotion, fromFile, position) {
		var candidates = A2(
			$elm$core$List$filter,
			A2($pilatch$elm_chess$Internal$Notation$pawnMatch, promotion, fromFile),
			A3($pilatch$elm_chess$Internal$Position$movesTo, $pilatch$elm_chess$Internal$PieceType$pawn, to, position));
		return ($elm$core$List$length(candidates) === 1) ? $elm$core$List$head(candidates) : $elm$core$Maybe$Nothing;
	});
var $pilatch$elm_chess$Internal$PieceType$fromString = function (string) {
	return A2(
		$elm$core$Maybe$andThen,
		$pilatch$elm_chess$Internal$PieceType$fromChar,
		$elm$core$List$head(
			$elm$core$String$toList(string)));
};
var $elm$core$String$right = F2(
	function (n, string) {
		return (n < 1) ? '' : A3(
			$elm$core$String$slice,
			-n,
			$elm$core$String$length(string),
			string);
	});
var $pilatch$elm_chess$Internal$Notation$pawnMoveFromSan = F2(
	function (string, position) {
		var promotion = $pilatch$elm_chess$Internal$PieceType$fromString(
			A2($elm$core$String$right, 1, string));
		var str = _Utils_eq(promotion, $elm$core$Maybe$Nothing) ? string : A2($elm$core$String$dropRight, 1, string);
		var to = $pilatch$elm_chess$Internal$Square$fromString(
			A2($elm$core$String$right, 2, str));
		var file = $elm$core$List$head(
			A2(
				$elm$core$List$filterMap,
				$pilatch$elm_chess$Internal$SquareFile$fromChar,
				$elm$core$String$toList(
					A2($elm$core$String$dropRight, 2, str))));
		if (to.$ === 1) {
			return $elm$core$Maybe$Nothing;
		} else {
			var to_ = to.a;
			return A4($pilatch$elm_chess$Internal$Notation$findPawnMove, to_, promotion, file, position);
		}
	});
var $pilatch$elm_chess$Internal$Notation$match = F5(
	function (kind, to, fromFile, fromRank, move) {
		if (fromFile.$ === 1) {
			if (fromRank.$ === 1) {
				return true;
			} else {
				var rank = fromRank.a;
				return _Utils_eq(
					rank,
					$pilatch$elm_chess$Internal$Square$rank(
						$pilatch$elm_chess$Internal$Move$from(move)));
			}
		} else {
			var file = fromFile.a;
			if (fromRank.$ === 1) {
				return _Utils_eq(
					file,
					$pilatch$elm_chess$Internal$Square$file(
						$pilatch$elm_chess$Internal$Move$from(move)));
			} else {
				var rank = fromRank.a;
				return _Utils_eq(
					file,
					$pilatch$elm_chess$Internal$Square$file(
						$pilatch$elm_chess$Internal$Move$from(move))) && _Utils_eq(
					rank,
					$pilatch$elm_chess$Internal$Square$rank(
						$pilatch$elm_chess$Internal$Move$to(move)));
			}
		}
	});
var $pilatch$elm_chess$Internal$Notation$findPieceMove = F4(
	function (kind, to, disambig, position) {
		var dis = $elm$core$String$toList(disambig);
		var files = A2($elm$core$List$filterMap, $pilatch$elm_chess$Internal$SquareFile$fromChar, dis);
		var ranks = A2($elm$core$List$filterMap, $pilatch$elm_chess$Internal$SquareRank$fromChar, dis);
		if (($elm$core$List$length(files) > 1) || ($elm$core$List$length(ranks) > 1)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var rank = $elm$core$List$head(ranks);
			var file = $elm$core$List$head(files);
			var candidates = A2(
				$elm$core$List$filter,
				A4($pilatch$elm_chess$Internal$Notation$match, kind, to, file, rank),
				A3($pilatch$elm_chess$Internal$Position$movesTo, kind, to, position));
			return ($elm$core$List$length(candidates) === 1) ? $elm$core$List$head(candidates) : $elm$core$Maybe$Nothing;
		}
	});
var $pilatch$elm_chess$Internal$Notation$pieceMoveFromSan = F2(
	function (str, position) {
		var to = $pilatch$elm_chess$Internal$Square$fromString(
			A2($elm$core$String$right, 2, str));
		var kind = $pilatch$elm_chess$Internal$PieceType$fromString(str);
		var disambig = A2(
			$elm$core$String$dropRight,
			2,
			A2($elm$core$String$dropLeft, 1, str));
		if (kind.$ === 1) {
			return $elm$core$Maybe$Nothing;
		} else {
			var kind_ = kind.a;
			if (to.$ === 1) {
				return $elm$core$Maybe$Nothing;
			} else {
				var to_ = to.a;
				return A4($pilatch$elm_chess$Internal$Notation$findPieceMove, kind_, to_, disambig, position);
			}
		}
	});
var $pilatch$elm_chess$Internal$Notation$queensideCastlingFromSan = function (position) {
	return $elm$core$List$head(
		A2(
			$elm$core$List$filter,
			$pilatch$elm_chess$Internal$Move$isQueensideCastle,
			$pilatch$elm_chess$Internal$Position$moves(position)));
};
var $pilatch$elm_chess$Internal$Notation$fromSan = F2(
	function (string, position) {
		var str = A2($elm$core$String$filter, $pilatch$elm_chess$Internal$Notation$isImportantCharacter, string);
		return (str === 'O-O') ? $pilatch$elm_chess$Internal$Notation$kingsideCastlingFromSan(position) : ((str === 'O-O-O') ? $pilatch$elm_chess$Internal$Notation$queensideCastlingFromSan(position) : ($pilatch$elm_chess$Internal$Notation$isPieceCharacter(
			A2($elm$core$String$left, 1, str)) ? A2($pilatch$elm_chess$Internal$Notation$pieceMoveFromSan, str, position) : A2($pilatch$elm_chess$Internal$Notation$pawnMoveFromSan, str, position)));
	});
var $pilatch$elm_chess$Internal$Game$addSanMove = F2(
	function (sanMove, game) {
		return A2(
			$elm$core$Maybe$map,
			function (m) {
				return A2($pilatch$elm_chess$Internal$Game$addMove, m, game);
			},
			A2($pilatch$elm_chess$Internal$Notation$fromSan, sanMove, game.aZ));
	});
var $pilatch$elm_chess$Internal$Util$failableFoldl = F2(
	function (f, init) {
		return A2(
			$elm$core$List$foldl,
			A2($elm$core$Basics$composeL, $elm$core$Maybe$andThen, f),
			$elm$core$Maybe$Just(init));
	});
var $pilatch$elm_chess$Internal$Game$addSanMoveSequence = F2(
	function (sanMoves, game) {
		return A3($pilatch$elm_chess$Internal$Util$failableFoldl, $pilatch$elm_chess$Internal$Game$addSanMove, game, sanMoves);
	});
var $pilatch$elm_chess$Internal$Game$UnknownResult = 3;
var $pilatch$elm_chess$Internal$Game$empty = {
	L: 0,
	aZ: $pilatch$elm_chess$Internal$Position$initial,
	au: $elm$core$Array$fromList(
		_List_fromArray(
			[$pilatch$elm_chess$Internal$Position$initial])),
	ef: 3,
	bw: _List_Nil
};
var $pilatch$elm_chess$Internal$Pgn$result_ = function (game) {
	return A3(
		$elm$core$List$foldl,
		F2(
			function (x, r) {
				if (x.$ === 5) {
					var t = x.a;
					return t;
				} else {
					return r;
				}
			}),
		3,
		game.cJ);
};
var $pilatch$elm_chess$Internal$Pgn$gameFromPgnGame_ = function (g) {
	return function (game) {
		return A2(
			$elm$core$Maybe$map,
			$pilatch$elm_chess$Internal$Game$toBeginning,
			A2(
				$pilatch$elm_chess$Internal$Game$addSanMoveSequence,
				A2(
					$elm$core$List$filterMap,
					function (x) {
						if (!x.$) {
							var m = x.a;
							return $elm$core$Maybe$Just(m);
						} else {
							return $elm$core$Maybe$Nothing;
						}
					},
					g.cJ),
				_Utils_update(
					game,
					{
						ef: $pilatch$elm_chess$Internal$Pgn$result_(g),
						bw: g.fJ
					})));
	}($pilatch$elm_chess$Internal$Game$empty);
};
var $pilatch$elm_chess$Internal$Pgn$PgnGame = F2(
	function (headers, moveText) {
		return {fJ: headers, cJ: moveText};
	});
var $elm$parser$Parser$Optional = 1;
var $elm$parser$Parser$Advanced$Bad = F2(
	function (a, b) {
		return {$: 1, a: a, b: b};
	});
var $elm$parser$Parser$Advanced$Good = F3(
	function (a, b, c) {
		return {$: 0, a: a, b: b, c: c};
	});
var $elm$parser$Parser$Advanced$Parser = $elm$core$Basics$identity;
var $elm$parser$Parser$Advanced$andThen = F2(
	function (callback, _v0) {
		var parseA = _v0;
		return function (s0) {
			var _v1 = parseA(s0);
			if (_v1.$ === 1) {
				var p = _v1.a;
				var x = _v1.b;
				return A2($elm$parser$Parser$Advanced$Bad, p, x);
			} else {
				var p1 = _v1.a;
				var a = _v1.b;
				var s1 = _v1.c;
				var _v2 = callback(a);
				var parseB = _v2;
				var _v3 = parseB(s1);
				if (_v3.$ === 1) {
					var p2 = _v3.a;
					var x = _v3.b;
					return A2($elm$parser$Parser$Advanced$Bad, p1 || p2, x);
				} else {
					var p2 = _v3.a;
					var b = _v3.b;
					var s2 = _v3.c;
					return A3($elm$parser$Parser$Advanced$Good, p1 || p2, b, s2);
				}
			}
		};
	});
var $elm$parser$Parser$Advanced$map2 = F3(
	function (func, _v0, _v1) {
		var parseA = _v0;
		var parseB = _v1;
		return function (s0) {
			var _v2 = parseA(s0);
			if (_v2.$ === 1) {
				var p = _v2.a;
				var x = _v2.b;
				return A2($elm$parser$Parser$Advanced$Bad, p, x);
			} else {
				var p1 = _v2.a;
				var a = _v2.b;
				var s1 = _v2.c;
				var _v3 = parseB(s1);
				if (_v3.$ === 1) {
					var p2 = _v3.a;
					var x = _v3.b;
					return A2($elm$parser$Parser$Advanced$Bad, p1 || p2, x);
				} else {
					var p2 = _v3.a;
					var b = _v3.b;
					var s2 = _v3.c;
					return A3(
						$elm$parser$Parser$Advanced$Good,
						p1 || p2,
						A2(func, a, b),
						s2);
				}
			}
		};
	});
var $elm$parser$Parser$Advanced$ignorer = F2(
	function (keepParser, ignoreParser) {
		return A3($elm$parser$Parser$Advanced$map2, $elm$core$Basics$always, keepParser, ignoreParser);
	});
var $elm$parser$Parser$Advanced$loopHelp = F4(
	function (p, state, callback, s0) {
		loopHelp:
		while (true) {
			var _v0 = callback(state);
			var parse = _v0;
			var _v1 = parse(s0);
			if (!_v1.$) {
				var p1 = _v1.a;
				var step = _v1.b;
				var s1 = _v1.c;
				if (!step.$) {
					var newState = step.a;
					var $temp$p = p || p1,
						$temp$state = newState,
						$temp$callback = callback,
						$temp$s0 = s1;
					p = $temp$p;
					state = $temp$state;
					callback = $temp$callback;
					s0 = $temp$s0;
					continue loopHelp;
				} else {
					var result = step.a;
					return A3($elm$parser$Parser$Advanced$Good, p || p1, result, s1);
				}
			} else {
				var p1 = _v1.a;
				var x = _v1.b;
				return A2($elm$parser$Parser$Advanced$Bad, p || p1, x);
			}
		}
	});
var $elm$parser$Parser$Advanced$loop = F2(
	function (state, callback) {
		return function (s) {
			return A4($elm$parser$Parser$Advanced$loopHelp, false, state, callback, s);
		};
	});
var $elm$parser$Parser$Advanced$map = F2(
	function (func, _v0) {
		var parse = _v0;
		return function (s0) {
			var _v1 = parse(s0);
			if (!_v1.$) {
				var p = _v1.a;
				var a = _v1.b;
				var s1 = _v1.c;
				return A3(
					$elm$parser$Parser$Advanced$Good,
					p,
					func(a),
					s1);
			} else {
				var p = _v1.a;
				var x = _v1.b;
				return A2($elm$parser$Parser$Advanced$Bad, p, x);
			}
		};
	});
var $elm$parser$Parser$Advanced$Empty = {$: 0};
var $elm$parser$Parser$Advanced$Append = F2(
	function (a, b) {
		return {$: 2, a: a, b: b};
	});
var $elm$parser$Parser$Advanced$oneOfHelp = F3(
	function (s0, bag, parsers) {
		oneOfHelp:
		while (true) {
			if (!parsers.b) {
				return A2($elm$parser$Parser$Advanced$Bad, false, bag);
			} else {
				var parse = parsers.a;
				var remainingParsers = parsers.b;
				var _v1 = parse(s0);
				if (!_v1.$) {
					var step = _v1;
					return step;
				} else {
					var step = _v1;
					var p = step.a;
					var x = step.b;
					if (p) {
						return step;
					} else {
						var $temp$s0 = s0,
							$temp$bag = A2($elm$parser$Parser$Advanced$Append, bag, x),
							$temp$parsers = remainingParsers;
						s0 = $temp$s0;
						bag = $temp$bag;
						parsers = $temp$parsers;
						continue oneOfHelp;
					}
				}
			}
		}
	});
var $elm$parser$Parser$Advanced$oneOf = function (parsers) {
	return function (s) {
		return A3($elm$parser$Parser$Advanced$oneOfHelp, s, $elm$parser$Parser$Advanced$Empty, parsers);
	};
};
var $elm$parser$Parser$Advanced$Done = function (a) {
	return {$: 1, a: a};
};
var $elm$parser$Parser$Advanced$Loop = function (a) {
	return {$: 0, a: a};
};
var $elm$parser$Parser$Advanced$revAlways = F2(
	function (_v0, b) {
		return b;
	});
var $elm$parser$Parser$Advanced$skip = F2(
	function (iParser, kParser) {
		return A3($elm$parser$Parser$Advanced$map2, $elm$parser$Parser$Advanced$revAlways, iParser, kParser);
	});
var $elm$parser$Parser$Advanced$sequenceEndForbidden = F5(
	function (ender, ws, parseItem, sep, revItems) {
		var chompRest = function (item) {
			return A5(
				$elm$parser$Parser$Advanced$sequenceEndForbidden,
				ender,
				ws,
				parseItem,
				sep,
				A2($elm$core$List$cons, item, revItems));
		};
		return A2(
			$elm$parser$Parser$Advanced$skip,
			ws,
			$elm$parser$Parser$Advanced$oneOf(
				_List_fromArray(
					[
						A2(
						$elm$parser$Parser$Advanced$skip,
						sep,
						A2(
							$elm$parser$Parser$Advanced$skip,
							ws,
							A2(
								$elm$parser$Parser$Advanced$map,
								function (item) {
									return $elm$parser$Parser$Advanced$Loop(
										A2($elm$core$List$cons, item, revItems));
								},
								parseItem))),
						A2(
						$elm$parser$Parser$Advanced$map,
						function (_v0) {
							return $elm$parser$Parser$Advanced$Done(
								$elm$core$List$reverse(revItems));
						},
						ender)
					])));
	});
var $elm$parser$Parser$Advanced$succeed = function (a) {
	return function (s) {
		return A3($elm$parser$Parser$Advanced$Good, false, a, s);
	};
};
var $elm$parser$Parser$Advanced$sequenceEndMandatory = F4(
	function (ws, parseItem, sep, revItems) {
		return $elm$parser$Parser$Advanced$oneOf(
			_List_fromArray(
				[
					A2(
					$elm$parser$Parser$Advanced$map,
					function (item) {
						return $elm$parser$Parser$Advanced$Loop(
							A2($elm$core$List$cons, item, revItems));
					},
					A2(
						$elm$parser$Parser$Advanced$ignorer,
						parseItem,
						A2(
							$elm$parser$Parser$Advanced$ignorer,
							ws,
							A2($elm$parser$Parser$Advanced$ignorer, sep, ws)))),
					A2(
					$elm$parser$Parser$Advanced$map,
					function (_v0) {
						return $elm$parser$Parser$Advanced$Done(
							$elm$core$List$reverse(revItems));
					},
					$elm$parser$Parser$Advanced$succeed(0))
				]));
	});
var $elm$parser$Parser$Advanced$sequenceEndOptional = F5(
	function (ender, ws, parseItem, sep, revItems) {
		var parseEnd = A2(
			$elm$parser$Parser$Advanced$map,
			function (_v0) {
				return $elm$parser$Parser$Advanced$Done(
					$elm$core$List$reverse(revItems));
			},
			ender);
		return A2(
			$elm$parser$Parser$Advanced$skip,
			ws,
			$elm$parser$Parser$Advanced$oneOf(
				_List_fromArray(
					[
						A2(
						$elm$parser$Parser$Advanced$skip,
						sep,
						A2(
							$elm$parser$Parser$Advanced$skip,
							ws,
							$elm$parser$Parser$Advanced$oneOf(
								_List_fromArray(
									[
										A2(
										$elm$parser$Parser$Advanced$map,
										function (item) {
											return $elm$parser$Parser$Advanced$Loop(
												A2($elm$core$List$cons, item, revItems));
										},
										parseItem),
										parseEnd
									])))),
						parseEnd
					])));
	});
var $elm$parser$Parser$Advanced$sequenceEnd = F5(
	function (ender, ws, parseItem, sep, trailing) {
		var chompRest = function (item) {
			switch (trailing) {
				case 0:
					return A2(
						$elm$parser$Parser$Advanced$loop,
						_List_fromArray(
							[item]),
						A4($elm$parser$Parser$Advanced$sequenceEndForbidden, ender, ws, parseItem, sep));
				case 1:
					return A2(
						$elm$parser$Parser$Advanced$loop,
						_List_fromArray(
							[item]),
						A4($elm$parser$Parser$Advanced$sequenceEndOptional, ender, ws, parseItem, sep));
				default:
					return A2(
						$elm$parser$Parser$Advanced$ignorer,
						A2(
							$elm$parser$Parser$Advanced$skip,
							ws,
							A2(
								$elm$parser$Parser$Advanced$skip,
								sep,
								A2(
									$elm$parser$Parser$Advanced$skip,
									ws,
									A2(
										$elm$parser$Parser$Advanced$loop,
										_List_fromArray(
											[item]),
										A3($elm$parser$Parser$Advanced$sequenceEndMandatory, ws, parseItem, sep))))),
						ender);
			}
		};
		return $elm$parser$Parser$Advanced$oneOf(
			_List_fromArray(
				[
					A2($elm$parser$Parser$Advanced$andThen, chompRest, parseItem),
					A2(
					$elm$parser$Parser$Advanced$map,
					function (_v0) {
						return _List_Nil;
					},
					ender)
				]));
	});
var $elm$parser$Parser$Advanced$AddRight = F2(
	function (a, b) {
		return {$: 1, a: a, b: b};
	});
var $elm$parser$Parser$Advanced$DeadEnd = F4(
	function (row, col, problem, contextStack) {
		return {dn: col, fm: contextStack, d5: problem, eh: row};
	});
var $elm$parser$Parser$Advanced$fromState = F2(
	function (s, x) {
		return A2(
			$elm$parser$Parser$Advanced$AddRight,
			$elm$parser$Parser$Advanced$Empty,
			A4($elm$parser$Parser$Advanced$DeadEnd, s.eh, s.dn, x, s.bP));
	});
var $elm$parser$Parser$Advanced$isSubString = _Parser_isSubString;
var $elm$parser$Parser$Advanced$token = function (_v0) {
	var str = _v0.a;
	var expecting = _v0.b;
	var progress = !$elm$core$String$isEmpty(str);
	return function (s) {
		var _v1 = A5($elm$parser$Parser$Advanced$isSubString, str, s.ge, s.eh, s.dn, s.gS);
		var newOffset = _v1.a;
		var newRow = _v1.b;
		var newCol = _v1.c;
		return _Utils_eq(newOffset, -1) ? A2(
			$elm$parser$Parser$Advanced$Bad,
			false,
			A2($elm$parser$Parser$Advanced$fromState, s, expecting)) : A3(
			$elm$parser$Parser$Advanced$Good,
			progress,
			0,
			{dn: newCol, bP: s.bP, c: s.c, ge: newOffset, eh: newRow, gS: s.gS});
	};
};
var $elm$parser$Parser$Advanced$sequence = function (i) {
	return A2(
		$elm$parser$Parser$Advanced$skip,
		$elm$parser$Parser$Advanced$token(i.c_),
		A2(
			$elm$parser$Parser$Advanced$skip,
			i.er,
			A5(
				$elm$parser$Parser$Advanced$sequenceEnd,
				$elm$parser$Parser$Advanced$token(i.cf),
				i.er,
				i.dN,
				$elm$parser$Parser$Advanced$token(i.em),
				i.ey)));
};
var $elm$parser$Parser$Advanced$Forbidden = 0;
var $elm$parser$Parser$Advanced$Mandatory = 2;
var $elm$parser$Parser$Advanced$Optional = 1;
var $elm$parser$Parser$toAdvancedTrailing = function (trailing) {
	switch (trailing) {
		case 0:
			return 0;
		case 1:
			return 1;
		default:
			return 2;
	}
};
var $elm$parser$Parser$Expecting = function (a) {
	return {$: 0, a: a};
};
var $elm$parser$Parser$Advanced$Token = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var $elm$parser$Parser$toToken = function (str) {
	return A2(
		$elm$parser$Parser$Advanced$Token,
		str,
		$elm$parser$Parser$Expecting(str));
};
var $elm$parser$Parser$sequence = function (i) {
	return $elm$parser$Parser$Advanced$sequence(
		{
			cf: $elm$parser$Parser$toToken(i.cf),
			dN: i.dN,
			em: $elm$parser$Parser$toToken(i.em),
			er: i.er,
			c_: $elm$parser$Parser$toToken(i.c_),
			ey: $elm$parser$Parser$toAdvancedTrailing(i.ey)
		});
};
var $elm$parser$Parser$Advanced$isSubChar = _Parser_isSubChar;
var $elm$parser$Parser$Advanced$chompWhileHelp = F5(
	function (isGood, offset, row, col, s0) {
		chompWhileHelp:
		while (true) {
			var newOffset = A3($elm$parser$Parser$Advanced$isSubChar, isGood, offset, s0.gS);
			if (_Utils_eq(newOffset, -1)) {
				return A3(
					$elm$parser$Parser$Advanced$Good,
					_Utils_cmp(s0.ge, offset) < 0,
					0,
					{dn: col, bP: s0.bP, c: s0.c, ge: offset, eh: row, gS: s0.gS});
			} else {
				if (_Utils_eq(newOffset, -2)) {
					var $temp$isGood = isGood,
						$temp$offset = offset + 1,
						$temp$row = row + 1,
						$temp$col = 1,
						$temp$s0 = s0;
					isGood = $temp$isGood;
					offset = $temp$offset;
					row = $temp$row;
					col = $temp$col;
					s0 = $temp$s0;
					continue chompWhileHelp;
				} else {
					var $temp$isGood = isGood,
						$temp$offset = newOffset,
						$temp$row = row,
						$temp$col = col + 1,
						$temp$s0 = s0;
					isGood = $temp$isGood;
					offset = $temp$offset;
					row = $temp$row;
					col = $temp$col;
					s0 = $temp$s0;
					continue chompWhileHelp;
				}
			}
		}
	});
var $elm$parser$Parser$Advanced$chompWhile = function (isGood) {
	return function (s) {
		return A5($elm$parser$Parser$Advanced$chompWhileHelp, isGood, s.ge, s.eh, s.dn, s);
	};
};
var $elm$parser$Parser$Advanced$spaces = $elm$parser$Parser$Advanced$chompWhile(
	function (c) {
		return (c === ' ') || ((c === '\n') || (c === '\r'));
	});
var $elm$parser$Parser$spaces = $elm$parser$Parser$Advanced$spaces;
var $elm$parser$Parser$chompWhile = $elm$parser$Parser$Advanced$chompWhile;
var $elm$parser$Parser$Advanced$mapChompedString = F2(
	function (func, _v0) {
		var parse = _v0;
		return function (s0) {
			var _v1 = parse(s0);
			if (_v1.$ === 1) {
				var p = _v1.a;
				var x = _v1.b;
				return A2($elm$parser$Parser$Advanced$Bad, p, x);
			} else {
				var p = _v1.a;
				var a = _v1.b;
				var s1 = _v1.c;
				return A3(
					$elm$parser$Parser$Advanced$Good,
					p,
					A2(
						func,
						A3($elm$core$String$slice, s0.ge, s1.ge, s0.gS),
						a),
					s1);
			}
		};
	});
var $elm$parser$Parser$Advanced$getChompedString = function (parser) {
	return A2($elm$parser$Parser$Advanced$mapChompedString, $elm$core$Basics$always, parser);
};
var $elm$parser$Parser$getChompedString = $elm$parser$Parser$Advanced$getChompedString;
var $elm$parser$Parser$ignorer = $elm$parser$Parser$Advanced$ignorer;
var $elm$parser$Parser$succeed = $elm$parser$Parser$Advanced$succeed;
var $pilatch$elm_chess$Internal$Pgn$anyCharBut_ = function (_char) {
	return $elm$parser$Parser$getChompedString(
		A2(
			$elm$parser$Parser$ignorer,
			$elm$parser$Parser$succeed($elm$core$Basics$identity),
			$elm$parser$Parser$chompWhile(
				$elm$core$Basics$neq(_char))));
};
var $elm$parser$Parser$Advanced$keeper = F2(
	function (parseFunc, parseArg) {
		return A3($elm$parser$Parser$Advanced$map2, $elm$core$Basics$apL, parseFunc, parseArg);
	});
var $elm$parser$Parser$keeper = $elm$parser$Parser$Advanced$keeper;
var $pilatch$elm_chess$Internal$Pgn$nonspaces_ = $pilatch$elm_chess$Internal$Pgn$anyCharBut_(' ');
var $elm$parser$Parser$ExpectingSymbol = function (a) {
	return {$: 8, a: a};
};
var $elm$parser$Parser$Advanced$symbol = $elm$parser$Parser$Advanced$token;
var $elm$parser$Parser$symbol = function (str) {
	return $elm$parser$Parser$Advanced$symbol(
		A2(
			$elm$parser$Parser$Advanced$Token,
			str,
			$elm$parser$Parser$ExpectingSymbol(str)));
};
var $pilatch$elm_chess$Internal$Pgn$tagPair = F2(
	function (a, b) {
		return _Utils_Tuple2(a, b);
	});
var $pilatch$elm_chess$Internal$Pgn$tagPair_ = A2(
	$elm$parser$Parser$keeper,
	A2(
		$elm$parser$Parser$keeper,
		A2(
			$elm$parser$Parser$ignorer,
			A2(
				$elm$parser$Parser$ignorer,
				$elm$parser$Parser$succeed($pilatch$elm_chess$Internal$Pgn$tagPair),
				$elm$parser$Parser$symbol('[')),
			$elm$parser$Parser$spaces),
		A2(
			$elm$parser$Parser$ignorer,
			A2($elm$parser$Parser$ignorer, $pilatch$elm_chess$Internal$Pgn$nonspaces_, $elm$parser$Parser$spaces),
			$elm$parser$Parser$symbol('\"'))),
	A2(
		$elm$parser$Parser$ignorer,
		A2(
			$elm$parser$Parser$ignorer,
			A2(
				$elm$parser$Parser$ignorer,
				$pilatch$elm_chess$Internal$Pgn$anyCharBut_('\"'),
				$elm$parser$Parser$symbol('\"')),
			$elm$parser$Parser$spaces),
		$elm$parser$Parser$symbol(']')));
var $pilatch$elm_chess$Internal$Pgn$headers = $elm$parser$Parser$sequence(
	{cf: '', dN: $pilatch$elm_chess$Internal$Pgn$tagPair_, em: '', er: $elm$parser$Parser$spaces, c_: '', ey: 1});
var $elm$parser$Parser$Done = function (a) {
	return {$: 1, a: a};
};
var $elm$parser$Parser$Loop = function (a) {
	return {$: 0, a: a};
};
var $elm$parser$Parser$ExpectingEnd = {$: 10};
var $elm$parser$Parser$Advanced$end = function (x) {
	return function (s) {
		return _Utils_eq(
			$elm$core$String$length(s.gS),
			s.ge) ? A3($elm$parser$Parser$Advanced$Good, false, 0, s) : A2(
			$elm$parser$Parser$Advanced$Bad,
			false,
			A2($elm$parser$Parser$Advanced$fromState, s, x));
	};
};
var $elm$parser$Parser$end = $elm$parser$Parser$Advanced$end($elm$parser$Parser$ExpectingEnd);
var $elm$parser$Parser$map = $elm$parser$Parser$Advanced$map;
var $elm$parser$Parser$toAdvancedStep = function (step) {
	if (!step.$) {
		var s = step.a;
		return $elm$parser$Parser$Advanced$Loop(s);
	} else {
		var a = step.a;
		return $elm$parser$Parser$Advanced$Done(a);
	}
};
var $elm$parser$Parser$loop = F2(
	function (state, callback) {
		return A2(
			$elm$parser$Parser$Advanced$loop,
			state,
			function (s) {
				return A2(
					$elm$parser$Parser$map,
					$elm$parser$Parser$toAdvancedStep,
					callback(s));
			});
	});
var $pilatch$elm_chess$Internal$Pgn$Comment = function (a) {
	return {$: 3, a: a};
};
var $pilatch$elm_chess$Internal$Pgn$Move = function (a) {
	return {$: 0, a: a};
};
var $pilatch$elm_chess$Internal$Pgn$MoveNumber = {$: 1};
var $pilatch$elm_chess$Internal$Pgn$Nag = function (a) {
	return {$: 4, a: a};
};
var $pilatch$elm_chess$Internal$Pgn$Termination = function (a) {
	return {$: 5, a: a};
};
var $pilatch$elm_chess$Internal$Pgn$Variation = function (a) {
	return {$: 2, a: a};
};
var $elm$parser$Parser$andThen = $elm$parser$Parser$Advanced$andThen;
var $pilatch$elm_chess$Internal$Pgn$comment = A2(
	$elm$parser$Parser$keeper,
	A2(
		$elm$parser$Parser$ignorer,
		$elm$parser$Parser$succeed($elm$core$Basics$identity),
		$elm$parser$Parser$symbol('{')),
	A2(
		$elm$parser$Parser$ignorer,
		$pilatch$elm_chess$Internal$Pgn$anyCharBut_('}'),
		$elm$parser$Parser$symbol('}')));
var $elm$parser$Parser$Advanced$lazy = function (thunk) {
	return function (s) {
		var _v0 = thunk(0);
		var parse = _v0;
		return parse(s);
	};
};
var $elm$parser$Parser$lazy = $elm$parser$Parser$Advanced$lazy;
var $elm$parser$Parser$Problem = function (a) {
	return {$: 12, a: a};
};
var $elm$parser$Parser$Advanced$problem = function (x) {
	return function (s) {
		return A2(
			$elm$parser$Parser$Advanced$Bad,
			false,
			A2($elm$parser$Parser$Advanced$fromState, s, x));
	};
};
var $elm$parser$Parser$problem = function (msg) {
	return $elm$parser$Parser$Advanced$problem(
		$elm$parser$Parser$Problem(msg));
};
var $elm$core$String$trim = _String_trim;
var $pilatch$elm_chess$Internal$Pgn$disallowBlank_ = function (string) {
	return $elm$core$String$isEmpty(
		$elm$core$String$trim(string)) ? $elm$parser$Parser$problem('blank') : $elm$parser$Parser$succeed(string);
};
var $pilatch$elm_chess$Internal$Pgn$isNonwhitespaceChar_ = function (_char) {
	return !$elm$core$String$isEmpty(
		$elm$core$String$trim(
			$elm$core$String$fromChar(_char)));
};
var $pilatch$elm_chess$Internal$Pgn$nonwhitespaceNonparen_ = $elm$parser$Parser$getChompedString(
	A2(
		$elm$parser$Parser$ignorer,
		$elm$parser$Parser$succeed($elm$core$Basics$identity),
		$elm$parser$Parser$chompWhile(
			function (_char) {
				return $pilatch$elm_chess$Internal$Pgn$isNonwhitespaceChar_(_char) && ((_char !== ')') && (_char !== '('));
			})));
var $pilatch$elm_chess$Internal$Pgn$move = A2($elm$parser$Parser$andThen, $pilatch$elm_chess$Internal$Pgn$disallowBlank_, $pilatch$elm_chess$Internal$Pgn$nonwhitespaceNonparen_);
var $pilatch$elm_chess$Internal$Pgn$checkMoveNumber_ = function (number) {
	var _v0 = $elm$core$String$toInt(number);
	if (!_v0.$) {
		var _int = _v0.a;
		return $elm$parser$Parser$succeed(_int);
	} else {
		return $elm$parser$Parser$problem('a move number should be an integer');
	}
};
var $pilatch$elm_chess$Internal$Pgn$digits_ = A2(
	$elm$parser$Parser$andThen,
	$pilatch$elm_chess$Internal$Pgn$checkMoveNumber_,
	$elm$parser$Parser$getChompedString(
		$elm$parser$Parser$chompWhile($elm$core$Char$isDigit)));
var $pilatch$elm_chess$Internal$Pgn$moveNumber = A2(
	$elm$parser$Parser$keeper,
	$elm$parser$Parser$succeed($elm$core$Basics$identity),
	A2(
		$elm$parser$Parser$ignorer,
		$pilatch$elm_chess$Internal$Pgn$digits_,
		$elm$parser$Parser$symbol('.')));
var $elm$parser$Parser$ExpectingInt = {$: 1};
var $elm$parser$Parser$Advanced$consumeBase = _Parser_consumeBase;
var $elm$parser$Parser$Advanced$consumeBase16 = _Parser_consumeBase16;
var $elm$parser$Parser$Advanced$bumpOffset = F2(
	function (newOffset, s) {
		return {dn: s.dn + (newOffset - s.ge), bP: s.bP, c: s.c, ge: newOffset, eh: s.eh, gS: s.gS};
	});
var $elm$parser$Parser$Advanced$chompBase10 = _Parser_chompBase10;
var $elm$parser$Parser$Advanced$isAsciiCode = _Parser_isAsciiCode;
var $elm$parser$Parser$Advanced$consumeExp = F2(
	function (offset, src) {
		if (A3($elm$parser$Parser$Advanced$isAsciiCode, 101, offset, src) || A3($elm$parser$Parser$Advanced$isAsciiCode, 69, offset, src)) {
			var eOffset = offset + 1;
			var expOffset = (A3($elm$parser$Parser$Advanced$isAsciiCode, 43, eOffset, src) || A3($elm$parser$Parser$Advanced$isAsciiCode, 45, eOffset, src)) ? (eOffset + 1) : eOffset;
			var newOffset = A2($elm$parser$Parser$Advanced$chompBase10, expOffset, src);
			return _Utils_eq(expOffset, newOffset) ? (-newOffset) : newOffset;
		} else {
			return offset;
		}
	});
var $elm$parser$Parser$Advanced$consumeDotAndExp = F2(
	function (offset, src) {
		return A3($elm$parser$Parser$Advanced$isAsciiCode, 46, offset, src) ? A2(
			$elm$parser$Parser$Advanced$consumeExp,
			A2($elm$parser$Parser$Advanced$chompBase10, offset + 1, src),
			src) : A2($elm$parser$Parser$Advanced$consumeExp, offset, src);
	});
var $elm$parser$Parser$Advanced$finalizeInt = F5(
	function (invalid, handler, startOffset, _v0, s) {
		var endOffset = _v0.a;
		var n = _v0.b;
		if (handler.$ === 1) {
			var x = handler.a;
			return A2(
				$elm$parser$Parser$Advanced$Bad,
				true,
				A2($elm$parser$Parser$Advanced$fromState, s, x));
		} else {
			var toValue = handler.a;
			return _Utils_eq(startOffset, endOffset) ? A2(
				$elm$parser$Parser$Advanced$Bad,
				_Utils_cmp(s.ge, startOffset) < 0,
				A2($elm$parser$Parser$Advanced$fromState, s, invalid)) : A3(
				$elm$parser$Parser$Advanced$Good,
				true,
				toValue(n),
				A2($elm$parser$Parser$Advanced$bumpOffset, endOffset, s));
		}
	});
var $elm$parser$Parser$Advanced$fromInfo = F4(
	function (row, col, x, context) {
		return A2(
			$elm$parser$Parser$Advanced$AddRight,
			$elm$parser$Parser$Advanced$Empty,
			A4($elm$parser$Parser$Advanced$DeadEnd, row, col, x, context));
	});
var $elm$core$String$toFloat = _String_toFloat;
var $elm$parser$Parser$Advanced$finalizeFloat = F6(
	function (invalid, expecting, intSettings, floatSettings, intPair, s) {
		var intOffset = intPair.a;
		var floatOffset = A2($elm$parser$Parser$Advanced$consumeDotAndExp, intOffset, s.gS);
		if (floatOffset < 0) {
			return A2(
				$elm$parser$Parser$Advanced$Bad,
				true,
				A4($elm$parser$Parser$Advanced$fromInfo, s.eh, s.dn - (floatOffset + s.ge), invalid, s.bP));
		} else {
			if (_Utils_eq(s.ge, floatOffset)) {
				return A2(
					$elm$parser$Parser$Advanced$Bad,
					false,
					A2($elm$parser$Parser$Advanced$fromState, s, expecting));
			} else {
				if (_Utils_eq(intOffset, floatOffset)) {
					return A5($elm$parser$Parser$Advanced$finalizeInt, invalid, intSettings, s.ge, intPair, s);
				} else {
					if (floatSettings.$ === 1) {
						var x = floatSettings.a;
						return A2(
							$elm$parser$Parser$Advanced$Bad,
							true,
							A2($elm$parser$Parser$Advanced$fromState, s, invalid));
					} else {
						var toValue = floatSettings.a;
						var _v1 = $elm$core$String$toFloat(
							A3($elm$core$String$slice, s.ge, floatOffset, s.gS));
						if (_v1.$ === 1) {
							return A2(
								$elm$parser$Parser$Advanced$Bad,
								true,
								A2($elm$parser$Parser$Advanced$fromState, s, invalid));
						} else {
							var n = _v1.a;
							return A3(
								$elm$parser$Parser$Advanced$Good,
								true,
								toValue(n),
								A2($elm$parser$Parser$Advanced$bumpOffset, floatOffset, s));
						}
					}
				}
			}
		}
	});
var $elm$parser$Parser$Advanced$number = function (c) {
	return function (s) {
		if (A3($elm$parser$Parser$Advanced$isAsciiCode, 48, s.ge, s.gS)) {
			var zeroOffset = s.ge + 1;
			var baseOffset = zeroOffset + 1;
			return A3($elm$parser$Parser$Advanced$isAsciiCode, 120, zeroOffset, s.gS) ? A5(
				$elm$parser$Parser$Advanced$finalizeInt,
				c.f$,
				c.fK,
				baseOffset,
				A2($elm$parser$Parser$Advanced$consumeBase16, baseOffset, s.gS),
				s) : (A3($elm$parser$Parser$Advanced$isAsciiCode, 111, zeroOffset, s.gS) ? A5(
				$elm$parser$Parser$Advanced$finalizeInt,
				c.f$,
				c.dY,
				baseOffset,
				A3($elm$parser$Parser$Advanced$consumeBase, 8, baseOffset, s.gS),
				s) : (A3($elm$parser$Parser$Advanced$isAsciiCode, 98, zeroOffset, s.gS) ? A5(
				$elm$parser$Parser$Advanced$finalizeInt,
				c.f$,
				c.dk,
				baseOffset,
				A3($elm$parser$Parser$Advanced$consumeBase, 2, baseOffset, s.gS),
				s) : A6(
				$elm$parser$Parser$Advanced$finalizeFloat,
				c.f$,
				c.dw,
				c.dL,
				c.dx,
				_Utils_Tuple2(zeroOffset, 0),
				s)));
		} else {
			return A6(
				$elm$parser$Parser$Advanced$finalizeFloat,
				c.f$,
				c.dw,
				c.dL,
				c.dx,
				A3($elm$parser$Parser$Advanced$consumeBase, 10, s.ge, s.gS),
				s);
		}
	};
};
var $elm$parser$Parser$Advanced$int = F2(
	function (expecting, invalid) {
		return $elm$parser$Parser$Advanced$number(
			{
				dk: $elm$core$Result$Err(invalid),
				dw: expecting,
				dx: $elm$core$Result$Err(invalid),
				fK: $elm$core$Result$Err(invalid),
				dL: $elm$core$Result$Ok($elm$core$Basics$identity),
				f$: invalid,
				dY: $elm$core$Result$Err(invalid)
			});
	});
var $elm$parser$Parser$int = A2($elm$parser$Parser$Advanced$int, $elm$parser$Parser$ExpectingInt, $elm$parser$Parser$ExpectingInt);
var $pilatch$elm_chess$Internal$Pgn$nag = A2(
	$elm$parser$Parser$keeper,
	A2(
		$elm$parser$Parser$ignorer,
		$elm$parser$Parser$succeed($elm$core$Basics$identity),
		$elm$parser$Parser$symbol('$')),
	$elm$parser$Parser$int);
var $elm$parser$Parser$oneOf = $elm$parser$Parser$Advanced$oneOf;
var $pilatch$elm_chess$Internal$Game$BlackWins = 1;
var $pilatch$elm_chess$Internal$Game$Draw = 2;
var $pilatch$elm_chess$Internal$Game$WhiteWins = 0;
var $elm$parser$Parser$ExpectingKeyword = function (a) {
	return {$: 9, a: a};
};
var $elm$parser$Parser$Advanced$keyword = function (_v0) {
	var kwd = _v0.a;
	var expecting = _v0.b;
	var progress = !$elm$core$String$isEmpty(kwd);
	return function (s) {
		var _v1 = A5($elm$parser$Parser$Advanced$isSubString, kwd, s.ge, s.eh, s.dn, s.gS);
		var newOffset = _v1.a;
		var newRow = _v1.b;
		var newCol = _v1.c;
		return (_Utils_eq(newOffset, -1) || (0 <= A3(
			$elm$parser$Parser$Advanced$isSubChar,
			function (c) {
				return $elm$core$Char$isAlphaNum(c) || (c === '_');
			},
			newOffset,
			s.gS))) ? A2(
			$elm$parser$Parser$Advanced$Bad,
			false,
			A2($elm$parser$Parser$Advanced$fromState, s, expecting)) : A3(
			$elm$parser$Parser$Advanced$Good,
			progress,
			0,
			{dn: newCol, bP: s.bP, c: s.c, ge: newOffset, eh: newRow, gS: s.gS});
	};
};
var $elm$parser$Parser$keyword = function (kwd) {
	return $elm$parser$Parser$Advanced$keyword(
		A2(
			$elm$parser$Parser$Advanced$Token,
			kwd,
			$elm$parser$Parser$ExpectingKeyword(kwd)));
};
var $pilatch$elm_chess$Internal$Pgn$termination = $elm$parser$Parser$oneOf(
	_List_fromArray(
		[
			A2(
			$elm$parser$Parser$ignorer,
			$elm$parser$Parser$succeed(0),
			$elm$parser$Parser$keyword('1-0')),
			A2(
			$elm$parser$Parser$ignorer,
			$elm$parser$Parser$succeed(1),
			$elm$parser$Parser$keyword('0-1')),
			A2(
			$elm$parser$Parser$ignorer,
			$elm$parser$Parser$succeed(2),
			$elm$parser$Parser$keyword('1/2-1/2')),
			A2(
			$elm$parser$Parser$ignorer,
			$elm$parser$Parser$succeed(3),
			$elm$parser$Parser$symbol('*'))
		]));
function $pilatch$elm_chess$Internal$Pgn$cyclic$moveTextItem() {
	return $elm$parser$Parser$oneOf(
		_List_fromArray(
			[
				A2($elm$parser$Parser$map, $pilatch$elm_chess$Internal$Pgn$Comment, $pilatch$elm_chess$Internal$Pgn$comment),
				A2($elm$parser$Parser$map, $pilatch$elm_chess$Internal$Pgn$Termination, $pilatch$elm_chess$Internal$Pgn$termination),
				A2(
				$elm$parser$Parser$map,
				function (_v1) {
					return $pilatch$elm_chess$Internal$Pgn$MoveNumber;
				},
				$pilatch$elm_chess$Internal$Pgn$moveNumber),
				A2($elm$parser$Parser$map, $pilatch$elm_chess$Internal$Pgn$Nag, $pilatch$elm_chess$Internal$Pgn$nag),
				$pilatch$elm_chess$Internal$Pgn$cyclic$variation(),
				A2($elm$parser$Parser$map, $pilatch$elm_chess$Internal$Pgn$Move, $pilatch$elm_chess$Internal$Pgn$move)
			]));
}
function $pilatch$elm_chess$Internal$Pgn$cyclic$variation() {
	return A2(
		$elm$parser$Parser$andThen,
		A2($elm$core$Basics$composeR, $pilatch$elm_chess$Internal$Pgn$Variation, $elm$parser$Parser$succeed),
		$elm$parser$Parser$sequence(
			{
				cf: ')',
				dN: $elm$parser$Parser$lazy(
					function (_v0) {
						return $pilatch$elm_chess$Internal$Pgn$cyclic$moveTextItem();
					}),
				em: '',
				er: $elm$parser$Parser$spaces,
				c_: '(',
				ey: 1
			}));
}
var $pilatch$elm_chess$Internal$Pgn$moveTextItem = $pilatch$elm_chess$Internal$Pgn$cyclic$moveTextItem();
$pilatch$elm_chess$Internal$Pgn$cyclic$moveTextItem = function () {
	return $pilatch$elm_chess$Internal$Pgn$moveTextItem;
};
var $pilatch$elm_chess$Internal$Pgn$variation = $pilatch$elm_chess$Internal$Pgn$cyclic$variation();
$pilatch$elm_chess$Internal$Pgn$cyclic$variation = function () {
	return $pilatch$elm_chess$Internal$Pgn$variation;
};
var $pilatch$elm_chess$Internal$Pgn$moveText = A2(
	$elm$parser$Parser$loop,
	_List_Nil,
	function (state) {
		return $elm$parser$Parser$oneOf(
			_List_fromArray(
				[
					A2(
					$elm$parser$Parser$keeper,
					$elm$parser$Parser$succeed(
						function (item) {
							return $elm$parser$Parser$Loop(
								_Utils_ap(
									state,
									_List_fromArray(
										[item])));
						}),
					$pilatch$elm_chess$Internal$Pgn$moveTextItem),
					A2(
					$elm$parser$Parser$ignorer,
					$elm$parser$Parser$succeed(
						$elm$parser$Parser$Done(state)),
					$elm$parser$Parser$end),
					A2(
					$elm$parser$Parser$ignorer,
					$elm$parser$Parser$succeed(
						$elm$parser$Parser$Loop(state)),
					$elm$parser$Parser$spaces)
				]));
	});
var $pilatch$elm_chess$Internal$Pgn$pgn = A2(
	$elm$parser$Parser$keeper,
	A2(
		$elm$parser$Parser$keeper,
		$elm$parser$Parser$succeed($pilatch$elm_chess$Internal$Pgn$PgnGame),
		$pilatch$elm_chess$Internal$Pgn$headers),
	$pilatch$elm_chess$Internal$Pgn$moveText);
var $elm$parser$Parser$DeadEnd = F3(
	function (row, col, problem) {
		return {dn: col, d5: problem, eh: row};
	});
var $elm$parser$Parser$problemToDeadEnd = function (p) {
	return A3($elm$parser$Parser$DeadEnd, p.eh, p.dn, p.d5);
};
var $elm$parser$Parser$Advanced$bagToList = F2(
	function (bag, list) {
		bagToList:
		while (true) {
			switch (bag.$) {
				case 0:
					return list;
				case 1:
					var bag1 = bag.a;
					var x = bag.b;
					var $temp$bag = bag1,
						$temp$list = A2($elm$core$List$cons, x, list);
					bag = $temp$bag;
					list = $temp$list;
					continue bagToList;
				default:
					var bag1 = bag.a;
					var bag2 = bag.b;
					var $temp$bag = bag1,
						$temp$list = A2($elm$parser$Parser$Advanced$bagToList, bag2, list);
					bag = $temp$bag;
					list = $temp$list;
					continue bagToList;
			}
		}
	});
var $elm$parser$Parser$Advanced$run = F2(
	function (_v0, src) {
		var parse = _v0;
		var _v1 = parse(
			{dn: 1, bP: _List_Nil, c: 1, ge: 0, eh: 1, gS: src});
		if (!_v1.$) {
			var value = _v1.b;
			return $elm$core$Result$Ok(value);
		} else {
			var bag = _v1.b;
			return $elm$core$Result$Err(
				A2($elm$parser$Parser$Advanced$bagToList, bag, _List_Nil));
		}
	});
var $elm$parser$Parser$run = F2(
	function (parser, source) {
		var _v0 = A2($elm$parser$Parser$Advanced$run, parser, source);
		if (!_v0.$) {
			var a = _v0.a;
			return $elm$core$Result$Ok(a);
		} else {
			var problems = _v0.a;
			return $elm$core$Result$Err(
				A2($elm$core$List$map, $elm$parser$Parser$problemToDeadEnd, problems));
		}
	});
var $elm$core$Result$toMaybe = function (result) {
	if (!result.$) {
		var v = result.a;
		return $elm$core$Maybe$Just(v);
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $pilatch$elm_chess$Internal$Pgn$gameFromString = function (pgnString) {
	return A2(
		$elm$core$Maybe$andThen,
		$pilatch$elm_chess$Internal$Pgn$gameFromPgnGame_,
		$elm$core$Result$toMaybe(
			A2($elm$parser$Parser$run, $pilatch$elm_chess$Internal$Pgn$pgn, pgnString)));
};
var $pilatch$elm_chess$Game$fromPgn = function (pgnString) {
	return A2(
		$elm$core$Maybe$map,
		$elm$core$Basics$identity,
		$pilatch$elm_chess$Internal$Pgn$gameFromString(pgnString));
};
var $author$project$Chess$pgnDecoder = A2(
	$elm$json$Json$Decode$andThen,
	function (pgn) {
		var _v0 = $pilatch$elm_chess$Game$fromPgn(pgn);
		if (!_v0.$) {
			var game = _v0.a;
			return $elm$json$Json$Decode$succeed(
				$pilatch$elm_chess$Game$toEnd(game));
		} else {
			return $elm$json$Json$Decode$fail('Invalid PGN');
		}
	},
	$elm$json$Json$Decode$string);
var $author$project$Chess$gameStateDecoder = A9(
	$elm$json$Json$Decode$map8,
	F8(
		function (b, ba, i, g, e, o, w, wa) {
			return {f: b, E: ba, o: g, bT: i, M: e, a3: o, m: w, I: wa};
		}),
	A2($elm$json$Json$Decode$field, 'black', $elm$json$Json$Decode$string),
	A2($elm$json$Json$Decode$field, 'black_accepted', $elm$json$Json$Decode$bool),
	A2($elm$json$Json$Decode$field, 'instigator', $elm$json$Json$Decode$string),
	A2($elm$json$Json$Decode$field, 'pgn', $author$project$Chess$pgnDecoder),
	A2($elm$json$Json$Decode$field, 'last_move', $elm$json$Json$Decode$string),
	A2($elm$json$Json$Decode$field, 'origin_server_ts', $author$project$Internal$Tools$Timestamp$timestampDecoder),
	A2($elm$json$Json$Decode$field, 'white', $elm$json$Json$Decode$string),
	A2($elm$json$Json$Decode$field, 'white_accepted', $elm$json$Json$Decode$bool));
var $author$project$Chess$accountDataDecoder = $elm$json$Json$Decode$dict($author$project$Chess$gameStateDecoder);
var $elm$json$Json$Decode$decodeValue = _Json_run;
var $author$project$Internal$Tools$Hashdict$get = F2(
	function (k, _v0) {
		var h = _v0;
		return A2($elm$core$Dict$get, k, h.X);
	});
var $author$project$Internal$Values$Vault$getRoomById = F2(
	function (roomId, _v0) {
		var cred = _v0;
		return A2($author$project$Internal$Tools$Hashdict$get, roomId, cred.cT);
	});
var $author$project$Internal$Room$Room = $elm$core$Basics$identity;
var $author$project$Internal$Room$withCredentials = F2(
	function (context, room) {
		return {bP: context, bu: room};
	});
var $author$project$Internal$Vault$getRoomById = F2(
	function (roomId, _v0) {
		var cred = _v0.n;
		var context = _v0.bP;
		return A2(
			$elm$core$Maybe$map,
			$author$project$Internal$Room$withCredentials(context),
			A2($author$project$Internal$Values$Vault$getRoomById, roomId, cred));
	});
var $author$project$Matrix$getRoomById = $author$project$Internal$Vault$getRoomById;
var $author$project$Chess$fromAccountData = F2(
	function (roomId, vault) {
		return A2(
			$elm$core$Maybe$withDefault,
			$elm$core$Dict$empty,
			A2(
				$elm$core$Maybe$andThen,
				$elm$core$Result$toMaybe,
				A2(
					$elm$core$Maybe$map,
					$elm$json$Json$Decode$decodeValue($author$project$Chess$accountDataDecoder),
					A2(
						$elm$core$Maybe$andThen,
						$author$project$Matrix$Room$accountData($author$project$Chess$accountDataEventType),
						A2($author$project$Matrix$getRoomById, roomId, vault)))));
	});
var $elm$core$Dict$values = function (dict) {
	return A3(
		$elm$core$Dict$foldr,
		F3(
			function (key, value, valueList) {
				return A2($elm$core$List$cons, value, valueList);
			}),
		_List_Nil,
		dict);
};
var $author$project$Internal$Tools$Hashdict$values = function (_v0) {
	var h = _v0;
	return $elm$core$Dict$values(h.X);
};
var $author$project$Internal$Values$Vault$getRooms = function (_v0) {
	var rooms = _v0.cT;
	return $author$project$Internal$Tools$Hashdict$values(rooms);
};
var $author$project$Internal$Vault$rooms = function (_v0) {
	var cred = _v0.n;
	var context = _v0.bP;
	return A2(
		$elm$core$List$map,
		$author$project$Internal$Room$withCredentials(context),
		$author$project$Internal$Values$Vault$getRooms(cred));
};
var $author$project$Matrix$getRooms = $author$project$Internal$Vault$rooms;
var $author$project$Internal$Values$Timeline$mostRecentEvents = function (_v0) {
	var t = _v0;
	return t.e;
};
var $author$project$Internal$Values$Room$mostRecentEvents = function (_v0) {
	var room = _v0;
	return A2(
		$elm$core$List$append,
		$author$project$Internal$Values$Timeline$mostRecentEvents(room.ba),
		room.g0);
};
var $author$project$Internal$Event$Event = $elm$core$Basics$identity;
var $author$project$Internal$Event$withCredentials = F2(
	function (context, event) {
		return {bP: context, bQ: event};
	});
var $author$project$Internal$Room$mostRecentEvents = function (_v0) {
	var context = _v0.bP;
	var room = _v0.bu;
	return A2(
		$elm$core$List$map,
		$author$project$Internal$Event$withCredentials(context),
		$author$project$Internal$Values$Room$mostRecentEvents(room));
};
var $author$project$Matrix$Room$mostRecentEvents = $author$project$Internal$Room$mostRecentEvents;
var $author$project$Internal$Room$roomId = A2($elm$core$Basics$composeR, $author$project$Internal$Room$withoutCredentials, $author$project$Internal$Values$Room$roomId);
var $author$project$Matrix$Room$roomId = $author$project$Internal$Room$roomId;
var $elm$core$List$sortBy = _List_sortBy;
var $author$project$Chess$sorted = $elm$core$List$sortBy(
	A2(
		$elm$core$Basics$composeR,
		function ($) {
			return $.an;
		},
		A2(
			$elm$core$Basics$composeR,
			function ($) {
				return $.a3;
			},
			$elm$time$Time$posixToMillis)));
var $author$project$Internal$Values$Event$content = function (_v0) {
	var e = _v0;
	return e.bf;
};
var $author$project$Internal$Event$withoutCredentials = function (_v0) {
	var event = _v0.bQ;
	return event;
};
var $author$project$Internal$Event$content = A2($elm$core$Basics$composeR, $author$project$Internal$Event$withoutCredentials, $author$project$Internal$Values$Event$content);
var $author$project$Matrix$Event$content = $author$project$Internal$Event$content;
var $author$project$Internal$Values$Event$eventType = function (_v0) {
	var e = _v0;
	return e.fB;
};
var $author$project$Internal$Event$eventType = A2($elm$core$Basics$composeR, $author$project$Internal$Event$withoutCredentials, $author$project$Internal$Values$Event$eventType);
var $author$project$Matrix$Event$eventType = $author$project$Internal$Event$eventType;
var $author$project$Chess$Accept = function (a) {
	return {$: 1, a: a};
};
var $author$project$Chess$Invite = function (a) {
	return {$: 0, a: a};
};
var $author$project$Chess$Leave = function (a) {
	return {$: 4, a: a};
};
var $author$project$Chess$Move = function (a) {
	return {$: 3, a: a};
};
var $author$project$Chess$Reject = function (a) {
	return {$: 2, a: a};
};
var $elm$json$Json$Decode$at = F2(
	function (fields, decoder) {
		return A3($elm$core$List$foldr, $elm$json$Json$Decode$field, decoder, fields);
	});
var $author$project$Chess$acceptChessDecoder = A2(
	$elm$json$Json$Decode$andThen,
	function (relType) {
		return _Utils_eq(relType, $author$project$Chess$gameMetaRelType) ? A3(
			$elm$json$Json$Decode$map2,
			F2(
				function (reason, relatedTo) {
					return {bt: reason, C: relatedTo};
				}),
			$elm$json$Json$Decode$maybe(
				A2($elm$json$Json$Decode$field, 'reason', $elm$json$Json$Decode$string)),
			A2(
				$elm$json$Json$Decode$at,
				_List_fromArray(
					['m.relates_to', 'event_id']),
				$elm$json$Json$Decode$string)) : $elm$json$Json$Decode$fail('Invalid relType for accepting a chess game.');
	},
	A2(
		$elm$json$Json$Decode$at,
		_List_fromArray(
			['m.relates_to', 'relType']),
		$elm$json$Json$Decode$string));
var $author$project$Chess$chessMoveDecoder = A2(
	$elm$json$Json$Decode$andThen,
	function (relType) {
		return _Utils_eq(relType, $author$project$Chess$gameChessMoveRelType) ? A4(
			$elm$json$Json$Decode$map3,
			F3(
				function (g, lm, r) {
					return {M: lm, bV: g, C: r};
				}),
			A2($elm$json$Json$Decode$field, 'pgn', $author$project$Chess$pgnDecoder),
			A2($elm$json$Json$Decode$field, 'last_move', $elm$json$Json$Decode$string),
			A2(
				$elm$json$Json$Decode$at,
				_List_fromArray(
					['m.relates_to', 'event_id']),
				$elm$json$Json$Decode$string)) : $elm$json$Json$Decode$fail('Invalid relType for making a move in chess.');
	},
	A2(
		$elm$json$Json$Decode$at,
		_List_fromArray(
			['m.relates_to', 'relType']),
		$elm$json$Json$Decode$string));
var $author$project$Chess$gameLeaveEventType = 'me.noordstar.game.leave';
var $author$project$Chess$inviteEventDecoder = A2(
	$elm$json$Json$Decode$andThen,
	function (gId) {
		return _Utils_eq(gId, $author$project$Chess$gameId) ? A3(
			$elm$json$Json$Decode$map2,
			F2(
				function (b, w) {
					return {f: b, m: w};
				}),
			A2(
				$elm$json$Json$Decode$at,
				_List_fromArray(
					['data', 'black']),
				$elm$json$Json$Decode$string),
			A2(
				$elm$json$Json$Decode$at,
				_List_fromArray(
					['data', 'white']),
				$elm$json$Json$Decode$string)) : $elm$json$Json$Decode$fail('Unsupported game type.');
	},
	A2($elm$json$Json$Decode$field, 'id', $elm$json$Json$Decode$string));
var $author$project$Chess$leaveGameDecoder = $author$project$Chess$acceptChessDecoder;
var $author$project$Chess$rejectChessDecoder = $author$project$Chess$acceptChessDecoder;
var $author$project$Chess$relevantEventDecoder = function (eventType) {
	return _Utils_eq(eventType, $author$project$Chess$gameInviteEventType) ? A2($elm$json$Json$Decode$map, $author$project$Chess$Invite, $author$project$Chess$inviteEventDecoder) : (_Utils_eq(eventType, $author$project$Chess$acceptChessEventType) ? A2($elm$json$Json$Decode$map, $author$project$Chess$Accept, $author$project$Chess$acceptChessDecoder) : (_Utils_eq(eventType, $author$project$Chess$rejectChessEventType) ? A2($elm$json$Json$Decode$map, $author$project$Chess$Reject, $author$project$Chess$rejectChessDecoder) : (_Utils_eq(eventType, $author$project$Chess$gameChessMoveEventType) ? A2($elm$json$Json$Decode$map, $author$project$Chess$Move, $author$project$Chess$chessMoveDecoder) : (_Utils_eq(eventType, $author$project$Chess$gameLeaveEventType) ? A2($elm$json$Json$Decode$map, $author$project$Chess$Leave, $author$project$Chess$leaveGameDecoder) : $elm$json$Json$Decode$fail('Not a relevant event.')))));
};
var $author$project$Chess$decodeRelevantEvent = function (event) {
	return $elm$core$Result$toMaybe(
		A2(
			$elm$json$Json$Decode$decodeValue,
			$author$project$Chess$relevantEventDecoder(
				$author$project$Matrix$Event$eventType(event)),
			$author$project$Matrix$Event$content(event)));
};
var $pilatch$elm_chess$Game$empty = $pilatch$elm_chess$Internal$Game$empty;
var $author$project$Chess$emptyGame = function (_v0) {
	var black = _v0.f;
	var eventId = _v0.du;
	var roomId = _v0.eg;
	var white = _v0.m;
	return A2(
		$elm$core$Maybe$withDefault,
		$pilatch$elm_chess$Game$empty,
		$pilatch$elm_chess$Game$fromPgn(
			A2(
				$elm$core$String$join,
				'',
				A2(
					$elm$core$List$map,
					A2($elm$core$String$replace, '\"', '\\\"'),
					_List_fromArray(
						['[Event \"', eventId, '\"]\n[Site \"', roomId, '\"]\n[Black \"', black, '\"]\n[White \"', white, '\"]\n\n *'])))));
};
var $author$project$Internal$Values$Event$eventId = function (_v0) {
	var e = _v0;
	return e.du;
};
var $author$project$Internal$Event$eventId = A2($elm$core$Basics$composeR, $author$project$Internal$Event$withoutCredentials, $author$project$Internal$Values$Event$eventId);
var $author$project$Matrix$Event$eventId = $author$project$Internal$Event$eventId;
var $pilatch$elm_chess$Position$isCheckmate = $pilatch$elm_chess$Internal$Position$isCheckmate;
var $pilatch$elm_chess$Position$sideToMove = $pilatch$elm_chess$Internal$Position$sideToMove;
var $author$project$Chess$isAllowedToMove = F2(
	function (sender, _v0) {
		var black = _v0.f;
		var game = _v0.o;
		var white = _v0.m;
		var position = $pilatch$elm_chess$Game$position(
			$pilatch$elm_chess$Game$toEnd(game));
		return $pilatch$elm_chess$Position$isCheckmate(position) ? false : (_Utils_eq(
			$pilatch$elm_chess$Position$sideToMove(position),
			$pilatch$elm_chess$PieceColor$black) ? _Utils_eq(sender, black) : _Utils_eq(sender, white));
	});
var $pilatch$elm_chess$Game$moves = function (game) {
	var g = game;
	return $pilatch$elm_chess$Internal$Game$moves(g);
};
var $author$project$Chess$isOneMoreMove = F2(
	function (game1, game2) {
		var newGame = A2(
			$elm$core$Maybe$map,
			function (move) {
				return A2(
					$pilatch$elm_chess$Game$addMove,
					move,
					$pilatch$elm_chess$Game$toEnd(game1));
			},
			$elm$core$List$head(
				$elm$core$List$reverse(
					$pilatch$elm_chess$Game$moves(game2))));
		if (newGame.$ === 1) {
			return false;
		} else {
			var g = newGame.a;
			return _Utils_eq(
				$pilatch$elm_chess$Game$toEnd(g),
				$pilatch$elm_chess$Game$toEnd(game2));
		}
	});
var $author$project$Internal$Values$Event$originServerTs = function (_v0) {
	var e = _v0;
	return e.cN;
};
var $author$project$Internal$Event$originServerTs = A2($elm$core$Basics$composeR, $author$project$Internal$Event$withoutCredentials, $author$project$Internal$Values$Event$originServerTs);
var $author$project$Matrix$Event$originServerTs = $author$project$Internal$Event$originServerTs;
var $author$project$Internal$Values$Event$roomId = function (_v0) {
	var e = _v0;
	return e.eg;
};
var $author$project$Internal$Event$roomId = A2($elm$core$Basics$composeR, $author$project$Internal$Event$withoutCredentials, $author$project$Internal$Values$Event$roomId);
var $author$project$Matrix$Event$roomId = $author$project$Internal$Event$roomId;
var $author$project$Internal$Values$Event$sender = function (_v0) {
	var e = _v0;
	return e.cU;
};
var $author$project$Internal$Event$sender = A2($elm$core$Basics$composeR, $author$project$Internal$Event$withoutCredentials, $author$project$Internal$Values$Event$sender);
var $author$project$Matrix$Event$sender = $author$project$Internal$Event$sender;
var $author$project$Chess$updateGameWith = F2(
	function (event, accountData) {
		var _v0 = $author$project$Chess$decodeRelevantEvent(event);
		if (_v0.$ === 1) {
			return accountData;
		} else {
			switch (_v0.a.$) {
				case 0:
					var black = _v0.a.a.f;
					var white = _v0.a.a.m;
					return A3(
						$elm$core$Dict$insert,
						$author$project$Matrix$Event$eventId(event),
						{
							f: black,
							E: _Utils_eq(
								$author$project$Matrix$Event$sender(event),
								black),
							o: $author$project$Chess$emptyGame(
								{
									f: black,
									du: $author$project$Matrix$Event$eventId(event),
									eg: $author$project$Matrix$Event$roomId(event),
									m: white
								}),
							bT: $author$project$Matrix$Event$sender(event),
							M: $author$project$Matrix$Event$eventId(event),
							a3: $author$project$Matrix$Event$originServerTs(event),
							m: white,
							I: _Utils_eq(
								$author$project$Matrix$Event$sender(event),
								white)
						},
						accountData);
				case 1:
					var relatedTo = _v0.a.a.C;
					return A3(
						$elm$core$Dict$update,
						relatedTo,
						$elm$core$Maybe$map(
							function (state) {
								return _Utils_update(
									state,
									{
										E: _Utils_eq(
											$author$project$Matrix$Event$sender(event),
											state.f) ? true : state.E,
										I: _Utils_eq(
											$author$project$Matrix$Event$sender(event),
											state.m) ? true : state.I
									});
							}),
						accountData);
				case 2:
					var relatedTo = _v0.a.a.C;
					return A3(
						$elm$core$Dict$update,
						relatedTo,
						$elm$core$Maybe$andThen(
							function (state) {
								return ($elm$core$List$length(
									$pilatch$elm_chess$Game$moves(state.o)) <= 1) ? $elm$core$Maybe$Nothing : $elm$core$Maybe$Just(
									_Utils_update(
										state,
										{
											E: false,
											o: A2(
												$elm$core$Maybe$withDefault,
												state.o,
												$pilatch$elm_chess$Game$fromPgn(
													A3(
														$elm$core$Basics$apR,
														$pilatch$elm_chess$Game$toPgn(state.o),
														$elm$core$Basics$append,
														_Utils_eq(
															$author$project$Matrix$Event$sender(event),
															state.f) ? ' 1-0' : ' 0-1'))),
											I: false
										}));
							}),
						accountData);
				case 4:
					var relatedTo = _v0.a.a.C;
					return A3(
						$elm$core$Dict$update,
						relatedTo,
						$elm$core$Maybe$map(
							function (state) {
								return _Utils_update(
									state,
									{
										E: false,
										o: A2(
											$elm$core$Maybe$withDefault,
											state.o,
											$pilatch$elm_chess$Game$fromPgn(
												A3(
													$elm$core$Basics$apR,
													$pilatch$elm_chess$Game$toPgn(state.o),
													$elm$core$Basics$append,
													_Utils_eq(
														$author$project$Matrix$Event$sender(event),
														state.f) ? ' 1-0' : ' 0-1'))),
										I: false
									});
							}),
						accountData);
				default:
					var newGame = _v0.a.a.bV;
					var lastMove = _v0.a.a.M;
					var relatedTo = _v0.a.a.C;
					return A3(
						$elm$core$Dict$update,
						relatedTo,
						$elm$core$Maybe$map(
							function (state) {
								return A2(
									$author$project$Chess$isAllowedToMove,
									$author$project$Matrix$Event$sender(event),
									state) ? (_Utils_eq(state.M, lastMove) ? (A2($author$project$Chess$isOneMoreMove, state.o, newGame) ? ((state.E && state.I) ? _Utils_update(
									state,
									{
										o: newGame,
										M: $author$project$Matrix$Event$eventId(event),
										a3: $author$project$Matrix$Event$originServerTs(event)
									}) : state) : state) : state) : state;
							}),
						accountData);
			}
		}
	});
var $author$project$Chess$resolve = function (vault) {
	return function (s) {
		return _Utils_update(
			s,
			{
				bv: $author$project$Chess$sorted(s.bv)
			});
	}(
		A3(
			$elm$core$List$foldl,
			F2(
				function (_v1, _v2) {
					var state = _v1.es;
					var needsChange = _v1.dW;
					var accountDataToUpdate = _v2.b1;
					var states = _v2.bv;
					return {
						b1: function () {
							if (needsChange.$ === 1) {
								return accountDataToUpdate;
							} else {
								var a = needsChange.a;
								return A2($elm$core$List$cons, a, accountDataToUpdate);
							}
						}(),
						bv: A2($elm$core$List$append, state, states)
					};
				}),
			{b1: _List_Nil, bv: _List_Nil},
			A2(
				$elm$core$List$map,
				function (room) {
					var accountData = A2(
						$author$project$Chess$fromAccountData,
						$author$project$Matrix$Room$roomId(room),
						vault);
					var newAccountData = A3(
						$elm$core$Basics$apR,
						accountData,
						$elm$core$List$foldl($author$project$Chess$updateGameWith),
						$author$project$Matrix$Room$mostRecentEvents(room));
					return {
						dW: _Utils_eq(accountData, newAccountData) ? $elm$core$Maybe$Nothing : $elm$core$Maybe$Just(
							{
								an: $author$project$Chess$encodeAccountData(newAccountData),
								bu: room
							}),
						es: A2(
							$elm$core$List$map,
							function (_v0) {
								var matchId = _v0.a;
								var state = _v0.b;
								return {an: state, cG: matchId, bu: room};
							},
							$elm$core$Dict$toList(newAccountData))
					};
				},
				$author$project$Matrix$getRooms(vault))));
};
var $author$project$Internal$Api$VaultUpdate$GetEvent = F2(
	function (a, b) {
		return {$: 4, a: a, b: b};
	});
var $author$project$Internal$Api$GetEvent$V1$SpecObjects$UnsignedData = $elm$core$Basics$identity;
function $author$project$Internal$Api$GetEvent$V1$SpecObjects$cyclic$unsignedDataDecoder() {
	return A5(
		$elm$json$Json$Decode$map4,
		F4(
			function (a, b, c, d) {
				return {df: a, d4: b, ea: c, ez: d};
			}),
		A2($author$project$Internal$Tools$DecodeExtra$opField, 'age', $elm$json$Json$Decode$int),
		A2($author$project$Internal$Tools$DecodeExtra$opField, 'prev_content', $elm$json$Json$Decode$value),
		A2(
			$author$project$Internal$Tools$DecodeExtra$opField,
			'redacted_because',
			$author$project$Internal$Api$GetEvent$V1$SpecObjects$cyclic$clientEventDecoder()),
		A2($author$project$Internal$Tools$DecodeExtra$opField, 'transaction_id', $elm$json$Json$Decode$string));
}
function $author$project$Internal$Api$GetEvent$V1$SpecObjects$cyclic$clientEventDecoder() {
	return A9(
		$elm$json$Json$Decode$map8,
		F8(
			function (a, b, c, d, e, f, g, h) {
				return {bf: a, du: b, fB: g, cN: c, eg: d, cU: e, gT: f, c4: h};
			}),
		A2($elm$json$Json$Decode$field, 'content', $elm$json$Json$Decode$value),
		A2($elm$json$Json$Decode$field, 'event_id', $elm$json$Json$Decode$string),
		A2($elm$json$Json$Decode$field, 'origin_server_ts', $author$project$Internal$Tools$Timestamp$timestampDecoder),
		A2($elm$json$Json$Decode$field, 'room_id', $elm$json$Json$Decode$string),
		A2($elm$json$Json$Decode$field, 'sender', $elm$json$Json$Decode$string),
		A2($author$project$Internal$Tools$DecodeExtra$opField, 'state_key', $elm$json$Json$Decode$string),
		A2($elm$json$Json$Decode$field, 'type', $elm$json$Json$Decode$string),
		A2(
			$author$project$Internal$Tools$DecodeExtra$opField,
			'unsigned',
			$elm$json$Json$Decode$lazy(
				function (_v0) {
					return $author$project$Internal$Api$GetEvent$V1$SpecObjects$cyclic$unsignedDataDecoder();
				})));
}
var $author$project$Internal$Api$GetEvent$V1$SpecObjects$unsignedDataDecoder = $author$project$Internal$Api$GetEvent$V1$SpecObjects$cyclic$unsignedDataDecoder();
$author$project$Internal$Api$GetEvent$V1$SpecObjects$cyclic$unsignedDataDecoder = function () {
	return $author$project$Internal$Api$GetEvent$V1$SpecObjects$unsignedDataDecoder;
};
var $author$project$Internal$Api$GetEvent$V1$SpecObjects$clientEventDecoder = $author$project$Internal$Api$GetEvent$V1$SpecObjects$cyclic$clientEventDecoder();
$author$project$Internal$Api$GetEvent$V1$SpecObjects$cyclic$clientEventDecoder = function () {
	return $author$project$Internal$Api$GetEvent$V1$SpecObjects$clientEventDecoder;
};
var $author$project$Internal$Tools$Context$getSentEvent = function (_v0) {
	var sentEvent = _v0.cV;
	return sentEvent;
};
var $author$project$Internal$Api$Request$ReplaceInUrl = F2(
	function (a, b) {
		return {$: 5, a: a, b: b};
	});
var $author$project$Internal$Api$Request$replaceInUrl = F3(
	function (key, value, _v0) {
		return A2(
			$author$project$Internal$Api$Request$ReplaceInUrl,
			'{' + (key + '}'),
			$elm$url$Url$percentEncode(value));
	});
var $author$project$Internal$Api$GetEvent$Api$getEventInputV1 = F2(
	function (data, context) {
		return A2(
			$author$project$Internal$Api$Request$toTask,
			$author$project$Internal$Api$GetEvent$V1$SpecObjects$clientEventDecoder,
			A2(
				$author$project$Internal$Api$Request$withAttributes,
				_List_fromArray(
					[
						$author$project$Internal$Api$Request$accessToken,
						A2(
						$author$project$Internal$Api$Request$replaceInUrl,
						'eventId',
						$author$project$Internal$Tools$Context$getSentEvent(context)),
						A2($author$project$Internal$Api$Request$replaceInUrl, 'roomId', data.eg)
					]),
				A3($author$project$Internal$Api$Request$callApi, 'GET', '/_matrix/client/v3/rooms/{roomId}/event/{eventId}', context)));
	});
var $author$project$Internal$Api$GetEvent$Main$getEvent = F2(
	function (context, input) {
		return A3(
			$elm$core$Basics$apR,
			A2(
				$elm$core$Maybe$withDefault,
				$elm$core$Basics$always(
					$elm$core$Basics$always(
						$elm$core$Task$fail($author$project$Internal$Tools$Exceptions$UnsupportedSpecVersion))),
				A2(
					$author$project$Internal$Tools$VersionControl$mostRecentFromVersionList,
					$author$project$Internal$Tools$Context$getVersions(context),
					A2(
						$author$project$Internal$Tools$VersionControl$sameForVersion,
						'v1.6',
						A2(
							$author$project$Internal$Tools$VersionControl$sameForVersion,
							'v1.5',
							A2(
								$author$project$Internal$Tools$VersionControl$sameForVersion,
								'v1.4',
								A2(
									$author$project$Internal$Tools$VersionControl$sameForVersion,
									'v1.3',
									A2(
										$author$project$Internal$Tools$VersionControl$sameForVersion,
										'v1.2',
										A2(
											$author$project$Internal$Tools$VersionControl$sameForVersion,
											'v1.1',
											A2(
												$author$project$Internal$Tools$VersionControl$sameForVersion,
												'r0.6.1',
												A2(
													$author$project$Internal$Tools$VersionControl$sameForVersion,
													'r0.6.0',
													$author$project$Internal$Tools$VersionControl$withBottomLayer(
														{dq: $author$project$Internal$Api$GetEvent$Api$getEventInputV1, eC: 'r0.5.0'}))))))))))),
			$elm$core$Basics$apR(input),
			context);
	});
var $author$project$Internal$Api$VaultUpdate$getEvent = function (input) {
	return A3(
		$author$project$Internal$Api$VaultUpdate$toChain,
		function (output) {
			return {
				bh: $elm$core$Basics$identity,
				bo: _List_fromArray(
					[
						A2($author$project$Internal$Api$VaultUpdate$GetEvent, input, output)
					])
			};
		},
		$author$project$Internal$Api$GetEvent$Main$getEvent,
		input);
};
var $author$project$Internal$Api$VaultUpdate$CurrentTimestamp = function (a) {
	return {$: 3, a: a};
};
var $author$project$Internal$Tools$Context$setTimestamp = F2(
	function (timestamp, _v0) {
		var data = _v0;
		return _Utils_update(
			data,
			{c1: timestamp});
	});
var $author$project$Internal$Api$VaultUpdate$getTimestamp = A3(
	$author$project$Internal$Api$VaultUpdate$toChain,
	function (output) {
		return {
			bh: $author$project$Internal$Tools$Context$setTimestamp(output),
			bo: _List_fromArray(
				[
					$author$project$Internal$Api$VaultUpdate$CurrentTimestamp(output)
				])
		};
	},
	$elm$core$Basics$always(
		$elm$core$Basics$always($elm$time$Time$now)),
	0);
var $chain_partners$elm_bignum$Integer$addMagnitudes_ = F3(
	function (m1, m2, acc) {
		addMagnitudes_:
		while (true) {
			var _v0 = _Utils_Tuple2(m1, m2);
			if (!_v0.a.b) {
				if (!_v0.b.b) {
					return $elm$core$List$reverse(acc);
				} else {
					return _Utils_ap(
						$elm$core$List$reverse(acc),
						m2);
				}
			} else {
				if (!_v0.b.b) {
					return _Utils_ap(
						$elm$core$List$reverse(acc),
						m1);
				} else {
					var _v1 = _v0.a;
					var d1 = _v1.a;
					var ds1 = _v1.b;
					var _v2 = _v0.b;
					var d2 = _v2.a;
					var ds2 = _v2.b;
					var $temp$m1 = ds1,
						$temp$m2 = ds2,
						$temp$acc = A2($elm$core$List$cons, d1 + d2, acc);
					m1 = $temp$m1;
					m2 = $temp$m2;
					acc = $temp$acc;
					continue addMagnitudes_;
				}
			}
		}
	});
var $chain_partners$elm_bignum$Integer$handleFinalCarry = function (_v0) {
	var c = _v0.a;
	var m = _v0.b;
	if (!c) {
		return m;
	} else {
		if (!m.b) {
			return _List_Nil;
		} else {
			var d = m.a;
			var ds = m.b;
			return (!(d + c)) ? ds : A2($elm$core$List$cons, c, m);
		}
	}
};
var $chain_partners$elm_bignum$Integer$normalizeDigit = F2(
	function (d, _v0) {
		var prevCarry = _v0.a;
		var acc = _v0.b;
		var sum = d + prevCarry;
		var d_ = A2($elm$core$Basics$modBy, $chain_partners$elm_bignum$Integer$defaultBase, sum);
		var carry = (sum < 0) ? (-1) : ((sum / $chain_partners$elm_bignum$Integer$defaultBase) | 0);
		return _Utils_Tuple2(
			carry,
			A2($elm$core$List$cons, d_, acc));
	});
var $elm$core$List$isEmpty = function (xs) {
	if (!xs.b) {
		return true;
	} else {
		return false;
	}
};
var $chain_partners$elm_bignum$Integer$trimLeadingZeroFromMag = A2(
	$elm$core$List$foldr,
	F2(
		function (x, xs) {
			return ((!x) && $elm$core$List$isEmpty(xs)) ? _List_Nil : A2($elm$core$List$cons, x, xs);
		}),
	_List_Nil);
var $chain_partners$elm_bignum$Integer$normalizeMagnitude = function (m) {
	return $chain_partners$elm_bignum$Integer$trimLeadingZeroFromMag(
		$elm$core$List$reverse(
			$chain_partners$elm_bignum$Integer$handleFinalCarry(
				A3(
					$elm$core$List$foldl,
					$chain_partners$elm_bignum$Integer$normalizeDigit,
					_Utils_Tuple2(0, _List_Nil),
					m))));
};
var $chain_partners$elm_bignum$Integer$addMagnitudes = F2(
	function (m1, m2) {
		return $chain_partners$elm_bignum$Integer$normalizeMagnitude(
			A3($chain_partners$elm_bignum$Integer$addMagnitudes_, m1, m2, _List_Nil));
	});
var $chain_partners$elm_bignum$Integer$compareMag_ = F2(
	function (m1, m2) {
		compareMag_:
		while (true) {
			var _v0 = _Utils_Tuple2(m1, m2);
			if (!_v0.a.b) {
				if (!_v0.b.b) {
					return 1;
				} else {
					var _v2 = _v0.b;
					var d = _v2.a;
					var ds = _v2.b;
					return 0;
				}
			} else {
				if (!_v0.b.b) {
					var _v1 = _v0.a;
					var d = _v1.a;
					var ds = _v1.b;
					return 2;
				} else {
					var _v3 = _v0.a;
					var d1 = _v3.a;
					var ds1 = _v3.b;
					var _v4 = _v0.b;
					var d2 = _v4.a;
					var ds2 = _v4.b;
					var _v5 = A2($elm$core$Basics$compare, d1, d2);
					switch (_v5) {
						case 2:
							return 2;
						case 1:
							var $temp$m1 = ds1,
								$temp$m2 = ds2;
							m1 = $temp$m1;
							m2 = $temp$m2;
							continue compareMag_;
						default:
							return 0;
					}
				}
			}
		}
	});
var $chain_partners$elm_bignum$Integer$compareMag = F2(
	function (m1, m2) {
		var _v0 = A2(
			$elm$core$Basics$compare,
			$elm$core$List$length(m1),
			$elm$core$List$length(m2));
		switch (_v0) {
			case 2:
				return 2;
			case 0:
				return 0;
			default:
				return A2(
					$chain_partners$elm_bignum$Integer$compareMag_,
					$elm$core$List$reverse(m1),
					$elm$core$List$reverse(m2));
		}
	});
var $chain_partners$elm_bignum$Integer$add = F2(
	function (i1, i2) {
		var _v0 = _Utils_Tuple2(i1, i2);
		_v0$4:
		while (true) {
			if (_v0.a.$ === 1) {
				var _v1 = _v0.a;
				return i2;
			} else {
				if (_v0.b.$ === 1) {
					var _v2 = _v0.b;
					return i1;
				} else {
					if (!_v0.a.a) {
						if (_v0.b.a === 1) {
							var _v3 = _v0.a;
							var _v4 = _v3.a;
							var m1 = _v3.b;
							var _v5 = _v0.b;
							var _v6 = _v5.a;
							var m2 = _v5.b;
							var _v7 = A2($chain_partners$elm_bignum$Integer$compareMag, m1, m2);
							switch (_v7) {
								case 2:
									return A2(
										$chain_partners$elm_bignum$Integer$Integer,
										0,
										A2(
											$chain_partners$elm_bignum$Integer$addMagnitudes,
											m1,
											A2($elm$core$List$map, $elm$core$Basics$negate, m2)));
								case 1:
									return $chain_partners$elm_bignum$Integer$Zero;
								default:
									return A2(
										$chain_partners$elm_bignum$Integer$Integer,
										1,
										A2(
											$chain_partners$elm_bignum$Integer$addMagnitudes,
											A2($elm$core$List$map, $elm$core$Basics$negate, m1),
											m2));
							}
						} else {
							break _v0$4;
						}
					} else {
						if (!_v0.b.a) {
							var _v8 = _v0.a;
							var _v9 = _v8.a;
							var m1 = _v8.b;
							var _v10 = _v0.b;
							var _v11 = _v10.a;
							var m2 = _v10.b;
							var _v12 = A2($chain_partners$elm_bignum$Integer$compareMag, m1, m2);
							switch (_v12) {
								case 2:
									return A2(
										$chain_partners$elm_bignum$Integer$Integer,
										1,
										A2(
											$chain_partners$elm_bignum$Integer$addMagnitudes,
											m1,
											A2($elm$core$List$map, $elm$core$Basics$negate, m2)));
								case 1:
									return $chain_partners$elm_bignum$Integer$Zero;
								default:
									return A2(
										$chain_partners$elm_bignum$Integer$Integer,
										0,
										A2(
											$chain_partners$elm_bignum$Integer$addMagnitudes,
											A2($elm$core$List$map, $elm$core$Basics$negate, m1),
											m2));
							}
						} else {
							break _v0$4;
						}
					}
				}
			}
		}
		var _v13 = _v0.a;
		var s1 = _v13.a;
		var m1 = _v13.b;
		var _v14 = _v0.b;
		var s2 = _v14.a;
		var m2 = _v14.b;
		return A2(
			$chain_partners$elm_bignum$Integer$Integer,
			s1,
			A2($chain_partners$elm_bignum$Integer$addMagnitudes, m1, m2));
	});
var $chain_partners$elm_bignum$Integer$abs = function (i) {
	if (i.$ === 1) {
		return $chain_partners$elm_bignum$Integer$Zero;
	} else {
		if (!i.a) {
			var _v1 = i.a;
			return i;
		} else {
			var _v2 = i.a;
			var m = i.b;
			return A2($chain_partners$elm_bignum$Integer$Integer, 0, m);
		}
	}
};
var $chain_partners$elm_bignum$Integer$negate = function (i) {
	if (i.$ === 1) {
		return $chain_partners$elm_bignum$Integer$Zero;
	} else {
		if (!i.a) {
			var _v1 = i.a;
			var m = i.b;
			return A2($chain_partners$elm_bignum$Integer$Integer, 1, m);
		} else {
			var _v2 = i.a;
			var m = i.b;
			return A2($chain_partners$elm_bignum$Integer$Integer, 0, m);
		}
	}
};
var $chain_partners$elm_bignum$Integer$adjustSign = F3(
	function (dividend, divisor, _v0) {
		var q = _v0.a;
		var r = _v0.b;
		var _v1 = _Utils_Tuple2(dividend, divisor);
		_v1$3:
		while (true) {
			if (!_v1.a.$) {
				if (!_v1.a.a) {
					if ((!_v1.b.$) && (_v1.b.a === 1)) {
						var _v2 = _v1.a;
						var _v3 = _v2.a;
						var _v4 = _v1.b;
						var _v5 = _v4.a;
						return _Utils_Tuple2(
							$chain_partners$elm_bignum$Integer$negate(q),
							r);
					} else {
						break _v1$3;
					}
				} else {
					if (!_v1.b.$) {
						if (!_v1.b.a) {
							var _v6 = _v1.a;
							var _v7 = _v6.a;
							var _v8 = _v1.b;
							var _v9 = _v8.a;
							return _Utils_Tuple2(
								$chain_partners$elm_bignum$Integer$negate(q),
								$chain_partners$elm_bignum$Integer$negate(r));
						} else {
							var _v10 = _v1.a;
							var _v11 = _v10.a;
							var _v12 = _v1.b;
							var _v13 = _v12.a;
							return _Utils_Tuple2(
								q,
								$chain_partners$elm_bignum$Integer$negate(r));
						}
					} else {
						break _v1$3;
					}
				}
			} else {
				break _v1$3;
			}
		}
		return _Utils_Tuple2(q, r);
	});
var $chain_partners$elm_bignum$Integer$reverseOrder = function (o) {
	switch (o) {
		case 2:
			return 0;
		case 1:
			return 1;
		default:
			return 2;
	}
};
var $chain_partners$elm_bignum$Integer$compare = F2(
	function (i1, i2) {
		var _v0 = _Utils_Tuple2(i1, i2);
		_v0$7:
		while (true) {
			if (_v0.a.$ === 1) {
				if (_v0.b.$ === 1) {
					var _v1 = _v0.a;
					var _v2 = _v0.b;
					return 1;
				} else {
					if (!_v0.b.a) {
						var _v3 = _v0.a;
						var _v4 = _v0.b;
						var _v5 = _v4.a;
						return 0;
					} else {
						var _v6 = _v0.a;
						var _v7 = _v0.b;
						var _v8 = _v7.a;
						return 2;
					}
				}
			} else {
				if (_v0.b.$ === 1) {
					if (!_v0.a.a) {
						var _v9 = _v0.a;
						var _v10 = _v9.a;
						var _v11 = _v0.b;
						return 2;
					} else {
						var _v12 = _v0.a;
						var _v13 = _v12.a;
						var _v14 = _v0.b;
						return 0;
					}
				} else {
					if (!_v0.a.a) {
						if (_v0.b.a === 1) {
							var _v15 = _v0.a;
							var _v16 = _v15.a;
							var _v17 = _v0.b;
							var _v18 = _v17.a;
							return 2;
						} else {
							break _v0$7;
						}
					} else {
						if (!_v0.b.a) {
							var _v19 = _v0.a;
							var _v20 = _v19.a;
							var _v21 = _v0.b;
							var _v22 = _v21.a;
							return 0;
						} else {
							break _v0$7;
						}
					}
				}
			}
		}
		var _v23 = _v0.a;
		var s1 = _v23.a;
		var m1 = _v23.b;
		var _v24 = _v0.b;
		var s2 = _v24.a;
		var m2 = _v24.b;
		var ord = A2($chain_partners$elm_bignum$Integer$compareMag, m1, m2);
		return ((s1 === 1) && (s2 === 1)) ? $chain_partners$elm_bignum$Integer$reverseOrder(ord) : ord;
	});
var $elm$core$Tuple$second = function (_v0) {
	var y = _v0.b;
	return y;
};
var $chain_partners$elm_bignum$Integer$addScaleToPartialProducts = function (magList) {
	return A3(
		$elm$core$List$foldl,
		F2(
			function (m, _v0) {
				var digit = _v0.a;
				var acc = _v0.b;
				return _Utils_Tuple2(
					digit + 1,
					A2(
						$elm$core$List$cons,
						A2(
							$elm$core$List$append,
							A2($elm$core$List$repeat, digit, 0),
							m),
						acc));
			}),
		_Utils_Tuple2(0, _List_Nil),
		magList).b;
};
var $chain_partners$elm_bignum$Integer$calculatePartialProducts = F2(
	function (m1, m2) {
		return A2(
			$elm$core$List$map,
			function (d) {
				return A2(
					$elm$core$List$map,
					$elm$core$Basics$mul(d),
					m1);
			},
			m2);
	});
var $chain_partners$elm_bignum$Integer$sumPartialProducts = function (magList) {
	return A3($elm$core$List$foldl, $chain_partners$elm_bignum$Integer$addMagnitudes, _List_Nil, magList);
};
var $chain_partners$elm_bignum$Integer$multiplyMagnitudes = F2(
	function (m1, m2) {
		return $chain_partners$elm_bignum$Integer$normalizeMagnitude(
			$chain_partners$elm_bignum$Integer$sumPartialProducts(
				$chain_partners$elm_bignum$Integer$addScaleToPartialProducts(
					A2($chain_partners$elm_bignum$Integer$calculatePartialProducts, m1, m2))));
	});
var $chain_partners$elm_bignum$Integer$mul = F2(
	function (i1, i2) {
		var _v0 = _Utils_Tuple2(i1, i2);
		if (_v0.a.$ === 1) {
			var _v1 = _v0.a;
			return $chain_partners$elm_bignum$Integer$Zero;
		} else {
			if (_v0.b.$ === 1) {
				var _v2 = _v0.b;
				return $chain_partners$elm_bignum$Integer$Zero;
			} else {
				var _v3 = _v0.a;
				var s1 = _v3.a;
				var m1 = _v3.b;
				var _v4 = _v0.b;
				var s2 = _v4.a;
				var m2 = _v4.b;
				var sign = _Utils_eq(s1, s2) ? 0 : 1;
				var magnitude = function () {
					var _v5 = A2(
						$elm$core$Basics$compare,
						$elm$core$List$length(m1),
						$elm$core$List$length(m2));
					if (_v5 === 2) {
						return A2($chain_partners$elm_bignum$Integer$multiplyMagnitudes, m1, m2);
					} else {
						return A2($chain_partners$elm_bignum$Integer$multiplyMagnitudes, m2, m1);
					}
				}();
				return A2($chain_partners$elm_bignum$Integer$Integer, sign, magnitude);
			}
		}
	});
var $chain_partners$elm_bignum$Integer$one = A2(
	$chain_partners$elm_bignum$Integer$Integer,
	0,
	_List_fromArray(
		[1]));
var $chain_partners$elm_bignum$Integer$sub = F2(
	function (i1, i2) {
		var _v0 = _Utils_Tuple2(i1, i2);
		if (_v0.a.$ === 1) {
			var _v1 = _v0.a;
			return $chain_partners$elm_bignum$Integer$negate(i2);
		} else {
			if (_v0.b.$ === 1) {
				var _v2 = _v0.b;
				return i1;
			} else {
				var _v3 = _v0.a;
				var s1 = _v3.a;
				var m1 = _v3.b;
				var _v4 = _v0.b;
				var s2 = _v4.a;
				var m2 = _v4.b;
				return A2(
					$chain_partners$elm_bignum$Integer$add,
					i1,
					$chain_partners$elm_bignum$Integer$negate(i2));
			}
		}
	});
var $chain_partners$elm_bignum$Integer$divmodPartialDividend = F4(
	function (dividend, divisor, divExpediter, acc) {
		divmodPartialDividend:
		while (true) {
			var _v0 = A2($chain_partners$elm_bignum$Integer$compare, dividend, divisor);
			switch (_v0) {
				case 0:
					return _Utils_Tuple2(acc, dividend);
				case 1:
					return _Utils_Tuple2(
						A2($chain_partners$elm_bignum$Integer$add, acc, $chain_partners$elm_bignum$Integer$one),
						$chain_partners$elm_bignum$Integer$Zero);
				default:
					var divisorTimesDivExpediter = A2(
						$chain_partners$elm_bignum$Integer$mul,
						divisor,
						$chain_partners$elm_bignum$Integer$fromInt(divExpediter));
					var _v1 = A2($chain_partners$elm_bignum$Integer$compare, dividend, divisorTimesDivExpediter);
					switch (_v1) {
						case 0:
							var $temp$dividend = dividend,
								$temp$divisor = divisor,
								$temp$divExpediter = (divExpediter / 2) | 0,
								$temp$acc = acc;
							dividend = $temp$dividend;
							divisor = $temp$divisor;
							divExpediter = $temp$divExpediter;
							acc = $temp$acc;
							continue divmodPartialDividend;
						case 1:
							return _Utils_Tuple2(
								A2(
									$chain_partners$elm_bignum$Integer$add,
									acc,
									$chain_partners$elm_bignum$Integer$fromInt(divExpediter)),
								$chain_partners$elm_bignum$Integer$Zero);
						default:
							var dividend_ = A2($chain_partners$elm_bignum$Integer$sub, dividend, divisorTimesDivExpediter);
							var $temp$dividend = dividend_,
								$temp$divisor = divisor,
								$temp$divExpediter = divExpediter,
								$temp$acc = A2(
								$chain_partners$elm_bignum$Integer$add,
								acc,
								$chain_partners$elm_bignum$Integer$fromInt(divExpediter));
							dividend = $temp$dividend;
							divisor = $temp$divisor;
							divExpediter = $temp$divExpediter;
							acc = $temp$acc;
							continue divmodPartialDividend;
					}
			}
		}
	});
var $chain_partners$elm_bignum$Integer$headAndTail = function (i) {
	if (i.$ === 1) {
		return _Utils_Tuple2($chain_partners$elm_bignum$Integer$Zero, $chain_partners$elm_bignum$Integer$Zero);
	} else {
		var s = i.a;
		var m = i.b;
		var rM = $elm$core$List$reverse(m);
		if (!rM.b) {
			return _Utils_Tuple2($chain_partners$elm_bignum$Integer$Zero, $chain_partners$elm_bignum$Integer$Zero);
		} else {
			if (!rM.b.b) {
				var d = rM.a;
				return _Utils_Tuple2(
					$chain_partners$elm_bignum$Integer$fromInt(d),
					$chain_partners$elm_bignum$Integer$Zero);
			} else {
				var d = rM.a;
				var ds = rM.b;
				return _Utils_Tuple2(
					$chain_partners$elm_bignum$Integer$fromInt(d),
					A2(
						$chain_partners$elm_bignum$Integer$Integer,
						s,
						$elm$core$List$reverse(ds)));
			}
		}
	}
};
var $chain_partners$elm_bignum$Integer$shiftRightBy = F2(
	function (n, i) {
		shiftRightBy:
		while (true) {
			if (i.$ === 1) {
				return $chain_partners$elm_bignum$Integer$Zero;
			} else {
				var s = i.a;
				var m = i.b;
				if (n <= 0) {
					return i;
				} else {
					var $temp$n = n - 1,
						$temp$i = A2(
						$chain_partners$elm_bignum$Integer$Integer,
						s,
						A2($elm$core$List$cons, 0, m));
					n = $temp$n;
					i = $temp$i;
					continue shiftRightBy;
				}
			}
		}
	});
var $chain_partners$elm_bignum$Integer$divmod_ = F4(
	function (dividend, divisor, qAcc, prevR) {
		divmod_:
		while (true) {
			var _v0 = _Utils_Tuple2(dividend, divisor);
			if (_v0.a.$ === 1) {
				var _v1 = _v0.a;
				return $elm$core$Maybe$Just(
					_Utils_Tuple2(qAcc, prevR));
			} else {
				var _v2 = $chain_partners$elm_bignum$Integer$headAndTail(dividend);
				var firstDigit = _v2.a;
				var remainingDigits = _v2.b;
				var currentDividend = A2(
					$chain_partners$elm_bignum$Integer$add,
					firstDigit,
					A2($chain_partners$elm_bignum$Integer$shiftRightBy, 1, prevR));
				var _v3 = A4($chain_partners$elm_bignum$Integer$divmodPartialDividend, currentDividend, divisor, $chain_partners$elm_bignum$Integer$defaultBase, $chain_partners$elm_bignum$Integer$Zero);
				var q = _v3.a;
				var r = _v3.b;
				var qAcc_ = A2(
					$chain_partners$elm_bignum$Integer$add,
					q,
					A2($chain_partners$elm_bignum$Integer$shiftRightBy, 1, qAcc));
				var $temp$dividend = remainingDigits,
					$temp$divisor = divisor,
					$temp$qAcc = qAcc_,
					$temp$prevR = r;
				dividend = $temp$dividend;
				divisor = $temp$divisor;
				qAcc = $temp$qAcc;
				prevR = $temp$prevR;
				continue divmod_;
			}
		}
	});
var $chain_partners$elm_bignum$Integer$divmod = F2(
	function (dividend, divisor) {
		var _v0 = _Utils_Tuple2(dividend, divisor);
		_v0$0:
		while (true) {
			_v0$4:
			while (true) {
				if (_v0.b.$ === 1) {
					if (_v0.a.$ === 1) {
						break _v0$0;
					} else {
						var _v2 = _v0.b;
						return $elm$core$Maybe$Nothing;
					}
				} else {
					if (_v0.a.$ === 1) {
						break _v0$0;
					} else {
						if (!_v0.b.a) {
							if ((_v0.b.b.b && (_v0.b.b.a === 1)) && (!_v0.b.b.b.b)) {
								var _v3 = _v0.b;
								var _v4 = _v3.a;
								var _v5 = _v3.b;
								return $elm$core$Maybe$Just(
									_Utils_Tuple2(dividend, $chain_partners$elm_bignum$Integer$Zero));
							} else {
								break _v0$4;
							}
						} else {
							if ((_v0.b.b.b && (_v0.b.b.a === 1)) && (!_v0.b.b.b.b)) {
								var _v6 = _v0.b;
								var _v7 = _v6.a;
								var _v8 = _v6.b;
								return $elm$core$Maybe$Just(
									_Utils_Tuple2(
										$chain_partners$elm_bignum$Integer$negate(dividend),
										$chain_partners$elm_bignum$Integer$Zero));
							} else {
								break _v0$4;
							}
						}
					}
				}
			}
			var _v9 = _v0.a;
			var s1 = _v9.a;
			var m1 = _v9.b;
			var _v10 = _v0.b;
			var s2 = _v10.a;
			var m2 = _v10.b;
			var _v11 = A2($chain_partners$elm_bignum$Integer$compareMag, m1, m2);
			switch (_v11) {
				case 0:
					return $elm$core$Maybe$Just(
						_Utils_Tuple2($chain_partners$elm_bignum$Integer$Zero, dividend));
				case 1:
					var sign = _Utils_eq(s1, s2) ? 0 : 1;
					return $elm$core$Maybe$Just(
						_Utils_Tuple2(
							A2(
								$chain_partners$elm_bignum$Integer$Integer,
								sign,
								_List_fromArray(
									[1])),
							$chain_partners$elm_bignum$Integer$Zero));
				default:
					return A2(
						$elm$core$Maybe$map,
						A2($chain_partners$elm_bignum$Integer$adjustSign, dividend, divisor),
						A4(
							$chain_partners$elm_bignum$Integer$divmod_,
							$chain_partners$elm_bignum$Integer$abs(dividend),
							$chain_partners$elm_bignum$Integer$abs(divisor),
							$chain_partners$elm_bignum$Integer$Zero,
							$chain_partners$elm_bignum$Integer$Zero));
			}
		}
		var _v1 = _v0.a;
		return $elm$core$Maybe$Just(
			_Utils_Tuple2($chain_partners$elm_bignum$Integer$Zero, $chain_partners$elm_bignum$Integer$Zero));
	});
var $chain_partners$elm_bignum$Integer$div = F2(
	function (dividend, divisor) {
		return A2(
			$elm$core$Maybe$map,
			$elm$core$Tuple$first,
			A2($chain_partners$elm_bignum$Integer$divmod, dividend, divisor));
	});
var $chain_partners$elm_bignum$Integer$zero = $chain_partners$elm_bignum$Integer$Zero;
var $Evelios$elm_hash$Hash$dependent = F2(
	function (_v0, _v1) {
		var x = _v0;
		var y = _v1;
		return A2(
			$elm$core$Maybe$withDefault,
			$chain_partners$elm_bignum$Integer$fromInt(0),
			function (from) {
				return A2(
					$chain_partners$elm_bignum$Integer$div,
					from,
					$chain_partners$elm_bignum$Integer$fromInt(2));
			}(
				A3(
					$elm$core$List$foldl,
					$chain_partners$elm_bignum$Integer$add,
					$chain_partners$elm_bignum$Integer$zero,
					_List_fromArray(
						[
							A2($chain_partners$elm_bignum$Integer$mul, x, x),
							A2(
							$chain_partners$elm_bignum$Integer$mul,
							$chain_partners$elm_bignum$Integer$fromInt(3),
							x),
							A2(
							$chain_partners$elm_bignum$Integer$mul,
							$chain_partners$elm_bignum$Integer$fromInt(3),
							A2($chain_partners$elm_bignum$Integer$mul, y, x)),
							y,
							A2($chain_partners$elm_bignum$Integer$mul, y, y)
						]))));
	});
var $chain_partners$elm_bignum$Integer$lt = F2(
	function (i1, i2) {
		var _v0 = A2($chain_partners$elm_bignum$Integer$compare, i1, i2);
		if (!_v0) {
			return true;
		} else {
			return false;
		}
	});
var $Evelios$elm_hash$Hash$independent = F2(
	function (hash1, hash2) {
		var _v0 = _Utils_Tuple2(hash1, hash2);
		var id1 = _v0.a;
		var id2 = _v0.b;
		return A2($chain_partners$elm_bignum$Integer$lt, id2, id1) ? A2($Evelios$elm_hash$Hash$dependent, hash1, hash2) : A2($Evelios$elm_hash$Hash$dependent, hash2, hash1);
	});
var $author$project$Internal$Tools$Context$setTransactionId = F2(
	function (transactionId, _v0) {
		var data = _v0;
		return _Utils_update(
			data,
			{ez: transactionId});
	});
var $author$project$Internal$Api$VaultUpdate$withTransactionId = function (toString) {
	return $elm$core$Basics$always(
		A2(
			$elm$core$Task$map,
			function (now) {
				return {
					bh: $author$project$Internal$Tools$Context$setTransactionId(
						toString(
							$elm$time$Time$posixToMillis(now))),
					bo: _List_Nil
				};
			},
			$elm$time$Time$now));
};
var $author$project$Internal$Api$VaultUpdate$makeVBAT = F2(
	function (toString, cred) {
		return A2(
			$author$project$Internal$Api$Chain$andThen,
			$author$project$Internal$Api$VaultUpdate$withTransactionId(toString),
			$author$project$Internal$Api$VaultUpdate$makeVBA(cred));
	});
var $author$project$Internal$Api$VaultUpdate$MessageEventSent = F2(
	function (a, b) {
		return {$: 11, a: a, b: b};
	});
var $author$project$Internal$Tools$Context$removeTransactionId = function (_v0) {
	var data = _v0;
	return data;
};
var $author$project$Internal$Api$SendMessageEvent$V1$SpecObjects$eventResponseDecoder = A2(
	$elm$json$Json$Decode$map,
	function (a) {
		return {du: a};
	},
	A2($elm$json$Json$Decode$field, 'event_id', $elm$json$Json$Decode$string));
var $author$project$Internal$Api$Request$FullBody = function (a) {
	return {$: 1, a: a};
};
var $author$project$Internal$Api$Request$fullBody = F2(
	function (value, _v0) {
		return $author$project$Internal$Api$Request$FullBody(value);
	});
var $author$project$Internal$Tools$Context$getTransactionId = function (_v0) {
	var transactionId = _v0.ez;
	return transactionId;
};
var $author$project$Internal$Api$Request$withTransactionId = A2(
	$elm$core$Basics$composeR,
	$author$project$Internal$Tools$Context$getTransactionId,
	$author$project$Internal$Api$Request$ReplaceInUrl('txnId'));
var $author$project$Internal$Api$SendMessageEvent$Api$sendMessageEventV1 = function (_v0) {
	var content = _v0.bf;
	var eventType = _v0.fB;
	var roomId = _v0.eg;
	return A2(
		$elm$core$Basics$composeR,
		A2($author$project$Internal$Api$Request$callApi, 'PUT', '/_matrix/client/r0/rooms/{roomId}/send/{eventType}/{txnId}'),
		A2(
			$elm$core$Basics$composeR,
			$author$project$Internal$Api$Request$withAttributes(
				_List_fromArray(
					[
						$author$project$Internal$Api$Request$accessToken,
						$author$project$Internal$Api$Request$withTransactionId,
						A2($author$project$Internal$Api$Request$replaceInUrl, 'eventType', eventType),
						A2($author$project$Internal$Api$Request$replaceInUrl, 'roomId', roomId),
						$author$project$Internal$Api$Request$fullBody(content)
					])),
			$author$project$Internal$Api$Request$toTask($author$project$Internal$Api$SendMessageEvent$V1$SpecObjects$eventResponseDecoder)));
};
var $author$project$Internal$Api$SendMessageEvent$Api$sendMessageEventV2 = function (_v0) {
	var content = _v0.bf;
	var eventType = _v0.fB;
	var roomId = _v0.eg;
	return A2(
		$elm$core$Basics$composeR,
		A2($author$project$Internal$Api$Request$callApi, 'PUT', '/_matrix/client/v3/rooms/{roomId}/send/{eventType}/{txnId}'),
		A2(
			$elm$core$Basics$composeR,
			$author$project$Internal$Api$Request$withAttributes(
				_List_fromArray(
					[
						$author$project$Internal$Api$Request$accessToken,
						$author$project$Internal$Api$Request$withTransactionId,
						A2($author$project$Internal$Api$Request$replaceInUrl, 'eventType', eventType),
						A2($author$project$Internal$Api$Request$replaceInUrl, 'roomId', roomId),
						$author$project$Internal$Api$Request$fullBody(content)
					])),
			$author$project$Internal$Api$Request$toTask($author$project$Internal$Api$SendMessageEvent$V1$SpecObjects$eventResponseDecoder)));
};
var $author$project$Internal$Api$SendMessageEvent$Main$sendMessageEvent = F2(
	function (context, input) {
		return A3(
			$elm$core$Basics$apR,
			A2(
				$elm$core$Maybe$withDefault,
				$elm$core$Basics$always(
					$elm$core$Basics$always(
						$elm$core$Task$fail($author$project$Internal$Tools$Exceptions$UnsupportedSpecVersion))),
				A2(
					$author$project$Internal$Tools$VersionControl$mostRecentFromVersionList,
					$author$project$Internal$Tools$Context$getVersions(context),
					A2(
						$author$project$Internal$Tools$VersionControl$sameForVersion,
						'v1.6',
						A2(
							$author$project$Internal$Tools$VersionControl$sameForVersion,
							'v1.5',
							A2(
								$author$project$Internal$Tools$VersionControl$sameForVersion,
								'v1.4',
								A2(
									$author$project$Internal$Tools$VersionControl$sameForVersion,
									'v1.3',
									A2(
										$author$project$Internal$Tools$VersionControl$sameForVersion,
										'v1.2',
										A2(
											$author$project$Internal$Tools$VersionControl$addMiddleLayer,
											{dq: $author$project$Internal$Api$SendMessageEvent$Api$sendMessageEventV2, fy: $elm$core$Basics$identity, hl: $elm$core$Basics$identity, eC: 'v1.1'},
											A2(
												$author$project$Internal$Tools$VersionControl$sameForVersion,
												'r0.6.1',
												A2(
													$author$project$Internal$Tools$VersionControl$sameForVersion,
													'r0.6.0',
													A2(
														$author$project$Internal$Tools$VersionControl$sameForVersion,
														'r0.5.0',
														A2(
															$author$project$Internal$Tools$VersionControl$sameForVersion,
															'r0.4.0',
															A2(
																$author$project$Internal$Tools$VersionControl$sameForVersion,
																'r0.3.0',
																A2(
																	$author$project$Internal$Tools$VersionControl$sameForVersion,
																	'r0.2.0',
																	A2(
																		$author$project$Internal$Tools$VersionControl$sameForVersion,
																		'r0.1.0',
																		A2(
																			$author$project$Internal$Tools$VersionControl$sameForVersion,
																			'r0.0.1',
																			$author$project$Internal$Tools$VersionControl$withBottomLayer(
																				{dq: $author$project$Internal$Api$SendMessageEvent$Api$sendMessageEventV1, eC: 'r0.0.0'}))))))))))))))))),
			$elm$core$Basics$apR(input),
			context);
	});
var $author$project$Internal$Tools$Context$setSentEvent = F2(
	function (sentEvent, _v0) {
		var data = _v0;
		return _Utils_update(
			data,
			{cV: sentEvent});
	});
var $author$project$Internal$Api$VaultUpdate$sendMessageEvent = function (input) {
	return A2(
		$author$project$Internal$Api$Chain$tryNTimes,
		5,
		A3(
			$author$project$Internal$Api$VaultUpdate$toChain,
			function (output) {
				return {
					bh: A2(
						$elm$core$Basics$composeR,
						$author$project$Internal$Tools$Context$removeTransactionId,
						$author$project$Internal$Tools$Context$setSentEvent(output.du)),
					bo: _List_fromArray(
						[
							A2($author$project$Internal$Api$VaultUpdate$MessageEventSent, input, output)
						])
				};
			},
			$author$project$Internal$Api$SendMessageEvent$Main$sendMessageEvent,
			input));
};
var $author$project$Internal$Api$Task$sendMessageEvent = F2(
	function (_v0, cred) {
		var content = _v0.bf;
		var eventType = _v0.fB;
		var extraTransactionNoise = _v0.bR;
		var roomId = _v0.eg;
		return $author$project$Internal$Api$VaultUpdate$toTask(
			A2(
				$author$project$Internal$Api$Chain$andThen,
				$author$project$Internal$Api$Chain$maybe(
					$author$project$Internal$Api$VaultUpdate$getEvent(
						{eg: roomId})),
				A2(
					$author$project$Internal$Api$Chain$andThen,
					$author$project$Internal$Api$VaultUpdate$sendMessageEvent(
						{bf: content, fB: eventType, eg: roomId}),
					A2(
						$author$project$Internal$Api$Chain$andThen,
						$author$project$Internal$Api$VaultUpdate$getTimestamp,
						A2(
							$author$project$Internal$Api$VaultUpdate$makeVBAT,
							function (now) {
								return $Evelios$elm_hash$Hash$toString(
									A3(
										$elm$core$List$foldl,
										$Evelios$elm_hash$Hash$independent,
										$Evelios$elm_hash$Hash$fromString('send message'),
										_List_fromArray(
											[
												$Evelios$elm_hash$Hash$fromInt(now),
												$Evelios$elm_hash$Hash$fromString(
												A2($elm$json$Json$Encode$encode, 0, content)),
												$Evelios$elm_hash$Hash$fromString(eventType),
												$Evelios$elm_hash$Hash$fromString(extraTransactionNoise),
												$Evelios$elm_hash$Hash$fromString(roomId)
											])));
							},
							cred)))));
	});
var $author$project$Internal$Api$VaultUpdate$StateEventSent = F2(
	function (a, b) {
		return {$: 13, a: a, b: b};
	});
var $author$project$Internal$Api$SendStateKey$V1$SpecObjects$eventResponseDecoder = A2(
	$elm$json$Json$Decode$map,
	function (a) {
		return {du: a};
	},
	A2($elm$json$Json$Decode$field, 'event_id', $elm$json$Json$Decode$string));
var $author$project$Internal$Api$SendStateKey$Api$sendStateKeyV1 = function (_v0) {
	var content = _v0.bf;
	var eventType = _v0.fB;
	var roomId = _v0.eg;
	var stateKey = _v0.gT;
	return A2(
		$elm$core$Basics$composeR,
		A2($author$project$Internal$Api$Request$callApi, 'PUT', '/_matrix/client/r0/rooms/{roomId}/state/{eventType}/{stateKey}'),
		A2(
			$elm$core$Basics$composeR,
			$author$project$Internal$Api$Request$withAttributes(
				_List_fromArray(
					[
						$author$project$Internal$Api$Request$accessToken,
						A2($author$project$Internal$Api$Request$replaceInUrl, 'eventType', eventType),
						A2($author$project$Internal$Api$Request$replaceInUrl, 'roomId', roomId),
						A2($author$project$Internal$Api$Request$replaceInUrl, 'stateKey', stateKey),
						$author$project$Internal$Api$Request$fullBody(content)
					])),
			$author$project$Internal$Api$Request$toTask($author$project$Internal$Api$SendStateKey$V1$SpecObjects$eventResponseDecoder)));
};
var $author$project$Internal$Api$SendStateKey$Api$sendStateKeyV2 = function (_v0) {
	var content = _v0.bf;
	var eventType = _v0.fB;
	var roomId = _v0.eg;
	var stateKey = _v0.gT;
	return A2(
		$elm$core$Basics$composeR,
		A2($author$project$Internal$Api$Request$callApi, 'PUT', '/_matrix/client/v3/rooms/{roomId}/state/{eventType}/{stateKey}'),
		A2(
			$elm$core$Basics$composeR,
			$author$project$Internal$Api$Request$withAttributes(
				_List_fromArray(
					[
						$author$project$Internal$Api$Request$accessToken,
						A2($author$project$Internal$Api$Request$replaceInUrl, 'eventType', eventType),
						A2($author$project$Internal$Api$Request$replaceInUrl, 'roomId', roomId),
						A2($author$project$Internal$Api$Request$replaceInUrl, 'stateKey', stateKey),
						$author$project$Internal$Api$Request$fullBody(content)
					])),
			$author$project$Internal$Api$Request$toTask($author$project$Internal$Api$SendStateKey$V1$SpecObjects$eventResponseDecoder)));
};
var $author$project$Internal$Api$SendStateKey$Main$sendStateKey = F2(
	function (context, input) {
		return A3(
			$elm$core$Basics$apR,
			A2(
				$elm$core$Maybe$withDefault,
				$elm$core$Basics$always(
					$elm$core$Basics$always(
						$elm$core$Task$fail($author$project$Internal$Tools$Exceptions$UnsupportedSpecVersion))),
				A2(
					$author$project$Internal$Tools$VersionControl$mostRecentFromVersionList,
					$author$project$Internal$Tools$Context$getVersions(context),
					A2(
						$author$project$Internal$Tools$VersionControl$sameForVersion,
						'v1.6',
						A2(
							$author$project$Internal$Tools$VersionControl$sameForVersion,
							'v1.5',
							A2(
								$author$project$Internal$Tools$VersionControl$sameForVersion,
								'v1.4',
								A2(
									$author$project$Internal$Tools$VersionControl$sameForVersion,
									'v1.3',
									A2(
										$author$project$Internal$Tools$VersionControl$sameForVersion,
										'v1.2',
										A2(
											$author$project$Internal$Tools$VersionControl$addMiddleLayer,
											{dq: $author$project$Internal$Api$SendStateKey$Api$sendStateKeyV2, fy: $elm$core$Basics$identity, hl: $elm$core$Basics$identity, eC: 'v1.1'},
											A2(
												$author$project$Internal$Tools$VersionControl$sameForVersion,
												'r0.6.1',
												A2(
													$author$project$Internal$Tools$VersionControl$sameForVersion,
													'r0.6.0',
													A2(
														$author$project$Internal$Tools$VersionControl$sameForVersion,
														'r0.5.0',
														A2(
															$author$project$Internal$Tools$VersionControl$sameForVersion,
															'r0.4.0',
															A2(
																$author$project$Internal$Tools$VersionControl$sameForVersion,
																'r0.3.0',
																A2(
																	$author$project$Internal$Tools$VersionControl$sameForVersion,
																	'r0.2.0',
																	A2(
																		$author$project$Internal$Tools$VersionControl$sameForVersion,
																		'r0.1.0',
																		A2(
																			$author$project$Internal$Tools$VersionControl$sameForVersion,
																			'r0.0.1',
																			$author$project$Internal$Tools$VersionControl$withBottomLayer(
																				{dq: $author$project$Internal$Api$SendStateKey$Api$sendStateKeyV1, eC: 'r0.0.0'}))))))))))))))))),
			$elm$core$Basics$apR(input),
			context);
	});
var $author$project$Internal$Api$VaultUpdate$sendStateEvent = function (input) {
	return A2(
		$author$project$Internal$Api$Chain$tryNTimes,
		5,
		A3(
			$author$project$Internal$Api$VaultUpdate$toChain,
			function (output) {
				return {
					bh: $author$project$Internal$Tools$Context$setSentEvent(output.du),
					bo: _List_fromArray(
						[
							A2($author$project$Internal$Api$VaultUpdate$StateEventSent, input, output)
						])
				};
			},
			$author$project$Internal$Api$SendStateKey$Main$sendStateKey,
			input));
};
var $author$project$Internal$Api$Task$sendStateEvent = F2(
	function (data, cred) {
		return $author$project$Internal$Api$VaultUpdate$toTask(
			A2(
				$author$project$Internal$Api$Chain$andThen,
				$author$project$Internal$Api$Chain$maybe(
					$author$project$Internal$Api$VaultUpdate$getEvent(
						{eg: data.eg})),
				A2(
					$author$project$Internal$Api$Chain$andThen,
					$author$project$Internal$Api$VaultUpdate$sendStateEvent(data),
					A2(
						$author$project$Internal$Api$Chain$andThen,
						$author$project$Internal$Api$VaultUpdate$getTimestamp,
						$author$project$Internal$Api$VaultUpdate$makeVBA(cred)))));
	});
var $author$project$Internal$Room$sendEvent = F2(
	function (_v0, _v1) {
		var eventType = _v0.fB;
		var content = _v0.bf;
		var stateKey = _v0.gT;
		var context = _v1.bP;
		var room = _v1.bu;
		if (stateKey.$ === 1) {
			return A2(
				$author$project$Internal$Api$Task$sendMessageEvent,
				{
					bf: content,
					fB: eventType,
					bR: 'send-one-message',
					eg: $author$project$Internal$Values$Room$roomId(room)
				},
				context);
		} else {
			var s = stateKey.a;
			return A2(
				$author$project$Internal$Api$Task$sendStateEvent,
				{
					bf: content,
					fB: eventType,
					eg: $author$project$Internal$Values$Room$roomId(room),
					gT: s
				},
				context);
		}
	});
var $author$project$Matrix$Room$sendOneEvent = $author$project$Internal$Room$sendEvent;
var $author$project$Internal$Api$VaultUpdate$AccountDataSet = F2(
	function (a, b) {
		return {$: 1, a: a, b: b};
	});
var $author$project$Internal$Tools$Context$getUserId = function (_v0) {
	var userId = _v0.c6;
	return userId;
};
var $author$project$Internal$Api$SetAccountData$Api$setAccountDataV1 = F2(
	function (_v0, context) {
		var content = _v0.bf;
		var eventType = _v0.fB;
		var roomId = _v0.eg;
		return A3(
			$elm$core$Basics$composeR,
			function () {
				if (!roomId.$) {
					var rId = roomId.a;
					return A2(
						$elm$core$Basics$composeR,
						A2($author$project$Internal$Api$Request$callApi, 'PUT', '/_matrix/client/r0/user/{userId}/rooms/{roomId}/account_data/{type}'),
						$author$project$Internal$Api$Request$withAttributes(
							_List_fromArray(
								[
									A2($author$project$Internal$Api$Request$replaceInUrl, 'roomId', rId)
								])));
				} else {
					return A2($author$project$Internal$Api$Request$callApi, 'PUT', '/_matrix/client/r0/user/{userId}/account_data/{type}');
				}
			}(),
			A2(
				$elm$core$Basics$composeR,
				$author$project$Internal$Api$Request$withAttributes(
					_List_fromArray(
						[
							$author$project$Internal$Api$Request$accessToken,
							A2($author$project$Internal$Api$Request$replaceInUrl, 'type', eventType),
							A2(
							$author$project$Internal$Api$Request$replaceInUrl,
							'userId',
							$author$project$Internal$Tools$Context$getUserId(context)),
							$author$project$Internal$Api$Request$fullBody(content)
						])),
				$author$project$Internal$Api$Request$toTask(
					A2(
						$elm$json$Json$Decode$map,
						$elm$core$Basics$always(0),
						$elm$json$Json$Decode$value))),
			context);
	});
var $author$project$Internal$Api$SetAccountData$Api$setAccountDataV2 = F2(
	function (_v0, context) {
		var content = _v0.bf;
		var eventType = _v0.fB;
		var roomId = _v0.eg;
		return A3(
			$elm$core$Basics$composeR,
			function () {
				if (!roomId.$) {
					var rId = roomId.a;
					return A2(
						$elm$core$Basics$composeR,
						A2($author$project$Internal$Api$Request$callApi, 'PUT', '/_matrix/client/v3/user/{userId}/rooms/{roomId}/account_data/{type}'),
						$author$project$Internal$Api$Request$withAttributes(
							_List_fromArray(
								[
									A2($author$project$Internal$Api$Request$replaceInUrl, 'roomId', rId)
								])));
				} else {
					return A2($author$project$Internal$Api$Request$callApi, 'PUT', '/_matrix/client/v3/user/{userId}/account_data/{type}');
				}
			}(),
			A2(
				$elm$core$Basics$composeR,
				$author$project$Internal$Api$Request$withAttributes(
					_List_fromArray(
						[
							$author$project$Internal$Api$Request$accessToken,
							A2($author$project$Internal$Api$Request$replaceInUrl, 'type', eventType),
							A2(
							$author$project$Internal$Api$Request$replaceInUrl,
							'userId',
							$author$project$Internal$Tools$Context$getUserId(context)),
							$author$project$Internal$Api$Request$fullBody(content)
						])),
				$author$project$Internal$Api$Request$toTask(
					A2(
						$elm$json$Json$Decode$map,
						$elm$core$Basics$always(0),
						$elm$json$Json$Decode$value))),
			context);
	});
var $author$project$Internal$Api$SetAccountData$Main$setAccountData = F2(
	function (context, input) {
		return A3(
			$elm$core$Basics$apR,
			A2(
				$elm$core$Maybe$withDefault,
				$elm$core$Basics$always(
					$elm$core$Basics$always(
						$elm$core$Task$fail($author$project$Internal$Tools$Exceptions$UnsupportedSpecVersion))),
				A2(
					$author$project$Internal$Tools$VersionControl$mostRecentFromVersionList,
					$author$project$Internal$Tools$Context$getVersions(context),
					A2(
						$author$project$Internal$Tools$VersionControl$sameForVersion,
						'v1.6',
						A2(
							$author$project$Internal$Tools$VersionControl$sameForVersion,
							'v1.5',
							A2(
								$author$project$Internal$Tools$VersionControl$sameForVersion,
								'v1.4',
								A2(
									$author$project$Internal$Tools$VersionControl$sameForVersion,
									'v1.3',
									A2(
										$author$project$Internal$Tools$VersionControl$sameForVersion,
										'v1.2',
										A2(
											$author$project$Internal$Tools$VersionControl$addMiddleLayer,
											{dq: $author$project$Internal$Api$SetAccountData$Api$setAccountDataV2, fy: $elm$core$Basics$identity, hl: $elm$core$Basics$identity, eC: 'v1.1'},
											A2(
												$author$project$Internal$Tools$VersionControl$sameForVersion,
												'r0.6.1',
												A2(
													$author$project$Internal$Tools$VersionControl$sameForVersion,
													'r0.6.0',
													A2(
														$author$project$Internal$Tools$VersionControl$sameForVersion,
														'r0.5.0',
														A2(
															$author$project$Internal$Tools$VersionControl$sameForVersion,
															'r0.4.0',
															A2(
																$author$project$Internal$Tools$VersionControl$sameForVersion,
																'r0.3.0',
																A2(
																	$author$project$Internal$Tools$VersionControl$sameForVersion,
																	'r0.2.0',
																	A2(
																		$author$project$Internal$Tools$VersionControl$sameForVersion,
																		'r0.1.0',
																		A2(
																			$author$project$Internal$Tools$VersionControl$sameForVersion,
																			'r0.0.1',
																			$author$project$Internal$Tools$VersionControl$withBottomLayer(
																				{dq: $author$project$Internal$Api$SetAccountData$Api$setAccountDataV1, eC: 'r0.0.0'}))))))))))))))))),
			$elm$core$Basics$apR(input),
			context);
	});
var $author$project$Internal$Api$VaultUpdate$setAccountData = function (input) {
	return A3(
		$author$project$Internal$Api$VaultUpdate$toChain,
		function (output) {
			return {
				bh: $elm$core$Basics$identity,
				bo: _List_fromArray(
					[
						A2($author$project$Internal$Api$VaultUpdate$AccountDataSet, input, output)
					])
			};
		},
		$author$project$Internal$Api$SetAccountData$Main$setAccountData,
		input);
};
var $author$project$Internal$Api$Task$setAccountData = F2(
	function (data, cred) {
		return $author$project$Internal$Api$VaultUpdate$toTask(
			A2(
				$author$project$Internal$Api$Chain$andThen,
				$author$project$Internal$Api$VaultUpdate$setAccountData(data),
				$author$project$Internal$Api$VaultUpdate$makeVBA(cred)));
	});
var $author$project$Internal$Room$setAccountData = F3(
	function (key, value, r) {
		var context = r.bP;
		return A2(
			$author$project$Internal$Api$Task$setAccountData,
			{
				bf: value,
				fB: key,
				eg: $elm$core$Maybe$Just(
					$author$project$Internal$Room$roomId(r))
			},
			context);
	});
var $author$project$Matrix$Room$setAccountData = $author$project$Internal$Room$setAccountData;
var $pilatch$elm_chess$Move$to = $pilatch$elm_chess$Internal$Move$to;
var $author$project$GameMain$toCmd = $elm$core$Task$attempt(
	A2($elm$core$Basics$composeR, $author$project$Msg$VaultUpdate, $author$project$Msg$LoggedIn));
var $author$project$Internal$Values$Room$IRoom = $elm$core$Basics$identity;
var $author$project$Internal$Values$Room$addAccountData = F3(
	function (eventType, content, _v0) {
		var room = _v0;
		return _Utils_update(
			room,
			{
				Z: A3($elm$core$Dict$insert, eventType, content, room.Z)
			});
	});
var $author$project$Internal$Room$addAccountData = F3(
	function (eventType, content, _v0) {
		var room = _v0.bu;
		var context = _v0.bP;
		return A2(
			$author$project$Internal$Room$withCredentials,
			context,
			A3($author$project$Internal$Values$Room$addAccountData, eventType, content, room));
	});
var $author$project$Internal$Values$Timeline$Gap = function (a) {
	return {$: 1, a: a};
};
var $author$project$Internal$Values$Timeline$Timeline = $elm$core$Basics$identity;
var $author$project$Internal$Values$StateManager$empty = $elm$core$Dict$empty;
var $author$project$Internal$Values$Event$stateKey = function (_v0) {
	var e = _v0;
	return e.gT;
};
var $author$project$Internal$Values$StateManager$addEvent = F2(
	function (event, oldManager) {
		var _v0 = $author$project$Internal$Values$Event$stateKey(event);
		if (!_v0.$) {
			var key = _v0.a;
			return A3(
				$elm$core$Dict$insert,
				_Utils_Tuple2(
					$author$project$Internal$Values$Event$eventType(event),
					key),
				event,
				oldManager);
		} else {
			return oldManager;
		}
	});
var $author$project$Internal$Values$StateManager$fromEventList = A2($elm$core$List$foldl, $author$project$Internal$Values$StateManager$addEvent, $elm$core$Dict$empty);
var $elm$core$Dict$union = F2(
	function (t1, t2) {
		return A3($elm$core$Dict$foldl, $elm$core$Dict$insert, t2, t1);
	});
var $author$project$Internal$Values$StateManager$updateRoomStateWith = $elm$core$Dict$union;
var $author$project$Internal$Values$Timeline$mostRecentState = function (_v0) {
	var t = _v0;
	return A2(
		$author$project$Internal$Values$StateManager$updateRoomStateWith,
		$author$project$Internal$Values$StateManager$fromEventList(t.e),
		t.U);
};
var $author$project$Internal$Values$Timeline$addNewEvents = F2(
	function (_v0, _v1) {
		var events = _v0.e;
		var limited = _v0.cA;
		var nextBatch = _v0.cK;
		var prevBatch = _v0.cP;
		var stateDelta = _v0.et;
		var t = _v1;
		return (_Utils_eq(prevBatch, t.cK) || (!limited)) ? _Utils_update(
			t,
			{
				e: _Utils_ap(t.e, events),
				cK: nextBatch
			}) : {
			e: events,
			cK: nextBatch,
			cP: prevBatch,
			q: $author$project$Internal$Values$Timeline$Gap(t),
			U: A2(
				$author$project$Internal$Values$StateManager$updateRoomStateWith,
				A2($elm$core$Maybe$withDefault, $author$project$Internal$Values$StateManager$empty, stateDelta),
				$author$project$Internal$Values$Timeline$mostRecentState(t))
		};
	});
var $author$project$Internal$Tools$Hashdict$insert = F2(
	function (v, _v0) {
		var h = _v0;
		return _Utils_update(
			h,
			{
				X: A3(
					$elm$core$Dict$insert,
					h.bk(v),
					v,
					h.X)
			});
	});
var $author$project$Internal$Values$Room$addEvents = F2(
	function (data, _v0) {
		var events = data.e;
		var room = _v0;
		return _Utils_update(
			room,
			{
				e: A3($elm$core$List$foldl, $author$project$Internal$Tools$Hashdict$insert, room.e, events),
				g0: A2(
					$elm$core$List$filter,
					function (tempEvent) {
						return A2(
							$elm$core$List$member,
							$author$project$Internal$Values$Event$eventId(tempEvent),
							A2($elm$core$List$map, $author$project$Internal$Values$Event$eventId, events));
					},
					room.g0),
				ba: A2($author$project$Internal$Values$Timeline$addNewEvents, data, room.ba)
			});
	});
var $author$project$Internal$Values$Room$addEvent = F2(
	function (event, _v0) {
		var room = _v0;
		var events = room.e;
		return _Utils_update(
			room,
			{
				e: A2($author$project$Internal$Tools$Hashdict$insert, event, events)
			});
	});
var $author$project$Internal$Room$addInternalEvent = F2(
	function (ievent, _v0) {
		var data = _v0;
		var room = data.bu;
		return _Utils_update(
			data,
			{
				bu: A2($author$project$Internal$Values$Room$addEvent, ievent, room)
			});
	});
var $author$project$Internal$Values$Vault$addInvite = F2(
	function (invite, _v0) {
		var data = _v0;
		return _Utils_update(
			data,
			{
				a2: A2(
					$elm$core$List$append,
					data.a2,
					_List_fromArray(
						[invite]))
			});
	});
var $author$project$Internal$Values$Vault$addSince = F2(
	function (since, _v0) {
		var data = _v0;
		return _Utils_update(
			data,
			{
				cY: $elm$core$Maybe$Just(since)
			});
	});
var $author$project$Internal$Values$Event$IEvent = $elm$core$Basics$identity;
var $author$project$Internal$Values$Event$init = $elm$core$Basics$identity;
var $author$project$Internal$Values$Room$addTemporaryEvent = F2(
	function (data, _v0) {
		var room = _v0;
		var tempEvents = room.g0;
		return _Utils_update(
			room,
			{
				g0: A2(
					$elm$core$List$append,
					tempEvents,
					$elm$core$List$singleton(
						$author$project$Internal$Values$Event$init(
							{bf: data.bf, du: data.du, fB: data.fB, cN: data.cN, eg: room.eg, cU: data.cU, gT: data.gT, c4: $elm$core$Maybe$Nothing})))
			});
	});
var $author$project$Internal$Api$Credentials$addVersions = F2(
	function (vs, _v0) {
		var data = _v0;
		return _Utils_update(
			data,
			{
				c7: $elm$core$Maybe$Just(vs)
			});
	});
var $author$project$Internal$Tools$LoginValues$DetailedAccessToken = function (a) {
	return {$: 2, a: a};
};
var $author$project$Internal$Tools$LoginValues$addWhoAmI = F2(
	function (_v0, t) {
		var deviceId = _v0.a_;
		var userId = _v0.c6;
		switch (t.$) {
			case 0:
				return $author$project$Internal$Tools$LoginValues$NoAccess;
			case 1:
				var a = t.a;
				return $author$project$Internal$Tools$LoginValues$DetailedAccessToken(
					{b0: a, a_: deviceId, c6: userId});
			case 2:
				var data = t.a;
				return $author$project$Internal$Tools$LoginValues$DetailedAccessToken(
					_Utils_update(
						data,
						{a_: deviceId, c6: userId}));
			default:
				var data = t.a;
				return $author$project$Internal$Tools$LoginValues$UsernameAndPassword(
					_Utils_update(
						data,
						{
							a_: deviceId,
							c6: $elm$core$Maybe$Just(userId)
						}));
		}
	});
var $author$project$Internal$Api$Credentials$addWhoAmI = F2(
	function (whoami, _v0) {
		var data = _v0;
		var access = data.J;
		return _Utils_update(
			data,
			{
				J: A2($author$project$Internal$Tools$LoginValues$addWhoAmI, whoami, access)
			});
	});
var $author$project$Internal$Tools$LoginValues$getUserId = function (t) {
	switch (t.$) {
		case 0:
			return $elm$core$Maybe$Nothing;
		case 1:
			return $elm$core$Maybe$Nothing;
		case 2:
			var userId = t.a.c6;
			return $elm$core$Maybe$Just(userId);
		default:
			var userId = t.a.c6;
			return userId;
	}
};
var $author$project$Internal$Api$Credentials$getUserId = function (_v0) {
	var access = _v0.J;
	return $author$project$Internal$Tools$LoginValues$getUserId(access);
};
var $author$project$Internal$Vault$getUsername = function (_v0) {
	var context = _v0.bP;
	return $author$project$Internal$Api$Credentials$getUserId(context);
};
var $author$project$Internal$Event$initFromClientEventWithoutRoomId = F2(
	function (rId, output) {
		return $author$project$Internal$Values$Event$init(
			{
				bf: output.bf,
				du: output.du,
				fB: output.fB,
				cN: output.cN,
				eg: rId,
				cU: output.cU,
				gT: output.gT,
				c4: A2(
					$elm$core$Maybe$map,
					function (_v0) {
						var data = _v0;
						return {
							df: data.df,
							d4: data.d4,
							ea: A2(
								$elm$core$Maybe$map,
								$author$project$Internal$Event$initFromClientEventWithoutRoomId(rId),
								data.ea),
							ez: data.ez
						};
					},
					output.c4)
			});
	});
var $author$project$Internal$Event$initFromGetEvent = function (output) {
	return $author$project$Internal$Values$Event$init(
		{
			bf: output.bf,
			du: output.du,
			fB: output.fB,
			cN: output.cN,
			eg: output.eg,
			cU: output.cU,
			gT: output.gT,
			c4: A2(
				$elm$core$Maybe$map,
				function (_v0) {
					var data = _v0;
					return {
						df: data.df,
						d4: data.d4,
						ea: A2($elm$core$Maybe$map, $author$project$Internal$Event$initFromGetEvent, data.ea),
						ez: data.ez
					};
				},
				output.c4)
		});
};
var $author$project$Internal$Event$initFromGetMessages = function (output) {
	return $author$project$Internal$Values$Event$init(
		{
			bf: output.bf,
			du: output.du,
			fB: output.fB,
			cN: output.cN,
			eg: output.eg,
			cU: output.cU,
			gT: output.gT,
			c4: A2(
				$elm$core$Maybe$map,
				function (_v0) {
					var data = _v0;
					return {
						df: data.df,
						d4: data.d4,
						ea: A2($elm$core$Maybe$map, $author$project$Internal$Event$initFromGetMessages, data.ea),
						ez: data.ez
					};
				},
				output.c4)
		});
};
var $author$project$Internal$Values$Event$BlindEvent = $elm$core$Basics$identity;
var $author$project$Internal$Tools$Hashdict$fromList = F2(
	function (hash, xs) {
		return {
			bk: hash,
			X: $elm$core$Dict$fromList(
				A2(
					$elm$core$List$map,
					function (x) {
						return _Utils_Tuple2(
							hash(x),
							x);
					},
					xs))
		};
	});
var $author$project$Internal$Values$Timeline$Endless = function (a) {
	return {$: 0, a: a};
};
var $author$project$Internal$Values$Timeline$StartOfTimeline = {$: 2};
var $author$project$Internal$Config$Leaking$prevBatch = 'this_previous_batch_does_not_exist';
var $author$project$Internal$Values$Timeline$newFromEvents = function (_v0) {
	var events = _v0.e;
	var nextBatch = _v0.cK;
	var prevBatch = _v0.cP;
	var stateDelta = _v0.et;
	return {
		e: events,
		cK: nextBatch,
		cP: A2($elm$core$Maybe$withDefault, $author$project$Internal$Config$Leaking$prevBatch, prevBatch),
		q: A2(
			$elm$core$Maybe$withDefault,
			$author$project$Internal$Values$Timeline$StartOfTimeline,
			A2($elm$core$Maybe$map, $author$project$Internal$Values$Timeline$Endless, prevBatch)),
		U: A2($elm$core$Maybe$withDefault, $author$project$Internal$Values$StateManager$empty, stateDelta)
	};
};
var $author$project$Internal$Room$initFromJoinedRoom = F2(
	function (data, jroom) {
		return {
			Z: $elm$core$Dict$fromList(
				A2(
					$elm$core$List$map,
					function (_v0) {
						var eventType = _v0.fB;
						var content = _v0.bf;
						return _Utils_Tuple2(eventType, content);
					},
					A2(
						$elm$core$Maybe$withDefault,
						_List_Nil,
						A2(
							$elm$core$Maybe$map,
							function ($) {
								return $.e;
							},
							jroom.Z)))),
			cg: A2(
				$elm$core$List$map,
				$elm$core$Basics$identity,
				A2(
					$elm$core$Maybe$withDefault,
					_List_Nil,
					A2(
						$elm$core$Maybe$map,
						function ($) {
							return $.e;
						},
						jroom.cg))),
			e: A2(
				$author$project$Internal$Tools$Hashdict$fromList,
				$author$project$Internal$Values$Event$eventId,
				A2(
					$elm$core$List$map,
					$author$project$Internal$Event$initFromClientEventWithoutRoomId(data.eg),
					A2(
						$elm$core$Maybe$withDefault,
						_List_Nil,
						A2(
							$elm$core$Maybe$map,
							function ($) {
								return $.e;
							},
							jroom.ba)))),
			eg: data.eg,
			g0: _List_Nil,
			ba: A2(
				$elm$core$Maybe$withDefault,
				$author$project$Internal$Values$Timeline$newFromEvents(
					{e: _List_Nil, cK: data.cK, cP: $elm$core$Maybe$Nothing, et: $elm$core$Maybe$Nothing}),
				A2(
					$elm$core$Maybe$map,
					function (timeline) {
						return $author$project$Internal$Values$Timeline$newFromEvents(
							{
								e: A2(
									$elm$core$List$map,
									$author$project$Internal$Event$initFromClientEventWithoutRoomId(data.eg),
									timeline.e),
								cK: data.cK,
								cP: timeline.cP,
								et: A2(
									$elm$core$Maybe$map,
									A2(
										$elm$core$Basics$composeR,
										function ($) {
											return $.e;
										},
										A2(
											$elm$core$Basics$composeR,
											$elm$core$List$map(
												$author$project$Internal$Event$initFromClientEventWithoutRoomId(data.eg)),
											$author$project$Internal$Values$StateManager$fromEventList)),
									jroom.es)
							});
					},
					jroom.ba))
		};
	});
var $author$project$Internal$Values$RoomInvite$IRoomInvite = $elm$core$Basics$identity;
var $author$project$Internal$Values$RoomInvite$RoomInviteEvent = $elm$core$Basics$identity;
var $author$project$Internal$Values$RoomInvite$init = function (data) {
	return function (e) {
		return {e: e, eg: data.eg};
	}(
		$elm$core$Dict$fromList(
			A2(
				$elm$core$List$map,
				function (event) {
					return _Utils_Tuple2(
						_Utils_Tuple2(event.fB, event.gT),
						event);
				},
				data.e)));
};
var $author$project$Internal$Invite$initFromStrippedStateEvent = $author$project$Internal$Values$RoomInvite$init;
var $author$project$Internal$Values$Room$insertAccountData = F2(
	function (newdata, _v0) {
		var room = _v0;
		return _Utils_update(
			room,
			{
				Z: A2($elm$core$Dict$union, newdata, room.Z)
			});
	});
var $author$project$Internal$Values$Vault$insertAccountData = F2(
	function (_v0, _v1) {
		var content = _v0.bf;
		var eventType = _v0.fB;
		var roomId = _v0.eg;
		var data = _v1;
		if (!roomId.$) {
			var rId = roomId.a;
			return A2(
				$elm$core$Maybe$withDefault,
				data,
				A2(
					$elm$core$Maybe$map,
					A2(
						$elm$core$Basics$composeR,
						$author$project$Internal$Values$Room$insertAccountData(
							A2($elm$core$Dict$singleton, eventType, content)),
						A2(
							$elm$core$Basics$composeR,
							$author$project$Internal$Tools$Hashdict$insert,
							A2(
								$elm$core$Basics$composeR,
								$elm$core$Basics$apR(data.cT),
								function (rooms) {
									return _Utils_update(
										data,
										{cT: rooms});
								}))),
					A2($author$project$Internal$Values$Vault$getRoomById, rId, data)));
		} else {
			return _Utils_update(
				data,
				{
					Z: A3($elm$core$Dict$insert, eventType, content, data.Z)
				});
		}
	});
var $author$project$Internal$Values$Timeline$insertEvents = F2(
	function (data, _v0) {
		var events = data.e;
		var nextBatch = data.cK;
		var prevBatch = data.cP;
		var stateDelta = data.et;
		var t = _v0;
		if (prevBatch.$ === 1) {
			var _v2 = t.q;
			if (_v2.$ === 1) {
				var prevT = _v2.a;
				return _Utils_update(
					t,
					{
						q: $author$project$Internal$Values$Timeline$Gap(
							A2($author$project$Internal$Values$Timeline$insertEvents, data, prevT))
					});
			} else {
				return _Utils_eq(nextBatch, t.cP) ? _Utils_update(
					t,
					{
						e: _Utils_ap(events, t.e),
						q: $author$project$Internal$Values$Timeline$StartOfTimeline,
						U: $author$project$Internal$Values$StateManager$empty
					}) : _Utils_update(
					t,
					{
						q: $author$project$Internal$Values$Timeline$Gap(
							$author$project$Internal$Values$Timeline$newFromEvents(data))
					});
			}
		} else {
			var p = prevBatch.a;
			if (_Utils_eq(t.cK, p)) {
				return _Utils_update(
					t,
					{
						e: _Utils_ap(t.e, events),
						cK: nextBatch
					});
			} else {
				if (_Utils_eq(nextBatch, t.cP)) {
					var _v3 = t.q;
					switch (_v3.$) {
						case 1:
							var prevT = _v3.a;
							return _Utils_eq(prevT.cK, p) ? {
								e: _Utils_ap(
									prevT.e,
									_Utils_ap(events, t.e)),
								cK: t.cK,
								cP: prevT.cP,
								q: prevT.q,
								U: prevT.U
							} : _Utils_update(
								t,
								{
									e: _Utils_ap(events, t.e),
									cP: p,
									U: A2($elm$core$Maybe$withDefault, $author$project$Internal$Values$StateManager$empty, stateDelta)
								});
						case 0:
							return _Utils_update(
								t,
								{
									e: _Utils_ap(events, t.e),
									cP: p,
									q: $author$project$Internal$Values$Timeline$Endless(p),
									U: A2($elm$core$Maybe$withDefault, $author$project$Internal$Values$StateManager$empty, stateDelta)
								});
						default:
							return _Utils_update(
								t,
								{
									e: _Utils_ap(events, t.e),
									cP: p,
									U: A2($elm$core$Maybe$withDefault, $author$project$Internal$Values$StateManager$empty, stateDelta)
								});
					}
				} else {
					var _v4 = t.q;
					if (_v4.$ === 1) {
						var prevT = _v4.a;
						return _Utils_update(
							t,
							{
								q: $author$project$Internal$Values$Timeline$Gap(
									A2($author$project$Internal$Values$Timeline$insertEvents, data, prevT))
							});
					} else {
						return t;
					}
				}
			}
		}
	});
var $author$project$Internal$Values$Room$insertEvents = F2(
	function (data, _v0) {
		var room = _v0;
		var timeline = room.ba;
		return A3(
			$elm$core$Basics$apR,
			_Utils_update(
				room,
				{
					ba: A2($author$project$Internal$Values$Timeline$insertEvents, data, timeline)
				}),
			$elm$core$List$foldl($author$project$Internal$Values$Room$addEvent),
			data.e);
	});
var $author$project$Internal$Values$Vault$insertRoom = F2(
	function (room, _v0) {
		var data = _v0;
		return _Utils_update(
			data,
			{
				cT: A2($author$project$Internal$Tools$Hashdict$insert, room, data.cT)
			});
	});
var $author$project$Internal$Vault$insertInternalRoom = F2(
	function (iroom, _v0) {
		var data = _v0;
		return _Utils_update(
			data,
			{
				n: A2($author$project$Internal$Values$Vault$insertRoom, iroom, data.n)
			});
	});
var $author$project$Internal$Vault$insertRoom = A2($elm$core$Basics$composeR, $author$project$Internal$Room$withoutCredentials, $author$project$Internal$Vault$insertInternalRoom);
var $author$project$Internal$Values$Vault$insertTimestamp = F2(
	function (time, _v0) {
		var data = _v0;
		return _Utils_update(
			data,
			{cx: time});
	});
var $author$project$Internal$Values$Vault$lastUpdate = function (_v0) {
	var latestUpdate = _v0.cx;
	return latestUpdate;
};
var $elm$core$Maybe$map2 = F3(
	function (func, ma, mb) {
		if (ma.$ === 1) {
			return $elm$core$Maybe$Nothing;
		} else {
			var a = ma.a;
			if (mb.$ === 1) {
				return $elm$core$Maybe$Nothing;
			} else {
				var b = mb.a;
				return $elm$core$Maybe$Just(
					A2(func, a, b));
			}
		}
	});
var $elm$core$Tuple$mapSecond = F2(
	function (func, _v0) {
		var x = _v0.a;
		var y = _v0.b;
		return _Utils_Tuple2(
			x,
			func(y));
	});
var $author$project$Internal$Values$RoomInvite$roomId = function (_v0) {
	var data = _v0;
	return data.eg;
};
var $author$project$Internal$Values$Vault$removeInvite = F2(
	function (roomId, _v0) {
		var data = _v0;
		return _Utils_update(
			data,
			{
				a2: A2(
					$elm$core$List$filter,
					function (i) {
						return !_Utils_eq(
							$author$project$Internal$Values$RoomInvite$roomId(i),
							roomId);
					},
					data.a2)
			});
	});
var $author$project$Internal$Vault$updateWith = F2(
	function (vaultUpdate, vault) {
		var data = vault;
		var cred = data.n;
		var context = data.bP;
		switch (vaultUpdate.$) {
			case 0:
				var updates = vaultUpdate.a;
				return A3($elm$core$List$foldl, $author$project$Internal$Vault$updateWith, vault, updates);
			case 1:
				var input = vaultUpdate.a;
				var _v1 = input.eg;
				if (!_v1.$) {
					var rId = _v1.a;
					var _v2 = A2($author$project$Internal$Vault$getRoomById, rId, vault);
					if (!_v2.$) {
						var room = _v2.a;
						return A3(
							$elm$core$Basics$apR,
							A3($author$project$Internal$Room$addAccountData, input.fB, input.bf, room),
							$author$project$Internal$Vault$insertRoom,
							vault);
					} else {
						return vault;
					}
				} else {
					return vault;
				}
			case 2:
				var input = vaultUpdate.a;
				return vault;
			case 3:
				var t = vaultUpdate.a;
				return {
					bP: context,
					n: A2($author$project$Internal$Values$Vault$insertTimestamp, t, cred)
				};
			case 4:
				var input = vaultUpdate.a;
				var output = vaultUpdate.b;
				var _v3 = A2($author$project$Internal$Vault$getRoomById, input.eg, vault);
				if (!_v3.$) {
					var room = _v3.a;
					return A3(
						$elm$core$Basics$apR,
						A3(
							$elm$core$Basics$apR,
							$author$project$Internal$Event$initFromGetEvent(output),
							$author$project$Internal$Room$addInternalEvent,
							room),
						$author$project$Internal$Vault$insertRoom,
						vault);
				} else {
					return vault;
				}
			case 5:
				var input = vaultUpdate.a;
				var output = vaultUpdate.b;
				var prevBatch = function () {
					var _v8 = input.x;
					if (!_v8) {
						return $elm$core$Maybe$Just(output.c_);
					} else {
						var _v9 = output.cf;
						if (!_v9.$) {
							var end = _v9.a;
							return $elm$core$Maybe$Just(end);
						} else {
							return input.V;
						}
					}
				}();
				var nextBatch = function () {
					var _v6 = input.x;
					if (!_v6) {
						var _v7 = output.cf;
						if (!_v7.$) {
							var end = _v7.a;
							return $elm$core$Maybe$Just(end);
						} else {
							return input.V;
						}
					} else {
						return $elm$core$Maybe$Just(output.c_);
					}
				}();
				var _v4 = _Utils_Tuple2(
					A2($author$project$Internal$Vault$getRoomById, input.eg, vault),
					nextBatch);
				if ((!_v4.a.$) && (!_v4.b.$)) {
					var room = _v4.a.a;
					var nb = _v4.b.a;
					return function (v) {
						return {bP: context, n: v};
					}(
						A3(
							$elm$core$Basics$apR,
							A2(
								$author$project$Internal$Values$Room$insertEvents,
								{
									e: function (x) {
										var _v5 = input.x;
										if (!_v5) {
											return x;
										} else {
											return $elm$core$List$reverse(x);
										}
									}(
										A2($elm$core$List$map, $author$project$Internal$Event$initFromGetMessages, output.b9)),
									cK: nb,
									cP: prevBatch,
									et: $elm$core$Maybe$Just(
										$author$project$Internal$Values$StateManager$fromEventList(
											A2($elm$core$List$map, $author$project$Internal$Event$initFromGetMessages, output.es)))
								},
								$author$project$Internal$Room$withoutCredentials(room)),
							$author$project$Internal$Values$Vault$insertRoom,
							cred));
				} else {
					return vault;
				}
			case 6:
				return vault;
			case 7:
				return vault;
			case 8:
				var input = vaultUpdate.a;
				return function (x) {
					return {bP: context, n: x};
				}(
					A2($author$project$Internal$Values$Vault$removeInvite, input.eg, cred));
			case 9:
				var input = vaultUpdate.a;
				return function (x) {
					return {bP: context, n: x};
				}(
					A2($author$project$Internal$Values$Vault$removeInvite, input.eg, cred));
			case 11:
				var content = vaultUpdate.a.bf;
				var eventType = vaultUpdate.a.fB;
				var roomId = vaultUpdate.a.eg;
				var eventId = vaultUpdate.b.du;
				return A2(
					$elm$core$Maybe$withDefault,
					vault,
					A2(
						$elm$core$Maybe$map,
						A2(
							$elm$core$Basics$composeR,
							$author$project$Internal$Room$withCredentials(context),
							A2(
								$elm$core$Basics$composeR,
								$author$project$Internal$Vault$insertRoom,
								$elm$core$Basics$apR(vault))),
						A3(
							$elm$core$Maybe$map2,
							F2(
								function (room, sender) {
									return A2(
										$author$project$Internal$Values$Room$addTemporaryEvent,
										{
											bf: content,
											du: eventId,
											fB: eventType,
											cN: $author$project$Internal$Values$Vault$lastUpdate(cred),
											cU: sender,
											gT: $elm$core$Maybe$Nothing
										},
										$author$project$Internal$Room$withoutCredentials(room));
								}),
							A2($author$project$Internal$Vault$getRoomById, roomId, vault),
							$author$project$Internal$Vault$getUsername(vault))));
			case 12:
				return vault;
			case 13:
				var content = vaultUpdate.a.bf;
				var eventType = vaultUpdate.a.fB;
				var roomId = vaultUpdate.a.eg;
				var stateKey = vaultUpdate.a.gT;
				var eventId = vaultUpdate.b.du;
				return A2(
					$elm$core$Maybe$withDefault,
					vault,
					A2(
						$elm$core$Maybe$map,
						A2(
							$elm$core$Basics$composeR,
							$author$project$Internal$Room$withCredentials(context),
							A2(
								$elm$core$Basics$composeR,
								$author$project$Internal$Vault$insertRoom,
								$elm$core$Basics$apR(vault))),
						A3(
							$elm$core$Maybe$map2,
							F2(
								function (room, sender) {
									return A2(
										$author$project$Internal$Values$Room$addTemporaryEvent,
										{
											bf: content,
											du: eventId,
											fB: eventType,
											cN: $author$project$Internal$Values$Vault$lastUpdate(cred),
											cU: sender,
											gT: $elm$core$Maybe$Just(stateKey)
										},
										$author$project$Internal$Room$withoutCredentials(room));
								}),
							A2($author$project$Internal$Vault$getRoomById, roomId, vault),
							$author$project$Internal$Vault$getUsername(vault))));
			case 14:
				var input = vaultUpdate.a;
				var output = vaultUpdate.b;
				var jRooms = A2(
					$elm$core$List$map,
					function (_v12) {
						var roomId = _v12.a;
						var jroom = _v12.b;
						var _v13 = A2($author$project$Internal$Vault$getRoomById, roomId, vault);
						if (!_v13.$) {
							var room = _v13.a;
							return function (r) {
								return function (a) {
									return A2($author$project$Internal$Values$Room$insertAccountData, a, r);
								}(
									$elm$core$Dict$fromList(
										A2(
											$elm$core$List$map,
											function (_v15) {
												var content = _v15.bf;
												var eventType = _v15.fB;
												return _Utils_Tuple2(eventType, content);
											},
											A2(
												$elm$core$Maybe$withDefault,
												_List_Nil,
												A2(
													$elm$core$Maybe$map,
													function ($) {
														return $.e;
													},
													jroom.Z)))));
							}(
								function () {
									var _v14 = jroom.ba;
									if (!_v14.$) {
										var timeline = _v14.a;
										return A2(
											$author$project$Internal$Values$Room$addEvents,
											{
												e: A2(
													$elm$core$List$map,
													$author$project$Internal$Event$initFromClientEventWithoutRoomId(roomId),
													timeline.e),
												cA: timeline.cA,
												cK: output.cK,
												cP: A2(
													$elm$core$Maybe$withDefault,
													A2($elm$core$Maybe$withDefault, '', input.cY),
													timeline.cP),
												et: A2(
													$elm$core$Maybe$map,
													A2(
														$elm$core$Basics$composeR,
														function ($) {
															return $.e;
														},
														A2(
															$elm$core$Basics$composeR,
															$elm$core$List$map(
																$author$project$Internal$Event$initFromClientEventWithoutRoomId(roomId)),
															$author$project$Internal$Values$StateManager$fromEventList)),
													jroom.es)
											},
											$author$project$Internal$Room$withoutCredentials(room));
									} else {
										return $author$project$Internal$Room$withoutCredentials(room);
									}
								}());
						} else {
							return A2(
								$author$project$Internal$Room$initFromJoinedRoom,
								{cK: output.cK, eg: roomId},
								jroom);
						}
					},
					$elm$core$Dict$toList(
						A2(
							$elm$core$Maybe$withDefault,
							$elm$core$Dict$empty,
							A2(
								$elm$core$Maybe$map,
								function ($) {
									return $.ct;
								},
								output.cT))));
				var invites = A2(
					$elm$core$List$map,
					$author$project$Internal$Invite$initFromStrippedStateEvent,
					A2(
						$elm$core$List$map,
						function (_v11) {
							var roomId = _v11.a;
							var events = _v11.b;
							return {e: events, eg: roomId};
						},
						A2(
							$elm$core$List$map,
							$elm$core$Tuple$mapSecond(
								$elm$core$Maybe$withDefault(_List_Nil)),
							A2(
								$elm$core$List$map,
								$elm$core$Tuple$mapSecond(
									$elm$core$Maybe$map(
										function ($) {
											return $.e;
										})),
								A2(
									$elm$core$List$map,
									$elm$core$Tuple$mapSecond(
										function ($) {
											return $.cr;
										}),
									$elm$core$Dict$toList(
										A2(
											$elm$core$Maybe$withDefault,
											$elm$core$Dict$empty,
											A2(
												$elm$core$Maybe$map,
												function ($) {
													return $.cq;
												},
												output.cT))))))));
				var accData = A2(
					$elm$core$List$map,
					function (_v10) {
						var content = _v10.bf;
						var eventType = _v10.fB;
						return {bf: content, fB: eventType, eg: $elm$core$Maybe$Nothing};
					},
					A2(
						$elm$core$Maybe$withDefault,
						_List_Nil,
						A2(
							$elm$core$Maybe$map,
							function ($) {
								return $.e;
							},
							output.Z)));
				return function (x) {
					return {bP: context, n: x};
				}(
					A3(
						$elm$core$Basics$apR,
						A3(
							$elm$core$Basics$apR,
							A2(
								$author$project$Internal$Values$Vault$addSince,
								output.cK,
								function (c) {
									return A3($elm$core$List$foldl, $author$project$Internal$Values$Vault$insertAccountData, c, accData);
								}(cred)),
							$elm$core$List$foldl($author$project$Internal$Values$Vault$insertRoom),
							jRooms),
						$elm$core$List$foldl($author$project$Internal$Values$Vault$addInvite),
						invites));
			case 15:
				var token = vaultUpdate.a;
				return _Utils_update(
					data,
					{
						bP: A2($author$project$Internal$Api$Credentials$addToken, token, context)
					});
			case 16:
				var versions = vaultUpdate.a;
				return _Utils_update(
					data,
					{
						bP: A2($author$project$Internal$Api$Credentials$addVersions, versions, context)
					});
			case 17:
				var whoami = vaultUpdate.a;
				return _Utils_update(
					data,
					{
						bP: A2($author$project$Internal$Api$Credentials$addWhoAmI, whoami, context)
					});
			default:
				var output = vaultUpdate.b;
				return _Utils_update(
					data,
					{
						bP: A2($author$project$Internal$Api$Credentials$addToken, output.b0, context)
					});
		}
	});
var $author$project$Matrix$updateWith = $author$project$Internal$Vault$updateWith;
var $author$project$Matrix$username = $author$project$Internal$Vault$getUsername;
var $author$project$GameMain$update = F3(
	function (vault, msg, model) {
		var _v0 = _Utils_Tuple2(msg, model);
		_v0$10:
		while (true) {
			switch (_v0.a.$) {
				case 8:
					var _v1 = _v0.a;
					return _Utils_Tuple3(
						vault,
						$author$project$Model$BrowsingGames($elm$core$Maybe$Nothing),
						$elm$core$Platform$Cmd$none);
				case 0:
					if (!_v0.a.a.$) {
						var u = _v0.a.a.a;
						var _v2 = $author$project$Chess$resolve(vault);
						var accountDataToUpdate = _v2.b1;
						var states = _v2.bv;
						return _Utils_Tuple3(
							A2($author$project$Matrix$updateWith, u, vault),
							function () {
								if (model.$ === 1) {
									var modal = model.a;
									var info = model.b;
									return A2(
										$author$project$Model$PlayGame,
										modal,
										A2(
											$elm$core$Maybe$withDefault,
											info,
											A2(
												$elm$core$Maybe$map,
												function (g) {
													if (_Utils_eq(
														$pilatch$elm_chess$Game$toEnd(g.an.o),
														$pilatch$elm_chess$Game$toEnd(info.o.an.o))) {
														return info;
													} else {
														var data = g.an;
														return _Utils_update(
															info,
															{
																o: _Utils_update(
																	g,
																	{
																		an: _Utils_update(
																			data,
																			{
																				o: $pilatch$elm_chess$Game$toEnd(data.o)
																			})
																	}),
																R: $elm$core$Maybe$Nothing
															});
													}
												},
												$elm$core$List$head(
													A2(
														$elm$core$List$filter,
														function (state) {
															return _Utils_eq(state.cG, info.o.cG);
														},
														states)))));
								} else {
									return model;
								}
							}(),
							$elm$core$Platform$Cmd$batch(
								A2(
									$elm$core$List$map,
									$author$project$GameMain$toCmd,
									A2(
										$elm$core$List$map,
										function (_v5) {
											var data = _v5.an;
											var room = _v5.bu;
											return A3($author$project$Matrix$Room$setAccountData, $author$project$Chess$accountDataEventType, data, room);
										},
										accountDataToUpdate))));
					} else {
						return _Utils_Tuple3(vault, model, $elm$core$Platform$Cmd$none);
					}
				case 4:
					var summary = _v0.a.a;
					return _Utils_Tuple3(
						vault,
						A2(
							$author$project$Model$PlayGame,
							$elm$core$Maybe$Nothing,
							{
								b7: _Utils_eq(
									$author$project$Matrix$username(vault),
									$elm$core$Maybe$Just(summary.an.m)),
								o: summary,
								dS: _Utils_eq(
									$author$project$Matrix$username(vault),
									$elm$core$Maybe$Just(summary.an.f)),
								dT: _Utils_eq(
									$author$project$Matrix$username(vault),
									$elm$core$Maybe$Just(summary.an.m)),
								R: $elm$core$Maybe$Nothing
							}),
						$elm$core$Platform$Cmd$none);
				case 6:
					if (_v0.b.$ === 1) {
						var modalData = _v0.a.a;
						var _v6 = _v0.b;
						var data = _v6.b;
						return _Utils_Tuple3(
							vault,
							A2(
								$author$project$Model$PlayGame,
								$elm$core$Maybe$Just(modalData),
								data),
							$elm$core$Platform$Cmd$none);
					} else {
						var data = _v0.a.a;
						return _Utils_Tuple3(
							vault,
							$author$project$Model$BrowsingGames(
								$elm$core$Maybe$Just(data)),
							$elm$core$Platform$Cmd$none);
					}
				case 7:
					if (_v0.b.$ === 1) {
						var _v9 = _v0.a;
						var user = _v9.a;
						var room = _v9.b;
						var _v10 = _v0.b;
						var data = _v10.b;
						return _Utils_Tuple3(
							vault,
							A2($author$project$Model$PlayGame, $elm$core$Maybe$Nothing, data),
							function () {
								var _v11 = $author$project$Matrix$username(vault);
								if (_v11.$ === 1) {
									return $elm$core$Platform$Cmd$none;
								} else {
									var me = _v11.a;
									return $author$project$GameMain$toCmd(
										A2(
											$author$project$Matrix$Room$sendOneEvent,
											{
												bf: $author$project$Chess$encodeInviteEvent(
													{f: user, m: me}),
												fB: $author$project$Chess$gameInviteEventType,
												gT: $elm$core$Maybe$Nothing
											},
											room));
								}
							}());
					} else {
						var _v7 = _v0.a;
						var user = _v7.a;
						var room = _v7.b;
						return _Utils_Tuple3(
							vault,
							$author$project$Model$BrowsingGames($elm$core$Maybe$Nothing),
							function () {
								var _v8 = $author$project$Matrix$username(vault);
								if (_v8.$ === 1) {
									return $elm$core$Platform$Cmd$none;
								} else {
									var me = _v8.a;
									return $author$project$GameMain$toCmd(
										A2(
											$author$project$Matrix$Room$sendOneEvent,
											{
												bf: $author$project$Chess$encodeInviteEvent(
													{f: user, m: me}),
												fB: $author$project$Chess$gameInviteEventType,
												gT: $elm$core$Maybe$Nothing
											},
											room));
								}
							}());
					}
				case 11:
					var summary = _v0.a.a;
					return _Utils_Tuple3(
						vault,
						model,
						$author$project$GameMain$toCmd(
							A2(
								$author$project$Matrix$Room$sendOneEvent,
								{
									bf: $author$project$Chess$encodeAcceptChess(
										{bt: $elm$core$Maybe$Nothing, C: summary.cG}),
									fB: $author$project$Chess$acceptChessEventType,
									gT: $elm$core$Maybe$Nothing
								},
								summary.bu)));
				case 12:
					var summary = _v0.a.a;
					return _Utils_Tuple3(
						vault,
						model,
						$author$project$GameMain$toCmd(
							A2(
								$author$project$Matrix$Room$sendOneEvent,
								{
									bf: $author$project$Chess$encodeRejectChess(
										{bt: $elm$core$Maybe$Nothing, C: summary.cG}),
									fB: $author$project$Chess$rejectChessEventType,
									gT: $elm$core$Maybe$Nothing
								},
								summary.bu)));
				case 5:
					if (!_v0.b.$) {
						break _v0$10;
					} else {
						var _v12 = _v0.a;
						var _v13 = _v0.b;
						var data = _v13.b;
						return _Utils_Tuple3(
							vault,
							A2($author$project$Model$PlayGame, $elm$core$Maybe$Nothing, data),
							$elm$core$Platform$Cmd$none);
					}
				case 1:
					if (!_v0.b.$) {
						break _v0$10;
					} else {
						var square = _v0.a.a;
						var _v14 = _v0.b;
						var modal = _v14.a;
						var pg = _v14.b;
						var game = pg.o;
						var selected = pg.R;
						var mayMoveBlack = pg.dS;
						var mayMoveWhite = pg.dT;
						var data = game.an;
						var matchId = game.cG;
						var room = game.bu;
						var doNothing = _Utils_Tuple3(
							vault,
							A2(
								$author$project$Model$PlayGame,
								modal,
								_Utils_update(
									pg,
									{R: $elm$core$Maybe$Nothing})),
							$elm$core$Platform$Cmd$none);
						var allowedToMove = _Utils_eq(
							$pilatch$elm_chess$Position$sideToMove(
								$pilatch$elm_chess$Game$position(
									$pilatch$elm_chess$Game$toEnd(data.o))),
							$pilatch$elm_chess$PieceColor$black) ? mayMoveBlack : mayMoveWhite;
						if (allowedToMove) {
							if ($pilatch$elm_chess$Game$isAtEnd(data.o)) {
								if (selected.$ === 1) {
									return _Utils_Tuple3(
										vault,
										A2(
											$author$project$Model$PlayGame,
											modal,
											_Utils_update(
												pg,
												{
													R: $elm$core$Maybe$Just(square)
												})),
										$elm$core$Platform$Cmd$none);
								} else {
									var oldSquare = selected.a;
									return A2(
										$elm$core$Maybe$withDefault,
										_Utils_Tuple3(
											vault,
											A2(
												$author$project$Model$PlayGame,
												modal,
												_Utils_update(
													pg,
													{
														R: $elm$core$Maybe$Just(square)
													})),
											$elm$core$Platform$Cmd$none),
										A2(
											$elm$core$Maybe$map,
											function (move) {
												var newGame = A2(
													$pilatch$elm_chess$Game$addMove,
													move,
													$pilatch$elm_chess$Game$toEnd(data.o));
												return _Utils_Tuple3(
													vault,
													A2(
														$author$project$Model$PlayGame,
														modal,
														_Utils_update(
															pg,
															{
																o: _Utils_update(
																	game,
																	{
																		an: _Utils_update(
																			data,
																			{o: newGame})
																	}),
																R: $elm$core$Maybe$Nothing
															})),
													$author$project$GameMain$toCmd(
														A2(
															$author$project$Matrix$Room$sendOneEvent,
															{
																bf: $author$project$Chess$encodeChessMove(
																	{M: data.M, bV: newGame, C: matchId}),
																fB: $author$project$Chess$gameChessMoveEventType,
																gT: $elm$core$Maybe$Nothing
															},
															room)));
											},
											$elm$core$List$head(
												A2(
													$elm$core$List$filter,
													function (move) {
														return _Utils_eq(
															$pilatch$elm_chess$Move$to(move),
															square);
													},
													A2(
														$pilatch$elm_chess$Position$movesFrom,
														oldSquare,
														$pilatch$elm_chess$Game$position(
															$pilatch$elm_chess$Game$toEnd(data.o)))))));
								}
							} else {
								return doNothing;
							}
						} else {
							return doNothing;
						}
					}
				case 3:
					if (!_v0.b.$) {
						break _v0$10;
					} else {
						var _v17 = _v0.a;
						var _v18 = _v0.b;
						var modal = _v18.a;
						var pg = _v18.b;
						var game = pg.o;
						var data = game.an;
						return _Utils_Tuple3(
							vault,
							A2(
								$author$project$Model$PlayGame,
								modal,
								_Utils_update(
									pg,
									{
										o: _Utils_update(
											game,
											{
												an: _Utils_update(
													data,
													{
														o: $pilatch$elm_chess$Game$back(data.o)
													})
											}),
										R: $elm$core$Maybe$Nothing
									})),
							$elm$core$Platform$Cmd$none);
					}
				case 2:
					if (!_v0.b.$) {
						break _v0$10;
					} else {
						var _v21 = _v0.a;
						var _v22 = _v0.b;
						var modal = _v22.a;
						var pg = _v22.b;
						var game = pg.o;
						var data = game.an;
						return _Utils_Tuple3(
							vault,
							A2(
								$author$project$Model$PlayGame,
								modal,
								_Utils_update(
									pg,
									{
										o: _Utils_update(
											game,
											{
												an: _Utils_update(
													data,
													{
														o: $pilatch$elm_chess$Game$forward(data.o)
													})
											}),
										R: $elm$core$Maybe$Nothing
									})),
							$elm$core$Platform$Cmd$none);
					}
				case 9:
					if (!_v0.b.$) {
						break _v0$10;
					} else {
						var _v25 = _v0.a;
						var _v26 = _v0.b;
						var modal = _v26.a;
						var pg = _v26.b;
						var game = pg.o;
						var data = game.an;
						return _Utils_Tuple3(
							vault,
							A2(
								$author$project$Model$PlayGame,
								modal,
								_Utils_update(
									pg,
									{
										o: _Utils_update(
											game,
											{
												an: _Utils_update(
													data,
													{
														o: $pilatch$elm_chess$Game$toEnd(data.o)
													})
											}),
										R: $elm$core$Maybe$Nothing
									})),
							$elm$core$Platform$Cmd$none);
					}
				default:
					if (!_v0.b.$) {
						break _v0$10;
					} else {
						var _v29 = _v0.a;
						var _v30 = _v0.b;
						var modal = _v30.a;
						var pg = _v30.b;
						return _Utils_Tuple3(
							vault,
							A2(
								$author$project$Model$PlayGame,
								modal,
								_Utils_update(
									pg,
									{b7: !pg.b7})),
							$elm$core$Platform$Cmd$none);
					}
			}
		}
		return _Utils_Tuple3(
			vault,
			$author$project$Model$BrowsingGames($elm$core$Maybe$Nothing),
			$elm$core$Platform$Cmd$none);
	});
var $author$project$Main$update = F2(
	function (msg, model) {
		var _v0 = _Utils_Tuple2(model, msg);
		switch (_v0.a.$) {
			case 0:
				switch (_v0.b.$) {
					case 0:
						var data = _v0.b.a;
						return _Utils_Tuple2(
							$author$project$Model$LoginScreen(data),
							$elm$core$Platform$Cmd$none);
					case 1:
						var data = _v0.a.a;
						var _v1 = _v0.b;
						var vault = function () {
							var _v2 = data.ek;
							if (_v2 === 1) {
								return $author$project$Matrix$fromAccessToken(
									{b0: data.b0, aV: data.aV});
							} else {
								return $author$project$Matrix$fromLoginCredentials(
									{aV: data.aV, as: data.as, aA: data.aA});
							}
						}();
						return _Utils_Tuple2(
							A2($author$project$Model$InitialSync, data, vault),
							A2(
								$elm$core$Task$attempt,
								$author$project$Msg$InitialSync,
								$author$project$Matrix$sync(vault)));
					default:
						return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
				}
			case 1:
				if (_v0.b.$ === 2) {
					var _v3 = _v0.a;
					var data = _v3.a;
					var vault = _v3.b;
					var result = _v0.b.a;
					var failLoginWith = function (t) {
						return _Utils_Tuple2(
							$author$project$Model$LoginScreen(
								_Utils_update(
									data,
									{
										ao: $elm$core$Maybe$Just(t)
									})),
							$elm$core$Platform$Cmd$none);
					};
					_v4$9:
					while (true) {
						if (!result.$) {
							var vu = result.a;
							return _Utils_Tuple2(
								A2(
									$author$project$Model$LoggedIn,
									A2($author$project$Matrix$updateWith, vu, vault),
									$author$project$Model$BrowsingGames($elm$core$Maybe$Nothing)),
								$elm$core$Platform$Cmd$none);
						} else {
							switch (result.a.$) {
								case 0:
									switch (result.a.a.$) {
										case 2:
											var _v5 = result.a.a;
											return failLoginWith('You have a bad (or no) internet connection. Please try again.');
										case 1:
											var _v6 = result.a.a;
											return failLoginWith('Connection timed out. The server is overloaded or your connection is bad.');
										default:
											break _v4$9;
									}
								case 2:
									switch (result.a.a.$) {
										case 0:
											var error = result.a.a.a.ao;
											return failLoginWith(
												A2(
													$elm$core$Maybe$withDefault,
													'Failed to login! Invalid login credentials',
													A2(
														$elm$core$Maybe$map,
														$elm$core$Basics$append('Login failed: '),
														error)));
										case 1:
											var error = result.a.a.a.ao;
											return failLoginWith(
												A2(
													$elm$core$Maybe$withDefault,
													'The homeserver did not recognize your login credentials.',
													A2(
														$elm$core$Maybe$map,
														$elm$core$Basics$append('Unknown token: '),
														error)));
										case 9:
											var error = result.a.a.a.ao;
											return failLoginWith(
												A2(
													$elm$core$Maybe$withDefault,
													'Server did not authorize login',
													A2(
														$elm$core$Maybe$map,
														$elm$core$Basics$append('Unauthorized: '),
														error)));
										default:
											break _v4$9;
									}
								case 1:
									switch (result.a.a.$) {
										case 0:
											return failLoginWith('The homeserver returns bad JSON - are you sure you\'re pointing to a Matrix server?');
										case 2:
											var _v7 = result.a.a;
											return failLoginWith('Access token rejected by homeserver');
										default:
											break _v4$9;
									}
								default:
									var _v8 = result.a;
									return failLoginWith('The homeserver and this SDK are incompatible - they do not have any shared versions.');
							}
						}
					}
					return failLoginWith('An unknown error has occurred.');
				} else {
					var _v9 = _v0.a;
					return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
				}
			default:
				switch (_v0.b.$) {
					case 3:
						var _v10 = _v0.a;
						var vault = _v10.a;
						var _v11 = _v0.b;
						return _Utils_Tuple2(
							model,
							A2(
								$elm$core$Task$attempt,
								A2($elm$core$Basics$composeR, $author$project$Msg$VaultUpdate, $author$project$Msg$LoggedIn),
								$author$project$Matrix$sync(vault)));
					case 4:
						var _v12 = _v0.a;
						var vault = _v12.a;
						var data = _v12.b;
						var subMsg = _v0.b.a;
						var _v13 = A3($author$project$GameMain$update, vault, subMsg, data);
						var newVault = _v13.a;
						var newData = _v13.b;
						var cmd = _v13.c;
						return _Utils_Tuple2(
							A2($author$project$Model$LoggedIn, newVault, newData),
							cmd);
					default:
						var _v14 = _v0.a;
						return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
				}
		}
	});
var $mdgriffith$elm_ui$Internal$Model$Colored = F3(
	function (a, b, c) {
		return {$: 4, a: a, b: b, c: c};
	});
var $mdgriffith$elm_ui$Internal$Model$StyleClass = F2(
	function (a, b) {
		return {$: 4, a: a, b: b};
	});
var $mdgriffith$elm_ui$Internal$Flag$Flag = function (a) {
	return {$: 0, a: a};
};
var $mdgriffith$elm_ui$Internal$Flag$Second = function (a) {
	return {$: 1, a: a};
};
var $mdgriffith$elm_ui$Internal$Flag$flag = function (i) {
	return (i > 31) ? $mdgriffith$elm_ui$Internal$Flag$Second(1 << (i - 32)) : $mdgriffith$elm_ui$Internal$Flag$Flag(1 << i);
};
var $mdgriffith$elm_ui$Internal$Flag$bgColor = $mdgriffith$elm_ui$Internal$Flag$flag(8);
var $elm$core$Basics$round = _Basics_round;
var $mdgriffith$elm_ui$Internal$Model$floatClass = function (x) {
	return $elm$core$String$fromInt(
		$elm$core$Basics$round(x * 255));
};
var $mdgriffith$elm_ui$Internal$Model$formatColorClass = function (_v0) {
	var red = _v0.a;
	var green = _v0.b;
	var blue = _v0.c;
	var alpha = _v0.d;
	return $mdgriffith$elm_ui$Internal$Model$floatClass(red) + ('-' + ($mdgriffith$elm_ui$Internal$Model$floatClass(green) + ('-' + ($mdgriffith$elm_ui$Internal$Model$floatClass(blue) + ('-' + $mdgriffith$elm_ui$Internal$Model$floatClass(alpha))))));
};
var $mdgriffith$elm_ui$Element$Background$color = function (clr) {
	return A2(
		$mdgriffith$elm_ui$Internal$Model$StyleClass,
		$mdgriffith$elm_ui$Internal$Flag$bgColor,
		A3(
			$mdgriffith$elm_ui$Internal$Model$Colored,
			'bg-' + $mdgriffith$elm_ui$Internal$Model$formatColorClass(clr),
			'background-color',
			clr));
};
var $mdgriffith$elm_ui$Internal$Model$Rgba = F4(
	function (a, b, c, d) {
		return {$: 0, a: a, b: b, c: c, d: d};
	});
var $mdgriffith$elm_ui$Element$fromRgb = function (clr) {
	return A4($mdgriffith$elm_ui$Internal$Model$Rgba, clr.cR, clr.ck, clr.b6, clr.aC);
};
var $avh4$elm_color$Color$toRgba = function (_v0) {
	var r = _v0.a;
	var g = _v0.b;
	var b = _v0.c;
	var a = _v0.d;
	return {aC: a, b6: b, ck: g, cR: r};
};
var $author$project$Colors$background = A2(
	$elm$core$Basics$composeR,
	$avh4$elm_color$Color$toRgba,
	A2($elm$core$Basics$composeR, $mdgriffith$elm_ui$Element$fromRgb, $mdgriffith$elm_ui$Element$Background$color));
var $mdgriffith$elm_ui$Internal$Model$AlignX = function (a) {
	return {$: 6, a: a};
};
var $mdgriffith$elm_ui$Internal$Model$CenterX = 1;
var $mdgriffith$elm_ui$Element$centerX = $mdgriffith$elm_ui$Internal$Model$AlignX(1);
var $mdgriffith$elm_ui$Internal$Style$classes = {eL: 'a', dd: 'atv', eO: 'ab', eP: 'cx', eQ: 'cy', eR: 'acb', eS: 'accx', eT: 'accy', eU: 'acr', dg: 'al', dh: 'ar', eV: 'at', b2: 'ah', b3: 'av', eY: 's', e1: 'bh', e2: 'b', e6: 'w7', e8: 'bd', e9: 'bdt', bE: 'bn', fa: 'bs', bI: 'cpe', fg: 'cp', fh: 'cpx', fi: 'cpy', al: 'c', bL: 'ctr', bM: 'cb', bN: 'ccx', am: 'ccy', bg: 'cl', bO: 'cr', fl: 'ct', fn: 'cptr', fo: 'ctxt', fE: 'fcs', dy: 'focus-within', fF: 'fs', fH: 'g', cl: 'hbh', cm: 'hc', dC: 'he', cn: 'hf', dD: 'hfp', fM: 'hv', fQ: 'ic', fS: 'fr', bS: 'lbl', fV: 'iml', fW: 'imlf', fX: 'imlp', fY: 'implw', fZ: 'it', f0: 'i', dQ: 'lnk', a4: 'nb', dX: 'notxt', gg: 'ol', gh: 'or', aL: 'oq', gq: 'oh', d$: 'pg', d0: 'p', gr: 'ppe', gE: 'ui', eh: 'r', gH: 'sb', gI: 'sbx', gJ: 'sby', gK: 'sbt', gN: 'e', gO: 'cap', gP: 'sev', gX: 'sk', g: 't', g1: 'tc', g2: 'w8', g3: 'w2', g4: 'w9', g5: 'tj', bZ: 'tja', g6: 'tl', g7: 'w3', g8: 'w5', g9: 'w4', ha: 'tr', hb: 'w6', hc: 'w1', hd: 'tun', eA: 'ts', aT: 'clr', hk: 'u', c9: 'wc', eG: 'we', da: 'wf', eH: 'wfp', db: 'wrp'};
var $mdgriffith$elm_ui$Internal$Model$Attr = function (a) {
	return {$: 1, a: a};
};
var $elm$html$Html$Attributes$stringProperty = F2(
	function (key, string) {
		return A2(
			_VirtualDom_property,
			key,
			$elm$json$Json$Encode$string(string));
	});
var $elm$html$Html$Attributes$class = $elm$html$Html$Attributes$stringProperty('className');
var $mdgriffith$elm_ui$Internal$Model$htmlClass = function (cls) {
	return $mdgriffith$elm_ui$Internal$Model$Attr(
		$elm$html$Html$Attributes$class(cls));
};
var $mdgriffith$elm_ui$Internal$Model$OnlyDynamic = F2(
	function (a, b) {
		return {$: 2, a: a, b: b};
	});
var $mdgriffith$elm_ui$Internal$Model$StaticRootAndDynamic = F2(
	function (a, b) {
		return {$: 1, a: a, b: b};
	});
var $mdgriffith$elm_ui$Internal$Model$Unkeyed = function (a) {
	return {$: 0, a: a};
};
var $mdgriffith$elm_ui$Internal$Model$AsEl = 2;
var $mdgriffith$elm_ui$Internal$Model$asEl = 2;
var $mdgriffith$elm_ui$Internal$Model$Generic = {$: 0};
var $mdgriffith$elm_ui$Internal$Model$div = $mdgriffith$elm_ui$Internal$Model$Generic;
var $mdgriffith$elm_ui$Internal$Model$NoNearbyChildren = {$: 0};
var $mdgriffith$elm_ui$Internal$Model$columnClass = $mdgriffith$elm_ui$Internal$Style$classes.eY + (' ' + $mdgriffith$elm_ui$Internal$Style$classes.al);
var $mdgriffith$elm_ui$Internal$Model$gridClass = $mdgriffith$elm_ui$Internal$Style$classes.eY + (' ' + $mdgriffith$elm_ui$Internal$Style$classes.fH);
var $mdgriffith$elm_ui$Internal$Model$pageClass = $mdgriffith$elm_ui$Internal$Style$classes.eY + (' ' + $mdgriffith$elm_ui$Internal$Style$classes.d$);
var $mdgriffith$elm_ui$Internal$Model$paragraphClass = $mdgriffith$elm_ui$Internal$Style$classes.eY + (' ' + $mdgriffith$elm_ui$Internal$Style$classes.d0);
var $mdgriffith$elm_ui$Internal$Model$rowClass = $mdgriffith$elm_ui$Internal$Style$classes.eY + (' ' + $mdgriffith$elm_ui$Internal$Style$classes.eh);
var $mdgriffith$elm_ui$Internal$Model$singleClass = $mdgriffith$elm_ui$Internal$Style$classes.eY + (' ' + $mdgriffith$elm_ui$Internal$Style$classes.gN);
var $mdgriffith$elm_ui$Internal$Model$contextClasses = function (context) {
	switch (context) {
		case 0:
			return $mdgriffith$elm_ui$Internal$Model$rowClass;
		case 1:
			return $mdgriffith$elm_ui$Internal$Model$columnClass;
		case 2:
			return $mdgriffith$elm_ui$Internal$Model$singleClass;
		case 3:
			return $mdgriffith$elm_ui$Internal$Model$gridClass;
		case 4:
			return $mdgriffith$elm_ui$Internal$Model$paragraphClass;
		default:
			return $mdgriffith$elm_ui$Internal$Model$pageClass;
	}
};
var $mdgriffith$elm_ui$Internal$Model$Keyed = function (a) {
	return {$: 1, a: a};
};
var $mdgriffith$elm_ui$Internal$Model$NoStyleSheet = {$: 0};
var $mdgriffith$elm_ui$Internal$Model$Styled = function (a) {
	return {$: 1, a: a};
};
var $mdgriffith$elm_ui$Internal$Model$Unstyled = function (a) {
	return {$: 0, a: a};
};
var $mdgriffith$elm_ui$Internal$Model$addChildren = F2(
	function (existing, nearbyChildren) {
		switch (nearbyChildren.$) {
			case 0:
				return existing;
			case 1:
				var behind = nearbyChildren.a;
				return _Utils_ap(behind, existing);
			case 2:
				var inFront = nearbyChildren.a;
				return _Utils_ap(existing, inFront);
			default:
				var behind = nearbyChildren.a;
				var inFront = nearbyChildren.b;
				return _Utils_ap(
					behind,
					_Utils_ap(existing, inFront));
		}
	});
var $mdgriffith$elm_ui$Internal$Model$addKeyedChildren = F3(
	function (key, existing, nearbyChildren) {
		switch (nearbyChildren.$) {
			case 0:
				return existing;
			case 1:
				var behind = nearbyChildren.a;
				return _Utils_ap(
					A2(
						$elm$core$List$map,
						function (x) {
							return _Utils_Tuple2(key, x);
						},
						behind),
					existing);
			case 2:
				var inFront = nearbyChildren.a;
				return _Utils_ap(
					existing,
					A2(
						$elm$core$List$map,
						function (x) {
							return _Utils_Tuple2(key, x);
						},
						inFront));
			default:
				var behind = nearbyChildren.a;
				var inFront = nearbyChildren.b;
				return _Utils_ap(
					A2(
						$elm$core$List$map,
						function (x) {
							return _Utils_Tuple2(key, x);
						},
						behind),
					_Utils_ap(
						existing,
						A2(
							$elm$core$List$map,
							function (x) {
								return _Utils_Tuple2(key, x);
							},
							inFront)));
		}
	});
var $mdgriffith$elm_ui$Internal$Model$AsParagraph = 4;
var $mdgriffith$elm_ui$Internal$Model$asParagraph = 4;
var $mdgriffith$elm_ui$Internal$Flag$alignBottom = $mdgriffith$elm_ui$Internal$Flag$flag(41);
var $mdgriffith$elm_ui$Internal$Flag$alignRight = $mdgriffith$elm_ui$Internal$Flag$flag(40);
var $mdgriffith$elm_ui$Internal$Flag$centerX = $mdgriffith$elm_ui$Internal$Flag$flag(42);
var $mdgriffith$elm_ui$Internal$Flag$centerY = $mdgriffith$elm_ui$Internal$Flag$flag(43);
var $elm$html$Html$div = _VirtualDom_node('div');
var $elm$core$Set$Set_elm_builtin = $elm$core$Basics$identity;
var $elm$core$Set$empty = $elm$core$Dict$empty;
var $mdgriffith$elm_ui$Internal$Model$lengthClassName = function (x) {
	switch (x.$) {
		case 0:
			var px = x.a;
			return $elm$core$String$fromInt(px) + 'px';
		case 1:
			return 'auto';
		case 2:
			var i = x.a;
			return $elm$core$String$fromInt(i) + 'fr';
		case 3:
			var min = x.a;
			var len = x.b;
			return 'min' + ($elm$core$String$fromInt(min) + $mdgriffith$elm_ui$Internal$Model$lengthClassName(len));
		default:
			var max = x.a;
			var len = x.b;
			return 'max' + ($elm$core$String$fromInt(max) + $mdgriffith$elm_ui$Internal$Model$lengthClassName(len));
	}
};
var $mdgriffith$elm_ui$Internal$Model$transformClass = function (transform) {
	switch (transform.$) {
		case 0:
			return $elm$core$Maybe$Nothing;
		case 1:
			var _v1 = transform.a;
			var x = _v1.a;
			var y = _v1.b;
			var z = _v1.c;
			return $elm$core$Maybe$Just(
				'mv-' + ($mdgriffith$elm_ui$Internal$Model$floatClass(x) + ('-' + ($mdgriffith$elm_ui$Internal$Model$floatClass(y) + ('-' + $mdgriffith$elm_ui$Internal$Model$floatClass(z))))));
		default:
			var _v2 = transform.a;
			var tx = _v2.a;
			var ty = _v2.b;
			var tz = _v2.c;
			var _v3 = transform.b;
			var sx = _v3.a;
			var sy = _v3.b;
			var sz = _v3.c;
			var _v4 = transform.c;
			var ox = _v4.a;
			var oy = _v4.b;
			var oz = _v4.c;
			var angle = transform.d;
			return $elm$core$Maybe$Just(
				'tfrm-' + ($mdgriffith$elm_ui$Internal$Model$floatClass(tx) + ('-' + ($mdgriffith$elm_ui$Internal$Model$floatClass(ty) + ('-' + ($mdgriffith$elm_ui$Internal$Model$floatClass(tz) + ('-' + ($mdgriffith$elm_ui$Internal$Model$floatClass(sx) + ('-' + ($mdgriffith$elm_ui$Internal$Model$floatClass(sy) + ('-' + ($mdgriffith$elm_ui$Internal$Model$floatClass(sz) + ('-' + ($mdgriffith$elm_ui$Internal$Model$floatClass(ox) + ('-' + ($mdgriffith$elm_ui$Internal$Model$floatClass(oy) + ('-' + ($mdgriffith$elm_ui$Internal$Model$floatClass(oz) + ('-' + $mdgriffith$elm_ui$Internal$Model$floatClass(angle))))))))))))))))))));
	}
};
var $mdgriffith$elm_ui$Internal$Model$getStyleName = function (style) {
	switch (style.$) {
		case 13:
			var name = style.a;
			return name;
		case 12:
			var name = style.a;
			var o = style.b;
			return name;
		case 0:
			var _class = style.a;
			return _class;
		case 1:
			var name = style.a;
			return name;
		case 2:
			var i = style.a;
			return 'font-size-' + $elm$core$String$fromInt(i);
		case 3:
			var _class = style.a;
			return _class;
		case 4:
			var _class = style.a;
			return _class;
		case 5:
			var cls = style.a;
			var x = style.b;
			var y = style.c;
			return cls;
		case 7:
			var cls = style.a;
			var top = style.b;
			var right = style.c;
			var bottom = style.d;
			var left = style.e;
			return cls;
		case 6:
			var cls = style.a;
			var top = style.b;
			var right = style.c;
			var bottom = style.d;
			var left = style.e;
			return cls;
		case 8:
			var template = style.a;
			return 'grid-rows-' + (A2(
				$elm$core$String$join,
				'-',
				A2($elm$core$List$map, $mdgriffith$elm_ui$Internal$Model$lengthClassName, template.gF)) + ('-cols-' + (A2(
				$elm$core$String$join,
				'-',
				A2($elm$core$List$map, $mdgriffith$elm_ui$Internal$Model$lengthClassName, template.bK)) + ('-space-x-' + ($mdgriffith$elm_ui$Internal$Model$lengthClassName(template.gQ.a) + ('-space-y-' + $mdgriffith$elm_ui$Internal$Model$lengthClassName(template.gQ.b)))))));
		case 9:
			var pos = style.a;
			return 'gp grid-pos-' + ($elm$core$String$fromInt(pos.eh) + ('-' + ($elm$core$String$fromInt(pos.dn) + ('-' + ($elm$core$String$fromInt(pos.Y) + ('-' + $elm$core$String$fromInt(pos.dB)))))));
		case 11:
			var selector = style.a;
			var subStyle = style.b;
			var name = function () {
				switch (selector) {
					case 0:
						return 'fs';
					case 1:
						return 'hv';
					default:
						return 'act';
				}
			}();
			return A2(
				$elm$core$String$join,
				' ',
				A2(
					$elm$core$List$map,
					function (sty) {
						var _v1 = $mdgriffith$elm_ui$Internal$Model$getStyleName(sty);
						if (_v1 === '') {
							return '';
						} else {
							var styleName = _v1;
							return styleName + ('-' + name);
						}
					},
					subStyle));
		default:
			var x = style.a;
			return A2(
				$elm$core$Maybe$withDefault,
				'',
				$mdgriffith$elm_ui$Internal$Model$transformClass(x));
	}
};
var $elm$core$Set$insert = F2(
	function (key, _v0) {
		var dict = _v0;
		return A3($elm$core$Dict$insert, key, 0, dict);
	});
var $elm$core$Dict$member = F2(
	function (key, dict) {
		var _v0 = A2($elm$core$Dict$get, key, dict);
		if (!_v0.$) {
			return true;
		} else {
			return false;
		}
	});
var $elm$core$Set$member = F2(
	function (key, _v0) {
		var dict = _v0;
		return A2($elm$core$Dict$member, key, dict);
	});
var $mdgriffith$elm_ui$Internal$Model$reduceStyles = F2(
	function (style, nevermind) {
		var cache = nevermind.a;
		var existing = nevermind.b;
		var styleName = $mdgriffith$elm_ui$Internal$Model$getStyleName(style);
		return A2($elm$core$Set$member, styleName, cache) ? nevermind : _Utils_Tuple2(
			A2($elm$core$Set$insert, styleName, cache),
			A2($elm$core$List$cons, style, existing));
	});
var $mdgriffith$elm_ui$Internal$Model$Property = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var $mdgriffith$elm_ui$Internal$Model$Style = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var $mdgriffith$elm_ui$Internal$Style$dot = function (c) {
	return '.' + c;
};
var $elm$core$String$fromFloat = _String_fromNumber;
var $mdgriffith$elm_ui$Internal$Model$formatColor = function (_v0) {
	var red = _v0.a;
	var green = _v0.b;
	var blue = _v0.c;
	var alpha = _v0.d;
	return 'rgba(' + ($elm$core$String$fromInt(
		$elm$core$Basics$round(red * 255)) + ((',' + $elm$core$String$fromInt(
		$elm$core$Basics$round(green * 255))) + ((',' + $elm$core$String$fromInt(
		$elm$core$Basics$round(blue * 255))) + (',' + ($elm$core$String$fromFloat(alpha) + ')')))));
};
var $mdgriffith$elm_ui$Internal$Model$formatBoxShadow = function (shadow) {
	return A2(
		$elm$core$String$join,
		' ',
		A2(
			$elm$core$List$filterMap,
			$elm$core$Basics$identity,
			_List_fromArray(
				[
					shadow.dK ? $elm$core$Maybe$Just('inset') : $elm$core$Maybe$Nothing,
					$elm$core$Maybe$Just(
					$elm$core$String$fromFloat(shadow.ge.a) + 'px'),
					$elm$core$Maybe$Just(
					$elm$core$String$fromFloat(shadow.ge.b) + 'px'),
					$elm$core$Maybe$Just(
					$elm$core$String$fromFloat(shadow.e4) + 'px'),
					$elm$core$Maybe$Just(
					$elm$core$String$fromFloat(shadow.ep) + 'px'),
					$elm$core$Maybe$Just(
					$mdgriffith$elm_ui$Internal$Model$formatColor(shadow.dp))
				])));
};
var $elm$core$Tuple$mapFirst = F2(
	function (func, _v0) {
		var x = _v0.a;
		var y = _v0.b;
		return _Utils_Tuple2(
			func(x),
			y);
	});
var $mdgriffith$elm_ui$Internal$Model$renderFocusStyle = function (focus) {
	return _List_fromArray(
		[
			A2(
			$mdgriffith$elm_ui$Internal$Model$Style,
			$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.dy) + ':focus-within',
			A2(
				$elm$core$List$filterMap,
				$elm$core$Basics$identity,
				_List_fromArray(
					[
						A2(
						$elm$core$Maybe$map,
						function (color) {
							return A2(
								$mdgriffith$elm_ui$Internal$Model$Property,
								'border-color',
								$mdgriffith$elm_ui$Internal$Model$formatColor(color));
						},
						focus.e7),
						A2(
						$elm$core$Maybe$map,
						function (color) {
							return A2(
								$mdgriffith$elm_ui$Internal$Model$Property,
								'background-color',
								$mdgriffith$elm_ui$Internal$Model$formatColor(color));
						},
						focus.e$),
						A2(
						$elm$core$Maybe$map,
						function (shadow) {
							return A2(
								$mdgriffith$elm_ui$Internal$Model$Property,
								'box-shadow',
								$mdgriffith$elm_ui$Internal$Model$formatBoxShadow(
									{
										e4: shadow.e4,
										dp: shadow.dp,
										dK: false,
										ge: A2(
											$elm$core$Tuple$mapSecond,
											$elm$core$Basics$toFloat,
											A2($elm$core$Tuple$mapFirst, $elm$core$Basics$toFloat, shadow.ge)),
										ep: shadow.ep
									}));
						},
						focus.gM),
						$elm$core$Maybe$Just(
						A2($mdgriffith$elm_ui$Internal$Model$Property, 'outline', 'none'))
					]))),
			A2(
			$mdgriffith$elm_ui$Internal$Model$Style,
			($mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.eY) + ':focus .focusable, ') + (($mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.eY) + '.focusable:focus, ') + ('.ui-slide-bar:focus + ' + ($mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.eY) + ' .focusable-thumb'))),
			A2(
				$elm$core$List$filterMap,
				$elm$core$Basics$identity,
				_List_fromArray(
					[
						A2(
						$elm$core$Maybe$map,
						function (color) {
							return A2(
								$mdgriffith$elm_ui$Internal$Model$Property,
								'border-color',
								$mdgriffith$elm_ui$Internal$Model$formatColor(color));
						},
						focus.e7),
						A2(
						$elm$core$Maybe$map,
						function (color) {
							return A2(
								$mdgriffith$elm_ui$Internal$Model$Property,
								'background-color',
								$mdgriffith$elm_ui$Internal$Model$formatColor(color));
						},
						focus.e$),
						A2(
						$elm$core$Maybe$map,
						function (shadow) {
							return A2(
								$mdgriffith$elm_ui$Internal$Model$Property,
								'box-shadow',
								$mdgriffith$elm_ui$Internal$Model$formatBoxShadow(
									{
										e4: shadow.e4,
										dp: shadow.dp,
										dK: false,
										ge: A2(
											$elm$core$Tuple$mapSecond,
											$elm$core$Basics$toFloat,
											A2($elm$core$Tuple$mapFirst, $elm$core$Basics$toFloat, shadow.ge)),
										ep: shadow.ep
									}));
						},
						focus.gM),
						$elm$core$Maybe$Just(
						A2($mdgriffith$elm_ui$Internal$Model$Property, 'outline', 'none'))
					])))
		]);
};
var $elm$virtual_dom$VirtualDom$node = function (tag) {
	return _VirtualDom_node(
		_VirtualDom_noScript(tag));
};
var $elm$virtual_dom$VirtualDom$property = F2(
	function (key, value) {
		return A2(
			_VirtualDom_property,
			_VirtualDom_noInnerHtmlOrFormAction(key),
			_VirtualDom_noJavaScriptOrHtmlJson(value));
	});
var $mdgriffith$elm_ui$Internal$Style$AllChildren = F2(
	function (a, b) {
		return {$: 2, a: a, b: b};
	});
var $mdgriffith$elm_ui$Internal$Style$Batch = function (a) {
	return {$: 6, a: a};
};
var $mdgriffith$elm_ui$Internal$Style$Child = F2(
	function (a, b) {
		return {$: 1, a: a, b: b};
	});
var $mdgriffith$elm_ui$Internal$Style$Class = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var $mdgriffith$elm_ui$Internal$Style$Descriptor = F2(
	function (a, b) {
		return {$: 4, a: a, b: b};
	});
var $mdgriffith$elm_ui$Internal$Style$Left = 3;
var $mdgriffith$elm_ui$Internal$Style$Prop = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var $mdgriffith$elm_ui$Internal$Style$Right = 2;
var $mdgriffith$elm_ui$Internal$Style$Self = $elm$core$Basics$identity;
var $mdgriffith$elm_ui$Internal$Style$Supports = F2(
	function (a, b) {
		return {$: 3, a: a, b: b};
	});
var $mdgriffith$elm_ui$Internal$Style$Content = $elm$core$Basics$identity;
var $mdgriffith$elm_ui$Internal$Style$Bottom = 1;
var $mdgriffith$elm_ui$Internal$Style$CenterX = 4;
var $mdgriffith$elm_ui$Internal$Style$CenterY = 5;
var $mdgriffith$elm_ui$Internal$Style$Top = 0;
var $mdgriffith$elm_ui$Internal$Style$alignments = _List_fromArray(
	[0, 1, 2, 3, 4, 5]);
var $mdgriffith$elm_ui$Internal$Style$contentName = function (desc) {
	switch (desc) {
		case 0:
			var _v1 = desc;
			return $mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.fl);
		case 1:
			var _v2 = desc;
			return $mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.bM);
		case 2:
			var _v3 = desc;
			return $mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.bO);
		case 3:
			var _v4 = desc;
			return $mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.bg);
		case 4:
			var _v5 = desc;
			return $mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.bN);
		default:
			var _v6 = desc;
			return $mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.am);
	}
};
var $mdgriffith$elm_ui$Internal$Style$selfName = function (desc) {
	switch (desc) {
		case 0:
			var _v1 = desc;
			return $mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.eV);
		case 1:
			var _v2 = desc;
			return $mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.eO);
		case 2:
			var _v3 = desc;
			return $mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.dh);
		case 3:
			var _v4 = desc;
			return $mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.dg);
		case 4:
			var _v5 = desc;
			return $mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.eP);
		default:
			var _v6 = desc;
			return $mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.eQ);
	}
};
var $mdgriffith$elm_ui$Internal$Style$describeAlignment = function (values) {
	var createDescription = function (alignment) {
		var _v0 = values(alignment);
		var content = _v0.a;
		var indiv = _v0.b;
		return _List_fromArray(
			[
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$contentName(alignment),
				content),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Child,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.eY),
				_List_fromArray(
					[
						A2(
						$mdgriffith$elm_ui$Internal$Style$Descriptor,
						$mdgriffith$elm_ui$Internal$Style$selfName(alignment),
						indiv)
					]))
			]);
	};
	return $mdgriffith$elm_ui$Internal$Style$Batch(
		A2($elm$core$List$concatMap, createDescription, $mdgriffith$elm_ui$Internal$Style$alignments));
};
var $mdgriffith$elm_ui$Internal$Style$elDescription = _List_fromArray(
	[
		A2($mdgriffith$elm_ui$Internal$Style$Prop, 'display', 'flex'),
		A2($mdgriffith$elm_ui$Internal$Style$Prop, 'flex-direction', 'column'),
		A2($mdgriffith$elm_ui$Internal$Style$Prop, 'white-space', 'pre'),
		A2(
		$mdgriffith$elm_ui$Internal$Style$Descriptor,
		$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.cl),
		_List_fromArray(
			[
				A2($mdgriffith$elm_ui$Internal$Style$Prop, 'z-index', '0'),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Child,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.e1),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'z-index', '-1')
					]))
			])),
		A2(
		$mdgriffith$elm_ui$Internal$Style$Descriptor,
		$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.gK),
		_List_fromArray(
			[
				A2(
				$mdgriffith$elm_ui$Internal$Style$Child,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.g),
				_List_fromArray(
					[
						A2(
						$mdgriffith$elm_ui$Internal$Style$Descriptor,
						$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.cn),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'flex-grow', '0')
							])),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Descriptor,
						$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.da),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'align-self', 'auto !important')
							]))
					]))
			])),
		A2(
		$mdgriffith$elm_ui$Internal$Style$Child,
		$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.cm),
		_List_fromArray(
			[
				A2($mdgriffith$elm_ui$Internal$Style$Prop, 'height', 'auto')
			])),
		A2(
		$mdgriffith$elm_ui$Internal$Style$Child,
		$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.cn),
		_List_fromArray(
			[
				A2($mdgriffith$elm_ui$Internal$Style$Prop, 'flex-grow', '100000')
			])),
		A2(
		$mdgriffith$elm_ui$Internal$Style$Child,
		$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.da),
		_List_fromArray(
			[
				A2($mdgriffith$elm_ui$Internal$Style$Prop, 'width', '100%')
			])),
		A2(
		$mdgriffith$elm_ui$Internal$Style$Child,
		$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.eH),
		_List_fromArray(
			[
				A2($mdgriffith$elm_ui$Internal$Style$Prop, 'width', '100%')
			])),
		A2(
		$mdgriffith$elm_ui$Internal$Style$Child,
		$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.c9),
		_List_fromArray(
			[
				A2($mdgriffith$elm_ui$Internal$Style$Prop, 'align-self', 'flex-start')
			])),
		$mdgriffith$elm_ui$Internal$Style$describeAlignment(
		function (alignment) {
			switch (alignment) {
				case 0:
					return _Utils_Tuple2(
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'justify-content', 'flex-start')
							]),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'margin-bottom', 'auto !important'),
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'margin-top', '0 !important')
							]));
				case 1:
					return _Utils_Tuple2(
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'justify-content', 'flex-end')
							]),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'margin-top', 'auto !important'),
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'margin-bottom', '0 !important')
							]));
				case 2:
					return _Utils_Tuple2(
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'align-items', 'flex-end')
							]),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'align-self', 'flex-end')
							]));
				case 3:
					return _Utils_Tuple2(
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'align-items', 'flex-start')
							]),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'align-self', 'flex-start')
							]));
				case 4:
					return _Utils_Tuple2(
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'align-items', 'center')
							]),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'align-self', 'center')
							]));
				default:
					return _Utils_Tuple2(
						_List_fromArray(
							[
								A2(
								$mdgriffith$elm_ui$Internal$Style$Child,
								$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.eY),
								_List_fromArray(
									[
										A2($mdgriffith$elm_ui$Internal$Style$Prop, 'margin-top', 'auto'),
										A2($mdgriffith$elm_ui$Internal$Style$Prop, 'margin-bottom', 'auto')
									]))
							]),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'margin-top', 'auto !important'),
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'margin-bottom', 'auto !important')
							]));
			}
		})
	]);
var $mdgriffith$elm_ui$Internal$Style$gridAlignments = function (values) {
	var createDescription = function (alignment) {
		return _List_fromArray(
			[
				A2(
				$mdgriffith$elm_ui$Internal$Style$Child,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.eY),
				_List_fromArray(
					[
						A2(
						$mdgriffith$elm_ui$Internal$Style$Descriptor,
						$mdgriffith$elm_ui$Internal$Style$selfName(alignment),
						values(alignment))
					]))
			]);
	};
	return $mdgriffith$elm_ui$Internal$Style$Batch(
		A2($elm$core$List$concatMap, createDescription, $mdgriffith$elm_ui$Internal$Style$alignments));
};
var $mdgriffith$elm_ui$Internal$Style$Above = 0;
var $mdgriffith$elm_ui$Internal$Style$Behind = 5;
var $mdgriffith$elm_ui$Internal$Style$Below = 1;
var $mdgriffith$elm_ui$Internal$Style$OnLeft = 3;
var $mdgriffith$elm_ui$Internal$Style$OnRight = 2;
var $mdgriffith$elm_ui$Internal$Style$Within = 4;
var $mdgriffith$elm_ui$Internal$Style$locations = function () {
	var loc = 0;
	var _v0 = function () {
		switch (loc) {
			case 0:
				return 0;
			case 1:
				return 0;
			case 2:
				return 0;
			case 3:
				return 0;
			case 4:
				return 0;
			default:
				return 0;
		}
	}();
	return _List_fromArray(
		[0, 1, 2, 3, 4, 5]);
}();
var $mdgriffith$elm_ui$Internal$Style$baseSheet = _List_fromArray(
	[
		A2(
		$mdgriffith$elm_ui$Internal$Style$Class,
		'html,body',
		_List_fromArray(
			[
				A2($mdgriffith$elm_ui$Internal$Style$Prop, 'height', '100%'),
				A2($mdgriffith$elm_ui$Internal$Style$Prop, 'padding', '0'),
				A2($mdgriffith$elm_ui$Internal$Style$Prop, 'margin', '0')
			])),
		A2(
		$mdgriffith$elm_ui$Internal$Style$Class,
		_Utils_ap(
			$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.eY),
			_Utils_ap(
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.gN),
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.fQ))),
		_List_fromArray(
			[
				A2($mdgriffith$elm_ui$Internal$Style$Prop, 'display', 'block'),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.cn),
				_List_fromArray(
					[
						A2(
						$mdgriffith$elm_ui$Internal$Style$Child,
						'img',
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'max-height', '100%'),
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'object-fit', 'cover')
							]))
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.da),
				_List_fromArray(
					[
						A2(
						$mdgriffith$elm_ui$Internal$Style$Child,
						'img',
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'max-width', '100%'),
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'object-fit', 'cover')
							]))
					]))
			])),
		A2(
		$mdgriffith$elm_ui$Internal$Style$Class,
		$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.eY) + ':focus',
		_List_fromArray(
			[
				A2($mdgriffith$elm_ui$Internal$Style$Prop, 'outline', 'none')
			])),
		A2(
		$mdgriffith$elm_ui$Internal$Style$Class,
		$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.gE),
		_List_fromArray(
			[
				A2($mdgriffith$elm_ui$Internal$Style$Prop, 'width', '100%'),
				A2($mdgriffith$elm_ui$Internal$Style$Prop, 'height', 'auto'),
				A2($mdgriffith$elm_ui$Internal$Style$Prop, 'min-height', '100%'),
				A2($mdgriffith$elm_ui$Internal$Style$Prop, 'z-index', '0'),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				_Utils_ap(
					$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.eY),
					$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.cn)),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'height', '100%'),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Child,
						$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.cn),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'height', '100%')
							]))
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Child,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.fS),
				_List_fromArray(
					[
						A2(
						$mdgriffith$elm_ui$Internal$Style$Descriptor,
						$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.a4),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'position', 'fixed'),
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'z-index', '20')
							]))
					]))
			])),
		A2(
		$mdgriffith$elm_ui$Internal$Style$Class,
		$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.a4),
		_List_fromArray(
			[
				A2($mdgriffith$elm_ui$Internal$Style$Prop, 'position', 'relative'),
				A2($mdgriffith$elm_ui$Internal$Style$Prop, 'border', 'none'),
				A2($mdgriffith$elm_ui$Internal$Style$Prop, 'display', 'flex'),
				A2($mdgriffith$elm_ui$Internal$Style$Prop, 'flex-direction', 'row'),
				A2($mdgriffith$elm_ui$Internal$Style$Prop, 'flex-basis', 'auto'),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.gN),
				$mdgriffith$elm_ui$Internal$Style$elDescription),
				$mdgriffith$elm_ui$Internal$Style$Batch(
				function (fn) {
					return A2($elm$core$List$map, fn, $mdgriffith$elm_ui$Internal$Style$locations);
				}(
					function (loc) {
						switch (loc) {
							case 0:
								return A2(
									$mdgriffith$elm_ui$Internal$Style$Descriptor,
									$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.eL),
									_List_fromArray(
										[
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'position', 'absolute'),
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'bottom', '100%'),
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'left', '0'),
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'width', '100%'),
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'z-index', '20'),
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'margin', '0 !important'),
											A2(
											$mdgriffith$elm_ui$Internal$Style$Child,
											$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.cn),
											_List_fromArray(
												[
													A2($mdgriffith$elm_ui$Internal$Style$Prop, 'height', 'auto')
												])),
											A2(
											$mdgriffith$elm_ui$Internal$Style$Child,
											$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.da),
											_List_fromArray(
												[
													A2($mdgriffith$elm_ui$Internal$Style$Prop, 'width', '100%')
												])),
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'pointer-events', 'none'),
											A2(
											$mdgriffith$elm_ui$Internal$Style$Child,
											'*',
											_List_fromArray(
												[
													A2($mdgriffith$elm_ui$Internal$Style$Prop, 'pointer-events', 'auto')
												]))
										]));
							case 1:
								return A2(
									$mdgriffith$elm_ui$Internal$Style$Descriptor,
									$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.e2),
									_List_fromArray(
										[
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'position', 'absolute'),
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'bottom', '0'),
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'left', '0'),
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'height', '0'),
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'width', '100%'),
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'z-index', '20'),
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'margin', '0 !important'),
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'pointer-events', 'none'),
											A2(
											$mdgriffith$elm_ui$Internal$Style$Child,
											'*',
											_List_fromArray(
												[
													A2($mdgriffith$elm_ui$Internal$Style$Prop, 'pointer-events', 'auto')
												])),
											A2(
											$mdgriffith$elm_ui$Internal$Style$Child,
											$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.cn),
											_List_fromArray(
												[
													A2($mdgriffith$elm_ui$Internal$Style$Prop, 'height', 'auto')
												]))
										]));
							case 2:
								return A2(
									$mdgriffith$elm_ui$Internal$Style$Descriptor,
									$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.gh),
									_List_fromArray(
										[
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'position', 'absolute'),
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'left', '100%'),
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'top', '0'),
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'height', '100%'),
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'margin', '0 !important'),
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'z-index', '20'),
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'pointer-events', 'none'),
											A2(
											$mdgriffith$elm_ui$Internal$Style$Child,
											'*',
											_List_fromArray(
												[
													A2($mdgriffith$elm_ui$Internal$Style$Prop, 'pointer-events', 'auto')
												]))
										]));
							case 3:
								return A2(
									$mdgriffith$elm_ui$Internal$Style$Descriptor,
									$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.gg),
									_List_fromArray(
										[
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'position', 'absolute'),
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'right', '100%'),
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'top', '0'),
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'height', '100%'),
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'margin', '0 !important'),
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'z-index', '20'),
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'pointer-events', 'none'),
											A2(
											$mdgriffith$elm_ui$Internal$Style$Child,
											'*',
											_List_fromArray(
												[
													A2($mdgriffith$elm_ui$Internal$Style$Prop, 'pointer-events', 'auto')
												]))
										]));
							case 4:
								return A2(
									$mdgriffith$elm_ui$Internal$Style$Descriptor,
									$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.fS),
									_List_fromArray(
										[
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'position', 'absolute'),
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'width', '100%'),
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'height', '100%'),
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'left', '0'),
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'top', '0'),
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'margin', '0 !important'),
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'pointer-events', 'none'),
											A2(
											$mdgriffith$elm_ui$Internal$Style$Child,
											'*',
											_List_fromArray(
												[
													A2($mdgriffith$elm_ui$Internal$Style$Prop, 'pointer-events', 'auto')
												]))
										]));
							default:
								return A2(
									$mdgriffith$elm_ui$Internal$Style$Descriptor,
									$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.e1),
									_List_fromArray(
										[
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'position', 'absolute'),
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'width', '100%'),
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'height', '100%'),
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'left', '0'),
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'top', '0'),
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'margin', '0 !important'),
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'z-index', '0'),
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'pointer-events', 'none'),
											A2(
											$mdgriffith$elm_ui$Internal$Style$Child,
											'*',
											_List_fromArray(
												[
													A2($mdgriffith$elm_ui$Internal$Style$Prop, 'pointer-events', 'auto')
												]))
										]));
						}
					}))
			])),
		A2(
		$mdgriffith$elm_ui$Internal$Style$Class,
		$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.eY),
		_List_fromArray(
			[
				A2($mdgriffith$elm_ui$Internal$Style$Prop, 'position', 'relative'),
				A2($mdgriffith$elm_ui$Internal$Style$Prop, 'border', 'none'),
				A2($mdgriffith$elm_ui$Internal$Style$Prop, 'flex-shrink', '0'),
				A2($mdgriffith$elm_ui$Internal$Style$Prop, 'display', 'flex'),
				A2($mdgriffith$elm_ui$Internal$Style$Prop, 'flex-direction', 'row'),
				A2($mdgriffith$elm_ui$Internal$Style$Prop, 'flex-basis', 'auto'),
				A2($mdgriffith$elm_ui$Internal$Style$Prop, 'resize', 'none'),
				A2($mdgriffith$elm_ui$Internal$Style$Prop, 'font-feature-settings', 'inherit'),
				A2($mdgriffith$elm_ui$Internal$Style$Prop, 'box-sizing', 'border-box'),
				A2($mdgriffith$elm_ui$Internal$Style$Prop, 'margin', '0'),
				A2($mdgriffith$elm_ui$Internal$Style$Prop, 'padding', '0'),
				A2($mdgriffith$elm_ui$Internal$Style$Prop, 'border-width', '0'),
				A2($mdgriffith$elm_ui$Internal$Style$Prop, 'border-style', 'solid'),
				A2($mdgriffith$elm_ui$Internal$Style$Prop, 'font-size', 'inherit'),
				A2($mdgriffith$elm_ui$Internal$Style$Prop, 'color', 'inherit'),
				A2($mdgriffith$elm_ui$Internal$Style$Prop, 'font-family', 'inherit'),
				A2($mdgriffith$elm_ui$Internal$Style$Prop, 'line-height', '1'),
				A2($mdgriffith$elm_ui$Internal$Style$Prop, 'font-weight', 'inherit'),
				A2($mdgriffith$elm_ui$Internal$Style$Prop, 'text-decoration', 'none'),
				A2($mdgriffith$elm_ui$Internal$Style$Prop, 'font-style', 'inherit'),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.db),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'flex-wrap', 'wrap')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.dX),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, '-moz-user-select', 'none'),
						A2($mdgriffith$elm_ui$Internal$Style$Prop, '-webkit-user-select', 'none'),
						A2($mdgriffith$elm_ui$Internal$Style$Prop, '-ms-user-select', 'none'),
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'user-select', 'none')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.fn),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'cursor', 'pointer')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.fo),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'cursor', 'text')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.gr),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'pointer-events', 'none !important')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.bI),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'pointer-events', 'auto !important')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.aT),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'opacity', '0')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.aL),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'opacity', '1')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot(
					_Utils_ap($mdgriffith$elm_ui$Internal$Style$classes.fM, $mdgriffith$elm_ui$Internal$Style$classes.aT)) + ':hover',
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'opacity', '0')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot(
					_Utils_ap($mdgriffith$elm_ui$Internal$Style$classes.fM, $mdgriffith$elm_ui$Internal$Style$classes.aL)) + ':hover',
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'opacity', '1')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot(
					_Utils_ap($mdgriffith$elm_ui$Internal$Style$classes.fE, $mdgriffith$elm_ui$Internal$Style$classes.aT)) + ':focus',
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'opacity', '0')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot(
					_Utils_ap($mdgriffith$elm_ui$Internal$Style$classes.fE, $mdgriffith$elm_ui$Internal$Style$classes.aL)) + ':focus',
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'opacity', '1')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot(
					_Utils_ap($mdgriffith$elm_ui$Internal$Style$classes.dd, $mdgriffith$elm_ui$Internal$Style$classes.aT)) + ':active',
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'opacity', '0')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot(
					_Utils_ap($mdgriffith$elm_ui$Internal$Style$classes.dd, $mdgriffith$elm_ui$Internal$Style$classes.aL)) + ':active',
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'opacity', '1')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.eA),
				_List_fromArray(
					[
						A2(
						$mdgriffith$elm_ui$Internal$Style$Prop,
						'transition',
						A2(
							$elm$core$String$join,
							', ',
							A2(
								$elm$core$List$map,
								function (x) {
									return x + ' 160ms';
								},
								_List_fromArray(
									['transform', 'opacity', 'filter', 'background-color', 'color', 'font-size']))))
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.gH),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'overflow', 'auto'),
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'flex-shrink', '1')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.gI),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'overflow-x', 'auto'),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Descriptor,
						$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.eh),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'flex-shrink', '1')
							]))
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.gJ),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'overflow-y', 'auto'),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Descriptor,
						$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.al),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'flex-shrink', '1')
							])),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Descriptor,
						$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.gN),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'flex-shrink', '1')
							]))
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.fg),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'overflow', 'hidden')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.fh),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'overflow-x', 'hidden')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.fi),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'overflow-y', 'hidden')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.c9),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'width', 'auto')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.bE),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'border-width', '0')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.e8),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'border-style', 'dashed')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.e9),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'border-style', 'dotted')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.fa),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'border-style', 'solid')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.g),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'white-space', 'pre'),
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'display', 'inline-block')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.fZ),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'line-height', '1.05'),
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'background', 'transparent'),
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'text-align', 'inherit')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.gN),
				$mdgriffith$elm_ui$Internal$Style$elDescription),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.eh),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'display', 'flex'),
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'flex-direction', 'row'),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Child,
						$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.eY),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'flex-basis', '0%'),
								A2(
								$mdgriffith$elm_ui$Internal$Style$Descriptor,
								$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.eG),
								_List_fromArray(
									[
										A2($mdgriffith$elm_ui$Internal$Style$Prop, 'flex-basis', 'auto')
									])),
								A2(
								$mdgriffith$elm_ui$Internal$Style$Descriptor,
								$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.dQ),
								_List_fromArray(
									[
										A2($mdgriffith$elm_ui$Internal$Style$Prop, 'flex-basis', 'auto')
									]))
							])),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Child,
						$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.cn),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'align-self', 'stretch !important')
							])),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Child,
						$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.dD),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'align-self', 'stretch !important')
							])),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Child,
						$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.da),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'flex-grow', '100000')
							])),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Child,
						$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.bL),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'flex-grow', '0'),
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'flex-basis', 'auto'),
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'align-self', 'stretch')
							])),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Child,
						'u:first-of-type.' + $mdgriffith$elm_ui$Internal$Style$classes.eU,
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'flex-grow', '1')
							])),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Child,
						's:first-of-type.' + $mdgriffith$elm_ui$Internal$Style$classes.eS,
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'flex-grow', '1'),
								A2(
								$mdgriffith$elm_ui$Internal$Style$Child,
								$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.eP),
								_List_fromArray(
									[
										A2($mdgriffith$elm_ui$Internal$Style$Prop, 'margin-left', 'auto !important')
									]))
							])),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Child,
						's:last-of-type.' + $mdgriffith$elm_ui$Internal$Style$classes.eS,
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'flex-grow', '1'),
								A2(
								$mdgriffith$elm_ui$Internal$Style$Child,
								$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.eP),
								_List_fromArray(
									[
										A2($mdgriffith$elm_ui$Internal$Style$Prop, 'margin-right', 'auto !important')
									]))
							])),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Child,
						's:only-of-type.' + $mdgriffith$elm_ui$Internal$Style$classes.eS,
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'flex-grow', '1'),
								A2(
								$mdgriffith$elm_ui$Internal$Style$Child,
								$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.eQ),
								_List_fromArray(
									[
										A2($mdgriffith$elm_ui$Internal$Style$Prop, 'margin-top', 'auto !important'),
										A2($mdgriffith$elm_ui$Internal$Style$Prop, 'margin-bottom', 'auto !important')
									]))
							])),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Child,
						's:last-of-type.' + ($mdgriffith$elm_ui$Internal$Style$classes.eS + ' ~ u'),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'flex-grow', '0')
							])),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Child,
						'u:first-of-type.' + ($mdgriffith$elm_ui$Internal$Style$classes.eU + (' ~ s.' + $mdgriffith$elm_ui$Internal$Style$classes.eS)),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'flex-grow', '0')
							])),
						$mdgriffith$elm_ui$Internal$Style$describeAlignment(
						function (alignment) {
							switch (alignment) {
								case 0:
									return _Utils_Tuple2(
										_List_fromArray(
											[
												A2($mdgriffith$elm_ui$Internal$Style$Prop, 'align-items', 'flex-start')
											]),
										_List_fromArray(
											[
												A2($mdgriffith$elm_ui$Internal$Style$Prop, 'align-self', 'flex-start')
											]));
								case 1:
									return _Utils_Tuple2(
										_List_fromArray(
											[
												A2($mdgriffith$elm_ui$Internal$Style$Prop, 'align-items', 'flex-end')
											]),
										_List_fromArray(
											[
												A2($mdgriffith$elm_ui$Internal$Style$Prop, 'align-self', 'flex-end')
											]));
								case 2:
									return _Utils_Tuple2(
										_List_fromArray(
											[
												A2($mdgriffith$elm_ui$Internal$Style$Prop, 'justify-content', 'flex-end')
											]),
										_List_Nil);
								case 3:
									return _Utils_Tuple2(
										_List_fromArray(
											[
												A2($mdgriffith$elm_ui$Internal$Style$Prop, 'justify-content', 'flex-start')
											]),
										_List_Nil);
								case 4:
									return _Utils_Tuple2(
										_List_fromArray(
											[
												A2($mdgriffith$elm_ui$Internal$Style$Prop, 'justify-content', 'center')
											]),
										_List_Nil);
								default:
									return _Utils_Tuple2(
										_List_fromArray(
											[
												A2($mdgriffith$elm_ui$Internal$Style$Prop, 'align-items', 'center')
											]),
										_List_fromArray(
											[
												A2($mdgriffith$elm_ui$Internal$Style$Prop, 'align-self', 'center')
											]));
							}
						}),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Descriptor,
						$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.gP),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'justify-content', 'space-between')
							])),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Descriptor,
						$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.bS),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'align-items', 'baseline')
							]))
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.al),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'display', 'flex'),
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'flex-direction', 'column'),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Child,
						$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.eY),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'flex-basis', '0px'),
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'min-height', 'min-content'),
								A2(
								$mdgriffith$elm_ui$Internal$Style$Descriptor,
								$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.dC),
								_List_fromArray(
									[
										A2($mdgriffith$elm_ui$Internal$Style$Prop, 'flex-basis', 'auto')
									]))
							])),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Child,
						$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.cn),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'flex-grow', '100000')
							])),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Child,
						$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.da),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'width', '100%')
							])),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Child,
						$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.eH),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'width', '100%')
							])),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Child,
						$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.c9),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'align-self', 'flex-start')
							])),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Child,
						'u:first-of-type.' + $mdgriffith$elm_ui$Internal$Style$classes.eR,
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'flex-grow', '1')
							])),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Child,
						's:first-of-type.' + $mdgriffith$elm_ui$Internal$Style$classes.eT,
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'flex-grow', '1'),
								A2(
								$mdgriffith$elm_ui$Internal$Style$Child,
								$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.eQ),
								_List_fromArray(
									[
										A2($mdgriffith$elm_ui$Internal$Style$Prop, 'margin-top', 'auto !important'),
										A2($mdgriffith$elm_ui$Internal$Style$Prop, 'margin-bottom', '0 !important')
									]))
							])),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Child,
						's:last-of-type.' + $mdgriffith$elm_ui$Internal$Style$classes.eT,
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'flex-grow', '1'),
								A2(
								$mdgriffith$elm_ui$Internal$Style$Child,
								$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.eQ),
								_List_fromArray(
									[
										A2($mdgriffith$elm_ui$Internal$Style$Prop, 'margin-bottom', 'auto !important'),
										A2($mdgriffith$elm_ui$Internal$Style$Prop, 'margin-top', '0 !important')
									]))
							])),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Child,
						's:only-of-type.' + $mdgriffith$elm_ui$Internal$Style$classes.eT,
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'flex-grow', '1'),
								A2(
								$mdgriffith$elm_ui$Internal$Style$Child,
								$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.eQ),
								_List_fromArray(
									[
										A2($mdgriffith$elm_ui$Internal$Style$Prop, 'margin-top', 'auto !important'),
										A2($mdgriffith$elm_ui$Internal$Style$Prop, 'margin-bottom', 'auto !important')
									]))
							])),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Child,
						's:last-of-type.' + ($mdgriffith$elm_ui$Internal$Style$classes.eT + ' ~ u'),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'flex-grow', '0')
							])),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Child,
						'u:first-of-type.' + ($mdgriffith$elm_ui$Internal$Style$classes.eR + (' ~ s.' + $mdgriffith$elm_ui$Internal$Style$classes.eT)),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'flex-grow', '0')
							])),
						$mdgriffith$elm_ui$Internal$Style$describeAlignment(
						function (alignment) {
							switch (alignment) {
								case 0:
									return _Utils_Tuple2(
										_List_fromArray(
											[
												A2($mdgriffith$elm_ui$Internal$Style$Prop, 'justify-content', 'flex-start')
											]),
										_List_fromArray(
											[
												A2($mdgriffith$elm_ui$Internal$Style$Prop, 'margin-bottom', 'auto')
											]));
								case 1:
									return _Utils_Tuple2(
										_List_fromArray(
											[
												A2($mdgriffith$elm_ui$Internal$Style$Prop, 'justify-content', 'flex-end')
											]),
										_List_fromArray(
											[
												A2($mdgriffith$elm_ui$Internal$Style$Prop, 'margin-top', 'auto')
											]));
								case 2:
									return _Utils_Tuple2(
										_List_fromArray(
											[
												A2($mdgriffith$elm_ui$Internal$Style$Prop, 'align-items', 'flex-end')
											]),
										_List_fromArray(
											[
												A2($mdgriffith$elm_ui$Internal$Style$Prop, 'align-self', 'flex-end')
											]));
								case 3:
									return _Utils_Tuple2(
										_List_fromArray(
											[
												A2($mdgriffith$elm_ui$Internal$Style$Prop, 'align-items', 'flex-start')
											]),
										_List_fromArray(
											[
												A2($mdgriffith$elm_ui$Internal$Style$Prop, 'align-self', 'flex-start')
											]));
								case 4:
									return _Utils_Tuple2(
										_List_fromArray(
											[
												A2($mdgriffith$elm_ui$Internal$Style$Prop, 'align-items', 'center')
											]),
										_List_fromArray(
											[
												A2($mdgriffith$elm_ui$Internal$Style$Prop, 'align-self', 'center')
											]));
								default:
									return _Utils_Tuple2(
										_List_fromArray(
											[
												A2($mdgriffith$elm_ui$Internal$Style$Prop, 'justify-content', 'center')
											]),
										_List_Nil);
							}
						}),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Child,
						$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.bL),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'flex-grow', '0'),
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'flex-basis', 'auto'),
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'width', '100%'),
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'align-self', 'stretch !important')
							])),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Descriptor,
						$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.gP),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'justify-content', 'space-between')
							]))
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.fH),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'display', '-ms-grid'),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Child,
						'.gp',
						_List_fromArray(
							[
								A2(
								$mdgriffith$elm_ui$Internal$Style$Child,
								$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.eY),
								_List_fromArray(
									[
										A2($mdgriffith$elm_ui$Internal$Style$Prop, 'width', '100%')
									]))
							])),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Supports,
						_Utils_Tuple2('display', 'grid'),
						_List_fromArray(
							[
								_Utils_Tuple2('display', 'grid')
							])),
						$mdgriffith$elm_ui$Internal$Style$gridAlignments(
						function (alignment) {
							switch (alignment) {
								case 0:
									return _List_fromArray(
										[
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'justify-content', 'flex-start')
										]);
								case 1:
									return _List_fromArray(
										[
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'justify-content', 'flex-end')
										]);
								case 2:
									return _List_fromArray(
										[
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'align-items', 'flex-end')
										]);
								case 3:
									return _List_fromArray(
										[
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'align-items', 'flex-start')
										]);
								case 4:
									return _List_fromArray(
										[
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'align-items', 'center')
										]);
								default:
									return _List_fromArray(
										[
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'justify-content', 'center')
										]);
							}
						})
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.d$),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'display', 'block'),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Child,
						$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.eY + ':first-child'),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'margin', '0 !important')
							])),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Child,
						$mdgriffith$elm_ui$Internal$Style$dot(
							$mdgriffith$elm_ui$Internal$Style$classes.eY + ($mdgriffith$elm_ui$Internal$Style$selfName(3) + (':first-child + .' + $mdgriffith$elm_ui$Internal$Style$classes.eY))),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'margin', '0 !important')
							])),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Child,
						$mdgriffith$elm_ui$Internal$Style$dot(
							$mdgriffith$elm_ui$Internal$Style$classes.eY + ($mdgriffith$elm_ui$Internal$Style$selfName(2) + (':first-child + .' + $mdgriffith$elm_ui$Internal$Style$classes.eY))),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'margin', '0 !important')
							])),
						$mdgriffith$elm_ui$Internal$Style$describeAlignment(
						function (alignment) {
							switch (alignment) {
								case 0:
									return _Utils_Tuple2(_List_Nil, _List_Nil);
								case 1:
									return _Utils_Tuple2(_List_Nil, _List_Nil);
								case 2:
									return _Utils_Tuple2(
										_List_Nil,
										_List_fromArray(
											[
												A2($mdgriffith$elm_ui$Internal$Style$Prop, 'float', 'right'),
												A2(
												$mdgriffith$elm_ui$Internal$Style$Descriptor,
												'::after',
												_List_fromArray(
													[
														A2($mdgriffith$elm_ui$Internal$Style$Prop, 'content', '\"\"'),
														A2($mdgriffith$elm_ui$Internal$Style$Prop, 'display', 'table'),
														A2($mdgriffith$elm_ui$Internal$Style$Prop, 'clear', 'both')
													]))
											]));
								case 3:
									return _Utils_Tuple2(
										_List_Nil,
										_List_fromArray(
											[
												A2($mdgriffith$elm_ui$Internal$Style$Prop, 'float', 'left'),
												A2(
												$mdgriffith$elm_ui$Internal$Style$Descriptor,
												'::after',
												_List_fromArray(
													[
														A2($mdgriffith$elm_ui$Internal$Style$Prop, 'content', '\"\"'),
														A2($mdgriffith$elm_ui$Internal$Style$Prop, 'display', 'table'),
														A2($mdgriffith$elm_ui$Internal$Style$Prop, 'clear', 'both')
													]))
											]));
								case 4:
									return _Utils_Tuple2(_List_Nil, _List_Nil);
								default:
									return _Utils_Tuple2(_List_Nil, _List_Nil);
							}
						})
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.fV),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'white-space', 'pre-wrap !important'),
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'height', '100%'),
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'width', '100%'),
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'background-color', 'transparent')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.fY),
				_List_fromArray(
					[
						A2(
						$mdgriffith$elm_ui$Internal$Style$Descriptor,
						$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.gN),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'flex-basis', 'auto')
							]))
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.fX),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'white-space', 'pre-wrap !important'),
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'cursor', 'text'),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Child,
						$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.fW),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'white-space', 'pre-wrap !important'),
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'color', 'transparent')
							]))
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.d0),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'display', 'block'),
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'white-space', 'normal'),
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'overflow-wrap', 'break-word'),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Descriptor,
						$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.cl),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'z-index', '0'),
								A2(
								$mdgriffith$elm_ui$Internal$Style$Child,
								$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.e1),
								_List_fromArray(
									[
										A2($mdgriffith$elm_ui$Internal$Style$Prop, 'z-index', '-1')
									]))
							])),
						A2(
						$mdgriffith$elm_ui$Internal$Style$AllChildren,
						$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.g),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'display', 'inline'),
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'white-space', 'normal')
							])),
						A2(
						$mdgriffith$elm_ui$Internal$Style$AllChildren,
						$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.d0),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'display', 'inline'),
								A2(
								$mdgriffith$elm_ui$Internal$Style$Descriptor,
								'::after',
								_List_fromArray(
									[
										A2($mdgriffith$elm_ui$Internal$Style$Prop, 'content', 'none')
									])),
								A2(
								$mdgriffith$elm_ui$Internal$Style$Descriptor,
								'::before',
								_List_fromArray(
									[
										A2($mdgriffith$elm_ui$Internal$Style$Prop, 'content', 'none')
									]))
							])),
						A2(
						$mdgriffith$elm_ui$Internal$Style$AllChildren,
						$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.gN),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'display', 'inline'),
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'white-space', 'normal'),
								A2(
								$mdgriffith$elm_ui$Internal$Style$Descriptor,
								$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.eG),
								_List_fromArray(
									[
										A2($mdgriffith$elm_ui$Internal$Style$Prop, 'display', 'inline-block')
									])),
								A2(
								$mdgriffith$elm_ui$Internal$Style$Descriptor,
								$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.fS),
								_List_fromArray(
									[
										A2($mdgriffith$elm_ui$Internal$Style$Prop, 'display', 'flex')
									])),
								A2(
								$mdgriffith$elm_ui$Internal$Style$Descriptor,
								$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.e1),
								_List_fromArray(
									[
										A2($mdgriffith$elm_ui$Internal$Style$Prop, 'display', 'flex')
									])),
								A2(
								$mdgriffith$elm_ui$Internal$Style$Descriptor,
								$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.eL),
								_List_fromArray(
									[
										A2($mdgriffith$elm_ui$Internal$Style$Prop, 'display', 'flex')
									])),
								A2(
								$mdgriffith$elm_ui$Internal$Style$Descriptor,
								$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.e2),
								_List_fromArray(
									[
										A2($mdgriffith$elm_ui$Internal$Style$Prop, 'display', 'flex')
									])),
								A2(
								$mdgriffith$elm_ui$Internal$Style$Descriptor,
								$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.gh),
								_List_fromArray(
									[
										A2($mdgriffith$elm_ui$Internal$Style$Prop, 'display', 'flex')
									])),
								A2(
								$mdgriffith$elm_ui$Internal$Style$Descriptor,
								$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.gg),
								_List_fromArray(
									[
										A2($mdgriffith$elm_ui$Internal$Style$Prop, 'display', 'flex')
									])),
								A2(
								$mdgriffith$elm_ui$Internal$Style$Child,
								$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.g),
								_List_fromArray(
									[
										A2($mdgriffith$elm_ui$Internal$Style$Prop, 'display', 'inline'),
										A2($mdgriffith$elm_ui$Internal$Style$Prop, 'white-space', 'normal')
									]))
							])),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Child,
						$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.eh),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'display', 'inline')
							])),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Child,
						$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.al),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'display', 'inline-flex')
							])),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Child,
						$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.fH),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'display', 'inline-grid')
							])),
						$mdgriffith$elm_ui$Internal$Style$describeAlignment(
						function (alignment) {
							switch (alignment) {
								case 0:
									return _Utils_Tuple2(_List_Nil, _List_Nil);
								case 1:
									return _Utils_Tuple2(_List_Nil, _List_Nil);
								case 2:
									return _Utils_Tuple2(
										_List_Nil,
										_List_fromArray(
											[
												A2($mdgriffith$elm_ui$Internal$Style$Prop, 'float', 'right')
											]));
								case 3:
									return _Utils_Tuple2(
										_List_Nil,
										_List_fromArray(
											[
												A2($mdgriffith$elm_ui$Internal$Style$Prop, 'float', 'left')
											]));
								case 4:
									return _Utils_Tuple2(_List_Nil, _List_Nil);
								default:
									return _Utils_Tuple2(_List_Nil, _List_Nil);
							}
						})
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				'.hidden',
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'display', 'none')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.hc),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'font-weight', '100')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.g3),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'font-weight', '200')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.g7),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'font-weight', '300')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.g9),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'font-weight', '400')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.g8),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'font-weight', '500')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.hb),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'font-weight', '600')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.e6),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'font-weight', '700')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.g2),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'font-weight', '800')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.g4),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'font-weight', '900')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.f0),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'font-style', 'italic')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.gX),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'text-decoration', 'line-through')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.hk),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'text-decoration', 'underline'),
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'text-decoration-skip-ink', 'auto'),
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'text-decoration-skip', 'ink')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				_Utils_ap(
					$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.hk),
					$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.gX)),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'text-decoration', 'line-through underline'),
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'text-decoration-skip-ink', 'auto'),
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'text-decoration-skip', 'ink')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.hd),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'font-style', 'normal')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.g5),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'text-align', 'justify')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.bZ),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'text-align', 'justify-all')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.g1),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'text-align', 'center')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.ha),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'text-align', 'right')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.g6),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'text-align', 'left')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				'.modal',
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'position', 'fixed'),
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'left', '0'),
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'top', '0'),
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'width', '100%'),
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'height', '100%'),
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'pointer-events', 'none')
					]))
			]))
	]);
var $mdgriffith$elm_ui$Internal$Style$fontVariant = function (_var) {
	return _List_fromArray(
		[
			A2(
			$mdgriffith$elm_ui$Internal$Style$Class,
			'.v-' + _var,
			_List_fromArray(
				[
					A2($mdgriffith$elm_ui$Internal$Style$Prop, 'font-feature-settings', '\"' + (_var + '\"'))
				])),
			A2(
			$mdgriffith$elm_ui$Internal$Style$Class,
			'.v-' + (_var + '-off'),
			_List_fromArray(
				[
					A2($mdgriffith$elm_ui$Internal$Style$Prop, 'font-feature-settings', '\"' + (_var + '\" 0'))
				]))
		]);
};
var $mdgriffith$elm_ui$Internal$Style$commonValues = $elm$core$List$concat(
	_List_fromArray(
		[
			A2(
			$elm$core$List$map,
			function (x) {
				return A2(
					$mdgriffith$elm_ui$Internal$Style$Class,
					'.border-' + $elm$core$String$fromInt(x),
					_List_fromArray(
						[
							A2(
							$mdgriffith$elm_ui$Internal$Style$Prop,
							'border-width',
							$elm$core$String$fromInt(x) + 'px')
						]));
			},
			A2($elm$core$List$range, 0, 6)),
			A2(
			$elm$core$List$map,
			function (i) {
				return A2(
					$mdgriffith$elm_ui$Internal$Style$Class,
					'.font-size-' + $elm$core$String$fromInt(i),
					_List_fromArray(
						[
							A2(
							$mdgriffith$elm_ui$Internal$Style$Prop,
							'font-size',
							$elm$core$String$fromInt(i) + 'px')
						]));
			},
			A2($elm$core$List$range, 8, 32)),
			A2(
			$elm$core$List$map,
			function (i) {
				return A2(
					$mdgriffith$elm_ui$Internal$Style$Class,
					'.p-' + $elm$core$String$fromInt(i),
					_List_fromArray(
						[
							A2(
							$mdgriffith$elm_ui$Internal$Style$Prop,
							'padding',
							$elm$core$String$fromInt(i) + 'px')
						]));
			},
			A2($elm$core$List$range, 0, 24)),
			_List_fromArray(
			[
				A2(
				$mdgriffith$elm_ui$Internal$Style$Class,
				'.v-smcp',
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'font-variant', 'small-caps')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Class,
				'.v-smcp-off',
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'font-variant', 'normal')
					]))
			]),
			$mdgriffith$elm_ui$Internal$Style$fontVariant('zero'),
			$mdgriffith$elm_ui$Internal$Style$fontVariant('onum'),
			$mdgriffith$elm_ui$Internal$Style$fontVariant('liga'),
			$mdgriffith$elm_ui$Internal$Style$fontVariant('dlig'),
			$mdgriffith$elm_ui$Internal$Style$fontVariant('ordn'),
			$mdgriffith$elm_ui$Internal$Style$fontVariant('tnum'),
			$mdgriffith$elm_ui$Internal$Style$fontVariant('afrc'),
			$mdgriffith$elm_ui$Internal$Style$fontVariant('frac')
		]));
var $mdgriffith$elm_ui$Internal$Style$explainer = '\n.explain {\n    border: 6px solid rgb(174, 121, 15) !important;\n}\n.explain > .' + ($mdgriffith$elm_ui$Internal$Style$classes.eY + (' {\n    border: 4px dashed rgb(0, 151, 167) !important;\n}\n\n.ctr {\n    border: none !important;\n}\n.explain > .ctr > .' + ($mdgriffith$elm_ui$Internal$Style$classes.eY + ' {\n    border: 4px dashed rgb(0, 151, 167) !important;\n}\n\n')));
var $mdgriffith$elm_ui$Internal$Style$inputTextReset = '\ninput[type="search"],\ninput[type="search"]::-webkit-search-decoration,\ninput[type="search"]::-webkit-search-cancel-button,\ninput[type="search"]::-webkit-search-results-button,\ninput[type="search"]::-webkit-search-results-decoration {\n  -webkit-appearance:none;\n}\n';
var $mdgriffith$elm_ui$Internal$Style$sliderReset = '\ninput[type=range] {\n  -webkit-appearance: none; \n  background: transparent;\n  position:absolute;\n  left:0;\n  top:0;\n  z-index:10;\n  width: 100%;\n  outline: dashed 1px;\n  height: 100%;\n  opacity: 0;\n}\n';
var $mdgriffith$elm_ui$Internal$Style$thumbReset = '\ninput[type=range]::-webkit-slider-thumb {\n    -webkit-appearance: none;\n    opacity: 0.5;\n    width: 80px;\n    height: 80px;\n    background-color: black;\n    border:none;\n    border-radius: 5px;\n}\ninput[type=range]::-moz-range-thumb {\n    opacity: 0.5;\n    width: 80px;\n    height: 80px;\n    background-color: black;\n    border:none;\n    border-radius: 5px;\n}\ninput[type=range]::-ms-thumb {\n    opacity: 0.5;\n    width: 80px;\n    height: 80px;\n    background-color: black;\n    border:none;\n    border-radius: 5px;\n}\ninput[type=range][orient=vertical]{\n    writing-mode: bt-lr; /* IE */\n    -webkit-appearance: slider-vertical;  /* WebKit */\n}\n';
var $mdgriffith$elm_ui$Internal$Style$trackReset = '\ninput[type=range]::-moz-range-track {\n    background: transparent;\n    cursor: pointer;\n}\ninput[type=range]::-ms-track {\n    background: transparent;\n    cursor: pointer;\n}\ninput[type=range]::-webkit-slider-runnable-track {\n    background: transparent;\n    cursor: pointer;\n}\n';
var $mdgriffith$elm_ui$Internal$Style$overrides = '@media screen and (-ms-high-contrast: active), (-ms-high-contrast: none) {' + ($mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.eY) + ($mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.eh) + (' > ' + ($mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.eY) + (' { flex-basis: auto !important; } ' + ($mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.eY) + ($mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.eh) + (' > ' + ($mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.eY) + ($mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.bL) + (' { flex-basis: auto !important; }}' + ($mdgriffith$elm_ui$Internal$Style$inputTextReset + ($mdgriffith$elm_ui$Internal$Style$sliderReset + ($mdgriffith$elm_ui$Internal$Style$trackReset + ($mdgriffith$elm_ui$Internal$Style$thumbReset + $mdgriffith$elm_ui$Internal$Style$explainer)))))))))))))));
var $elm$core$String$concat = function (strings) {
	return A2($elm$core$String$join, '', strings);
};
var $mdgriffith$elm_ui$Internal$Style$Intermediate = $elm$core$Basics$identity;
var $mdgriffith$elm_ui$Internal$Style$emptyIntermediate = F2(
	function (selector, closing) {
		return {bJ: closing, l: _List_Nil, aw: _List_Nil, S: selector};
	});
var $mdgriffith$elm_ui$Internal$Style$renderRules = F2(
	function (_v0, rulesToRender) {
		var parent = _v0;
		var generateIntermediates = F2(
			function (rule, rendered) {
				switch (rule.$) {
					case 0:
						var name = rule.a;
						var val = rule.b;
						return _Utils_update(
							rendered,
							{
								aw: A2(
									$elm$core$List$cons,
									_Utils_Tuple2(name, val),
									rendered.aw)
							});
					case 3:
						var _v2 = rule.a;
						var prop = _v2.a;
						var value = _v2.b;
						var props = rule.b;
						return _Utils_update(
							rendered,
							{
								l: A2(
									$elm$core$List$cons,
									{bJ: '\n}', l: _List_Nil, aw: props, S: '@supports (' + (prop + (':' + (value + (') {' + parent.S))))},
									rendered.l)
							});
					case 5:
						var selector = rule.a;
						var adjRules = rule.b;
						return _Utils_update(
							rendered,
							{
								l: A2(
									$elm$core$List$cons,
									A2(
										$mdgriffith$elm_ui$Internal$Style$renderRules,
										A2($mdgriffith$elm_ui$Internal$Style$emptyIntermediate, parent.S + (' + ' + selector), ''),
										adjRules),
									rendered.l)
							});
					case 1:
						var child = rule.a;
						var childRules = rule.b;
						return _Utils_update(
							rendered,
							{
								l: A2(
									$elm$core$List$cons,
									A2(
										$mdgriffith$elm_ui$Internal$Style$renderRules,
										A2($mdgriffith$elm_ui$Internal$Style$emptyIntermediate, parent.S + (' > ' + child), ''),
										childRules),
									rendered.l)
							});
					case 2:
						var child = rule.a;
						var childRules = rule.b;
						return _Utils_update(
							rendered,
							{
								l: A2(
									$elm$core$List$cons,
									A2(
										$mdgriffith$elm_ui$Internal$Style$renderRules,
										A2($mdgriffith$elm_ui$Internal$Style$emptyIntermediate, parent.S + (' ' + child), ''),
										childRules),
									rendered.l)
							});
					case 4:
						var descriptor = rule.a;
						var descriptorRules = rule.b;
						return _Utils_update(
							rendered,
							{
								l: A2(
									$elm$core$List$cons,
									A2(
										$mdgriffith$elm_ui$Internal$Style$renderRules,
										A2(
											$mdgriffith$elm_ui$Internal$Style$emptyIntermediate,
											_Utils_ap(parent.S, descriptor),
											''),
										descriptorRules),
									rendered.l)
							});
					default:
						var batched = rule.a;
						return _Utils_update(
							rendered,
							{
								l: A2(
									$elm$core$List$cons,
									A2(
										$mdgriffith$elm_ui$Internal$Style$renderRules,
										A2($mdgriffith$elm_ui$Internal$Style$emptyIntermediate, parent.S, ''),
										batched),
									rendered.l)
							});
				}
			});
		return A3($elm$core$List$foldr, generateIntermediates, parent, rulesToRender);
	});
var $mdgriffith$elm_ui$Internal$Style$renderCompact = function (styleClasses) {
	var renderValues = function (values) {
		return $elm$core$String$concat(
			A2(
				$elm$core$List$map,
				function (_v3) {
					var x = _v3.a;
					var y = _v3.b;
					return x + (':' + (y + ';'));
				},
				values));
	};
	var renderClass = function (rule) {
		var _v2 = rule.aw;
		if (!_v2.b) {
			return '';
		} else {
			return rule.S + ('{' + (renderValues(rule.aw) + (rule.bJ + '}')));
		}
	};
	var renderIntermediate = function (_v0) {
		var rule = _v0;
		return _Utils_ap(
			renderClass(rule),
			$elm$core$String$concat(
				A2($elm$core$List$map, renderIntermediate, rule.l)));
	};
	return $elm$core$String$concat(
		A2(
			$elm$core$List$map,
			renderIntermediate,
			A3(
				$elm$core$List$foldr,
				F2(
					function (_v1, existing) {
						var name = _v1.a;
						var styleRules = _v1.b;
						return A2(
							$elm$core$List$cons,
							A2(
								$mdgriffith$elm_ui$Internal$Style$renderRules,
								A2($mdgriffith$elm_ui$Internal$Style$emptyIntermediate, name, ''),
								styleRules),
							existing);
					}),
				_List_Nil,
				styleClasses)));
};
var $mdgriffith$elm_ui$Internal$Style$rules = _Utils_ap(
	$mdgriffith$elm_ui$Internal$Style$overrides,
	$mdgriffith$elm_ui$Internal$Style$renderCompact(
		_Utils_ap($mdgriffith$elm_ui$Internal$Style$baseSheet, $mdgriffith$elm_ui$Internal$Style$commonValues)));
var $elm$virtual_dom$VirtualDom$text = _VirtualDom_text;
var $mdgriffith$elm_ui$Internal$Model$staticRoot = function (opts) {
	var _v0 = opts.aJ;
	switch (_v0) {
		case 0:
			return A3(
				$elm$virtual_dom$VirtualDom$node,
				'div',
				_List_Nil,
				_List_fromArray(
					[
						A3(
						$elm$virtual_dom$VirtualDom$node,
						'style',
						_List_Nil,
						_List_fromArray(
							[
								$elm$virtual_dom$VirtualDom$text($mdgriffith$elm_ui$Internal$Style$rules)
							]))
					]));
		case 1:
			return $elm$virtual_dom$VirtualDom$text('');
		default:
			return A3(
				$elm$virtual_dom$VirtualDom$node,
				'elm-ui-static-rules',
				_List_fromArray(
					[
						A2(
						$elm$virtual_dom$VirtualDom$property,
						'rules',
						$elm$json$Json$Encode$string($mdgriffith$elm_ui$Internal$Style$rules))
					]),
				_List_Nil);
	}
};
var $elm$json$Json$Encode$list = F2(
	function (func, entries) {
		return _Json_wrap(
			A3(
				$elm$core$List$foldl,
				_Json_addEntry(func),
				_Json_emptyArray(0),
				entries));
	});
var $mdgriffith$elm_ui$Internal$Model$fontName = function (font) {
	switch (font.$) {
		case 0:
			return 'serif';
		case 1:
			return 'sans-serif';
		case 2:
			return 'monospace';
		case 3:
			var name = font.a;
			return '\"' + (name + '\"');
		case 4:
			var name = font.a;
			var url = font.b;
			return '\"' + (name + '\"');
		default:
			var name = font.a.gc;
			return '\"' + (name + '\"');
	}
};
var $mdgriffith$elm_ui$Internal$Model$isSmallCaps = function (_var) {
	switch (_var.$) {
		case 0:
			var name = _var.a;
			return name === 'smcp';
		case 1:
			var name = _var.a;
			return false;
		default:
			var name = _var.a;
			var index = _var.b;
			return (name === 'smcp') && (index === 1);
	}
};
var $mdgriffith$elm_ui$Internal$Model$hasSmallCaps = function (typeface) {
	if (typeface.$ === 5) {
		var font = typeface.a;
		return A2($elm$core$List$any, $mdgriffith$elm_ui$Internal$Model$isSmallCaps, font.eB);
	} else {
		return false;
	}
};
var $elm$core$Basics$min = F2(
	function (x, y) {
		return (_Utils_cmp(x, y) < 0) ? x : y;
	});
var $mdgriffith$elm_ui$Internal$Model$renderProps = F3(
	function (force, _v0, existing) {
		var key = _v0.a;
		var val = _v0.b;
		return force ? (existing + ('\n  ' + (key + (': ' + (val + ' !important;'))))) : (existing + ('\n  ' + (key + (': ' + (val + ';')))));
	});
var $mdgriffith$elm_ui$Internal$Model$renderStyle = F4(
	function (options, maybePseudo, selector, props) {
		if (maybePseudo.$ === 1) {
			return _List_fromArray(
				[
					selector + ('{' + (A3(
					$elm$core$List$foldl,
					$mdgriffith$elm_ui$Internal$Model$renderProps(false),
					'',
					props) + '\n}'))
				]);
		} else {
			var pseudo = maybePseudo.a;
			switch (pseudo) {
				case 1:
					var _v2 = options.fM;
					switch (_v2) {
						case 0:
							return _List_Nil;
						case 2:
							return _List_fromArray(
								[
									selector + ('-hv {' + (A3(
									$elm$core$List$foldl,
									$mdgriffith$elm_ui$Internal$Model$renderProps(true),
									'',
									props) + '\n}'))
								]);
						default:
							return _List_fromArray(
								[
									selector + ('-hv:hover {' + (A3(
									$elm$core$List$foldl,
									$mdgriffith$elm_ui$Internal$Model$renderProps(false),
									'',
									props) + '\n}'))
								]);
					}
				case 0:
					var renderedProps = A3(
						$elm$core$List$foldl,
						$mdgriffith$elm_ui$Internal$Model$renderProps(false),
						'',
						props);
					return _List_fromArray(
						[
							selector + ('-fs:focus {' + (renderedProps + '\n}')),
							('.' + ($mdgriffith$elm_ui$Internal$Style$classes.eY + (':focus ' + (selector + '-fs  {')))) + (renderedProps + '\n}'),
							(selector + '-fs:focus-within {') + (renderedProps + '\n}'),
							('.ui-slide-bar:focus + ' + ($mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.eY) + (' .focusable-thumb' + (selector + '-fs {')))) + (renderedProps + '\n}')
						]);
				default:
					return _List_fromArray(
						[
							selector + ('-act:active {' + (A3(
							$elm$core$List$foldl,
							$mdgriffith$elm_ui$Internal$Model$renderProps(false),
							'',
							props) + '\n}'))
						]);
			}
		}
	});
var $mdgriffith$elm_ui$Internal$Model$renderVariant = function (_var) {
	switch (_var.$) {
		case 0:
			var name = _var.a;
			return '\"' + (name + '\"');
		case 1:
			var name = _var.a;
			return '\"' + (name + '\" 0');
		default:
			var name = _var.a;
			var index = _var.b;
			return '\"' + (name + ('\" ' + $elm$core$String$fromInt(index)));
	}
};
var $mdgriffith$elm_ui$Internal$Model$renderVariants = function (typeface) {
	if (typeface.$ === 5) {
		var font = typeface.a;
		return $elm$core$Maybe$Just(
			A2(
				$elm$core$String$join,
				', ',
				A2($elm$core$List$map, $mdgriffith$elm_ui$Internal$Model$renderVariant, font.eB)));
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $mdgriffith$elm_ui$Internal$Model$transformValue = function (transform) {
	switch (transform.$) {
		case 0:
			return $elm$core$Maybe$Nothing;
		case 1:
			var _v1 = transform.a;
			var x = _v1.a;
			var y = _v1.b;
			var z = _v1.c;
			return $elm$core$Maybe$Just(
				'translate3d(' + ($elm$core$String$fromFloat(x) + ('px, ' + ($elm$core$String$fromFloat(y) + ('px, ' + ($elm$core$String$fromFloat(z) + 'px)'))))));
		default:
			var _v2 = transform.a;
			var tx = _v2.a;
			var ty = _v2.b;
			var tz = _v2.c;
			var _v3 = transform.b;
			var sx = _v3.a;
			var sy = _v3.b;
			var sz = _v3.c;
			var _v4 = transform.c;
			var ox = _v4.a;
			var oy = _v4.b;
			var oz = _v4.c;
			var angle = transform.d;
			var translate = 'translate3d(' + ($elm$core$String$fromFloat(tx) + ('px, ' + ($elm$core$String$fromFloat(ty) + ('px, ' + ($elm$core$String$fromFloat(tz) + 'px)')))));
			var scale = 'scale3d(' + ($elm$core$String$fromFloat(sx) + (', ' + ($elm$core$String$fromFloat(sy) + (', ' + ($elm$core$String$fromFloat(sz) + ')')))));
			var rotate = 'rotate3d(' + ($elm$core$String$fromFloat(ox) + (', ' + ($elm$core$String$fromFloat(oy) + (', ' + ($elm$core$String$fromFloat(oz) + (', ' + ($elm$core$String$fromFloat(angle) + 'rad)')))))));
			return $elm$core$Maybe$Just(translate + (' ' + (scale + (' ' + rotate))));
	}
};
var $mdgriffith$elm_ui$Internal$Model$renderStyleRule = F3(
	function (options, rule, maybePseudo) {
		switch (rule.$) {
			case 0:
				var selector = rule.a;
				var props = rule.b;
				return A4($mdgriffith$elm_ui$Internal$Model$renderStyle, options, maybePseudo, selector, props);
			case 13:
				var name = rule.a;
				var prop = rule.b;
				return A4(
					$mdgriffith$elm_ui$Internal$Model$renderStyle,
					options,
					maybePseudo,
					'.' + name,
					_List_fromArray(
						[
							A2($mdgriffith$elm_ui$Internal$Model$Property, 'box-shadow', prop)
						]));
			case 12:
				var name = rule.a;
				var transparency = rule.b;
				var opacity = A2(
					$elm$core$Basics$max,
					0,
					A2($elm$core$Basics$min, 1, 1 - transparency));
				return A4(
					$mdgriffith$elm_ui$Internal$Model$renderStyle,
					options,
					maybePseudo,
					'.' + name,
					_List_fromArray(
						[
							A2(
							$mdgriffith$elm_ui$Internal$Model$Property,
							'opacity',
							$elm$core$String$fromFloat(opacity))
						]));
			case 2:
				var i = rule.a;
				return A4(
					$mdgriffith$elm_ui$Internal$Model$renderStyle,
					options,
					maybePseudo,
					'.font-size-' + $elm$core$String$fromInt(i),
					_List_fromArray(
						[
							A2(
							$mdgriffith$elm_ui$Internal$Model$Property,
							'font-size',
							$elm$core$String$fromInt(i) + 'px')
						]));
			case 1:
				var name = rule.a;
				var typefaces = rule.b;
				var features = A2(
					$elm$core$String$join,
					', ',
					A2($elm$core$List$filterMap, $mdgriffith$elm_ui$Internal$Model$renderVariants, typefaces));
				var families = _List_fromArray(
					[
						A2(
						$mdgriffith$elm_ui$Internal$Model$Property,
						'font-family',
						A2(
							$elm$core$String$join,
							', ',
							A2($elm$core$List$map, $mdgriffith$elm_ui$Internal$Model$fontName, typefaces))),
						A2($mdgriffith$elm_ui$Internal$Model$Property, 'font-feature-settings', features),
						A2(
						$mdgriffith$elm_ui$Internal$Model$Property,
						'font-variant',
						A2($elm$core$List$any, $mdgriffith$elm_ui$Internal$Model$hasSmallCaps, typefaces) ? 'small-caps' : 'normal')
					]);
				return A4($mdgriffith$elm_ui$Internal$Model$renderStyle, options, maybePseudo, '.' + name, families);
			case 3:
				var _class = rule.a;
				var prop = rule.b;
				var val = rule.c;
				return A4(
					$mdgriffith$elm_ui$Internal$Model$renderStyle,
					options,
					maybePseudo,
					'.' + _class,
					_List_fromArray(
						[
							A2($mdgriffith$elm_ui$Internal$Model$Property, prop, val)
						]));
			case 4:
				var _class = rule.a;
				var prop = rule.b;
				var color = rule.c;
				return A4(
					$mdgriffith$elm_ui$Internal$Model$renderStyle,
					options,
					maybePseudo,
					'.' + _class,
					_List_fromArray(
						[
							A2(
							$mdgriffith$elm_ui$Internal$Model$Property,
							prop,
							$mdgriffith$elm_ui$Internal$Model$formatColor(color))
						]));
			case 5:
				var cls = rule.a;
				var x = rule.b;
				var y = rule.c;
				var yPx = $elm$core$String$fromInt(y) + 'px';
				var xPx = $elm$core$String$fromInt(x) + 'px';
				var single = '.' + $mdgriffith$elm_ui$Internal$Style$classes.gN;
				var row = '.' + $mdgriffith$elm_ui$Internal$Style$classes.eh;
				var wrappedRow = '.' + ($mdgriffith$elm_ui$Internal$Style$classes.db + row);
				var right = '.' + $mdgriffith$elm_ui$Internal$Style$classes.dh;
				var paragraph = '.' + $mdgriffith$elm_ui$Internal$Style$classes.d0;
				var page = '.' + $mdgriffith$elm_ui$Internal$Style$classes.d$;
				var left = '.' + $mdgriffith$elm_ui$Internal$Style$classes.dg;
				var halfY = $elm$core$String$fromFloat(y / 2) + 'px';
				var halfX = $elm$core$String$fromFloat(x / 2) + 'px';
				var column = '.' + $mdgriffith$elm_ui$Internal$Style$classes.al;
				var _class = '.' + cls;
				var any = '.' + $mdgriffith$elm_ui$Internal$Style$classes.eY;
				return $elm$core$List$concat(
					_List_fromArray(
						[
							A4(
							$mdgriffith$elm_ui$Internal$Model$renderStyle,
							options,
							maybePseudo,
							_class + (row + (' > ' + (any + (' + ' + any)))),
							_List_fromArray(
								[
									A2($mdgriffith$elm_ui$Internal$Model$Property, 'margin-left', xPx)
								])),
							A4(
							$mdgriffith$elm_ui$Internal$Model$renderStyle,
							options,
							maybePseudo,
							_class + (wrappedRow + (' > ' + any)),
							_List_fromArray(
								[
									A2($mdgriffith$elm_ui$Internal$Model$Property, 'margin', halfY + (' ' + halfX))
								])),
							A4(
							$mdgriffith$elm_ui$Internal$Model$renderStyle,
							options,
							maybePseudo,
							_class + (column + (' > ' + (any + (' + ' + any)))),
							_List_fromArray(
								[
									A2($mdgriffith$elm_ui$Internal$Model$Property, 'margin-top', yPx)
								])),
							A4(
							$mdgriffith$elm_ui$Internal$Model$renderStyle,
							options,
							maybePseudo,
							_class + (page + (' > ' + (any + (' + ' + any)))),
							_List_fromArray(
								[
									A2($mdgriffith$elm_ui$Internal$Model$Property, 'margin-top', yPx)
								])),
							A4(
							$mdgriffith$elm_ui$Internal$Model$renderStyle,
							options,
							maybePseudo,
							_class + (page + (' > ' + left)),
							_List_fromArray(
								[
									A2($mdgriffith$elm_ui$Internal$Model$Property, 'margin-right', xPx)
								])),
							A4(
							$mdgriffith$elm_ui$Internal$Model$renderStyle,
							options,
							maybePseudo,
							_class + (page + (' > ' + right)),
							_List_fromArray(
								[
									A2($mdgriffith$elm_ui$Internal$Model$Property, 'margin-left', xPx)
								])),
							A4(
							$mdgriffith$elm_ui$Internal$Model$renderStyle,
							options,
							maybePseudo,
							_Utils_ap(_class, paragraph),
							_List_fromArray(
								[
									A2(
									$mdgriffith$elm_ui$Internal$Model$Property,
									'line-height',
									'calc(1em + ' + ($elm$core$String$fromInt(y) + 'px)'))
								])),
							A4(
							$mdgriffith$elm_ui$Internal$Model$renderStyle,
							options,
							maybePseudo,
							'textarea' + (any + _class),
							_List_fromArray(
								[
									A2(
									$mdgriffith$elm_ui$Internal$Model$Property,
									'line-height',
									'calc(1em + ' + ($elm$core$String$fromInt(y) + 'px)')),
									A2(
									$mdgriffith$elm_ui$Internal$Model$Property,
									'height',
									'calc(100% + ' + ($elm$core$String$fromInt(y) + 'px)'))
								])),
							A4(
							$mdgriffith$elm_ui$Internal$Model$renderStyle,
							options,
							maybePseudo,
							_class + (paragraph + (' > ' + left)),
							_List_fromArray(
								[
									A2($mdgriffith$elm_ui$Internal$Model$Property, 'margin-right', xPx)
								])),
							A4(
							$mdgriffith$elm_ui$Internal$Model$renderStyle,
							options,
							maybePseudo,
							_class + (paragraph + (' > ' + right)),
							_List_fromArray(
								[
									A2($mdgriffith$elm_ui$Internal$Model$Property, 'margin-left', xPx)
								])),
							A4(
							$mdgriffith$elm_ui$Internal$Model$renderStyle,
							options,
							maybePseudo,
							_class + (paragraph + '::after'),
							_List_fromArray(
								[
									A2($mdgriffith$elm_ui$Internal$Model$Property, 'content', '\'\''),
									A2($mdgriffith$elm_ui$Internal$Model$Property, 'display', 'block'),
									A2($mdgriffith$elm_ui$Internal$Model$Property, 'height', '0'),
									A2($mdgriffith$elm_ui$Internal$Model$Property, 'width', '0'),
									A2(
									$mdgriffith$elm_ui$Internal$Model$Property,
									'margin-top',
									$elm$core$String$fromInt((-1) * ((y / 2) | 0)) + 'px')
								])),
							A4(
							$mdgriffith$elm_ui$Internal$Model$renderStyle,
							options,
							maybePseudo,
							_class + (paragraph + '::before'),
							_List_fromArray(
								[
									A2($mdgriffith$elm_ui$Internal$Model$Property, 'content', '\'\''),
									A2($mdgriffith$elm_ui$Internal$Model$Property, 'display', 'block'),
									A2($mdgriffith$elm_ui$Internal$Model$Property, 'height', '0'),
									A2($mdgriffith$elm_ui$Internal$Model$Property, 'width', '0'),
									A2(
									$mdgriffith$elm_ui$Internal$Model$Property,
									'margin-bottom',
									$elm$core$String$fromInt((-1) * ((y / 2) | 0)) + 'px')
								]))
						]));
			case 7:
				var cls = rule.a;
				var top = rule.b;
				var right = rule.c;
				var bottom = rule.d;
				var left = rule.e;
				var _class = '.' + cls;
				return A4(
					$mdgriffith$elm_ui$Internal$Model$renderStyle,
					options,
					maybePseudo,
					_class,
					_List_fromArray(
						[
							A2(
							$mdgriffith$elm_ui$Internal$Model$Property,
							'padding',
							$elm$core$String$fromFloat(top) + ('px ' + ($elm$core$String$fromFloat(right) + ('px ' + ($elm$core$String$fromFloat(bottom) + ('px ' + ($elm$core$String$fromFloat(left) + 'px')))))))
						]));
			case 6:
				var cls = rule.a;
				var top = rule.b;
				var right = rule.c;
				var bottom = rule.d;
				var left = rule.e;
				var _class = '.' + cls;
				return A4(
					$mdgriffith$elm_ui$Internal$Model$renderStyle,
					options,
					maybePseudo,
					_class,
					_List_fromArray(
						[
							A2(
							$mdgriffith$elm_ui$Internal$Model$Property,
							'border-width',
							$elm$core$String$fromInt(top) + ('px ' + ($elm$core$String$fromInt(right) + ('px ' + ($elm$core$String$fromInt(bottom) + ('px ' + ($elm$core$String$fromInt(left) + 'px')))))))
						]));
			case 8:
				var template = rule.a;
				var toGridLengthHelper = F3(
					function (minimum, maximum, x) {
						toGridLengthHelper:
						while (true) {
							switch (x.$) {
								case 0:
									var px = x.a;
									return $elm$core$String$fromInt(px) + 'px';
								case 1:
									var _v2 = _Utils_Tuple2(minimum, maximum);
									if (_v2.a.$ === 1) {
										if (_v2.b.$ === 1) {
											var _v3 = _v2.a;
											var _v4 = _v2.b;
											return 'max-content';
										} else {
											var _v6 = _v2.a;
											var maxSize = _v2.b.a;
											return 'minmax(max-content, ' + ($elm$core$String$fromInt(maxSize) + 'px)');
										}
									} else {
										if (_v2.b.$ === 1) {
											var minSize = _v2.a.a;
											var _v5 = _v2.b;
											return 'minmax(' + ($elm$core$String$fromInt(minSize) + ('px, ' + 'max-content)'));
										} else {
											var minSize = _v2.a.a;
											var maxSize = _v2.b.a;
											return 'minmax(' + ($elm$core$String$fromInt(minSize) + ('px, ' + ($elm$core$String$fromInt(maxSize) + 'px)')));
										}
									}
								case 2:
									var i = x.a;
									var _v7 = _Utils_Tuple2(minimum, maximum);
									if (_v7.a.$ === 1) {
										if (_v7.b.$ === 1) {
											var _v8 = _v7.a;
											var _v9 = _v7.b;
											return $elm$core$String$fromInt(i) + 'fr';
										} else {
											var _v11 = _v7.a;
											var maxSize = _v7.b.a;
											return 'minmax(max-content, ' + ($elm$core$String$fromInt(maxSize) + 'px)');
										}
									} else {
										if (_v7.b.$ === 1) {
											var minSize = _v7.a.a;
											var _v10 = _v7.b;
											return 'minmax(' + ($elm$core$String$fromInt(minSize) + ('px, ' + ($elm$core$String$fromInt(i) + ('fr' + 'fr)'))));
										} else {
											var minSize = _v7.a.a;
											var maxSize = _v7.b.a;
											return 'minmax(' + ($elm$core$String$fromInt(minSize) + ('px, ' + ($elm$core$String$fromInt(maxSize) + 'px)')));
										}
									}
								case 3:
									var m = x.a;
									var len = x.b;
									var $temp$minimum = $elm$core$Maybe$Just(m),
										$temp$maximum = maximum,
										$temp$x = len;
									minimum = $temp$minimum;
									maximum = $temp$maximum;
									x = $temp$x;
									continue toGridLengthHelper;
								default:
									var m = x.a;
									var len = x.b;
									var $temp$minimum = minimum,
										$temp$maximum = $elm$core$Maybe$Just(m),
										$temp$x = len;
									minimum = $temp$minimum;
									maximum = $temp$maximum;
									x = $temp$x;
									continue toGridLengthHelper;
							}
						}
					});
				var toGridLength = function (x) {
					return A3(toGridLengthHelper, $elm$core$Maybe$Nothing, $elm$core$Maybe$Nothing, x);
				};
				var xSpacing = toGridLength(template.gQ.a);
				var ySpacing = toGridLength(template.gQ.b);
				var rows = function (x) {
					return 'grid-template-rows: ' + (x + ';');
				}(
					A2(
						$elm$core$String$join,
						' ',
						A2($elm$core$List$map, toGridLength, template.gF)));
				var msRows = function (x) {
					return '-ms-grid-rows: ' + (x + ';');
				}(
					A2(
						$elm$core$String$join,
						ySpacing,
						A2($elm$core$List$map, toGridLength, template.bK)));
				var msColumns = function (x) {
					return '-ms-grid-columns: ' + (x + ';');
				}(
					A2(
						$elm$core$String$join,
						ySpacing,
						A2($elm$core$List$map, toGridLength, template.bK)));
				var gapY = 'grid-row-gap:' + (toGridLength(template.gQ.b) + ';');
				var gapX = 'grid-column-gap:' + (toGridLength(template.gQ.a) + ';');
				var columns = function (x) {
					return 'grid-template-columns: ' + (x + ';');
				}(
					A2(
						$elm$core$String$join,
						' ',
						A2($elm$core$List$map, toGridLength, template.bK)));
				var _class = '.grid-rows-' + (A2(
					$elm$core$String$join,
					'-',
					A2($elm$core$List$map, $mdgriffith$elm_ui$Internal$Model$lengthClassName, template.gF)) + ('-cols-' + (A2(
					$elm$core$String$join,
					'-',
					A2($elm$core$List$map, $mdgriffith$elm_ui$Internal$Model$lengthClassName, template.bK)) + ('-space-x-' + ($mdgriffith$elm_ui$Internal$Model$lengthClassName(template.gQ.a) + ('-space-y-' + $mdgriffith$elm_ui$Internal$Model$lengthClassName(template.gQ.b)))))));
				var modernGrid = _class + ('{' + (columns + (rows + (gapX + (gapY + '}')))));
				var supports = '@supports (display:grid) {' + (modernGrid + '}');
				var base = _class + ('{' + (msColumns + (msRows + '}')));
				return _List_fromArray(
					[base, supports]);
			case 9:
				var position = rule.a;
				var msPosition = A2(
					$elm$core$String$join,
					' ',
					_List_fromArray(
						[
							'-ms-grid-row: ' + ($elm$core$String$fromInt(position.eh) + ';'),
							'-ms-grid-row-span: ' + ($elm$core$String$fromInt(position.dB) + ';'),
							'-ms-grid-column: ' + ($elm$core$String$fromInt(position.dn) + ';'),
							'-ms-grid-column-span: ' + ($elm$core$String$fromInt(position.Y) + ';')
						]));
				var modernPosition = A2(
					$elm$core$String$join,
					' ',
					_List_fromArray(
						[
							'grid-row: ' + ($elm$core$String$fromInt(position.eh) + (' / ' + ($elm$core$String$fromInt(position.eh + position.dB) + ';'))),
							'grid-column: ' + ($elm$core$String$fromInt(position.dn) + (' / ' + ($elm$core$String$fromInt(position.dn + position.Y) + ';')))
						]));
				var _class = '.grid-pos-' + ($elm$core$String$fromInt(position.eh) + ('-' + ($elm$core$String$fromInt(position.dn) + ('-' + ($elm$core$String$fromInt(position.Y) + ('-' + $elm$core$String$fromInt(position.dB)))))));
				var modernGrid = _class + ('{' + (modernPosition + '}'));
				var supports = '@supports (display:grid) {' + (modernGrid + '}');
				var base = _class + ('{' + (msPosition + '}'));
				return _List_fromArray(
					[base, supports]);
			case 11:
				var _class = rule.a;
				var styles = rule.b;
				var renderPseudoRule = function (style) {
					return A3(
						$mdgriffith$elm_ui$Internal$Model$renderStyleRule,
						options,
						style,
						$elm$core$Maybe$Just(_class));
				};
				return A2($elm$core$List$concatMap, renderPseudoRule, styles);
			default:
				var transform = rule.a;
				var val = $mdgriffith$elm_ui$Internal$Model$transformValue(transform);
				var _class = $mdgriffith$elm_ui$Internal$Model$transformClass(transform);
				var _v12 = _Utils_Tuple2(_class, val);
				if ((!_v12.a.$) && (!_v12.b.$)) {
					var cls = _v12.a.a;
					var v = _v12.b.a;
					return A4(
						$mdgriffith$elm_ui$Internal$Model$renderStyle,
						options,
						maybePseudo,
						'.' + cls,
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Model$Property, 'transform', v)
							]));
				} else {
					return _List_Nil;
				}
		}
	});
var $mdgriffith$elm_ui$Internal$Model$encodeStyles = F2(
	function (options, stylesheet) {
		return $elm$json$Json$Encode$object(
			A2(
				$elm$core$List$map,
				function (style) {
					var styled = A3($mdgriffith$elm_ui$Internal$Model$renderStyleRule, options, style, $elm$core$Maybe$Nothing);
					return _Utils_Tuple2(
						$mdgriffith$elm_ui$Internal$Model$getStyleName(style),
						A2($elm$json$Json$Encode$list, $elm$json$Json$Encode$string, styled));
				},
				stylesheet));
	});
var $mdgriffith$elm_ui$Internal$Model$bracket = F2(
	function (selector, rules) {
		var renderPair = function (_v0) {
			var name = _v0.a;
			var val = _v0.b;
			return name + (': ' + (val + ';'));
		};
		return selector + (' {' + (A2(
			$elm$core$String$join,
			'',
			A2($elm$core$List$map, renderPair, rules)) + '}'));
	});
var $mdgriffith$elm_ui$Internal$Model$fontRule = F3(
	function (name, modifier, _v0) {
		var parentAdj = _v0.a;
		var textAdjustment = _v0.b;
		return _List_fromArray(
			[
				A2($mdgriffith$elm_ui$Internal$Model$bracket, '.' + (name + ('.' + (modifier + (', ' + ('.' + (name + (' .' + modifier))))))), parentAdj),
				A2($mdgriffith$elm_ui$Internal$Model$bracket, '.' + (name + ('.' + (modifier + ('> .' + ($mdgriffith$elm_ui$Internal$Style$classes.g + (', .' + (name + (' .' + (modifier + (' > .' + $mdgriffith$elm_ui$Internal$Style$classes.g)))))))))), textAdjustment)
			]);
	});
var $mdgriffith$elm_ui$Internal$Model$renderFontAdjustmentRule = F3(
	function (fontToAdjust, _v0, otherFontName) {
		var full = _v0.a;
		var capital = _v0.b;
		var name = _Utils_eq(fontToAdjust, otherFontName) ? fontToAdjust : (otherFontName + (' .' + fontToAdjust));
		return A2(
			$elm$core$String$join,
			' ',
			_Utils_ap(
				A3($mdgriffith$elm_ui$Internal$Model$fontRule, name, $mdgriffith$elm_ui$Internal$Style$classes.gO, capital),
				A3($mdgriffith$elm_ui$Internal$Model$fontRule, name, $mdgriffith$elm_ui$Internal$Style$classes.fF, full)));
	});
var $mdgriffith$elm_ui$Internal$Model$renderNullAdjustmentRule = F2(
	function (fontToAdjust, otherFontName) {
		var name = _Utils_eq(fontToAdjust, otherFontName) ? fontToAdjust : (otherFontName + (' .' + fontToAdjust));
		return A2(
			$elm$core$String$join,
			' ',
			_List_fromArray(
				[
					A2(
					$mdgriffith$elm_ui$Internal$Model$bracket,
					'.' + (name + ('.' + ($mdgriffith$elm_ui$Internal$Style$classes.gO + (', ' + ('.' + (name + (' .' + $mdgriffith$elm_ui$Internal$Style$classes.gO))))))),
					_List_fromArray(
						[
							_Utils_Tuple2('line-height', '1')
						])),
					A2(
					$mdgriffith$elm_ui$Internal$Model$bracket,
					'.' + (name + ('.' + ($mdgriffith$elm_ui$Internal$Style$classes.gO + ('> .' + ($mdgriffith$elm_ui$Internal$Style$classes.g + (', .' + (name + (' .' + ($mdgriffith$elm_ui$Internal$Style$classes.gO + (' > .' + $mdgriffith$elm_ui$Internal$Style$classes.g)))))))))),
					_List_fromArray(
						[
							_Utils_Tuple2('vertical-align', '0'),
							_Utils_Tuple2('line-height', '1')
						]))
				]));
	});
var $mdgriffith$elm_ui$Internal$Model$adjust = F3(
	function (size, height, vertical) {
		return {dB: height / size, ep: size, eE: vertical};
	});
var $elm$core$List$maximum = function (list) {
	if (list.b) {
		var x = list.a;
		var xs = list.b;
		return $elm$core$Maybe$Just(
			A3($elm$core$List$foldl, $elm$core$Basics$max, x, xs));
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $elm$core$List$minimum = function (list) {
	if (list.b) {
		var x = list.a;
		var xs = list.b;
		return $elm$core$Maybe$Just(
			A3($elm$core$List$foldl, $elm$core$Basics$min, x, xs));
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $mdgriffith$elm_ui$Internal$Model$convertAdjustment = function (adjustment) {
	var lines = _List_fromArray(
		[adjustment.fc, adjustment.e0, adjustment.fs, adjustment.f6]);
	var lineHeight = 1.5;
	var normalDescender = (lineHeight - 1) / 2;
	var oldMiddle = lineHeight / 2;
	var descender = A2(
		$elm$core$Maybe$withDefault,
		adjustment.fs,
		$elm$core$List$minimum(lines));
	var newBaseline = A2(
		$elm$core$Maybe$withDefault,
		adjustment.e0,
		$elm$core$List$minimum(
			A2(
				$elm$core$List$filter,
				function (x) {
					return !_Utils_eq(x, descender);
				},
				lines)));
	var base = lineHeight;
	var ascender = A2(
		$elm$core$Maybe$withDefault,
		adjustment.fc,
		$elm$core$List$maximum(lines));
	var capitalSize = 1 / (ascender - newBaseline);
	var capitalVertical = 1 - ascender;
	var fullSize = 1 / (ascender - descender);
	var fullVertical = 1 - ascender;
	var newCapitalMiddle = ((ascender - newBaseline) / 2) + newBaseline;
	var newFullMiddle = ((ascender - descender) / 2) + descender;
	return {
		fc: A3($mdgriffith$elm_ui$Internal$Model$adjust, capitalSize, ascender - newBaseline, capitalVertical),
		dA: A3($mdgriffith$elm_ui$Internal$Model$adjust, fullSize, ascender - descender, fullVertical)
	};
};
var $mdgriffith$elm_ui$Internal$Model$fontAdjustmentRules = function (converted) {
	return _Utils_Tuple2(
		_List_fromArray(
			[
				_Utils_Tuple2('display', 'block')
			]),
		_List_fromArray(
			[
				_Utils_Tuple2('display', 'inline-block'),
				_Utils_Tuple2(
				'line-height',
				$elm$core$String$fromFloat(converted.dB)),
				_Utils_Tuple2(
				'vertical-align',
				$elm$core$String$fromFloat(converted.eE) + 'em'),
				_Utils_Tuple2(
				'font-size',
				$elm$core$String$fromFloat(converted.ep) + 'em')
			]));
};
var $mdgriffith$elm_ui$Internal$Model$typefaceAdjustment = function (typefaces) {
	return A3(
		$elm$core$List$foldl,
		F2(
			function (face, found) {
				if (found.$ === 1) {
					if (face.$ === 5) {
						var _with = face.a;
						var _v2 = _with.eM;
						if (_v2.$ === 1) {
							return found;
						} else {
							var adjustment = _v2.a;
							return $elm$core$Maybe$Just(
								_Utils_Tuple2(
									$mdgriffith$elm_ui$Internal$Model$fontAdjustmentRules(
										function ($) {
											return $.dA;
										}(
											$mdgriffith$elm_ui$Internal$Model$convertAdjustment(adjustment))),
									$mdgriffith$elm_ui$Internal$Model$fontAdjustmentRules(
										function ($) {
											return $.fc;
										}(
											$mdgriffith$elm_ui$Internal$Model$convertAdjustment(adjustment)))));
						}
					} else {
						return found;
					}
				} else {
					return found;
				}
			}),
		$elm$core$Maybe$Nothing,
		typefaces);
};
var $mdgriffith$elm_ui$Internal$Model$renderTopLevelValues = function (rules) {
	var withImport = function (font) {
		if (font.$ === 4) {
			var url = font.b;
			return $elm$core$Maybe$Just('@import url(\'' + (url + '\');'));
		} else {
			return $elm$core$Maybe$Nothing;
		}
	};
	var fontImports = function (_v2) {
		var name = _v2.a;
		var typefaces = _v2.b;
		var imports = A2(
			$elm$core$String$join,
			'\n',
			A2($elm$core$List$filterMap, withImport, typefaces));
		return imports;
	};
	var allNames = A2($elm$core$List$map, $elm$core$Tuple$first, rules);
	var fontAdjustments = function (_v1) {
		var name = _v1.a;
		var typefaces = _v1.b;
		var _v0 = $mdgriffith$elm_ui$Internal$Model$typefaceAdjustment(typefaces);
		if (_v0.$ === 1) {
			return A2(
				$elm$core$String$join,
				'',
				A2(
					$elm$core$List$map,
					$mdgriffith$elm_ui$Internal$Model$renderNullAdjustmentRule(name),
					allNames));
		} else {
			var adjustment = _v0.a;
			return A2(
				$elm$core$String$join,
				'',
				A2(
					$elm$core$List$map,
					A2($mdgriffith$elm_ui$Internal$Model$renderFontAdjustmentRule, name, adjustment),
					allNames));
		}
	};
	return _Utils_ap(
		A2(
			$elm$core$String$join,
			'\n',
			A2($elm$core$List$map, fontImports, rules)),
		A2(
			$elm$core$String$join,
			'\n',
			A2($elm$core$List$map, fontAdjustments, rules)));
};
var $mdgriffith$elm_ui$Internal$Model$topLevelValue = function (rule) {
	if (rule.$ === 1) {
		var name = rule.a;
		var typefaces = rule.b;
		return $elm$core$Maybe$Just(
			_Utils_Tuple2(name, typefaces));
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $mdgriffith$elm_ui$Internal$Model$toStyleSheetString = F2(
	function (options, stylesheet) {
		var combine = F2(
			function (style, rendered) {
				return {
					bY: _Utils_ap(
						rendered.bY,
						A3($mdgriffith$elm_ui$Internal$Model$renderStyleRule, options, style, $elm$core$Maybe$Nothing)),
					by: function () {
						var _v1 = $mdgriffith$elm_ui$Internal$Model$topLevelValue(style);
						if (_v1.$ === 1) {
							return rendered.by;
						} else {
							var topLevel = _v1.a;
							return A2($elm$core$List$cons, topLevel, rendered.by);
						}
					}()
				};
			});
		var _v0 = A3(
			$elm$core$List$foldl,
			combine,
			{bY: _List_Nil, by: _List_Nil},
			stylesheet);
		var topLevel = _v0.by;
		var rules = _v0.bY;
		return _Utils_ap(
			$mdgriffith$elm_ui$Internal$Model$renderTopLevelValues(topLevel),
			$elm$core$String$concat(rules));
	});
var $mdgriffith$elm_ui$Internal$Model$toStyleSheet = F2(
	function (options, styleSheet) {
		var _v0 = options.aJ;
		switch (_v0) {
			case 0:
				return A3(
					$elm$virtual_dom$VirtualDom$node,
					'div',
					_List_Nil,
					_List_fromArray(
						[
							A3(
							$elm$virtual_dom$VirtualDom$node,
							'style',
							_List_Nil,
							_List_fromArray(
								[
									$elm$virtual_dom$VirtualDom$text(
									A2($mdgriffith$elm_ui$Internal$Model$toStyleSheetString, options, styleSheet))
								]))
						]));
			case 1:
				return A3(
					$elm$virtual_dom$VirtualDom$node,
					'div',
					_List_Nil,
					_List_fromArray(
						[
							A3(
							$elm$virtual_dom$VirtualDom$node,
							'style',
							_List_Nil,
							_List_fromArray(
								[
									$elm$virtual_dom$VirtualDom$text(
									A2($mdgriffith$elm_ui$Internal$Model$toStyleSheetString, options, styleSheet))
								]))
						]));
			default:
				return A3(
					$elm$virtual_dom$VirtualDom$node,
					'elm-ui-rules',
					_List_fromArray(
						[
							A2(
							$elm$virtual_dom$VirtualDom$property,
							'rules',
							A2($mdgriffith$elm_ui$Internal$Model$encodeStyles, options, styleSheet))
						]),
					_List_Nil);
		}
	});
var $mdgriffith$elm_ui$Internal$Model$embedKeyed = F4(
	function (_static, opts, styles, children) {
		var dynamicStyleSheet = A2(
			$mdgriffith$elm_ui$Internal$Model$toStyleSheet,
			opts,
			A3(
				$elm$core$List$foldl,
				$mdgriffith$elm_ui$Internal$Model$reduceStyles,
				_Utils_Tuple2(
					$elm$core$Set$empty,
					$mdgriffith$elm_ui$Internal$Model$renderFocusStyle(opts.fE)),
				styles).b);
		return _static ? A2(
			$elm$core$List$cons,
			_Utils_Tuple2(
				'static-stylesheet',
				$mdgriffith$elm_ui$Internal$Model$staticRoot(opts)),
			A2(
				$elm$core$List$cons,
				_Utils_Tuple2('dynamic-stylesheet', dynamicStyleSheet),
				children)) : A2(
			$elm$core$List$cons,
			_Utils_Tuple2('dynamic-stylesheet', dynamicStyleSheet),
			children);
	});
var $mdgriffith$elm_ui$Internal$Model$embedWith = F4(
	function (_static, opts, styles, children) {
		var dynamicStyleSheet = A2(
			$mdgriffith$elm_ui$Internal$Model$toStyleSheet,
			opts,
			A3(
				$elm$core$List$foldl,
				$mdgriffith$elm_ui$Internal$Model$reduceStyles,
				_Utils_Tuple2(
					$elm$core$Set$empty,
					$mdgriffith$elm_ui$Internal$Model$renderFocusStyle(opts.fE)),
				styles).b);
		return _static ? A2(
			$elm$core$List$cons,
			$mdgriffith$elm_ui$Internal$Model$staticRoot(opts),
			A2($elm$core$List$cons, dynamicStyleSheet, children)) : A2($elm$core$List$cons, dynamicStyleSheet, children);
	});
var $mdgriffith$elm_ui$Internal$Flag$heightBetween = $mdgriffith$elm_ui$Internal$Flag$flag(45);
var $mdgriffith$elm_ui$Internal$Flag$heightFill = $mdgriffith$elm_ui$Internal$Flag$flag(37);
var $elm$virtual_dom$VirtualDom$keyedNode = function (tag) {
	return _VirtualDom_keyedNode(
		_VirtualDom_noScript(tag));
};
var $elm$html$Html$p = _VirtualDom_node('p');
var $mdgriffith$elm_ui$Internal$Flag$present = F2(
	function (myFlag, _v0) {
		var fieldOne = _v0.a;
		var fieldTwo = _v0.b;
		if (!myFlag.$) {
			var first = myFlag.a;
			return _Utils_eq(first & fieldOne, first);
		} else {
			var second = myFlag.a;
			return _Utils_eq(second & fieldTwo, second);
		}
	});
var $elm$html$Html$s = _VirtualDom_node('s');
var $elm$html$Html$u = _VirtualDom_node('u');
var $mdgriffith$elm_ui$Internal$Flag$widthBetween = $mdgriffith$elm_ui$Internal$Flag$flag(44);
var $mdgriffith$elm_ui$Internal$Flag$widthFill = $mdgriffith$elm_ui$Internal$Flag$flag(39);
var $mdgriffith$elm_ui$Internal$Model$finalizeNode = F6(
	function (has, node, attributes, children, embedMode, parentContext) {
		var createNode = F2(
			function (nodeName, attrs) {
				if (children.$ === 1) {
					var keyed = children.a;
					return A3(
						$elm$virtual_dom$VirtualDom$keyedNode,
						nodeName,
						attrs,
						function () {
							switch (embedMode.$) {
								case 0:
									return keyed;
								case 2:
									var opts = embedMode.a;
									var styles = embedMode.b;
									return A4($mdgriffith$elm_ui$Internal$Model$embedKeyed, false, opts, styles, keyed);
								default:
									var opts = embedMode.a;
									var styles = embedMode.b;
									return A4($mdgriffith$elm_ui$Internal$Model$embedKeyed, true, opts, styles, keyed);
							}
						}());
				} else {
					var unkeyed = children.a;
					return A2(
						function () {
							switch (nodeName) {
								case 'div':
									return $elm$html$Html$div;
								case 'p':
									return $elm$html$Html$p;
								default:
									return $elm$virtual_dom$VirtualDom$node(nodeName);
							}
						}(),
						attrs,
						function () {
							switch (embedMode.$) {
								case 0:
									return unkeyed;
								case 2:
									var opts = embedMode.a;
									var styles = embedMode.b;
									return A4($mdgriffith$elm_ui$Internal$Model$embedWith, false, opts, styles, unkeyed);
								default:
									var opts = embedMode.a;
									var styles = embedMode.b;
									return A4($mdgriffith$elm_ui$Internal$Model$embedWith, true, opts, styles, unkeyed);
							}
						}());
				}
			});
		var html = function () {
			switch (node.$) {
				case 0:
					return A2(createNode, 'div', attributes);
				case 1:
					var nodeName = node.a;
					return A2(createNode, nodeName, attributes);
				default:
					var nodeName = node.a;
					var internal = node.b;
					return A3(
						$elm$virtual_dom$VirtualDom$node,
						nodeName,
						attributes,
						_List_fromArray(
							[
								A2(
								createNode,
								internal,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class($mdgriffith$elm_ui$Internal$Style$classes.eY + (' ' + $mdgriffith$elm_ui$Internal$Style$classes.gN))
									]))
							]));
			}
		}();
		switch (parentContext) {
			case 0:
				return (A2($mdgriffith$elm_ui$Internal$Flag$present, $mdgriffith$elm_ui$Internal$Flag$widthFill, has) && (!A2($mdgriffith$elm_ui$Internal$Flag$present, $mdgriffith$elm_ui$Internal$Flag$widthBetween, has))) ? html : (A2($mdgriffith$elm_ui$Internal$Flag$present, $mdgriffith$elm_ui$Internal$Flag$alignRight, has) ? A2(
					$elm$html$Html$u,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class(
							A2(
								$elm$core$String$join,
								' ',
								_List_fromArray(
									[$mdgriffith$elm_ui$Internal$Style$classes.eY, $mdgriffith$elm_ui$Internal$Style$classes.gN, $mdgriffith$elm_ui$Internal$Style$classes.bL, $mdgriffith$elm_ui$Internal$Style$classes.am, $mdgriffith$elm_ui$Internal$Style$classes.eU])))
						]),
					_List_fromArray(
						[html])) : (A2($mdgriffith$elm_ui$Internal$Flag$present, $mdgriffith$elm_ui$Internal$Flag$centerX, has) ? A2(
					$elm$html$Html$s,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class(
							A2(
								$elm$core$String$join,
								' ',
								_List_fromArray(
									[$mdgriffith$elm_ui$Internal$Style$classes.eY, $mdgriffith$elm_ui$Internal$Style$classes.gN, $mdgriffith$elm_ui$Internal$Style$classes.bL, $mdgriffith$elm_ui$Internal$Style$classes.am, $mdgriffith$elm_ui$Internal$Style$classes.eS])))
						]),
					_List_fromArray(
						[html])) : html));
			case 1:
				return (A2($mdgriffith$elm_ui$Internal$Flag$present, $mdgriffith$elm_ui$Internal$Flag$heightFill, has) && (!A2($mdgriffith$elm_ui$Internal$Flag$present, $mdgriffith$elm_ui$Internal$Flag$heightBetween, has))) ? html : (A2($mdgriffith$elm_ui$Internal$Flag$present, $mdgriffith$elm_ui$Internal$Flag$centerY, has) ? A2(
					$elm$html$Html$s,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class(
							A2(
								$elm$core$String$join,
								' ',
								_List_fromArray(
									[$mdgriffith$elm_ui$Internal$Style$classes.eY, $mdgriffith$elm_ui$Internal$Style$classes.gN, $mdgriffith$elm_ui$Internal$Style$classes.bL, $mdgriffith$elm_ui$Internal$Style$classes.eT])))
						]),
					_List_fromArray(
						[html])) : (A2($mdgriffith$elm_ui$Internal$Flag$present, $mdgriffith$elm_ui$Internal$Flag$alignBottom, has) ? A2(
					$elm$html$Html$u,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class(
							A2(
								$elm$core$String$join,
								' ',
								_List_fromArray(
									[$mdgriffith$elm_ui$Internal$Style$classes.eY, $mdgriffith$elm_ui$Internal$Style$classes.gN, $mdgriffith$elm_ui$Internal$Style$classes.bL, $mdgriffith$elm_ui$Internal$Style$classes.eR])))
						]),
					_List_fromArray(
						[html])) : html));
			default:
				return html;
		}
	});
var $elm$html$Html$text = $elm$virtual_dom$VirtualDom$text;
var $mdgriffith$elm_ui$Internal$Model$textElementClasses = $mdgriffith$elm_ui$Internal$Style$classes.eY + (' ' + ($mdgriffith$elm_ui$Internal$Style$classes.g + (' ' + ($mdgriffith$elm_ui$Internal$Style$classes.c9 + (' ' + $mdgriffith$elm_ui$Internal$Style$classes.cm)))));
var $mdgriffith$elm_ui$Internal$Model$textElement = function (str) {
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class($mdgriffith$elm_ui$Internal$Model$textElementClasses)
			]),
		_List_fromArray(
			[
				$elm$html$Html$text(str)
			]));
};
var $mdgriffith$elm_ui$Internal$Model$textElementFillClasses = $mdgriffith$elm_ui$Internal$Style$classes.eY + (' ' + ($mdgriffith$elm_ui$Internal$Style$classes.g + (' ' + ($mdgriffith$elm_ui$Internal$Style$classes.da + (' ' + $mdgriffith$elm_ui$Internal$Style$classes.cn)))));
var $mdgriffith$elm_ui$Internal$Model$textElementFill = function (str) {
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class($mdgriffith$elm_ui$Internal$Model$textElementFillClasses)
			]),
		_List_fromArray(
			[
				$elm$html$Html$text(str)
			]));
};
var $mdgriffith$elm_ui$Internal$Model$createElement = F3(
	function (context, children, rendered) {
		var gatherKeyed = F2(
			function (_v8, _v9) {
				var key = _v8.a;
				var child = _v8.b;
				var htmls = _v9.a;
				var existingStyles = _v9.b;
				switch (child.$) {
					case 0:
						var html = child.a;
						return _Utils_eq(context, $mdgriffith$elm_ui$Internal$Model$asParagraph) ? _Utils_Tuple2(
							A2(
								$elm$core$List$cons,
								_Utils_Tuple2(
									key,
									html(context)),
								htmls),
							existingStyles) : _Utils_Tuple2(
							A2(
								$elm$core$List$cons,
								_Utils_Tuple2(
									key,
									html(context)),
								htmls),
							existingStyles);
					case 1:
						var styled = child.a;
						return _Utils_eq(context, $mdgriffith$elm_ui$Internal$Model$asParagraph) ? _Utils_Tuple2(
							A2(
								$elm$core$List$cons,
								_Utils_Tuple2(
									key,
									A2(styled.fN, $mdgriffith$elm_ui$Internal$Model$NoStyleSheet, context)),
								htmls),
							$elm$core$List$isEmpty(existingStyles) ? styled.gY : _Utils_ap(styled.gY, existingStyles)) : _Utils_Tuple2(
							A2(
								$elm$core$List$cons,
								_Utils_Tuple2(
									key,
									A2(styled.fN, $mdgriffith$elm_ui$Internal$Model$NoStyleSheet, context)),
								htmls),
							$elm$core$List$isEmpty(existingStyles) ? styled.gY : _Utils_ap(styled.gY, existingStyles));
					case 2:
						var str = child.a;
						return _Utils_Tuple2(
							A2(
								$elm$core$List$cons,
								_Utils_Tuple2(
									key,
									_Utils_eq(context, $mdgriffith$elm_ui$Internal$Model$asEl) ? $mdgriffith$elm_ui$Internal$Model$textElementFill(str) : $mdgriffith$elm_ui$Internal$Model$textElement(str)),
								htmls),
							existingStyles);
					default:
						return _Utils_Tuple2(htmls, existingStyles);
				}
			});
		var gather = F2(
			function (child, _v6) {
				var htmls = _v6.a;
				var existingStyles = _v6.b;
				switch (child.$) {
					case 0:
						var html = child.a;
						return _Utils_eq(context, $mdgriffith$elm_ui$Internal$Model$asParagraph) ? _Utils_Tuple2(
							A2(
								$elm$core$List$cons,
								html(context),
								htmls),
							existingStyles) : _Utils_Tuple2(
							A2(
								$elm$core$List$cons,
								html(context),
								htmls),
							existingStyles);
					case 1:
						var styled = child.a;
						return _Utils_eq(context, $mdgriffith$elm_ui$Internal$Model$asParagraph) ? _Utils_Tuple2(
							A2(
								$elm$core$List$cons,
								A2(styled.fN, $mdgriffith$elm_ui$Internal$Model$NoStyleSheet, context),
								htmls),
							$elm$core$List$isEmpty(existingStyles) ? styled.gY : _Utils_ap(styled.gY, existingStyles)) : _Utils_Tuple2(
							A2(
								$elm$core$List$cons,
								A2(styled.fN, $mdgriffith$elm_ui$Internal$Model$NoStyleSheet, context),
								htmls),
							$elm$core$List$isEmpty(existingStyles) ? styled.gY : _Utils_ap(styled.gY, existingStyles));
					case 2:
						var str = child.a;
						return _Utils_Tuple2(
							A2(
								$elm$core$List$cons,
								_Utils_eq(context, $mdgriffith$elm_ui$Internal$Model$asEl) ? $mdgriffith$elm_ui$Internal$Model$textElementFill(str) : $mdgriffith$elm_ui$Internal$Model$textElement(str),
								htmls),
							existingStyles);
					default:
						return _Utils_Tuple2(htmls, existingStyles);
				}
			});
		if (children.$ === 1) {
			var keyedChildren = children.a;
			var _v1 = A3(
				$elm$core$List$foldr,
				gatherKeyed,
				_Utils_Tuple2(_List_Nil, _List_Nil),
				keyedChildren);
			var keyed = _v1.a;
			var styles = _v1.b;
			var newStyles = $elm$core$List$isEmpty(styles) ? rendered.gY : _Utils_ap(rendered.gY, styles);
			if (!newStyles.b) {
				return $mdgriffith$elm_ui$Internal$Model$Unstyled(
					A5(
						$mdgriffith$elm_ui$Internal$Model$finalizeNode,
						rendered.aI,
						rendered.aK,
						rendered.ah,
						$mdgriffith$elm_ui$Internal$Model$Keyed(
							A3($mdgriffith$elm_ui$Internal$Model$addKeyedChildren, 'nearby-element-pls', keyed, rendered.aD)),
						$mdgriffith$elm_ui$Internal$Model$NoStyleSheet));
			} else {
				var allStyles = newStyles;
				return $mdgriffith$elm_ui$Internal$Model$Styled(
					{
						fN: A4(
							$mdgriffith$elm_ui$Internal$Model$finalizeNode,
							rendered.aI,
							rendered.aK,
							rendered.ah,
							$mdgriffith$elm_ui$Internal$Model$Keyed(
								A3($mdgriffith$elm_ui$Internal$Model$addKeyedChildren, 'nearby-element-pls', keyed, rendered.aD))),
						gY: allStyles
					});
			}
		} else {
			var unkeyedChildren = children.a;
			var _v3 = A3(
				$elm$core$List$foldr,
				gather,
				_Utils_Tuple2(_List_Nil, _List_Nil),
				unkeyedChildren);
			var unkeyed = _v3.a;
			var styles = _v3.b;
			var newStyles = $elm$core$List$isEmpty(styles) ? rendered.gY : _Utils_ap(rendered.gY, styles);
			if (!newStyles.b) {
				return $mdgriffith$elm_ui$Internal$Model$Unstyled(
					A5(
						$mdgriffith$elm_ui$Internal$Model$finalizeNode,
						rendered.aI,
						rendered.aK,
						rendered.ah,
						$mdgriffith$elm_ui$Internal$Model$Unkeyed(
							A2($mdgriffith$elm_ui$Internal$Model$addChildren, unkeyed, rendered.aD)),
						$mdgriffith$elm_ui$Internal$Model$NoStyleSheet));
			} else {
				var allStyles = newStyles;
				return $mdgriffith$elm_ui$Internal$Model$Styled(
					{
						fN: A4(
							$mdgriffith$elm_ui$Internal$Model$finalizeNode,
							rendered.aI,
							rendered.aK,
							rendered.ah,
							$mdgriffith$elm_ui$Internal$Model$Unkeyed(
								A2($mdgriffith$elm_ui$Internal$Model$addChildren, unkeyed, rendered.aD))),
						gY: allStyles
					});
			}
		}
	});
var $mdgriffith$elm_ui$Internal$Model$Single = F3(
	function (a, b, c) {
		return {$: 3, a: a, b: b, c: c};
	});
var $mdgriffith$elm_ui$Internal$Model$Transform = function (a) {
	return {$: 10, a: a};
};
var $mdgriffith$elm_ui$Internal$Flag$Field = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var $mdgriffith$elm_ui$Internal$Flag$add = F2(
	function (myFlag, _v0) {
		var one = _v0.a;
		var two = _v0.b;
		if (!myFlag.$) {
			var first = myFlag.a;
			return A2($mdgriffith$elm_ui$Internal$Flag$Field, first | one, two);
		} else {
			var second = myFlag.a;
			return A2($mdgriffith$elm_ui$Internal$Flag$Field, one, second | two);
		}
	});
var $mdgriffith$elm_ui$Internal$Model$ChildrenBehind = function (a) {
	return {$: 1, a: a};
};
var $mdgriffith$elm_ui$Internal$Model$ChildrenBehindAndInFront = F2(
	function (a, b) {
		return {$: 3, a: a, b: b};
	});
var $mdgriffith$elm_ui$Internal$Model$ChildrenInFront = function (a) {
	return {$: 2, a: a};
};
var $mdgriffith$elm_ui$Internal$Model$nearbyElement = F2(
	function (location, elem) {
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class(
					function () {
						switch (location) {
							case 0:
								return A2(
									$elm$core$String$join,
									' ',
									_List_fromArray(
										[$mdgriffith$elm_ui$Internal$Style$classes.a4, $mdgriffith$elm_ui$Internal$Style$classes.gN, $mdgriffith$elm_ui$Internal$Style$classes.eL]));
							case 1:
								return A2(
									$elm$core$String$join,
									' ',
									_List_fromArray(
										[$mdgriffith$elm_ui$Internal$Style$classes.a4, $mdgriffith$elm_ui$Internal$Style$classes.gN, $mdgriffith$elm_ui$Internal$Style$classes.e2]));
							case 2:
								return A2(
									$elm$core$String$join,
									' ',
									_List_fromArray(
										[$mdgriffith$elm_ui$Internal$Style$classes.a4, $mdgriffith$elm_ui$Internal$Style$classes.gN, $mdgriffith$elm_ui$Internal$Style$classes.gh]));
							case 3:
								return A2(
									$elm$core$String$join,
									' ',
									_List_fromArray(
										[$mdgriffith$elm_ui$Internal$Style$classes.a4, $mdgriffith$elm_ui$Internal$Style$classes.gN, $mdgriffith$elm_ui$Internal$Style$classes.gg]));
							case 4:
								return A2(
									$elm$core$String$join,
									' ',
									_List_fromArray(
										[$mdgriffith$elm_ui$Internal$Style$classes.a4, $mdgriffith$elm_ui$Internal$Style$classes.gN, $mdgriffith$elm_ui$Internal$Style$classes.fS]));
							default:
								return A2(
									$elm$core$String$join,
									' ',
									_List_fromArray(
										[$mdgriffith$elm_ui$Internal$Style$classes.a4, $mdgriffith$elm_ui$Internal$Style$classes.gN, $mdgriffith$elm_ui$Internal$Style$classes.e1]));
						}
					}())
				]),
			_List_fromArray(
				[
					function () {
					switch (elem.$) {
						case 3:
							return $elm$virtual_dom$VirtualDom$text('');
						case 2:
							var str = elem.a;
							return $mdgriffith$elm_ui$Internal$Model$textElement(str);
						case 0:
							var html = elem.a;
							return html($mdgriffith$elm_ui$Internal$Model$asEl);
						default:
							var styled = elem.a;
							return A2(styled.fN, $mdgriffith$elm_ui$Internal$Model$NoStyleSheet, $mdgriffith$elm_ui$Internal$Model$asEl);
					}
				}()
				]));
	});
var $mdgriffith$elm_ui$Internal$Model$addNearbyElement = F3(
	function (location, elem, existing) {
		var nearby = A2($mdgriffith$elm_ui$Internal$Model$nearbyElement, location, elem);
		switch (existing.$) {
			case 0:
				if (location === 5) {
					return $mdgriffith$elm_ui$Internal$Model$ChildrenBehind(
						_List_fromArray(
							[nearby]));
				} else {
					return $mdgriffith$elm_ui$Internal$Model$ChildrenInFront(
						_List_fromArray(
							[nearby]));
				}
			case 1:
				var existingBehind = existing.a;
				if (location === 5) {
					return $mdgriffith$elm_ui$Internal$Model$ChildrenBehind(
						A2($elm$core$List$cons, nearby, existingBehind));
				} else {
					return A2(
						$mdgriffith$elm_ui$Internal$Model$ChildrenBehindAndInFront,
						existingBehind,
						_List_fromArray(
							[nearby]));
				}
			case 2:
				var existingInFront = existing.a;
				if (location === 5) {
					return A2(
						$mdgriffith$elm_ui$Internal$Model$ChildrenBehindAndInFront,
						_List_fromArray(
							[nearby]),
						existingInFront);
				} else {
					return $mdgriffith$elm_ui$Internal$Model$ChildrenInFront(
						A2($elm$core$List$cons, nearby, existingInFront));
				}
			default:
				var existingBehind = existing.a;
				var existingInFront = existing.b;
				if (location === 5) {
					return A2(
						$mdgriffith$elm_ui$Internal$Model$ChildrenBehindAndInFront,
						A2($elm$core$List$cons, nearby, existingBehind),
						existingInFront);
				} else {
					return A2(
						$mdgriffith$elm_ui$Internal$Model$ChildrenBehindAndInFront,
						existingBehind,
						A2($elm$core$List$cons, nearby, existingInFront));
				}
		}
	});
var $mdgriffith$elm_ui$Internal$Model$Embedded = F2(
	function (a, b) {
		return {$: 2, a: a, b: b};
	});
var $mdgriffith$elm_ui$Internal$Model$NodeName = function (a) {
	return {$: 1, a: a};
};
var $mdgriffith$elm_ui$Internal$Model$addNodeName = F2(
	function (newNode, old) {
		switch (old.$) {
			case 0:
				return $mdgriffith$elm_ui$Internal$Model$NodeName(newNode);
			case 1:
				var name = old.a;
				return A2($mdgriffith$elm_ui$Internal$Model$Embedded, name, newNode);
			default:
				var x = old.a;
				var y = old.b;
				return A2($mdgriffith$elm_ui$Internal$Model$Embedded, x, y);
		}
	});
var $mdgriffith$elm_ui$Internal$Model$alignXName = function (align) {
	switch (align) {
		case 0:
			return $mdgriffith$elm_ui$Internal$Style$classes.b2 + (' ' + $mdgriffith$elm_ui$Internal$Style$classes.dg);
		case 2:
			return $mdgriffith$elm_ui$Internal$Style$classes.b2 + (' ' + $mdgriffith$elm_ui$Internal$Style$classes.dh);
		default:
			return $mdgriffith$elm_ui$Internal$Style$classes.b2 + (' ' + $mdgriffith$elm_ui$Internal$Style$classes.eP);
	}
};
var $mdgriffith$elm_ui$Internal$Model$alignYName = function (align) {
	switch (align) {
		case 0:
			return $mdgriffith$elm_ui$Internal$Style$classes.b3 + (' ' + $mdgriffith$elm_ui$Internal$Style$classes.eV);
		case 2:
			return $mdgriffith$elm_ui$Internal$Style$classes.b3 + (' ' + $mdgriffith$elm_ui$Internal$Style$classes.eO);
		default:
			return $mdgriffith$elm_ui$Internal$Style$classes.b3 + (' ' + $mdgriffith$elm_ui$Internal$Style$classes.eQ);
	}
};
var $elm$virtual_dom$VirtualDom$attribute = F2(
	function (key, value) {
		return A2(
			_VirtualDom_attribute,
			_VirtualDom_noOnOrFormAction(key),
			_VirtualDom_noJavaScriptOrHtmlUri(value));
	});
var $mdgriffith$elm_ui$Internal$Model$FullTransform = F4(
	function (a, b, c, d) {
		return {$: 2, a: a, b: b, c: c, d: d};
	});
var $mdgriffith$elm_ui$Internal$Model$Moved = function (a) {
	return {$: 1, a: a};
};
var $mdgriffith$elm_ui$Internal$Model$composeTransformation = F2(
	function (transform, component) {
		switch (transform.$) {
			case 0:
				switch (component.$) {
					case 0:
						var x = component.a;
						return $mdgriffith$elm_ui$Internal$Model$Moved(
							_Utils_Tuple3(x, 0, 0));
					case 1:
						var y = component.a;
						return $mdgriffith$elm_ui$Internal$Model$Moved(
							_Utils_Tuple3(0, y, 0));
					case 2:
						var z = component.a;
						return $mdgriffith$elm_ui$Internal$Model$Moved(
							_Utils_Tuple3(0, 0, z));
					case 3:
						var xyz = component.a;
						return $mdgriffith$elm_ui$Internal$Model$Moved(xyz);
					case 4:
						var xyz = component.a;
						var angle = component.b;
						return A4(
							$mdgriffith$elm_ui$Internal$Model$FullTransform,
							_Utils_Tuple3(0, 0, 0),
							_Utils_Tuple3(1, 1, 1),
							xyz,
							angle);
					default:
						var xyz = component.a;
						return A4(
							$mdgriffith$elm_ui$Internal$Model$FullTransform,
							_Utils_Tuple3(0, 0, 0),
							xyz,
							_Utils_Tuple3(0, 0, 1),
							0);
				}
			case 1:
				var moved = transform.a;
				var x = moved.a;
				var y = moved.b;
				var z = moved.c;
				switch (component.$) {
					case 0:
						var newX = component.a;
						return $mdgriffith$elm_ui$Internal$Model$Moved(
							_Utils_Tuple3(newX, y, z));
					case 1:
						var newY = component.a;
						return $mdgriffith$elm_ui$Internal$Model$Moved(
							_Utils_Tuple3(x, newY, z));
					case 2:
						var newZ = component.a;
						return $mdgriffith$elm_ui$Internal$Model$Moved(
							_Utils_Tuple3(x, y, newZ));
					case 3:
						var xyz = component.a;
						return $mdgriffith$elm_ui$Internal$Model$Moved(xyz);
					case 4:
						var xyz = component.a;
						var angle = component.b;
						return A4(
							$mdgriffith$elm_ui$Internal$Model$FullTransform,
							moved,
							_Utils_Tuple3(1, 1, 1),
							xyz,
							angle);
					default:
						var scale = component.a;
						return A4(
							$mdgriffith$elm_ui$Internal$Model$FullTransform,
							moved,
							scale,
							_Utils_Tuple3(0, 0, 1),
							0);
				}
			default:
				var moved = transform.a;
				var x = moved.a;
				var y = moved.b;
				var z = moved.c;
				var scaled = transform.b;
				var origin = transform.c;
				var angle = transform.d;
				switch (component.$) {
					case 0:
						var newX = component.a;
						return A4(
							$mdgriffith$elm_ui$Internal$Model$FullTransform,
							_Utils_Tuple3(newX, y, z),
							scaled,
							origin,
							angle);
					case 1:
						var newY = component.a;
						return A4(
							$mdgriffith$elm_ui$Internal$Model$FullTransform,
							_Utils_Tuple3(x, newY, z),
							scaled,
							origin,
							angle);
					case 2:
						var newZ = component.a;
						return A4(
							$mdgriffith$elm_ui$Internal$Model$FullTransform,
							_Utils_Tuple3(x, y, newZ),
							scaled,
							origin,
							angle);
					case 3:
						var newMove = component.a;
						return A4($mdgriffith$elm_ui$Internal$Model$FullTransform, newMove, scaled, origin, angle);
					case 4:
						var newOrigin = component.a;
						var newAngle = component.b;
						return A4($mdgriffith$elm_ui$Internal$Model$FullTransform, moved, scaled, newOrigin, newAngle);
					default:
						var newScale = component.a;
						return A4($mdgriffith$elm_ui$Internal$Model$FullTransform, moved, newScale, origin, angle);
				}
		}
	});
var $mdgriffith$elm_ui$Internal$Flag$height = $mdgriffith$elm_ui$Internal$Flag$flag(7);
var $mdgriffith$elm_ui$Internal$Flag$heightContent = $mdgriffith$elm_ui$Internal$Flag$flag(36);
var $mdgriffith$elm_ui$Internal$Flag$merge = F2(
	function (_v0, _v1) {
		var one = _v0.a;
		var two = _v0.b;
		var three = _v1.a;
		var four = _v1.b;
		return A2($mdgriffith$elm_ui$Internal$Flag$Field, one | three, two | four);
	});
var $mdgriffith$elm_ui$Internal$Flag$none = A2($mdgriffith$elm_ui$Internal$Flag$Field, 0, 0);
var $mdgriffith$elm_ui$Internal$Model$renderHeight = function (h) {
	switch (h.$) {
		case 0:
			var px = h.a;
			var val = $elm$core$String$fromInt(px);
			var name = 'height-px-' + val;
			return _Utils_Tuple3(
				$mdgriffith$elm_ui$Internal$Flag$none,
				$mdgriffith$elm_ui$Internal$Style$classes.dC + (' ' + name),
				_List_fromArray(
					[
						A3($mdgriffith$elm_ui$Internal$Model$Single, name, 'height', val + 'px')
					]));
		case 1:
			return _Utils_Tuple3(
				A2($mdgriffith$elm_ui$Internal$Flag$add, $mdgriffith$elm_ui$Internal$Flag$heightContent, $mdgriffith$elm_ui$Internal$Flag$none),
				$mdgriffith$elm_ui$Internal$Style$classes.cm,
				_List_Nil);
		case 2:
			var portion = h.a;
			return (portion === 1) ? _Utils_Tuple3(
				A2($mdgriffith$elm_ui$Internal$Flag$add, $mdgriffith$elm_ui$Internal$Flag$heightFill, $mdgriffith$elm_ui$Internal$Flag$none),
				$mdgriffith$elm_ui$Internal$Style$classes.cn,
				_List_Nil) : _Utils_Tuple3(
				A2($mdgriffith$elm_ui$Internal$Flag$add, $mdgriffith$elm_ui$Internal$Flag$heightFill, $mdgriffith$elm_ui$Internal$Flag$none),
				$mdgriffith$elm_ui$Internal$Style$classes.dD + (' height-fill-' + $elm$core$String$fromInt(portion)),
				_List_fromArray(
					[
						A3(
						$mdgriffith$elm_ui$Internal$Model$Single,
						$mdgriffith$elm_ui$Internal$Style$classes.eY + ('.' + ($mdgriffith$elm_ui$Internal$Style$classes.al + (' > ' + $mdgriffith$elm_ui$Internal$Style$dot(
							'height-fill-' + $elm$core$String$fromInt(portion))))),
						'flex-grow',
						$elm$core$String$fromInt(portion * 100000))
					]));
		case 3:
			var minSize = h.a;
			var len = h.b;
			var cls = 'min-height-' + $elm$core$String$fromInt(minSize);
			var style = A3(
				$mdgriffith$elm_ui$Internal$Model$Single,
				cls,
				'min-height',
				$elm$core$String$fromInt(minSize) + 'px !important');
			var _v1 = $mdgriffith$elm_ui$Internal$Model$renderHeight(len);
			var newFlag = _v1.a;
			var newAttrs = _v1.b;
			var newStyle = _v1.c;
			return _Utils_Tuple3(
				A2($mdgriffith$elm_ui$Internal$Flag$add, $mdgriffith$elm_ui$Internal$Flag$heightBetween, newFlag),
				cls + (' ' + newAttrs),
				A2($elm$core$List$cons, style, newStyle));
		default:
			var maxSize = h.a;
			var len = h.b;
			var cls = 'max-height-' + $elm$core$String$fromInt(maxSize);
			var style = A3(
				$mdgriffith$elm_ui$Internal$Model$Single,
				cls,
				'max-height',
				$elm$core$String$fromInt(maxSize) + 'px');
			var _v2 = $mdgriffith$elm_ui$Internal$Model$renderHeight(len);
			var newFlag = _v2.a;
			var newAttrs = _v2.b;
			var newStyle = _v2.c;
			return _Utils_Tuple3(
				A2($mdgriffith$elm_ui$Internal$Flag$add, $mdgriffith$elm_ui$Internal$Flag$heightBetween, newFlag),
				cls + (' ' + newAttrs),
				A2($elm$core$List$cons, style, newStyle));
	}
};
var $mdgriffith$elm_ui$Internal$Flag$widthContent = $mdgriffith$elm_ui$Internal$Flag$flag(38);
var $mdgriffith$elm_ui$Internal$Model$renderWidth = function (w) {
	switch (w.$) {
		case 0:
			var px = w.a;
			return _Utils_Tuple3(
				$mdgriffith$elm_ui$Internal$Flag$none,
				$mdgriffith$elm_ui$Internal$Style$classes.eG + (' width-px-' + $elm$core$String$fromInt(px)),
				_List_fromArray(
					[
						A3(
						$mdgriffith$elm_ui$Internal$Model$Single,
						'width-px-' + $elm$core$String$fromInt(px),
						'width',
						$elm$core$String$fromInt(px) + 'px')
					]));
		case 1:
			return _Utils_Tuple3(
				A2($mdgriffith$elm_ui$Internal$Flag$add, $mdgriffith$elm_ui$Internal$Flag$widthContent, $mdgriffith$elm_ui$Internal$Flag$none),
				$mdgriffith$elm_ui$Internal$Style$classes.c9,
				_List_Nil);
		case 2:
			var portion = w.a;
			return (portion === 1) ? _Utils_Tuple3(
				A2($mdgriffith$elm_ui$Internal$Flag$add, $mdgriffith$elm_ui$Internal$Flag$widthFill, $mdgriffith$elm_ui$Internal$Flag$none),
				$mdgriffith$elm_ui$Internal$Style$classes.da,
				_List_Nil) : _Utils_Tuple3(
				A2($mdgriffith$elm_ui$Internal$Flag$add, $mdgriffith$elm_ui$Internal$Flag$widthFill, $mdgriffith$elm_ui$Internal$Flag$none),
				$mdgriffith$elm_ui$Internal$Style$classes.eH + (' width-fill-' + $elm$core$String$fromInt(portion)),
				_List_fromArray(
					[
						A3(
						$mdgriffith$elm_ui$Internal$Model$Single,
						$mdgriffith$elm_ui$Internal$Style$classes.eY + ('.' + ($mdgriffith$elm_ui$Internal$Style$classes.eh + (' > ' + $mdgriffith$elm_ui$Internal$Style$dot(
							'width-fill-' + $elm$core$String$fromInt(portion))))),
						'flex-grow',
						$elm$core$String$fromInt(portion * 100000))
					]));
		case 3:
			var minSize = w.a;
			var len = w.b;
			var cls = 'min-width-' + $elm$core$String$fromInt(minSize);
			var style = A3(
				$mdgriffith$elm_ui$Internal$Model$Single,
				cls,
				'min-width',
				$elm$core$String$fromInt(minSize) + 'px');
			var _v1 = $mdgriffith$elm_ui$Internal$Model$renderWidth(len);
			var newFlag = _v1.a;
			var newAttrs = _v1.b;
			var newStyle = _v1.c;
			return _Utils_Tuple3(
				A2($mdgriffith$elm_ui$Internal$Flag$add, $mdgriffith$elm_ui$Internal$Flag$widthBetween, newFlag),
				cls + (' ' + newAttrs),
				A2($elm$core$List$cons, style, newStyle));
		default:
			var maxSize = w.a;
			var len = w.b;
			var cls = 'max-width-' + $elm$core$String$fromInt(maxSize);
			var style = A3(
				$mdgriffith$elm_ui$Internal$Model$Single,
				cls,
				'max-width',
				$elm$core$String$fromInt(maxSize) + 'px');
			var _v2 = $mdgriffith$elm_ui$Internal$Model$renderWidth(len);
			var newFlag = _v2.a;
			var newAttrs = _v2.b;
			var newStyle = _v2.c;
			return _Utils_Tuple3(
				A2($mdgriffith$elm_ui$Internal$Flag$add, $mdgriffith$elm_ui$Internal$Flag$widthBetween, newFlag),
				cls + (' ' + newAttrs),
				A2($elm$core$List$cons, style, newStyle));
	}
};
var $mdgriffith$elm_ui$Internal$Flag$borderWidth = $mdgriffith$elm_ui$Internal$Flag$flag(27);
var $mdgriffith$elm_ui$Internal$Model$skippable = F2(
	function (flag, style) {
		if (_Utils_eq(flag, $mdgriffith$elm_ui$Internal$Flag$borderWidth)) {
			if (style.$ === 3) {
				var val = style.c;
				switch (val) {
					case '0px':
						return true;
					case '1px':
						return true;
					case '2px':
						return true;
					case '3px':
						return true;
					case '4px':
						return true;
					case '5px':
						return true;
					case '6px':
						return true;
					default:
						return false;
				}
			} else {
				return false;
			}
		} else {
			switch (style.$) {
				case 2:
					var i = style.a;
					return (i >= 8) && (i <= 32);
				case 7:
					var name = style.a;
					var t = style.b;
					var r = style.c;
					var b = style.d;
					var l = style.e;
					return _Utils_eq(t, b) && (_Utils_eq(t, r) && (_Utils_eq(t, l) && ((t >= 0) && (t <= 24))));
				default:
					return false;
			}
		}
	});
var $mdgriffith$elm_ui$Internal$Flag$width = $mdgriffith$elm_ui$Internal$Flag$flag(6);
var $mdgriffith$elm_ui$Internal$Flag$xAlign = $mdgriffith$elm_ui$Internal$Flag$flag(30);
var $mdgriffith$elm_ui$Internal$Flag$yAlign = $mdgriffith$elm_ui$Internal$Flag$flag(29);
var $mdgriffith$elm_ui$Internal$Model$gatherAttrRecursive = F8(
	function (classes, node, has, transform, styles, attrs, children, elementAttrs) {
		gatherAttrRecursive:
		while (true) {
			if (!elementAttrs.b) {
				var _v1 = $mdgriffith$elm_ui$Internal$Model$transformClass(transform);
				if (_v1.$ === 1) {
					return {
						ah: A2(
							$elm$core$List$cons,
							$elm$html$Html$Attributes$class(classes),
							attrs),
						aD: children,
						aI: has,
						aK: node,
						gY: styles
					};
				} else {
					var _class = _v1.a;
					return {
						ah: A2(
							$elm$core$List$cons,
							$elm$html$Html$Attributes$class(classes + (' ' + _class)),
							attrs),
						aD: children,
						aI: has,
						aK: node,
						gY: A2(
							$elm$core$List$cons,
							$mdgriffith$elm_ui$Internal$Model$Transform(transform),
							styles)
					};
				}
			} else {
				var attribute = elementAttrs.a;
				var remaining = elementAttrs.b;
				switch (attribute.$) {
					case 0:
						var $temp$classes = classes,
							$temp$node = node,
							$temp$has = has,
							$temp$transform = transform,
							$temp$styles = styles,
							$temp$attrs = attrs,
							$temp$children = children,
							$temp$elementAttrs = remaining;
						classes = $temp$classes;
						node = $temp$node;
						has = $temp$has;
						transform = $temp$transform;
						styles = $temp$styles;
						attrs = $temp$attrs;
						children = $temp$children;
						elementAttrs = $temp$elementAttrs;
						continue gatherAttrRecursive;
					case 3:
						var flag = attribute.a;
						var exactClassName = attribute.b;
						if (A2($mdgriffith$elm_ui$Internal$Flag$present, flag, has)) {
							var $temp$classes = classes,
								$temp$node = node,
								$temp$has = has,
								$temp$transform = transform,
								$temp$styles = styles,
								$temp$attrs = attrs,
								$temp$children = children,
								$temp$elementAttrs = remaining;
							classes = $temp$classes;
							node = $temp$node;
							has = $temp$has;
							transform = $temp$transform;
							styles = $temp$styles;
							attrs = $temp$attrs;
							children = $temp$children;
							elementAttrs = $temp$elementAttrs;
							continue gatherAttrRecursive;
						} else {
							var $temp$classes = exactClassName + (' ' + classes),
								$temp$node = node,
								$temp$has = A2($mdgriffith$elm_ui$Internal$Flag$add, flag, has),
								$temp$transform = transform,
								$temp$styles = styles,
								$temp$attrs = attrs,
								$temp$children = children,
								$temp$elementAttrs = remaining;
							classes = $temp$classes;
							node = $temp$node;
							has = $temp$has;
							transform = $temp$transform;
							styles = $temp$styles;
							attrs = $temp$attrs;
							children = $temp$children;
							elementAttrs = $temp$elementAttrs;
							continue gatherAttrRecursive;
						}
					case 1:
						var actualAttribute = attribute.a;
						var $temp$classes = classes,
							$temp$node = node,
							$temp$has = has,
							$temp$transform = transform,
							$temp$styles = styles,
							$temp$attrs = A2($elm$core$List$cons, actualAttribute, attrs),
							$temp$children = children,
							$temp$elementAttrs = remaining;
						classes = $temp$classes;
						node = $temp$node;
						has = $temp$has;
						transform = $temp$transform;
						styles = $temp$styles;
						attrs = $temp$attrs;
						children = $temp$children;
						elementAttrs = $temp$elementAttrs;
						continue gatherAttrRecursive;
					case 4:
						var flag = attribute.a;
						var style = attribute.b;
						if (A2($mdgriffith$elm_ui$Internal$Flag$present, flag, has)) {
							var $temp$classes = classes,
								$temp$node = node,
								$temp$has = has,
								$temp$transform = transform,
								$temp$styles = styles,
								$temp$attrs = attrs,
								$temp$children = children,
								$temp$elementAttrs = remaining;
							classes = $temp$classes;
							node = $temp$node;
							has = $temp$has;
							transform = $temp$transform;
							styles = $temp$styles;
							attrs = $temp$attrs;
							children = $temp$children;
							elementAttrs = $temp$elementAttrs;
							continue gatherAttrRecursive;
						} else {
							if (A2($mdgriffith$elm_ui$Internal$Model$skippable, flag, style)) {
								var $temp$classes = $mdgriffith$elm_ui$Internal$Model$getStyleName(style) + (' ' + classes),
									$temp$node = node,
									$temp$has = A2($mdgriffith$elm_ui$Internal$Flag$add, flag, has),
									$temp$transform = transform,
									$temp$styles = styles,
									$temp$attrs = attrs,
									$temp$children = children,
									$temp$elementAttrs = remaining;
								classes = $temp$classes;
								node = $temp$node;
								has = $temp$has;
								transform = $temp$transform;
								styles = $temp$styles;
								attrs = $temp$attrs;
								children = $temp$children;
								elementAttrs = $temp$elementAttrs;
								continue gatherAttrRecursive;
							} else {
								var $temp$classes = $mdgriffith$elm_ui$Internal$Model$getStyleName(style) + (' ' + classes),
									$temp$node = node,
									$temp$has = A2($mdgriffith$elm_ui$Internal$Flag$add, flag, has),
									$temp$transform = transform,
									$temp$styles = A2($elm$core$List$cons, style, styles),
									$temp$attrs = attrs,
									$temp$children = children,
									$temp$elementAttrs = remaining;
								classes = $temp$classes;
								node = $temp$node;
								has = $temp$has;
								transform = $temp$transform;
								styles = $temp$styles;
								attrs = $temp$attrs;
								children = $temp$children;
								elementAttrs = $temp$elementAttrs;
								continue gatherAttrRecursive;
							}
						}
					case 10:
						var flag = attribute.a;
						var component = attribute.b;
						var $temp$classes = classes,
							$temp$node = node,
							$temp$has = A2($mdgriffith$elm_ui$Internal$Flag$add, flag, has),
							$temp$transform = A2($mdgriffith$elm_ui$Internal$Model$composeTransformation, transform, component),
							$temp$styles = styles,
							$temp$attrs = attrs,
							$temp$children = children,
							$temp$elementAttrs = remaining;
						classes = $temp$classes;
						node = $temp$node;
						has = $temp$has;
						transform = $temp$transform;
						styles = $temp$styles;
						attrs = $temp$attrs;
						children = $temp$children;
						elementAttrs = $temp$elementAttrs;
						continue gatherAttrRecursive;
					case 7:
						var width = attribute.a;
						if (A2($mdgriffith$elm_ui$Internal$Flag$present, $mdgriffith$elm_ui$Internal$Flag$width, has)) {
							var $temp$classes = classes,
								$temp$node = node,
								$temp$has = has,
								$temp$transform = transform,
								$temp$styles = styles,
								$temp$attrs = attrs,
								$temp$children = children,
								$temp$elementAttrs = remaining;
							classes = $temp$classes;
							node = $temp$node;
							has = $temp$has;
							transform = $temp$transform;
							styles = $temp$styles;
							attrs = $temp$attrs;
							children = $temp$children;
							elementAttrs = $temp$elementAttrs;
							continue gatherAttrRecursive;
						} else {
							switch (width.$) {
								case 0:
									var px = width.a;
									var $temp$classes = ($mdgriffith$elm_ui$Internal$Style$classes.eG + (' width-px-' + $elm$core$String$fromInt(px))) + (' ' + classes),
										$temp$node = node,
										$temp$has = A2($mdgriffith$elm_ui$Internal$Flag$add, $mdgriffith$elm_ui$Internal$Flag$width, has),
										$temp$transform = transform,
										$temp$styles = A2(
										$elm$core$List$cons,
										A3(
											$mdgriffith$elm_ui$Internal$Model$Single,
											'width-px-' + $elm$core$String$fromInt(px),
											'width',
											$elm$core$String$fromInt(px) + 'px'),
										styles),
										$temp$attrs = attrs,
										$temp$children = children,
										$temp$elementAttrs = remaining;
									classes = $temp$classes;
									node = $temp$node;
									has = $temp$has;
									transform = $temp$transform;
									styles = $temp$styles;
									attrs = $temp$attrs;
									children = $temp$children;
									elementAttrs = $temp$elementAttrs;
									continue gatherAttrRecursive;
								case 1:
									var $temp$classes = classes + (' ' + $mdgriffith$elm_ui$Internal$Style$classes.c9),
										$temp$node = node,
										$temp$has = A2(
										$mdgriffith$elm_ui$Internal$Flag$add,
										$mdgriffith$elm_ui$Internal$Flag$widthContent,
										A2($mdgriffith$elm_ui$Internal$Flag$add, $mdgriffith$elm_ui$Internal$Flag$width, has)),
										$temp$transform = transform,
										$temp$styles = styles,
										$temp$attrs = attrs,
										$temp$children = children,
										$temp$elementAttrs = remaining;
									classes = $temp$classes;
									node = $temp$node;
									has = $temp$has;
									transform = $temp$transform;
									styles = $temp$styles;
									attrs = $temp$attrs;
									children = $temp$children;
									elementAttrs = $temp$elementAttrs;
									continue gatherAttrRecursive;
								case 2:
									var portion = width.a;
									if (portion === 1) {
										var $temp$classes = classes + (' ' + $mdgriffith$elm_ui$Internal$Style$classes.da),
											$temp$node = node,
											$temp$has = A2(
											$mdgriffith$elm_ui$Internal$Flag$add,
											$mdgriffith$elm_ui$Internal$Flag$widthFill,
											A2($mdgriffith$elm_ui$Internal$Flag$add, $mdgriffith$elm_ui$Internal$Flag$width, has)),
											$temp$transform = transform,
											$temp$styles = styles,
											$temp$attrs = attrs,
											$temp$children = children,
											$temp$elementAttrs = remaining;
										classes = $temp$classes;
										node = $temp$node;
										has = $temp$has;
										transform = $temp$transform;
										styles = $temp$styles;
										attrs = $temp$attrs;
										children = $temp$children;
										elementAttrs = $temp$elementAttrs;
										continue gatherAttrRecursive;
									} else {
										var $temp$classes = classes + (' ' + ($mdgriffith$elm_ui$Internal$Style$classes.eH + (' width-fill-' + $elm$core$String$fromInt(portion)))),
											$temp$node = node,
											$temp$has = A2(
											$mdgriffith$elm_ui$Internal$Flag$add,
											$mdgriffith$elm_ui$Internal$Flag$widthFill,
											A2($mdgriffith$elm_ui$Internal$Flag$add, $mdgriffith$elm_ui$Internal$Flag$width, has)),
											$temp$transform = transform,
											$temp$styles = A2(
											$elm$core$List$cons,
											A3(
												$mdgriffith$elm_ui$Internal$Model$Single,
												$mdgriffith$elm_ui$Internal$Style$classes.eY + ('.' + ($mdgriffith$elm_ui$Internal$Style$classes.eh + (' > ' + $mdgriffith$elm_ui$Internal$Style$dot(
													'width-fill-' + $elm$core$String$fromInt(portion))))),
												'flex-grow',
												$elm$core$String$fromInt(portion * 100000)),
											styles),
											$temp$attrs = attrs,
											$temp$children = children,
											$temp$elementAttrs = remaining;
										classes = $temp$classes;
										node = $temp$node;
										has = $temp$has;
										transform = $temp$transform;
										styles = $temp$styles;
										attrs = $temp$attrs;
										children = $temp$children;
										elementAttrs = $temp$elementAttrs;
										continue gatherAttrRecursive;
									}
								default:
									var _v4 = $mdgriffith$elm_ui$Internal$Model$renderWidth(width);
									var addToFlags = _v4.a;
									var newClass = _v4.b;
									var newStyles = _v4.c;
									var $temp$classes = classes + (' ' + newClass),
										$temp$node = node,
										$temp$has = A2(
										$mdgriffith$elm_ui$Internal$Flag$merge,
										addToFlags,
										A2($mdgriffith$elm_ui$Internal$Flag$add, $mdgriffith$elm_ui$Internal$Flag$width, has)),
										$temp$transform = transform,
										$temp$styles = _Utils_ap(newStyles, styles),
										$temp$attrs = attrs,
										$temp$children = children,
										$temp$elementAttrs = remaining;
									classes = $temp$classes;
									node = $temp$node;
									has = $temp$has;
									transform = $temp$transform;
									styles = $temp$styles;
									attrs = $temp$attrs;
									children = $temp$children;
									elementAttrs = $temp$elementAttrs;
									continue gatherAttrRecursive;
							}
						}
					case 8:
						var height = attribute.a;
						if (A2($mdgriffith$elm_ui$Internal$Flag$present, $mdgriffith$elm_ui$Internal$Flag$height, has)) {
							var $temp$classes = classes,
								$temp$node = node,
								$temp$has = has,
								$temp$transform = transform,
								$temp$styles = styles,
								$temp$attrs = attrs,
								$temp$children = children,
								$temp$elementAttrs = remaining;
							classes = $temp$classes;
							node = $temp$node;
							has = $temp$has;
							transform = $temp$transform;
							styles = $temp$styles;
							attrs = $temp$attrs;
							children = $temp$children;
							elementAttrs = $temp$elementAttrs;
							continue gatherAttrRecursive;
						} else {
							switch (height.$) {
								case 0:
									var px = height.a;
									var val = $elm$core$String$fromInt(px) + 'px';
									var name = 'height-px-' + val;
									var $temp$classes = $mdgriffith$elm_ui$Internal$Style$classes.dC + (' ' + (name + (' ' + classes))),
										$temp$node = node,
										$temp$has = A2($mdgriffith$elm_ui$Internal$Flag$add, $mdgriffith$elm_ui$Internal$Flag$height, has),
										$temp$transform = transform,
										$temp$styles = A2(
										$elm$core$List$cons,
										A3($mdgriffith$elm_ui$Internal$Model$Single, name, 'height ', val),
										styles),
										$temp$attrs = attrs,
										$temp$children = children,
										$temp$elementAttrs = remaining;
									classes = $temp$classes;
									node = $temp$node;
									has = $temp$has;
									transform = $temp$transform;
									styles = $temp$styles;
									attrs = $temp$attrs;
									children = $temp$children;
									elementAttrs = $temp$elementAttrs;
									continue gatherAttrRecursive;
								case 1:
									var $temp$classes = $mdgriffith$elm_ui$Internal$Style$classes.cm + (' ' + classes),
										$temp$node = node,
										$temp$has = A2(
										$mdgriffith$elm_ui$Internal$Flag$add,
										$mdgriffith$elm_ui$Internal$Flag$heightContent,
										A2($mdgriffith$elm_ui$Internal$Flag$add, $mdgriffith$elm_ui$Internal$Flag$height, has)),
										$temp$transform = transform,
										$temp$styles = styles,
										$temp$attrs = attrs,
										$temp$children = children,
										$temp$elementAttrs = remaining;
									classes = $temp$classes;
									node = $temp$node;
									has = $temp$has;
									transform = $temp$transform;
									styles = $temp$styles;
									attrs = $temp$attrs;
									children = $temp$children;
									elementAttrs = $temp$elementAttrs;
									continue gatherAttrRecursive;
								case 2:
									var portion = height.a;
									if (portion === 1) {
										var $temp$classes = $mdgriffith$elm_ui$Internal$Style$classes.cn + (' ' + classes),
											$temp$node = node,
											$temp$has = A2(
											$mdgriffith$elm_ui$Internal$Flag$add,
											$mdgriffith$elm_ui$Internal$Flag$heightFill,
											A2($mdgriffith$elm_ui$Internal$Flag$add, $mdgriffith$elm_ui$Internal$Flag$height, has)),
											$temp$transform = transform,
											$temp$styles = styles,
											$temp$attrs = attrs,
											$temp$children = children,
											$temp$elementAttrs = remaining;
										classes = $temp$classes;
										node = $temp$node;
										has = $temp$has;
										transform = $temp$transform;
										styles = $temp$styles;
										attrs = $temp$attrs;
										children = $temp$children;
										elementAttrs = $temp$elementAttrs;
										continue gatherAttrRecursive;
									} else {
										var $temp$classes = classes + (' ' + ($mdgriffith$elm_ui$Internal$Style$classes.dD + (' height-fill-' + $elm$core$String$fromInt(portion)))),
											$temp$node = node,
											$temp$has = A2(
											$mdgriffith$elm_ui$Internal$Flag$add,
											$mdgriffith$elm_ui$Internal$Flag$heightFill,
											A2($mdgriffith$elm_ui$Internal$Flag$add, $mdgriffith$elm_ui$Internal$Flag$height, has)),
											$temp$transform = transform,
											$temp$styles = A2(
											$elm$core$List$cons,
											A3(
												$mdgriffith$elm_ui$Internal$Model$Single,
												$mdgriffith$elm_ui$Internal$Style$classes.eY + ('.' + ($mdgriffith$elm_ui$Internal$Style$classes.al + (' > ' + $mdgriffith$elm_ui$Internal$Style$dot(
													'height-fill-' + $elm$core$String$fromInt(portion))))),
												'flex-grow',
												$elm$core$String$fromInt(portion * 100000)),
											styles),
											$temp$attrs = attrs,
											$temp$children = children,
											$temp$elementAttrs = remaining;
										classes = $temp$classes;
										node = $temp$node;
										has = $temp$has;
										transform = $temp$transform;
										styles = $temp$styles;
										attrs = $temp$attrs;
										children = $temp$children;
										elementAttrs = $temp$elementAttrs;
										continue gatherAttrRecursive;
									}
								default:
									var _v6 = $mdgriffith$elm_ui$Internal$Model$renderHeight(height);
									var addToFlags = _v6.a;
									var newClass = _v6.b;
									var newStyles = _v6.c;
									var $temp$classes = classes + (' ' + newClass),
										$temp$node = node,
										$temp$has = A2(
										$mdgriffith$elm_ui$Internal$Flag$merge,
										addToFlags,
										A2($mdgriffith$elm_ui$Internal$Flag$add, $mdgriffith$elm_ui$Internal$Flag$height, has)),
										$temp$transform = transform,
										$temp$styles = _Utils_ap(newStyles, styles),
										$temp$attrs = attrs,
										$temp$children = children,
										$temp$elementAttrs = remaining;
									classes = $temp$classes;
									node = $temp$node;
									has = $temp$has;
									transform = $temp$transform;
									styles = $temp$styles;
									attrs = $temp$attrs;
									children = $temp$children;
									elementAttrs = $temp$elementAttrs;
									continue gatherAttrRecursive;
							}
						}
					case 2:
						var description = attribute.a;
						switch (description.$) {
							case 0:
								var $temp$classes = classes,
									$temp$node = A2($mdgriffith$elm_ui$Internal$Model$addNodeName, 'main', node),
									$temp$has = has,
									$temp$transform = transform,
									$temp$styles = styles,
									$temp$attrs = attrs,
									$temp$children = children,
									$temp$elementAttrs = remaining;
								classes = $temp$classes;
								node = $temp$node;
								has = $temp$has;
								transform = $temp$transform;
								styles = $temp$styles;
								attrs = $temp$attrs;
								children = $temp$children;
								elementAttrs = $temp$elementAttrs;
								continue gatherAttrRecursive;
							case 1:
								var $temp$classes = classes,
									$temp$node = A2($mdgriffith$elm_ui$Internal$Model$addNodeName, 'nav', node),
									$temp$has = has,
									$temp$transform = transform,
									$temp$styles = styles,
									$temp$attrs = attrs,
									$temp$children = children,
									$temp$elementAttrs = remaining;
								classes = $temp$classes;
								node = $temp$node;
								has = $temp$has;
								transform = $temp$transform;
								styles = $temp$styles;
								attrs = $temp$attrs;
								children = $temp$children;
								elementAttrs = $temp$elementAttrs;
								continue gatherAttrRecursive;
							case 2:
								var $temp$classes = classes,
									$temp$node = A2($mdgriffith$elm_ui$Internal$Model$addNodeName, 'footer', node),
									$temp$has = has,
									$temp$transform = transform,
									$temp$styles = styles,
									$temp$attrs = attrs,
									$temp$children = children,
									$temp$elementAttrs = remaining;
								classes = $temp$classes;
								node = $temp$node;
								has = $temp$has;
								transform = $temp$transform;
								styles = $temp$styles;
								attrs = $temp$attrs;
								children = $temp$children;
								elementAttrs = $temp$elementAttrs;
								continue gatherAttrRecursive;
							case 3:
								var $temp$classes = classes,
									$temp$node = A2($mdgriffith$elm_ui$Internal$Model$addNodeName, 'aside', node),
									$temp$has = has,
									$temp$transform = transform,
									$temp$styles = styles,
									$temp$attrs = attrs,
									$temp$children = children,
									$temp$elementAttrs = remaining;
								classes = $temp$classes;
								node = $temp$node;
								has = $temp$has;
								transform = $temp$transform;
								styles = $temp$styles;
								attrs = $temp$attrs;
								children = $temp$children;
								elementAttrs = $temp$elementAttrs;
								continue gatherAttrRecursive;
							case 4:
								var i = description.a;
								if (i <= 1) {
									var $temp$classes = classes,
										$temp$node = A2($mdgriffith$elm_ui$Internal$Model$addNodeName, 'h1', node),
										$temp$has = has,
										$temp$transform = transform,
										$temp$styles = styles,
										$temp$attrs = attrs,
										$temp$children = children,
										$temp$elementAttrs = remaining;
									classes = $temp$classes;
									node = $temp$node;
									has = $temp$has;
									transform = $temp$transform;
									styles = $temp$styles;
									attrs = $temp$attrs;
									children = $temp$children;
									elementAttrs = $temp$elementAttrs;
									continue gatherAttrRecursive;
								} else {
									if (i < 7) {
										var $temp$classes = classes,
											$temp$node = A2(
											$mdgriffith$elm_ui$Internal$Model$addNodeName,
											'h' + $elm$core$String$fromInt(i),
											node),
											$temp$has = has,
											$temp$transform = transform,
											$temp$styles = styles,
											$temp$attrs = attrs,
											$temp$children = children,
											$temp$elementAttrs = remaining;
										classes = $temp$classes;
										node = $temp$node;
										has = $temp$has;
										transform = $temp$transform;
										styles = $temp$styles;
										attrs = $temp$attrs;
										children = $temp$children;
										elementAttrs = $temp$elementAttrs;
										continue gatherAttrRecursive;
									} else {
										var $temp$classes = classes,
											$temp$node = A2($mdgriffith$elm_ui$Internal$Model$addNodeName, 'h6', node),
											$temp$has = has,
											$temp$transform = transform,
											$temp$styles = styles,
											$temp$attrs = attrs,
											$temp$children = children,
											$temp$elementAttrs = remaining;
										classes = $temp$classes;
										node = $temp$node;
										has = $temp$has;
										transform = $temp$transform;
										styles = $temp$styles;
										attrs = $temp$attrs;
										children = $temp$children;
										elementAttrs = $temp$elementAttrs;
										continue gatherAttrRecursive;
									}
								}
							case 9:
								var $temp$classes = classes,
									$temp$node = node,
									$temp$has = has,
									$temp$transform = transform,
									$temp$styles = styles,
									$temp$attrs = attrs,
									$temp$children = children,
									$temp$elementAttrs = remaining;
								classes = $temp$classes;
								node = $temp$node;
								has = $temp$has;
								transform = $temp$transform;
								styles = $temp$styles;
								attrs = $temp$attrs;
								children = $temp$children;
								elementAttrs = $temp$elementAttrs;
								continue gatherAttrRecursive;
							case 8:
								var $temp$classes = classes,
									$temp$node = node,
									$temp$has = has,
									$temp$transform = transform,
									$temp$styles = styles,
									$temp$attrs = A2(
									$elm$core$List$cons,
									A2($elm$virtual_dom$VirtualDom$attribute, 'role', 'button'),
									attrs),
									$temp$children = children,
									$temp$elementAttrs = remaining;
								classes = $temp$classes;
								node = $temp$node;
								has = $temp$has;
								transform = $temp$transform;
								styles = $temp$styles;
								attrs = $temp$attrs;
								children = $temp$children;
								elementAttrs = $temp$elementAttrs;
								continue gatherAttrRecursive;
							case 5:
								var label = description.a;
								var $temp$classes = classes,
									$temp$node = node,
									$temp$has = has,
									$temp$transform = transform,
									$temp$styles = styles,
									$temp$attrs = A2(
									$elm$core$List$cons,
									A2($elm$virtual_dom$VirtualDom$attribute, 'aria-label', label),
									attrs),
									$temp$children = children,
									$temp$elementAttrs = remaining;
								classes = $temp$classes;
								node = $temp$node;
								has = $temp$has;
								transform = $temp$transform;
								styles = $temp$styles;
								attrs = $temp$attrs;
								children = $temp$children;
								elementAttrs = $temp$elementAttrs;
								continue gatherAttrRecursive;
							case 6:
								var $temp$classes = classes,
									$temp$node = node,
									$temp$has = has,
									$temp$transform = transform,
									$temp$styles = styles,
									$temp$attrs = A2(
									$elm$core$List$cons,
									A2($elm$virtual_dom$VirtualDom$attribute, 'aria-live', 'polite'),
									attrs),
									$temp$children = children,
									$temp$elementAttrs = remaining;
								classes = $temp$classes;
								node = $temp$node;
								has = $temp$has;
								transform = $temp$transform;
								styles = $temp$styles;
								attrs = $temp$attrs;
								children = $temp$children;
								elementAttrs = $temp$elementAttrs;
								continue gatherAttrRecursive;
							default:
								var $temp$classes = classes,
									$temp$node = node,
									$temp$has = has,
									$temp$transform = transform,
									$temp$styles = styles,
									$temp$attrs = A2(
									$elm$core$List$cons,
									A2($elm$virtual_dom$VirtualDom$attribute, 'aria-live', 'assertive'),
									attrs),
									$temp$children = children,
									$temp$elementAttrs = remaining;
								classes = $temp$classes;
								node = $temp$node;
								has = $temp$has;
								transform = $temp$transform;
								styles = $temp$styles;
								attrs = $temp$attrs;
								children = $temp$children;
								elementAttrs = $temp$elementAttrs;
								continue gatherAttrRecursive;
						}
					case 9:
						var location = attribute.a;
						var elem = attribute.b;
						var newStyles = function () {
							switch (elem.$) {
								case 3:
									return styles;
								case 2:
									var str = elem.a;
									return styles;
								case 0:
									var html = elem.a;
									return styles;
								default:
									var styled = elem.a;
									return _Utils_ap(styles, styled.gY);
							}
						}();
						var $temp$classes = classes,
							$temp$node = node,
							$temp$has = has,
							$temp$transform = transform,
							$temp$styles = newStyles,
							$temp$attrs = attrs,
							$temp$children = A3($mdgriffith$elm_ui$Internal$Model$addNearbyElement, location, elem, children),
							$temp$elementAttrs = remaining;
						classes = $temp$classes;
						node = $temp$node;
						has = $temp$has;
						transform = $temp$transform;
						styles = $temp$styles;
						attrs = $temp$attrs;
						children = $temp$children;
						elementAttrs = $temp$elementAttrs;
						continue gatherAttrRecursive;
					case 6:
						var x = attribute.a;
						if (A2($mdgriffith$elm_ui$Internal$Flag$present, $mdgriffith$elm_ui$Internal$Flag$xAlign, has)) {
							var $temp$classes = classes,
								$temp$node = node,
								$temp$has = has,
								$temp$transform = transform,
								$temp$styles = styles,
								$temp$attrs = attrs,
								$temp$children = children,
								$temp$elementAttrs = remaining;
							classes = $temp$classes;
							node = $temp$node;
							has = $temp$has;
							transform = $temp$transform;
							styles = $temp$styles;
							attrs = $temp$attrs;
							children = $temp$children;
							elementAttrs = $temp$elementAttrs;
							continue gatherAttrRecursive;
						} else {
							var $temp$classes = $mdgriffith$elm_ui$Internal$Model$alignXName(x) + (' ' + classes),
								$temp$node = node,
								$temp$has = function (flags) {
								switch (x) {
									case 1:
										return A2($mdgriffith$elm_ui$Internal$Flag$add, $mdgriffith$elm_ui$Internal$Flag$centerX, flags);
									case 2:
										return A2($mdgriffith$elm_ui$Internal$Flag$add, $mdgriffith$elm_ui$Internal$Flag$alignRight, flags);
									default:
										return flags;
								}
							}(
								A2($mdgriffith$elm_ui$Internal$Flag$add, $mdgriffith$elm_ui$Internal$Flag$xAlign, has)),
								$temp$transform = transform,
								$temp$styles = styles,
								$temp$attrs = attrs,
								$temp$children = children,
								$temp$elementAttrs = remaining;
							classes = $temp$classes;
							node = $temp$node;
							has = $temp$has;
							transform = $temp$transform;
							styles = $temp$styles;
							attrs = $temp$attrs;
							children = $temp$children;
							elementAttrs = $temp$elementAttrs;
							continue gatherAttrRecursive;
						}
					default:
						var y = attribute.a;
						if (A2($mdgriffith$elm_ui$Internal$Flag$present, $mdgriffith$elm_ui$Internal$Flag$yAlign, has)) {
							var $temp$classes = classes,
								$temp$node = node,
								$temp$has = has,
								$temp$transform = transform,
								$temp$styles = styles,
								$temp$attrs = attrs,
								$temp$children = children,
								$temp$elementAttrs = remaining;
							classes = $temp$classes;
							node = $temp$node;
							has = $temp$has;
							transform = $temp$transform;
							styles = $temp$styles;
							attrs = $temp$attrs;
							children = $temp$children;
							elementAttrs = $temp$elementAttrs;
							continue gatherAttrRecursive;
						} else {
							var $temp$classes = $mdgriffith$elm_ui$Internal$Model$alignYName(y) + (' ' + classes),
								$temp$node = node,
								$temp$has = function (flags) {
								switch (y) {
									case 1:
										return A2($mdgriffith$elm_ui$Internal$Flag$add, $mdgriffith$elm_ui$Internal$Flag$centerY, flags);
									case 2:
										return A2($mdgriffith$elm_ui$Internal$Flag$add, $mdgriffith$elm_ui$Internal$Flag$alignBottom, flags);
									default:
										return flags;
								}
							}(
								A2($mdgriffith$elm_ui$Internal$Flag$add, $mdgriffith$elm_ui$Internal$Flag$yAlign, has)),
								$temp$transform = transform,
								$temp$styles = styles,
								$temp$attrs = attrs,
								$temp$children = children,
								$temp$elementAttrs = remaining;
							classes = $temp$classes;
							node = $temp$node;
							has = $temp$has;
							transform = $temp$transform;
							styles = $temp$styles;
							attrs = $temp$attrs;
							children = $temp$children;
							elementAttrs = $temp$elementAttrs;
							continue gatherAttrRecursive;
						}
				}
			}
		}
	});
var $mdgriffith$elm_ui$Internal$Model$Untransformed = {$: 0};
var $mdgriffith$elm_ui$Internal$Model$untransformed = $mdgriffith$elm_ui$Internal$Model$Untransformed;
var $mdgriffith$elm_ui$Internal$Model$element = F4(
	function (context, node, attributes, children) {
		return A3(
			$mdgriffith$elm_ui$Internal$Model$createElement,
			context,
			children,
			A8(
				$mdgriffith$elm_ui$Internal$Model$gatherAttrRecursive,
				$mdgriffith$elm_ui$Internal$Model$contextClasses(context),
				node,
				$mdgriffith$elm_ui$Internal$Flag$none,
				$mdgriffith$elm_ui$Internal$Model$untransformed,
				_List_Nil,
				_List_Nil,
				$mdgriffith$elm_ui$Internal$Model$NoNearbyChildren,
				$elm$core$List$reverse(attributes)));
	});
var $mdgriffith$elm_ui$Internal$Model$AllowHover = 1;
var $mdgriffith$elm_ui$Internal$Model$Layout = 0;
var $mdgriffith$elm_ui$Internal$Model$focusDefaultStyle = {
	e$: $elm$core$Maybe$Nothing,
	e7: $elm$core$Maybe$Nothing,
	gM: $elm$core$Maybe$Just(
		{
			e4: 0,
			dp: A4($mdgriffith$elm_ui$Internal$Model$Rgba, 155 / 255, 203 / 255, 1, 1),
			ge: _Utils_Tuple2(0, 0),
			ep: 3
		})
};
var $mdgriffith$elm_ui$Internal$Model$optionsToRecord = function (options) {
	var combine = F2(
		function (opt, record) {
			switch (opt.$) {
				case 0:
					var hoverable = opt.a;
					var _v4 = record.fM;
					if (_v4.$ === 1) {
						return _Utils_update(
							record,
							{
								fM: $elm$core$Maybe$Just(hoverable)
							});
					} else {
						return record;
					}
				case 1:
					var focusStyle = opt.a;
					var _v5 = record.fE;
					if (_v5.$ === 1) {
						return _Utils_update(
							record,
							{
								fE: $elm$core$Maybe$Just(focusStyle)
							});
					} else {
						return record;
					}
				default:
					var renderMode = opt.a;
					var _v6 = record.aJ;
					if (_v6.$ === 1) {
						return _Utils_update(
							record,
							{
								aJ: $elm$core$Maybe$Just(renderMode)
							});
					} else {
						return record;
					}
			}
		});
	var andFinally = function (record) {
		return {
			fE: function () {
				var _v0 = record.fE;
				if (_v0.$ === 1) {
					return $mdgriffith$elm_ui$Internal$Model$focusDefaultStyle;
				} else {
					var focusable = _v0.a;
					return focusable;
				}
			}(),
			fM: function () {
				var _v1 = record.fM;
				if (_v1.$ === 1) {
					return 1;
				} else {
					var hoverable = _v1.a;
					return hoverable;
				}
			}(),
			aJ: function () {
				var _v2 = record.aJ;
				if (_v2.$ === 1) {
					return 0;
				} else {
					var actualMode = _v2.a;
					return actualMode;
				}
			}()
		};
	};
	return andFinally(
		A3(
			$elm$core$List$foldr,
			combine,
			{fE: $elm$core$Maybe$Nothing, fM: $elm$core$Maybe$Nothing, aJ: $elm$core$Maybe$Nothing},
			options));
};
var $mdgriffith$elm_ui$Internal$Model$toHtml = F2(
	function (mode, el) {
		switch (el.$) {
			case 0:
				var html = el.a;
				return html($mdgriffith$elm_ui$Internal$Model$asEl);
			case 1:
				var styles = el.a.gY;
				var html = el.a.fN;
				return A2(
					html,
					mode(styles),
					$mdgriffith$elm_ui$Internal$Model$asEl);
			case 2:
				var text = el.a;
				return $mdgriffith$elm_ui$Internal$Model$textElement(text);
			default:
				return $mdgriffith$elm_ui$Internal$Model$textElement('');
		}
	});
var $mdgriffith$elm_ui$Internal$Model$renderRoot = F3(
	function (optionList, attributes, child) {
		var options = $mdgriffith$elm_ui$Internal$Model$optionsToRecord(optionList);
		var embedStyle = function () {
			var _v0 = options.aJ;
			if (_v0 === 1) {
				return $mdgriffith$elm_ui$Internal$Model$OnlyDynamic(options);
			} else {
				return $mdgriffith$elm_ui$Internal$Model$StaticRootAndDynamic(options);
			}
		}();
		return A2(
			$mdgriffith$elm_ui$Internal$Model$toHtml,
			embedStyle,
			A4(
				$mdgriffith$elm_ui$Internal$Model$element,
				$mdgriffith$elm_ui$Internal$Model$asEl,
				$mdgriffith$elm_ui$Internal$Model$div,
				attributes,
				$mdgriffith$elm_ui$Internal$Model$Unkeyed(
					_List_fromArray(
						[child]))));
	});
var $mdgriffith$elm_ui$Internal$Model$FontFamily = F2(
	function (a, b) {
		return {$: 1, a: a, b: b};
	});
var $mdgriffith$elm_ui$Internal$Model$FontSize = function (a) {
	return {$: 2, a: a};
};
var $mdgriffith$elm_ui$Internal$Model$SansSerif = {$: 1};
var $mdgriffith$elm_ui$Internal$Model$Typeface = function (a) {
	return {$: 3, a: a};
};
var $mdgriffith$elm_ui$Internal$Flag$fontColor = $mdgriffith$elm_ui$Internal$Flag$flag(14);
var $mdgriffith$elm_ui$Internal$Flag$fontFamily = $mdgriffith$elm_ui$Internal$Flag$flag(5);
var $mdgriffith$elm_ui$Internal$Flag$fontSize = $mdgriffith$elm_ui$Internal$Flag$flag(4);
var $elm$core$String$toLower = _String_toLower;
var $elm$core$String$words = _String_words;
var $mdgriffith$elm_ui$Internal$Model$renderFontClassName = F2(
	function (font, current) {
		return _Utils_ap(
			current,
			function () {
				switch (font.$) {
					case 0:
						return 'serif';
					case 1:
						return 'sans-serif';
					case 2:
						return 'monospace';
					case 3:
						var name = font.a;
						return A2(
							$elm$core$String$join,
							'-',
							$elm$core$String$words(
								$elm$core$String$toLower(name)));
					case 4:
						var name = font.a;
						var url = font.b;
						return A2(
							$elm$core$String$join,
							'-',
							$elm$core$String$words(
								$elm$core$String$toLower(name)));
					default:
						var name = font.a.gc;
						return A2(
							$elm$core$String$join,
							'-',
							$elm$core$String$words(
								$elm$core$String$toLower(name)));
				}
			}());
	});
var $mdgriffith$elm_ui$Internal$Model$rootStyle = function () {
	var families = _List_fromArray(
		[
			$mdgriffith$elm_ui$Internal$Model$Typeface('Open Sans'),
			$mdgriffith$elm_ui$Internal$Model$Typeface('Helvetica'),
			$mdgriffith$elm_ui$Internal$Model$Typeface('Verdana'),
			$mdgriffith$elm_ui$Internal$Model$SansSerif
		]);
	return _List_fromArray(
		[
			A2(
			$mdgriffith$elm_ui$Internal$Model$StyleClass,
			$mdgriffith$elm_ui$Internal$Flag$bgColor,
			A3(
				$mdgriffith$elm_ui$Internal$Model$Colored,
				'bg-' + $mdgriffith$elm_ui$Internal$Model$formatColorClass(
					A4($mdgriffith$elm_ui$Internal$Model$Rgba, 1, 1, 1, 0)),
				'background-color',
				A4($mdgriffith$elm_ui$Internal$Model$Rgba, 1, 1, 1, 0))),
			A2(
			$mdgriffith$elm_ui$Internal$Model$StyleClass,
			$mdgriffith$elm_ui$Internal$Flag$fontColor,
			A3(
				$mdgriffith$elm_ui$Internal$Model$Colored,
				'fc-' + $mdgriffith$elm_ui$Internal$Model$formatColorClass(
					A4($mdgriffith$elm_ui$Internal$Model$Rgba, 0, 0, 0, 1)),
				'color',
				A4($mdgriffith$elm_ui$Internal$Model$Rgba, 0, 0, 0, 1))),
			A2(
			$mdgriffith$elm_ui$Internal$Model$StyleClass,
			$mdgriffith$elm_ui$Internal$Flag$fontSize,
			$mdgriffith$elm_ui$Internal$Model$FontSize(20)),
			A2(
			$mdgriffith$elm_ui$Internal$Model$StyleClass,
			$mdgriffith$elm_ui$Internal$Flag$fontFamily,
			A2(
				$mdgriffith$elm_ui$Internal$Model$FontFamily,
				A3($elm$core$List$foldl, $mdgriffith$elm_ui$Internal$Model$renderFontClassName, 'font-', families),
				families))
		]);
}();
var $mdgriffith$elm_ui$Element$layoutWith = F3(
	function (_v0, attrs, child) {
		var options = _v0.gp;
		return A3(
			$mdgriffith$elm_ui$Internal$Model$renderRoot,
			options,
			A2(
				$elm$core$List$cons,
				$mdgriffith$elm_ui$Internal$Model$htmlClass(
					A2(
						$elm$core$String$join,
						' ',
						_List_fromArray(
							[$mdgriffith$elm_ui$Internal$Style$classes.gE, $mdgriffith$elm_ui$Internal$Style$classes.eY, $mdgriffith$elm_ui$Internal$Style$classes.gN]))),
				_Utils_ap($mdgriffith$elm_ui$Internal$Model$rootStyle, attrs)),
			child);
	});
var $mdgriffith$elm_ui$Element$layout = $mdgriffith$elm_ui$Element$layoutWith(
	{gp: _List_Nil});
var $author$project$Msg$AcceptGame = function (a) {
	return {$: 11, a: a};
};
var $author$project$Msg$EditCreateGameModal = function (a) {
	return {$: 6, a: a};
};
var $author$project$Msg$RejectGame = function (a) {
	return {$: 12, a: a};
};
var $author$project$Msg$ViewGame = function (a) {
	return {$: 4, a: a};
};
var $mdgriffith$elm_ui$Internal$Model$Right = 2;
var $mdgriffith$elm_ui$Element$alignRight = $mdgriffith$elm_ui$Internal$Model$AlignX(2);
var $author$project$Msg$ClickSquare = function (a) {
	return {$: 1, a: a};
};
var $pilatch$elm_chess$Square$a1 = $pilatch$elm_chess$Internal$Square$a1;
var $pilatch$elm_chess$SquareFile$all = $pilatch$elm_chess$Internal$SquareFile$all;
var $pilatch$elm_chess$SquareRank$all = $pilatch$elm_chess$Internal$SquareRank$all;
var $pilatch$elm_chess$Piece$blackBishop = $pilatch$elm_chess$Internal$Piece$blackBishop;
var $elm$svg$Svg$Attributes$d = _VirtualDom_attribute('d');
var $elm$svg$Svg$trustedNode = _VirtualDom_nodeNS('http://www.w3.org/2000/svg');
var $elm$svg$Svg$g = $elm$svg$Svg$trustedNode('g');
var $elm$svg$Svg$Attributes$height = _VirtualDom_attribute('height');
var $elm$svg$Svg$path = $elm$svg$Svg$trustedNode('path');
var $elm$svg$Svg$Attributes$style = _VirtualDom_attribute('style');
var $elm$svg$Svg$svg = $elm$svg$Svg$trustedNode('svg');
var $elm$svg$Svg$Attributes$transform = _VirtualDom_attribute('transform');
var $elm$svg$Svg$Attributes$version = _VirtualDom_attribute('version');
var $elm$svg$Svg$Attributes$viewBox = _VirtualDom_attribute('viewBox');
var $elm$svg$Svg$Attributes$width = _VirtualDom_attribute('width');
var $author$project$Pieces$blackBishop = A2(
	$elm$svg$Svg$svg,
	_List_fromArray(
		[
			$elm$svg$Svg$Attributes$version('1.1'),
			$elm$svg$Svg$Attributes$viewBox('0 0 45 45'),
			$elm$svg$Svg$Attributes$width('100%'),
			$elm$svg$Svg$Attributes$height('100%')
		]),
	_List_fromArray(
		[
			A2(
			$elm$svg$Svg$g,
			_List_fromArray(
				[
					$elm$svg$Svg$Attributes$style('opacity:1; fill:none; fill-rule:evenodd; fill-opacity:1; stroke:#000000; stroke-width:1.5; stroke-linecap:round; stroke-linejoin:round; stroke-miterlimit:4; stroke-dasharray:none; stroke-opacity:1;'),
					$elm$svg$Svg$Attributes$transform('translate(0,0.6)')
				]),
			_List_fromArray(
				[
					A2(
					$elm$svg$Svg$g,
					_List_fromArray(
						[
							$elm$svg$Svg$Attributes$style('fill:#000000; stroke:#000000; stroke-linecap:butt;')
						]),
					_List_fromArray(
						[
							A2(
							$elm$svg$Svg$path,
							_List_fromArray(
								[
									$elm$svg$Svg$Attributes$d('M 9,36 C 12.39,35.03 19.11,36.43 22.5,34 C 25.89,36.43 32.61,35.03 36,36 C 36,36 37.65,36.54 39,38 C 38.32,38.97 37.35,38.99 36,38.5 C 32.61,37.53 25.89,38.96 22.5,37.5 C 19.11,38.96 12.39,37.53 9,38.5 C 7.65,38.99 6.68,38.97 6,38 C 7.35,36.54 9,36 9,36 z')
								]),
							_List_Nil),
							A2(
							$elm$svg$Svg$path,
							_List_fromArray(
								[
									$elm$svg$Svg$Attributes$d('M 15,32 C 17.5,34.5 27.5,34.5 30,32 C 30.5,30.5 30,30 30,30 C 30,27.5 27.5,26 27.5,26 C 33,24.5 33.5,14.5 22.5,10.5 C 11.5,14.5 12,24.5 17.5,26 C 17.5,26 15,27.5 15,30 C 15,30 14.5,30.5 15,32 z')
								]),
							_List_Nil),
							A2(
							$elm$svg$Svg$path,
							_List_fromArray(
								[
									$elm$svg$Svg$Attributes$d('M 25 8 A 2.5 2.5 0 1 1  20,8 A 2.5 2.5 0 1 1  25 8 z')
								]),
							_List_Nil)
						])),
					A2(
					$elm$svg$Svg$path,
					_List_fromArray(
						[
							$elm$svg$Svg$Attributes$d('M 17.5,26 L 27.5,26 M 15,30 L 30,30 M 22.5,15.5 L 22.5,20.5 M 20,18 L 25,18'),
							$elm$svg$Svg$Attributes$style('fill:none; stroke:#ffffff; stroke-linejoin:miter;')
						]),
					_List_Nil)
				]))
		]));
var $author$project$Pieces$blackHorse = A2(
	$elm$svg$Svg$svg,
	_List_fromArray(
		[
			$elm$svg$Svg$Attributes$version('1.1'),
			$elm$svg$Svg$Attributes$viewBox('0 0 45 45'),
			$elm$svg$Svg$Attributes$width('100%'),
			$elm$svg$Svg$Attributes$height('100%')
		]),
	_List_fromArray(
		[
			A2(
			$elm$svg$Svg$g,
			_List_fromArray(
				[
					$elm$svg$Svg$Attributes$style('opacity:1; fill:none; fill-opacity:1; fill-rule:evenodd; stroke:#000000; stroke-width:1.5; stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4; stroke-dasharray:none; stroke-opacity:1;'),
					$elm$svg$Svg$Attributes$transform('translate(0,0.3)')
				]),
			_List_fromArray(
				[
					A2(
					$elm$svg$Svg$path,
					_List_fromArray(
						[
							$elm$svg$Svg$Attributes$d('M 22,10 C 32.5,11 38.5,18 38,39 L 15,39 C 15,30 25,32.5 23,18'),
							$elm$svg$Svg$Attributes$style('fill:#000000; stroke:#000000;')
						]),
					_List_Nil),
					A2(
					$elm$svg$Svg$path,
					_List_fromArray(
						[
							$elm$svg$Svg$Attributes$d('M 24,18 C 24.38,20.91 18.45,25.37 16,27 C 13,29 13.18,31.34 11,31 C 9.958,30.06 12.41,27.96 11,28 C 10,28 11.19,29.23 10,30 C 9,30 5.997,31 6,26 C 6,24 12,14 12,14 C 12,14 13.89,12.1 14,10.5 C 13.27,9.506 13.5,8.5 13.5,7.5 C 14.5,6.5 16.5,10 16.5,10 L 18.5,10 C 18.5,10 19.28,8.008 21,7 C 22,7 22,10 22,10'),
							$elm$svg$Svg$Attributes$style('fill:#000000; stroke:#000000;')
						]),
					_List_Nil),
					A2(
					$elm$svg$Svg$path,
					_List_fromArray(
						[
							$elm$svg$Svg$Attributes$d('M 9.5 25.5 A 0.5 0.5 0 1 1 8.5,25.5 A 0.5 0.5 0 1 1 9.5 25.5 z'),
							$elm$svg$Svg$Attributes$style('fill:#ffffff; stroke:#ffffff;')
						]),
					_List_Nil),
					A2(
					$elm$svg$Svg$path,
					_List_fromArray(
						[
							$elm$svg$Svg$Attributes$d('M 15 15.5 A 0.5 1.5 0 1 1  14,15.5 A 0.5 1.5 0 1 1  15 15.5 z'),
							$elm$svg$Svg$Attributes$transform('matrix(0.866,0.5,-0.5,0.866,9.693,-5.173)'),
							$elm$svg$Svg$Attributes$style('fill:#ffffff; stroke:#ffffff;')
						]),
					_List_Nil),
					A2(
					$elm$svg$Svg$path,
					_List_fromArray(
						[
							$elm$svg$Svg$Attributes$d('M 24.55,10.4 L 24.1,11.85 L 24.6,12 C 27.75,13 30.25,14.49 32.5,18.75 C 34.75,23.01 35.75,29.06 35.25,39 L 35.2,39.5 L 37.45,39.5 L 37.5,39 C 38,28.94 36.62,22.15 34.25,17.66 C 31.88,13.17 28.46,11.02 25.06,10.5 L 24.55,10.4 z '),
							$elm$svg$Svg$Attributes$style('fill:#ffffff; stroke:none;')
						]),
					_List_Nil)
				]))
		]));
var $pilatch$elm_chess$Piece$blackKing = $pilatch$elm_chess$Internal$Piece$blackKing;
var $elm$svg$Svg$Attributes$id = _VirtualDom_attribute('id');
var $author$project$Pieces$blackKing = A2(
	$elm$svg$Svg$svg,
	_List_fromArray(
		[
			$elm$svg$Svg$Attributes$version('1.1'),
			$elm$svg$Svg$Attributes$viewBox('0 0 45 45'),
			$elm$svg$Svg$Attributes$width('100%'),
			$elm$svg$Svg$Attributes$height('100%')
		]),
	_List_fromArray(
		[
			A2(
			$elm$svg$Svg$g,
			_List_fromArray(
				[
					$elm$svg$Svg$Attributes$style('fill:none; fill-opacity:1; fill-rule:evenodd; stroke:#000000; stroke-width:1.5; stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4; stroke-dasharray:none; stroke-opacity:1;')
				]),
			_List_fromArray(
				[
					A2(
					$elm$svg$Svg$path,
					_List_fromArray(
						[
							$elm$svg$Svg$Attributes$d('M 22.5,11.63 L 22.5,6'),
							$elm$svg$Svg$Attributes$style('fill:none; stroke:#000000; stroke-linejoin:miter;'),
							$elm$svg$Svg$Attributes$id('path6570')
						]),
					_List_Nil),
					A2(
					$elm$svg$Svg$path,
					_List_fromArray(
						[
							$elm$svg$Svg$Attributes$d('M 22.5,25 C 22.5,25 27,17.5 25.5,14.5 C 25.5,14.5 24.5,12 22.5,12 C 20.5,12 19.5,14.5 19.5,14.5 C 18,17.5 22.5,25 22.5,25'),
							$elm$svg$Svg$Attributes$style('fill:#000000;fill-opacity:1; stroke-linecap:butt; stroke-linejoin:miter;')
						]),
					_List_Nil),
					A2(
					$elm$svg$Svg$path,
					_List_fromArray(
						[
							$elm$svg$Svg$Attributes$d('M 12.5,37 C 18,40.5 27,40.5 32.5,37 L 32.5,30 C 32.5,30 41.5,25.5 38.5,19.5 C 34.5,13 25,16 22.5,23.5 L 22.5,27 L 22.5,23.5 C 20,16 10.5,13 6.5,19.5 C 3.5,25.5 12.5,30 12.5,30 L 12.5,37'),
							$elm$svg$Svg$Attributes$style('fill:#000000; stroke:#000000;')
						]),
					_List_Nil),
					A2(
					$elm$svg$Svg$path,
					_List_fromArray(
						[
							$elm$svg$Svg$Attributes$d('M 20,8 L 25,8'),
							$elm$svg$Svg$Attributes$style('fill:none; stroke:#000000; stroke-linejoin:miter;')
						]),
					_List_Nil),
					A2(
					$elm$svg$Svg$path,
					_List_fromArray(
						[
							$elm$svg$Svg$Attributes$d('M 32,29.5 C 32,29.5 40.5,25.5 38.03,19.85 C 34.15,14 25,18 22.5,24.5 L 22.5,26.6 L 22.5,24.5 C 20,18 10.85,14 6.97,19.85 C 4.5,25.5 13,29.5 13,29.5'),
							$elm$svg$Svg$Attributes$style('fill:none; stroke:#ffffff;')
						]),
					_List_Nil),
					A2(
					$elm$svg$Svg$path,
					_List_fromArray(
						[
							$elm$svg$Svg$Attributes$d('M 12.5,30 C 18,27 27,27 32.5,30 M 12.5,33.5 C 18,30.5 27,30.5 32.5,33.5 M 12.5,37 C 18,34 27,34 32.5,37'),
							$elm$svg$Svg$Attributes$style('fill:none; stroke:#ffffff;')
						]),
					_List_Nil)
				]))
		]));
var $pilatch$elm_chess$Piece$blackKnight = $pilatch$elm_chess$Internal$Piece$blackKnight;
var $pilatch$elm_chess$Piece$blackPawn = $pilatch$elm_chess$Internal$Piece$blackPawn;
var $author$project$Pieces$blackPawn = A2(
	$elm$svg$Svg$svg,
	_List_fromArray(
		[
			$elm$svg$Svg$Attributes$version('1.1'),
			$elm$svg$Svg$Attributes$viewBox('0 0 45 45'),
			$elm$svg$Svg$Attributes$width('100%'),
			$elm$svg$Svg$Attributes$height('100%')
		]),
	_List_fromArray(
		[
			A2(
			$elm$svg$Svg$path,
			_List_fromArray(
				[
					$elm$svg$Svg$Attributes$d('m 22.5,9 c -2.21,0 -4,1.79 -4,4 0,0.89 0.29,1.71 0.78,2.38 C 17.33,16.5 16,18.59 16,21 c 0,2.03 0.94,3.84 2.41,5.03 C 15.41,27.09 11,31.58 11,39.5 H 34 C 34,31.58 29.59,27.09 26.59,26.03 28.06,24.84 29,23.03 29,21 29,18.59 27.67,16.5 25.72,15.38 26.21,14.71 26.5,13.89 26.5,13 c 0,-2.21 -1.79,-4 -4,-4 z'),
					$elm$svg$Svg$Attributes$style('opacity:1; fill:#000000; fill-opacity:1; fill-rule:nonzero; stroke:#000000; stroke-width:1.5; stroke-linecap:round; stroke-linejoin:miter; stroke-miterlimit:4; stroke-dasharray:none; stroke-opacity:1;')
				]),
			_List_Nil)
		]));
var $pilatch$elm_chess$Piece$blackQueen = $pilatch$elm_chess$Internal$Piece$blackQueen;
var $elm$svg$Svg$circle = $elm$svg$Svg$trustedNode('circle');
var $elm$svg$Svg$Attributes$cx = _VirtualDom_attribute('cx');
var $elm$svg$Svg$Attributes$cy = _VirtualDom_attribute('cy');
var $elm$svg$Svg$Attributes$r = _VirtualDom_attribute('r');
var $author$project$Pieces$blackQueen = A2(
	$elm$svg$Svg$svg,
	_List_fromArray(
		[
			$elm$svg$Svg$Attributes$version('1.1'),
			$elm$svg$Svg$Attributes$viewBox('0 0 45 45'),
			$elm$svg$Svg$Attributes$width('100%'),
			$elm$svg$Svg$Attributes$height('100%')
		]),
	_List_fromArray(
		[
			A2(
			$elm$svg$Svg$g,
			_List_fromArray(
				[
					$elm$svg$Svg$Attributes$style('fill:#000000;stroke:#000000;stroke-width:1.5; stroke-linecap:round;stroke-linejoin:round')
				]),
			_List_fromArray(
				[
					A2(
					$elm$svg$Svg$path,
					_List_fromArray(
						[
							$elm$svg$Svg$Attributes$d('M 9,26 C 17.5,24.5 30,24.5 36,26 L 38.5,13.5 L 31,25 L 30.7,10.9 L 25.5,24.5 L 22.5,10 L 19.5,24.5 L 14.3,10.9 L 14,25 L 6.5,13.5 L 9,26 z'),
							$elm$svg$Svg$Attributes$style('stroke-linecap:butt;fill:#000000')
						]),
					_List_Nil),
					A2(
					$elm$svg$Svg$path,
					_List_fromArray(
						[
							$elm$svg$Svg$Attributes$d('m 9,26 c 0,2 1.5,2 2.5,4 1,1.5 1,1 0.5,3.5 -1.5,1 -1,2.5 -1,2.5 -1.5,1.5 0,2.5 0,2.5 6.5,1 16.5,1 23,0 0,0 1.5,-1 0,-2.5 0,0 0.5,-1.5 -1,-2.5 -0.5,-2.5 -0.5,-2 0.5,-3.5 1,-2 2.5,-2 2.5,-4 -8.5,-1.5 -18.5,-1.5 -27,0 z')
						]),
					_List_Nil),
					A2(
					$elm$svg$Svg$path,
					_List_fromArray(
						[
							$elm$svg$Svg$Attributes$d('M 11.5,30 C 15,29 30,29 33.5,30')
						]),
					_List_Nil),
					A2(
					$elm$svg$Svg$path,
					_List_fromArray(
						[
							$elm$svg$Svg$Attributes$d('m 12,33.5 c 6,-1 15,-1 21,0')
						]),
					_List_Nil),
					A2(
					$elm$svg$Svg$circle,
					_List_fromArray(
						[
							$elm$svg$Svg$Attributes$cx('6'),
							$elm$svg$Svg$Attributes$cy('12'),
							$elm$svg$Svg$Attributes$r('2')
						]),
					_List_Nil),
					A2(
					$elm$svg$Svg$circle,
					_List_fromArray(
						[
							$elm$svg$Svg$Attributes$cx('14'),
							$elm$svg$Svg$Attributes$cy('9'),
							$elm$svg$Svg$Attributes$r('2')
						]),
					_List_Nil),
					A2(
					$elm$svg$Svg$circle,
					_List_fromArray(
						[
							$elm$svg$Svg$Attributes$cx('22.5'),
							$elm$svg$Svg$Attributes$cy('8'),
							$elm$svg$Svg$Attributes$r('2')
						]),
					_List_Nil),
					A2(
					$elm$svg$Svg$circle,
					_List_fromArray(
						[
							$elm$svg$Svg$Attributes$cx('31'),
							$elm$svg$Svg$Attributes$cy('9'),
							$elm$svg$Svg$Attributes$r('2')
						]),
					_List_Nil),
					A2(
					$elm$svg$Svg$circle,
					_List_fromArray(
						[
							$elm$svg$Svg$Attributes$cx('39'),
							$elm$svg$Svg$Attributes$cy('12'),
							$elm$svg$Svg$Attributes$r('2')
						]),
					_List_Nil),
					A2(
					$elm$svg$Svg$path,
					_List_fromArray(
						[
							$elm$svg$Svg$Attributes$d('M 11,38.5 A 35,35 1 0 0 34,38.5'),
							$elm$svg$Svg$Attributes$style('fill:none; stroke:#000000;stroke-linecap:butt;')
						]),
					_List_Nil),
					A2(
					$elm$svg$Svg$g,
					_List_fromArray(
						[
							$elm$svg$Svg$Attributes$style('fill:none; stroke:#ffffff;')
						]),
					_List_fromArray(
						[
							A2(
							$elm$svg$Svg$path,
							_List_fromArray(
								[
									$elm$svg$Svg$Attributes$d('M 11,29 A 35,35 1 0 1 34,29')
								]),
							_List_Nil),
							A2(
							$elm$svg$Svg$path,
							_List_fromArray(
								[
									$elm$svg$Svg$Attributes$d('M 12.5,31.5 L 32.5,31.5')
								]),
							_List_Nil),
							A2(
							$elm$svg$Svg$path,
							_List_fromArray(
								[
									$elm$svg$Svg$Attributes$d('M 11.5,34.5 A 35,35 1 0 0 33.5,34.5')
								]),
							_List_Nil),
							A2(
							$elm$svg$Svg$path,
							_List_fromArray(
								[
									$elm$svg$Svg$Attributes$d('M 10.5,37.5 A 35,35 1 0 0 34.5,37.5')
								]),
							_List_Nil)
						]))
				]))
		]));
var $pilatch$elm_chess$Piece$blackRook = $pilatch$elm_chess$Internal$Piece$blackRook;
var $author$project$Pieces$blackTower = A2(
	$elm$svg$Svg$svg,
	_List_fromArray(
		[
			$elm$svg$Svg$Attributes$version('1.1'),
			$elm$svg$Svg$Attributes$viewBox('0 0 45 45'),
			$elm$svg$Svg$Attributes$width('100%'),
			$elm$svg$Svg$Attributes$height('100%')
		]),
	_List_fromArray(
		[
			A2(
			$elm$svg$Svg$g,
			_List_fromArray(
				[
					$elm$svg$Svg$Attributes$style('opacity:1; fill:#000000; fill-opacity:1; fill-rule:evenodd; stroke:#000000; stroke-width:1.5; stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4; stroke-dasharray:none; stroke-opacity:1;'),
					$elm$svg$Svg$Attributes$transform('translate(0,0.3)')
				]),
			_List_fromArray(
				[
					A2(
					$elm$svg$Svg$path,
					_List_fromArray(
						[
							$elm$svg$Svg$Attributes$d('M 9,39 L 36,39 L 36,36 L 9,36 L 9,39 z '),
							$elm$svg$Svg$Attributes$style('stroke-linecap:butt;')
						]),
					_List_Nil),
					A2(
					$elm$svg$Svg$path,
					_List_fromArray(
						[
							$elm$svg$Svg$Attributes$d('M 12.5,32 L 14,29.5 L 31,29.5 L 32.5,32 L 12.5,32 z '),
							$elm$svg$Svg$Attributes$style('stroke-linecap:butt;')
						]),
					_List_Nil),
					A2(
					$elm$svg$Svg$path,
					_List_fromArray(
						[
							$elm$svg$Svg$Attributes$d('M 12,36 L 12,32 L 33,32 L 33,36 L 12,36 z '),
							$elm$svg$Svg$Attributes$style('stroke-linecap:butt;')
						]),
					_List_Nil),
					A2(
					$elm$svg$Svg$path,
					_List_fromArray(
						[
							$elm$svg$Svg$Attributes$d('M 14,29.5 L 14,16.5 L 31,16.5 L 31,29.5 L 14,29.5 z '),
							$elm$svg$Svg$Attributes$style('stroke-linecap:butt;stroke-linejoin:miter;')
						]),
					_List_Nil),
					A2(
					$elm$svg$Svg$path,
					_List_fromArray(
						[
							$elm$svg$Svg$Attributes$d('M 14,16.5 L 11,14 L 34,14 L 31,16.5 L 14,16.5 z '),
							$elm$svg$Svg$Attributes$style('stroke-linecap:butt;')
						]),
					_List_Nil),
					A2(
					$elm$svg$Svg$path,
					_List_fromArray(
						[
							$elm$svg$Svg$Attributes$d('M 11,14 L 11,9 L 15,9 L 15,11 L 20,11 L 20,9 L 25,9 L 25,11 L 30,11 L 30,9 L 34,9 L 34,14 L 11,14 z '),
							$elm$svg$Svg$Attributes$style('stroke-linecap:butt;')
						]),
					_List_Nil),
					A2(
					$elm$svg$Svg$path,
					_List_fromArray(
						[
							$elm$svg$Svg$Attributes$d('M 12,35.5 L 33,35.5 L 33,35.5'),
							$elm$svg$Svg$Attributes$style('fill:none; stroke:#ffffff; stroke-width:1; stroke-linejoin:miter;')
						]),
					_List_Nil),
					A2(
					$elm$svg$Svg$path,
					_List_fromArray(
						[
							$elm$svg$Svg$Attributes$d('M 13,31.5 L 32,31.5'),
							$elm$svg$Svg$Attributes$style('fill:none; stroke:#ffffff; stroke-width:1; stroke-linejoin:miter;')
						]),
					_List_Nil),
					A2(
					$elm$svg$Svg$path,
					_List_fromArray(
						[
							$elm$svg$Svg$Attributes$d('M 14,29.5 L 31,29.5'),
							$elm$svg$Svg$Attributes$style('fill:none; stroke:#ffffff; stroke-width:1; stroke-linejoin:miter;')
						]),
					_List_Nil),
					A2(
					$elm$svg$Svg$path,
					_List_fromArray(
						[
							$elm$svg$Svg$Attributes$d('M 14,16.5 L 31,16.5'),
							$elm$svg$Svg$Attributes$style('fill:none; stroke:#ffffff; stroke-width:1; stroke-linejoin:miter;')
						]),
					_List_Nil),
					A2(
					$elm$svg$Svg$path,
					_List_fromArray(
						[
							$elm$svg$Svg$Attributes$d('M 11,14 L 34,14'),
							$elm$svg$Svg$Attributes$style('fill:none; stroke:#ffffff; stroke-width:1; stroke-linejoin:miter;')
						]),
					_List_Nil)
				]))
		]));
var $mdgriffith$elm_ui$Internal$Model$unstyled = A2($elm$core$Basics$composeL, $mdgriffith$elm_ui$Internal$Model$Unstyled, $elm$core$Basics$always);
var $mdgriffith$elm_ui$Element$html = $mdgriffith$elm_ui$Internal$Model$unstyled;
var $pilatch$elm_chess$Piece$whiteBishop = $pilatch$elm_chess$Internal$Piece$whiteBishop;
var $author$project$Pieces$whiteBishop = A2(
	$elm$svg$Svg$svg,
	_List_fromArray(
		[
			$elm$svg$Svg$Attributes$version('1.1'),
			$elm$svg$Svg$Attributes$viewBox('0 0 45 45'),
			$elm$svg$Svg$Attributes$width('100%'),
			$elm$svg$Svg$Attributes$height('100%')
		]),
	_List_fromArray(
		[
			A2(
			$elm$svg$Svg$g,
			_List_fromArray(
				[
					$elm$svg$Svg$Attributes$style('opacity:1; fill:none; fill-rule:evenodd; fill-opacity:1; stroke:#000000; stroke-width:1.5; stroke-linecap:round; stroke-linejoin:round; stroke-miterlimit:4; stroke-dasharray:none; stroke-opacity:1;'),
					$elm$svg$Svg$Attributes$transform('translate(0,0.6)')
				]),
			_List_fromArray(
				[
					A2(
					$elm$svg$Svg$g,
					_List_fromArray(
						[
							$elm$svg$Svg$Attributes$style('fill:#ffffff; stroke:#000000; stroke-linecap:butt;')
						]),
					_List_fromArray(
						[
							A2(
							$elm$svg$Svg$path,
							_List_fromArray(
								[
									$elm$svg$Svg$Attributes$d('M 9,36 C 12.39,35.03 19.11,36.43 22.5,34 C 25.89,36.43 32.61,35.03 36,36 C 36,36 37.65,36.54 39,38 C 38.32,38.97 37.35,38.99 36,38.5 C 32.61,37.53 25.89,38.96 22.5,37.5 C 19.11,38.96 12.39,37.53 9,38.5 C 7.65,38.99 6.68,38.97 6,38 C 7.35,36.54 9,36 9,36 z')
								]),
							_List_Nil),
							A2(
							$elm$svg$Svg$path,
							_List_fromArray(
								[
									$elm$svg$Svg$Attributes$d('M 15,32 C 17.5,34.5 27.5,34.5 30,32 C 30.5,30.5 30,30 30,30 C 30,27.5 27.5,26 27.5,26 C 33,24.5 33.5,14.5 22.5,10.5 C 11.5,14.5 12,24.5 17.5,26 C 17.5,26 15,27.5 15,30 C 15,30 14.5,30.5 15,32 z')
								]),
							_List_Nil),
							A2(
							$elm$svg$Svg$path,
							_List_fromArray(
								[
									$elm$svg$Svg$Attributes$d('M 25 8 A 2.5 2.5 0 1 1  20,8 A 2.5 2.5 0 1 1  25 8 z')
								]),
							_List_Nil)
						])),
					A2(
					$elm$svg$Svg$path,
					_List_fromArray(
						[
							$elm$svg$Svg$Attributes$d('M 17.5,26 L 27.5,26 M 15,30 L 30,30 M 22.5,15.5 L 22.5,20.5 M 20,18 L 25,18'),
							$elm$svg$Svg$Attributes$style('fill:none; stroke:#000000; stroke-linejoin:miter;')
						]),
					_List_Nil)
				]))
		]));
var $author$project$Pieces$whiteHorse = A2(
	$elm$svg$Svg$svg,
	_List_fromArray(
		[
			$elm$svg$Svg$Attributes$version('1.1'),
			$elm$svg$Svg$Attributes$viewBox('0 0 45 45'),
			$elm$svg$Svg$Attributes$width('100%'),
			$elm$svg$Svg$Attributes$height('100%')
		]),
	_List_fromArray(
		[
			A2(
			$elm$svg$Svg$g,
			_List_fromArray(
				[
					$elm$svg$Svg$Attributes$style('opacity:1; fill:none; fill-opacity:1; fill-rule:evenodd; stroke:#000000; stroke-width:1.5; stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4; stroke-dasharray:none; stroke-opacity:1;'),
					$elm$svg$Svg$Attributes$transform('translate(0,0.3)')
				]),
			_List_fromArray(
				[
					A2(
					$elm$svg$Svg$path,
					_List_fromArray(
						[
							$elm$svg$Svg$Attributes$d('M 22,10 C 32.5,11 38.5,18 38,39 L 15,39 C 15,30 25,32.5 23,18'),
							$elm$svg$Svg$Attributes$style('fill:#ffffff; stroke:#000000;')
						]),
					_List_Nil),
					A2(
					$elm$svg$Svg$path,
					_List_fromArray(
						[
							$elm$svg$Svg$Attributes$d('M 24,18 C 24.38,20.91 18.45,25.37 16,27 C 13,29 13.18,31.34 11,31 C 9.958,30.06 12.41,27.96 11,28 C 10,28 11.19,29.23 10,30 C 9,30 5.997,31 6,26 C 6,24 12,14 12,14 C 12,14 13.89,12.1 14,10.5 C 13.27,9.506 13.5,8.5 13.5,7.5 C 14.5,6.5 16.5,10 16.5,10 L 18.5,10 C 18.5,10 19.28,8.008 21,7 C 22,7 22,10 22,10'),
							$elm$svg$Svg$Attributes$style('fill:#ffffff; stroke:#000000;')
						]),
					_List_Nil),
					A2(
					$elm$svg$Svg$path,
					_List_fromArray(
						[
							$elm$svg$Svg$Attributes$d('M 9.5 25.5 A 0.5 0.5 0 1 1 8.5,25.5 A 0.5 0.5 0 1 1 9.5 25.5 z'),
							$elm$svg$Svg$Attributes$style('fill:#000000; stroke:#000000;')
						]),
					_List_Nil),
					A2(
					$elm$svg$Svg$path,
					_List_fromArray(
						[
							$elm$svg$Svg$Attributes$d('M 15 15.5 A 0.5 1.5 0 1 1  14,15.5 A 0.5 1.5 0 1 1  15 15.5 z'),
							$elm$svg$Svg$Attributes$transform('matrix(0.866,0.5,-0.5,0.866,9.693,-5.173)'),
							$elm$svg$Svg$Attributes$style('fill:#000000; stroke:#000000;')
						]),
					_List_Nil)
				]))
		]));
var $pilatch$elm_chess$Piece$whiteKing = $pilatch$elm_chess$Internal$Piece$whiteKing;
var $elm$svg$Svg$Attributes$fill = _VirtualDom_attribute('fill');
var $elm$svg$Svg$Attributes$fillRule = _VirtualDom_attribute('fill-rule');
var $elm$svg$Svg$Attributes$stroke = _VirtualDom_attribute('stroke');
var $elm$svg$Svg$Attributes$strokeLinecap = _VirtualDom_attribute('stroke-linecap');
var $elm$svg$Svg$Attributes$strokeLinejoin = _VirtualDom_attribute('stroke-linejoin');
var $elm$svg$Svg$Attributes$strokeWidth = _VirtualDom_attribute('stroke-width');
var $author$project$Pieces$whiteKing = A2(
	$elm$svg$Svg$svg,
	_List_fromArray(
		[
			$elm$svg$Svg$Attributes$viewBox('0 0 45 45'),
			$elm$svg$Svg$Attributes$width('100%'),
			$elm$svg$Svg$Attributes$height('100%')
		]),
	_List_fromArray(
		[
			A2(
			$elm$svg$Svg$g,
			_List_fromArray(
				[
					$elm$svg$Svg$Attributes$fill('none'),
					$elm$svg$Svg$Attributes$fillRule('evenodd'),
					$elm$svg$Svg$Attributes$stroke('#000'),
					$elm$svg$Svg$Attributes$strokeLinecap('round'),
					$elm$svg$Svg$Attributes$strokeLinejoin('round'),
					$elm$svg$Svg$Attributes$strokeWidth('1.5')
				]),
			_List_fromArray(
				[
					A2(
					$elm$svg$Svg$path,
					_List_fromArray(
						[
							$elm$svg$Svg$Attributes$strokeLinejoin('miter'),
							$elm$svg$Svg$Attributes$d('M22.5 11.63V6M20 8h5')
						]),
					_List_Nil),
					A2(
					$elm$svg$Svg$path,
					_List_fromArray(
						[
							$elm$svg$Svg$Attributes$fill('#fff'),
							$elm$svg$Svg$Attributes$strokeLinecap('butt'),
							$elm$svg$Svg$Attributes$strokeLinejoin('miter'),
							$elm$svg$Svg$Attributes$d('M22.5 25s4.5-7.5 3-10.5c0 0-1-2.5-3-2.5s-3 2.5-3 2.5c-1.5 3 3 10.5 3 10.5')
						]),
					_List_Nil),
					A2(
					$elm$svg$Svg$path,
					_List_fromArray(
						[
							$elm$svg$Svg$Attributes$fill('#fff'),
							$elm$svg$Svg$Attributes$d('M12.5 37c5.5 3.5 14.5 3.5 20 0v-7s9-4.5 6-10.5c-4-6.5-13.5-3.5-16 4V27v-3.5c-2.5-7.5-12-10.5-16-4-3 6 6 10.5 6 10.5v7')
						]),
					_List_Nil),
					A2(
					$elm$svg$Svg$path,
					_List_fromArray(
						[
							$elm$svg$Svg$Attributes$d('M12.5 30c5.5-3 14.5-3 20 0m-20 3.5c5.5-3 14.5-3 20 0m-20 3.5c5.5-3 14.5-3 20 0')
						]),
					_List_Nil)
				]))
		]));
var $pilatch$elm_chess$Piece$whiteKnight = $pilatch$elm_chess$Internal$Piece$whiteKnight;
var $pilatch$elm_chess$Piece$whitePawn = $pilatch$elm_chess$Internal$Piece$whitePawn;
var $author$project$Pieces$whitePawn = A2(
	$elm$svg$Svg$svg,
	_List_fromArray(
		[
			$elm$svg$Svg$Attributes$version('1.1'),
			$elm$svg$Svg$Attributes$viewBox('0 0 45 45'),
			$elm$svg$Svg$Attributes$width('100%'),
			$elm$svg$Svg$Attributes$height('100%')
		]),
	_List_fromArray(
		[
			A2(
			$elm$svg$Svg$path,
			_List_fromArray(
				[
					$elm$svg$Svg$Attributes$d('m 22.5,9 c -2.21,0 -4,1.79 -4,4 0,0.89 0.29,1.71 0.78,2.38 C 17.33,16.5 16,18.59 16,21 c 0,2.03 0.94,3.84 2.41,5.03 C 15.41,27.09 11,31.58 11,39.5 H 34 C 34,31.58 29.59,27.09 26.59,26.03 28.06,24.84 29,23.03 29,21 29,18.59 27.67,16.5 25.72,15.38 26.21,14.71 26.5,13.89 26.5,13 c 0,-2.21 -1.79,-4 -4,-4 z'),
					$elm$svg$Svg$Attributes$style('opacity:1; fill:#ffffff; fill-opacity:1; fill-rule:nonzero; stroke:#000000; stroke-width:1.5; stroke-linecap:round; stroke-linejoin:miter; stroke-miterlimit:4; stroke-dasharray:none; stroke-opacity:1;')
				]),
			_List_Nil)
		]));
var $pilatch$elm_chess$Piece$whiteQueen = $pilatch$elm_chess$Internal$Piece$whiteQueen;
var $author$project$Pieces$whiteQueen = A2(
	$elm$svg$Svg$svg,
	_List_fromArray(
		[
			$elm$svg$Svg$Attributes$version('1.1'),
			$elm$svg$Svg$Attributes$viewBox('0 0 45 45'),
			$elm$svg$Svg$Attributes$width('100%'),
			$elm$svg$Svg$Attributes$height('100%')
		]),
	_List_fromArray(
		[
			A2(
			$elm$svg$Svg$g,
			_List_fromArray(
				[
					$elm$svg$Svg$Attributes$style('fill:#ffffff;stroke:#000000;stroke-width:1.5;stroke-linejoin:round')
				]),
			_List_fromArray(
				[
					A2(
					$elm$svg$Svg$path,
					_List_fromArray(
						[
							$elm$svg$Svg$Attributes$d('M 9,26 C 17.5,24.5 30,24.5 36,26 L 38.5,13.5 L 31,25 L 30.7,10.9 L 25.5,24.5 L 22.5,10 L 19.5,24.5 L 14.3,10.9 L 14,25 L 6.5,13.5 L 9,26 z')
						]),
					_List_Nil),
					A2(
					$elm$svg$Svg$path,
					_List_fromArray(
						[
							$elm$svg$Svg$Attributes$d('M 9,26 C 9,28 10.5,28 11.5,30 C 12.5,31.5 12.5,31 12,33.5 C 10.5,34.5 11,36 11,36 C 9.5,37.5 11,38.5 11,38.5 C 17.5,39.5 27.5,39.5 34,38.5 C 34,38.5 35.5,37.5 34,36 C 34,36 34.5,34.5 33,33.5 C 32.5,31 32.5,31.5 33.5,30 C 34.5,28 36,28 36,26 C 27.5,24.5 17.5,24.5 9,26 z')
						]),
					_List_Nil),
					A2(
					$elm$svg$Svg$path,
					_List_fromArray(
						[
							$elm$svg$Svg$Attributes$d('M 11.5,30 C 15,29 30,29 33.5,30'),
							$elm$svg$Svg$Attributes$style('fill:none')
						]),
					_List_Nil),
					A2(
					$elm$svg$Svg$path,
					_List_fromArray(
						[
							$elm$svg$Svg$Attributes$d('M 12,33.5 C 18,32.5 27,32.5 33,33.5'),
							$elm$svg$Svg$Attributes$style('fill:none')
						]),
					_List_Nil),
					A2(
					$elm$svg$Svg$circle,
					_List_fromArray(
						[
							$elm$svg$Svg$Attributes$cx('6'),
							$elm$svg$Svg$Attributes$cy('12'),
							$elm$svg$Svg$Attributes$r('2')
						]),
					_List_Nil),
					A2(
					$elm$svg$Svg$circle,
					_List_fromArray(
						[
							$elm$svg$Svg$Attributes$cx('14'),
							$elm$svg$Svg$Attributes$cy('9'),
							$elm$svg$Svg$Attributes$r('2')
						]),
					_List_Nil),
					A2(
					$elm$svg$Svg$circle,
					_List_fromArray(
						[
							$elm$svg$Svg$Attributes$cx('22.5'),
							$elm$svg$Svg$Attributes$cy('8'),
							$elm$svg$Svg$Attributes$r('2')
						]),
					_List_Nil),
					A2(
					$elm$svg$Svg$circle,
					_List_fromArray(
						[
							$elm$svg$Svg$Attributes$cx('31'),
							$elm$svg$Svg$Attributes$cy('9'),
							$elm$svg$Svg$Attributes$r('2')
						]),
					_List_Nil),
					A2(
					$elm$svg$Svg$circle,
					_List_fromArray(
						[
							$elm$svg$Svg$Attributes$cx('39'),
							$elm$svg$Svg$Attributes$cy('12'),
							$elm$svg$Svg$Attributes$r('2')
						]),
					_List_Nil)
				]))
		]));
var $author$project$Pieces$whiteTower = A2(
	$elm$svg$Svg$svg,
	_List_fromArray(
		[
			$elm$svg$Svg$Attributes$version('1.1'),
			$elm$svg$Svg$Attributes$viewBox('0 0 45 45'),
			$elm$svg$Svg$Attributes$width('100%'),
			$elm$svg$Svg$Attributes$height('100%')
		]),
	_List_fromArray(
		[
			A2(
			$elm$svg$Svg$g,
			_List_fromArray(
				[
					$elm$svg$Svg$Attributes$style('opacity:1; fill:#ffffff; fill-opacity:1; fill-rule:evenodd; stroke:#000000; stroke-width:1.5; stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4; stroke-dasharray:none; stroke-opacity:1;'),
					$elm$svg$Svg$Attributes$transform('translate(0,0.3)')
				]),
			_List_fromArray(
				[
					A2(
					$elm$svg$Svg$path,
					_List_fromArray(
						[
							$elm$svg$Svg$Attributes$d('M 9,39 L 36,39 L 36,36 L 9,36 L 9,39 z '),
							$elm$svg$Svg$Attributes$style('stroke-linecap:butt;')
						]),
					_List_Nil),
					A2(
					$elm$svg$Svg$path,
					_List_fromArray(
						[
							$elm$svg$Svg$Attributes$d('M 12,36 L 12,32 L 33,32 L 33,36 L 12,36 z '),
							$elm$svg$Svg$Attributes$style('stroke-linecap:butt;')
						]),
					_List_Nil),
					A2(
					$elm$svg$Svg$path,
					_List_fromArray(
						[
							$elm$svg$Svg$Attributes$d('M 11,14 L 11,9 L 15,9 L 15,11 L 20,11 L 20,9 L 25,9 L 25,11 L 30,11 L 30,9 L 34,9 L 34,14'),
							$elm$svg$Svg$Attributes$style('stroke-linecap:butt;')
						]),
					_List_Nil),
					A2(
					$elm$svg$Svg$path,
					_List_fromArray(
						[
							$elm$svg$Svg$Attributes$d('M 34,14 L 31,17 L 14,17 L 11,14')
						]),
					_List_Nil),
					A2(
					$elm$svg$Svg$path,
					_List_fromArray(
						[
							$elm$svg$Svg$Attributes$d('M 31,17 L 31,29.5 L 14,29.5 L 14,17'),
							$elm$svg$Svg$Attributes$style('stroke-linecap:butt; stroke-linejoin:miter;')
						]),
					_List_Nil),
					A2(
					$elm$svg$Svg$path,
					_List_fromArray(
						[
							$elm$svg$Svg$Attributes$d('M 31,29.5 L 32.5,32 L 12.5,32 L 14,29.5')
						]),
					_List_Nil),
					A2(
					$elm$svg$Svg$path,
					_List_fromArray(
						[
							$elm$svg$Svg$Attributes$d('M 11,14 L 34,14'),
							$elm$svg$Svg$Attributes$style('fill:none; stroke:#000000; stroke-linejoin:miter;')
						]),
					_List_Nil)
				]))
		]));
var $author$project$View$chessPiece = function (piece) {
	return $mdgriffith$elm_ui$Element$html(
		_Utils_eq(piece, $pilatch$elm_chess$Piece$blackBishop) ? $author$project$Pieces$blackBishop : (_Utils_eq(piece, $pilatch$elm_chess$Piece$blackKing) ? $author$project$Pieces$blackKing : (_Utils_eq(piece, $pilatch$elm_chess$Piece$blackKnight) ? $author$project$Pieces$blackHorse : (_Utils_eq(piece, $pilatch$elm_chess$Piece$blackPawn) ? $author$project$Pieces$blackPawn : (_Utils_eq(piece, $pilatch$elm_chess$Piece$blackQueen) ? $author$project$Pieces$blackQueen : (_Utils_eq(piece, $pilatch$elm_chess$Piece$blackRook) ? $author$project$Pieces$blackTower : (_Utils_eq(piece, $pilatch$elm_chess$Piece$whiteBishop) ? $author$project$Pieces$whiteBishop : (_Utils_eq(piece, $pilatch$elm_chess$Piece$whiteKing) ? $author$project$Pieces$whiteKing : (_Utils_eq(piece, $pilatch$elm_chess$Piece$whiteKnight) ? $author$project$Pieces$whiteHorse : (_Utils_eq(piece, $pilatch$elm_chess$Piece$whitePawn) ? $author$project$Pieces$whitePawn : (_Utils_eq(piece, $pilatch$elm_chess$Piece$whiteQueen) ? $author$project$Pieces$whiteQueen : $author$project$Pieces$whiteTower)))))))))));
};
var $mdgriffith$elm_ui$Internal$Model$AsColumn = 1;
var $mdgriffith$elm_ui$Internal$Model$asColumn = 1;
var $mdgriffith$elm_ui$Internal$Model$Height = function (a) {
	return {$: 8, a: a};
};
var $mdgriffith$elm_ui$Element$height = $mdgriffith$elm_ui$Internal$Model$Height;
var $mdgriffith$elm_ui$Internal$Model$Content = {$: 1};
var $mdgriffith$elm_ui$Element$shrink = $mdgriffith$elm_ui$Internal$Model$Content;
var $mdgriffith$elm_ui$Internal$Model$Width = function (a) {
	return {$: 7, a: a};
};
var $mdgriffith$elm_ui$Element$width = $mdgriffith$elm_ui$Internal$Model$Width;
var $mdgriffith$elm_ui$Element$column = F2(
	function (attrs, children) {
		return A4(
			$mdgriffith$elm_ui$Internal$Model$element,
			$mdgriffith$elm_ui$Internal$Model$asColumn,
			$mdgriffith$elm_ui$Internal$Model$div,
			A2(
				$elm$core$List$cons,
				$mdgriffith$elm_ui$Internal$Model$htmlClass($mdgriffith$elm_ui$Internal$Style$classes.fl + (' ' + $mdgriffith$elm_ui$Internal$Style$classes.bg)),
				A2(
					$elm$core$List$cons,
					$mdgriffith$elm_ui$Element$height($mdgriffith$elm_ui$Element$shrink),
					A2(
						$elm$core$List$cons,
						$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$shrink),
						attrs))),
			$mdgriffith$elm_ui$Internal$Model$Unkeyed(children));
	});
var $mdgriffith$elm_ui$Element$el = F2(
	function (attrs, child) {
		return A4(
			$mdgriffith$elm_ui$Internal$Model$element,
			$mdgriffith$elm_ui$Internal$Model$asEl,
			$mdgriffith$elm_ui$Internal$Model$div,
			A2(
				$elm$core$List$cons,
				$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$shrink),
				A2(
					$elm$core$List$cons,
					$mdgriffith$elm_ui$Element$height($mdgriffith$elm_ui$Element$shrink),
					attrs)),
			$mdgriffith$elm_ui$Internal$Model$Unkeyed(
				_List_fromArray(
					[child])));
	});
var $pilatch$elm_chess$Internal$SquareFile$distance = F2(
	function (file0, file1) {
		return $elm$core$Basics$abs(
			$pilatch$elm_chess$Internal$SquareFile$unwrap(file1)) - $pilatch$elm_chess$Internal$SquareFile$unwrap(file0);
	});
var $pilatch$elm_chess$Internal$Square$fileDistance = F2(
	function (square0, square1) {
		return A2(
			$pilatch$elm_chess$Internal$SquareFile$distance,
			$pilatch$elm_chess$Internal$Square$file(square1),
			$pilatch$elm_chess$Internal$Square$file(square0));
	});
var $pilatch$elm_chess$Square$fileDistance = $pilatch$elm_chess$Internal$Square$fileDistance;
var $mdgriffith$elm_ui$Internal$Model$Fill = function (a) {
	return {$: 2, a: a};
};
var $mdgriffith$elm_ui$Element$fill = $mdgriffith$elm_ui$Internal$Model$Fill(1);
var $pilatch$elm_chess$Move$from = $pilatch$elm_chess$Internal$Move$from;
var $mdgriffith$elm_ui$Element$htmlAttribute = $mdgriffith$elm_ui$Internal$Model$Attr;
var $pilatch$elm_chess$Square$make = $pilatch$elm_chess$Internal$Square$make;
var $mdgriffith$elm_ui$Internal$Model$Empty = {$: 3};
var $mdgriffith$elm_ui$Element$none = $mdgriffith$elm_ui$Internal$Model$Empty;
var $avh4$elm_color$Color$RgbaSpace = F4(
	function (a, b, c, d) {
		return {$: 0, a: a, b: b, c: c, d: d};
	});
var $avh4$elm_color$Color$scaleFrom255 = function (c) {
	return c / 255;
};
var $avh4$elm_color$Color$rgb255 = F3(
	function (r, g, b) {
		return A4(
			$avh4$elm_color$Color$RgbaSpace,
			$avh4$elm_color$Color$scaleFrom255(r),
			$avh4$elm_color$Color$scaleFrom255(g),
			$avh4$elm_color$Color$scaleFrom255(b),
			1.0);
	});
var $author$project$Colors$noordstarBlue = A3($avh4$elm_color$Color$rgb255, 66, 127, 240);
var $author$project$Colors$noordstarGreen = A3($avh4$elm_color$Color$rgb255, 94, 164, 147);
var $author$project$Colors$noordstarWhite = A3($avh4$elm_color$Color$rgb255, 242, 239, 234);
var $author$project$Colors$noordstarYellow = A3($avh4$elm_color$Color$rgb255, 210, 208, 36);
var $elm$virtual_dom$VirtualDom$Normal = function (a) {
	return {$: 0, a: a};
};
var $elm$virtual_dom$VirtualDom$on = _VirtualDom_on;
var $elm$html$Html$Events$on = F2(
	function (event, decoder) {
		return A2(
			$elm$virtual_dom$VirtualDom$on,
			event,
			$elm$virtual_dom$VirtualDom$Normal(decoder));
	});
var $elm$html$Html$Events$onClick = function (msg) {
	return A2(
		$elm$html$Html$Events$on,
		'click',
		$elm$json$Json$Decode$succeed(msg));
};
var $mdgriffith$elm_ui$Element$Events$onClick = A2($elm$core$Basics$composeL, $mdgriffith$elm_ui$Internal$Model$Attr, $elm$html$Html$Events$onClick);
var $pilatch$elm_chess$Position$pieceOn = F2(
	function (square, pos) {
		var p = A2($pilatch$elm_chess$Internal$Position$pieceOn, square, pos);
		return (_Utils_eq(p, $pilatch$elm_chess$Internal$Piece$empty) || _Utils_eq(p, $pilatch$elm_chess$Internal$Piece$outside)) ? $elm$core$Maybe$Nothing : $elm$core$Maybe$Just(p);
	});
var $pilatch$elm_chess$Internal$SquareRank$distance = F2(
	function (rank0, rank1) {
		return $elm$core$Basics$abs(
			$pilatch$elm_chess$Internal$SquareRank$unwrap(rank1)) - $pilatch$elm_chess$Internal$SquareRank$unwrap(rank0);
	});
var $pilatch$elm_chess$Internal$Square$rankDistance = F2(
	function (square0, square1) {
		return A2(
			$pilatch$elm_chess$Internal$SquareRank$distance,
			$pilatch$elm_chess$Internal$Square$rank(square1),
			$pilatch$elm_chess$Internal$Square$rank(square0));
	});
var $pilatch$elm_chess$Square$rankDistance = $pilatch$elm_chess$Internal$Square$rankDistance;
var $mdgriffith$elm_ui$Internal$Model$AsRow = 0;
var $mdgriffith$elm_ui$Internal$Model$asRow = 0;
var $mdgriffith$elm_ui$Element$row = F2(
	function (attrs, children) {
		return A4(
			$mdgriffith$elm_ui$Internal$Model$element,
			$mdgriffith$elm_ui$Internal$Model$asRow,
			$mdgriffith$elm_ui$Internal$Model$div,
			A2(
				$elm$core$List$cons,
				$mdgriffith$elm_ui$Internal$Model$htmlClass($mdgriffith$elm_ui$Internal$Style$classes.bg + (' ' + $mdgriffith$elm_ui$Internal$Style$classes.am)),
				A2(
					$elm$core$List$cons,
					$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$shrink),
					A2(
						$elm$core$List$cons,
						$mdgriffith$elm_ui$Element$height($mdgriffith$elm_ui$Element$shrink),
						attrs))),
			$mdgriffith$elm_ui$Internal$Model$Unkeyed(children));
	});
var $elm$virtual_dom$VirtualDom$style = _VirtualDom_style;
var $elm$html$Html$Attributes$style = $elm$virtual_dom$VirtualDom$style;
var $author$project$View$board = F4(
	function (position, selectedDestinations, lastMove, flipped) {
		return A2(
			$mdgriffith$elm_ui$Element$el,
			_List_fromArray(
				[
					$mdgriffith$elm_ui$Element$htmlAttribute(
					A2($elm$html$Html$Attributes$style, 'aspect-ratio', '1 / 1'))
				]),
			A2(
				$mdgriffith$elm_ui$Element$row,
				_List_fromArray(
					[
						$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$fill),
						$mdgriffith$elm_ui$Element$height($mdgriffith$elm_ui$Element$fill)
					]),
				A2(
					$elm$core$List$map,
					$mdgriffith$elm_ui$Element$column(
						_List_fromArray(
							[
								$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$fill),
								$mdgriffith$elm_ui$Element$height($mdgriffith$elm_ui$Element$fill)
							])),
					(flipped ? $elm$core$List$map($elm$core$List$reverse) : $elm$core$List$reverse)(
						A2(
							$elm$core$List$map,
							function (file) {
								return A2(
									$elm$core$List$map,
									function (rank) {
										var square = A2($pilatch$elm_chess$Square$make, file, rank);
										var backgroundColor = A2($elm$core$List$member, square, selectedDestinations) ? $author$project$Colors$background($author$project$Colors$noordstarBlue) : (_Utils_eq(
											A2($elm$core$Maybe$map, $pilatch$elm_chess$Move$from, lastMove),
											$elm$core$Maybe$Just(square)) ? $author$project$Colors$background($author$project$Colors$noordstarYellow) : (_Utils_eq(
											A2($elm$core$Maybe$map, $pilatch$elm_chess$Move$to, lastMove),
											$elm$core$Maybe$Just(square)) ? $author$project$Colors$background($author$project$Colors$noordstarYellow) : ((!A2(
											$elm$core$Basics$modBy,
											2,
											A2($pilatch$elm_chess$Square$fileDistance, $pilatch$elm_chess$Square$a1, square) + A2($pilatch$elm_chess$Square$rankDistance, $pilatch$elm_chess$Square$a1, square))) ? $author$project$Colors$background($author$project$Colors$noordstarWhite) : $author$project$Colors$background($author$project$Colors$noordstarGreen))));
										return A2(
											$mdgriffith$elm_ui$Element$el,
											_List_fromArray(
												[
													$mdgriffith$elm_ui$Element$height($mdgriffith$elm_ui$Element$fill),
													$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$fill),
													backgroundColor,
													$mdgriffith$elm_ui$Element$Events$onClick(
													$author$project$Msg$LoggedIn(
														$author$project$Msg$ClickSquare(square)))
												]),
											function () {
												var _v0 = A2($pilatch$elm_chess$Position$pieceOn, square, position);
												if (_v0.$ === 1) {
													return $mdgriffith$elm_ui$Element$none;
												} else {
													var piece = _v0.a;
													return $author$project$View$chessPiece(piece);
												}
											}());
									},
									$pilatch$elm_chess$SquareRank$all);
							},
							$pilatch$elm_chess$SquareFile$all)))));
	});
var $author$project$Msg$JumpToEnd = {$: 9};
var $author$project$Msg$MoveBackwards = {$: 3};
var $author$project$Msg$MoveForward = {$: 2};
var $icidasset$elm_material_icons$Material$Icons$Internal$f = $elm$svg$Svg$Attributes$fill;
var $avh4$elm_color$Color$toCssString = function (_v0) {
	var r = _v0.a;
	var g = _v0.b;
	var b = _v0.c;
	var a = _v0.d;
	var roundTo = function (x) {
		return $elm$core$Basics$round(x * 1000) / 1000;
	};
	var pct = function (x) {
		return $elm$core$Basics$round(x * 10000) / 100;
	};
	return $elm$core$String$concat(
		_List_fromArray(
			[
				'rgba(',
				$elm$core$String$fromFloat(
				pct(r)),
				'%,',
				$elm$core$String$fromFloat(
				pct(g)),
				'%,',
				$elm$core$String$fromFloat(
				pct(b)),
				'%,',
				$elm$core$String$fromFloat(
				roundTo(a)),
				')'
			]));
};
var $icidasset$elm_material_icons$Material$Icons$Internal$icon = F4(
	function (attributes, nodes, size, coloring) {
		var sizeAsString = $elm$core$String$fromInt(size);
		return A2(
			$elm$svg$Svg$svg,
			_Utils_ap(
				attributes,
				_List_fromArray(
					[
						$elm$svg$Svg$Attributes$height(sizeAsString),
						$elm$svg$Svg$Attributes$width(sizeAsString)
					])),
			_List_fromArray(
				[
					A2(
					$elm$svg$Svg$g,
					_List_fromArray(
						[
							function () {
							if (!coloring.$) {
								var color = coloring.a;
								return $elm$svg$Svg$Attributes$fill(
									$avh4$elm_color$Color$toCssString(color));
							} else {
								return $elm$svg$Svg$Attributes$fill('currentColor');
							}
						}()
						]),
					nodes)
				]));
	});
var $icidasset$elm_material_icons$Material$Icons$Internal$p = $elm$svg$Svg$path;
var $icidasset$elm_material_icons$Material$Icons$Internal$v = $elm$svg$Svg$Attributes$viewBox;
var $icidasset$elm_material_icons$Material$Icons$arrow_back = A2(
	$icidasset$elm_material_icons$Material$Icons$Internal$icon,
	_List_fromArray(
		[
			$icidasset$elm_material_icons$Material$Icons$Internal$v('0 0 24 24')
		]),
	_List_fromArray(
		[
			A2(
			$icidasset$elm_material_icons$Material$Icons$Internal$p,
			_List_fromArray(
				[
					$elm$svg$Svg$Attributes$d('M0 0h24v24H0z'),
					$icidasset$elm_material_icons$Material$Icons$Internal$f('none')
				]),
			_List_Nil),
			A2(
			$icidasset$elm_material_icons$Material$Icons$Internal$p,
			_List_fromArray(
				[
					$elm$svg$Svg$Attributes$d('M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z')
				]),
			_List_Nil)
		]));
var $icidasset$elm_material_icons$Material$Icons$arrow_forward = A2(
	$icidasset$elm_material_icons$Material$Icons$Internal$icon,
	_List_fromArray(
		[
			$icidasset$elm_material_icons$Material$Icons$Internal$v('0 0 24 24')
		]),
	_List_fromArray(
		[
			A2(
			$icidasset$elm_material_icons$Material$Icons$Internal$p,
			_List_fromArray(
				[
					$elm$svg$Svg$Attributes$d('M0 0h24v24H0z'),
					$icidasset$elm_material_icons$Material$Icons$Internal$f('none')
				]),
			_List_Nil),
			A2(
			$icidasset$elm_material_icons$Material$Icons$Internal$p,
			_List_fromArray(
				[
					$elm$svg$Svg$Attributes$d('M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z')
				]),
			_List_Nil)
		]));
var $Orasund$elm_ui_widgets$Widget$Customize$mapElementButton = F2(
	function (fun, a) {
		return _Utils_update(
			a,
			{
				cc: fun(a.cc)
			});
	});
var $Orasund$elm_ui_widgets$Widget$Customize$elementButton = F2(
	function (list, a) {
		return A2(
			$Orasund$elm_ui_widgets$Widget$Customize$mapElementButton,
			function (b) {
				return _Utils_ap(b, list);
			},
			a);
	});
var $mdgriffith$elm_ui$Internal$Model$Button = {$: 8};
var $mdgriffith$elm_ui$Internal$Model$Describe = function (a) {
	return {$: 2, a: a};
};
var $elm$html$Html$Attributes$boolProperty = F2(
	function (key, bool) {
		return A2(
			_VirtualDom_property,
			key,
			$elm$json$Json$Encode$bool(bool));
	});
var $elm$html$Html$Attributes$disabled = $elm$html$Html$Attributes$boolProperty('disabled');
var $mdgriffith$elm_ui$Element$Input$enter = 'Enter';
var $mdgriffith$elm_ui$Internal$Model$NoAttribute = {$: 0};
var $mdgriffith$elm_ui$Element$Input$hasFocusStyle = function (attr) {
	if (((attr.$ === 4) && (attr.b.$ === 11)) && (!attr.b.a)) {
		var _v1 = attr.b;
		var _v2 = _v1.a;
		return true;
	} else {
		return false;
	}
};
var $mdgriffith$elm_ui$Element$Input$focusDefault = function (attrs) {
	return A2($elm$core$List$any, $mdgriffith$elm_ui$Element$Input$hasFocusStyle, attrs) ? $mdgriffith$elm_ui$Internal$Model$NoAttribute : $mdgriffith$elm_ui$Internal$Model$htmlClass('focusable');
};
var $elm$virtual_dom$VirtualDom$MayPreventDefault = function (a) {
	return {$: 2, a: a};
};
var $elm$html$Html$Events$preventDefaultOn = F2(
	function (event, decoder) {
		return A2(
			$elm$virtual_dom$VirtualDom$on,
			event,
			$elm$virtual_dom$VirtualDom$MayPreventDefault(decoder));
	});
var $mdgriffith$elm_ui$Element$Input$onKeyLookup = function (lookup) {
	var decode = function (code) {
		var _v0 = lookup(code);
		if (_v0.$ === 1) {
			return $elm$json$Json$Decode$fail('No key matched');
		} else {
			var msg = _v0.a;
			return $elm$json$Json$Decode$succeed(msg);
		}
	};
	var isKey = A2(
		$elm$json$Json$Decode$andThen,
		decode,
		A2($elm$json$Json$Decode$field, 'key', $elm$json$Json$Decode$string));
	return $mdgriffith$elm_ui$Internal$Model$Attr(
		A2(
			$elm$html$Html$Events$preventDefaultOn,
			'keydown',
			A2(
				$elm$json$Json$Decode$map,
				function (fired) {
					return _Utils_Tuple2(fired, true);
				},
				isKey)));
};
var $mdgriffith$elm_ui$Internal$Model$Class = F2(
	function (a, b) {
		return {$: 3, a: a, b: b};
	});
var $mdgriffith$elm_ui$Internal$Flag$cursor = $mdgriffith$elm_ui$Internal$Flag$flag(21);
var $mdgriffith$elm_ui$Element$pointer = A2($mdgriffith$elm_ui$Internal$Model$Class, $mdgriffith$elm_ui$Internal$Flag$cursor, $mdgriffith$elm_ui$Internal$Style$classes.fn);
var $mdgriffith$elm_ui$Element$Input$space = ' ';
var $elm$html$Html$Attributes$tabindex = function (n) {
	return A2(
		_VirtualDom_attribute,
		'tabIndex',
		$elm$core$String$fromInt(n));
};
var $mdgriffith$elm_ui$Element$Input$button = F2(
	function (attrs, _v0) {
		var onPress = _v0.u;
		var label = _v0.bm;
		return A4(
			$mdgriffith$elm_ui$Internal$Model$element,
			$mdgriffith$elm_ui$Internal$Model$asEl,
			$mdgriffith$elm_ui$Internal$Model$div,
			A2(
				$elm$core$List$cons,
				$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$shrink),
				A2(
					$elm$core$List$cons,
					$mdgriffith$elm_ui$Element$height($mdgriffith$elm_ui$Element$shrink),
					A2(
						$elm$core$List$cons,
						$mdgriffith$elm_ui$Internal$Model$htmlClass($mdgriffith$elm_ui$Internal$Style$classes.bN + (' ' + ($mdgriffith$elm_ui$Internal$Style$classes.am + (' ' + ($mdgriffith$elm_ui$Internal$Style$classes.gK + (' ' + $mdgriffith$elm_ui$Internal$Style$classes.dX)))))),
						A2(
							$elm$core$List$cons,
							$mdgriffith$elm_ui$Element$pointer,
							A2(
								$elm$core$List$cons,
								$mdgriffith$elm_ui$Element$Input$focusDefault(attrs),
								A2(
									$elm$core$List$cons,
									$mdgriffith$elm_ui$Internal$Model$Describe($mdgriffith$elm_ui$Internal$Model$Button),
									A2(
										$elm$core$List$cons,
										$mdgriffith$elm_ui$Internal$Model$Attr(
											$elm$html$Html$Attributes$tabindex(0)),
										function () {
											if (onPress.$ === 1) {
												return A2(
													$elm$core$List$cons,
													$mdgriffith$elm_ui$Internal$Model$Attr(
														$elm$html$Html$Attributes$disabled(true)),
													attrs);
											} else {
												var msg = onPress.a;
												return A2(
													$elm$core$List$cons,
													$mdgriffith$elm_ui$Element$Events$onClick(msg),
													A2(
														$elm$core$List$cons,
														$mdgriffith$elm_ui$Element$Input$onKeyLookup(
															function (code) {
																return _Utils_eq(code, $mdgriffith$elm_ui$Element$Input$enter) ? $elm$core$Maybe$Just(msg) : (_Utils_eq(code, $mdgriffith$elm_ui$Element$Input$space) ? $elm$core$Maybe$Just(msg) : $elm$core$Maybe$Nothing);
															}),
														attrs));
											}
										}()))))))),
			$mdgriffith$elm_ui$Internal$Model$Unkeyed(
				_List_fromArray(
					[label])));
	});
var $mdgriffith$elm_ui$Internal$Model$Label = function (a) {
	return {$: 5, a: a};
};
var $mdgriffith$elm_ui$Element$Region$description = A2($elm$core$Basics$composeL, $mdgriffith$elm_ui$Internal$Model$Describe, $mdgriffith$elm_ui$Internal$Model$Label);
var $mdgriffith$elm_ui$Internal$Model$Text = function (a) {
	return {$: 2, a: a};
};
var $mdgriffith$elm_ui$Element$text = function (content) {
	return $mdgriffith$elm_ui$Internal$Model$Text(content);
};
var $Orasund$elm_ui_widgets$Internal$Select$selectButton = F2(
	function (style, _v0) {
		var selected = _v0.a;
		var b = _v0.b;
		return A2(
			$mdgriffith$elm_ui$Element$Input$button,
			_Utils_ap(
				style.cc,
				_Utils_ap(
					_Utils_eq(b.u, $elm$core$Maybe$Nothing) ? style.bl : (selected ? style.fO : style.br),
					_List_fromArray(
						[
							$mdgriffith$elm_ui$Element$Region$description(b.g)
						]))),
			{
				bm: A2(
					$mdgriffith$elm_ui$Element$row,
					style.bf.cd,
					_List_fromArray(
						[
							b.H(
							_Utils_eq(b.u, $elm$core$Maybe$Nothing) ? style.bf.bf.H.bl : (selected ? style.bf.bf.H.fO : style.bf.bf.H.br)),
							A2(
							$mdgriffith$elm_ui$Element$el,
							style.bf.bf.g.fk,
							$mdgriffith$elm_ui$Element$text(b.g))
						])),
				u: b.u
			});
	});
var $Orasund$elm_ui_widgets$Internal$List$internalButton = F2(
	function (style, list) {
		return A2(
			$elm$core$List$indexedMap,
			function (i) {
				return $Orasund$elm_ui_widgets$Internal$Select$selectButton(
					A2(
						$Orasund$elm_ui_widgets$Widget$Customize$elementButton,
						_Utils_ap(
							style._,
							($elm$core$List$length(list) === 1) ? style.ad : ((!i) ? style.ab : (_Utils_eq(
								i,
								$elm$core$List$length(list) - 1) ? style.ac : style.br))),
						style.bf));
			},
			list);
	});
var $Orasund$elm_ui_widgets$Internal$List$buttonRow = function (style) {
	return A2(
		$elm$core$Basics$composeR,
		$Orasund$elm_ui_widgets$Internal$List$internalButton(
			{bf: style.bf, _: style.cd.bf._, ab: style.cd.bf.ab, ac: style.cd.bf.ac, ad: style.cd.bf.ad, br: style.cd.bf.br}),
		$mdgriffith$elm_ui$Element$row(style.cd.cd));
};
var $Orasund$elm_ui_widgets$Widget$buttonRow = $Orasund$elm_ui_widgets$Internal$List$buttonRow;
var $mdgriffith$elm_ui$Internal$Flag$borderRound = $mdgriffith$elm_ui$Internal$Flag$flag(17);
var $mdgriffith$elm_ui$Element$Border$roundEach = function (_v0) {
	var topLeft = _v0.b_;
	var topRight = _v0.b$;
	var bottomLeft = _v0.bF;
	var bottomRight = _v0.bG;
	return A2(
		$mdgriffith$elm_ui$Internal$Model$StyleClass,
		$mdgriffith$elm_ui$Internal$Flag$borderRound,
		A3(
			$mdgriffith$elm_ui$Internal$Model$Single,
			'br-' + ($elm$core$String$fromInt(topLeft) + ('-' + ($elm$core$String$fromInt(topRight) + ($elm$core$String$fromInt(bottomLeft) + ('-' + $elm$core$String$fromInt(bottomRight)))))),
			'border-radius',
			$elm$core$String$fromInt(topLeft) + ('px ' + ($elm$core$String$fromInt(topRight) + ('px ' + ($elm$core$String$fromInt(bottomRight) + ('px ' + ($elm$core$String$fromInt(bottomLeft) + 'px'))))))));
};
var $mdgriffith$elm_ui$Element$Border$rounded = function (radius) {
	return A2(
		$mdgriffith$elm_ui$Internal$Model$StyleClass,
		$mdgriffith$elm_ui$Internal$Flag$borderRound,
		A3(
			$mdgriffith$elm_ui$Internal$Model$Single,
			'br-' + $elm$core$String$fromInt(radius),
			'border-radius',
			$elm$core$String$fromInt(radius) + 'px'));
};
var $Orasund$elm_ui_widgets$Internal$Material$List$toggleRow = {
	bf: {
		_: _List_Nil,
		ab: _List_fromArray(
			[
				$mdgriffith$elm_ui$Element$Border$roundEach(
				{bF: 2, bG: 0, b_: 2, b$: 0})
			]),
		ac: _List_fromArray(
			[
				$mdgriffith$elm_ui$Element$Border$roundEach(
				{bF: 0, bG: 2, b_: 0, b$: 2})
			]),
		ad: _List_fromArray(
			[
				$mdgriffith$elm_ui$Element$Border$rounded(2)
			]),
		br: _List_fromArray(
			[
				$mdgriffith$elm_ui$Element$Border$rounded(0)
			])
	},
	cd: _List_Nil
};
var $Orasund$elm_ui_widgets$Widget$Material$buttonRow = $Orasund$elm_ui_widgets$Internal$Material$List$toggleRow;
var $icidasset$elm_material_icons$Material$Icons$fast_forward = A2(
	$icidasset$elm_material_icons$Material$Icons$Internal$icon,
	_List_fromArray(
		[
			$icidasset$elm_material_icons$Material$Icons$Internal$v('0 0 24 24')
		]),
	_List_fromArray(
		[
			A2(
			$icidasset$elm_material_icons$Material$Icons$Internal$p,
			_List_fromArray(
				[
					$elm$svg$Svg$Attributes$d('M0 0h24v24H0z'),
					$icidasset$elm_material_icons$Material$Icons$Internal$f('none')
				]),
			_List_Nil),
			A2(
			$icidasset$elm_material_icons$Material$Icons$Internal$p,
			_List_fromArray(
				[
					$elm$svg$Svg$Attributes$d('M4 18l8.5-6L4 6v12zm9-12v12l8.5-6L13 6z')
				]),
			_List_Nil)
		]));
var $icidasset$elm_material_icons$Material$Icons$flag = A2(
	$icidasset$elm_material_icons$Material$Icons$Internal$icon,
	_List_fromArray(
		[
			$icidasset$elm_material_icons$Material$Icons$Internal$v('0 0 24 24')
		]),
	_List_fromArray(
		[
			A2(
			$icidasset$elm_material_icons$Material$Icons$Internal$p,
			_List_fromArray(
				[
					$elm$svg$Svg$Attributes$d('M0 0h24v24H0z'),
					$icidasset$elm_material_icons$Material$Icons$Internal$f('none')
				]),
			_List_Nil),
			A2(
			$icidasset$elm_material_icons$Material$Icons$Internal$p,
			_List_fromArray(
				[
					$elm$svg$Svg$Attributes$d('M14.4 6L14 4H5v17h2v-7h5.6l.4 2h7V6z')
				]),
			_List_Nil)
		]));
var $icidasset$elm_material_icons$Material$Icons$Types$Color = function (a) {
	return {$: 0, a: a};
};
var $Orasund$elm_ui_widgets$Widget$Icon$elmMaterialIcons = F2(
	function (wrapper, fun) {
		return function (_v0) {
			var size = _v0.ep;
			var color = _v0.dp;
			return A2(
				$mdgriffith$elm_ui$Element$el,
				_List_Nil,
				$mdgriffith$elm_ui$Element$html(
					A2(
						fun,
						size,
						wrapper(color))));
		};
	});
var $author$project$View$getIcon = $Orasund$elm_ui_widgets$Widget$Icon$elmMaterialIcons($icidasset$elm_material_icons$Material$Icons$Types$Color);
var $pilatch$elm_chess$Internal$Game$isAtBeginning = function (game) {
	return !game.L;
};
var $pilatch$elm_chess$Game$isAtBeginning = function (game) {
	var g = game;
	return $pilatch$elm_chess$Internal$Game$isAtBeginning(g);
};
var $mdgriffith$elm_ui$Internal$Flag$letterSpacing = $mdgriffith$elm_ui$Internal$Flag$flag(16);
var $mdgriffith$elm_ui$Element$Font$letterSpacing = function (offset) {
	return A2(
		$mdgriffith$elm_ui$Internal$Model$StyleClass,
		$mdgriffith$elm_ui$Internal$Flag$letterSpacing,
		A3(
			$mdgriffith$elm_ui$Internal$Model$Single,
			'ls-' + $mdgriffith$elm_ui$Internal$Model$floatClass(offset),
			'letter-spacing',
			$elm$core$String$fromFloat(offset) + 'px'));
};
var $mdgriffith$elm_ui$Internal$Flag$fontWeight = $mdgriffith$elm_ui$Internal$Flag$flag(13);
var $mdgriffith$elm_ui$Element$Font$semiBold = A2($mdgriffith$elm_ui$Internal$Model$Class, $mdgriffith$elm_ui$Internal$Flag$fontWeight, $mdgriffith$elm_ui$Internal$Style$classes.hb);
var $mdgriffith$elm_ui$Element$Font$size = function (i) {
	return A2(
		$mdgriffith$elm_ui$Internal$Model$StyleClass,
		$mdgriffith$elm_ui$Internal$Flag$fontSize,
		$mdgriffith$elm_ui$Internal$Model$FontSize(i));
};
var $Orasund$elm_ui_widgets$Widget$Material$Typography$button = _List_fromArray(
	[
		$mdgriffith$elm_ui$Element$htmlAttribute(
		A2($elm$html$Html$Attributes$style, 'text-transform', 'uppercase')),
		$mdgriffith$elm_ui$Element$Font$size(14),
		$mdgriffith$elm_ui$Element$Font$semiBold,
		$mdgriffith$elm_ui$Element$Font$letterSpacing(1.25)
	]);
var $mdgriffith$elm_ui$Internal$Model$AlignY = function (a) {
	return {$: 5, a: a};
};
var $mdgriffith$elm_ui$Internal$Model$CenterY = 1;
var $mdgriffith$elm_ui$Element$centerY = $mdgriffith$elm_ui$Internal$Model$AlignY(1);
var $elm$core$Basics$cos = _Basics_cos;
var $noahzgordon$elm_color_extra$Color$Convert$labToXyz = function (_v0) {
	var l = _v0.ae;
	var a = _v0.dc;
	var b = _v0.dj;
	var y = (l + 16) / 116;
	var c = function (ch) {
		var ch_ = (ch * ch) * ch;
		return (ch_ > 8.856e-3) ? ch_ : ((ch - (16 / 116)) / 7.787);
	};
	return {
		eI: c(y + (a / 500)) * 95.047,
		eJ: c(y) * 100,
		bB: c(y - (b / 200)) * 108.883
	};
};
var $elm$core$Basics$clamp = F3(
	function (low, high, number) {
		return (_Utils_cmp(number, low) < 0) ? low : ((_Utils_cmp(number, high) > 0) ? high : number);
	});
var $avh4$elm_color$Color$rgb = F3(
	function (r, g, b) {
		return A4($avh4$elm_color$Color$RgbaSpace, r, g, b, 1.0);
	});
var $noahzgordon$elm_color_extra$Color$Convert$xyzToColor = function (_v0) {
	var x = _v0.eI;
	var y = _v0.eJ;
	var z = _v0.bB;
	var z_ = z / 100;
	var y_ = y / 100;
	var x_ = x / 100;
	var r = ((x_ * 3.2404542) + (y_ * (-1.5371385))) + (z_ * (-0.4986));
	var g = ((x_ * (-0.969266)) + (y_ * 1.8760108)) + (z_ * 4.1556e-2);
	var c = function (ch) {
		var ch_ = (ch > 3.1308e-3) ? ((1.055 * A2($elm$core$Basics$pow, ch, 1 / 2.4)) - 5.5e-2) : (12.92 * ch);
		return A3($elm$core$Basics$clamp, 0, 1, ch_);
	};
	var b = ((x_ * 5.56434e-2) + (y_ * (-0.2040259))) + (z_ * 1.0572252);
	return A3(
		$avh4$elm_color$Color$rgb,
		c(r),
		c(g),
		c(b));
};
var $noahzgordon$elm_color_extra$Color$Convert$labToColor = A2($elm$core$Basics$composeR, $noahzgordon$elm_color_extra$Color$Convert$labToXyz, $noahzgordon$elm_color_extra$Color$Convert$xyzToColor);
var $elm$core$Basics$sin = _Basics_sin;
var $Orasund$elm_ui_widgets$Widget$Material$Color$fromCIELCH = A2(
	$elm$core$Basics$composeR,
	function (_v0) {
		var l = _v0.ae;
		var c = _v0.be;
		var h = _v0.bj;
		return {
			dc: c * $elm$core$Basics$cos(h),
			dj: c * $elm$core$Basics$sin(h),
			ae: l
		};
	},
	$noahzgordon$elm_color_extra$Color$Convert$labToColor);
var $avh4$elm_color$Color$fromRgba = function (components) {
	return A4($avh4$elm_color$Color$RgbaSpace, components.cR, components.ck, components.b6, components.aC);
};
var $elm$core$Basics$atan2 = _Basics_atan2;
var $noahzgordon$elm_color_extra$Color$Convert$colorToXyz = function (cl) {
	var c = function (ch) {
		var ch_ = (ch > 4.045e-2) ? A2($elm$core$Basics$pow, (ch + 5.5e-2) / 1.055, 2.4) : (ch / 12.92);
		return ch_ * 100;
	};
	var _v0 = $avh4$elm_color$Color$toRgba(cl);
	var red = _v0.cR;
	var green = _v0.ck;
	var blue = _v0.b6;
	var b = c(blue);
	var g = c(green);
	var r = c(red);
	return {eI: ((r * 0.4124) + (g * 0.3576)) + (b * 0.1805), eJ: ((r * 0.2126) + (g * 0.7152)) + (b * 7.22e-2), bB: ((r * 1.93e-2) + (g * 0.1192)) + (b * 0.9505)};
};
var $noahzgordon$elm_color_extra$Color$Convert$xyzToLab = function (_v0) {
	var x = _v0.eI;
	var y = _v0.eJ;
	var z = _v0.bB;
	var c = function (ch) {
		return (ch > 8.856e-3) ? A2($elm$core$Basics$pow, ch, 1 / 3) : ((7.787 * ch) + (16 / 116));
	};
	var x_ = c(x / 95.047);
	var y_ = c(y / 100);
	var z_ = c(z / 108.883);
	return {dc: 500 * (x_ - y_), dj: 200 * (y_ - z_), ae: (116 * y_) - 16};
};
var $noahzgordon$elm_color_extra$Color$Convert$colorToLab = A2($elm$core$Basics$composeR, $noahzgordon$elm_color_extra$Color$Convert$colorToXyz, $noahzgordon$elm_color_extra$Color$Convert$xyzToLab);
var $elm$core$Basics$sqrt = _Basics_sqrt;
var $Orasund$elm_ui_widgets$Widget$Material$Color$toCIELCH = A2(
	$elm$core$Basics$composeR,
	$noahzgordon$elm_color_extra$Color$Convert$colorToLab,
	function (_v0) {
		var l = _v0.ae;
		var a = _v0.dc;
		var b = _v0.dj;
		return {
			be: $elm$core$Basics$sqrt((a * a) + (b * b)),
			bj: A2($elm$core$Basics$atan2, b, a),
			ae: l
		};
	});
var $Orasund$elm_ui_widgets$Widget$Material$Color$withShade = F3(
	function (c2, amount, c1) {
		var fun = F2(
			function (a, b) {
				return {be: ((a.be * (1 - amount)) + (b.be * amount)) / 1, bj: ((a.bj * (1 - amount)) + (b.bj * amount)) / 1, ae: ((a.ae * (1 - amount)) + (b.ae * amount)) / 1};
			});
		var alpha = $avh4$elm_color$Color$toRgba(c1).aC;
		return $avh4$elm_color$Color$fromRgba(
			function (color) {
				return _Utils_update(
					color,
					{aC: alpha});
			}(
				$avh4$elm_color$Color$toRgba(
					$Orasund$elm_ui_widgets$Widget$Material$Color$fromCIELCH(
						A2(
							fun,
							$Orasund$elm_ui_widgets$Widget$Material$Color$toCIELCH(c1),
							$Orasund$elm_ui_widgets$Widget$Material$Color$toCIELCH(c2))))));
	});
var $Orasund$elm_ui_widgets$Internal$Material$Palette$gray = function (palette) {
	return A3($Orasund$elm_ui_widgets$Widget$Material$Color$withShade, palette.bW.ay, 0.5, palette.ay);
};
var $mdgriffith$elm_ui$Internal$Model$Min = F2(
	function (a, b) {
		return {$: 3, a: a, b: b};
	});
var $mdgriffith$elm_ui$Element$minimum = F2(
	function (i, l) {
		return A2($mdgriffith$elm_ui$Internal$Model$Min, i, l);
	});
var $mdgriffith$elm_ui$Internal$Model$PaddingStyle = F5(
	function (a, b, c, d, e) {
		return {$: 7, a: a, b: b, c: c, d: d, e: e};
	});
var $mdgriffith$elm_ui$Internal$Flag$padding = $mdgriffith$elm_ui$Internal$Flag$flag(2);
var $mdgriffith$elm_ui$Element$paddingXY = F2(
	function (x, y) {
		if (_Utils_eq(x, y)) {
			var f = x;
			return A2(
				$mdgriffith$elm_ui$Internal$Model$StyleClass,
				$mdgriffith$elm_ui$Internal$Flag$padding,
				A5(
					$mdgriffith$elm_ui$Internal$Model$PaddingStyle,
					'p-' + $elm$core$String$fromInt(x),
					f,
					f,
					f,
					f));
		} else {
			var yFloat = y;
			var xFloat = x;
			return A2(
				$mdgriffith$elm_ui$Internal$Model$StyleClass,
				$mdgriffith$elm_ui$Internal$Flag$padding,
				A5(
					$mdgriffith$elm_ui$Internal$Model$PaddingStyle,
					'p-' + ($elm$core$String$fromInt(x) + ('-' + $elm$core$String$fromInt(y))),
					yFloat,
					xFloat,
					yFloat,
					xFloat));
		}
	});
var $mdgriffith$elm_ui$Internal$Model$Px = function (a) {
	return {$: 0, a: a};
};
var $mdgriffith$elm_ui$Element$px = $mdgriffith$elm_ui$Internal$Model$Px;
var $mdgriffith$elm_ui$Internal$Model$SpacingStyle = F3(
	function (a, b, c) {
		return {$: 5, a: a, b: b, c: c};
	});
var $mdgriffith$elm_ui$Internal$Flag$spacing = $mdgriffith$elm_ui$Internal$Flag$flag(3);
var $mdgriffith$elm_ui$Internal$Model$spacingName = F2(
	function (x, y) {
		return 'spacing-' + ($elm$core$String$fromInt(x) + ('-' + $elm$core$String$fromInt(y)));
	});
var $mdgriffith$elm_ui$Element$spacing = function (x) {
	return A2(
		$mdgriffith$elm_ui$Internal$Model$StyleClass,
		$mdgriffith$elm_ui$Internal$Flag$spacing,
		A3(
			$mdgriffith$elm_ui$Internal$Model$SpacingStyle,
			A2($mdgriffith$elm_ui$Internal$Model$spacingName, x, x),
			x,
			x));
};
var $Orasund$elm_ui_widgets$Internal$Material$Button$baseButton = function (palette) {
	return {
		bf: {
			bf: {
				H: {
					fO: {
						dp: $Orasund$elm_ui_widgets$Internal$Material$Palette$gray(palette),
						ep: 18
					},
					bl: {
						dp: $Orasund$elm_ui_widgets$Internal$Material$Palette$gray(palette),
						ep: 18
					},
					br: {
						dp: $Orasund$elm_ui_widgets$Internal$Material$Palette$gray(palette),
						ep: 18
					}
				},
				g: {
					fk: _List_fromArray(
						[$mdgriffith$elm_ui$Element$centerX])
				}
			},
			cd: _List_fromArray(
				[
					$mdgriffith$elm_ui$Element$spacing(8),
					$mdgriffith$elm_ui$Element$width(
					A2($mdgriffith$elm_ui$Element$minimum, 32, $mdgriffith$elm_ui$Element$shrink)),
					$mdgriffith$elm_ui$Element$centerY
				])
		},
		cc: _Utils_ap(
			$Orasund$elm_ui_widgets$Widget$Material$Typography$button,
			_List_fromArray(
				[
					$mdgriffith$elm_ui$Element$height(
					$mdgriffith$elm_ui$Element$px(36)),
					A2($mdgriffith$elm_ui$Element$paddingXY, 8, 8),
					$mdgriffith$elm_ui$Element$Border$rounded(4)
				])),
		fO: _List_Nil,
		bl: _List_fromArray(
			[
				$mdgriffith$elm_ui$Element$htmlAttribute(
				A2($elm$html$Html$Attributes$style, 'cursor', 'not-allowed'))
			]),
		br: _List_Nil
	};
};
var $Orasund$elm_ui_widgets$Widget$Material$Color$buttonFocusOpacity = 0.24;
var $Orasund$elm_ui_widgets$Widget$Material$Color$buttonHoverOpacity = 0.08;
var $Orasund$elm_ui_widgets$Widget$Material$Color$buttonPressedOpacity = 0.32;
var $mdgriffith$elm_ui$Internal$Flag$borderColor = $mdgriffith$elm_ui$Internal$Flag$flag(28);
var $mdgriffith$elm_ui$Element$Border$color = function (clr) {
	return A2(
		$mdgriffith$elm_ui$Internal$Model$StyleClass,
		$mdgriffith$elm_ui$Internal$Flag$borderColor,
		A3(
			$mdgriffith$elm_ui$Internal$Model$Colored,
			'bc-' + $mdgriffith$elm_ui$Internal$Model$formatColorClass(clr),
			'border-color',
			clr));
};
var $mdgriffith$elm_ui$Element$Font$color = function (fontColor) {
	return A2(
		$mdgriffith$elm_ui$Internal$Model$StyleClass,
		$mdgriffith$elm_ui$Internal$Flag$fontColor,
		A3(
			$mdgriffith$elm_ui$Internal$Model$Colored,
			'fc-' + $mdgriffith$elm_ui$Internal$Model$formatColorClass(fontColor),
			'color',
			fontColor));
};
var $mdgriffith$elm_ui$Internal$Model$Focus = 0;
var $mdgriffith$elm_ui$Internal$Model$PseudoSelector = F2(
	function (a, b) {
		return {$: 11, a: a, b: b};
	});
var $mdgriffith$elm_ui$Internal$Flag$focus = $mdgriffith$elm_ui$Internal$Flag$flag(31);
var $mdgriffith$elm_ui$Internal$Model$Nearby = F2(
	function (a, b) {
		return {$: 9, a: a, b: b};
	});
var $mdgriffith$elm_ui$Internal$Model$TransformComponent = F2(
	function (a, b) {
		return {$: 10, a: a, b: b};
	});
var $elm$virtual_dom$VirtualDom$map = _VirtualDom_map;
var $mdgriffith$elm_ui$Internal$Model$map = F2(
	function (fn, el) {
		switch (el.$) {
			case 1:
				var styled = el.a;
				return $mdgriffith$elm_ui$Internal$Model$Styled(
					{
						fN: F2(
							function (add, context) {
								return A2(
									$elm$virtual_dom$VirtualDom$map,
									fn,
									A2(styled.fN, add, context));
							}),
						gY: styled.gY
					});
			case 0:
				var html = el.a;
				return $mdgriffith$elm_ui$Internal$Model$Unstyled(
					A2(
						$elm$core$Basics$composeL,
						$elm$virtual_dom$VirtualDom$map(fn),
						html));
			case 2:
				var str = el.a;
				return $mdgriffith$elm_ui$Internal$Model$Text(str);
			default:
				return $mdgriffith$elm_ui$Internal$Model$Empty;
		}
	});
var $elm$virtual_dom$VirtualDom$mapAttribute = _VirtualDom_mapAttribute;
var $mdgriffith$elm_ui$Internal$Model$mapAttrFromStyle = F2(
	function (fn, attr) {
		switch (attr.$) {
			case 0:
				return $mdgriffith$elm_ui$Internal$Model$NoAttribute;
			case 2:
				var description = attr.a;
				return $mdgriffith$elm_ui$Internal$Model$Describe(description);
			case 6:
				var x = attr.a;
				return $mdgriffith$elm_ui$Internal$Model$AlignX(x);
			case 5:
				var y = attr.a;
				return $mdgriffith$elm_ui$Internal$Model$AlignY(y);
			case 7:
				var x = attr.a;
				return $mdgriffith$elm_ui$Internal$Model$Width(x);
			case 8:
				var x = attr.a;
				return $mdgriffith$elm_ui$Internal$Model$Height(x);
			case 3:
				var x = attr.a;
				var y = attr.b;
				return A2($mdgriffith$elm_ui$Internal$Model$Class, x, y);
			case 4:
				var flag = attr.a;
				var style = attr.b;
				return A2($mdgriffith$elm_ui$Internal$Model$StyleClass, flag, style);
			case 9:
				var location = attr.a;
				var elem = attr.b;
				return A2(
					$mdgriffith$elm_ui$Internal$Model$Nearby,
					location,
					A2($mdgriffith$elm_ui$Internal$Model$map, fn, elem));
			case 1:
				var htmlAttr = attr.a;
				return $mdgriffith$elm_ui$Internal$Model$Attr(
					A2($elm$virtual_dom$VirtualDom$mapAttribute, fn, htmlAttr));
			default:
				var fl = attr.a;
				var trans = attr.b;
				return A2($mdgriffith$elm_ui$Internal$Model$TransformComponent, fl, trans);
		}
	});
var $mdgriffith$elm_ui$Internal$Model$removeNever = function (style) {
	return A2($mdgriffith$elm_ui$Internal$Model$mapAttrFromStyle, $elm$core$Basics$never, style);
};
var $mdgriffith$elm_ui$Internal$Model$unwrapDecsHelper = F2(
	function (attr, _v0) {
		var styles = _v0.a;
		var trans = _v0.b;
		var _v1 = $mdgriffith$elm_ui$Internal$Model$removeNever(attr);
		switch (_v1.$) {
			case 4:
				var style = _v1.b;
				return _Utils_Tuple2(
					A2($elm$core$List$cons, style, styles),
					trans);
			case 10:
				var flag = _v1.a;
				var component = _v1.b;
				return _Utils_Tuple2(
					styles,
					A2($mdgriffith$elm_ui$Internal$Model$composeTransformation, trans, component));
			default:
				return _Utils_Tuple2(styles, trans);
		}
	});
var $mdgriffith$elm_ui$Internal$Model$unwrapDecorations = function (attrs) {
	var _v0 = A3(
		$elm$core$List$foldl,
		$mdgriffith$elm_ui$Internal$Model$unwrapDecsHelper,
		_Utils_Tuple2(_List_Nil, $mdgriffith$elm_ui$Internal$Model$Untransformed),
		attrs);
	var styles = _v0.a;
	var transform = _v0.b;
	return A2(
		$elm$core$List$cons,
		$mdgriffith$elm_ui$Internal$Model$Transform(transform),
		styles);
};
var $mdgriffith$elm_ui$Element$focused = function (decs) {
	return A2(
		$mdgriffith$elm_ui$Internal$Model$StyleClass,
		$mdgriffith$elm_ui$Internal$Flag$focus,
		A2(
			$mdgriffith$elm_ui$Internal$Model$PseudoSelector,
			0,
			$mdgriffith$elm_ui$Internal$Model$unwrapDecorations(decs)));
};
var $Orasund$elm_ui_widgets$Widget$Material$Color$fromColor = A2($elm$core$Basics$composeR, $avh4$elm_color$Color$toRgba, $mdgriffith$elm_ui$Element$fromRgb);
var $mdgriffith$elm_ui$Internal$Model$Active = 2;
var $mdgriffith$elm_ui$Internal$Flag$active = $mdgriffith$elm_ui$Internal$Flag$flag(32);
var $mdgriffith$elm_ui$Element$mouseDown = function (decs) {
	return A2(
		$mdgriffith$elm_ui$Internal$Model$StyleClass,
		$mdgriffith$elm_ui$Internal$Flag$active,
		A2(
			$mdgriffith$elm_ui$Internal$Model$PseudoSelector,
			2,
			$mdgriffith$elm_ui$Internal$Model$unwrapDecorations(decs)));
};
var $mdgriffith$elm_ui$Internal$Model$Hover = 1;
var $mdgriffith$elm_ui$Internal$Flag$hover = $mdgriffith$elm_ui$Internal$Flag$flag(33);
var $mdgriffith$elm_ui$Element$mouseOver = function (decs) {
	return A2(
		$mdgriffith$elm_ui$Internal$Model$StyleClass,
		$mdgriffith$elm_ui$Internal$Flag$hover,
		A2(
			$mdgriffith$elm_ui$Internal$Model$PseudoSelector,
			1,
			$mdgriffith$elm_ui$Internal$Model$unwrapDecorations(decs)));
};
var $Orasund$elm_ui_widgets$Widget$Material$Color$scaleOpacity = function (opacity) {
	return A2(
		$elm$core$Basics$composeR,
		$avh4$elm_color$Color$toRgba,
		A2(
			$elm$core$Basics$composeR,
			function (color) {
				return _Utils_update(
					color,
					{aC: color.aC * opacity});
			},
			$avh4$elm_color$Color$fromRgba));
};
var $mdgriffith$elm_ui$Internal$Model$BorderWidth = F5(
	function (a, b, c, d, e) {
		return {$: 6, a: a, b: b, c: c, d: d, e: e};
	});
var $mdgriffith$elm_ui$Element$Border$width = function (v) {
	return A2(
		$mdgriffith$elm_ui$Internal$Model$StyleClass,
		$mdgriffith$elm_ui$Internal$Flag$borderWidth,
		A5(
			$mdgriffith$elm_ui$Internal$Model$BorderWidth,
			'b-' + $elm$core$String$fromInt(v),
			v,
			v,
			v,
			v));
};
var $Orasund$elm_ui_widgets$Internal$Material$Button$outlinedButton = function (palette) {
	return {
		bf: {
			bf: {
				H: {
					fO: {dp: palette.av, ep: 18},
					bl: {
						dp: $Orasund$elm_ui_widgets$Internal$Material$Palette$gray(palette),
						ep: 18
					},
					br: {dp: palette.av, ep: 18}
				},
				g: {
					fk: $Orasund$elm_ui_widgets$Internal$Material$Button$baseButton(palette).bf.bf.g.fk
				}
			},
			cd: _Utils_ap(
				$Orasund$elm_ui_widgets$Internal$Material$Button$baseButton(palette).bf.cd,
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Element$paddingXY, 8, 0)
					]))
		},
		cc: _Utils_ap(
			$Orasund$elm_ui_widgets$Internal$Material$Button$baseButton(palette).cc,
			_List_fromArray(
				[
					$mdgriffith$elm_ui$Element$Border$width(1),
					$mdgriffith$elm_ui$Element$Font$color(
					$Orasund$elm_ui_widgets$Widget$Material$Color$fromColor(palette.av)),
					$mdgriffith$elm_ui$Element$Border$color(
					$Orasund$elm_ui_widgets$Widget$Material$Color$fromColor(
						A3(
							$Orasund$elm_ui_widgets$Widget$Material$Color$withShade,
							palette.av,
							$Orasund$elm_ui_widgets$Widget$Material$Color$buttonHoverOpacity,
							A2($Orasund$elm_ui_widgets$Widget$Material$Color$scaleOpacity, 0.14, palette.bW.ay)))),
					$mdgriffith$elm_ui$Element$mouseDown(
					_List_fromArray(
						[
							$mdgriffith$elm_ui$Element$Background$color(
							$Orasund$elm_ui_widgets$Widget$Material$Color$fromColor(
								A2($Orasund$elm_ui_widgets$Widget$Material$Color$scaleOpacity, $Orasund$elm_ui_widgets$Widget$Material$Color$buttonPressedOpacity, palette.av)))
						])),
					$mdgriffith$elm_ui$Element$focused(
					_List_fromArray(
						[
							$mdgriffith$elm_ui$Element$Background$color(
							$Orasund$elm_ui_widgets$Widget$Material$Color$fromColor(
								A2($Orasund$elm_ui_widgets$Widget$Material$Color$scaleOpacity, $Orasund$elm_ui_widgets$Widget$Material$Color$buttonFocusOpacity, palette.av)))
						])),
					$mdgriffith$elm_ui$Element$mouseOver(
					_List_fromArray(
						[
							$mdgriffith$elm_ui$Element$Background$color(
							$Orasund$elm_ui_widgets$Widget$Material$Color$fromColor(
								A2($Orasund$elm_ui_widgets$Widget$Material$Color$scaleOpacity, $Orasund$elm_ui_widgets$Widget$Material$Color$buttonHoverOpacity, palette.av)))
						]))
				])),
		fO: _List_fromArray(
			[
				$mdgriffith$elm_ui$Element$Background$color(
				$Orasund$elm_ui_widgets$Widget$Material$Color$fromColor(
					A2($Orasund$elm_ui_widgets$Widget$Material$Color$scaleOpacity, $Orasund$elm_ui_widgets$Widget$Material$Color$buttonHoverOpacity, palette.av)))
			]),
		bl: _Utils_ap(
			$Orasund$elm_ui_widgets$Internal$Material$Button$baseButton(palette).bl,
			_List_fromArray(
				[
					$mdgriffith$elm_ui$Element$Font$color(
					$Orasund$elm_ui_widgets$Widget$Material$Color$fromColor(
						$Orasund$elm_ui_widgets$Internal$Material$Palette$gray(palette))),
					$mdgriffith$elm_ui$Element$mouseDown(_List_Nil),
					$mdgriffith$elm_ui$Element$mouseOver(_List_Nil),
					$mdgriffith$elm_ui$Element$focused(_List_Nil)
				])),
		br: _List_Nil
	};
};
var $Orasund$elm_ui_widgets$Widget$Material$outlinedButton = $Orasund$elm_ui_widgets$Internal$Material$Button$outlinedButton;
var $avh4$elm_color$Color$black = A4($avh4$elm_color$Color$RgbaSpace, 0 / 255, 0 / 255, 0 / 255, 1.0);
var $author$project$Colors$noordstarRed = A3($avh4$elm_color$Color$rgb255, 176, 0, 0);
var $author$project$Colors$primaryColor = $author$project$Colors$noordstarBlue;
var $author$project$Colors$secondaryColor = A3($avh4$elm_color$Color$rgb255, 255, 138, 101);
var $avh4$elm_color$Color$white = A4($avh4$elm_color$Color$RgbaSpace, 255 / 255, 255 / 255, 255 / 255, 1.0);
var $author$project$Colors$textOnPrimaryColor = $avh4$elm_color$Color$white;
var $author$project$Colors$textOnSecondaryColor = $avh4$elm_color$Color$black;
var $author$project$Colors$secondaryPalette = {
	ai: $avh4$elm_color$Color$white,
	ao: $author$project$Colors$noordstarRed,
	bW: {ai: $avh4$elm_color$Color$black, ao: $avh4$elm_color$Color$white, av: $author$project$Colors$textOnSecondaryColor, ax: $author$project$Colors$textOnPrimaryColor, ay: $avh4$elm_color$Color$black},
	av: $author$project$Colors$secondaryColor,
	ax: $author$project$Colors$primaryColor,
	ay: $avh4$elm_color$Color$white
};
var $author$project$View$boardMenu = function (game) {
	return A2(
		$mdgriffith$elm_ui$Element$el,
		_List_fromArray(
			[
				$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$fill)
			]),
		A2(
			$Orasund$elm_ui_widgets$Widget$buttonRow,
			{
				bf: $Orasund$elm_ui_widgets$Widget$Material$outlinedButton($author$project$Colors$secondaryPalette),
				cd: $Orasund$elm_ui_widgets$Widget$Material$buttonRow
			},
			_List_fromArray(
				[
					_Utils_Tuple2(
					false,
					{
						H: $author$project$View$getIcon($icidasset$elm_material_icons$Material$Icons$flag),
						u: $elm$core$Maybe$Nothing,
						g: 'Resign'
					}),
					_Utils_Tuple2(
					$pilatch$elm_chess$Game$isAtBeginning(game),
					{
						H: $author$project$View$getIcon($icidasset$elm_material_icons$Material$Icons$arrow_back),
						u: $pilatch$elm_chess$Game$isAtBeginning(game) ? $elm$core$Maybe$Nothing : $elm$core$Maybe$Just(
							$author$project$Msg$LoggedIn($author$project$Msg$MoveBackwards)),
						g: 'Previous'
					}),
					_Utils_Tuple2(
					$pilatch$elm_chess$Game$isAtEnd(game),
					{
						H: $author$project$View$getIcon($icidasset$elm_material_icons$Material$Icons$arrow_forward),
						u: $pilatch$elm_chess$Game$isAtEnd(game) ? $elm$core$Maybe$Nothing : $elm$core$Maybe$Just(
							$author$project$Msg$LoggedIn($author$project$Msg$MoveForward)),
						g: 'Next'
					}),
					_Utils_Tuple2(
					$pilatch$elm_chess$Game$isAtEnd(game),
					{
						H: $author$project$View$getIcon($icidasset$elm_material_icons$Material$Icons$fast_forward),
						u: $pilatch$elm_chess$Game$isAtEnd(game) ? $elm$core$Maybe$Nothing : $elm$core$Maybe$Just(
							$author$project$Msg$LoggedIn($author$project$Msg$JumpToEnd)),
						g: 'Now'
					})
				])));
};
var $author$project$Msg$BrowseGames = {$: 8};
var $author$project$Msg$FlipBoard = {$: 10};
var $icidasset$elm_material_icons$Material$Icons$sync = A2(
	$icidasset$elm_material_icons$Material$Icons$Internal$icon,
	_List_fromArray(
		[
			$icidasset$elm_material_icons$Material$Icons$Internal$v('0 0 24 24')
		]),
	_List_fromArray(
		[
			A2(
			$icidasset$elm_material_icons$Material$Icons$Internal$p,
			_List_fromArray(
				[
					$elm$svg$Svg$Attributes$d('M0 0h24v24H0z'),
					$icidasset$elm_material_icons$Material$Icons$Internal$f('none')
				]),
			_List_Nil),
			A2(
			$icidasset$elm_material_icons$Material$Icons$Internal$p,
			_List_fromArray(
				[
					$elm$svg$Svg$Attributes$d('M12 4V1L8 5l4 4V6c3.31 0 6 2.69 6 6 0 1.01-.25 1.97-.7 2.8l1.46 1.46C19.54 15.03 20 13.57 20 12c0-4.42-3.58-8-8-8zm0 14c-3.31 0-6-2.69-6-6 0-1.01.25-1.97.7-2.8L5.24 7.74C4.46 8.97 4 10.43 4 12c0 4.42 3.58 8 8 8v3l4-4-4-4v3z')
				]),
			_List_Nil)
		]));
var $Orasund$elm_ui_widgets$Widget$Material$toggleRow = $Orasund$elm_ui_widgets$Internal$Material$List$toggleRow;
var $author$project$View$boardTopMenu = A2(
	$mdgriffith$elm_ui$Element$row,
	_List_fromArray(
		[
			$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$fill)
		]),
	_List_fromArray(
		[
			A2(
			$Orasund$elm_ui_widgets$Widget$buttonRow,
			{
				bf: $Orasund$elm_ui_widgets$Widget$Material$outlinedButton($author$project$Colors$secondaryPalette),
				cd: $Orasund$elm_ui_widgets$Widget$Material$toggleRow
			},
			_List_fromArray(
				[
					_Utils_Tuple2(
					false,
					{
						H: $author$project$View$getIcon($icidasset$elm_material_icons$Material$Icons$arrow_back),
						u: $elm$core$Maybe$Just(
							$author$project$Msg$LoggedIn($author$project$Msg$BrowseGames)),
						g: 'Back'
					})
				])),
			A2(
			$mdgriffith$elm_ui$Element$el,
			_List_fromArray(
				[$mdgriffith$elm_ui$Element$alignRight]),
			A2(
				$Orasund$elm_ui_widgets$Widget$buttonRow,
				{
					bf: $Orasund$elm_ui_widgets$Widget$Material$outlinedButton($author$project$Colors$secondaryPalette),
					cd: $Orasund$elm_ui_widgets$Widget$Material$toggleRow
				},
				_List_fromArray(
					[
						_Utils_Tuple2(
						false,
						{
							H: $author$project$View$getIcon($icidasset$elm_material_icons$Material$Icons$sync),
							u: $elm$core$Maybe$Just(
								$author$project$Msg$LoggedIn($author$project$Msg$FlipBoard)),
							g: 'Flip board'
						})
					])))
		]));
var $noahzgordon$elm_color_extra$Color$Accessibility$luminance = function (cl) {
	var f = function (intensity) {
		return (intensity <= 0.03928) ? (intensity / 12.92) : A2($elm$core$Basics$pow, (intensity + 0.055) / 1.055, 2.4);
	};
	var _v0 = function (a) {
		return _Utils_Tuple3(
			f(a.cR),
			f(a.ck),
			f(a.b6));
	}(
		$avh4$elm_color$Color$toRgba(cl));
	var r = _v0.a;
	var g = _v0.b;
	var b = _v0.c;
	return ((0.2126 * r) + (0.7152 * g)) + (0.0722 * b);
};
var $Orasund$elm_ui_widgets$Widget$Material$Color$accessibleTextColor = function (color) {
	var l = 1 + ($avh4$elm_color$Color$toRgba(color).aC * ($noahzgordon$elm_color_extra$Color$Accessibility$luminance(color) - 1));
	var ratioBlack = 1.05 / (l + 0.05);
	var ratioWhite = (l + 0.05) / 0.05;
	return (_Utils_cmp(ratioBlack, ratioWhite) < 0) ? A3($avh4$elm_color$Color$rgb255, 0, 0, 0) : A3($avh4$elm_color$Color$rgb255, 255, 255, 255);
};
var $mdgriffith$elm_ui$Internal$Model$Top = 0;
var $mdgriffith$elm_ui$Element$alignTop = $mdgriffith$elm_ui$Internal$Model$AlignY(0);
var $mdgriffith$elm_ui$Internal$Model$boxShadowClass = function (shadow) {
	return $elm$core$String$concat(
		_List_fromArray(
			[
				shadow.dK ? 'box-inset' : 'box-',
				$mdgriffith$elm_ui$Internal$Model$floatClass(shadow.ge.a) + 'px',
				$mdgriffith$elm_ui$Internal$Model$floatClass(shadow.ge.b) + 'px',
				$mdgriffith$elm_ui$Internal$Model$floatClass(shadow.e4) + 'px',
				$mdgriffith$elm_ui$Internal$Model$floatClass(shadow.ep) + 'px',
				$mdgriffith$elm_ui$Internal$Model$formatColorClass(shadow.dp)
			]));
};
var $mdgriffith$elm_ui$Internal$Flag$shadows = $mdgriffith$elm_ui$Internal$Flag$flag(19);
var $mdgriffith$elm_ui$Element$Border$shadow = function (almostShade) {
	var shade = {e4: almostShade.e4, dp: almostShade.dp, dK: false, ge: almostShade.ge, ep: almostShade.ep};
	return A2(
		$mdgriffith$elm_ui$Internal$Model$StyleClass,
		$mdgriffith$elm_ui$Internal$Flag$shadows,
		A3(
			$mdgriffith$elm_ui$Internal$Model$Single,
			$mdgriffith$elm_ui$Internal$Model$boxShadowClass(shade),
			'box-shadow',
			$mdgriffith$elm_ui$Internal$Model$formatBoxShadow(shade)));
};
var $mdgriffith$elm_ui$Element$rgba255 = F4(
	function (red, green, blue, a) {
		return A4($mdgriffith$elm_ui$Internal$Model$Rgba, red / 255, green / 255, blue / 255, a);
	});
var $Orasund$elm_ui_widgets$Widget$Material$Color$shadow = function (_float) {
	return {
		e4: _float,
		dp: A4($mdgriffith$elm_ui$Element$rgba255, 0, 0, 0, 0.2),
		ge: _Utils_Tuple2(0, _float),
		ep: 0
	};
};
var $Orasund$elm_ui_widgets$Internal$Material$List$cardColumn = function (palette) {
	return {
		bf: {
			_: _List_fromArray(
				[
					A2($mdgriffith$elm_ui$Element$paddingXY, 16, 12),
					$mdgriffith$elm_ui$Element$Background$color(
					$Orasund$elm_ui_widgets$Widget$Material$Color$fromColor(palette.ay)),
					$mdgriffith$elm_ui$Element$Font$color(
					$Orasund$elm_ui_widgets$Widget$Material$Color$fromColor(
						$Orasund$elm_ui_widgets$Widget$Material$Color$accessibleTextColor(palette.ay))),
					$mdgriffith$elm_ui$Element$Border$color(
					$Orasund$elm_ui_widgets$Widget$Material$Color$fromColor(
						A2($Orasund$elm_ui_widgets$Widget$Material$Color$scaleOpacity, 0.14, palette.bW.ay))),
					$mdgriffith$elm_ui$Element$width(
					A2($mdgriffith$elm_ui$Element$minimum, 344, $mdgriffith$elm_ui$Element$fill))
				]),
			ab: _List_fromArray(
				[
					$mdgriffith$elm_ui$Element$Border$roundEach(
					{bF: 0, bG: 0, b_: 4, b$: 4})
				]),
			ac: _List_fromArray(
				[
					$mdgriffith$elm_ui$Element$Border$roundEach(
					{bF: 4, bG: 4, b_: 0, b$: 0})
				]),
			ad: _List_fromArray(
				[
					$mdgriffith$elm_ui$Element$Border$rounded(4),
					$mdgriffith$elm_ui$Element$Border$width(1)
				]),
			br: _List_fromArray(
				[
					$mdgriffith$elm_ui$Element$Border$rounded(0)
				])
		},
		ds: _List_fromArray(
			[
				$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$fill),
				$mdgriffith$elm_ui$Element$mouseOver(
				_List_fromArray(
					[
						$mdgriffith$elm_ui$Element$Border$shadow(
						$Orasund$elm_ui_widgets$Widget$Material$Color$shadow(4))
					])),
				$mdgriffith$elm_ui$Element$alignTop,
				$mdgriffith$elm_ui$Element$Border$rounded(4),
				$mdgriffith$elm_ui$Element$Border$width(1),
				$mdgriffith$elm_ui$Element$Border$color(
				$Orasund$elm_ui_widgets$Widget$Material$Color$fromColor(
					A2($Orasund$elm_ui_widgets$Widget$Material$Color$scaleOpacity, 0.14, palette.bW.ay)))
			])
	};
};
var $Orasund$elm_ui_widgets$Internal$Material$List$cardAttributes = function (palette) {
	var style = $Orasund$elm_ui_widgets$Internal$Material$List$cardColumn(palette);
	return _Utils_ap(style.ds, style.bf._);
};
var $Orasund$elm_ui_widgets$Widget$Material$cardAttributes = $Orasund$elm_ui_widgets$Internal$Material$List$cardAttributes;
var $Orasund$elm_ui_widgets$Widget$Material$cardColumn = $Orasund$elm_ui_widgets$Internal$Material$List$cardColumn;
var $icidasset$elm_material_icons$Material$Icons$close = A2(
	$icidasset$elm_material_icons$Material$Icons$Internal$icon,
	_List_fromArray(
		[
			$icidasset$elm_material_icons$Material$Icons$Internal$v('0 0 24 24')
		]),
	_List_fromArray(
		[
			A2(
			$icidasset$elm_material_icons$Material$Icons$Internal$p,
			_List_fromArray(
				[
					$elm$svg$Svg$Attributes$d('M0 0h24v24H0z'),
					$icidasset$elm_material_icons$Material$Icons$Internal$f('none')
				]),
			_List_Nil),
			A2(
			$icidasset$elm_material_icons$Material$Icons$Internal$p,
			_List_fromArray(
				[
					$elm$svg$Svg$Attributes$d('M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z')
				]),
			_List_Nil)
		]));
var $Orasund$elm_ui_widgets$Widget$Material$Color$buttonDisabledOpacity = 0.38;
var $Orasund$elm_ui_widgets$Internal$Material$Button$containedButton = function (palette) {
	return {
		bf: {
			bf: {
				H: {
					fO: {
						dp: $Orasund$elm_ui_widgets$Widget$Material$Color$accessibleTextColor(palette.av),
						ep: 18
					},
					bl: {
						dp: $Orasund$elm_ui_widgets$Internal$Material$Palette$gray(palette),
						ep: 18
					},
					br: {
						dp: $Orasund$elm_ui_widgets$Widget$Material$Color$accessibleTextColor(palette.av),
						ep: 18
					}
				},
				g: {
					fk: function (b) {
						return b.bf.bf.g.fk;
					}(
						$Orasund$elm_ui_widgets$Internal$Material$Button$baseButton(palette))
				}
			},
			cd: _Utils_ap(
				$Orasund$elm_ui_widgets$Internal$Material$Button$baseButton(palette).bf.cd,
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Element$paddingXY, 8, 0)
					]))
		},
		cc: _Utils_ap(
			$Orasund$elm_ui_widgets$Internal$Material$Button$baseButton(palette).cc,
			_List_fromArray(
				[
					$mdgriffith$elm_ui$Element$Border$shadow(
					$Orasund$elm_ui_widgets$Widget$Material$Color$shadow(2)),
					$mdgriffith$elm_ui$Element$mouseDown(
					_List_fromArray(
						[
							$mdgriffith$elm_ui$Element$Background$color(
							$Orasund$elm_ui_widgets$Widget$Material$Color$fromColor(
								A3($Orasund$elm_ui_widgets$Widget$Material$Color$withShade, palette.bW.av, $Orasund$elm_ui_widgets$Widget$Material$Color$buttonPressedOpacity, palette.av))),
							$mdgriffith$elm_ui$Element$Border$shadow(
							$Orasund$elm_ui_widgets$Widget$Material$Color$shadow(12))
						])),
					$mdgriffith$elm_ui$Element$focused(
					_List_fromArray(
						[
							$mdgriffith$elm_ui$Element$Background$color(
							$Orasund$elm_ui_widgets$Widget$Material$Color$fromColor(
								A3($Orasund$elm_ui_widgets$Widget$Material$Color$withShade, palette.bW.av, $Orasund$elm_ui_widgets$Widget$Material$Color$buttonFocusOpacity, palette.av))),
							$mdgriffith$elm_ui$Element$Border$shadow(
							$Orasund$elm_ui_widgets$Widget$Material$Color$shadow(6))
						])),
					$mdgriffith$elm_ui$Element$mouseOver(
					_List_fromArray(
						[
							$mdgriffith$elm_ui$Element$Background$color(
							$Orasund$elm_ui_widgets$Widget$Material$Color$fromColor(
								A3($Orasund$elm_ui_widgets$Widget$Material$Color$withShade, palette.bW.av, $Orasund$elm_ui_widgets$Widget$Material$Color$buttonHoverOpacity, palette.av))),
							$mdgriffith$elm_ui$Element$Border$shadow(
							$Orasund$elm_ui_widgets$Widget$Material$Color$shadow(6))
						]))
				])),
		fO: _List_fromArray(
			[
				$mdgriffith$elm_ui$Element$Background$color(
				$Orasund$elm_ui_widgets$Widget$Material$Color$fromColor(
					A3($Orasund$elm_ui_widgets$Widget$Material$Color$withShade, palette.bW.av, $Orasund$elm_ui_widgets$Widget$Material$Color$buttonHoverOpacity, palette.av))),
				$mdgriffith$elm_ui$Element$Font$color(
				$Orasund$elm_ui_widgets$Widget$Material$Color$fromColor(
					$Orasund$elm_ui_widgets$Widget$Material$Color$accessibleTextColor(palette.av)))
			]),
		bl: _Utils_ap(
			$Orasund$elm_ui_widgets$Internal$Material$Button$baseButton(palette).bl,
			_List_fromArray(
				[
					$mdgriffith$elm_ui$Element$Background$color(
					$Orasund$elm_ui_widgets$Widget$Material$Color$fromColor(
						A2(
							$Orasund$elm_ui_widgets$Widget$Material$Color$scaleOpacity,
							$Orasund$elm_ui_widgets$Widget$Material$Color$buttonDisabledOpacity,
							$Orasund$elm_ui_widgets$Internal$Material$Palette$gray(palette)))),
					$mdgriffith$elm_ui$Element$Font$color(
					$Orasund$elm_ui_widgets$Widget$Material$Color$fromColor(
						$Orasund$elm_ui_widgets$Internal$Material$Palette$gray(palette))),
					$mdgriffith$elm_ui$Element$Border$shadow(
					$Orasund$elm_ui_widgets$Widget$Material$Color$shadow(0)),
					$mdgriffith$elm_ui$Element$mouseDown(_List_Nil),
					$mdgriffith$elm_ui$Element$mouseOver(_List_Nil),
					$mdgriffith$elm_ui$Element$focused(_List_Nil)
				])),
		br: _List_fromArray(
			[
				$mdgriffith$elm_ui$Element$Background$color(
				$Orasund$elm_ui_widgets$Widget$Material$Color$fromColor(palette.av)),
				$mdgriffith$elm_ui$Element$Font$color(
				$Orasund$elm_ui_widgets$Widget$Material$Color$fromColor(
					$Orasund$elm_ui_widgets$Widget$Material$Color$accessibleTextColor(palette.av)))
			])
	};
};
var $Orasund$elm_ui_widgets$Widget$Material$containedButton = $Orasund$elm_ui_widgets$Internal$Material$Button$containedButton;
var $author$project$Colors$darkPrimaryColor = A3($avh4$elm_color$Color$rgb255, 0, 84, 189);
var $author$project$Colors$darkSecondaryColor = A3($avh4$elm_color$Color$rgb255, 199, 91, 57);
var $author$project$Colors$darkPalette = {
	ai: $author$project$Colors$noordstarWhite,
	ao: $author$project$Colors$noordstarRed,
	bW: {ai: $avh4$elm_color$Color$black, ao: $avh4$elm_color$Color$white, av: $avh4$elm_color$Color$white, ax: $avh4$elm_color$Color$white, ay: $avh4$elm_color$Color$black},
	av: $author$project$Colors$darkPrimaryColor,
	ax: $author$project$Colors$darkSecondaryColor,
	ay: $author$project$Colors$noordstarWhite
};
var $Orasund$elm_ui_widgets$Internal$Material$Palette$defaultPalette = {
	ai: A3($avh4$elm_color$Color$rgb255, 255, 255, 255),
	ao: A3($avh4$elm_color$Color$rgb255, 176, 0, 32),
	bW: {
		ai: A3($avh4$elm_color$Color$rgb255, 0, 0, 0),
		ao: A3($avh4$elm_color$Color$rgb255, 255, 255, 255),
		av: A3($avh4$elm_color$Color$rgb255, 255, 255, 255),
		ax: A3($avh4$elm_color$Color$rgb255, 0, 0, 0),
		ay: A3($avh4$elm_color$Color$rgb255, 0, 0, 0)
	},
	av: A3($avh4$elm_color$Color$rgb255, 98, 0, 238),
	ax: A3($avh4$elm_color$Color$rgb255, 3, 218, 198),
	ay: A3($avh4$elm_color$Color$rgb255, 255, 255, 255)
};
var $Orasund$elm_ui_widgets$Widget$Material$defaultPalette = $Orasund$elm_ui_widgets$Internal$Material$Palette$defaultPalette;
var $icidasset$elm_material_icons$Material$Icons$done = A2(
	$icidasset$elm_material_icons$Material$Icons$Internal$icon,
	_List_fromArray(
		[
			$icidasset$elm_material_icons$Material$Icons$Internal$v('0 0 24 24')
		]),
	_List_fromArray(
		[
			A2(
			$icidasset$elm_material_icons$Material$Icons$Internal$p,
			_List_fromArray(
				[
					$elm$svg$Svg$Attributes$d('M0 0h24v24H0z'),
					$icidasset$elm_material_icons$Material$Icons$Internal$f('none')
				]),
			_List_Nil),
			A2(
			$icidasset$elm_material_icons$Material$Icons$Internal$p,
			_List_fromArray(
				[
					$elm$svg$Svg$Attributes$d('M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z')
				]),
			_List_Nil)
		]));
var $author$project$Colors$font = A2(
	$elm$core$Basics$composeR,
	$avh4$elm_color$Color$toRgba,
	A2($elm$core$Basics$composeR, $mdgriffith$elm_ui$Element$fromRgb, $mdgriffith$elm_ui$Element$Font$color));
var $author$project$Chess$getGames = function (vault) {
	return $author$project$Chess$sorted(
		$elm$core$List$concat(
			A2(
				$elm$core$List$map,
				function (room) {
					return A2(
						$elm$core$List$map,
						function (_v0) {
							var matchId = _v0.a;
							var state = _v0.b;
							return {an: state, cG: matchId, bu: room};
						},
						$elm$core$Dict$toList(
							A2(
								$author$project$Chess$fromAccountData,
								$author$project$Matrix$Room$roomId(room),
								vault)));
				},
				$author$project$Matrix$getRooms(vault))));
};
var $Orasund$elm_ui_widgets$Internal$Button$iconButton = F2(
	function (style, _v0) {
		var onPress = _v0.u;
		var text = _v0.g;
		var icon = _v0.H;
		return A2(
			$mdgriffith$elm_ui$Element$Input$button,
			_Utils_ap(
				style.cc,
				_Utils_ap(
					_Utils_eq(onPress, $elm$core$Maybe$Nothing) ? style.bl : style.br,
					_List_fromArray(
						[
							$mdgriffith$elm_ui$Element$Region$description(text)
						]))),
			{
				bm: A2(
					$mdgriffith$elm_ui$Element$el,
					style.bf.cd,
					icon(
						_Utils_eq(onPress, $elm$core$Maybe$Nothing) ? style.bf.bf.H.bl : style.bf.bf.H.br)),
				u: onPress
			});
	});
var $Orasund$elm_ui_widgets$Widget$iconButton = function () {
	var fun = $Orasund$elm_ui_widgets$Internal$Button$iconButton;
	return fun;
}();
var $mdgriffith$elm_ui$Internal$Model$Paragraph = {$: 9};
var $mdgriffith$elm_ui$Element$paragraph = F2(
	function (attrs, children) {
		return A4(
			$mdgriffith$elm_ui$Internal$Model$element,
			$mdgriffith$elm_ui$Internal$Model$asParagraph,
			$mdgriffith$elm_ui$Internal$Model$div,
			A2(
				$elm$core$List$cons,
				$mdgriffith$elm_ui$Internal$Model$Describe($mdgriffith$elm_ui$Internal$Model$Paragraph),
				A2(
					$elm$core$List$cons,
					$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$fill),
					A2(
						$elm$core$List$cons,
						$mdgriffith$elm_ui$Element$spacing(5),
						attrs))),
			$mdgriffith$elm_ui$Internal$Model$Unkeyed(children));
	});
var $Orasund$elm_ui_widgets$Internal$Item$toItem = F2(
	function (style, element) {
		return function (attr) {
			return A2(
				$mdgriffith$elm_ui$Element$el,
				_Utils_ap(attr, style._),
				element(style.bf));
		};
	});
var $Orasund$elm_ui_widgets$Internal$Item$imageItem = F2(
	function (s, _v0) {
		var onPress = _v0.u;
		var text = _v0.g;
		var image = _v0.fP;
		var content = _v0.bf;
		return A2(
			$Orasund$elm_ui_widgets$Internal$Item$toItem,
			s,
			function (style) {
				return A2(
					$mdgriffith$elm_ui$Element$Input$button,
					_Utils_ap(
						style.cc,
						_Utils_eq(onPress, $elm$core$Maybe$Nothing) ? style.bl : style.br),
					{
						bm: A2(
							$mdgriffith$elm_ui$Element$row,
							style.bf.cd,
							_List_fromArray(
								[
									A2($mdgriffith$elm_ui$Element$el, style.bf.bf.fP._, image),
									A2(
									$mdgriffith$elm_ui$Element$el,
									style.bf.bf.g.bi,
									A2(
										$mdgriffith$elm_ui$Element$paragraph,
										_List_Nil,
										$elm$core$List$singleton(
											$mdgriffith$elm_ui$Element$text(text)))),
									content(style.bf.bf.bf)
								])),
						u: onPress
					});
			});
	});
var $Orasund$elm_ui_widgets$Widget$imageItem = function () {
	var fun = $Orasund$elm_ui_widgets$Internal$Item$imageItem;
	return fun;
}();
var $mdgriffith$elm_ui$Element$padding = function (x) {
	var f = x;
	return A2(
		$mdgriffith$elm_ui$Internal$Model$StyleClass,
		$mdgriffith$elm_ui$Internal$Flag$padding,
		A5(
			$mdgriffith$elm_ui$Internal$Model$PaddingStyle,
			'p-' + $elm$core$String$fromInt(x),
			f,
			f,
			f,
			f));
};
var $Orasund$elm_ui_widgets$Internal$Material$Item$imageItem = function (palette) {
	return {
		bf: {
			bf: {
				bf: {
					bf: {
						dp: $Orasund$elm_ui_widgets$Internal$Material$Palette$gray(palette),
						ep: 24
					},
					fP: {
						_: _List_fromArray(
							[
								$mdgriffith$elm_ui$Element$width(
								$mdgriffith$elm_ui$Element$px(40)),
								$mdgriffith$elm_ui$Element$height(
								$mdgriffith$elm_ui$Element$px(40))
							])
					},
					g: {
						bi: _List_fromArray(
							[
								$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$fill)
							])
					}
				},
				cd: _List_fromArray(
					[
						$mdgriffith$elm_ui$Element$spacing(16),
						$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$fill)
					])
			},
			cc: _List_fromArray(
				[
					$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$fill),
					A2($mdgriffith$elm_ui$Element$paddingXY, 16, 8)
				]),
			bl: _List_fromArray(
				[
					$mdgriffith$elm_ui$Element$mouseDown(_List_Nil),
					$mdgriffith$elm_ui$Element$mouseOver(_List_Nil),
					$mdgriffith$elm_ui$Element$focused(_List_Nil),
					$mdgriffith$elm_ui$Element$htmlAttribute(
					A2($elm$html$Html$Attributes$style, 'cursor', 'default'))
				]),
			br: _List_fromArray(
				[
					$mdgriffith$elm_ui$Element$mouseDown(
					_List_fromArray(
						[
							$mdgriffith$elm_ui$Element$Background$color(
							$Orasund$elm_ui_widgets$Widget$Material$Color$fromColor(
								A2(
									$Orasund$elm_ui_widgets$Widget$Material$Color$scaleOpacity,
									$Orasund$elm_ui_widgets$Widget$Material$Color$buttonPressedOpacity,
									$Orasund$elm_ui_widgets$Internal$Material$Palette$gray(palette))))
						])),
					$mdgriffith$elm_ui$Element$focused(
					_List_fromArray(
						[
							$mdgriffith$elm_ui$Element$Background$color(
							$Orasund$elm_ui_widgets$Widget$Material$Color$fromColor(
								A2(
									$Orasund$elm_ui_widgets$Widget$Material$Color$scaleOpacity,
									$Orasund$elm_ui_widgets$Widget$Material$Color$buttonFocusOpacity,
									$Orasund$elm_ui_widgets$Internal$Material$Palette$gray(palette))))
						])),
					$mdgriffith$elm_ui$Element$mouseOver(
					_List_fromArray(
						[
							$mdgriffith$elm_ui$Element$Background$color(
							$Orasund$elm_ui_widgets$Widget$Material$Color$fromColor(
								A2(
									$Orasund$elm_ui_widgets$Widget$Material$Color$scaleOpacity,
									$Orasund$elm_ui_widgets$Widget$Material$Color$buttonHoverOpacity,
									$Orasund$elm_ui_widgets$Internal$Material$Palette$gray(palette))))
						]))
				])
		},
		_: _List_fromArray(
			[
				$mdgriffith$elm_ui$Element$padding(0)
			])
	};
};
var $Orasund$elm_ui_widgets$Widget$Material$imageItem = $Orasund$elm_ui_widgets$Internal$Material$Item$imageItem;
var $author$project$Chess$isInvitation = F2(
	function (vault, _v0) {
		var data = _v0.an;
		return A2(
			$elm$core$Maybe$withDefault,
			false,
			A2(
				$elm$core$Maybe$map,
				function (name) {
					return ((!data.E) && _Utils_eq(data.f, name)) ? true : (((!data.I) && _Utils_eq(data.m, name)) ? true : false);
				},
				$author$project$Matrix$username(vault)));
	});
var $Orasund$elm_ui_widgets$Internal$List$internal = F2(
	function (style, list) {
		return A2(
			$elm$core$List$indexedMap,
			F2(
				function (i, fun) {
					return fun(
						_Utils_ap(
							style._,
							($elm$core$List$length(list) === 1) ? style.ad : ((!i) ? style.ab : (_Utils_eq(
								i,
								$elm$core$List$length(list) - 1) ? style.ac : style.br))));
				}),
			list);
	});
var $Orasund$elm_ui_widgets$Internal$List$itemList = function (style) {
	return A2(
		$elm$core$Basics$composeR,
		$Orasund$elm_ui_widgets$Internal$List$internal(style.bf),
		$mdgriffith$elm_ui$Element$column(style.ds));
};
var $Orasund$elm_ui_widgets$Widget$itemList = function () {
	var fun = $Orasund$elm_ui_widgets$Internal$List$itemList;
	return fun;
}();
var $mdgriffith$elm_ui$Internal$Model$Max = F2(
	function (a, b) {
		return {$: 4, a: a, b: b};
	});
var $mdgriffith$elm_ui$Element$maximum = F2(
	function (i, l) {
		return A2($mdgriffith$elm_ui$Internal$Model$Max, i, l);
	});
var $author$project$Chess$myTurn = F2(
	function (vault, _v0) {
		var data = _v0.an;
		return A2(
			$elm$core$Maybe$withDefault,
			false,
			A2(
				$elm$core$Maybe$map,
				function (name) {
					return (data.E && data.I) ? (_Utils_eq(
						$pilatch$elm_chess$Position$sideToMove(
							$pilatch$elm_chess$Game$position(
								$pilatch$elm_chess$Game$toEnd(data.o))),
						$pilatch$elm_chess$PieceColor$black) ? _Utils_eq(name, data.f) : _Utils_eq(name, data.m)) : false;
				},
				$author$project$Matrix$username(vault)));
	});
var $author$project$Internal$Values$StateManager$getStateEvent = function (_v0) {
	var eventType = _v0.fB;
	var stateKey = _v0.gT;
	return $elm$core$Dict$get(
		_Utils_Tuple2(eventType, stateKey));
};
var $author$project$Internal$Values$Room$getStateEvent = F2(
	function (data, _v0) {
		var room = _v0;
		return A2(
			$author$project$Internal$Values$StateManager$getStateEvent,
			data,
			$author$project$Internal$Values$Timeline$mostRecentState(room.ba));
	});
var $author$project$Internal$Room$getStateEvent = F2(
	function (data, _v0) {
		var room = _v0.bu;
		var context = _v0.bP;
		return A2(
			$elm$core$Maybe$map,
			$author$project$Internal$Event$withCredentials(context),
			A2($author$project$Internal$Values$Room$getStateEvent, data, room));
	});
var $author$project$Matrix$Room$stateEvent = $author$project$Internal$Room$getStateEvent;
var $author$project$Chess$opponent = F2(
	function (vault, _v0) {
		var data = _v0.an;
		var room = _v0.bu;
		var nameOf = function (u) {
			return A2(
				$elm$core$Maybe$withDefault,
				u,
				A2(
					$elm$core$Maybe$andThen,
					A2(
						$elm$core$Basics$composeR,
						$elm$json$Json$Decode$decodeValue(
							A2($elm$json$Json$Decode$field, 'displayname', $elm$json$Json$Decode$string)),
						$elm$core$Result$toMaybe),
					A2(
						$elm$core$Maybe$map,
						$author$project$Matrix$Event$content,
						A2(
							$author$project$Matrix$Room$stateEvent,
							{fB: 'm.room.member', gT: u},
							room))));
		};
		var _v1 = $author$project$Matrix$username(vault);
		if (_v1.$ === 1) {
			return data.f;
		} else {
			var userId = _v1.a;
			return (_Utils_eq(userId, data.f) && _Utils_eq(userId, data.m)) ? 'Against yourself' : (_Utils_eq(userId, data.f) ? nameOf(data.m) : nameOf(data.f));
		}
	});
var $pilatch$elm_chess$Internal$Game$previousMove = function (game) {
	return $pilatch$elm_chess$Internal$Position$lastMove(
		$pilatch$elm_chess$Internal$Game$position(game));
};
var $pilatch$elm_chess$Game$previousMove = function (game) {
	var g = game;
	return $pilatch$elm_chess$Internal$Game$previousMove(g);
};
var $author$project$Colors$primaryPalette = {
	ai: $author$project$Colors$noordstarWhite,
	ao: $author$project$Colors$noordstarRed,
	bW: {ai: $avh4$elm_color$Color$black, ao: $avh4$elm_color$Color$white, av: $author$project$Colors$textOnPrimaryColor, ax: $author$project$Colors$textOnSecondaryColor, ay: $avh4$elm_color$Color$black},
	av: $author$project$Colors$primaryColor,
	ax: $author$project$Colors$secondaryColor,
	ay: $author$project$Colors$noordstarWhite
};
var $Orasund$elm_ui_widgets$Internal$Button$button = F2(
	function (style, _v0) {
		var onPress = _v0.u;
		var text = _v0.g;
		var icon = _v0.H;
		return A2(
			$mdgriffith$elm_ui$Element$Input$button,
			_Utils_ap(
				style.cc,
				_Utils_ap(
					_Utils_eq(onPress, $elm$core$Maybe$Nothing) ? style.bl : style.br,
					_List_fromArray(
						[
							$mdgriffith$elm_ui$Element$Region$description(text)
						]))),
			{
				bm: A2(
					$mdgriffith$elm_ui$Element$row,
					style.bf.cd,
					_List_fromArray(
						[
							icon(
							_Utils_eq(onPress, $elm$core$Maybe$Nothing) ? style.bf.bf.H.bl : style.bf.bf.H.br),
							A2(
							$mdgriffith$elm_ui$Element$el,
							style.bf.bf.g.fk,
							$mdgriffith$elm_ui$Element$text(text))
						])),
				u: onPress
			});
	});
var $Orasund$elm_ui_widgets$Internal$Button$textButton = F2(
	function (style, _v0) {
		var onPress = _v0.u;
		var text = _v0.g;
		return A2(
			$Orasund$elm_ui_widgets$Internal$Button$button,
			style,
			{
				H: $elm$core$Basics$always($mdgriffith$elm_ui$Element$none),
				u: onPress,
				g: text
			});
	});
var $Orasund$elm_ui_widgets$Widget$textButton = F2(
	function (style, _v0) {
		var text = _v0.g;
		var onPress = _v0.u;
		var fun = $Orasund$elm_ui_widgets$Internal$Button$textButton;
		return A2(
			fun,
			style,
			{u: onPress, g: text});
	});
var $Orasund$elm_ui_widgets$Internal$Material$Button$textButton = function (palette) {
	return {
		bf: {
			bf: {
				H: {
					fO: {dp: palette.av, ep: 18},
					bl: {
						dp: $Orasund$elm_ui_widgets$Internal$Material$Palette$gray(palette),
						ep: 18
					},
					br: {dp: palette.av, ep: 18}
				},
				g: {
					fk: function (b) {
						return b.bf.bf.g.fk;
					}(
						$Orasund$elm_ui_widgets$Internal$Material$Button$baseButton(palette))
				}
			},
			cd: function (b) {
				return b.bf.cd;
			}(
				$Orasund$elm_ui_widgets$Internal$Material$Button$baseButton(palette))
		},
		cc: _Utils_ap(
			$Orasund$elm_ui_widgets$Internal$Material$Button$baseButton(palette).cc,
			_List_fromArray(
				[
					$mdgriffith$elm_ui$Element$Font$color(
					$Orasund$elm_ui_widgets$Widget$Material$Color$fromColor(palette.av)),
					$mdgriffith$elm_ui$Element$mouseDown(
					_List_fromArray(
						[
							$mdgriffith$elm_ui$Element$Background$color(
							$Orasund$elm_ui_widgets$Widget$Material$Color$fromColor(
								A2($Orasund$elm_ui_widgets$Widget$Material$Color$scaleOpacity, $Orasund$elm_ui_widgets$Widget$Material$Color$buttonPressedOpacity, palette.av)))
						])),
					$mdgriffith$elm_ui$Element$focused(
					_List_fromArray(
						[
							$mdgriffith$elm_ui$Element$Background$color(
							$Orasund$elm_ui_widgets$Widget$Material$Color$fromColor(
								A2($Orasund$elm_ui_widgets$Widget$Material$Color$scaleOpacity, $Orasund$elm_ui_widgets$Widget$Material$Color$buttonFocusOpacity, palette.av)))
						])),
					$mdgriffith$elm_ui$Element$mouseOver(
					_List_fromArray(
						[
							$mdgriffith$elm_ui$Element$Background$color(
							$Orasund$elm_ui_widgets$Widget$Material$Color$fromColor(
								A2($Orasund$elm_ui_widgets$Widget$Material$Color$scaleOpacity, $Orasund$elm_ui_widgets$Widget$Material$Color$buttonHoverOpacity, palette.av)))
						]))
				])),
		fO: _List_fromArray(
			[
				$mdgriffith$elm_ui$Element$Background$color(
				$Orasund$elm_ui_widgets$Widget$Material$Color$fromColor(
					A2($Orasund$elm_ui_widgets$Widget$Material$Color$scaleOpacity, $Orasund$elm_ui_widgets$Widget$Material$Color$buttonHoverOpacity, palette.av)))
			]),
		bl: _Utils_ap(
			$Orasund$elm_ui_widgets$Internal$Material$Button$baseButton(palette).bl,
			_List_fromArray(
				[
					$mdgriffith$elm_ui$Element$Font$color(
					$Orasund$elm_ui_widgets$Widget$Material$Color$fromColor(
						$Orasund$elm_ui_widgets$Internal$Material$Palette$gray(palette))),
					$mdgriffith$elm_ui$Element$mouseDown(_List_Nil),
					$mdgriffith$elm_ui$Element$mouseOver(_List_Nil),
					$mdgriffith$elm_ui$Element$focused(_List_Nil)
				])),
		br: _List_Nil
	};
};
var $Orasund$elm_ui_widgets$Widget$Material$textButton = $Orasund$elm_ui_widgets$Internal$Material$Button$textButton;
var $author$project$View$loggedInScreen = F2(
	function (vault, model) {
		var knownGames = $author$project$Chess$getGames(vault);
		if (!model.$) {
			return A2(
				$mdgriffith$elm_ui$Element$el,
				_List_fromArray(
					[
						$mdgriffith$elm_ui$Element$width(
						A2($mdgriffith$elm_ui$Element$maximum, 750, $mdgriffith$elm_ui$Element$shrink)),
						$mdgriffith$elm_ui$Element$centerX
					]),
				A2(
					$mdgriffith$elm_ui$Element$el,
					$Orasund$elm_ui_widgets$Widget$Material$cardAttributes($Orasund$elm_ui_widgets$Widget$Material$defaultPalette),
					function (content) {
						return A2(
							$mdgriffith$elm_ui$Element$column,
							_List_fromArray(
								[
									$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$fill),
									$mdgriffith$elm_ui$Element$spacing(20)
								]),
							_List_fromArray(
								[
									A2(
									$mdgriffith$elm_ui$Element$el,
									_List_fromArray(
										[$mdgriffith$elm_ui$Element$alignRight]),
									A2(
										$Orasund$elm_ui_widgets$Widget$textButton,
										$Orasund$elm_ui_widgets$Widget$Material$textButton($author$project$Colors$darkPalette),
										{
											u: $elm$core$Maybe$Just(
												$author$project$Msg$LoggedIn(
													$author$project$Msg$EditCreateGameModal(
														{bu: $elm$core$Maybe$Nothing, aA: ''}))),
											g: 'CREATE'
										})),
									content
								]));
					}(
						function () {
							if (!knownGames.b) {
								return $mdgriffith$elm_ui$Element$text('I could not detect any games. Try to create one!');
							} else {
								return A2(
									$Orasund$elm_ui_widgets$Widget$itemList,
									$Orasund$elm_ui_widgets$Widget$Material$cardColumn($author$project$Colors$primaryPalette),
									A2(
										$elm$core$List$map,
										function (summary) {
											var data = summary.an;
											return A2(
												$Orasund$elm_ui_widgets$Widget$imageItem,
												$Orasund$elm_ui_widgets$Widget$Material$imageItem($author$project$Colors$primaryPalette),
												{
													bf: function (_v2) {
														var size = _v2.ep;
														var color = _v2.dp;
														return A2($author$project$Chess$isInvitation, vault, summary) ? A2(
															$mdgriffith$elm_ui$Element$row,
															_List_fromArray(
																[
																	$mdgriffith$elm_ui$Element$height(
																	$mdgriffith$elm_ui$Element$px(size))
																]),
															_List_fromArray(
																[
																	A2(
																	$Orasund$elm_ui_widgets$Widget$iconButton,
																	$Orasund$elm_ui_widgets$Widget$Material$containedButton(
																		function (d) {
																			return _Utils_update(
																				d,
																				{av: $author$project$Colors$noordstarGreen});
																		}($author$project$Colors$primaryPalette)),
																	{
																		H: $author$project$View$getIcon($icidasset$elm_material_icons$Material$Icons$done),
																		u: $elm$core$Maybe$Just(
																			$author$project$Msg$LoggedIn(
																				$author$project$Msg$AcceptGame(summary))),
																		g: 'Accept'
																	}),
																	A2(
																	$Orasund$elm_ui_widgets$Widget$iconButton,
																	$Orasund$elm_ui_widgets$Widget$Material$containedButton(
																		function (d) {
																			return _Utils_update(
																				d,
																				{av: $author$project$Colors$noordstarRed});
																		}($author$project$Colors$primaryPalette)),
																	{
																		H: $author$project$View$getIcon($icidasset$elm_material_icons$Material$Icons$close),
																		u: $elm$core$Maybe$Just(
																			$author$project$Msg$LoggedIn(
																				$author$project$Msg$RejectGame(summary))),
																		g: 'Reject'
																	})
																])) : (A2($author$project$Chess$myTurn, vault, summary) ? A2(
															$mdgriffith$elm_ui$Element$el,
															_List_fromArray(
																[
																	$author$project$Colors$background(color),
																	$author$project$Colors$font($author$project$Colors$noordstarWhite),
																	$mdgriffith$elm_ui$Element$height(
																	$mdgriffith$elm_ui$Element$px(size)),
																	$mdgriffith$elm_ui$Element$Border$rounded(15),
																	$mdgriffith$elm_ui$Element$padding(5)
																]),
															$mdgriffith$elm_ui$Element$text('YOUR TURN')) : $mdgriffith$elm_ui$Element$none);
													},
													fP: A2(
														$mdgriffith$elm_ui$Element$el,
														_List_fromArray(
															[
																$mdgriffith$elm_ui$Element$width(
																$mdgriffith$elm_ui$Element$px(40)),
																$mdgriffith$elm_ui$Element$height(
																$mdgriffith$elm_ui$Element$px(40))
															]),
														A4(
															$author$project$View$board,
															$pilatch$elm_chess$Game$position(data.o),
															_List_Nil,
															$pilatch$elm_chess$Game$previousMove(data.o),
															_Utils_eq(
																$author$project$Matrix$username(vault),
																$elm$core$Maybe$Just(summary.an.m)))),
													u: A2($author$project$Chess$isInvitation, vault, summary) ? $elm$core$Maybe$Nothing : $elm$core$Maybe$Just(
														$author$project$Msg$LoggedIn(
															$author$project$Msg$ViewGame(summary))),
													g: A2($author$project$Chess$opponent, vault, summary) + (' - turn ' + $elm$core$String$fromInt(
														$elm$core$List$length(
															$pilatch$elm_chess$Game$moves(data.o))))
												});
										},
										$elm$core$List$reverse(knownGames)));
							}
						}())));
		} else {
			var data = model.b;
			return A2(
				$mdgriffith$elm_ui$Element$el,
				_List_fromArray(
					[
						$mdgriffith$elm_ui$Element$width(
						A2($mdgriffith$elm_ui$Element$maximum, 500, $mdgriffith$elm_ui$Element$fill)),
						$mdgriffith$elm_ui$Element$centerX
					]),
				A2(
					$mdgriffith$elm_ui$Element$column,
					$Orasund$elm_ui_widgets$Widget$Material$cardAttributes($Orasund$elm_ui_widgets$Widget$Material$defaultPalette),
					_List_fromArray(
						[
							$author$project$View$boardTopMenu,
							A4(
							$author$project$View$board,
							$pilatch$elm_chess$Game$position(data.o.an.o),
							function () {
								var _v3 = data.R;
								if (_v3.$ === 1) {
									return _List_Nil;
								} else {
									var square = _v3.a;
									return A2(
										$elm$core$List$map,
										$pilatch$elm_chess$Move$to,
										A2(
											$pilatch$elm_chess$Position$movesFrom,
											square,
											$pilatch$elm_chess$Game$position(data.o.an.o)));
								}
							}(),
							$pilatch$elm_chess$Game$previousMove(data.o.an.o),
							data.b7),
							$author$project$View$boardMenu(data.o.an.o)
						])));
		}
	});
var $author$project$Msg$UpdateLogin = function (a) {
	return {$: 0, a: a};
};
var $author$project$Model$UsernameAndPasswordScreen = 0;
var $mdgriffith$elm_ui$Element$Input$TextInputNode = function (a) {
	return {$: 0, a: a};
};
var $mdgriffith$elm_ui$Element$Input$TextArea = {$: 1};
var $mdgriffith$elm_ui$Internal$Model$LivePolite = {$: 6};
var $mdgriffith$elm_ui$Element$Region$announce = $mdgriffith$elm_ui$Internal$Model$Describe($mdgriffith$elm_ui$Internal$Model$LivePolite);
var $mdgriffith$elm_ui$Element$Input$applyLabel = F3(
	function (attrs, label, input) {
		if (label.$ === 1) {
			var labelText = label.a;
			return A4(
				$mdgriffith$elm_ui$Internal$Model$element,
				$mdgriffith$elm_ui$Internal$Model$asColumn,
				$mdgriffith$elm_ui$Internal$Model$NodeName('label'),
				attrs,
				$mdgriffith$elm_ui$Internal$Model$Unkeyed(
					_List_fromArray(
						[input])));
		} else {
			var position = label.a;
			var labelAttrs = label.b;
			var labelChild = label.c;
			var labelElement = A4(
				$mdgriffith$elm_ui$Internal$Model$element,
				$mdgriffith$elm_ui$Internal$Model$asEl,
				$mdgriffith$elm_ui$Internal$Model$div,
				labelAttrs,
				$mdgriffith$elm_ui$Internal$Model$Unkeyed(
					_List_fromArray(
						[labelChild])));
			switch (position) {
				case 2:
					return A4(
						$mdgriffith$elm_ui$Internal$Model$element,
						$mdgriffith$elm_ui$Internal$Model$asColumn,
						$mdgriffith$elm_ui$Internal$Model$NodeName('label'),
						A2(
							$elm$core$List$cons,
							$mdgriffith$elm_ui$Internal$Model$htmlClass($mdgriffith$elm_ui$Internal$Style$classes.bS),
							attrs),
						$mdgriffith$elm_ui$Internal$Model$Unkeyed(
							_List_fromArray(
								[labelElement, input])));
				case 3:
					return A4(
						$mdgriffith$elm_ui$Internal$Model$element,
						$mdgriffith$elm_ui$Internal$Model$asColumn,
						$mdgriffith$elm_ui$Internal$Model$NodeName('label'),
						A2(
							$elm$core$List$cons,
							$mdgriffith$elm_ui$Internal$Model$htmlClass($mdgriffith$elm_ui$Internal$Style$classes.bS),
							attrs),
						$mdgriffith$elm_ui$Internal$Model$Unkeyed(
							_List_fromArray(
								[input, labelElement])));
				case 0:
					return A4(
						$mdgriffith$elm_ui$Internal$Model$element,
						$mdgriffith$elm_ui$Internal$Model$asRow,
						$mdgriffith$elm_ui$Internal$Model$NodeName('label'),
						A2(
							$elm$core$List$cons,
							$mdgriffith$elm_ui$Internal$Model$htmlClass($mdgriffith$elm_ui$Internal$Style$classes.bS),
							attrs),
						$mdgriffith$elm_ui$Internal$Model$Unkeyed(
							_List_fromArray(
								[input, labelElement])));
				default:
					return A4(
						$mdgriffith$elm_ui$Internal$Model$element,
						$mdgriffith$elm_ui$Internal$Model$asRow,
						$mdgriffith$elm_ui$Internal$Model$NodeName('label'),
						A2(
							$elm$core$List$cons,
							$mdgriffith$elm_ui$Internal$Model$htmlClass($mdgriffith$elm_ui$Internal$Style$classes.bS),
							attrs),
						$mdgriffith$elm_ui$Internal$Model$Unkeyed(
							_List_fromArray(
								[labelElement, input])));
			}
		}
	});
var $elm$html$Html$Attributes$attribute = $elm$virtual_dom$VirtualDom$attribute;
var $mdgriffith$elm_ui$Element$Input$autofill = A2(
	$elm$core$Basics$composeL,
	$mdgriffith$elm_ui$Internal$Model$Attr,
	$elm$html$Html$Attributes$attribute('autocomplete'));
var $mdgriffith$elm_ui$Internal$Model$Behind = 5;
var $mdgriffith$elm_ui$Element$createNearby = F2(
	function (loc, element) {
		if (element.$ === 3) {
			return $mdgriffith$elm_ui$Internal$Model$NoAttribute;
		} else {
			return A2($mdgriffith$elm_ui$Internal$Model$Nearby, loc, element);
		}
	});
var $mdgriffith$elm_ui$Element$behindContent = function (element) {
	return A2($mdgriffith$elm_ui$Element$createNearby, 5, element);
};
var $mdgriffith$elm_ui$Internal$Model$MoveY = function (a) {
	return {$: 1, a: a};
};
var $mdgriffith$elm_ui$Internal$Flag$moveY = $mdgriffith$elm_ui$Internal$Flag$flag(26);
var $mdgriffith$elm_ui$Element$moveUp = function (y) {
	return A2(
		$mdgriffith$elm_ui$Internal$Model$TransformComponent,
		$mdgriffith$elm_ui$Internal$Flag$moveY,
		$mdgriffith$elm_ui$Internal$Model$MoveY(-y));
};
var $mdgriffith$elm_ui$Element$Input$calcMoveToCompensateForPadding = function (attrs) {
	var gatherSpacing = F2(
		function (attr, found) {
			if ((attr.$ === 4) && (attr.b.$ === 5)) {
				var _v2 = attr.b;
				var x = _v2.b;
				var y = _v2.c;
				if (found.$ === 1) {
					return $elm$core$Maybe$Just(y);
				} else {
					return found;
				}
			} else {
				return found;
			}
		});
	var _v0 = A3($elm$core$List$foldr, gatherSpacing, $elm$core$Maybe$Nothing, attrs);
	if (_v0.$ === 1) {
		return $mdgriffith$elm_ui$Internal$Model$NoAttribute;
	} else {
		var vSpace = _v0.a;
		return $mdgriffith$elm_ui$Element$moveUp(
			$elm$core$Basics$floor(vSpace / 2));
	}
};
var $mdgriffith$elm_ui$Internal$Flag$overflow = $mdgriffith$elm_ui$Internal$Flag$flag(20);
var $mdgriffith$elm_ui$Element$clip = A2($mdgriffith$elm_ui$Internal$Model$Class, $mdgriffith$elm_ui$Internal$Flag$overflow, $mdgriffith$elm_ui$Internal$Style$classes.fg);
var $mdgriffith$elm_ui$Element$rgb = F3(
	function (r, g, b) {
		return A4($mdgriffith$elm_ui$Internal$Model$Rgba, r, g, b, 1);
	});
var $mdgriffith$elm_ui$Element$Input$darkGrey = A3($mdgriffith$elm_ui$Element$rgb, 186 / 255, 189 / 255, 182 / 255);
var $mdgriffith$elm_ui$Element$Input$defaultTextPadding = A2($mdgriffith$elm_ui$Element$paddingXY, 12, 12);
var $mdgriffith$elm_ui$Element$Input$white = A3($mdgriffith$elm_ui$Element$rgb, 1, 1, 1);
var $mdgriffith$elm_ui$Element$Input$defaultTextBoxStyle = _List_fromArray(
	[
		$mdgriffith$elm_ui$Element$Input$defaultTextPadding,
		$mdgriffith$elm_ui$Element$Border$rounded(3),
		$mdgriffith$elm_ui$Element$Border$color($mdgriffith$elm_ui$Element$Input$darkGrey),
		$mdgriffith$elm_ui$Element$Background$color($mdgriffith$elm_ui$Element$Input$white),
		$mdgriffith$elm_ui$Element$Border$width(1),
		$mdgriffith$elm_ui$Element$spacing(5),
		$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$fill),
		$mdgriffith$elm_ui$Element$height($mdgriffith$elm_ui$Element$shrink)
	]);
var $mdgriffith$elm_ui$Element$Input$getHeight = function (attr) {
	if (attr.$ === 8) {
		var h = attr.a;
		return $elm$core$Maybe$Just(h);
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $mdgriffith$elm_ui$Element$Input$hiddenLabelAttribute = function (label) {
	if (label.$ === 1) {
		var textLabel = label.a;
		return $mdgriffith$elm_ui$Internal$Model$Describe(
			$mdgriffith$elm_ui$Internal$Model$Label(textLabel));
	} else {
		return $mdgriffith$elm_ui$Internal$Model$NoAttribute;
	}
};
var $mdgriffith$elm_ui$Internal$Model$InFront = 4;
var $mdgriffith$elm_ui$Element$inFront = function (element) {
	return A2($mdgriffith$elm_ui$Element$createNearby, 4, element);
};
var $mdgriffith$elm_ui$Element$Input$isConstrained = function (len) {
	isConstrained:
	while (true) {
		switch (len.$) {
			case 1:
				return false;
			case 0:
				return true;
			case 2:
				return true;
			case 3:
				var l = len.b;
				var $temp$len = l;
				len = $temp$len;
				continue isConstrained;
			default:
				var l = len.b;
				return true;
		}
	}
};
var $mdgriffith$elm_ui$Element$Input$isHiddenLabel = function (label) {
	if (label.$ === 1) {
		return true;
	} else {
		return false;
	}
};
var $mdgriffith$elm_ui$Element$Input$isStacked = function (label) {
	if (!label.$) {
		var loc = label.a;
		switch (loc) {
			case 0:
				return false;
			case 1:
				return false;
			case 2:
				return true;
			default:
				return true;
		}
	} else {
		return true;
	}
};
var $mdgriffith$elm_ui$Element$Input$negateBox = function (box) {
	return {fb: -box.fb, f3: -box.f3, gB: -box.gB, hi: -box.hi};
};
var $elm$html$Html$Events$alwaysStop = function (x) {
	return _Utils_Tuple2(x, true);
};
var $elm$virtual_dom$VirtualDom$MayStopPropagation = function (a) {
	return {$: 1, a: a};
};
var $elm$html$Html$Events$stopPropagationOn = F2(
	function (event, decoder) {
		return A2(
			$elm$virtual_dom$VirtualDom$on,
			event,
			$elm$virtual_dom$VirtualDom$MayStopPropagation(decoder));
	});
var $elm$html$Html$Events$targetValue = A2(
	$elm$json$Json$Decode$at,
	_List_fromArray(
		['target', 'value']),
	$elm$json$Json$Decode$string);
var $elm$html$Html$Events$onInput = function (tagger) {
	return A2(
		$elm$html$Html$Events$stopPropagationOn,
		'input',
		A2(
			$elm$json$Json$Decode$map,
			$elm$html$Html$Events$alwaysStop,
			A2($elm$json$Json$Decode$map, tagger, $elm$html$Html$Events$targetValue)));
};
var $mdgriffith$elm_ui$Internal$Model$paddingName = F4(
	function (top, right, bottom, left) {
		return 'pad-' + ($elm$core$String$fromInt(top) + ('-' + ($elm$core$String$fromInt(right) + ('-' + ($elm$core$String$fromInt(bottom) + ('-' + $elm$core$String$fromInt(left)))))));
	});
var $mdgriffith$elm_ui$Element$paddingEach = function (_v0) {
	var top = _v0.hi;
	var right = _v0.gB;
	var bottom = _v0.fb;
	var left = _v0.f3;
	if (_Utils_eq(top, right) && (_Utils_eq(top, bottom) && _Utils_eq(top, left))) {
		var topFloat = top;
		return A2(
			$mdgriffith$elm_ui$Internal$Model$StyleClass,
			$mdgriffith$elm_ui$Internal$Flag$padding,
			A5(
				$mdgriffith$elm_ui$Internal$Model$PaddingStyle,
				'p-' + $elm$core$String$fromInt(top),
				topFloat,
				topFloat,
				topFloat,
				topFloat));
	} else {
		return A2(
			$mdgriffith$elm_ui$Internal$Model$StyleClass,
			$mdgriffith$elm_ui$Internal$Flag$padding,
			A5(
				$mdgriffith$elm_ui$Internal$Model$PaddingStyle,
				A4($mdgriffith$elm_ui$Internal$Model$paddingName, top, right, bottom, left),
				top,
				right,
				bottom,
				left));
	}
};
var $mdgriffith$elm_ui$Element$Input$isFill = function (len) {
	isFill:
	while (true) {
		switch (len.$) {
			case 2:
				return true;
			case 1:
				return false;
			case 0:
				return false;
			case 3:
				var l = len.b;
				var $temp$len = l;
				len = $temp$len;
				continue isFill;
			default:
				var l = len.b;
				var $temp$len = l;
				len = $temp$len;
				continue isFill;
		}
	}
};
var $mdgriffith$elm_ui$Element$Input$isPixel = function (len) {
	isPixel:
	while (true) {
		switch (len.$) {
			case 1:
				return false;
			case 0:
				return true;
			case 2:
				return false;
			case 3:
				var l = len.b;
				var $temp$len = l;
				len = $temp$len;
				continue isPixel;
			default:
				var l = len.b;
				var $temp$len = l;
				len = $temp$len;
				continue isPixel;
		}
	}
};
var $mdgriffith$elm_ui$Internal$Model$paddingNameFloat = F4(
	function (top, right, bottom, left) {
		return 'pad-' + ($mdgriffith$elm_ui$Internal$Model$floatClass(top) + ('-' + ($mdgriffith$elm_ui$Internal$Model$floatClass(right) + ('-' + ($mdgriffith$elm_ui$Internal$Model$floatClass(bottom) + ('-' + $mdgriffith$elm_ui$Internal$Model$floatClass(left)))))));
	});
var $mdgriffith$elm_ui$Element$Input$redistributeOver = F4(
	function (isMultiline, stacked, attr, els) {
		switch (attr.$) {
			case 9:
				return _Utils_update(
					els,
					{
						a: A2($elm$core$List$cons, attr, els.a)
					});
			case 7:
				var width = attr.a;
				return $mdgriffith$elm_ui$Element$Input$isFill(width) ? _Utils_update(
					els,
					{
						d: A2($elm$core$List$cons, attr, els.d),
						k: A2($elm$core$List$cons, attr, els.k),
						a: A2($elm$core$List$cons, attr, els.a)
					}) : (stacked ? _Utils_update(
					els,
					{
						d: A2($elm$core$List$cons, attr, els.d)
					}) : _Utils_update(
					els,
					{
						a: A2($elm$core$List$cons, attr, els.a)
					}));
			case 8:
				var height = attr.a;
				return (!stacked) ? _Utils_update(
					els,
					{
						d: A2($elm$core$List$cons, attr, els.d),
						a: A2($elm$core$List$cons, attr, els.a)
					}) : ($mdgriffith$elm_ui$Element$Input$isFill(height) ? _Utils_update(
					els,
					{
						d: A2($elm$core$List$cons, attr, els.d),
						a: A2($elm$core$List$cons, attr, els.a)
					}) : ($mdgriffith$elm_ui$Element$Input$isPixel(height) ? _Utils_update(
					els,
					{
						a: A2($elm$core$List$cons, attr, els.a)
					}) : _Utils_update(
					els,
					{
						a: A2($elm$core$List$cons, attr, els.a)
					})));
			case 6:
				return _Utils_update(
					els,
					{
						d: A2($elm$core$List$cons, attr, els.d)
					});
			case 5:
				return _Utils_update(
					els,
					{
						d: A2($elm$core$List$cons, attr, els.d)
					});
			case 4:
				switch (attr.b.$) {
					case 5:
						var _v1 = attr.b;
						return _Utils_update(
							els,
							{
								d: A2($elm$core$List$cons, attr, els.d),
								k: A2($elm$core$List$cons, attr, els.k),
								a: A2($elm$core$List$cons, attr, els.a),
								bc: A2($elm$core$List$cons, attr, els.bc)
							});
					case 7:
						var cls = attr.a;
						var _v2 = attr.b;
						var pad = _v2.a;
						var t = _v2.b;
						var r = _v2.c;
						var b = _v2.d;
						var l = _v2.e;
						if (isMultiline) {
							return _Utils_update(
								els,
								{
									w: A2($elm$core$List$cons, attr, els.w),
									a: A2($elm$core$List$cons, attr, els.a)
								});
						} else {
							var newTop = t - A2($elm$core$Basics$min, t, b);
							var newLineHeight = $mdgriffith$elm_ui$Element$htmlAttribute(
								A2(
									$elm$html$Html$Attributes$style,
									'line-height',
									'calc(1.0em + ' + ($elm$core$String$fromFloat(
										2 * A2($elm$core$Basics$min, t, b)) + 'px)')));
							var newHeight = $mdgriffith$elm_ui$Element$htmlAttribute(
								A2(
									$elm$html$Html$Attributes$style,
									'height',
									'calc(1.0em + ' + ($elm$core$String$fromFloat(
										2 * A2($elm$core$Basics$min, t, b)) + 'px)')));
							var newBottom = b - A2($elm$core$Basics$min, t, b);
							var reducedVerticalPadding = A2(
								$mdgriffith$elm_ui$Internal$Model$StyleClass,
								$mdgriffith$elm_ui$Internal$Flag$padding,
								A5(
									$mdgriffith$elm_ui$Internal$Model$PaddingStyle,
									A4($mdgriffith$elm_ui$Internal$Model$paddingNameFloat, newTop, r, newBottom, l),
									newTop,
									r,
									newBottom,
									l));
							return _Utils_update(
								els,
								{
									w: A2($elm$core$List$cons, attr, els.w),
									k: A2(
										$elm$core$List$cons,
										newHeight,
										A2($elm$core$List$cons, newLineHeight, els.k)),
									a: A2($elm$core$List$cons, reducedVerticalPadding, els.a)
								});
						}
					case 6:
						var _v3 = attr.b;
						return _Utils_update(
							els,
							{
								w: A2($elm$core$List$cons, attr, els.w),
								a: A2($elm$core$List$cons, attr, els.a)
							});
					case 10:
						return _Utils_update(
							els,
							{
								w: A2($elm$core$List$cons, attr, els.w),
								a: A2($elm$core$List$cons, attr, els.a)
							});
					case 2:
						return _Utils_update(
							els,
							{
								d: A2($elm$core$List$cons, attr, els.d)
							});
					case 1:
						var _v4 = attr.b;
						return _Utils_update(
							els,
							{
								d: A2($elm$core$List$cons, attr, els.d)
							});
					default:
						var flag = attr.a;
						var cls = attr.b;
						return _Utils_update(
							els,
							{
								a: A2($elm$core$List$cons, attr, els.a)
							});
				}
			case 0:
				return els;
			case 1:
				var a = attr.a;
				return _Utils_update(
					els,
					{
						k: A2($elm$core$List$cons, attr, els.k)
					});
			case 2:
				return _Utils_update(
					els,
					{
						k: A2($elm$core$List$cons, attr, els.k)
					});
			case 3:
				return _Utils_update(
					els,
					{
						a: A2($elm$core$List$cons, attr, els.a)
					});
			default:
				return _Utils_update(
					els,
					{
						k: A2($elm$core$List$cons, attr, els.k)
					});
		}
	});
var $mdgriffith$elm_ui$Element$Input$redistribute = F3(
	function (isMultiline, stacked, attrs) {
		return function (redist) {
			return {
				w: $elm$core$List$reverse(redist.w),
				d: $elm$core$List$reverse(redist.d),
				k: $elm$core$List$reverse(redist.k),
				a: $elm$core$List$reverse(redist.a),
				bc: $elm$core$List$reverse(redist.bc)
			};
		}(
			A3(
				$elm$core$List$foldl,
				A2($mdgriffith$elm_ui$Element$Input$redistributeOver, isMultiline, stacked),
				{w: _List_Nil, d: _List_Nil, k: _List_Nil, a: _List_Nil, bc: _List_Nil},
				attrs));
	});
var $mdgriffith$elm_ui$Element$Input$renderBox = function (_v0) {
	var top = _v0.hi;
	var right = _v0.gB;
	var bottom = _v0.fb;
	var left = _v0.f3;
	return $elm$core$String$fromInt(top) + ('px ' + ($elm$core$String$fromInt(right) + ('px ' + ($elm$core$String$fromInt(bottom) + ('px ' + ($elm$core$String$fromInt(left) + 'px'))))));
};
var $mdgriffith$elm_ui$Internal$Model$Transparency = F2(
	function (a, b) {
		return {$: 12, a: a, b: b};
	});
var $mdgriffith$elm_ui$Internal$Flag$transparency = $mdgriffith$elm_ui$Internal$Flag$flag(0);
var $mdgriffith$elm_ui$Element$alpha = function (o) {
	var transparency = function (x) {
		return 1 - x;
	}(
		A2(
			$elm$core$Basics$min,
			1.0,
			A2($elm$core$Basics$max, 0.0, o)));
	return A2(
		$mdgriffith$elm_ui$Internal$Model$StyleClass,
		$mdgriffith$elm_ui$Internal$Flag$transparency,
		A2(
			$mdgriffith$elm_ui$Internal$Model$Transparency,
			'transparency-' + $mdgriffith$elm_ui$Internal$Model$floatClass(transparency),
			transparency));
};
var $mdgriffith$elm_ui$Element$Input$charcoal = A3($mdgriffith$elm_ui$Element$rgb, 136 / 255, 138 / 255, 133 / 255);
var $mdgriffith$elm_ui$Element$rgba = $mdgriffith$elm_ui$Internal$Model$Rgba;
var $mdgriffith$elm_ui$Element$Input$renderPlaceholder = F3(
	function (_v0, forPlaceholder, on) {
		var placeholderAttrs = _v0.a;
		var placeholderEl = _v0.b;
		return A2(
			$mdgriffith$elm_ui$Element$el,
			_Utils_ap(
				forPlaceholder,
				_Utils_ap(
					_List_fromArray(
						[
							$mdgriffith$elm_ui$Element$Font$color($mdgriffith$elm_ui$Element$Input$charcoal),
							$mdgriffith$elm_ui$Internal$Model$htmlClass($mdgriffith$elm_ui$Internal$Style$classes.dX + (' ' + $mdgriffith$elm_ui$Internal$Style$classes.gr)),
							$mdgriffith$elm_ui$Element$clip,
							$mdgriffith$elm_ui$Element$Border$color(
							A4($mdgriffith$elm_ui$Element$rgba, 0, 0, 0, 0)),
							$mdgriffith$elm_ui$Element$Background$color(
							A4($mdgriffith$elm_ui$Element$rgba, 0, 0, 0, 0)),
							$mdgriffith$elm_ui$Element$height($mdgriffith$elm_ui$Element$fill),
							$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$fill),
							$mdgriffith$elm_ui$Element$alpha(
							on ? 1 : 0)
						]),
					placeholderAttrs)),
			placeholderEl);
	});
var $mdgriffith$elm_ui$Element$scrollbarY = A2($mdgriffith$elm_ui$Internal$Model$Class, $mdgriffith$elm_ui$Internal$Flag$overflow, $mdgriffith$elm_ui$Internal$Style$classes.gJ);
var $elm$html$Html$span = _VirtualDom_node('span');
var $elm$html$Html$Attributes$spellcheck = $elm$html$Html$Attributes$boolProperty('spellcheck');
var $mdgriffith$elm_ui$Element$Input$spellcheck = A2($elm$core$Basics$composeL, $mdgriffith$elm_ui$Internal$Model$Attr, $elm$html$Html$Attributes$spellcheck);
var $elm$html$Html$Attributes$type_ = $elm$html$Html$Attributes$stringProperty('type');
var $elm$html$Html$Attributes$value = $elm$html$Html$Attributes$stringProperty('value');
var $mdgriffith$elm_ui$Element$Input$value = A2($elm$core$Basics$composeL, $mdgriffith$elm_ui$Internal$Model$Attr, $elm$html$Html$Attributes$value);
var $mdgriffith$elm_ui$Element$Input$textHelper = F3(
	function (textInput, attrs, textOptions) {
		var withDefaults = _Utils_ap($mdgriffith$elm_ui$Element$Input$defaultTextBoxStyle, attrs);
		var redistributed = A3(
			$mdgriffith$elm_ui$Element$Input$redistribute,
			_Utils_eq(textInput.t, $mdgriffith$elm_ui$Element$Input$TextArea),
			$mdgriffith$elm_ui$Element$Input$isStacked(textOptions.bm),
			withDefaults);
		var onlySpacing = function (attr) {
			if ((attr.$ === 4) && (attr.b.$ === 5)) {
				var _v9 = attr.b;
				return true;
			} else {
				return false;
			}
		};
		var heightConstrained = function () {
			var _v7 = textInput.t;
			if (!_v7.$) {
				var inputType = _v7.a;
				return false;
			} else {
				return A2(
					$elm$core$Maybe$withDefault,
					false,
					A2(
						$elm$core$Maybe$map,
						$mdgriffith$elm_ui$Element$Input$isConstrained,
						$elm$core$List$head(
							$elm$core$List$reverse(
								A2($elm$core$List$filterMap, $mdgriffith$elm_ui$Element$Input$getHeight, withDefaults)))));
			}
		}();
		var getPadding = function (attr) {
			if ((attr.$ === 4) && (attr.b.$ === 7)) {
				var cls = attr.a;
				var _v6 = attr.b;
				var pad = _v6.a;
				var t = _v6.b;
				var r = _v6.c;
				var b = _v6.d;
				var l = _v6.e;
				return $elm$core$Maybe$Just(
					{
						fb: A2(
							$elm$core$Basics$max,
							0,
							$elm$core$Basics$floor(b - 3)),
						f3: A2(
							$elm$core$Basics$max,
							0,
							$elm$core$Basics$floor(l - 3)),
						gB: A2(
							$elm$core$Basics$max,
							0,
							$elm$core$Basics$floor(r - 3)),
						hi: A2(
							$elm$core$Basics$max,
							0,
							$elm$core$Basics$floor(t - 3))
					});
			} else {
				return $elm$core$Maybe$Nothing;
			}
		};
		var parentPadding = A2(
			$elm$core$Maybe$withDefault,
			{fb: 0, f3: 0, gB: 0, hi: 0},
			$elm$core$List$head(
				$elm$core$List$reverse(
					A2($elm$core$List$filterMap, getPadding, withDefaults))));
		var inputElement = A4(
			$mdgriffith$elm_ui$Internal$Model$element,
			$mdgriffith$elm_ui$Internal$Model$asEl,
			function () {
				var _v3 = textInput.t;
				if (!_v3.$) {
					var inputType = _v3.a;
					return $mdgriffith$elm_ui$Internal$Model$NodeName('input');
				} else {
					return $mdgriffith$elm_ui$Internal$Model$NodeName('textarea');
				}
			}(),
			_Utils_ap(
				function () {
					var _v4 = textInput.t;
					if (!_v4.$) {
						var inputType = _v4.a;
						return _List_fromArray(
							[
								$mdgriffith$elm_ui$Internal$Model$Attr(
								$elm$html$Html$Attributes$type_(inputType)),
								$mdgriffith$elm_ui$Internal$Model$htmlClass($mdgriffith$elm_ui$Internal$Style$classes.fZ)
							]);
					} else {
						return _List_fromArray(
							[
								$mdgriffith$elm_ui$Element$clip,
								$mdgriffith$elm_ui$Element$height($mdgriffith$elm_ui$Element$fill),
								$mdgriffith$elm_ui$Internal$Model$htmlClass($mdgriffith$elm_ui$Internal$Style$classes.fV),
								$mdgriffith$elm_ui$Element$Input$calcMoveToCompensateForPadding(withDefaults),
								$mdgriffith$elm_ui$Element$paddingEach(parentPadding),
								$mdgriffith$elm_ui$Internal$Model$Attr(
								A2(
									$elm$html$Html$Attributes$style,
									'margin',
									$mdgriffith$elm_ui$Element$Input$renderBox(
										$mdgriffith$elm_ui$Element$Input$negateBox(parentPadding)))),
								$mdgriffith$elm_ui$Internal$Model$Attr(
								A2($elm$html$Html$Attributes$style, 'box-sizing', 'content-box'))
							]);
					}
				}(),
				_Utils_ap(
					_List_fromArray(
						[
							$mdgriffith$elm_ui$Element$Input$value(textOptions.g),
							$mdgriffith$elm_ui$Internal$Model$Attr(
							$elm$html$Html$Events$onInput(textOptions.bq)),
							$mdgriffith$elm_ui$Element$Input$hiddenLabelAttribute(textOptions.bm),
							$mdgriffith$elm_ui$Element$Input$spellcheck(textInput.T),
							A2(
							$elm$core$Maybe$withDefault,
							$mdgriffith$elm_ui$Internal$Model$NoAttribute,
							A2($elm$core$Maybe$map, $mdgriffith$elm_ui$Element$Input$autofill, textInput.K))
						]),
					redistributed.k)),
			$mdgriffith$elm_ui$Internal$Model$Unkeyed(_List_Nil));
		var wrappedInput = function () {
			var _v0 = textInput.t;
			if (_v0.$ === 1) {
				return A4(
					$mdgriffith$elm_ui$Internal$Model$element,
					$mdgriffith$elm_ui$Internal$Model$asEl,
					$mdgriffith$elm_ui$Internal$Model$div,
					_Utils_ap(
						(heightConstrained ? $elm$core$List$cons($mdgriffith$elm_ui$Element$scrollbarY) : $elm$core$Basics$identity)(
							_List_fromArray(
								[
									$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$fill),
									A2($elm$core$List$any, $mdgriffith$elm_ui$Element$Input$hasFocusStyle, withDefaults) ? $mdgriffith$elm_ui$Internal$Model$NoAttribute : $mdgriffith$elm_ui$Internal$Model$htmlClass($mdgriffith$elm_ui$Internal$Style$classes.dy),
									$mdgriffith$elm_ui$Internal$Model$htmlClass($mdgriffith$elm_ui$Internal$Style$classes.fY)
								])),
						redistributed.a),
					$mdgriffith$elm_ui$Internal$Model$Unkeyed(
						_List_fromArray(
							[
								A4(
								$mdgriffith$elm_ui$Internal$Model$element,
								$mdgriffith$elm_ui$Internal$Model$asParagraph,
								$mdgriffith$elm_ui$Internal$Model$div,
								A2(
									$elm$core$List$cons,
									$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$fill),
									A2(
										$elm$core$List$cons,
										$mdgriffith$elm_ui$Element$height($mdgriffith$elm_ui$Element$fill),
										A2(
											$elm$core$List$cons,
											$mdgriffith$elm_ui$Element$inFront(inputElement),
											A2(
												$elm$core$List$cons,
												$mdgriffith$elm_ui$Internal$Model$htmlClass($mdgriffith$elm_ui$Internal$Style$classes.fX),
												redistributed.bc)))),
								$mdgriffith$elm_ui$Internal$Model$Unkeyed(
									function () {
										if (textOptions.g === '') {
											var _v1 = textOptions.bs;
											if (_v1.$ === 1) {
												return _List_fromArray(
													[
														$mdgriffith$elm_ui$Element$text('\u00A0')
													]);
											} else {
												var place = _v1.a;
												return _List_fromArray(
													[
														A3($mdgriffith$elm_ui$Element$Input$renderPlaceholder, place, _List_Nil, textOptions.g === '')
													]);
											}
										} else {
											return _List_fromArray(
												[
													$mdgriffith$elm_ui$Internal$Model$unstyled(
													A2(
														$elm$html$Html$span,
														_List_fromArray(
															[
																$elm$html$Html$Attributes$class($mdgriffith$elm_ui$Internal$Style$classes.fW)
															]),
														_List_fromArray(
															[
																$elm$html$Html$text(textOptions.g + '\u00A0')
															])))
												]);
										}
									}()))
							])));
			} else {
				var inputType = _v0.a;
				return A4(
					$mdgriffith$elm_ui$Internal$Model$element,
					$mdgriffith$elm_ui$Internal$Model$asEl,
					$mdgriffith$elm_ui$Internal$Model$div,
					A2(
						$elm$core$List$cons,
						$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$fill),
						A2(
							$elm$core$List$cons,
							A2($elm$core$List$any, $mdgriffith$elm_ui$Element$Input$hasFocusStyle, withDefaults) ? $mdgriffith$elm_ui$Internal$Model$NoAttribute : $mdgriffith$elm_ui$Internal$Model$htmlClass($mdgriffith$elm_ui$Internal$Style$classes.dy),
							$elm$core$List$concat(
								_List_fromArray(
									[
										redistributed.a,
										function () {
										var _v2 = textOptions.bs;
										if (_v2.$ === 1) {
											return _List_Nil;
										} else {
											var place = _v2.a;
											return _List_fromArray(
												[
													$mdgriffith$elm_ui$Element$behindContent(
													A3($mdgriffith$elm_ui$Element$Input$renderPlaceholder, place, redistributed.w, textOptions.g === ''))
												]);
										}
									}()
									])))),
					$mdgriffith$elm_ui$Internal$Model$Unkeyed(
						_List_fromArray(
							[inputElement])));
			}
		}();
		return A3(
			$mdgriffith$elm_ui$Element$Input$applyLabel,
			A2(
				$elm$core$List$cons,
				A2($mdgriffith$elm_ui$Internal$Model$Class, $mdgriffith$elm_ui$Internal$Flag$cursor, $mdgriffith$elm_ui$Internal$Style$classes.fo),
				A2(
					$elm$core$List$cons,
					$mdgriffith$elm_ui$Element$Input$isHiddenLabel(textOptions.bm) ? $mdgriffith$elm_ui$Internal$Model$NoAttribute : $mdgriffith$elm_ui$Element$spacing(5),
					A2($elm$core$List$cons, $mdgriffith$elm_ui$Element$Region$announce, redistributed.d))),
			textOptions.bm,
			wrappedInput);
	});
var $mdgriffith$elm_ui$Element$Input$currentPassword = F2(
	function (attrs, pass) {
		return A3(
			$mdgriffith$elm_ui$Element$Input$textHelper,
			{
				K: $elm$core$Maybe$Just('current-password'),
				T: false,
				t: $mdgriffith$elm_ui$Element$Input$TextInputNode(
					pass.eo ? 'text' : 'password')
			},
			attrs,
			{bm: pass.bm, bq: pass.bq, bs: pass.bs, g: pass.g});
	});
var $mdgriffith$elm_ui$Element$Input$HiddenLabel = function (a) {
	return {$: 1, a: a};
};
var $mdgriffith$elm_ui$Element$Input$labelHidden = $mdgriffith$elm_ui$Element$Input$HiddenLabel;
var $Orasund$elm_ui_widgets$Internal$PasswordInput$password = F3(
	function (input, style, _v0) {
		var placeholder = _v0.bs;
		var label = _v0.bm;
		var text = _v0.g;
		var onChange = _v0.bq;
		var show = _v0.eo;
		return A2(
			$mdgriffith$elm_ui$Element$row,
			style.cd,
			_List_fromArray(
				[
					A2(
					input,
					style.bf.as.dt,
					{
						bm: $mdgriffith$elm_ui$Element$Input$labelHidden(label),
						bq: onChange,
						bs: placeholder,
						eo: show,
						g: text
					})
				]));
	});
var $Orasund$elm_ui_widgets$Internal$PasswordInput$currentPasswordInput = $Orasund$elm_ui_widgets$Internal$PasswordInput$password($mdgriffith$elm_ui$Element$Input$currentPassword);
var $Orasund$elm_ui_widgets$Widget$currentPasswordInputV2 = function () {
	var fun = $Orasund$elm_ui_widgets$Internal$PasswordInput$currentPasswordInput;
	return fun;
}();
var $Orasund$elm_ui_widgets$Widget$Material$Color$textAndBackground = function (color) {
	return _List_fromArray(
		[
			$mdgriffith$elm_ui$Element$Background$color(
			$Orasund$elm_ui_widgets$Widget$Material$Color$fromColor(color)),
			$mdgriffith$elm_ui$Element$Font$color(
			$Orasund$elm_ui_widgets$Widget$Material$Color$fromColor(
				$Orasund$elm_ui_widgets$Widget$Material$Color$accessibleTextColor(color)))
		]);
};
var $Orasund$elm_ui_widgets$Internal$Material$PasswordInput$passwordInput = function (palette) {
	return {
		bf: {
			as: {
				dt: _Utils_ap(
					$Orasund$elm_ui_widgets$Widget$Material$Color$textAndBackground(palette.ay),
					_List_fromArray(
						[
							$mdgriffith$elm_ui$Element$Border$width(0),
							$mdgriffith$elm_ui$Element$mouseOver(_List_Nil),
							$mdgriffith$elm_ui$Element$focused(_List_Nil),
							$mdgriffith$elm_ui$Element$centerY
						]))
			}
		},
		cd: _Utils_ap(
			$Orasund$elm_ui_widgets$Widget$Material$Color$textAndBackground(palette.ay),
			_List_fromArray(
				[
					$mdgriffith$elm_ui$Element$spacing(8),
					A2($mdgriffith$elm_ui$Element$paddingXY, 8, 0),
					$mdgriffith$elm_ui$Element$Border$width(1),
					$mdgriffith$elm_ui$Element$Border$rounded(4),
					$mdgriffith$elm_ui$Element$Border$color(
					$Orasund$elm_ui_widgets$Widget$Material$Color$fromColor(
						A2($Orasund$elm_ui_widgets$Widget$Material$Color$scaleOpacity, 0.14, palette.bW.ay))),
					$mdgriffith$elm_ui$Element$focused(
					_List_fromArray(
						[
							$mdgriffith$elm_ui$Element$Border$shadow(
							$Orasund$elm_ui_widgets$Widget$Material$Color$shadow(4)),
							$mdgriffith$elm_ui$Element$Border$color(
							$Orasund$elm_ui_widgets$Widget$Material$Color$fromColor(palette.av))
						])),
					$mdgriffith$elm_ui$Element$mouseOver(
					_List_fromArray(
						[
							$mdgriffith$elm_ui$Element$Border$shadow(
							$Orasund$elm_ui_widgets$Widget$Material$Color$shadow(2))
						])),
					$mdgriffith$elm_ui$Element$width(
					$mdgriffith$elm_ui$Element$px(280))
				]))
	};
};
var $Orasund$elm_ui_widgets$Widget$Material$passwordInput = $Orasund$elm_ui_widgets$Internal$Material$PasswordInput$passwordInput;
var $mdgriffith$elm_ui$Element$Input$Placeholder = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var $mdgriffith$elm_ui$Element$Input$placeholder = $mdgriffith$elm_ui$Element$Input$Placeholder;
var $author$project$View$accessTokenField = F2(
	function (model, editable) {
		return A2(
			$mdgriffith$elm_ui$Element$el,
			_List_fromArray(
				[$mdgriffith$elm_ui$Element$centerX]),
			A2(
				$Orasund$elm_ui_widgets$Widget$currentPasswordInputV2,
				$Orasund$elm_ui_widgets$Widget$Material$passwordInput(
					editable ? $author$project$Colors$primaryPalette : $author$project$Colors$primaryPalette),
				{
					bm: 'Access token',
					bq: function (accessToken) {
						return editable ? $author$project$Msg$UpdateLogin(
							_Utils_update(
								model,
								{b0: accessToken})) : $author$project$Msg$UpdateLogin(model);
					},
					bs: $elm$core$Maybe$Just(
						A2(
							$mdgriffith$elm_ui$Element$Input$placeholder,
							_List_Nil,
							$mdgriffith$elm_ui$Element$text('Access token'))),
					eo: false,
					g: model.b0
				}));
	});
var $Orasund$elm_ui_widgets$Internal$TextInput$internal = F3(
	function (fun, style, _v0) {
		var chips = _v0.b8;
		var placeholder = _v0.bs;
		var label = _v0.bm;
		var text = _v0.g;
		var onChange = _v0.bq;
		return A2(
			$mdgriffith$elm_ui$Element$row,
			style.cd,
			_List_fromArray(
				[
					$elm$core$List$isEmpty(chips) ? $mdgriffith$elm_ui$Element$none : A2(
					$mdgriffith$elm_ui$Element$row,
					style.bf.b8.cd,
					A2(
						$elm$core$List$map,
						$Orasund$elm_ui_widgets$Internal$Button$button(style.bf.b8.bf),
						chips)),
					A2(
					fun,
					style.bf.g.ce,
					{
						bm: $mdgriffith$elm_ui$Element$Input$labelHidden(label),
						bq: onChange,
						bs: placeholder,
						g: text
					})
				]));
	});
var $mdgriffith$elm_ui$Element$Input$text = $mdgriffith$elm_ui$Element$Input$textHelper(
	{
		K: $elm$core$Maybe$Nothing,
		T: false,
		t: $mdgriffith$elm_ui$Element$Input$TextInputNode('text')
	});
var $Orasund$elm_ui_widgets$Internal$TextInput$textInput = $Orasund$elm_ui_widgets$Internal$TextInput$internal($mdgriffith$elm_ui$Element$Input$text);
var $Orasund$elm_ui_widgets$Widget$textInput = function () {
	var fun = $Orasund$elm_ui_widgets$Internal$TextInput$textInput;
	return fun;
}();
var $Orasund$elm_ui_widgets$Widget$Material$Color$buttonSelectedOpacity = 0.16;
var $Orasund$elm_ui_widgets$Internal$Material$Palette$lightGray = function (palette) {
	return A3($Orasund$elm_ui_widgets$Widget$Material$Color$withShade, palette.bW.ay, 0.14, palette.ay);
};
var $Orasund$elm_ui_widgets$Internal$Material$Chip$chip = function (palette) {
	return {
		bf: {
			bf: {
				H: {
					fO: {
						dp: $Orasund$elm_ui_widgets$Widget$Material$Color$accessibleTextColor(
							$Orasund$elm_ui_widgets$Internal$Material$Palette$lightGray(palette)),
						ep: 18
					},
					bl: {
						dp: $Orasund$elm_ui_widgets$Widget$Material$Color$accessibleTextColor(
							$Orasund$elm_ui_widgets$Internal$Material$Palette$lightGray(palette)),
						ep: 18
					},
					br: {
						dp: $Orasund$elm_ui_widgets$Widget$Material$Color$accessibleTextColor(
							$Orasund$elm_ui_widgets$Internal$Material$Palette$lightGray(palette)),
						ep: 18
					}
				},
				g: {fk: _List_Nil}
			},
			cd: _List_fromArray(
				[
					$mdgriffith$elm_ui$Element$spacing(8),
					$mdgriffith$elm_ui$Element$paddingEach(
					{fb: 0, f3: 8, gB: 0, hi: 0}),
					$mdgriffith$elm_ui$Element$centerY
				])
		},
		cc: _List_fromArray(
			[
				$mdgriffith$elm_ui$Element$height(
				$mdgriffith$elm_ui$Element$px(32)),
				$mdgriffith$elm_ui$Element$paddingEach(
				{fb: 0, f3: 4, gB: 12, hi: 0}),
				$mdgriffith$elm_ui$Element$Border$rounded(16),
				$mdgriffith$elm_ui$Element$mouseDown(
				_List_fromArray(
					[
						$mdgriffith$elm_ui$Element$Background$color(
						$Orasund$elm_ui_widgets$Widget$Material$Color$fromColor(
							A3(
								$Orasund$elm_ui_widgets$Widget$Material$Color$withShade,
								palette.bW.ay,
								$Orasund$elm_ui_widgets$Widget$Material$Color$buttonPressedOpacity,
								$Orasund$elm_ui_widgets$Internal$Material$Palette$lightGray(palette))))
					])),
				$mdgriffith$elm_ui$Element$focused(
				_List_fromArray(
					[
						$mdgriffith$elm_ui$Element$Background$color(
						$Orasund$elm_ui_widgets$Widget$Material$Color$fromColor(
							A3(
								$Orasund$elm_ui_widgets$Widget$Material$Color$withShade,
								palette.bW.ay,
								$Orasund$elm_ui_widgets$Widget$Material$Color$buttonFocusOpacity,
								$Orasund$elm_ui_widgets$Internal$Material$Palette$lightGray(palette))))
					])),
				$mdgriffith$elm_ui$Element$mouseOver(
				_List_fromArray(
					[
						$mdgriffith$elm_ui$Element$Background$color(
						$Orasund$elm_ui_widgets$Widget$Material$Color$fromColor(
							A3(
								$Orasund$elm_ui_widgets$Widget$Material$Color$withShade,
								palette.bW.ay,
								$Orasund$elm_ui_widgets$Widget$Material$Color$buttonHoverOpacity,
								$Orasund$elm_ui_widgets$Internal$Material$Palette$lightGray(palette))))
					]))
			]),
		fO: _List_fromArray(
			[
				$mdgriffith$elm_ui$Element$Background$color(
				$Orasund$elm_ui_widgets$Widget$Material$Color$fromColor(
					A3(
						$Orasund$elm_ui_widgets$Widget$Material$Color$withShade,
						palette.bW.ay,
						$Orasund$elm_ui_widgets$Widget$Material$Color$buttonSelectedOpacity,
						$Orasund$elm_ui_widgets$Internal$Material$Palette$lightGray(palette)))),
				$mdgriffith$elm_ui$Element$Font$color(
				$Orasund$elm_ui_widgets$Widget$Material$Color$fromColor(
					$Orasund$elm_ui_widgets$Widget$Material$Color$accessibleTextColor(
						$Orasund$elm_ui_widgets$Internal$Material$Palette$lightGray(palette)))),
				$mdgriffith$elm_ui$Element$Border$shadow(
				$Orasund$elm_ui_widgets$Widget$Material$Color$shadow(4))
			]),
		bl: _Utils_ap(
			$Orasund$elm_ui_widgets$Internal$Material$Button$baseButton(palette).bl,
			_Utils_ap(
				$Orasund$elm_ui_widgets$Widget$Material$Color$textAndBackground(
					A3(
						$Orasund$elm_ui_widgets$Widget$Material$Color$withShade,
						palette.bW.ay,
						$Orasund$elm_ui_widgets$Widget$Material$Color$buttonDisabledOpacity,
						$Orasund$elm_ui_widgets$Internal$Material$Palette$lightGray(palette))),
				_List_fromArray(
					[
						$mdgriffith$elm_ui$Element$mouseDown(_List_Nil),
						$mdgriffith$elm_ui$Element$mouseOver(_List_Nil),
						$mdgriffith$elm_ui$Element$focused(_List_Nil)
					]))),
		br: _List_fromArray(
			[
				$mdgriffith$elm_ui$Element$Background$color(
				$Orasund$elm_ui_widgets$Widget$Material$Color$fromColor(
					$Orasund$elm_ui_widgets$Internal$Material$Palette$lightGray(palette))),
				$mdgriffith$elm_ui$Element$Font$color(
				$Orasund$elm_ui_widgets$Widget$Material$Color$fromColor(
					$Orasund$elm_ui_widgets$Widget$Material$Color$accessibleTextColor(
						$Orasund$elm_ui_widgets$Internal$Material$Palette$lightGray(palette))))
			])
	};
};
var $Orasund$elm_ui_widgets$Internal$Material$TextInput$textInput = function (palette) {
	return {
		bf: {
			b8: {
				bf: $Orasund$elm_ui_widgets$Internal$Material$Chip$chip(palette),
				cd: _List_fromArray(
					[
						$mdgriffith$elm_ui$Element$spacing(8)
					])
			},
			g: {
				ce: _Utils_ap(
					$Orasund$elm_ui_widgets$Widget$Material$Color$textAndBackground(palette.ay),
					_List_fromArray(
						[
							$mdgriffith$elm_ui$Element$Border$width(0),
							$mdgriffith$elm_ui$Element$mouseOver(_List_Nil),
							$mdgriffith$elm_ui$Element$focused(_List_Nil),
							$mdgriffith$elm_ui$Element$centerY
						]))
			}
		},
		cd: _Utils_ap(
			$Orasund$elm_ui_widgets$Widget$Material$Color$textAndBackground(palette.ay),
			_List_fromArray(
				[
					$mdgriffith$elm_ui$Element$spacing(8),
					A2($mdgriffith$elm_ui$Element$paddingXY, 8, 0),
					$mdgriffith$elm_ui$Element$Border$width(1),
					$mdgriffith$elm_ui$Element$Border$rounded(4),
					$mdgriffith$elm_ui$Element$Border$color(
					$Orasund$elm_ui_widgets$Widget$Material$Color$fromColor(
						A2($Orasund$elm_ui_widgets$Widget$Material$Color$scaleOpacity, 0.14, palette.bW.ay))),
					$mdgriffith$elm_ui$Element$focused(
					_List_fromArray(
						[
							$mdgriffith$elm_ui$Element$Border$shadow(
							$Orasund$elm_ui_widgets$Widget$Material$Color$shadow(4)),
							$mdgriffith$elm_ui$Element$Border$color(
							$Orasund$elm_ui_widgets$Widget$Material$Color$fromColor(palette.av))
						])),
					$mdgriffith$elm_ui$Element$width(
					$mdgriffith$elm_ui$Element$px(280)),
					$mdgriffith$elm_ui$Element$mouseOver(
					_List_fromArray(
						[
							$mdgriffith$elm_ui$Element$Border$shadow(
							$Orasund$elm_ui_widgets$Widget$Material$Color$shadow(2))
						]))
				]))
	};
};
var $Orasund$elm_ui_widgets$Widget$Material$textInput = $Orasund$elm_ui_widgets$Internal$Material$TextInput$textInput;
var $author$project$StringExtra$filterHttps = function (text) {
	return A2($elm$core$String$startsWith, 'https://', text) ? $author$project$StringExtra$withHttps(
		A2($elm$core$String$dropLeft, 8, text)) : (A2($elm$core$String$startsWith, 'http://', text) ? text : ('https://' + text));
};
var $author$project$StringExtra$withHttps = function (text) {
	switch (text) {
		case 'h':
			return 'https://';
		case 'ht':
			return 'https://';
		case 'htt':
			return 'https://';
		case 'http':
			return 'https://';
		case 'https':
			return 'https://';
		case 'https:':
			return 'https://';
		case 'https:/':
			return 'https://';
		case 'https://':
			return 'https://';
		case 'http://':
			return 'http://';
		default:
			return A2($elm$core$String$startsWith, 'https://', text) ? $author$project$StringExtra$filterHttps(
				A2($elm$core$String$dropLeft, 8, text)) : (A2($elm$core$String$startsWith, 'http://', text) ? text : ('https://' + text));
	}
};
var $author$project$View$baseUrlField = F2(
	function (model, editable) {
		return A2(
			$mdgriffith$elm_ui$Element$el,
			_List_fromArray(
				[$mdgriffith$elm_ui$Element$centerX]),
			A2(
				$Orasund$elm_ui_widgets$Widget$textInput,
				$Orasund$elm_ui_widgets$Widget$Material$textInput(
					editable ? $author$project$Colors$primaryPalette : $author$project$Colors$primaryPalette),
				{
					b8: _List_Nil,
					bm: 'Homeserver URL',
					bq: function (baseUrl) {
						return editable ? $author$project$Msg$UpdateLogin(
							_Utils_update(
								model,
								{
									aV: $author$project$StringExtra$withHttps(baseUrl)
								})) : $author$project$Msg$UpdateLogin(model);
					},
					bs: $elm$core$Maybe$Just(
						A2(
							$mdgriffith$elm_ui$Element$Input$placeholder,
							_List_Nil,
							$mdgriffith$elm_ui$Element$text('Homeserver URL'))),
					g: model.aV
				}));
	});
var $author$project$View$errorMessage = function (error) {
	if (error.$ === 1) {
		return $mdgriffith$elm_ui$Element$none;
	} else {
		var e = error.a;
		return A2(
			$mdgriffith$elm_ui$Element$el,
			_List_fromArray(
				[
					$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$fill),
					$mdgriffith$elm_ui$Element$Background$color(
					A3($mdgriffith$elm_ui$Element$rgb, 1, 0, 0)),
					$mdgriffith$elm_ui$Element$Font$color(
					A3($mdgriffith$elm_ui$Element$rgb, 1, 1, 1)),
					$mdgriffith$elm_ui$Element$padding(5)
				]),
			$mdgriffith$elm_ui$Element$text(e));
	}
};
var $icidasset$elm_material_icons$Material$Icons$local_activity = A2(
	$icidasset$elm_material_icons$Material$Icons$Internal$icon,
	_List_fromArray(
		[
			$icidasset$elm_material_icons$Material$Icons$Internal$v('0 0 24 24')
		]),
	_List_fromArray(
		[
			A2(
			$icidasset$elm_material_icons$Material$Icons$Internal$p,
			_List_fromArray(
				[
					$elm$svg$Svg$Attributes$d('M0 0h24v24H0z'),
					$icidasset$elm_material_icons$Material$Icons$Internal$f('none')
				]),
			_List_Nil),
			A2(
			$icidasset$elm_material_icons$Material$Icons$Internal$p,
			_List_fromArray(
				[
					$elm$svg$Svg$Attributes$d('M20 12c0-1.1.9-2 2-2V6c0-1.1-.9-2-2-2H4c-1.1 0-1.99.9-1.99 2v4c1.1 0 1.99.9 1.99 2s-.89 2-2 2v4c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2v-4c-1.1 0-2-.9-2-2zm-4.42 4.8L12 14.5l-3.58 2.3 1.08-4.12-3.29-2.69 4.24-.25L12 5.8l1.54 3.95 4.24.25-3.29 2.69 1.09 4.11z')
				]),
			_List_Nil)
		]));
var $elm$svg$Svg$Attributes$enableBackground = _VirtualDom_attribute('enable-background');
var $icidasset$elm_material_icons$Material$Icons$Internal$b = $elm$svg$Svg$Attributes$enableBackground;
var $icidasset$elm_material_icons$Material$Icons$password = A2(
	$icidasset$elm_material_icons$Material$Icons$Internal$icon,
	_List_fromArray(
		[
			$icidasset$elm_material_icons$Material$Icons$Internal$b('new 0 0 24 24'),
			$icidasset$elm_material_icons$Material$Icons$Internal$v('0 0 24 24')
		]),
	_List_fromArray(
		[
			A2(
			$elm$svg$Svg$g,
			_List_Nil,
			_List_fromArray(
				[
					A2(
					$icidasset$elm_material_icons$Material$Icons$Internal$p,
					_List_fromArray(
						[
							$elm$svg$Svg$Attributes$d('M0,0h24v24H0V0z'),
							$icidasset$elm_material_icons$Material$Icons$Internal$f('none')
						]),
					_List_Nil)
				])),
			A2(
			$elm$svg$Svg$g,
			_List_Nil,
			_List_fromArray(
				[
					A2(
					$elm$svg$Svg$g,
					_List_Nil,
					_List_fromArray(
						[
							A2(
							$icidasset$elm_material_icons$Material$Icons$Internal$p,
							_List_fromArray(
								[
									$elm$svg$Svg$Attributes$d('M2,17h20v2H2V17z M3.15,12.95L4,11.47l0.85,1.48l1.3-0.75L5.3,10.72H7v-1.5H5.3l0.85-1.47L4.85,7L4,8.47L3.15,7l-1.3,0.75 L2.7,9.22H1v1.5h1.7L1.85,12.2L3.15,12.95z M9.85,12.2l1.3,0.75L12,11.47l0.85,1.48l1.3-0.75l-0.85-1.48H15v-1.5h-1.7l0.85-1.47 L12.85,7L12,8.47L11.15,7l-1.3,0.75l0.85,1.47H9v1.5h1.7L9.85,12.2z M23,9.22h-1.7l0.85-1.47L20.85,7L20,8.47L19.15,7l-1.3,0.75 l0.85,1.47H17v1.5h1.7l-0.85,1.48l1.3,0.75L20,11.47l0.85,1.48l1.3-0.75l-0.85-1.48H23V9.22z')
								]),
							_List_Nil)
						]))
				]))
		]));
var $author$project$View$passwordField = F2(
	function (model, editable) {
		return A2(
			$mdgriffith$elm_ui$Element$el,
			_List_fromArray(
				[$mdgriffith$elm_ui$Element$centerX]),
			A2(
				$Orasund$elm_ui_widgets$Widget$currentPasswordInputV2,
				$Orasund$elm_ui_widgets$Widget$Material$passwordInput(
					editable ? $Orasund$elm_ui_widgets$Widget$Material$defaultPalette : $author$project$Colors$primaryPalette),
				{
					bm: 'Password',
					bq: function (password) {
						return editable ? $author$project$Msg$UpdateLogin(
							_Utils_update(
								model,
								{as: password})) : $author$project$Msg$UpdateLogin(model);
					},
					bs: $elm$core$Maybe$Just(
						A2(
							$mdgriffith$elm_ui$Element$Input$placeholder,
							_List_Nil,
							$mdgriffith$elm_ui$Element$text('Password'))),
					eo: false,
					g: model.as
				}));
	});
var $author$project$Msg$SubmitLogin = {$: 1};
var $author$project$StringExtra$httpsLen = $elm$core$String$length('https://');
var $mdgriffith$elm_ui$Element$transparent = function (on) {
	return on ? A2(
		$mdgriffith$elm_ui$Internal$Model$StyleClass,
		$mdgriffith$elm_ui$Internal$Flag$transparency,
		A2($mdgriffith$elm_ui$Internal$Model$Transparency, 'transparent', 1.0)) : A2(
		$mdgriffith$elm_ui$Internal$Model$StyleClass,
		$mdgriffith$elm_ui$Internal$Flag$transparency,
		A2($mdgriffith$elm_ui$Internal$Model$Transparency, 'visible', 0.0));
};
var $author$project$View$submitField = F2(
	function (model, submittable) {
		var hideButton = function () {
			if (_Utils_cmp(
				$elm$core$String$length(model.aV),
				$author$project$StringExtra$httpsLen) > 0) {
				var _v0 = model.ek;
				if (_v0 === 1) {
					return !$elm$core$String$length(model.b0);
				} else {
					return !($elm$core$String$length(model.aA) * $elm$core$String$length(model.as));
				}
			} else {
				return true;
			}
		}();
		return A2(
			$mdgriffith$elm_ui$Element$el,
			_List_fromArray(
				[
					$mdgriffith$elm_ui$Element$transparent(hideButton),
					$mdgriffith$elm_ui$Element$centerX
				]),
			A2(
				$Orasund$elm_ui_widgets$Widget$textButton,
				$Orasund$elm_ui_widgets$Widget$Material$outlinedButton($author$project$Colors$primaryPalette),
				{
					u: submittable ? $elm$core$Maybe$Just($author$project$Msg$SubmitLogin) : $elm$core$Maybe$Nothing,
					g: 'Login'
				}));
	});
var $Orasund$elm_ui_widgets$Internal$Select$select = function (_v0) {
	var selected = _v0.R;
	var options = _v0.gp;
	var onSelect = _v0.gi;
	return A2(
		$elm$core$List$indexedMap,
		F2(
			function (i, a) {
				return _Utils_Tuple2(
					_Utils_eq(
						selected,
						$elm$core$Maybe$Just(i)),
					{
						H: a.H,
						u: onSelect(i),
						g: a.g
					});
			}),
		options);
};
var $Orasund$elm_ui_widgets$Internal$Tab$tab = F2(
	function (style, _v0) {
		var tabs = _v0.g$;
		var content = _v0.bf;
		return A2(
			$mdgriffith$elm_ui$Element$column,
			style.ds,
			_List_fromArray(
				[
					A2(
					$mdgriffith$elm_ui$Element$row,
					style.bf.g$.cd,
					A2(
						$elm$core$List$map,
						$Orasund$elm_ui_widgets$Internal$Select$selectButton(style.bf.g$.bf),
						$Orasund$elm_ui_widgets$Internal$Select$select(tabs))),
					A2(
					$mdgriffith$elm_ui$Element$el,
					style.bf.bf,
					content(tabs.R))
				]));
	});
var $Orasund$elm_ui_widgets$Widget$tab = function () {
	var fun = $Orasund$elm_ui_widgets$Internal$Tab$tab;
	return fun;
}();
var $mdgriffith$elm_ui$Element$spaceEvenly = A2($mdgriffith$elm_ui$Internal$Model$Class, $mdgriffith$elm_ui$Internal$Flag$spacing, $mdgriffith$elm_ui$Internal$Style$classes.gP);
var $mdgriffith$elm_ui$Element$Border$widthXY = F2(
	function (x, y) {
		return A2(
			$mdgriffith$elm_ui$Internal$Model$StyleClass,
			$mdgriffith$elm_ui$Internal$Flag$borderWidth,
			A5(
				$mdgriffith$elm_ui$Internal$Model$BorderWidth,
				'b-' + ($elm$core$String$fromInt(x) + ('-' + $elm$core$String$fromInt(y))),
				y,
				x,
				y,
				x));
	});
var $mdgriffith$elm_ui$Element$Border$widthEach = function (_v0) {
	var bottom = _v0.fb;
	var top = _v0.hi;
	var left = _v0.f3;
	var right = _v0.gB;
	return (_Utils_eq(top, bottom) && _Utils_eq(left, right)) ? (_Utils_eq(top, right) ? $mdgriffith$elm_ui$Element$Border$width(top) : A2($mdgriffith$elm_ui$Element$Border$widthXY, left, top)) : A2(
		$mdgriffith$elm_ui$Internal$Model$StyleClass,
		$mdgriffith$elm_ui$Internal$Flag$borderWidth,
		A5(
			$mdgriffith$elm_ui$Internal$Model$BorderWidth,
			'b-' + ($elm$core$String$fromInt(top) + ('-' + ($elm$core$String$fromInt(right) + ('-' + ($elm$core$String$fromInt(bottom) + ('-' + $elm$core$String$fromInt(left))))))),
			top,
			right,
			bottom,
			left));
};
var $Orasund$elm_ui_widgets$Internal$Material$Tab$tabButton = function (palette) {
	return {
		bf: {
			bf: {
				H: {
					fO: {dp: palette.av, ep: 18},
					bl: {
						dp: $Orasund$elm_ui_widgets$Internal$Material$Palette$gray(palette),
						ep: 18
					},
					br: {dp: palette.av, ep: 18}
				},
				g: {fk: _List_Nil}
			},
			cd: _List_fromArray(
				[
					$mdgriffith$elm_ui$Element$spacing(8),
					$mdgriffith$elm_ui$Element$centerY,
					$mdgriffith$elm_ui$Element$centerX
				])
		},
		cc: _Utils_ap(
			$Orasund$elm_ui_widgets$Widget$Material$Typography$button,
			_List_fromArray(
				[
					$mdgriffith$elm_ui$Element$height(
					$mdgriffith$elm_ui$Element$px(48)),
					$mdgriffith$elm_ui$Element$width(
					A2(
						$mdgriffith$elm_ui$Element$minimum,
						90,
						A2($mdgriffith$elm_ui$Element$maximum, 360, $mdgriffith$elm_ui$Element$fill))),
					A2($mdgriffith$elm_ui$Element$paddingXY, 12, 16),
					$mdgriffith$elm_ui$Element$Font$color(
					$Orasund$elm_ui_widgets$Widget$Material$Color$fromColor(palette.av)),
					$mdgriffith$elm_ui$Element$mouseDown(
					_List_fromArray(
						[
							$mdgriffith$elm_ui$Element$Background$color(
							$Orasund$elm_ui_widgets$Widget$Material$Color$fromColor(
								A2($Orasund$elm_ui_widgets$Widget$Material$Color$scaleOpacity, $Orasund$elm_ui_widgets$Widget$Material$Color$buttonPressedOpacity, palette.av)))
						])),
					$mdgriffith$elm_ui$Element$focused(
					_List_fromArray(
						[
							$mdgriffith$elm_ui$Element$Background$color(
							$Orasund$elm_ui_widgets$Widget$Material$Color$fromColor(
								A2($Orasund$elm_ui_widgets$Widget$Material$Color$scaleOpacity, $Orasund$elm_ui_widgets$Widget$Material$Color$buttonFocusOpacity, palette.av)))
						])),
					$mdgriffith$elm_ui$Element$mouseOver(
					_List_fromArray(
						[
							$mdgriffith$elm_ui$Element$Background$color(
							$Orasund$elm_ui_widgets$Widget$Material$Color$fromColor(
								A2($Orasund$elm_ui_widgets$Widget$Material$Color$scaleOpacity, $Orasund$elm_ui_widgets$Widget$Material$Color$buttonHoverOpacity, palette.av)))
						]))
				])),
		fO: _List_fromArray(
			[
				$mdgriffith$elm_ui$Element$height(
				$mdgriffith$elm_ui$Element$px(48)),
				$mdgriffith$elm_ui$Element$Border$widthEach(
				{fb: 2, f3: 0, gB: 0, hi: 0})
			]),
		bl: _Utils_ap(
			$Orasund$elm_ui_widgets$Internal$Material$Button$baseButton(palette).bl,
			_List_fromArray(
				[
					$mdgriffith$elm_ui$Element$Font$color(
					$Orasund$elm_ui_widgets$Widget$Material$Color$fromColor(
						$Orasund$elm_ui_widgets$Internal$Material$Palette$gray(palette))),
					$mdgriffith$elm_ui$Element$mouseDown(_List_Nil),
					$mdgriffith$elm_ui$Element$mouseOver(_List_Nil),
					$mdgriffith$elm_ui$Element$focused(_List_Nil)
				])),
		br: _List_Nil
	};
};
var $Orasund$elm_ui_widgets$Internal$Material$Tab$tab = function (palette) {
	return {
		bf: {
			bf: _List_fromArray(
				[
					$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$fill)
				]),
			g$: {
				bf: $Orasund$elm_ui_widgets$Internal$Material$Tab$tabButton(palette),
				cd: _List_fromArray(
					[
						$mdgriffith$elm_ui$Element$spaceEvenly,
						$mdgriffith$elm_ui$Element$Border$shadow(
						$Orasund$elm_ui_widgets$Widget$Material$Color$shadow(4)),
						$mdgriffith$elm_ui$Element$spacing(8),
						$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$fill)
					])
			}
		},
		ds: _List_fromArray(
			[
				$mdgriffith$elm_ui$Element$spacing(8),
				$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$fill)
			])
	};
};
var $Orasund$elm_ui_widgets$Widget$Material$tab = $Orasund$elm_ui_widgets$Internal$Material$Tab$tab;
var $mdgriffith$elm_ui$Element$Input$username = $mdgriffith$elm_ui$Element$Input$textHelper(
	{
		K: $elm$core$Maybe$Just('username'),
		T: false,
		t: $mdgriffith$elm_ui$Element$Input$TextInputNode('text')
	});
var $Orasund$elm_ui_widgets$Internal$TextInput$usernameInput = $Orasund$elm_ui_widgets$Internal$TextInput$internal($mdgriffith$elm_ui$Element$Input$username);
var $Orasund$elm_ui_widgets$Widget$usernameInput = function () {
	var fun = $Orasund$elm_ui_widgets$Internal$TextInput$usernameInput;
	return fun;
}();
var $author$project$View$usernameField = F2(
	function (model, editable) {
		return A2(
			$mdgriffith$elm_ui$Element$el,
			_List_fromArray(
				[$mdgriffith$elm_ui$Element$centerX]),
			A2(
				$Orasund$elm_ui_widgets$Widget$usernameInput,
				$Orasund$elm_ui_widgets$Widget$Material$textInput(
					editable ? $author$project$Colors$primaryPalette : $author$project$Colors$primaryPalette),
				{
					b8: _List_Nil,
					bm: 'Username',
					bq: function (username) {
						return editable ? $author$project$Msg$UpdateLogin(
							_Utils_update(
								model,
								{aA: username})) : $author$project$Msg$UpdateLogin(model);
					},
					bs: $elm$core$Maybe$Just(
						A2(
							$mdgriffith$elm_ui$Element$Input$placeholder,
							_List_Nil,
							$mdgriffith$elm_ui$Element$text('Username'))),
					g: model.aA
				}));
	});
var $author$project$View$loginScreen = F2(
	function (model, editable) {
		return A2(
			$mdgriffith$elm_ui$Element$el,
			_List_fromArray(
				[
					$mdgriffith$elm_ui$Element$width(
					A2($mdgriffith$elm_ui$Element$maximum, 750, $mdgriffith$elm_ui$Element$fill)),
					$mdgriffith$elm_ui$Element$centerX
				]),
			A2(
				$mdgriffith$elm_ui$Element$el,
				$Orasund$elm_ui_widgets$Widget$Material$cardAttributes($Orasund$elm_ui_widgets$Widget$Material$defaultPalette),
				A2(
					$Orasund$elm_ui_widgets$Widget$tab,
					$Orasund$elm_ui_widgets$Widget$Material$tab($author$project$Colors$primaryPalette),
					{
						bf: function (i) {
							return A2(
								$mdgriffith$elm_ui$Element$column,
								_List_fromArray(
									[
										$mdgriffith$elm_ui$Element$centerX,
										$mdgriffith$elm_ui$Element$spacing(20),
										$mdgriffith$elm_ui$Element$padding(20)
									]),
								function () {
									_v0$2:
									while (true) {
										if (!i.$) {
											switch (i.a) {
												case 0:
													return _List_fromArray(
														[
															$author$project$View$errorMessage(model.ao),
															A2($author$project$View$baseUrlField, model, editable),
															A2($author$project$View$accessTokenField, model, editable),
															A2($author$project$View$submitField, model, editable)
														]);
												case 1:
													return _List_fromArray(
														[
															$author$project$View$errorMessage(model.ao),
															A2($author$project$View$baseUrlField, model, editable),
															A2($author$project$View$usernameField, model, editable),
															A2($author$project$View$passwordField, model, editable),
															A2($author$project$View$submitField, model, editable)
														]);
												default:
													break _v0$2;
											}
										} else {
											break _v0$2;
										}
									}
									return _List_fromArray(
										[
											$author$project$View$errorMessage(model.ao),
											A2($author$project$View$baseUrlField, model, editable),
											A2($author$project$View$accessTokenField, model, editable),
											A2($author$project$View$submitField, model, editable)
										]);
								}());
						},
						g$: {
							gi: function (i) {
								switch (i) {
									case 0:
										return $elm$core$Maybe$Just(
											$author$project$Msg$UpdateLogin(
												_Utils_update(
													model,
													{ek: 1})));
									case 1:
										return $elm$core$Maybe$Just(
											$author$project$Msg$UpdateLogin(
												_Utils_update(
													model,
													{ek: 0})));
									default:
										return $elm$core$Maybe$Nothing;
								}
							},
							gp: _List_fromArray(
								[
									{
									H: $author$project$View$getIcon($icidasset$elm_material_icons$Material$Icons$local_activity),
									g: 'Access token'
								},
									{
									H: $author$project$View$getIcon($icidasset$elm_material_icons$Material$Icons$password),
									g: 'Username & password'
								}
								]),
							R: function () {
								var _v2 = model.ek;
								if (_v2 === 1) {
									return $elm$core$Maybe$Just(0);
								} else {
									return $elm$core$Maybe$Just(1);
								}
							}()
						}
					})));
	});
var $author$project$Msg$CreateGame = F2(
	function (a, b) {
		return {$: 7, a: a, b: b};
	});
var $author$project$Msg$RemoveModal = {$: 5};
var $Orasund$elm_ui_widgets$Widget$Material$Typography$subtitle2 = _List_fromArray(
	[
		$mdgriffith$elm_ui$Element$Font$size(14),
		$mdgriffith$elm_ui$Element$Font$semiBold,
		$mdgriffith$elm_ui$Element$Font$letterSpacing(0.1)
	]);
var $Orasund$elm_ui_widgets$Internal$Material$Item$fullBleedHeader = function (palette) {
	return {
		bf: {
			bf: {
				fw: {_: _List_Nil},
				hg: _Utils_ap(
					$Orasund$elm_ui_widgets$Widget$Material$Typography$subtitle2,
					_List_fromArray(
						[
							$mdgriffith$elm_ui$Element$Font$color(
							$Orasund$elm_ui_widgets$Widget$Material$Color$fromColor(
								$Orasund$elm_ui_widgets$Internal$Material$Palette$gray(palette))),
							A2($mdgriffith$elm_ui$Element$paddingXY, 16, 8)
						]))
			},
			ds: _List_fromArray(
				[
					$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$fill),
					$mdgriffith$elm_ui$Element$spacing(8)
				])
		},
		_: _List_fromArray(
			[
				$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$fill),
				$mdgriffith$elm_ui$Element$height($mdgriffith$elm_ui$Element$shrink),
				$mdgriffith$elm_ui$Element$padding(0),
				$mdgriffith$elm_ui$Element$Border$widthEach(
				{fb: 0, f3: 0, gB: 0, hi: 1}),
				$mdgriffith$elm_ui$Element$Border$color(
				$Orasund$elm_ui_widgets$Widget$Material$Color$fromColor(
					$Orasund$elm_ui_widgets$Internal$Material$Palette$lightGray(palette)))
			])
	};
};
var $Orasund$elm_ui_widgets$Widget$Material$fullBleedHeader = $Orasund$elm_ui_widgets$Internal$Material$Item$fullBleedHeader;
var $Orasund$elm_ui_widgets$Internal$Item$fullBleedItem = F2(
	function (s, _v0) {
		var onPress = _v0.u;
		var text = _v0.g;
		var icon = _v0.H;
		return A2(
			$Orasund$elm_ui_widgets$Internal$Item$toItem,
			s,
			function (style) {
				return A2(
					$mdgriffith$elm_ui$Element$Input$button,
					_Utils_ap(
						style.cc,
						_Utils_eq(onPress, $elm$core$Maybe$Nothing) ? style.bl : style.br),
					{
						bm: A2(
							$mdgriffith$elm_ui$Element$row,
							style.bf.cd,
							_List_fromArray(
								[
									A2(
									$mdgriffith$elm_ui$Element$el,
									style.bf.bf.g.bi,
									A2(
										$mdgriffith$elm_ui$Element$paragraph,
										_List_Nil,
										$elm$core$List$singleton(
											$mdgriffith$elm_ui$Element$text(text)))),
									icon(style.bf.bf.H)
								])),
						u: onPress
					});
			});
	});
var $Orasund$elm_ui_widgets$Widget$fullBleedItem = function () {
	var fun = $Orasund$elm_ui_widgets$Internal$Item$fullBleedItem;
	return fun;
}();
var $Orasund$elm_ui_widgets$Internal$Material$Item$insetItem = function (palette) {
	return {
		bf: {
			bf: {
				bf: {
					bf: {
						dp: $Orasund$elm_ui_widgets$Internal$Material$Palette$gray(palette),
						ep: 24
					},
					H: {
						bf: {
							dp: $Orasund$elm_ui_widgets$Internal$Material$Palette$gray(palette),
							ep: 24
						},
						_: _List_fromArray(
							[
								$mdgriffith$elm_ui$Element$width(
								$mdgriffith$elm_ui$Element$px(40)),
								$mdgriffith$elm_ui$Element$height(
								$mdgriffith$elm_ui$Element$px(24))
							])
					},
					g: {
						bi: _List_fromArray(
							[
								$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$fill)
							])
					}
				},
				cd: _List_fromArray(
					[
						$mdgriffith$elm_ui$Element$spacing(16),
						$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$fill)
					])
			},
			cc: _List_fromArray(
				[
					$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$fill),
					$mdgriffith$elm_ui$Element$padding(16)
				]),
			bl: _List_fromArray(
				[
					$mdgriffith$elm_ui$Element$mouseDown(_List_Nil),
					$mdgriffith$elm_ui$Element$mouseOver(_List_Nil),
					$mdgriffith$elm_ui$Element$focused(_List_Nil),
					$mdgriffith$elm_ui$Element$htmlAttribute(
					A2($elm$html$Html$Attributes$style, 'cursor', 'default'))
				]),
			br: _List_fromArray(
				[
					$mdgriffith$elm_ui$Element$mouseDown(
					_List_fromArray(
						[
							$mdgriffith$elm_ui$Element$Background$color(
							$Orasund$elm_ui_widgets$Widget$Material$Color$fromColor(
								A2(
									$Orasund$elm_ui_widgets$Widget$Material$Color$scaleOpacity,
									$Orasund$elm_ui_widgets$Widget$Material$Color$buttonPressedOpacity,
									$Orasund$elm_ui_widgets$Internal$Material$Palette$gray(palette))))
						])),
					$mdgriffith$elm_ui$Element$focused(
					_List_fromArray(
						[
							$mdgriffith$elm_ui$Element$Background$color(
							$Orasund$elm_ui_widgets$Widget$Material$Color$fromColor(
								A2(
									$Orasund$elm_ui_widgets$Widget$Material$Color$scaleOpacity,
									$Orasund$elm_ui_widgets$Widget$Material$Color$buttonFocusOpacity,
									$Orasund$elm_ui_widgets$Internal$Material$Palette$gray(palette))))
						])),
					$mdgriffith$elm_ui$Element$mouseOver(
					_List_fromArray(
						[
							$mdgriffith$elm_ui$Element$Background$color(
							$Orasund$elm_ui_widgets$Widget$Material$Color$fromColor(
								A2(
									$Orasund$elm_ui_widgets$Widget$Material$Color$scaleOpacity,
									$Orasund$elm_ui_widgets$Widget$Material$Color$buttonHoverOpacity,
									$Orasund$elm_ui_widgets$Internal$Material$Palette$gray(palette))))
						]))
				])
		},
		_: _List_fromArray(
			[
				$mdgriffith$elm_ui$Element$padding(0)
			])
	};
};
var $Orasund$elm_ui_widgets$Internal$Material$Item$fullBleedItem = function (palette) {
	var i = $Orasund$elm_ui_widgets$Internal$Material$Item$insetItem(palette);
	return {
		bf: {
			bf: {
				bf: {H: i.bf.bf.bf.bf, g: i.bf.bf.bf.g},
				cd: i.bf.bf.cd
			},
			cc: i.bf.cc,
			bl: i.bf.bl,
			br: i.bf.br
		},
		_: i._
	};
};
var $Orasund$elm_ui_widgets$Widget$Material$fullBleedItem = $Orasund$elm_ui_widgets$Internal$Material$Item$fullBleedItem;
var $Orasund$elm_ui_widgets$Internal$Item$headerItem = F2(
	function (style, title) {
		return A2(
			$Orasund$elm_ui_widgets$Internal$Item$toItem,
			style,
			function (_v0) {
				var elementColumn = _v0.ds;
				var content = _v0.bf;
				return A2(
					$mdgriffith$elm_ui$Element$column,
					elementColumn,
					_List_fromArray(
						[
							A2($mdgriffith$elm_ui$Element$el, content.fw._, $mdgriffith$elm_ui$Element$none),
							A2(
							$mdgriffith$elm_ui$Element$el,
							content.hg,
							$mdgriffith$elm_ui$Element$text(title))
						]));
			});
	});
var $Orasund$elm_ui_widgets$Widget$headerItem = $Orasund$elm_ui_widgets$Internal$Item$headerItem;
var $elm$html$Html$Attributes$alt = $elm$html$Html$Attributes$stringProperty('alt');
var $elm$html$Html$Attributes$src = function (url) {
	return A2(
		$elm$html$Html$Attributes$stringProperty,
		'src',
		_VirtualDom_noJavaScriptOrHtmlUri(url));
};
var $mdgriffith$elm_ui$Element$image = F2(
	function (attrs, _v0) {
		var src = _v0.gS;
		var description = _v0.ft;
		var imageAttributes = A2(
			$elm$core$List$filter,
			function (a) {
				switch (a.$) {
					case 7:
						return true;
					case 8:
						return true;
					default:
						return false;
				}
			},
			attrs);
		return A4(
			$mdgriffith$elm_ui$Internal$Model$element,
			$mdgriffith$elm_ui$Internal$Model$asEl,
			$mdgriffith$elm_ui$Internal$Model$div,
			A2(
				$elm$core$List$cons,
				$mdgriffith$elm_ui$Internal$Model$htmlClass($mdgriffith$elm_ui$Internal$Style$classes.fQ),
				attrs),
			$mdgriffith$elm_ui$Internal$Model$Unkeyed(
				_List_fromArray(
					[
						A4(
						$mdgriffith$elm_ui$Internal$Model$element,
						$mdgriffith$elm_ui$Internal$Model$asEl,
						$mdgriffith$elm_ui$Internal$Model$NodeName('img'),
						_Utils_ap(
							_List_fromArray(
								[
									$mdgriffith$elm_ui$Internal$Model$Attr(
									$elm$html$Html$Attributes$src(src)),
									$mdgriffith$elm_ui$Internal$Model$Attr(
									$elm$html$Html$Attributes$alt(description))
								]),
							imageAttributes),
						$mdgriffith$elm_ui$Internal$Model$Unkeyed(_List_Nil))
					])));
	});
var $author$project$View$createGame = F2(
	function (vault, data) {
		return {
			bf: A2(
				$mdgriffith$elm_ui$Element$el,
				_List_fromArray(
					[
						$mdgriffith$elm_ui$Element$centerX,
						$mdgriffith$elm_ui$Element$centerY,
						$mdgriffith$elm_ui$Element$width(
						A2($mdgriffith$elm_ui$Element$minimum, 400, $mdgriffith$elm_ui$Element$shrink))
					]),
				function (roomList) {
					return A2(
						$mdgriffith$elm_ui$Element$column,
						_List_fromArray(
							[
								$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$fill)
							]),
						_List_fromArray(
							[
								A2(
								$mdgriffith$elm_ui$Element$row,
								_List_fromArray(
									[$mdgriffith$elm_ui$Element$centerX]),
								_List_fromArray(
									[
										A2(
										$mdgriffith$elm_ui$Element$el,
										_List_fromArray(
											[
												$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$fill)
											]),
										A2(
											$Orasund$elm_ui_widgets$Widget$textInput,
											$Orasund$elm_ui_widgets$Widget$Material$textInput($Orasund$elm_ui_widgets$Widget$Material$defaultPalette),
											{
												b8: _List_Nil,
												bm: 'Username',
												bq: function (v) {
													return $author$project$Msg$LoggedIn(
														$author$project$Msg$EditCreateGameModal(
															_Utils_update(
																data,
																{aA: v})));
												},
												bs: $elm$core$Maybe$Just(
													A2(
														$mdgriffith$elm_ui$Element$Input$placeholder,
														_List_Nil,
														$mdgriffith$elm_ui$Element$text('@alice:example.org'))),
												g: data.aA
											})),
										A2(
										$Orasund$elm_ui_widgets$Widget$textButton,
										$Orasund$elm_ui_widgets$Widget$Material$outlinedButton($author$project$Colors$secondaryPalette),
										{
											u: function () {
												var _v1 = _Utils_Tuple2(data.aA, data.bu);
												if (_v1.b.$ === 1) {
													var _v2 = _v1.b;
													return $elm$core$Maybe$Nothing;
												} else {
													if (_v1.a === '') {
														return $elm$core$Maybe$Nothing;
													} else {
														var room = _v1.b.a;
														return A2(
															$elm$core$Maybe$andThen,
															function (membership) {
																return (membership === 'join') ? $elm$core$Maybe$Just(
																	$author$project$Msg$LoggedIn(
																		A2($author$project$Msg$CreateGame, data.aA, room))) : $elm$core$Maybe$Nothing;
															},
															A2(
																$elm$core$Maybe$andThen,
																A2(
																	$elm$core$Basics$composeR,
																	$elm$json$Json$Decode$decodeValue(
																		A2($elm$json$Json$Decode$field, 'membership', $elm$json$Json$Decode$string)),
																	$elm$core$Result$toMaybe),
																A2(
																	$elm$core$Maybe$map,
																	$author$project$Matrix$Event$content,
																	A2(
																		$author$project$Matrix$Room$stateEvent,
																		{fB: 'm.room.member', gT: data.aA},
																		room))));
													}
												}
											}(),
											g: 'INVITE'
										})
									])),
								roomList
							]));
				}(
					A2(
						$mdgriffith$elm_ui$Element$el,
						_List_fromArray(
							[
								$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$fill)
							]),
						A2(
							$Orasund$elm_ui_widgets$Widget$itemList,
							$Orasund$elm_ui_widgets$Widget$Material$cardColumn($author$project$Colors$secondaryPalette),
							A2(
								$elm$core$List$append,
								_List_fromArray(
									[
										A2(
										$Orasund$elm_ui_widgets$Widget$headerItem,
										$Orasund$elm_ui_widgets$Widget$Material$fullBleedHeader($author$project$Colors$secondaryPalette),
										'Select a room')
									]),
								A2(
									$elm$core$List$map,
									function (room) {
										var roomName = A2(
											$elm$core$Maybe$withDefault,
											$author$project$Matrix$Room$roomId(room),
											A2(
												$elm$core$Maybe$andThen,
												A2(
													$elm$core$Basics$composeR,
													$elm$json$Json$Decode$decodeValue(
														A2($elm$json$Json$Decode$field, 'name', $elm$json$Json$Decode$string)),
													$elm$core$Result$toMaybe),
												A2(
													$elm$core$Maybe$map,
													$author$project$Matrix$Event$content,
													A2(
														$author$project$Matrix$Room$stateEvent,
														{fB: 'm.room.name', gT: ''},
														room))));
										return A2(
											$Orasund$elm_ui_widgets$Widget$fullBleedItem,
											A2(
												$elm$core$Maybe$withDefault,
												false,
												A2(
													$elm$core$Maybe$map,
													$elm$core$Basics$eq(
														$author$project$Matrix$Room$roomId(room)),
													A2($elm$core$Maybe$map, $author$project$Matrix$Room$roomId, data.bu))) ? $Orasund$elm_ui_widgets$Widget$Material$fullBleedItem($author$project$Colors$primaryPalette) : $Orasund$elm_ui_widgets$Widget$Material$fullBleedItem($author$project$Colors$secondaryPalette),
											{
												H: function (_v0) {
													var size = _v0.ep;
													var color = _v0.dp;
													return A2(
														$elm$core$Maybe$withDefault,
														A2(
															$mdgriffith$elm_ui$Element$el,
															_List_fromArray(
																[
																	$author$project$Colors$background(color),
																	$author$project$Colors$font($author$project$Colors$noordstarWhite),
																	$mdgriffith$elm_ui$Element$width(
																	$mdgriffith$elm_ui$Element$px(size)),
																	$mdgriffith$elm_ui$Element$height(
																	$mdgriffith$elm_ui$Element$px(size))
																]),
															A2(
																$mdgriffith$elm_ui$Element$el,
																_List_fromArray(
																	[$mdgriffith$elm_ui$Element$centerX, $mdgriffith$elm_ui$Element$centerY]),
																$mdgriffith$elm_ui$Element$text(
																	$elm$core$String$toUpper(
																		$elm$core$String$fromChar(
																			A2(
																				$elm$core$Maybe$withDefault,
																				'!',
																				$elm$core$List$head(
																					$elm$core$String$toList(roomName)))))))),
														A2(
															$elm$core$Maybe$map,
															$mdgriffith$elm_ui$Element$image(
																_List_fromArray(
																	[
																		$mdgriffith$elm_ui$Element$height(
																		$mdgriffith$elm_ui$Element$px(size)),
																		$mdgriffith$elm_ui$Element$width(
																		$mdgriffith$elm_ui$Element$px(size))
																	])),
															A2(
																$elm$core$Maybe$map,
																function (url) {
																	return {ft: 'Matrix room image', gS: url};
																},
																A2(
																	$elm$core$Maybe$map,
																	function (url) {
																		return A2($elm$core$String$startsWith, 'mxc://', url) ? function (u) {
																			return 'https://matrix-client.matrix.org/_matrix/media/r0/thumbnail/' + (u + ('?width=' + ($elm$core$String$fromInt(size) + ('&height=' + ($elm$core$String$fromInt(size) + '&method=scale')))));
																		}(
																			A2(
																				$elm$core$String$dropLeft,
																				$elm$core$String$length('mxc://'),
																				url)) : ('https://matrix-client.matrix.org/_matrix/media/r0/thumbnail/' + (url + ('?width=' + ($elm$core$String$fromInt(size) + ('&height=' + ($elm$core$String$fromInt(size) + '&method=scale'))))));
																	},
																	A2(
																		$elm$core$Maybe$andThen,
																		A2(
																			$elm$core$Basics$composeR,
																			$elm$json$Json$Decode$decodeValue(
																				A2($elm$json$Json$Decode$field, 'url', $elm$json$Json$Decode$string)),
																			$elm$core$Result$toMaybe),
																		A2(
																			$elm$core$Maybe$map,
																			$author$project$Matrix$Event$content,
																			A2(
																				$author$project$Matrix$Room$stateEvent,
																				{fB: 'm.room.avatar', gT: ''},
																				room)))))));
												},
												u: $elm$core$Maybe$Just(
													$author$project$Msg$LoggedIn(
														$author$project$Msg$EditCreateGameModal(
															_Utils_update(
																data,
																{
																	bu: $elm$core$Maybe$Just(room)
																})))),
												g: roomName
											});
									},
									$author$project$Matrix$getRooms(vault))))))),
			gf: $elm$core$Maybe$Just(
				$author$project$Msg$LoggedIn($author$project$Msg$RemoveModal))
		};
	});
var $author$project$View$showModalScreen = F2(
	function (vault, screen) {
		var data = screen;
		return A2($author$project$View$createGame, vault, data);
	});
var $Orasund$elm_ui_widgets$Internal$Modal$background = function (onDismiss) {
	return _List_fromArray(
		[
			$mdgriffith$elm_ui$Element$inFront(
			A2(
				$mdgriffith$elm_ui$Element$el,
				_Utils_ap(
					_List_fromArray(
						[
							$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$fill),
							$mdgriffith$elm_ui$Element$height($mdgriffith$elm_ui$Element$fill),
							$mdgriffith$elm_ui$Element$Background$color(
							A4($mdgriffith$elm_ui$Element$rgba255, 0, 0, 0, 0.5))
						]),
					A2(
						$elm$core$Maybe$withDefault,
						_List_Nil,
						A2(
							$elm$core$Maybe$map,
							A2($elm$core$Basics$composeR, $mdgriffith$elm_ui$Element$Events$onClick, $elm$core$List$singleton),
							onDismiss))),
				$mdgriffith$elm_ui$Element$none)),
			$mdgriffith$elm_ui$Element$clip
		]);
};
var $Orasund$elm_ui_widgets$Internal$Modal$singleModal = A2(
	$elm$core$Basics$composeR,
	$elm$core$List$head,
	A2(
		$elm$core$Basics$composeR,
		$elm$core$Maybe$map(
			function (_v0) {
				var onDismiss = _v0.gf;
				var content = _v0.bf;
				return _Utils_ap(
					$Orasund$elm_ui_widgets$Internal$Modal$background(onDismiss),
					_List_fromArray(
						[
							$mdgriffith$elm_ui$Element$inFront(content)
						]));
			}),
		$elm$core$Maybe$withDefault(_List_Nil)));
var $Orasund$elm_ui_widgets$Widget$singleModal = $Orasund$elm_ui_widgets$Internal$Modal$singleModal;
var $author$project$Main$view = function (model) {
	return {
		e5: $elm$core$List$singleton(
			A2(
				$mdgriffith$elm_ui$Element$layout,
				A2(
					$elm$core$List$append,
					_List_fromArray(
						[
							$mdgriffith$elm_ui$Element$centerX,
							$mdgriffith$elm_ui$Element$padding(25),
							$author$project$Colors$background($author$project$Colors$noordstarWhite)
						]),
					$Orasund$elm_ui_widgets$Widget$singleModal(
						A2(
							$elm$core$List$filterMap,
							$elm$core$Basics$identity,
							_List_fromArray(
								[
									function () {
									if (model.$ === 2) {
										if (!model.b.$) {
											var vault = model.a;
											var modal = model.b.a;
											return A2(
												$elm$core$Maybe$map,
												$author$project$View$showModalScreen(vault),
												modal);
										} else {
											var vault = model.a;
											var _v2 = model.b;
											var modal = _v2.a;
											return A2(
												$elm$core$Maybe$map,
												$author$project$View$showModalScreen(vault),
												modal);
										}
									} else {
										return $elm$core$Maybe$Nothing;
									}
								}()
								])))),
				function () {
					switch (model.$) {
						case 0:
							var data = model.a;
							return A2($author$project$View$loginScreen, data, true);
						case 1:
							var data = model.a;
							return A2($author$project$View$loginScreen, data, false);
						default:
							var vault = model.a;
							var data = model.b;
							return A2($author$project$View$loggedInScreen, vault, data);
					}
				}())),
		hg: 'Matrix chess'
	};
};
var $author$project$Main$main = $elm$browser$Browser$document(
	{fU: $author$project$Main$init, g_: $author$project$Main$subscriptions, hm: $author$project$Main$update, ho: $author$project$Main$view});
_Platform_export({'Main':{'init':$author$project$Main$main(
	$elm$json$Json$Decode$succeed(0))(0)}});}(this));