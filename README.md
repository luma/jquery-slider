jquery-slider
=============

A horizontal slider component for jQuery


## Installation

Embed the script *after* the jQuery library:

    <script src="/path/to/jquery-slider.js"></script>

## Usage

this.$micLevelSlider = this.$el
							.find('.mic-volume-slider')
							.slider({
									value: 50
								}, function(event, value) {
									console.info("Selected Value is " + value);
								}
							);



Add a Mic Level control in each element with the class 'mic-level':

     $('.mic-volume').slider();

Create a Mic Level control, with specific min, max, step, and a starting value:

     $('.mic-volume').slider({
         value: 50,
         min: 0,
         max: 100,
         step: 1
     });

		Create a Mic Level control, with specific starting value and trigger a function when the value is changed:

		     $('.mic-volume').slider({
		         value: 50,
		     }, function(event, value) {
			   	console.info("Selected value is " + value);
		     });

Update the current value:

    $('.mic-level').micLevel('updateValue', 60);


Set the current value:

     $('.mic-volume').slider('setValue', 60);

Get the current value:

     var value = $('.mic-volume').slider('getValue');


## Options

    min: 0

Default: 0

The minimum value that the widget will include.

    max: 100

Default: 100

The maximum value that the widget will include.

    value: 50

Default: 50

The current value that the widget is displaying.

		step: 1

Default: 1

The value will be constrained to even multiples of step. So if step is 2, then value can be 50 or 52, but not 51. Inbetween values will be rounded up to the nearest event multiple.

## Changelog

## Development

- You can find the source at [GitHub](https://github.com/luma/jquery-slider)
- Please report any issues, questions, or feature requestson [GitHub Issues](https://github.com/luma/jquery-slider/issues)

Pull requests are very welcome! Make sure your patches are well tested. Please create a topic branch for every separate change you make.

## Authors

[Rolly Fordham](https://github.com/luma)
