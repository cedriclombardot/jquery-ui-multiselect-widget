/*
 * jQuery MultiSelect UI Widget Filtering Plugin
 * Copyright (c) 2010 Eric Hynds
 *
 * http://www.erichynds.com/jquery/jquery-ui-multiselect-widget/
 *
 * Depends:
 *   - jQuery UI MultiSelect widget
 *
 * Dual licensed under the MIT and GPL licenses:
 *   http://www.opensource.org/licenses/mit-license.php
 *   http://www.gnu.org/licenses/gpl.html
 *
*/
(function($){

	$.widget("ech.multiselectfilter", {
		
		options: {
			label: "Filter:",
			width: null, /* override default width set in css file (px). null will inherit */
			placeholder: "Enter keywords"
		},
		
		_create: function(){
			var self = this,
				instance = $(this.element).data("multiselect"),
				inputs = instance.menu.find(":checkbox, :radio"),
				header = instance.menu.find(".ui-multiselect-header"),
				opts = this.options,
				
				// build the input box
				input = header
					.prepend('<div class="ui-multiselect-filter">'+(opts.label.length ? opts.label : '')+'<input placeholder="'+opts.placeholder+'" type="text"' + (/\d/.test(opts.width) ? 'style="width:'+opts.width+'px"' : '') + ' /></div>')
					.find("input")
					.bind("keydown", function( e ){
						// prevent the enter key from submitting the form / closing the widget
						if( e.keyCode === 13 ){
							return false;
						}
					})
					.bind("keyup", filter ),
				
				// each list item
				rows = instance.menu.find(".ui-multiselect-checkboxes li"),
			
				// array of the option tag values
				cache = instance.optiontags.map(function(){
					return this.innerHTML.toLowerCase();
				});
			
			// so the close/check all/uncheck all links can be positioned correctly
			header.addClass("ui-multiselect-hasfilter");
			
			// rewrite internal _toggleChecked fn so that when checkAll is fired,
			// only the currently filtered elements are checked
			instance._toggleChecked = function(flag, group){
				var $inputs = (group && group.length) 
					? group
					: this.labels.find('input');
				
				$inputs.not(':disabled, :hidden').attr('checked', (flag ? 'checked' : '')); 
				this.update();
				this.optiontags.not('disabled').attr('selected', (flag ? 'selected' : ''));
			};
			
			// thx for the logic ben alman
			function filter( e ){
				var term = $.trim( this.value.toLowerCase() );
			
				if( !term ){
					rows.show();
				} else {
					rows.hide();
			
					self._trigger( "filter", e, $.map(cache, function(v,i){
						if ( v.indexOf(term) !== -1 ){
							rows.eq(i).show();
							return inputs.get(i);
						}
						
						return null;
					}));
				}
			}
		}
	});
})(jQuery);
