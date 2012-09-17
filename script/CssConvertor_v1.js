/* 
CSS Convertor flips the layout of CSS files/text. 
It scans the input, replaces the properties & flips values that need to be changed,
all according to the hash tables below.
*/
var CssConvertor = {
  propertyMap: {
    'left'                              : 'right',
    'right'                             : 'left',
    'margin-left'                       : 'margin-right',
    'margin-right'                      : 'margin-left',
    'padding-left'                      : 'padding-right',
    'padding-right'                     : 'padding-left',
    'border-left'                       : 'border-right',
    'border-right'                      : 'border-left',
    'border-left-width'                 : 'border-right-width',
    'border-right-width'                : 'border-left-width',
    'border-left-color'                 : 'border-right-color',
    'border-right-color'                : 'border-left-color',
    'border-left-style'                 : 'border-right-style',
    'border-right-style'                : 'border-left-style',
    'border-radius-bottomleft'          : 'border-radius-bottomright',
    'border-radius-bottomright'         : 'border-radius-bottomleft',
    'border-bottom-right-radius'        : 'border-bottom-left-radius',
    'border-bottom-left-radius'         : 'border-bottom-right-radius',
    '-webkit-border-bottom-right-radius': '-webkit-border-bottom-left-radius',
    '-webkit-border-bottom-left-radius' : '-webkit-border-bottom-right-radius',
    '-moz-border-radius-bottomright'    : '-moz-border-radius-bottomleft',
    '-moz-border-radius-bottomleft'     : '-moz-border-radius-bottomright',
    'border-radius-topleft'             : 'border-radius-topright',
    'border-radius-topright'            : 'border-radius-topleft',
    'border-top-right-radius'           : 'border-top-left-radius',
    'border-top-left-radius'            : 'border-top-right-radius',
    '-webkit-border-top-right-radius'   : '-webkit-border-top-left-radius',
    '-webkit-border-top-left-radius'    : '-webkit-border-top-right-radius',
    '-moz-border-radius-topright'       : '-moz-border-radius-topleft',
    '-moz-border-radius-topleft'        : '-moz-border-radius-topright'
  },
  flipMap: {'rtl': 'ltr', 'ltr': 'rtl', 'right': 'left', 'left': 'right'},
  valueMap: {
    'padding'              : 'quad',
    'margin'               : 'quad',
    'border-color'         : 'quad',
    'border-width'         : 'quad',
    'border-style'         : 'quad',
    '-webkit-border-radius': 'quad_radius',
    '-moz-border-radius'   : 'quad_radius',
    'border-radius'        : 'quad_radius',
    'text-align'           : 'direction',
    'float'                : 'direction',
    'clear'                : 'direction',
    'direction'            : 'direction'
  },
  /*
  Scan the document for "property:value" 
  then process them using property() and value() functions
  */
  scanAndReplace: function (css) {
    var that = this;
    try {
      return css.replace(/([a-z\-]+)\s*:\s*(.+?)(?=\s*[;}])/g, function (match, a, b) {
        return that.property(a) + ": " + that.value(a, b);
      });
    } catch (e) {
      return false;
    }
  },
  // If the propertyName isn't in the propertyMap hash table, return it unchanged
  property: function (propertyName) {
    return this.propertyMap[propertyName] || propertyName;
  },
  /* 
  "type" refers to the way the value needs to be changed.
  in quad, values are changed this way:
  1px 2px 3px 4px ==> 1px 4px 3px 2px (used in padding, margin, etc)

  in quad_radius:
  1px 2px 3px 4px ==> 2px 1px 4px 3px (used in border-radius, etc)

  in direction:
  right ==> left (used in float, clear, etc)

  If the propertyName isn't in the valueMap hash table, return it unchanged 
  */
  value: function (propertyName, propertyValue) {
    var type = this.valueMap[propertyName];
    return type ? this.newValue(type, propertyValue) : propertyValue;
  },
  /* 
  Do the heavy work: change the value based on its type
  fullValue keeps a copy of the original propertyValue:
  it's needed because it might contain values that don't need to be changed, 
  like "!important, \0/, \9" (IE hacks)

  arr size must be 4 to do the flipping => "margin: 1px 2px 3px" doesn't need flipping
  */
  newValue: function (type, propertyValue) {
    var fullValue, arr, flipValue;
    fullValue = propertyValue;
    propertyValue = this.getActualValue(propertyValue);
    arr = this.splitPropertyValue(propertyValue) || [];
    flipValue = this.flipMap[propertyValue];
    if (type === 'direction' && flipValue) {
      fullValue = fullValue.replace(new RegExp(propertyValue), flipValue);
    } else if (type === 'quad' && arr.length === 4) {
      arr.swap(1, 3);
      fullValue = fullValue.replace(new RegExp(propertyValue), arr.join(' '));
    } else if (type === 'quad_radius' && arr.length === 4) {
      arr.swap(0, 1);
      arr.swap(2, 3);
      fullValue = fullValue.replace(new RegExp(propertyValue), arr.join(' '));
    }
    return fullValue;
  },
  /* 
  return the value without any !important or hack additions, e.g.
  10px !important => 10px
  */
  getActualValue: function (propertyValue) {
    var matchData = /(.+?) ?(!important|\\9|\\0\/)/.exec(propertyValue);
    return matchData ? matchData[1] : propertyValue;
  },
  /* 
  split the value into an array, e.g.
  1px 2px 3px 4px => ["1px", "2px", "3px", "4px"]
  rgba(10,10,10,0) #fff right 10.4% => ["rgba(10,10,10,0)", "#fff", "right", "10.4%"]
  */
  splitPropertyValue: function (propertyValue) {
    return propertyValue.match(/rgba?\(.*?\)|hsla?\(.*?\)|#[0-9a-f]{3,6}|[\w.%\-]+/g);
  }
};
// efficiently swap array elements
Array.prototype.swap = function (x, y) {
  var b = this[x];
  this[x] = this[y];
  this[y] = b;
  return this;
};