$(document).ready(function () {
  var i, j = 600;
  for(i=0; i<18; i++) {
    $('.s'+i).hide();
  }
  for(i=0; i<16; i++) {
    j+= 400;
    $('.s'+i).delay(j).fadeIn();
  }
  for(i=16; i<18; i++) {
    j+= 1000;
    $('.s'+i).delay(j).fadeIn();
  }
});