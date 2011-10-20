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
			
			if ( $.data(document, 'stickyDebug') ) {
				if ( !$('#debug-sticky').length ) {
					$('body').append('<div id="debug-sticky" style="background: #fff; color: #000; font-size: 12px; font-family: Arial, sans-serif; padding: 10px; position: fixed; right: 0; bottom: 0; width: 300px;">Sticky Debug</div>');
				}
			}
		
			for ( x in $.data(document, 'stickyElems') ) {
			
				var elem = $.data(document, 'stickyElems')[x],
					$elem = $($.data(document, 'stickyElems')[x]),
					css = {},
					trigger = {};
				
				var scrollTopAmount = scrollTop-$.data(elem, 'scrollTop');
				var scrollLeftAmount = scrollLeft-$.data(elem, 'scrollLeft');
				var sticky = {
					elem:				elem,
					scrollTop:			scrollTop,
					scrollLeft:			scrollLeft,
					scrollTopAmount:	scrollTopAmount,
					scrollLeftAmount:	scrollLeftAmount
				}
				
				if ( $.data(document, 'stickyDebug') ) {
					if ( !$('#debug-sticky-'+$elem.attr('id')).length ) {
						$('#debug-sticky').append('<div id="debug-sticky-'+$elem.attr('id')+'">#<span class="sticky-id">'+$elem.attr('id')+'</span> <span class="sticky-type">'+$.data(elem, 'stickyType')+'</span><br/>'+($.data(elem, 'stickyTrackY') ? '' : '<del>')+'scrollTop: <span class="sticky-scrollTop">'+$.data(elem, 'scrollTop')+'</span>'+($.data(elem, 'stickyTrackY') ? '' : '</del>')+' '+($.data(elem, 'stickyTrackX') ? '' : '<del>')+'<br/>scrollLeft: <span class="sticky-scrollLeft">'+$.data(elem, 'scrollLeft')+'</span>'+($.data(elem, 'stickyTrackX') ? '' : '</del>')+'</div>');
					}
					var debug = $('#debug-sticky-'+$elem.attr('id'));
					debug.find('.sticky-scrollTop').text(scrollTop+' / '+($.data(elem, 'scrollTop')-$.data(elem, 'bufferTop'))+' / '+$.data(elem, 'scrollBottom')+' ('+scrollYAmount+') / '+$.data(elem, 'originTop') );
					debug.find('.sticky-scrollLeft').text(scrollLeft+' / '+($.data(elem, 'scrollLeft')-$.data(elem, 'bufferLeft'))+' / '+$.data(elem, 'scrollRight')+' ('+scrollXAmount+') / '+$.data(elem, 'originLeft') );
				}
				
				// Track Scroll Y
				if ( $.data(elem, 'stickyTrackY') ) {
					if ( scrollTop > $.data(elem, 'scrollTop') ) {
						
						// Scroll Top End
						if ( scrollTop > $.data(elem, 'scrollBottom') ) {
							if ( $.data(document, 'stickyDebug') ) debug.find('.sticky-scrollTop').css('color','red');
							
							// Trigger event
							if ( !$.data(elem, 'funcTriggered').onscrolltopend ) {
								css.position 			= 'absolute';
								css.top 				= $.data(elem, 'originBottom');
								trigger.onscrolltopend 	= 1;
								$.data(elem, 'funcTriggered').onscrolltopend = 1;
							}
						
						// Scroll Top
						} else {
							if ( $.data(document, 'stickyDebug') ) debug.find('.sticky-scrollTop').css('color','green');
							
							if ( $.data(elem, 'stickyType') == 'absolute' ) {
								css.position 			= 'absolute';
								css.top 				= scrollTopAmount;
							} else {
								css.position			= 'fixed';
								css.top					= $.data(elem, 'bufferTop');
								css.left				= $.data(elem, 'scrollLeft');
							}
							
							trigger.onscroll 			= 1;
							$.data(elem, 'funcTriggered').onscrolltopstart = 0;
							$.data(elem, 'funcTriggered').onscrolltopend = 0;
						}
					
					// Scroll Top Start
					} else {
						if ( $.data(document, 'stickyDebug') ) debug.find('.sticky-scrollTop').css('color','red');

						// Trigger event
						if ( !$.data(elem, 'funcTriggered').onscrolltopstart ) {
							css.position 				= 'absolute';
							css.top 					= $.data(elem, 'originTop');
							trigger.onscrolltopstart 	= 1;
							$.data(elem, 'funcTriggered').onscrolltopstart = 1;
						}
						
					}
				
				// Don't Track Scroll Y
				} else {
					if ( $.data(elem, 'stickyType') == 'absolute' ) {
						css.top							= $.data(elem, 'originTop');
					}
				}
				
				// Track Scroll X
				if ( $.data(elem, 'stickyTrackX') ) {
					if ( scrollLeft > $.data(elem, 'scrollLeft') ) {
					
						// Scroll Left End
						if ( scrollLeft > $.data(elem, 'scrollRight') ) {
							if ( $.data(document, 'stickyDebug') ) debug.find('.sticky-scrollLeft').css('color','red');
							
							// Trigger event
							if ( !$.data(elem, 'funcTriggered').onscrollleftend ) {
								css.position 			= 'absolute';
								css.left 				= $.data(elem, 'originRight');
								trigger.onscrollleftend	= 1;
								$.data(elem, 'funcTriggered').onscrollleftend = 1;
							}
						
						// Scroll Left
						} else {
							if ( $.data(document, 'stickyDebug') ) debug.find('.sticky-scrollLeft').css('color','green');
							
							if ( $.data(elem, 'stickyType') == 'absolute' ) {
								css.position 			= 'absolute';
								css.left 				= scrollLeftAmount;
							} else {
								css.position 			= 'fixed';
								css.left 				= $.data(elem, 'scrollLeft');
								css.top					= $.data(elem, 'bufferTop');
							}
							
							trigger.onscroll 			= 1;
							$.data(elem, 'funcTriggered').onscrollleftstart = 0;
							$.data(elem, 'funcTriggered').onscrollleftend = 0;
						}
					
					// Scroll Left Start
					} else {
						if ( $.data(document, 'stickyDebug') ) debug.find('.sticky-scrollLeft').css('color','red');
						
						// Trigger event
						if ( !$.data(elem, 'funcTriggered').onscrollleftstart ) {
							css.position 				= 'absolute';
							css.left 					= $.data(elem, 'originLeft');
							trigger.onscrollleftstart	= 1;
							$.data(elem, 'funcTriggered').onscrollleftstart = 1;
						}
						
					}
				
				// Don't Track Scroll X
				} else {
					if ( $.data(elem, 'stickyType') == 'absolute' ) {
						css.left 						= $.data(elem, 'originLeft');
					}
				}
				
				// Fixed => Absolute resets
				if ( $elem.css('position') == 'fixed' && css.position == 'absolute' ) {
					if ( css.top == undefined ) css.top = $.data(elem, 'originTop');
					if ( css.left == undefined ) css.left = $.data(elem, 'originLeft');
				}
				
				// Apply CSS
				if ( css.position ) $elem.css('position', css.position);
				if ( css.top != undefined ) $elem.css('top', css.top+'px');
				if ( css.left != undefined ) $elem.css('left', css.left+'px');
				
				// Trigger functions
				if ( trigger ) {
					for ( func in trigger ) {
						if ( $.data(elem, trigger[func]) && typeof $.data(elem, func) == 'function' ) $.data(elem, func)( sticky );
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
			return parseInt(_buffer);
		}
	}
	
	window.onscroll = stickyElements;
	
	$.fn.sticky = function( _options ) {
		
		var settings = $.extend({
			type:					'auto', // absolute | fixed | auto
			track:					'xy', // x &| y
			bufferLeft:				0, // n | width | height
			bufferTop:				0,
			bufferRight:			'width',
			bufferBottom:			'height',
			constrainTo:			undefined,
			oninit:					function(){},
			onscroll:				function(){},
			onscrolltopstart:		function(){},
			onscrolltopend:			function(){},
			onscrollleftstart:		function(){},
			onscrollleftend:		function(){}
		}, _options );
		
		return this.each( function() {
		
			var elem = this;
			
			// Get the position relative to the document
			var elemOff = $(this).offset();
			
			// Get the position relative to the parent
			var elemPos = $(this).position();
			
			// Properties
			$.data(elem, 'stickyType', settings.type);
			$.data(elem, 'stickyTrackX', /x/i.test(settings.track) );
			$.data(elem, 'stickyTrackY', /y/i.test(settings.track) );
			$.data(elem, 'bufferTop', stickyCheckBuffer(elem, settings.bufferTop) );
			$.data(elem, 'bufferLeft', stickyCheckBuffer(elem, settings.bufferLeft) );
			$.data(elem, 'bufferRight', stickyCheckBuffer(elem, settings.bufferRight) );
			$.data(elem, 'bufferBottom', stickyCheckBuffer(elem, settings.bufferBottom) );
			$.data(elem, 'offsetTop', elemOff.top);
			$.data(elem, 'offsetLeft', elemOff.left);
			$.data(elem, 'positionTop', elemPos.top);
			$.data(elem, 'positionLeft', elemPos.left);
			
			// If parent is relative or fixed, set the origin to position (relative to parent)
			if ( /(relative|fixed)/i.test($(elem).parent().css('position')) ) {
			
				// Origin X
				$.data(elem, 'originTop', elemPos.top );
				if ( $.data(elem, 'stickyTrackY') ) {
					$.data(elem, 'originBottom', elemPos.top+$(elem).parent().outerHeight()+$.data(elem, 'bufferBottom') );
				} else {
					$.data(elem, 'originBottom', $.data(elem, 'originTop') );
				}
				
				// Origin Y
				$.data(elem, 'originLeft', elemPos.left );
				if ( $.data(elem, 'stickyTrackX') ) {
					$.data(elem, 'originRight', elemPos.left+$(elem).parent().outerWidth()+$.data(elem, 'bufferRight') );
				} else {
					$.data(elem, 'originRight', $.data(elem, 'originLeft') );
				}
			
			// If parent is absolute or otherwise, set the origin to offset (relative to document)
			} else {
				
				// Origin X
				$.data(elem, 'originTop', elemOff.top );
				if ( $.data(elem, 'stickyTrackY') ) {
					$.data(elem, 'originBottom', $(document).height()+$.data(elem, 'bufferBottom') );
				} else {
					$.data(elem, 'originBottom', $.data(elem, 'originTop') );
				}
				
				// Origin Y
				$.data(elem, 'originLeft', elemOff.left );
				if ( $.data(elem, 'stickyTrackX') ) {
					$.data(elem, 'originRight', $(document).width()+$.data(elem, 'bufferRight') );
				} else {
					$.data(elem, 'originRight', $.data(elem, 'originLeft') );
				}
				
			}
			
			// Scroll Y area (always relative to document by using offset)
			$.data(elem, 'scrollTop', elemOff.top-$.data(elem, 'bufferTop') );
			if ( $.data(elem, 'stickyTrackY') ) {
				$.data(elem, 'scrollBottom', $(document).height()+$.data(elem, 'bufferBottom') );
			} else {
				$.data(elem, 'scrollBottom', $.data(elem, 'scrollTop') );
			}
			
			// Scroll X area (always relative to document by using offset)
			$.data(elem, 'scrollLeft', elemOff.left-$.data(elem, 'bufferLeft') );
			if ( $.data(elem, 'stickyTrackX') ) {
				$.data(elem, 'scrollRight', $(document).width()+$.data(elem, 'bufferRight') );
			} else {
				$.data(elem, 'scrollRight', $.data(elem, 'scrollLeft') );
			}
			
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
			if ( settings.constrainTo ){
			
				// If set to parent
				if ( /parent/i.test(settings.constrainTo) || typeof settings.constrainTo == 'string' ) {
					settings.constrainTo = $(elem).parent();
				}
				
				// If the constrainTo object exists on the page, change the scrollBottom and scrollRight values
				if ( $(settings.constrainTo).length == 1 ) {
					$.data(elem, 'constrainTo', settings.constrainTo);
					var constrainToPos = $.data(elem, 'constrainTo').offset();
					if ( $.data(elem, 'stickyTrackY') ) $.data(elem, 'scrollBottom', $.data(elem, 'scrollTop')+$.data(elem, 'constrainTo').height()+$.data(elem, 'bufferBottom') );
					if ( $.data(elem, 'stickyTrackX') ) $.data(elem, 'scrollRight', $.data(elem, 'scrollLeft')+$.data(elem, 'constrainTo').width()+$.data(elem, 'bufferRight') );
				}
			}
			
			// Determine stickyType if not set to absolute or fixed
			if ( !/(absolute|fixed)/i.test($.data(elem, 'stickyType')) ) {
			
				// Known issue: Safari and Internet Explorer <= 6 don't support position:fixed (IE) or has trouble with position:fixed inside frames (Safari)
				if ( /Safari/i.test(navigator.userAgent) && $(elem).parents('frame') || /MSIE [1-6]/i.test(navigator.userAgent) ) {
					$.data(elem, 'stickyType', 'absolute');
				
				// Default is fixed (doesn't stutter)
				} else {
					$.data(elem, 'stickyType', 'fixed');
				}
			}
			
			// Add sticky element to the list
			$.data(document, 'stickyElems').push(elem);
			
			// Trigger init event
			if ( typeof settings.oninit == 'function' ) settings.oninit( elem );
			
			if ( $.data(document, 'stickyDebug') ) {
				$('body').append('<div id="sticky-'+$(elem).attr('id')+'-scroll-start" style="background: rgba(0,255,54,.5); position: absolute; left: '+$.data(elem, 'scrollLeft')+'px; top: '+$.data(elem, 'scrollTop')+'px;">'+$(elem).attr('id')+'<br/>left,top<br/>X:'+$.data(elem, 'scrollLeft')+' Y:'+$.data(elem, 'scrollTop')+'</div>' );
				$('body').append('<div id="sticky-'+$(elem).attr('id')+'-scroll-end" style="background: rgba(0,255,54,.5); position: absolute; left: '+$.data(elem, 'scrollRight')+'px; top: '+$.data(elem, 'scrollBottom')+'px;">'+$(elem).attr('id')+'<br/>right,bottom<br/>X:'+$.data(elem, 'scrollRight')+' Y:'+$.data(elem, 'scrollBottom')+'</div>' );
				
				var originStart = '<div id="sticky-'+$(elem).attr('id')+'-origin-start" style="background: rgba(255,54,0,.5); position: absolute; left: '+$.data(elem, 'originLeft')+'px; top: '+$.data(elem, 'originTop')+'px;">Left:'+$.data(elem, 'originLeft')+' Top:'+$.data(elem, 'originTop')+'</div>';
				var originEnd = '<div id="sticky-'+$(elem).attr('id')+'-origin-end" style="background: rgba(255,0,54,.5); position: absolute; left: '+$.data(elem, 'originRight')+'px; top: '+$.data(elem, 'originBottom')+'px;">Right:'+$.data(elem, 'originRight')+' Bottom:'+$.data(elem, 'originBottom')+'</div>';
				
				if ( $.data(elem, 'constrainTo').length == 1 ) {
					$.data(elem, 'constrainTo').append(originStart);
					$.data(elem, 'constrainTo').append(originEnd);
				} else {
					$('body').append(originStart);
					$('body').append(originEnd);
				}
			}
			
		});
		
	};
	
})();