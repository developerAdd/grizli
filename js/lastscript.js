$(document).on('click', '.product-tab__links a', function (e) {
	e.preventDefault()

	if ($(this).hasClass('active')) {
		return
	}

	var index = $(this).index()
	$('.product-tab__links a').removeClass('active')
	$('.product-tab__body').removeClass('active')
	$('.product-tab__body:eq(' + index + ')').addClass('active')
	$(this).addClass('active')
})
$(document).on('click', '.product-block__main-tabs-item', function (e) {
	e.preventDefault()

	if ($(this).hasClass('active')) {
		return
	}

	var index = $(this).index(),
		tab = $('.product-block__tab-item:eq(' + index + ')')
	$('.product-block__tab-item:visible').fadeOut(200, function () {
		$('.product-block__tab-item').removeClass('active')
		index === 0
			? tab.parent().removeClass('active')
			: tab.parent().addClass('active')
		tab.fadeIn(400, function () {
			tab.addClass('active')
		})
	})
})

$(document).on('click', '.product-block__color-item', function (e) {
	e.preventDefault()

	if ($(this).hasClass('active')) {
		return
	}

	if ($('.threesixty').hasClass('inited')) {
		$('.threesixty').fadeOut(400, function () {
			$('.product-block__images-box > img').fadeIn()
		})
	}

	var image = $(this).data('image')
	$('.product-block__color-item').removeClass('active')
	$(this).addClass('active')
	$('.product-block__images-box img').attr('src', image)
})

$(document).on('click', '.product-block__rotate-button button', function (e) {
	e.preventDefault()
	var rotateBox = $('.threesixty')
	var rotateImage = []
	console.log(view360source)

	for (var i = 1; i <= frameNumber; i++) {
		var image = '/360image/_' + i + '.png'
		rotateImage.push(image)
	}

	$('.product-block__images-box > img').fadeOut(500, function () {
		var threesixty = new ThreeSixty(document.getElementById('threesixty'), {
			image: rotateImage,
		})
		rotateBox.addClass('inited')
		rotateBox.fadeIn()
	})
})

$('[data-remodal-target="moreproduct"]').on('click', function (e) {
	var link = $(this).closest('.product-section').data('link'),
		type = $(this).data('type')

	if (window.location.origin == 'https://dev.solvers.group') {
		link = 'https://dev.solvers.group/grizli/' + link
	}

	$.ajax({
		type: 'GET',
		url: link,
		success: function success(response) {
			var content = $(response).find('.product-block')
			$('[data-remodal-id="moreproduct"] .remodal__ajax-content').html('')
			content.appendTo(
				$('[data-remodal-id="moreproduct"] .remodal__ajax-content')
			)

			if (type == 'accessories') {
				$('.product-block__main-tabs-item[data-type="accessories"]').trigger(
					'click'
				)
			}
		},
	})
})
$(document).on('click', '.product-acssesuar-list__sorting-item', function (e) {
	e.preventDefault()

	if ($(this).hasClass('down')) {
		$(this).removeClass('down')
		$(this).addClass('up')
	} else {
		$(this).removeClass('up')
		$(this).addClass('down')
	}
})
$(document).on('click', '.product-acssesuar-list__item > a', function (e) {
	e.preventDefault()

	if ($(this).closest('li').find('> ul').length) {
		var parrentLi = $(this).closest('li'),
			parenttUl = $(this).closest('ul')
		parrentLi.find('> a').fadeOut(300)
		parenttUl
			.find('> li')
			.not(parrentLi)
			.fadeOut(300, function (e) {
				parenttUl.addClass('opened')
				parrentLi.find('> ul').fadeIn(500, function (e) {
					parrentLi.addClass('opened')
					parrentLi.find('> ul').css('display', '')
					parenttUl.find('> li').css('display', '')
					parrentLi.find('> a').css('display', '')
				})
			})
	} else if (
		!$(this).closest('li').hasClass('product-acssesuar-list__item--back')
	) {
		var link = $(this).attr('href'),
			parrentBox = $(this).closest('.product-acssesuar-list')
		var idUrl = window.location.hash.split('/')[0] + '/' + link
		history.pushState(null, null, idUrl)

		if (window.location.origin == 'https://dev.solvers.group') {
			link = 'https://dev.solvers.group/grizli/' + link
		}

		$.ajax({
			type: 'GET',
			url: link,
			success: function success(response) {
				var content = $(response).find('.accessory-block')
				parrentBox.find('.product-acssesuar-list__ajax-content').html('')
				content.appendTo(
					parrentBox.find('.product-acssesuar-list__ajax-content')
				)
				parrentBox
					.find(
						'.product-acssesuar-list__list, .product-acssesuar-list__filter'
					)
					.fadeOut(300, function (e) {
						parrentBox
							.find('.product-acssesuar-list__ajax-content')
							.fadeIn(300, function (e) {
								parrentBox.addClass('product')
								parrentBox
									.find(
										'.product-acssesuar-list__ajax-content, .product-acssesuar-list__filter, .product-acssesuar-list__list'
									)
									.css('display', '')
							})
					})
			},
		})
	}
})
$(document).on('click', '.product-acssesuar-list__toback', function (e) {
	e.preventDefault()
	var ul = $(this).closest('ul'),
		li = ul.closest('li')
	li.removeClass('opened')
	li.closest('ul').removeClass('opened')
})
$(document).on('click', '.accessory-block__backto', function (e) {
	e.preventDefault()
	var idUrl = window.location.hash.split('/')[0]
	history.pushState(null, null, idUrl)
	var parrentBox = $(this).closest('.product-acssesuar-list')
	parrentBox.removeClass('product')
})
var cartPopup = $('[data-remodal-id="cart-popup"]').remodal()
$(document).on('click', '.cart-mini', function (e) {
	e.preventDefault()

	if ($(this).closest('.remodal').attr('data-remodal-id') == 'cart-popup') {
		return
	}

	$('.remodal__cart-ajax').html('')
	var link = $(this).attr('href')

	if (window.location.origin == 'https://dev.solvers.group') {
		link = 'https://dev.solvers.group/grizli/' + link
	}

	$.ajax({
		type: 'GET',
		url: link,
		success: function success(response) {
			var content = $(response).find('.cart-block')
			content.appendTo('.remodal__cart-ajax')
			$('.remodal__cart-ajax select').select2({
				minimumResultsForSearch: -1,
				width: '100%',
			})
			$('.remodal__cart-ajax input[type=tel]').mask('+7 (999) 999 - 99 - 99')
			cartPopup.open()
		},
	})
})

