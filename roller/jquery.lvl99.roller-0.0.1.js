/*

	Plugin Name: 			LVL99 Roller
	Plugin Version: 		0.1
	Plugin Description:  	Similar to carousel but much better.
	
	Author Name: 			Matt Scheurich
	Author Email: 			matt@lvl99.com
	Author URL: 			http://www.lvl99.com/
	
*/

(function(){

	$.fn.roller = function( options ) {
	
		// Process default settings
		var settings = $.extend( {
			width:					'auto',
			height:					'auto',
			autoRoll:				1,
			autoRollLength:			5000,
			autoRollPauseOnHover:	0,
			animType:				'slide', // 'none', 'flash', 'fade', 'slide', 'slide-y'
			animLength:				1000,
			animFlashColor:			'#ffffff',
			buildNav:				[ 'prev', 'index', 'next' ],
			startOnItemIndex:		0,
			onRollEnd:				function(){},
			onAutoRollStart:		function(){},
			onAutoRollStop:			function(){}
		}, options );
		
		return this.each( function() {
			
			// Define main variables
			var $subject = $(this),
				$viewport = $('<div class="roller-viewport" />'),
				$items = $(this).children(),
				$nav;
			
			// Get/Set dimensions of roller
			settings.width == 'auto' ? settings.width = $(this).outerWidth() : settings.width = parseInt(settings.width);
			settings.height == 'auto' ? settings.height = $(this).outerHeight() : settings.height = parseInt(settings.height);
			$subject.css({
				width:		settings.width+'px',
				height:		settings.height+'px',
				overflow:	'hidden',
				position:	'relative'
			}).addClass('roller');
			
			// Add necessary properties
			settings.currentItemIndex = 0;
			settings.autoRollTimer = null;
			
			// Build the navigation element
			if ( settings.buildNav.length > 0 ) {
				$nav = $('<ul class="roller-nav" />');
				
				for ( x in settings.buildNav ) {
					var $navItem;
					
					if ( settings.buildNav[x] == 'next' ) {
						$navItem = $('<li class="roller-nav-next"><a href="javascript:void(0);"><span>Next &raquo;</span></a></li>');
						$navItem.appendTo($nav);
						
					} else if ( settings.buildNav[x] == 'prev' ) {
						$navItem = $('<li class="roller-nav-prev"><a href="javascript:void(0);"><span>&laquo; Previous</span></a></li>');
						$navItem.appendTo($nav);
						
					} else if ( settings.buildNav[x] == 'index' ) {
						$items.each( function(i,val) {
							$navItem = $('<li class="roller-nav-item'+( settings.startOnIndex ? ' roller-nav-item-current' : '' )+'"><a href="javascript:void(0);"><span>'+(i+1)+'</span></a></li>');
							$navItem.appendTo($nav);
						});
					}
				}
				
				$nav.appendTo($subject);
				
				// Attach events for buttons
				$nav.find('.roller-nav-next').click( function() {
					$subject.trigger('roller_next');
				});
				
				$nav.find('.roller-nav-prev').click( function() {
					$subject.trigger('roller_prev');
				});
				
				$nav.find('.roller-nav-item').click( function() {
					if ( !$(this).is('.roller-current') ) $subject.trigger('roller_show', [ $nav.find('.roller-nav-item').index(this) ]);
				});
			}
			
			// Attach the settings (primarily used to solve scope issues)
			$subject[0].rollerSettings = settings;
			$subject[0].rollerSettings.items = $items;
			$subject[0].rollerSettings.nav = $nav;
			
			// Prep the items
			$items.addClass('roller-item').css({
				width:		settings.width+'px',
				height:		settings.height+'px'
			}).wrapAll( '<div class="roller-viewport" style="position: relative; width: 100%; height: 100%; overflow: hidden;"></div>' );
			
			// Prepare children for slide on x axis
			if ( settings.animType == 'slide' ) {
				// Get total width of children
				var slideWidth = (settings.width*$items.length)+'px';
				$items.css('float', 'left').wrapAll('<div class="roller-slide-x" style="position: absolute; left: 0; top: 0; width: '+slideWidth+'; height: 100%; overflow: hidden;"></div>' );
			}
			
			// Prepare children for slide on y axis
			if ( settings.animType == 'slide-y' ) {
				// Get total height of children
				var slideHeight = (settings.height*$items.length)+'px';
				$items.wrapAll('<div class="roller-slide-y" style="position: absolute; left: 0; top: 0; width: 100%; height: '+slideHeight+'; overflow: hidden;"></div>' );
			}
			
			// Prepare for fade/flash/no animation
			if ( settings.animType == 'fade' || settings.animType == 'flash' || settings.animType == 'none' || !settings.animType ) {
				$items.css({
					position:		'absolute',
					left:			0,
					top:			0,
					zIndex:			0
				}).hide();
			}
			
			// Attach roller events
			$subject.bind('roller_show', function(event, itemIndex) {
			
				// Checks
				if ( $(this).is('.roller-transition') ) return;
				if ( this.rollerSettings.items.eq(itemIndex).is('.roller-current') ) return;
				
				// Stop autoroll
				if ( this.rollerSettings.autoRoll ) $(this).trigger('roller_autoroll_stop');
				
				// Record transition
				$(this).addClass('roller-transition');
				
				// Check itemIndex is valid or wrap around (at last, go to first, vice versa)
				if ( itemIndex >= this.rollerSettings.items.length ) itemIndex = 0;
				if ( itemIndex < 0 ) itemIndex = this.rollerSettings.items.length-1;
				this.rollerSettings.currentItemIndex = itemIndex;
				
				// Update nav
				if ( settings.buildNav ) {
					this.rollerSettings.nav.find('.roller-nav-item').removeClass('roller-current').eq(itemIndex).addClass('roller-current');
				}
				
				// Anim Types
				// -- Slide X
				if ( this.rollerSettings.animType == 'slide' ) {
					// Current management
					this.rollerSettings.items.filter('.roller-current').removeClass('roller-current');
					this.rollerSettings.items.eq(itemIndex).addClass('roller-current');
					
					// Animate
					$(this).find('.roller-slide-x').animate({
						left:		-(itemIndex*parseInt(this.rollerSettings.width))+'px'
					}, this.rollerSettings.animLength, function() {
						$(this).parents('.roller').trigger('roller_end');
					});
					
				// -- Slide Y
				} else if ( this.rollerSettings.animType == 'slide-y' ) {
					// Current management
					this.rollerSettings.items.filter('.roller-current').removeClass('roller-current');
					this.rollerSettings.items.eq(itemIndex).addClass('roller-current');
					
					// Animate
					$(this).find('.roller-slide-y').animate({
						top:		-(itemIndex*parseInt(this.rollerSettings.height))+'px'
					}, this.rollerSettings.animLength, function() {
						$(this).parents('.roller').trigger('roller_end');
					});
					
				// Fade
				} else if ( this.rollerSettings.animType == 'fade' ) {
					this.rollerSettings.items.filter('.roller-current').css('z-index', 1).removeClass('roller-current').addClass('roller-old');
					this.rollerSettings.items.eq(itemIndex).addClass('roller-current').hide().css('z-index', 2).fadeIn( this.rollerSettings.animLength, function() {
						$(this).parents('.roller').find('.roller-old').css('z-index','').removeClass('roller-old').hide();
						$(this).parents('.roller').trigger('roller_end');
					});
					
				// Flash
				} else if ( this.rollerSettings.animType == 'flash' ) {
					$(this).find('.roller-viewport').append( '<div class="roller-flash" style="background-color: '+this.rollerSettings.animFlashColor+'; z-index: 2; position: absolute; left: 0; top: 0; padding: 0; margin: 0; width: 100%; height: 100%;" />' ); 
					this.rollerSettings.items.filter('.roller-current').removeClass('roller-current').css('z-index', 0).addClass('roller-old');
					this.rollerSettings.items.eq(itemIndex).addClass('roller-current').css('z-index', 1).show();
					this.rollerSettings.items.filter('.roller-old').css('z-index','').removeClass('roller-old').hide();
					$(this).find('.roller-flash').fadeOut( this.rollerSettings.animLength, function() {
						$(this).parents('.roller').trigger('roller_end');
						$(this).remove();
					});
					
				// No anim
				} else {
					this.rollerSettings.items.removeClass('roller-current').hide().eq(itemIndex).addClass('roller-current').show();
					$(this).trigger('roller_end');
				}
				
			// -- End of roll
			}).bind('roller_end', function() {
				$(this).removeClass('roller-transition');
				if ( this.rollerSettings.autoRoll ) $(this).trigger('roller_autoroll_start');
				if ( this.rollerSettings.onRollEnd ) this.rollerSettings.onRollEnd( this );
			
			// -- Go to next item
			}).bind( 'roller_next', function() {
				$(this).trigger( 'roller_show', [ this.rollerSettings.currentItemIndex+1 ] );
			
			// -- Go to previous item
			}).bind( 'roller_prev', function() {
				$(this).trigger( 'roller_show', [ this.rollerSettings.currentItemIndex-1 ] );
			
			});
			
			// Auto roll
			if ( settings.autoRoll ) {
			
				// -- Auto roll start
				$subject.bind( 'roller_autoroll_start', function() {
					var roller = $(this);
					this.rollerSettings.autoRollTimer = setTimeout( function(){
						roller.trigger('roller_next');
					}, this.rollerSettings.autoRollLength );
					if ( settings.onAutoRollStart ) settings.onAutoRollStart( this );
					
				// -- Auto roll stop
				}).bind( 'roller_autoroll_stop', function() {
					clearTimeout( this.rollerSettings.autoRollTimer );
					if ( settings.onAutoRollStop ) settings.onAutoRollStop( this );
					
				});
				
				// -- Pause auto roll on hover
				if ( settings.autoRollPauseOnHover ) {
					$subject.find('.roller-viewport').hover( function() {
						$(this).parents('.roller').trigger('roller_autoroll_stop');
					}, function() {
						$(this).parents('.roller').trigger('roller_autoroll_start');
					});
				}
				
				$subject.trigger('roller_autoroll_start');
				
			}
			
			$subject.trigger('roller_show', settings.startOnItemIndex);
			
		});
	
	};

})();