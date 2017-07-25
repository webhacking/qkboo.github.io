<script>
$(document).ready(function(){
  var offsetTop = $('.row-floating').offset().top;
  var actualWidth =$('.row-floating').width(); 
  $(window).scroll(function() {
    if( window.scrollY >= offsetTop){
      $('.row-floating').css('position', 'fixed').css('top', 0).css('width',actualWidth);
    } else {
      $('.row-floating').css('position', 'relative').css('top', 'auto').css('width','auto');
    }
  });
});
</script>
