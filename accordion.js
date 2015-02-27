(function($) {
	'use strict';
	
	var i, settings;
	
	
	
	/**
	 * Accordion Shortcodes plugin function
	 *
	 * @param object options Plugin settings to override the defaults
	 */
	$.fn.accordionShortcodes = function(options) {
	
		var allTitles  = this.children('.accordion-title'),
			allPanels  = this.children('.accordion-content').hide(),
			firstTitle = allTitles.first(),
			firstPanel = allPanels.first(),
			selectedId = $(window.location.hash),
			duration   = 250,
			settings   = $.extend({
				// Set default settings
				autoClose:    true,
				openFirst:    false,
				openAll:      false,
				clickToClose: false,
				scroll:       false
			}, options),
			click = function() {
				// Only open the item if item isn't already open
				if (!$(this).hasClass('open')) {
					// Close all accordion items
					if (settings.autoClose) {
						allTitles.each(function() {
							closeItem($(this));
						});
					}
					
					// Open clicked item
					openItem($(this));
				}
				// If item is open, and click to close is set, close it
				else if (settings.clickToClose) {
					closeItem($(this));
				}
				
				return false;
			},
			openItem = function(ele) {
				ele.next().slideDown(duration, function() {
					// Scroll page to the title
					if (settings.scroll) {
						$('html, body').animate({
							scrollTop: $(this).prev().offset().top - settings.scrollOffset
						}, duration);
					}
				});
				
				ele.addClass('open');
				ele.attr({
					'aria-selected': 'true',
					'aria-expanded': 'true'
				});
				
				ele.next().attr({
					'aria-hidden': 'false'
				});
			},
			closeItem = function(ele) {
				ele.next().slideUp(duration);
				ele.removeClass('open');
				
				ele.attr({
					'aria-selected': 'false',
					'aria-expanded': 'false'
				});
				
				ele.next().attr({
					'aria-hidden': 'true'
				});
			};
		
		// Remove 'no-js' class since JavaScript is enabled
		$('.accordion').removeClass('no-js');
		
		// Set the scroll offset
		settings.scrollOffset = Math.floor(parseInt(settings.scroll)) | 0;
		
		// Should any accordions be opened on load?
		if (selectedId.length && selectedId.hasClass('accordion-title')) {
			openItem(selectedId);
		}
		else if (settings.openAll) {
			allTitles.each(function() {
				openItem($(this));
			});
		}
		else if (settings.openFirst) {
			openItem(firstTitle);
		}
		
		// Add event listeners
		allTitles.click(click);
		
		allTitles.keydown(function(e) {
			var code = e.which;
			
			// 13 = Return, 32 = Space
			if ((code === 13) || (code === 32)) {
				$(this).click();
			}
		});
		
		// Listen for hash changes (in page jump links for accordions)
		$(window).on('hashchange', function() {
			selectedId = $(window.location.hash);
			
			if (selectedId.length && selectedId.hasClass('accordion-title')) {
				if (settings.autoClose) {
					allTitles.each(function() {
						closeItem($(this));
					});
				}
				
				openItem(selectedId);
			}
		});
		
		return this;
	};
	
	
	
	// Loop through accordion settings objects
	for (var i = 0; i < accordionShortcodesSettings.length; i += 1) {
		settings = accordionShortcodesSettings[i];
		
		$('#' + settings.id).accordionShortcodes(settings);
	}
}(jQuery));