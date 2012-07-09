// jQuery.slider
//  $(...selector...).slider({
//      min: 10,
//      max: 100,
//      step: 1,
//      value: 50
//  });
//
//  $(...selector...).slider('setValue', 60);
//  $(...selector...).slider('getValue');       // => 60
//
//  $(...selector...).on('changevalue.slider', function(value) {
//      console.info("Selected Value is " + value);
//  });
//
// https://github.com/luma/jquery-slider
//
(function( $ ){
    var cancelEvent = function() {return false; },

        methods = {
            init: function(options, onUpdateCb) {
                var settings = $.extend( {
                    min: 0,
                    max: 100,
                    step: 1
                }, options);

                return this.each(function() {
                    var $this = $(this),
                         data = $this.data('slider'),
                         handle;

                    // Create the DOM element
                    $this.addClass('slider').append("<strong></strong><div class='slider-handle'></div>");

                    $handle = $this.find('.slider-handle');

                    data = $.extend(data, {
                        step: settings.step,
                        min: settings.min,
                        interval: settings.max - settings.min,
                        inverseInterval: 1.0 / (settings.max - settings.min),
                        $indicator: $this.find('strong'),
                        $handle:  $handle,
                        handleWidth: $handle.width(),
                        halfHandleWidth: $handle.width()/2.0,
                        _onMouseMove: function(e) { return _onDrag.call($this, e, data); },
                        _onMouseUp: function(e) { return _onMouseUp.call($this, e, data); }
                    });

                    data.indicatorWidth = data.$indicator.width();

                    $this.data('slider', data);

                    data.$handle.on('mousedown.slider', _onMouseDown);
                    data.$indicator.on('mousedown.slider', cancelEvent);
                    // $this.on('mousedown.slider', function(e) {
                    //     return _onMouseDown.call(data.$handle, e, true);
                    // });

                    // Set the current value
                    _setValue($(this), settings.value);
                }).on('changevalue.slider', onUpdateCb);
            },

            setValue: function(value) {
                return this.each(function() {
                    _setValue($(this), value);
                });
            },

            getValue: function() {
                var values = [];

                this.each(function() {
                    var data = $this.data('slider');
                    values.push(data.value);
                });

                switch(values.length) {
                    case 0:
                        return null;
                    case 1:
                        return values[0];
                    default:
                        return values;
                }
            },

            destroy : function( ) {
                return this.each(function(){

                    var $this = $(this),
                         data = $this.data('slider');

                    data.$handle.off('.slider');
                    data.$indicator.off('.slider');
                    $this.off('.slider');
                    $(document.body).off('.slider');
                    $this.data('slider', null);
                });
            }
        };

    $.fn.slider = function(method) {
        if ( methods[method] ) {
          return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
        } else if ( typeof method === 'object' || ! method ) {
          return methods.init.apply( this, arguments );
        } else {
          $.error( 'Method ' +  method + ' does not exist on jQuery.slider' );
        }
    };

    var _setValue = function($this, value) {
            var data = $this.data('slider'),
                steppedValue = value;

            if (data.step > 1) {
                steppedValue = steppedValue + (steppedValue % data.step);
            }

            data.value = steppedValue;
            $this.data('slider', data);

            var left = data.indicatorWidth * steppedValue * data.inverseInterval;
            data.$indicator[0].style.width = left + 'px';
            data.$handle[0].style.marginLeft = left - data.halfHandleWidth + 'px';
        },

        // Converts an absolute position to a slider value.
        _pointToValue = function(x, y, data) {
            var left = x;

            // Constrain the handle position within the widget
            if (left < data.position.left) {
                left = data.position.left;
            } else if ( left > data.position.right) {
                left = data.position.right;
            }

            var value = (left - data.position.left) / data.indicatorWidth;
            return value * data.interval + data.min;
        },

        _cacheInitialPosition = function($this, data) {
            var position = data.$indicator.offset(),
                marginLeft = parseInt(data.$indicator.css('marginLeft'), 10) || 0,
                marginRight = parseInt(data.$indicator.css('marginRight'), 10) || 0;

            position.left = position.left - marginLeft;
            position.right = position.left + data.indicatorWidth + marginRight;
            data.position = position;

            $this.data('slider', data);
        },

        _onMouseDown = function(event, doNotBind) {
            // Don't block the right or middle mouse buttons
            if (event.which !== 1) {
                return true;
            }

            var $this = $(this).parent(),
                data = $this.data('slider');

            // If the position is already setup the this mouse down
            // event is a duplicate.
            if (data.position) {
                return false;
            }

            _cacheInitialPosition($this, data);

            if (doNotBind !== true ) {
                $(document.body).on({
                    'mousemove.slider': data._onMouseMove,
                    'mouseup.slider': data._onMouseUp
                });
            }

            data._onMouseMove(event);
            return false;
        },

        _onDrag = function(event, data) {
            _setValue(
                this,
                _pointToValue(event.pageX, event.pageY, data)
            );

            return false;
        },

        _onMouseUp = function(event, data) {
            if (!data.position) {
                return false;
            }

            $(document.body).off({
                'mousemove.slider': data._onMouseMove,
                'mouseup.slider': data._onMouseUp
            });

            delete data.position;
            this.data('slider', data);

            this.trigger('changevalue.slider', data.value);

            return false;
        };

})( jQuery );