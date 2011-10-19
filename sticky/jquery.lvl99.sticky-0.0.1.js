/*

	Plugin Name: 			LVL99 Sticky
	Plugin Version: 		0.1
	Plugin Description:		'Sticks' an element to a persistent spot on the page or within a parent element when scrolling.
	Plugin URL:				http://www.github.com/
	
	Author Name: 			Matt Scheurich
	Author Email: 			matt@lvl99.com
	Author URL: 			http://www.lvl99.com/

*/
(function(){
	
	$.data(document, 'stickyElems', []);
	
	function stickyElements() {
	
		if ( jQuery ) {
		
			var scrollTop = $(window).scrollTop(),
				scrollLeft = $(window).scrollLeft();
				
			if ( !$('#debug-sticky').length ) {
				$('body').append('<div id="debug-sticky" style="background: #fff; color: #000; font-size: 12px; font-family: Arial, sans-serif; padding: 10px; position: fixed; right: 0; bottom: 0; width: 300px;">Debug</div>');
			}
		
			for ( x in $.data(document, 'stickyElems') ) {
			
				var elem = $.data(document, 'stickyElems')[x],
					$elem = $($.data(document, 'stickyElems')[x]),
					css = {},
					trigger = {};
					
				if ( !$('#debug-sticky-'+$elem.attr('id')).length ) {
					$('#debug-sticky').append('<div id="debug-sticky-'+$elem.attr('id')+'">#<span class="sticky-id">'+$elem.attr('id')+'</span> <span class="sticky-type">'+$.data(elem, 'stickyType')+'</span><br/>'+($.data(elem, 'stickyTrackTop') ? '' : '<del>')+'scrollTop: <span class="sticky-scrollTop">'+$.data(elem, 'scrollTop')+'</span>'+($.data(elem, 'stickyTrackTop') ? '' : '</del>')+' '+($.data(elem, 'stickyTrackLeft') ? '' : '<del>')+'<br/>scrollLeft: <span class="sticky-scrollLeft">'+$.data(elem, 'scrollLeft')+'</span>'+($.data(elem, 'stickyTrackLeft') ? '' : '</del>')+'</div>');
				}
				var debug = $('#debug-sticky-'+$elem.attr('id'));
				debug.find('.sticky-scrollTop').text(scrollTop+' / '+($.data(elem, 'scrollTop')-$.data(elem, 'bufferTop'))+' / '+$.data(elem, 'scrollTopMax'));
				debug.find('.sticky-scrollLeft').text(scrollLeft+' / '+($.data(elem, 'scrollLeft')-$.data(elem, 'bufferLeft'))+' / '+$.data(elem, 'scrollLeftMax'));
				
				// Scroll Top
				if ( $.data(elem, 'stickyTrackTop') ) {
					if ( scrollTop > $.data(elem, 'scrollTop')-$.data(elem, 'bufferTop') ) {
						if ( scrollTop-$.data(elem, 'bufferBottom') > $.data(elem, 'scrollTopMax') ) {
							debug.find('.sticky-scrollTop').css('color','red');
							
							// Trigger event
							if ( !$.data(elem, 'funcTriggered').onscrolltopend ) {
								css.position 			= 'absolute';
								css.top 				= $.data(elem, 'scrollTopMax');
								trigger.onscrolltopend 	= 1;
								$.data(elem, 'funcTriggered').onscrolltopend = 1;
							}
							
						} else {
							debug.find('.sticky-scrollTop').css('color','green');
							
							if ( $.data(elem, 'stickyType') == 'absolute' ) {
								css.position 			= 'absolute';
								css.top 				= scrollTop+$.data(elem, 'bufferTop');
							} else {
								css.position			= 'fixed';
								css.top					= $.data(elem, 'bufferTop');
							}
							
							trigger.onscroll 		= 1;
							$.data(elem, 'funcTriggered').onscrolltopstart = 0;
							$.data(elem, 'funcTriggered').onscrolltopend = 0;
						}
						
					} else {
						debug.find('.sticky-scrollTop').css('color','red');

						// Trigger event
						if ( !$.data(elem, 'funcTriggered').onscrolltopstart ) {
							css.position 				= 'absolute';
							css.top 					= $.data(elem, 'scrollTop');
							trigger.onscrolltopstart 	= 1;
							$.data(elem, 'funcTriggered').onscrolltopstart = 1;
						}
						
					}
				} else {
					css.top 						= $.data(elem, 'scrollTop')+'px';
				}
				
				// Scroll Left
				if ( $.data(elem, 'stickyTrackLeft') ) {
					if ( scrollLeft > $.data(elem, 'scrollLeft')-$.data(elem, 'bufferLeft') ) {
						if ( scrollLeft-$.data(elem, 'bufferRight') > $.data(elem, 'scrollLeftMax') ) {
							debug.find('.sticky-scrollLeft').css('color','red');
							
							// Trigger event
							if ( !$.data(elem, 'funcTriggered').onscrollleftend ) {
								css.position 			= 'absolute';
								css.left 				= $.data(elem, 'scrollLeftMax');
								trigger.onscrollleftend	= 1;
								$.data(elem, 'funcTriggered').onscrollleftend = 1;
							}
							
						} else {
							debug.find('.sticky-scrollLeft').css('color','green');
							
							if ( $.data(elem, 'stickyType') == 'absolute' ) {
								css.position 			= 'absolute';
								css.left 				= scrollLeft+$.data(elem, 'bufferLeft');
							} else {
								console.log( $elem.attr('id'), 'scroll', 'fixed' );
								css.position 			= 'fixed';
								css.left 				= $.data(elem, 'bufferLeft');
							}
							
							trigger.onscroll 		= 1;
							$.data(elem, 'funcTriggered').onscrollleftstart = 0;
							$.data(elem, 'funcTriggered').onscrollleftend = 0;
						}
						
					} else {
						debug.find('.sticky-scrollLeft').css('color','red');
						
						// Trigger event
						if ( !$.data(elem, 'funcTriggered').onscrollleftstart ) {
							css.position 				= 'absolute';
							css.left 					= $.data(elem, 'scrollLeft');
							trigger.onscrollleftstart	= 1;
							$.data(elem, 'funcTriggered').onscrollleftstart = 1;
						}
						
					}
				} else {
					css.left 						= $.data(elem, 'scrollLeft');
				}
				
				// Apply CSS
				if ( css.position ) $elem.css('position', css.position);
				if ( css.top != undefined ) $elem.css('top', css.top+'px');
				if ( css.left != undefined ) $elem.css('left', css.left+'px');
				
				// Trigger functions
				if ( trigger ) {
					for ( func in trigger ) {
						if ( $.data(elem, trigger[func]) && typeof $.data(elem, func) == 'function' ) $.data(elem, func)( elem, css.top, css.left, scrollTop, scrollLeft );
					}
				}
				
			}
		}
	
	}
	
	function stickyCheckBuffer( _elem, _buffer ) {
		if ( /(width|height)/i.test(_buffer) ) {
			if ( /width/i.test(_buffer) ) return $(_elem).outerWidth();
			if ( /height/i.test(_buffer) ) return $(_elem).outerHeight();
		} else {
			return _buffer;
		}
	}
	
	window.onscroll = stickyElements;
	
	$.fn.sticky = function( _options ) {
		
		var settings = $.extend({
			stickyType:			'absolute', // absolute | fixed | auto
			stickyTrack:		'top left', // top &| left
			bufferLeft:			0,
			bufferTop:			10,
			bufferRight:		'width',
			bufferBottom:		'height',
			constrainTo:		'',
			oninit:				function( stickyElem ){},
			onscroll:			function( stickyElem, elemTop, elemLeft, scrollTop, scrollLeft ){},
			onscrolltopstart:	function( stickyElem, elemTop, elemLeft, scrollTop, scrollLeft ){},
			onscrolltopend:		function( stickyElem, elemTop, elemLeft, scrollTop, scrollLeft ){},
			onscrollleftstart:	function( stickyElem, elemTop, elemLeft, scrollTop, scrollLeft ){},
			onscrollleftend:	function( stickyElem, elemTop, elemLeft, scrollTop, scrollLeft ){}
		}, _options );
		
		return this.each( function() {
		
			var elem = this;
			
			// Get the position relative to the document
			var elemPos = $(this).offset();
			
			// Properties
			$.data(elem, 'stickyTrackTop', /top/i.test(settings.stickyTrack) );
			$.data(elem, 'stickyTrackLeft', /left/i.test(settings.stickyTrack) );
			$.data(elem, 'bufferTop', stickyCheckBuffer(elem, settings.bufferTop) );
			$.data(elem, 'bufferLeft', stickyCheckBuffer(elem, settings.bufferLeft) );
			$.data(elem, 'bufferRight', stickyCheckBuffer(elem, settings.bufferRight) );
			$.data(elem, 'bufferBottom', stickyCheckBuffer(elem, settings.bufferBottom) );
			$.data(elem, 'originTop', elemPos.top);
			$.data(elem, 'originLeft', elemPos.left);
			$.data(elem, 'scrollTop', elemPos.top);
			$.data(elem, 'scrollLeft', elemPos.left);
			$.data(elem, 'scrollBottom', $(document).height()-$.data(elem, 'bufferBottom') );
			$.data(elem, 'scrollRight', $(document).width()-$.data(elem, 'bufferRight') );
			
			// If the parent(s) is relative, get the position relative to the parent
			$(elem).parents().each( function() {
				if ( $(this).css('position') == 'relative' ) {
					var parentPos = $(this).offset();
					$.data(elem, 'originTop', $.data(elem, 'originTop')-parentPos.top );
					$.data(elem, 'originLeft', $.data(elem, 'originLeft')-parentPos.left );
				}
			});
			
			// Methods
			if ( typeof settings.onscroll == 'function' ) $.data(elem, 'onscroll', settings.onscroll);
			if ( typeof settings.onscrolltopstart == 'function' ) $.data(elem, 'onscrolltopstart', settings.onscrolltopstart);
			if ( typeof settings.onscrolltopend == 'function' ) $.data(elem, 'onscrolltopend', settings.onscrolltopend);
			if ( typeof settings.onscrollleftstart == 'function' ) $.data(elem, 'onscrollleftstart', settings.onscrollleftstart);
			if ( typeof settings.onscrollleftend == 'function' ) $.data(elem, 'onscrollleftend', settings.onscrollleftend);
			$.data(elem, 'funcTriggered', {
				onscrolltopstart: 		0,
				onscrolltopend:			0,
				onscrollleftstart:		0,
				onscrollleftend:		0
			});
			
			// Set constraints based on element selector/object
			if ( settings.constrainTo && $(settings.constrainTo).length == 1 ) {
				$.data(elem, 'scrollBottom', $(settings.constrainTo).outerHeight()-$.data(elem, 'bufferBottom')+$.data(elem, 'originTop') );
				$.data(elem, 'scrollRight', $(settings.constrainTo).outerWidth()-$.data(elem, 'bufferRight')+$.data(elem, 'originLeft') );
			}
			
			// Determine stickyType if not set to absolute or fixed
			// Known issue: Safari and Internet Explorer <= 6 don't support position:fixed (IE) or has trouble with position:fixed inside frames (Safari)
			if ( !/(absolute|fixed)/i.test(settings.stickyType) ) {
				if ( /Safari/i.test(navigator.userAgent) && $(elem).parents('frame') || /MSIE [1-6]/i.test(navigator.userAgent) ) {
					settings.stickyType = 'absolute';
				} else {
					settings.stickyType = 'fixed';
				}
			}
			$.data(elem, 'stickyType', settings.stickyType);
			
			// Add sticky element to the list
			$.data(document, 'stickyElems').push(elem);
			
			console.log( $(elem).attr('id'), $.data(elem) );
			
			// Trigger init event
			if ( typeof settings.oninit == 'function' ) settings.oninit( elem );
			
			//$('body').append('<div style="background: green; width: '+($.data(this, 'scrollLeftMax')-$.data(this, 'scrollLeft'))+'px; height: '+($.data(this, 'scrollTopMax')-$.data(this, 'scrollTop'))+'px; position: absolute; left: '+$.data(this, 'scrollLeft')+'px; top: '+$.data(this, 'scrollTop')+'px; overflow: hidden;">&nbsp;</div>');
			
		});
		
	};
	
})();