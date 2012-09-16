// testing getActualValue
test( "test_must_get_value_without_additions", function() {
  ok( '3px 5px 3px 10px' === CssConvertor.getActualValue('3px 5px 3px 10px !important'));
  ok( 'rgba(255,0,0)' === CssConvertor.getActualValue("rgba(255,0,0) \\0/"));
  ok( '#fff #000 #fff #000' === CssConvertor.getActualValue('#fff #000 #fff #000\\9'));
  ok( '0 0 9px 25px' === CssConvertor.getActualValue('0 0 9px 25px'));
});
// split_property_value(value)
// wtf js dont you have a better way to compare arrays?!?!??!!
test( "test_must_split_hex_values", function() {
  ok( ['#eeeeee', '#fff'].toString() === CssConvertor.splitPropertyValue('#eeeeee #fff').toString() );
  ok( ['#fff','#000','#fff','#000'].toString() === CssConvertor.splitPropertyValue('#fff #000 #fff #000').toString() );
});
test( "test_must_split_rgba_values", function() {
  ok( ['rgb(0, 0, 0)','rgba(0, 0, 0, 0.15)'].toString() === CssConvertor.splitPropertyValue('rgb(0, 0, 0) rgba(0, 0, 0, 0.15)').toString() );
  ok( ['rgba(0, 0, 0, 0.15)','rgb(0, 0, 0)','rgba(0, 0, 0, 0.15)','rgb(0, 0, 0)'].toString() === CssConvertor.splitPropertyValue('rgba(0, 0, 0, 0.15)rgb(0, 0, 0)rgba(0, 0, 0, 0.15)rgb(0, 0, 0)').toString() );
});
test( "test_must_split_hsla_values", function() {
  ok( ['hsl(10%, 40%, 20%)'].toString() === CssConvertor.splitPropertyValue('hsl(10%, 40%, 20%)').toString() );
  ok( ['hsl(10%, 40%, 20%)','hsla(10%, 40%, 20%,0)', 'hsla(10%, 40%, 20%,0)'].toString() === CssConvertor.splitPropertyValue('hsl(10%, 40%, 20%) hsla(10%, 40%, 20%,0) hsla(10%, 40%, 20%,0)').toString() );
});
test( "test_must_split_length_values", function() {
  ok( ['10px', '20%', '1.3em'].toString() === CssConvertor.splitPropertyValue('10px 20% 1.3em').toString() );
});
test( "test_must_split_word_values", function() {
  ok( ['right'].toString() === CssConvertor.splitPropertyValue('right').toString() );
  ok( ['red','blue','green','yellow'].toString() === CssConvertor.splitPropertyValue('red blue green yellow').toString() );
});
test( "test_must_split_mixed_values", function() {
  ok( ['#ffff','rgba(0,0,0,0)','red','hsl(10%,10%,10%)'].toString() === CssConvertor.splitPropertyValue('#ffff rgba(0,0,0,0) red hsl(10%,10%,10%)').toString() );
});
// new_value(type, value)
test( "test_must_get_correct_new_value_with_quad", function() {
  ok( '1px 2px 3px' === CssConvertor.newValue('quad','1px 2px 3px') );
  ok( '1px 4px 3px 2px' === CssConvertor.newValue('quad','1px 2px 3px 4px') );
  ok( '1px 4px 3px 2px !important' === CssConvertor.newValue('quad','1px 2px 3px 4px !important') );
});
test( "test_must_get_correct_new_value_with_quad_radius", function() {
  ok( '10% 20%' === CssConvertor.newValue('quad_radius','10% 20%') );
  ok( '10% 20% 3.3em 10px' === CssConvertor.newValue('quad_radius','20% 10% 10px 3.3em') );
  ok( '10% 20% 3.3em 10px\\9' === CssConvertor.newValue('quad_radius','20% 10% 10px 3.3em\\9') );
});
test( "test_must_get_correct_new_value_with_direction", function() {
  ok( 'left' === CssConvertor.newValue('direction','right') );
  ok( 'rtl !important' === CssConvertor.newValue('direction','ltr !important') );
});
// value(property_name, property_value)
test( "test_must_get_correct_value", function() {
  ok( 'justify' === CssConvertor.value('text-align','justify') );
  ok( '10px 30px 10px' === CssConvertor.value('margin','10px 30px 10px') );
  ok( 'right' === CssConvertor.value('float','left') );
  ok( '10px 25.5% 3.0em 20% !important' === CssConvertor.value('padding','10px 20% 3.0em 25.5% !important') );
});
// property(property_name)
test( "test_must_get_correct_value", function() {
  ok( 'margin' === CssConvertor.property('margin') );
  ok( 'margin-right' === CssConvertor.property('margin-left') );
});
// scan_and_replace(str)
test( "test_must_scan_and_replace_correctly_or_else", function() {
  ok( 'p {margin-left: 10px;float: right}' === CssConvertor.scanAndReplace('p {margin-right: 10px;float: left}') );
});