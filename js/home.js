
var audio = new Audio('coin.wav');
var boom = new Audio('boom.mp3');

var reloading = false;

var colors = ['#1abc9c', '#16a085', '#2ecc71', '#27ae60', '#3498db', '#9b59b6', '#8e44ad', '#34495e', '#2c3e50', '#f1c40f', '#f39c12', '#e67e22', '#d35400', '#e74c3c', '#c0392b'];

var characters, coins;

$(document).ready(function() {
	var windowWidth = $(window).width();
	var windowHeight = $(window).height();
	characters = [];
	coins = [];
	for (i = 0; i < Math.round(windowWidth * windowHeight / 40000); i++) {
		characters[i] = {
			'x': (Math.random() * (windowWidth - 33)) | 0,
			'y': (Math.random() * (windowHeight - 33)) | 0,
			'xVelocity': 0,
			'yVelocity': 0,
			'moving': false,
			'color': (Math.random() * colors.length) | 0
		};
		$('section#game').append('<div style=\'display: none; top: ' + characters[i].y + 'px; left: ' + characters[i].x + 'px; background-color: ' + colors[characters[i].color] + '; z-index: ' + (i + 2) + ';\'></div>');
		characters[i].html = $('section#game div:last-child');
	}
	for (i = 0; i < characters.length * 2.5; i++) {
		coins[i] = {
			'x': (Math.random() * (windowWidth - 21)) | 0,
			'y': (Math.random() * (windowHeight - 21)) | 0
		}
		$('section#game').append('<div class=\'coin\' style=\'display: none; top: ' + coins[i].y + 'px; left: ' + coins[i].x + 'px;\'></div>');
		coins[i].html = $('section#game div:last-child');
	}
	setTimeout(function() {
		$('section#game div.coin').show('slow');
		setTimeout(function() {
			$('section#game div').not('.coin').show('slow');
			setTimeout(function() {
				setInterval(update, 25);
			}, 1000);
		}, 500);
	}, 1000);
	$('a#sniper').click(function() {
		$(this).toggleClass('active');
	});
	$('section#game div').not('.coin').click(function() {
		if ($('a#sniper').hasClass('active') && !reloading) {
			$(this).addClass('dead');
			var div = $(this);
			setTimeout(function() {
				div.fadeOut(2000);
			}, 1000, div);
		}
		else {
			$(this).toggleClass('marked');
		}
	});
	$('body').click(function(event) {
		if ($('a#sniper').hasClass('active')) {
			if (!reloading) {
				$('div#explosion').css({
					'top': event.pageY + 'px',
					'left': event.pageX + 'px'
				});
				$('div#explosion').fadeIn('fast', function() {
					$('div#explosion').fadeOut(1000);
				});
				boom.load();
				boom.play();
				reloading = true;
				setTimeout(function() {
					reloading = false;
				}, 3500);
			}
		}
	});
});

function update() {
	for (i = 0; i < characters.length; i++) {
		if (characters[i].html.hasClass('dead')) {
			continue;
		}
		if (Math.round(Math.random() * 200) == 100) {
			characters[i].moving = Math.random() > 0.25;
			characters[i].xVelocity = Math.round(Math.random() * 3 - 1.5);
			if (Math.random() > characters[i].x / $(window).width()) {
				characters[i].xVelocity = Math.abs(characters[i].xVelocity);
			}
			else {
				characters[i].xVelocity = -Math.abs(characters[i].xVelocity);
			}
			characters[i].yVelocity = Math.round(Math.random() * 3 - 1.5);
			if (Math.random() > characters[i].y / $(window).height()) {
				characters[i].yVelocity = Math.abs(characters[i].yVelocity);
			}
			else {
				characters[i].yVelocity = -Math.abs(characters[i].yVelocity);
			}
		}
		if (characters[i].moving) {
			characters[i].x = Math.max(Math.min(characters[i].x + characters[i].xVelocity, $(window).width() - 33), 0);
			characters[i].y = Math.max(Math.min(characters[i].y + characters[i].yVelocity, $(window).height() - 33), 0);
			var x = characters[i].x;
			var y = characters[i].y;
			characters[i].html.css({
				'top': y,
				'left': x
			});
		}
	}
	for (j = 0; j < coins.length; j++) {
		if (coins[j].x + 15 >= characters[0].x && coins[j].x <= characters[0].x + 25 && coins[j].y + 15 >= characters[0].y && coins[j].y <= characters[0].y + 15) {
			audio.load();
			audio.play();
			coins[j].html.hide('slow');
			coins.splice(j, 1);
		}
	}
}