var inputPreffiks = ''
$(document).on(
	'click',
	'._js-quantity-plus, ._js-quantity-minus',
	function (e) {
		e.preventDefault()

		if ($(this).attr('disabled')) {
			return
		}

		var $this = $(this),
			input = $this.closest('div').find('input'),
			inpuMin = input.attr('min') ? input.attr('min') : 1,
			value = parseInt(input.val())

		if (value == 1 && $this.hasClass('_js-quantity-minus')) {
			$this
				.closest('.system-element-thumbs__content-bottom-right')
				.find('.system-element-thumbs__add-box.checked')
				.removeClass('checked')
			value = 0
			input.val(value + inputPreffiks).trigger('change')
		} else {
			value = $this.hasClass('_js-quantity-plus')
				? value + 1
				: value == 1
				? value
				: value - 1
			input.val(value + inputPreffiks).trigger('change')
		}
	}
)
$(document).on('keyup', '.quantity__value', function (e) {
	var value = parseInt($(this).val())
	value = isNaN(value) ? 1 : value
	$(this)
		.val(value + inputPreffiks)
		.trigger('change')
})
$(document).on('change', '.quantity__value', function (e) {
	var value = parseInt($(this).val())

	if (value >= 99) {
		$(this)
			.closest('.quantity')
			.find('._js-quantity-plus')
			.prop('disabled', true)
		$(this).val('99')
	} else if (value <= 0) {
		$(this).val('1')
	} else {
		$(this)
			.closest('.quantity')
			.find('._js-quantity-plus')
			.prop('disabled', false)
	}
})
var modalDublOpened = ''
$(document).on(
	'click',
	'[data-remodal-target], .service-repair-block__videos-item, .cart-mini',
	function (e) {
		var $left = e.clientX,
			$top = e.clientY,
			$width =
				$(window).width() > $(window).height()
					? $(window).width() * 3
					: $(window).height() * 3,
			id = $(this).attr('data-remodal-target'),
			remodalPopup = $('[data-remodal-id="' + id + '"]')

		if (!remodalPopup.hasClass('halfheigth')) {
			$('.remodal-overlay').css({
				left: $left,
				top: $top,
			})
			$('.remodal-overlay').animate(
				{
					width: $width,
					height: $width,
				},
				200,
				function () {
					var $width =
						$(window).width() > $(window).height()
							? $(window).width() * 2
							: $(window).height() * 2
					$('.remodal-wrapper').animate(
						{
							opacity: 1,
						},
						200,
						function () {
							if (remodalPopup.find('.main-menu').length) {
								remodalPopup.find('.main-menu').addClass('opened')
							}

							$('.remodal-overlay').css({
								left: '50%',
								top: '50%',
								width: $width,
								height: $width,
							})
						}
					)
				}
			)
		} else {
			remodalPopup.closest('.remodal-wrapper').css({
				opacity: 1,
			})
		}
	}
)
$(document).on('closing', '.remodal', function (e) {
	if (
		$(e.target).find('.product-acssesuar-list__ajax-content').length ||
		$(e.target).attr('data-remodal-id') == 'informationpopup'
	) {
		var idUrl = window.location.hash.split('/')[0]
		history.pushState(null, null, idUrl)
	}

	if ($('.main-menu').hasClass('opened')) {
		$('.main-menu').addClass('opacity')
	}

	$('.remodal-wrapper').animate(
		{
			opacity: 0,
		},
		200,
		function () {
			$('.main-menu').removeClass('opened opacity')

			if (modalDublOpened != '') {
				$('[data-remodal-target="' + modalDublOpened + '"]').trigger('click')
				setTimeout(function () {
					modalDublOpened = ''
				}, 500)
			}
		}
	)
	$('.remodal-overlay').css({
		left: '50%',
		top: '60px',
		width: '0',
		height: '0',
	})
})
$('[data-remodal-target="privacepopup"]').on('click', function (e) {
	if ($(this).closest('.remodal').length) {
		modalDublOpened = $(this).closest('.remodal').attr('data-remodal-id')
	}
})

