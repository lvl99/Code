/*

	Plugin Name: 			Sticky
	Plugin Version: 		0.1
	Plugin Description:  	'Sticks' an element to a spot for scrolling.
	Plugin URL:				http://www.github.com/
	
	Author Name: 			Matt Scheurich
	Author Email: 			matt@lvl99.com
	Author URL: 			http://www.lvl99.com/

*/
(function(){
	
	var stickyElems = [];
	
	function stickyElements() {
	
		if ( jQuery ) {
		
			var scrollTop = $(window).scrollTop(),
				debugStatus;
		
			for ( x in stickyElems ) {
			
				// Set position
				if ( !stickyElems[x].stickySettings.position ) stickyElems[x].stickySettings.position = $(stickyElems[x]).offset();
				
				// Set scrollTop
				if ( !stickyElems[x].stickySettings.scrollTop ) stickyElems[x].stickySettings.scrollTop = stickyElems[x].stickySettings.position.top;
				
				// Process some values (only do it once)
				if ( !stickyElems[x].stickySettings.processed ) {
				
					// Check parents' relativity
					$(stickyElems[x]).parents().each( function() {
						if ( $(this).css('position') == 'relative' ) {
							var parentOffset = $(this).offset();
							stickyElems[x].stickySettings.scrollTop = parentOffset.top;
							stickyElems[x].stickySettings.position.left -= parentOffset.left;
							stickyElems[x].stickySettings.position.top -= parentOffset.top;
						}
					});
					
					// Subtract buffer from scrollTop
					if ( stickyElems[x].stickySettings.bufferTop ) stickyElems[x].stickySettings.scrollTop -= stickyElems[x].stickySettings.bufferTop;
					
					// Set constraints based on element selector/object
					if ( stickyElems[x].stickySettings.constrainTo ) {
						stickyElems[x].stickySettings.scrollTopMax = $(stickyElems[x].stickySettings.constrainTo).outerHeight()-$(stickyElems[x]).outerHeight()+stickyElems[x].stickySettings.scrollTop;
						/*if ( $.browser.msie ) {
							$('body').append( '<div id="debug" style="position: absolute; left: 0; top: 0; background: white; color: black"></div>' );
						}*/
					}
					
					stickyElems[x].stickySettings.processed = 1;
				}
			
				// Set position
				if ( scrollTop > stickyElems[x].stickySettings.scrollTop ) {
				
					// Constrained using scrollTopMax
					if ( stickyElems[x].stickySettings.scrollTopMax ) {
						if ( scrollTop < stickyElems[x].stickySettings.scrollTopMax ) {
							debugStatus = 'constrained - moving';
							$(stickyElems[x]).css({
								position:		'absolute',
								top:			(scrollTop-stickyElems[x].stickySettings.scrollTop)+'px'
							});
						} else {
							debugStatus = 'constrained - not moving';
						}
					
					// Normal
					} else {
						debugStatus = 'normal';
						$(stickyElems[x]).css({
							position:		'absolute',
							top:			(scrollTop-stickyElems[x].stickySettings.scrollTop)+'px'
						});
					}
					
				} else {
					debugStatus = 'reset to original position';
					// Reset to original position
					$(stickyElems[x]).css({
						position:		'absolute',
						top:			stickyElems[x].stickySettings.position.top+'px'
					});
				}
				
				if ( $('#debug') ) {
					$('#debug').css('top', scrollTop).html('<p>scrollTop: '+scrollTop+'<br/>sticky.scrollTop: '+stickyElems[x].stickySettings.scrollTop+'<br/>sticky.scrollTopMax: '+stickyElems[x].stickySettings.scrollTopMax+'<br/>'+debugStatus+'<br/>New pos: '+(scrollTop-stickyElems[x].stickySettings.scrollTop)+'</p>');
				}
			}
		}
	
	}
	
	window.onscroll = stickyElements;
	
	$.fn.sticky = function( options ) {
		
		var settings = $.extend({
			bufferLeft:		0,
			bufferTop:		10
		}, options );
		
		return this.each( function() {
			settings.processed = 0;
			this.stickySettings = settings;
			stickyElems.push( this );
		});
		
	};
	
})();