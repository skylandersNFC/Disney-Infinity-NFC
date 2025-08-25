$(document).ready(function() {
	move();
	
	var x = 0;
	var y = 0;
	var x_dir = 0;
	var y_dir = 0;
	function move() {
		if (x_dir == 0) {
			x--;
		} else {
			x++;
		}
		if (x % 2 == 0 && y_dir == 0) {
			y--;
		}
		else if (y_dir == 1) {
			y++;
		}
		if (x < -250 && x_dir == 0) {
			x_dir = 1;
		}
		else if (x == 0 && x_dir == 1) {
			x_dir = 0;
		}
		if (y < -250 && y_dir == 0) {
			y_dir = 1;
		}
		else if (y == 0 && y_dir == 1) {
			y_dir = 0;
		}
		$('.c-wrapper').css({'background-position':x+'px '+y+'px'});
		setTimeout(move, 100);
	}
});