if ($('.service-repair-block').length) {
	var servicesVideoPopup = $('[data-remodal-id="servicesvideo"]').remodal()
	$(document).on('click', '.service-repair-block__videos-item', function (e) {
		e.preventDefault()
		var index = $(this).index()
		$(this)
			.closest('.service-repair-block__tab-videos')
			.find('.service-repair-block__videos-item')
			.removeClass('active')
		$(this).addClass('active')
		$('.services-video-list__list').removeClass('active')
		$('.services-video-list__list:eq(' + index + ')').addClass('active')
		servicesVideoPopup.open()
	})
	$(document).on('click', '.services-video-list__item-link', function (e) {
		e.preventDefault()
		var videoLink = $(this).attr('data-video'),
			name = $(this).find('.services-video-list__item-name').text(),
			videoContainer = $('.service-repair-block')
				.closest('.section-item')
				.find('.section-item__video'),
			indexVideo = videoContainer.data('indexvideo'),
			link = $(this).attr('href')
		var idUrl = window.location.hash.split('/')[0] + '/' + link
		history.pushState(null, null, idUrl)
		$('.service-repair-block__bottom-name').data('href', link)
		videoContainer.data('url', videoLink)
		videoDestroy(indexVideo)
		videoInit(videoContainer, indexVideo, true)
		$('.service-repair-block__bottom-name').text(name)
		$('.services-video-list__item-link').removeClass('active')
		$(this).addClass('active')
		servicesVideoPopup.close()
		$('[data-remodal-id="services-form"]')
			.find('.product-order-form__form input[name="productinfo"]')
			.val(name)
		$('[data-remodal-id="services-form"]')
			.find('.product-order-form__title span')
			.text(' - ' + name)
	})
}

function productMainLoad(section, link) {
	var idProduct = section.attr('id'),
		popupList = $('.remodal[data-sectionid="' + idProduct + '"]')
	$(
		popupList.find('.product-full-list__item-link[href="' + link + '"]')[0]
	).trigger('click')

	if (link) {
		$(section.find('[data-remodal-target="moreproduct"]')[0]).trigger('click')
	}
} //Router

