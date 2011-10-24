/*

	Plugin Name: 			LVL99 Swiper
	Plugin Version: 		0.1
	Plugin Description:		Basic slideshow plugin with a focus on interactivity
	Plugin URL:				http://www.lvl99.com/code/swiper
	
	Author Name: 			Matt Scheurich
	Author Email: 			matt@lvl99.com
	Author URL: 			http://www.lvl99.com/

*/
(function(){

	// Convert to Roman Numerals
	// copyright 25th July 2005, by Stephen Chapman http://javascript.about.com
	// permission to use this Javascript on your web page is granted
	// provided that all of the code (including this copyright notice) is
	// used exactly as shown
	function roman(n,s) {var r = '';var d; var rn = new Array('IIII','V','XXXX','L','CCCC','D','MMMM'); for (var i=0; i< rn.length; i++) {var x = rn[i].length+1;var d = n%x; r= rn[i].substr(0,d)+r;n = (n-d)/x;} if (s) {r=r.replace(/DCCCC/g,'CM');r=r.replace(/CCCC/g,'CD');r=r.replace(/LXXXX/g,'XC');r=r.replace(/XXXX/g,'XL');r=r.replace(/VIIII/g,'IX');r=r.replace(/IIII/g,'IV');} return r;}

	// Swiper Application
	function LVL99Swiper( elem, options ) {
	
		// Settings
		var settings = $.extend({
			type:				'mousewheel mousemove', // '' | (mousewheel &| mousemove)
			align:				'center middle', // (top | middle | bottom) (left | center | right)
			wrap:				0,
			transition:			'fade', // fade | slide-x | slide-y | grow | none
			transitionTime:		300,
			startOnItemIndex:	0,
			autoEnable:			0,
			autoWrap:			1,
			autoTime:			8000,
			autoPauseOnHover:	1,
			pagerEnable:		1,
			pagerItemContent:	'&bullet;', //alpha-lower | alpha-upper | number | roman-lower | roman-upper | enter-custom-html
			pagerHide:			1,
			pagerHideDelay:		1500,
			oninit:				function(){},
			onshow:				function(){},
			onautoplay:			function(){},
			onautostop:			function(){}
		}, options);
		
		// Set up vars
		var $elem = $(elem);
		var $panels = $elem.children();
		var random = '';
		if ( !random ) {
			while ( random.length < 16 ) {
				var n = Math.floor(Math.random()*25);
				random += String.fromCharCode(97+n); //a-z
			}
		}
		if ( !$elem.attr('id') ) $elem.attr( 'id', 'lvl99-swiper-'+random );
		
		// Build pager
		if ( settings.pagerEnable ) {
			var $pager = $('<div class="lvl99-swiper-pager"></div>');
			$panels.each( function(index, child) {
				
				// Custom bullet
				var pagerItemBullet = settings.pagerItemContent;
				
				// Alphabetical bullet
				if ( /^alpha/i.test(settings.pagerItemContent) ) {
					pagerItemBullet = itemBullet = index > 24 ? String.fromCharCode(97+(index%24)) : String.fromCharCode(97+index);
					for ( i=0; i<Math.floor(index/24); i++ ) {
						pagerItemBullet += itemBullet;
					}
					if ( /upper$/i.test(settings.pagerItemContent) ) pagerItemBullet = pagerItemBullet.toUpperCase();
				
				// Numerical/Roman bullet
				} else if ( /^(number|roman)/i.test(settings.pagerItemContent) ) {
					pagerItemBullet = index+1;
					if ( /^roman/i.test(settings.pagerItemContent) ) pagerItemBullet = roman(pagerItemBullet,1);
					if ( /upper$/i.test(settings.pagerItemContent) ) pagerItemBullet = pagerItemBullet.toUpperCase();
				}
				
				var $pagerItem = $('<a href="javascript:void(null)">'+pagerItemBullet+'</a>');
				
				// Pager item event
				$pagerItem.click( function(event) {
					event.preventDefault();
					var itemIndex = $(this).parent().children().index( $(this) );
					$elem.trigger('swiper_show', [ itemIndex ]);
				});
				
				$pager.append( $pagerItem );
			});
			
			// Pager design
			$pager.css({
				position: 		'absolute',
				left: 			0,
				bottom: 		'15px',
				zIndex: 		10,
				width: 			'100%',
				textAlign: 		'center'
			});
			$pager.appendTo( $elem );
		}
		
		// Display
		$elem.addClass('lvl99-swiper').css({
			position:		'relative',
			overflow:		'hidden'
		});
		
		$panels.css('position','absolute').addClass('lvl99-swiper-panel');
		
		// Align children on X axis
		if ( /left/i.test(settings.align) ) {
			$panels.css('left',0).hide();
		} else if ( /right/i.test(settings.align) ) {
			$panels.css('right',0).hide();
		} else if ( /center/i.test(settings.align) ) {
			$panels.each( function(index, child) {
				var childXPos = Math.floor($(this).width()/2);
				$(this).css({
					left:			'50%',
					marginLeft:		'-'+childXPos+'px'
				}).hide();
			});
		}
		
		// Align children on Y axis
		if ( /top/i.test(settings.align) ) {
			$panels.css('top',0).hide();
		} else if ( /bottom/i.test(settings.align) ) {
			$panels.css('bottom',0).hide();
		} else if ( /middle/i.test(settings.align) ) {
			$panels.each( function(index, child) {
				var childYPos = Math.floor($(this).height()/2);
				$(this).css({
					top:			'50%',
					marginTop:		'-'+childYPos+'px'
				}).hide();
			});
		}
		
		// Data
		$.data(elem, 'swiperPanels', $panels);
		$.data(elem, 'swiperPager', $pager);
		$.data(elem, 'swiperTransition', settings.transition);
		$.data(elem, 'swiperTransitionTime', settings.transitionTime);
		$.data(elem, 'swiperWrap', settings.wrap);
		$.data(elem, 'swiperAutoEnable', settings.autoEnable);
		$.data(elem, 'swiperAutoTime', settings.autoTime);
		$.data(elem, 'swiperAutoWrap', settings.autoWrap);
		$.data(elem, 'swiperAutoPauseOnHover', settings.autoPauseOnHover);
		
		// Events
		$elem.bind('swiper_show', function(event, _itemIndex) {
			var $item = $panels.eq(_itemIndex);
			if ( $item.length != 1 || $item.is(':visible') ) return false;
			if ( $panels.filter(':visible').length > 1 ) return false;
			
			// Show new item
			var $current = $panels.filter(':visible');
			$current.removeClass('selected').css({
				zIndex:		1
			});
			$item.addClass('selected').css({
				zIndex:		5
			});
			
			// Fade transition
			if ( /^fade$/i.test($.data(this, 'swiperTransition')) ) {
				$item.fadeIn( parseInt($.data(this, 'swiperTransitionTime')), function() {
					$current.hide();
					if ( typeof settings.onshow == 'function' ) settings.onshow( $elem[0] );
				});
				
			// Slide transition
			} else if ( /^slide/.test($.data(this, 'swiperTransition')) ) {
			
				// Slide X
				if ( /^slide-x$/.test($.data(this, 'swiperTransition')) ) {
					if ( !$item.data('swiper_width') ) $item.data('swiper_width', $(this).width());
					
					// Before and After CSS animation states
					var cssBefore = {
						width:			0,
						overflow:		'hidden'
					};
					var cssAfter = {
						width:			$item.data('swiper_width'),
					};
					
					// Adjust for center/middle particular align
					if ( /center/i.test(settings.align) ) {
						cssBefore.marginLeft = 0;
						cssAfter.marginLeft = -($.data($item[0], 'swiper_width')/2);
					}
					
					$item.css(cssBefore).show().animate(cssAfter, parseInt($.data(this, 'swiperTransitionTime')), function() {
						$current.hide();
						if ( typeof settings.onshow == 'function' ) settings.onshow( $elem[0] );
					});
				}
			
				// Slide Y
				if ( /^slide-y$/.test($.data(this, 'swiperTransition')) ) {
					$item.slideDown( parseInt($.data(this, 'swiperTransitionTime')), function() {
						$current.hide();
						if ( typeof settings.onshow == 'function' ) settings.onshow( $elem[0] );
					});
				}
			
			// Grow
			} else if ( /^grow$/i.test($.data(this, 'swiperTransition')) ) {
				if ( !$item.data('swiper_width') ) $item.data('swiper_width', $(this).width());
				if ( !$item.data('swiper_height') ) $item.data('swiper_height', $(this).height());
				
				// Before and After CSS animation states
				var cssBefore = {
					width:			0,
					height:			0,
					overflow:		'hidden',
					opacity:		0
				};
				var cssAfter = {
					width:			$item.data('swiper_width'),
					height:			$item.data('swiper_height'),
					opacity:		1
				};
				
				// Adjust for center/middle particular align
				if ( /center/i.test(settings.align) ) {
					cssBefore.marginLeft = 0;
					cssAfter.marginLeft = -($.data($item[0], 'swiper_width')/2);
				}
				if ( /middle/i.test(settings.align) ) {
					cssBefore.marginTop = 0;
					cssAfter.marginTop = -($.data($item[0], 'swiper_height')/2);
				}
				
				// Do animation
				$item.css(cssBefore).show().animate(cssAfter, parseInt($.data(this, 'swiperTransitionTime')), function() {
					$current.hide();
					if ( typeof settings.onshow == 'function' ) settings.onshow( $elem[0] );
				});
			
			// No transition
			} else {
				$item.show();
				$current.hide();
				if ( typeof settings.onshow == 'function' ) settings.onshow( $elem[0] );
			}
			
			// Update pager
			if ( settings.pagerEnable ) {
				var itemIndex = $panels.index( $item );
				$pager.children().filter('.selected').removeClass('selected');
				$pager.children().eq(itemIndex).addClass('selected');
			}
			
		}).bind('swiper_next', function() {
			var nextIndex = $panels.index($panels.filter(':visible').next());
			if ( ( $.data(this, 'swiperWrap') || $.data(this, 'swiperAutoWrap') ) && ( nextIndex > $panels.length-1 || nextIndex == -1 ) ) nextIndex = 0;
			if ( nextIndex >= 0 ) $(this).trigger('swiper_show', [ nextIndex ]);
			
		}).bind('swiper_prev', function() {
			var prevIndex = $panels.index($panels.filter(':visible').prev());
			if ( ( $.data(this, 'swiperWrap') || $.data(this, 'swiperAutoWrap') ) && prevIndex < 0 ) prevIndex = $panels.length-1;
			if ( prevIndex >= 0 ) $(this).trigger('swiper_show', [ prevIndex ]);
			
		}).bind('swiper_pager_show', function() {
			if ( settings.pagerEnable ) $pager.fadeIn('fast');

		}).bind('swiper_pager_hide', function() {
			if ( settings.pagerEnable && settings.pagerHide ) $pager.fadeOut('slow');

		}).bind( 'swiper_pager_hidedelay', function() {
			clearTimeout( $.data(this, 'swiper_pager_hidetimer') );
			if ( settings.pagerEnable && settings.pagerHide ) $.data(this, 'swiper_pager_hidetimer', setTimeout("$('#"+$(this).attr('id')+"').trigger('swiper_pager_hide')", settings.pagerHideDelay ) );
		
		}).mouseenter( function() {
			clearTimeout( $.data(this, 'swiper_pager_hidetimer') );
			if ( settings.pagerEnable && settings.pagerHide ) $(this).trigger('swiper_pager_show');
			if ( $.data(this, 'swiperAutoEnable') && $.data(this, 'swiperAutoPauseOnHover') ) $(this).trigger('swiper_auto_stop');
			
		}).mouseleave( function() {
			if ( settings.pagerEnable && settings.pagerHide ) $(this).trigger('swiper_pager_hidedelay');
			if ( $.data(this, 'swiperAutoEnable') && $.data(this, 'swiperAutoPauseOnHover') ) $(this).trigger('swiper_auto_play');

		}).bind( 'swiper_auto_play', function() {
			if ( $.data(this, 'swiperAutoEnable') ) $.data(this, 'swiper_auto_timer', setInterval("$('#"+$(this).attr('id')+"').trigger('swiper_next')", $.data(this, 'swiperAutoTime') ) );
			if ( typeof settings.onautoplay == 'function' ) settings.onautoplay( $elem[0] );
			
		}).bind( 'swiper_auto_stop', function() {
			clearInterval( $.data(this, 'swiper_auto_timer') );
			if ( typeof settings.onautostop == 'function' ) settings.onautostop( $elem[0] );
		});
		
		// Enable mousewheel swiper
		// Will only work if you have the jQuery.mousewheel plugin
		if ( $.fn.mousewheel && /mousewheel/i.test(settings.type) ) {
			$elem.mousewheel( function(event, delta) {
				event.preventDefault();
				if ( delta < 0 ) {
					$(this).trigger('swiper_next');
				} else if ( delta > 0 ) {
					$(this).trigger('swiper_prev');
				}
			});
		}
		
		// Enable mousemove swiper
		if ( /mousemove/i.test(settings.type) ) {
			settings.mouseMoveInc = Math.round($elem.outerWidth()/$panels.length);
			$elem.bind( 'mouseenter mousemove', function(event) {
				$(this).trigger('swiper_show', [ Math.floor((event.pageX-this.offsetLeft)/settings.mouseMoveInc) ]);
			});
		}
		
		// Initialise Swiper
		if ( typeof settings.oninit == 'function' ) settings.oninit( $elem[0] );
		$elem.trigger('swiper_show', [ settings.startOnItemIndex ]);
		if ( settings.pagerEnable && settings.pagerHide ) $elem.trigger('swiper_pager_hidedelay');
		if ( settings.autoEnable ) $elem.trigger('swiper_auto_play');
		
	};
	
	$.fn.swiper = function( _options ) {
		
		return this.each( function() {
			LVL99Swiper(this, _options);
		});
		
	};
	
})();