routie({
	'atvs/:name?': function atvsName(name) {
		var link = name == '' ? false : name
		productMainLoad($('#atvs').find('.product-section'), link)
	},
	'motocicle/:name?': function motocicleName(name) {
		var link = name
		productMainLoad($('#atvs').find('.product-section'), link)
	},
	'accessories/:name?': function accessoriesName(name) {
		var link = name == '' ? false : name

		if (link) {
			var parent = $('#accessories'),
				indProduct = parent.index(),
				button = parent.find(
					'.product-section__buttons .product-section__button-item[data-type="acsessuarfull-popup"]'
				),
				idbutton = button.data('remodal-target')
			var parrentBox = $('[data-remodal-id="' + idbutton + '"]').find(
				'.product-acssesuar-list'
			)

			if (window.location.origin == 'https://dev.solvers.group') {
				link = 'https://dev.solvers.group/grizli/' + link
			}

			$.ajax({
				type: 'GET',
				url: link,
				success: function success(response) {
					var content = $(response).find('.accessory-block')
					parrentBox.find('.product-acssesuar-list__ajax-content').html('')
					content.appendTo(
						parrentBox.find('.product-acssesuar-list__ajax-content')
					)
					parrentBox
						.find(
							'.product-acssesuar-list__list, .product-acssesuar-list__filter'
						)
						.fadeOut(300, function (e) {
							parrentBox
								.find('.product-acssesuar-list__ajax-content')
								.fadeIn(300, function (e) {
									parrentBox.addClass('product')
									parrentBox
										.find(
											'.product-acssesuar-list__ajax-content, .product-acssesuar-list__filter, .product-acssesuar-list__list'
										)
										.css('display', '')
								})
						})
				},
			})
			$('[data-remodal-target="' + idbutton + '"').trigger('click')
		}
	},
	'spare/:name?': function spareName(name) {
		var link = name == '' ? false : name

		if (link) {
			var parent = $('#spare'),
				indProduct = parent.index(),
				button = parent.find(
					'.product-section__buttons .product-section__button-item'
				),
				idbutton = button.data('remodal-target')
			var parrentBox = $('[data-remodal-id="' + idbutton + '"]').find(
				'.product-acssesuar-list'
			)

			if (window.location.origin == 'https://dev.solvers.group') {
				link = 'https://dev.solvers.group/grizli/' + link
			}

			$.ajax({
				type: 'GET',
				url: link,
				success: function success(response) {
					var content = $(response).find('.accessory-block')
					parrentBox.find('.product-acssesuar-list__ajax-content').html('')
					content.appendTo(
						parrentBox.find('.product-acssesuar-list__ajax-content')
					)
					parrentBox
						.find(
							'.product-acssesuar-list__list, .product-acssesuar-list__filter'
						)
						.fadeOut(300, function (e) {
							parrentBox
								.find('.product-acssesuar-list__ajax-content')
								.fadeIn(300, function (e) {
									parrentBox.addClass('product')
									parrentBox
										.find(
											'.product-acssesuar-list__ajax-content, .product-acssesuar-list__filter, .product-acssesuar-list__list'
										)
										.css('display', '')
								})
						})
				},
			})
			$('[data-remodal-target="' + idbutton + '"').trigger('click')
		}
	},
	'stock/:name?': function stockName(name) {
		var informationPopup = $('[data-remodal-id="informationpopup"]').remodal()
		$('[data-remodal-id="informationpopup"]')
			.find('.remodal__ajax-content')
			.html('')
		$('[data-remodal-id="informationpopup"]').closest('.remodal-wrapper').css({
			opacity: 1,
		})
		var link = name == '' ? false : name

		if (link) {
			if (window.location.origin == 'https://dev.solvers.group') {
				link = 'https://dev.solvers.group/grizli/' + link
			}

			$.ajax({
				type: 'GET',
				url: link,
				success: function success(response) {
					var content = $(response).find('.information-full-block')
					content.appendTo(
						$('[data-remodal-id="informationpopup"]').find(
							'.remodal__ajax-content'
						)
					)
					informationPopup.open()
				},
			})
		}
	},
	'news/:name?': function newsName(name) {
		var informationPopup = $('[data-remodal-id="informationpopup"]').remodal()
		$('[data-remodal-id="informationpopup"]')
			.find('.remodal__ajax-content')
			.html('')
		$('[data-remodal-id="informationpopup"]').closest('.remodal-wrapper').css({
			opacity: 1,
		})
		var link = name == '' ? false : name

		if (link) {
			if (window.location.origin == 'https://dev.solvers.group') {
				link = 'https://dev.solvers.group/grizli/' + link
			}

			$.ajax({
				type: 'GET',
				url: link,
				success: function success(response) {
					var content = $(response).find('.information-full-block')
					content.appendTo(
						$('[data-remodal-id="informationpopup"]').find(
							'.remodal__ajax-content'
						)
					)
					informationPopup.open()
				},
			})
		}
	},
	'information/:name?': function informationName(name) {
		var informationPopup = $('[data-remodal-id="informationpopup"]').remodal()
		$('[data-remodal-id="informationpopup"]')
			.find('.remodal__ajax-content')
			.html('')
		$('[data-remodal-id="informationpopup"]').closest('.remodal-wrapper').css({
			opacity: 1,
		})
		var link = name == '' ? false : name

		if (link) {
			if (window.location.origin == 'https://dev.solvers.group') {
				link = 'https://dev.solvers.group/grizli/' + link
			}

			$.ajax({
				type: 'GET',
				url: link,
				success: function success(response) {
					var content = $(response).find('.information-full-block')
					content.appendTo(
						$('[data-remodal-id="informationpopup"]').find(
							'.remodal__ajax-content'
						)
					)
					informationPopup.open()
				},
			})
		}
	},
	'team/:name?': function teamName(name) {
		var informationPopup = $('[data-remodal-id="informationpopup"]').remodal()
		$('[data-remodal-id="informationpopup"]')
			.find('.remodal__ajax-content')
			.html('')
		$('[data-remodal-id="informationpopup"]').closest('.remodal-wrapper').css({
			opacity: 1,
		})
		var link = name == '' ? false : name

		if (link) {
			if (window.location.origin == 'https://dev.solvers.group') {
				link = 'https://dev.solvers.group/grizli/' + link
			}

			$.ajax({
				type: 'GET',
				url: link,
				success: function success(response) {
					var content = $(response).find('.information-full-block')
					content.appendTo(
						$('[data-remodal-id="informationpopup"]').find(
							'.remodal__ajax-content'
						)
					)
					informationPopup.open()
				},
			})
		}
	},
	'payment/:name?': function paymentName(name) {
		var informationPopup = $('[data-remodal-id="informationpopup"]').remodal()
		$('[data-remodal-id="informationpopup"]')
			.find('.remodal__ajax-content')
			.html('')
		$('[data-remodal-id="informationpopup"]').closest('.remodal-wrapper').css({
			opacity: 1,
		})
		var link = name == '' ? false : name

		if (link) {
			if (window.location.origin == 'https://dev.solvers.group') {
				link = 'https://dev.solvers.group/grizli/' + link
			}

			$('.pay-type-block__videos-item[data-href="' + link + '"]').trigger(
				'click'
			)
			$.ajax({
				type: 'GET',
				url: link,
				success: function success(response) {
					var content = $(response).find('.information-full-block')
					content.appendTo(
						$('[data-remodal-id="informationpopup"]').find(
							'.remodal__ajax-content'
						)
					)
					informationPopup.open()
				},
			})
		}
	},
	'service/:name?': function serviceName(name) {
		var link = name == '' ? false : name

		if (link) {
			console.log($('.services-video-list__item-link[href="' + link + '"]'))
			$('.services-video-list__item-link[href="' + link + '"]').trigger('click')
		}
	},
	'gallery/:name?': function galleryName(name) {
		var informationPopup = $('[data-remodal-id="informationpopup"]').remodal()
		$('[data-remodal-id="informationpopup"]')
			.find('.remodal__ajax-content')
			.html('')
		$('[data-remodal-id="informationpopup"]').closest('.remodal-wrapper').css({
			opacity: 1,
		})
		var link = name == '' ? false : name

		if (link) {
			if (window.location.origin == 'https://dev.solvers.group') {
				link = 'https://dev.solvers.group/grizli/' + link
			}

			var parent = $('#gallery .gallery-block')
			var ajaxBox = parent.find('.gallery-block__ajax-body')
			parent.find('.gallery-block__inner').fadeOut(300, function () {
				$.ajax({
					type: 'GET',
					url: link,
					success: function success(response) {
						var content = $(response).find('.gallery-images-all')
						content.appendTo(ajaxBox)
						justifiedGalleryInit()
						parent
							.find('.gallery-block__more-content')
							.fadeIn(300, function () {
								parent.addClass('moregallery')
							})
					},
				})
			})
		}
	},
})

$('select').select2({
	minimumResultsForSearch: -1,
	width: '100%',
})
$('input[type=tel]').mask('+7 (999) 999 - 99 - 99')
$('.site-input input').on('blur', function (e) {
	if ($(this).val() != '') {
		$(this).addClass('focus')
	} else {
		$(this).removeClass('focus')
	}
})
$(document).on('keyup change blur', 'form input', function (e) {
	var $this = $(this).closest('form')
	var validate = 0
	$this.find('input[required]').each(function (e) {
		if ($(this).val() == '') {
			validate = 1
			$(this).addClass('error')
		} else {
			$(this).removeClass('error')
		}
	})

	if (validate != 1) {
		$this.find('button').removeClass('disabled')
	} else {
		$this.find('button').addClass('disabled')
	}
})
