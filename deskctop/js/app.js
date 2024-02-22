'use strict'
/* ^^^
 * Viewport Height Correction
 *
 * @link https://www.npmjs.com/package/postcss-viewport-height-correction
 * ========================================================================== */

function setViewportProperty() {
	var vh = window.innerHeight * 0.01
	document.documentElement.style.setProperty('--vh', vh + 'px')
}

window.addEventListener('resize', setViewportProperty)
setViewportProperty() // Call the fuction for initialisation

/* ^^^
 * Полифил для NodeList.forEach(), на случай если забыл про IE 11
 *
 * @link https://developer.mozilla.org/en-US/docs/Web/API/NodeList/forEach
 * ========================================================================== */

if (window.NodeList && !NodeList.prototype.forEach) {
	NodeList.prototype.forEach = Array.prototype.forEach
}

function youtube_parser(url) {
	var regExp =
		/^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/
	var match = url.match(regExp)
	return match && match[7].length == 11 ? match[7] : false
}

var timeFormat = (function () {
	function num(val) {
		val = Math.floor(val)
		return val < 10 ? '0' + val : val
	}

	return function (
		ms
		/**number*/
	) {
		var sec = ms / 1000,
			hours = (sec / 3600) % 24,
			minutes = (sec / 60) % 60,
			seconds = sec % 60
		return num(minutes) + ':' + num(seconds)
	}
})()

function timerProgressVideo(currentTime, durationTime, progressBar, finish) {
	if (currentTime != false) {
		var valueCurrentTime = timeFormat(currentTime * 1000)
		$('.player__time').html(valueCurrentTime)
	}

	if (finish == true) {
		var valueDuration = timeFormat(durationTime * 1000)
		$('.player__finish').html(valueDuration)
	}

	if (progressBar != false) {
		currentTime = Math.ceil(currentTime)
		var proggress = 100 - (currentTime / durationTime) * 100 + '%'

		if (
			$('.section-item.swiper-slide-active').find(
				'.information-block__item.active'
			).length
		) {
			$('.section-item.swiper-slide-active')
				.find(
					'.information-block__item.active .information-thumbs__progressbar'
				)
				.css('right', proggress)
		}

		$('.player__line span').css('right', proggress)
	}
}
/* ^^^
 * JQUERY Actions
 * ========================================================================== */

$(function () {
	var isApple = /iPod|iPad|iPhone/i.test(navigator.userAgent),
		isMobile =
			/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
				navigator.userAgent
			) && !(isApple && window.matchMedia('(min-width:1022px)').matches)
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
	$('select').select2({
		minimumResultsForSearch: -1,
		width: '100%',
	})

	if (!isMobile) {
		$('select').on('select2:open', function (e) {
			// Do something
			$('.select2-dropdown').hide()
			setTimeout(function () {
				$('.select2-dropdown').slideDown(300)
			}, 100)
		})
	} //Site videos

	var videoBgSite
	var videoObject = []
	var activeVideoIndex = 0

	function videoDestroy(indexVideo) {
		videoObject[indexVideo].destroy()
	}

	function videoInit(videoContainer, indexVideo, autoplay) {
		var videoContainer = videoContainer,
			url = videoContainer.data(url),
			currentTime = 0,
			durationTime = 0,
			ind = indexVideo
		url = youtube_parser(url['url'])
		videoContainer.html('')
		videoContainer.attr('data-indexvideo', ind)
		$('.player__mute').removeClass('active')
		var forPlyrContainer = $(
			'<div class="forPlyrVideo" data-plyr-provider="youtube" data-plyr-embed-id="' +
				url +
				'"></div>'
		)
		forPlyrContainer.appendTo(videoContainer)
		var videoBgSite = new Plyr(videoContainer.find('.forPlyrVideo')[0], {
			controls: [],
			autoplay: false,
			muted: true,
			resetOnEnd: true,
			youtube: {
				startSeconds: 10,
				start: 10,
				noCookie: false,
				rel: 0,
				showinfo: 0,
				iv_load_policy: 3,
				loop: 1,
				modestbranding: 0,
				controls: 0,
				autoplay: 0,
			},
		})
		videoBgSite.on('ready', function (event) {
			// videoBgSite.volume = 0;
			// if (autoplay == true) {
			//     videoBgSite.play();
			// }
			if (videoContainer.closest('.swiper-slide-active').length) {
				videoBgSite.play()
			}

			videoContainer
				.closest('.section-item__video-list')
				.find('img')
				.fadeOut(300, function () {
					videoContainer.addClass('active play')
				})
			$('._js-unmuted-video').removeClass('hide')
			videoContainer
				.closest('.section-item')
				.find('._js-unmuted-video')
				.addClass('active')

			if (!url) {
				activeVideoIndex = videoContainer.data('indexvideo')
				setTimeout(function () {
					$('[data-indexvideo="' + activeVideoIndex + '"]')
						.closest('.section-item')
						.find('._js-unmuted-video')
						.addClass('hidden')
					$('[data-indexvideo="' + activeVideoIndex + '"]').removeClass('play')
				}, 500)
			}
		})
		videoBgSite.on('timeupdate', function (event) {
			timerProgressVideo(
				event.detail.plyr.media.currentTime,
				event.detail.plyr.media.duration,
				true,
				true
			)

			if (
				event.detail.plyr.media.duration - event.detail.plyr.media.currentTime <
				10
			) {
				if (
					$('.section-item.swiper-slide-active').find(
						'.information-block__item.active'
					).length
				) {
					var actionActive = $('.section-item.swiper-slide-active').find(
							'.information-block__item.active'
						),
						groupAction = actionActive.closest('.information-block__group')

					if (
						$('.section-item.swiper-slide-active')
							.find('.information-block__item.active .information-thumbs')
							.data('video') != ''
					) {
						if (actionActive.next().length) {
							actionActive.next().find('.information-thumbs').trigger('click')
						} else {
							groupAction
								.find(
									'.information-block__item:first-child .information-thumbs'
								)
								.trigger('click')
						}
					}
				} else {
					videoBgSite.restart()
				}
			}
		})
		videoObject[ind] = videoBgSite
	}

	function videoYtReading(secondStart) {
		$('.section-item').each(function (ind, e) {
			var $this = $(this)

			if ($this.find('.information-block').length) {
				var videoUrl = $this
					.find('.information-block__item.active .information-thumbs')
					.data('video')
				$this.find('.section-item__video').attr('data-url', videoUrl)
			}

			if (
				($this.find('.section-item__video').length &&
					ind < 2 &&
					!secondStart) ||
				(secondStart == true &&
					$this.find('.section-item__video').length &&
					ind > 1)
			) {
				var videoContainer = $this.find('.section-item__video'),
					autoplay = ind == 0 ? true : false
				videoInit(videoContainer, ind, autoplay)
			}
		})
	}

	var routieFlag = true
	routie({
		'stock/:name?': function stockName(name) {
			var link = name == '' ? false : name

			if (link && routieFlag) {
				$('#stock .information-thumbs__more a[href="' + link + '"]')
					.closest('.information-block')
					.find('.information-block__item')
					.removeClass('active')
				$($('#stock .information-thumbs__more a[href="' + link + '"]')[0])
					.closest('.information-block__item')
					.addClass('active')
				routieFlag = false
			}
		},
		'news/:name?': function newsName(name) {
			var link = name == '' ? false : name

			if (link && routieFlag) {
				$('#news .information-thumbs__more a[href="' + link + '"]')
					.closest('.information-block')
					.find('.information-block__item')
					.removeClass('active')
				$($('#news .information-thumbs__more a[href="' + link + '"]')[0])
					.closest('.information-block__item')
					.addClass('active')
				routieFlag = false
			}
		},
		'information/:name?': function informationName(name) {
			var link = name == '' ? false : name

			if (link && routieFlag) {
				$('#information .information-thumbs__more a[href="' + link + '"]')
					.closest('.information-block')
					.find('.information-block__item')
					.removeClass('active')
				$($('#information .information-thumbs__more a[href="' + link + '"]')[0])
					.closest('.information-block__item')
					.addClass('active')
				routieFlag = false
			}
		},
		'team/:name?': function teamName(name) {
			var link = name == '' ? false : name

			if (link && routieFlag) {
				$('#team .information-thumbs__more a[href="' + link + '"]')
					.closest('.information-block')
					.find('.information-block__item')
					.removeClass('active')
				$($('#team .information-thumbs__more a[href="' + link + '"]')[0])
					.closest('.information-block__item')
					.addClass('active')
				routieFlag = false
			}
		},
	})
	videoYtReading()

	function videoPlayerStart(indexPlay, indexPause) {
		if (indexPlay != null) {
			if ($('._js-unmuted-video.hide').length) {
				videoObject[indexPlay].volume = 1
			} else {
				videoObject[indexPlay].volume = 0
			}

			videoObject[indexPlay].play()
			videoObject[indexPlay].on('timeupdate', function (event) {
				timerProgressVideo(
					event.detail.plyr.media.currentTime,
					event.detail.plyr.media.duration,
					true,
					true
				)
			})
		}

		if (indexPause != null) {
			if ($('._js-unmuted-video.hide').length) {
				videoObject[indexPause].volume = 1
				$('._js-unmuted-video').addClass('hide')
				$('.player__mute').addClass('active')
			} else {
				videoObject[indexPause].volume = 0
				$('._js-unmuted-video').removeClass('hide')
				$('.player__mute').removeClass('active')
			}

			$('.player__pause').removeClass('play')
			videoObject[indexPause].pause()
		}

		if (indexPlay != 0) {
			videoObject[0].pause()
		}
	}

	$('.player__pause').on('click', function (e) {
		e.preventDefault()
		var indexVideo = $('.section-item.swiper-slide-active ._js-bg-video.play')
			.length
			? $('.section-item.swiper-slide-active ._js-bg-video.play').data(
					'indexvideo'
			  )
			: $('.news-block.videonews').length
			? $('.news-block.videonews .news-block__video.active').data('indexvideo')
			: null

		if (
			$('.swiper-slide-active ._js-bg-video.play').length ||
			$('.news-block.videonews').length
		) {
			videoObject[indexVideo].togglePlay()
			$(this).toggleClass('play')
		}
	})
	$('._js-unmuted-video').on('click', function (e) {
		e.preventDefault()
		var $this = $(this)
		$this
			.clone()
			.addClass('timing-unmute')
			.css({
				position: 'absolute',
				'z-index': '100',
				top: $this.position().top,
				left: $this.position().left,
				transform: 'translate(0, 0) scale(.5)',
			})
			.appendTo($this.closest('.section-item'))
			.animate(
				{
					top: $('.player__mute').offset().top,
					left: $('.player').offset().left + $('.player').width() - 20,
					opacity: 0,
					width: $this.outerWidth(),
				},
				300,
				function () {
					$('.player__mute').addClass('active')
					setTimeout(function () {
						$('.timing-unmute').remove()
					}, 300)
				}
			)
		var indexVideo = $('.section-item.swiper-slide-active ._js-bg-video.play')
			.length
			? $('.section-item.swiper-slide-active ._js-bg-video.play').data(
					'indexvideo'
			  )
			: $('.news-block.videonews').length
			? $('.news-block.videonews .news-block__video.active').data('indexvideo')
			: null

		if (
			$('.swiper-slide-active ._js-bg-video.play').length ||
			$('.news-block.videonews').length
		) {
			videoObject[indexVideo].volume = 1
		}

		$(this).addClass('hide')
	})
	$('.player__mute').on('click', function (e) {
		e.preventDefault()
		var indexVideo = $('.section-item.swiper-slide-active ._js-bg-video.play')
			.length
			? $('.section-item.swiper-slide-active ._js-bg-video.play').data(
					'indexvideo'
			  )
			: $('.news-block.videonews').length
			? $('.news-block.videonews .news-block__video.active').data('indexvideo')
			: null

		if (
			$('.swiper-slide-active ._js-bg-video.play').length ||
			$('.news-block.videonews').length
		) {
			videoObject[indexVideo].volume = 0
		}

		$('._js-unmuted-video').removeClass('hide')
		$(this).removeClass('active')
	})
	$('.player__line').on('click', function (e) {
		e.preventDefault()
		var left = $(this).position().left
		var target = e.target.closest('.player__line')
		var targetCoords = target.getBoundingClientRect()
		var xCoord = e.clientX - targetCoords.left
		var procent = (xCoord / $(this).width()) * 100
		var indexVideo = $('.section-item.swiper-slide-active ._js-bg-video.play')
			.length
			? $('.section-item.swiper-slide-active ._js-bg-video.play').data(
					'indexvideo'
			  )
			: $('.news-block.videonews').length
			? $('.news-block.videonews .news-block__video.active').data('indexvideo')
			: null
		var fullTime = (videoObject[indexVideo].media.duration / 100) * procent
		videoObject[indexVideo].currentTime = fullTime
	}) //Fullpage slider

	if ($('.section-content').length) {
		var sectionMouswhell = true
		var slideSectionActive
		$('.section-content').addClass('swiper swiperSliderSection')
		$('.section-list').addClass('swiper-wrapper')
		$('.section-item').addClass('swiper-slide')
		var sliderEffect = isMobile ? '' : 'creative'
		var idUrl = window.location.hash.replace('#', '')
		var initSlide = 0

		if (idUrl != '') {
			idUrl = idUrl.split('/')[0]

			if ($('#' + idUrl).length && $('#' + idUrl).hasClass('section-item')) {
				initSlide = $('#' + idUrl).index()
			}
		}

		var sliderSection = new Swiper('.swiperSliderSection', {
			direction: 'vertical',
			effect: sliderEffect,
			allowTouchMove: false,
			initialSlide: initSlide,
			creativeEffect: {
				prev: {
					translate: [0, '-100%', '-400px'],
					opacity: 0.2,
				},
				next: {
					translate: [0, '120%', '-400px'],
					opacity: 0.2,
				},
			},
			mousewheel: {
				forceToAxis: true,
				sensitivity: 1,
				releaseOnEdges: true,
			},
			speed: 1000,
			loop: false,
			spaceBetween: 0,
			on: {
				init: function init(event) {
					videoYtReading(true)
					slideSectionActive = event.slides[event.activeIndex]

					if (
						$(slideSectionActive).find('> .section-item__video-list').length
					) {
						activeVideoIndex = event.activeIndex
					}

					if (event.activeIndex != 0) {
						$('.left-navigation__item').removeClass('active')
						$('.left-navigation__item:eq(' + event.activeIndex + ')').addClass(
							'active'
						)
					}
				},
			},
		})
		sliderSection.on('transitionStart', function (event) {
			$('.left-navigation__item').removeClass('active')

			if (!isMobile) {
				$('body').removeClass('hideContent newsHideContent')
			}

			if (activeVideoIndex != null) {
				videoPlayerStart(null, activeVideoIndex)
			}
		})
		sliderSection.on('transitionEnd', function (event) {
			// if (videoObject.length < $('.section-item__video').length) {
			//   videoYtReading(true);
			// }
			slideSectionActive = event.slides[event.activeIndex]
			var hasVerticalScrollbar =
				$(slideSectionActive).find('.section-item__inner')[0].scrollHeight >
				$(slideSectionActive).find('.section-item__inner')[0].clientHeight
			var videoContainer = $(slideSectionActive).find(
				'> .section-item__video-list ._js-bg-video.play'
			)
			var idItem = '#' + $(event.slides[event.activeIndex]).attr('id')

			if (
				$(event.slides[event.activeIndex])
					.find('.service-repair-block__bottom-name')
					.data('href') !== undefined
			) {
				var link = $(event.slides[event.activeIndex])
					.find('.service-repair-block__bottom-name')
					.data('href')
				idItem = idItem + '/' + link
			}

			if (
				$(event.slides[event.activeIndex])
					.find('.product-section')
					.data('link') !== undefined
			) {
			}

			history.pushState(null, null, idItem)

			if (videoContainer.length) {
				activeVideoIndex = videoContainer.data('indexvideo')
				videoPlayerStart(activeVideoIndex, null)
			} else {
				activeVideoIndex = null
			}

			if ($('.news-block.videonews').length) {
				$('.news-block.videonews .news-block__back-to').trigger('click')
			}

			$('.left-navigation__item:eq(' + event.activeIndex + ')').addClass(
				'active'
			) //Проеряем если блок со скролом внутри слайда

			if (hasVerticalScrollbar) {
				sliderSection.mousewheel.disable()
				sectionMouswhell = false
			} else {
				sliderSection.mousewheel.enable()
				sectionMouswhell = true
			}

			if (!isMobile) {
				var activeItemSlideSection = $('.section-item.swiper-slide-active')

				if (activeItemSlideSection.find('.animator-hide').length) {
					cssAnimation()
					setTimeout(function () {
						activeItemSlideSection
							.find('[data-animator]')
							.removeAttr('data-animator')
						activeItemSlideSection.find('.animator').addClass('animatortrue')
						activeItemSlideSection.find('.animator').removeClass('animator')
					}, 1000)
				}
			}
		}) //Проеряем на сколько проскролили и в каком направлении, чтобы был скролл у внутрених эелементов

		if (isMobile) {
			// Свайп вверх-вниз
			var initialPoint
			var finalPoint
			document.addEventListener(
				'touchstart',
				function (event) {
					event.stopPropagation()
					initialPoint = event.changedTouches[0]
				},
				false
			)
			document.addEventListener(
				'touchend',
				function (event) {
					event.stopPropagation()

					if ($('.remodal-is-opened').length) {
						return
					}

					finalPoint = event.changedTouches[0]
					var xAbs = Math.abs(initialPoint.pageX - finalPoint.pageX)
					var yAbs = Math.abs(initialPoint.pageY - finalPoint.pageY)
					var scrollTopActiveSlide = $(slideSectionActive)
						.find('.section-item__inner')
						.scrollTop()

					if (xAbs > 20 || yAbs > 20) {
						if (!(xAbs > yAbs)) {
							if (finalPoint.pageY < initialPoint.pageY) {
								/*СВАЙП ВВЕРХ*/
								var scrollHeigth = $(slideSectionActive).find(
										'.section-item__inner'
									)[0].scrollHeight,
									blockHeigth =
										$(slideSectionActive).find('.section-item__inner')[0]
											.clientHeight + 12

								if (blockHeigth + scrollTopActiveSlide >= scrollHeigth) {
									sliderSection.slideNext()
								}
							} else {
								/*СВАЙП ВНИЗ*/
								if (scrollTopActiveSlide == 0) {
									sliderSection.slidePrev()
								}
							}
						}
					}
				},
				false
			)
		} else {
			$('.section-content').bind('mousewheel DOMMouseScroll', function (event) {
				if (sectionMouswhell) {
					return false
				}

				var scrollTopActiveSlide = $(slideSectionActive)
					.find('.section-item__inner')
					.scrollTop()

				if (
					event.originalEvent.wheelDelta > 0 ||
					event.originalEvent.detail < 0
				) {
					// scroll up
					if (scrollTopActiveSlide == 0) {
						sliderSection.slidePrev()
						sectionMouswhell = true
					}
				} else {
					// scroll down
					var scrollHeigth = $(slideSectionActive).find(
							'.section-item__inner'
						)[0].scrollHeight,
						blockHeigth = $(slideSectionActive).find('.section-item__inner')[0]
							.clientHeight

					if (blockHeigth + scrollTopActiveSlide >= scrollHeigth) {
						sliderSection.slideNext()
						sectionMouswhell = true
					}
				}
			})
		} //Пагинация swiper

		$(document).on('click', '.left-navigation__link', function (e) {
			e.preventDefault()
			var li = $(this).closest('.left-navigation__item'),
				index = li.index()
			$('.left-navigation__item').removeClass('active')
			$('.left-navigation__item:eq(' + index + ')').addClass('active')
			li.addClass('active')
			sliderSection.slideTo(index)
			$(this)
				.closest('.remodal')
				.find('[data-remodal-action="close"]')
				.trigger('click')
		})
		$(document).on('click', '.main-menu__item a', function (e) {
			e.preventDefault()
			var li = $(this).closest('li'),
				index = li.index(),
				href = $(this).attr('href'),
				parent = $(this).closest('.main-menu')
			href = href.replace(/#/, '')

			if (
				href != '' &&
				window.matchMedia('(min-width:767px)').matches &&
				!$(this).hasClass('active')
			) {
				parent.find('.main-menu__item a').removeClass('active')
				$(this).addClass('active')

				if (parent.find('.main-menu-level2.active').length) {
					parent.find('.main-menu-level2.active').fadeOut(200, function () {
						parent.find('.main-menu-level2.active').removeClass('active')
						parent
							.find('.main-menu-level2[data-id="' + href + '"]')
							.fadeIn(200, function () {
								parent
									.find('.main-menu-level2[data-id="' + href + '"]')
									.addClass('active')
								parent.find('.main-menu-level2').css('display', '')
							})
					})
				} else {
					parent
						.find('.main-menu-level2[data-id="' + href + '"]')
						.fadeIn(200, function () {
							parent
								.find('.main-menu-level2[data-id="' + href + '"]')
								.addClass('active')
							parent.find('.main-menu-level2').css('display', '')
						})
				}
			} else {
				parent.find('.main-menu-level2.active').removeClass('active')
				parent.find('.main-menu__item a').removeClass('active')
				$('.left-navigation__item').removeClass('active')
				$('.left-navigation__item:eq(' + index + ')').addClass('active')
				sliderSection.slideTo(index)
				$(this)
					.closest('.remodal')
					.find('[data-remodal-action="close"]')
					.trigger('click')
			}
		})
		$(document).on('click', '.main-menu-level2__item-link', function (e) {
			e.preventDefault()
			var parent = $(this).closest('.main-menu'),
				aciveParent = parent.find('.main-menu__item a.active'),
				li = aciveParent.closest('li'),
				index = li.index(),
				section = $('.section-item:eq(' + index + ')')

			if (
				section.find('.product-section__product-list').length &&
				!section.find(
					'.product-section__product-list .product-section__product-item--acssesuar'
				).length
			) {
				var name = $(this).data('fulename'),
					indProduct = $(this).closest('.main-menu-level2__item').index(),
					id = section.find('.product-section').attr('id'),
					popupList = $('.remodal[data-sectionid="' + id + '"]')
				popupList
					.find(
						'.product-full-list__item:eq(' +
							indProduct +
							') .product-full-list__item-link'
					)
					.trigger('click')
			} else {
				var indProduct = $(this).closest('.main-menu-level2__item').index(),
					button = section.find(
						'.product-section__buttons .product-section__button-item[data-type="acsessuarfull-popup"]'
					),
					idbutton = button.data('remodal-target')
				button.trigger('click')
				$('[data-remodal-id="' + idbutton + '"]')
					.find(
						'.product-acssesuar-list__list > .product-acssesuar-list__item:eq(' +
							indProduct +
							') > .product-acssesuar-list__item-link'
					)
					.trigger('click')
			}

			parent.find('.main-menu__item a').removeClass('active')
			parent.find('.main-menu-level2').removeClass('active')
			$('.left-navigation__item').removeClass('active')
			$('.left-navigation__item:eq(' + index + ')').addClass('active')
			sliderSection.slideTo(index)
			$(this)
				.closest('.remodal')
				.find('[data-remodal-action="close"]')
				.trigger('click')
		})
		$(document).on('click', '.section-next button', function (e) {
			e.preventDefault()
			sliderSection.slideNext()
		})
	} // if (!isMobile && !localStorage.getItem('firstStart')) {

	if (!isMobile) {
		$(window).on('resize', cssAnimation)
		cssAnimation()
		setTimeout(function () {
			$('.animator[data-animator]').removeAttr('data-animator')
			$('.animator').addClass('animatortrue')
			$('.animator').removeClass('animator')
		}, 1500) // localStorage.setItem('firstStart', true)
	} else {
		$('[data-animator]').removeAttr('data-animator')
	}

	function hideContent() {
		if (
			$('.swiper-slide-active > .section-item__video-list').length &&
			!$('.player__pause').hasClass('play') &&
			!$('.remodal-is-opened').length &&
			$(
				'.swiper-slide-active > .section-item__video-list .section-item__video'
			).hasClass('play')
		) {
			$('body').addClass('hideContent')
		}

		if (
			$('.news-block').hasClass('videonews') &&
			!$('.player__pause').hasClass('play')
		) {
			$('body').addClass('newsHideContent')
		}
	}

	if (!isMobile) {
		var hideContentBody = function hideContentBody() {
			$('body').removeClass('hideContent newsHideContent')
			clearTimeout(mousedragInterval)
			mousedragInterval = setTimeout(function () {
				hideContent()
			}, 3000)
		}

		var mousedragInterval = setTimeout(function () {
			hideContent()
		}, 3000)
		$(document).on('mousemove', function (e) {
			hideContentBody()
		})
	} // /* View in fullscreen */

	function openFullscreen(element) {
		if (element.requestFullScreen) {
			element.requestFullScreen()
		} else if (element.mozRequestFullScreen) {
			element.mozRequestFullScreen()
		} else if (element.webkitRequestFullScreen) {
			element.webkitRequestFullScreen()
		}

		hideContent()
	}
	/* Close fullscreen */

	function closeFullscreen() {
		if (document.exitFullscreen) {
			document.exitFullscreen()
		} else if (document.webkitExitFullscreen) {
			/* Safari */
			document.webkitExitFullscreen()
		} else if (document.msExitFullscreen) {
			/* IE11 */
			document.msExitFullscreen()
		}

		$('body').removeClass('hideContent newsHideContent')
	}

	$('.player__fullscreen, .play-full-mobile').on('click', function (e) {
		e.preventDefault()
		var elem = document.documentElement

		if (document.fullscreenElement) {
			closeFullscreen()
		} else {
			openFullscreen(elem)
		}
	})
	$(window).on('resize', function (e) {
		if (document.fullscreenElement == null) {
			$('body').removeClass('hideContent newsHideContent')
		}
	}) // window.addEventListener("orientationchange", function() {
	//   if (window.orientation == 0 && document.fullscreenElement) {
	//     closeFullscreen();
	//   }
	// });
	// if (isMobile) {
	//   $('html').on('touchstart', function(e){
	//     if (window.orientation == 90 && document.fullscreenElement == null) {
	//       var elem = document.documentElement;
	//       openFullscreen(elem);
	//     }
	//   })
	// }

	$(document).on('click', '.accessory-block__add', function () {
		var $this = $(this)
		$('.header__cart-box').removeClass('empty')
		$this
			.clone()
			.css({
				position: 'absolute',
				'z-index': '100',
				top: $this.position().top,
				left: $this.position().left,
			})
			.appendTo($this.closest('.remodal__container'))
			.animate(
				{
					top: $this
						.closest('.remodal__container')
						.find('.header__cart-box')
						.position().top,
					left: $this
						.closest('.remodal__container')
						.find('.header__cart-box')
						.position().left,
					opacity: 0,
					width: $this.outerWidth(),
				},
				500,
				function () {
					setTimeout(function () {
						$('.remodal__container > .accessory-block__add').remove()
					}, 300)
				}
			)
	})
	$(document).on('change', '.cart-block__ordering-head input', function () {
		var $this = $(this)
		$this
			.closest('.cart-block__ordering-type')
			.find('.cart-block__ordering-group')
			.removeClass('active')
		$this
			.closest('.cart-block__ordering-type')
			.find('.cart-block__ordering-body')
			.each(function (e) {
				$(this).find('input').prop('disabled', true)
				$(this).find('select').prop('disabled', true)
				$(this).find('textarea').prop('disabled', true)
			})
		$this
			.closest('.cart-block__ordering-group')
			.find('.cart-block__ordering-body')
			.slideDown(300, function (e) {
				$this
					.closest('.cart-block__ordering-group')
					.find('.cart-block__ordering-body')
					.css('display', '')
			})
		$this.closest('.cart-block__ordering-group').addClass('active')
		$this
			.closest('.cart-block__ordering-group')
			.find('.cart-block__ordering-body input')
			.prop('disabled', false)
		$this
			.closest('.cart-block__ordering-group')
			.find('.cart-block__ordering-body select')
			.prop('disabled', false)
		$this
			.closest('.cart-block__ordering-group')
			.find('.cart-block__ordering-body textarea')
			.prop('disabled', false)
	})

	if ($('#map').length) {
		var myLatlng = new google.maps.LatLng(55.705523, 37.403906)
		var mapStyles = [
			{
				featureType: 'all',
				elementType: 'all',
				stylers: [
					{
						invert_lightness: true,
					},
					{
						saturation: 10,
					},
					{
						lightness: 30,
					},
					{
						gamma: 0.5,
					},
					{
						hue: '#435158',
					},
				],
			},
			{
				featureType: 'all',
				elementType: 'labels',
				stylers: [
					{
						visibility: 'off',
					},
				],
			},
			{
				featureType: 'administrative',
				elementType: 'all',
				stylers: [
					{
						saturation: '0',
					},
					{
						lightness: '-10',
					},
				],
			},
			{
				featureType: 'administrative',
				elementType: 'labels',
				stylers: [
					{
						visibility: 'on',
					},
				],
			},
			{
				featureType: 'administrative.province',
				elementType: 'labels',
				stylers: [
					{
						visibility: 'on',
					},
				],
			},
			{
				featureType: 'landscape',
				elementType: 'labels',
				stylers: [
					{
						visibility: 'off',
					},
				],
			},
			{
				featureType: 'poi',
				elementType: 'all',
				stylers: [
					{
						visibility: 'on',
					},
				],
			},
			{
				featureType: 'poi',
				elementType: 'labels',
				stylers: [
					{
						visibility: 'off',
					},
				],
			},
			{
				featureType: 'road',
				elementType: 'all',
				stylers: [
					{
						visibility: 'on',
					},
				],
			},
			{
				featureType: 'transit',
				elementType: 'all',
				stylers: [
					{
						visibility: 'simplified',
					},
				],
			},
			{
				featureType: 'transit',
				elementType: 'labels',
				stylers: [
					{
						visibility: 'off',
					},
				],
			},
			{
				featureType: 'transit.station.airport',
				elementType: 'labels',
				stylers: [
					{
						visibility: 'off',
					},
				],
			},
			{
				featureType: 'transit.station.bus',
				elementType: 'labels',
				stylers: [
					{
						visibility: 'off',
					},
				],
			},
			{
				featureType: 'transit.station.rail',
				elementType: 'labels',
				stylers: [
					{
						visibility: 'off',
					},
				],
			},
			{
				featureType: 'water',
				elementType: 'all',
				stylers: [
					{
						visibility: 'on',
					},
				],
			},
			{
				featureType: 'water',
				elementType: 'geometry.fill',
				stylers: [
					{
						color: '#161616',
					},
				],
			},
			{
				featureType: 'water',
				elementType: 'labels',
				stylers: [
					{
						visibility: 'off',
					},
				],
			},
		]
		var mapOptions = {
			zoom: 14,
			center: myLatlng,
			styles: mapStyles,
		}
		var map = new google.maps.Map(document.getElementById('map'), mapOptions)
		var location = {
			lat: 55.705523,
			lng: 37.403906,
		}
		var marker = new google.maps.Marker({
			position: location,
			map: map,
			icon: 'img/maplogo.png',
		})
	}

	if ($('.gallery-block').length) {
		var gallerySliderCount = 1
		$('.gallery-block').each(function (e) {
			var $this = $(this)
			var countSlideItem = window.matchMedia('(min-width:1025px)').matches
					? 12
					: window.matchMedia('(min-width:767px)').matches
					? 6
					: 2,
				countItem = 0
			$this.find('.gallery-block__item').each(function (ind, e) {
				if (countItem % countSlideItem == 0) {
					var group = $('<div class="gallery-block__group swiper-slide"></div>')
					group.appendTo($this.find('.gallery-block__list'))
				}

				$(this).appendTo($this.find('.gallery-block__group:last-child'))
				countItem = countItem + 1
			})
			$this
				.find('.gallery-block__content')
				.addClass('swiper swiperSlidergallery' + gallerySliderCount)
			$this.find('.gallery-block__list').addClass('swiper-wrapper')
			var galleryNextSlide = $(
				'<button class="swiper-button-next">Показать ЕщЁ</button>'
			)
			galleryNextSlide.appendTo($this.find('.gallery-block__inner'))
			var buttongalleryNextClass = $this.find(
				'.gallery-block__inner .swiper-button-next'
			)[0]
			var galleryPagination = $('<div class="swiper-pagination"></div>')
			galleryPagination.appendTo($this.find('.gallery-block__content'))
			var paginationgallery = $this.find(
				'.gallery-block__inner .swiper-pagination'
			)[0]
			var sliderEffect = isMobile ? '' : 'creative'
			var sliderInformation = new Swiper(
				'.swiperSlidergallery' + gallerySliderCount,
				{
					effect: sliderEffect,
					creativeEffect: {
						prev: {
							translate: ['-5%', 0, 0],
							opacity: 0,
						},
						next: {
							translate: [0, 0, 0],
							opacity: 1,
						},
					},
					speed: 1000,
					slidesPerView: 1,
					slidesPerGroup: 1,
					loop: true,
					loopFillGroupWithBlank: true,
					spaceBetween: 20,
					navigation: {
						nextEl: buttongalleryNextClass,
						prevEl: '.swiper-button-prev',
					},
					pagination: {
						el: paginationgallery,
						type: 'bullets',
					},
				}
			)
			gallerySliderCount = gallerySliderCount + 1
		})
		$(document).on('click', '.gallery-block__categor', function (e) {
			e.preventDefault()
			var $this = $(this)
			var parent = $this.closest('.gallery-block')
			var ajaxBox = parent.find('.gallery-block__ajax-body')
			var link = $this.attr('href')
			var idUrl = window.location.hash.split('/')[0] + '/' + link
			history.pushState(null, null, idUrl)

			if (window.location.origin == 'https://dev.solvers.group') {
				link = 'https://dev.solvers.group/grizli/' + link
			}

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
		})
		$(document).on('click', '.gallery-block__back-to', function (e) {
			e.preventDefault()
			var $this = $(this)
			var parent = $this.closest('.gallery-block')
			var ajaxBox = parent.find('.gallery-block__ajax-body')
			var idItem = '#' + parent.closest('.section-item').attr('id')
			history.pushState(null, null, idItem)
			parent.find('.gallery-block__more-content').fadeOut(300, function () {
				parent.find('.gallery-block__inner').fadeIn(300, function () {
					parent.removeClass('moregallery')
					ajaxBox.html('')
				})
			})
		})
	}

	function justifiedGalleryInit() {
		var maxRowHeight = window.matchMedia('(min-width:1025px)').matches
			? 320
			: window.matchMedia('(min-width:767px)').matches
			? 220
			: 120
		$('.gallery-images-all__content').justifiedGallery({
			rowHeight: 220,
			maxRowHeight: maxRowHeight,
			margins: 30,
			randomize: true,
		})

		if (!isMobile) {
			var scene = $('.gallery-images-all__content').get(0)
			var elemScene = $('.gallery-images-all')[0]
			var parallaxInstance = new Parallax(scene, {
				clipRelativeInput: true,
				inputElement: elemScene,
				hoverOnly: true,
				pointerEvents: true,
			})
		}
	}

	if ($('.hero-block__slider').length) {
		var mainSliderCount = 1
		$('.hero-block__slider').each(function (e) {
			var $this = $(this),
				parrent = $this.closest('.section-item')
			$this
				.find('.hero-block__slider-content')
				.addClass('swiper swiperSlidermain' + mainSliderCount)
			$this.find('.hero-block__slider-list').addClass('swiper-wrapper')
			$this.find('.hero-block__slider-item').addClass('swiper-slide')
			var mainPagination = $('<div class="swiper-pagination"></div>')
			mainPagination.appendTo('.hero-block__slider-content')
			var sliderMain = new Swiper('.swiperSlidermain' + mainSliderCount, {
				slidesPerView: true,
				effect: 'fade',
				spaceBetween: 20,
				freeMode: false,
				loop: true,
				autoplay: {
					delay: 5000,
				},
				pagination: {
					el: '.swiperSlidermain' + mainSliderCount + ' .swiper-pagination',
					type: 'bullets',
					clickable: true,
				},
			})
			sliderSection.on('transitionEnd', function (event) {
				if (!parrent.hasClass('swiper-slide-active')) {
					sliderMain.autoplay.stop()
				} else {
					var button = $(
						'.swiper-pagination-bullet.swiper-pagination-bullet-active'
					)
					button.removeClass('swiper-pagination-bullet-active')
					setTimeout(function () {
						button.addClass('swiper-pagination-bullet-active')
					}, 300)
					sliderMain.autoplay.start()
				}
			})
			$this.find('.hero-block__slider-item').each(function (e) {
				if (e != 0) {
					var index = e - 1
					var title = $(this).data('shorttitle'),
						bullets = $(
							'<span class="swiper-pagination-item"><span class="swiper-pagination-title">' +
								title +
								'</span><span class="swiper-pagination-progress"></span></span>'
						)
					bullets.appendTo(
						'.swiper-pagination .swiper-pagination-bullet:eq(' + index + ')'
					)
				}
			})
			var dBul = $this.find('.swiper-pagination-bullet-active')
			dBul.removeClass('swiper-pagination-bullet-active')
			setTimeout(function () {
				dBul.addClass('swiper-pagination-bullet-active')
			}, 300)
			mainSliderCount = mainSliderCount + 1
		})
	}

	$('.hero-block__videos-item').on('click', function (e) {
		e.preventDefault()

		if ($(this).hasClass('active')) {
			return false
		}

		var $this = $(this),
			video = $this.data('video'),
			parrent = $this.closest('.section-item'),
			videoContainer = parrent.find('.section-item__video'),
			indexVideo = videoContainer.data('indexvideo')
		videoContainer.data('url', video)
		videoDestroy(indexVideo)
		videoInit(videoContainer, indexVideo, true)
		parrent.find('.hero-block__videos-item').removeClass('active')
		$(this).addClass('active')
	})

	if ($('.information-block').length) {
		var informationSliderCount = 1
		$('.information-block').each(function (e) {
			var $this = $(this)
			var countSlideItem = window.matchMedia('(min-width:1025px)').matches
					? 6
					: window.matchMedia('(min-width:767px)').matches
					? 3
					: 3,
				countItem = 0
			$this.find('.information-block__item').each(function (ind, e) {
				if (countItem % countSlideItem == 0) {
					var group = $(
						'<div class="information-block__group swiper-slide"></div>'
					)
					group.appendTo($this.find('.information-block__list'))
				}

				$(this).appendTo($this.find('.information-block__group:last-child'))
				countItem = countItem + 1
			})
			$this
				.find('.information-block__content')
				.addClass('swiper swiperSliderinformation' + informationSliderCount)
			$this.find('.information-block__list').addClass('swiper-wrapper')
			var nextButton =
				$this.find('.information-block__title') == 'Акции'
					? 'Другие акции'
					: 'Ещё'
			var informationNextSlide = $(
				'<button class="swiper-button-next">' + nextButton + '</button>'
			)
			informationNextSlide.appendTo($this.find('.information-block__inner'))
			var buttonNextClass = $this.find(
				'.information-block__inner .swiper-button-next'
			)[0]
			var sliderEffect = isMobile ? '' : 'creative'
			var initialSlideInfo = $this
				.find('.information-block__item.active')
				.closest('.information-block__group')
				.index()
			var sliderInformation = new Swiper(
				'.swiperSliderinformation' + informationSliderCount,
				{
					effect: sliderEffect,
					creativeEffect: {
						prev: {
							// will set `translateZ(-400px)` on previous slides
							translate: [0, '150%', 0],
							scale: 0.5,
							opacity: 0,
						},
						next: {
							// will set `translateX(100%)` on next slides
							translate: [0, '100%', 0],
							scale: 1,
							opacity: 1,
						},
					},
					initialSlide: initialSlideInfo,
					speed: 1000,
					slidesPerView: 1,
					slidesPerGroup: 1,
					loop: true,
					loopFillGroupWithBlank: true,
					spaceBetween: 20,
					navigation: {
						nextEl: buttonNextClass,
						prevEl: '.swiper-button-prev',
					},
				}
			)
			informationSliderCount = informationSliderCount + 1
		})
		$(document).on('click', '.information-thumbs', function (e) {
			if (
				$(e.target).closest('a').length ||
				$(this).closest('.information-block__item').hasClass('active')
			) {
				return false
			}

			e.preventDefault()
			var link = $(this).find('.information-thumbs__more a').attr('href')
			var idUrl = window.location.hash.split('/')[0] + '/' + link
			history.pushState(null, null, idUrl)
			var parent = $(this).closest('.section-item'),
				video = $(this).data('video'),
				videoContainer = parent.find('.section-item__video'),
				indexVideo = videoContainer.data('indexvideo')

			if (video != '') {
				$('._js-unmuted-video').removeClass('hidden')
				videoContainer.data('url', video)
				videoDestroy(indexVideo)
				videoInit(videoContainer, indexVideo, true)
			} else {
				activeVideoIndex = videoContainer.data('indexvideo')
				$('[data-indexvideo="' + activeVideoIndex + '"]')
					.closest('.section-item')
					.find('._js-unmuted-video')
					.addClass('hidden')
				$('[data-indexvideo="' + activeVideoIndex + '"]').removeClass('play')
				videoContainer.data('url', video)
				videoPlayerStart(null, activeVideoIndex)
			}

			parent.find('.information-block__item').removeClass('active')
			$(this).closest('.information-block__item').addClass('active')
		})
		var informationPopup = $('[data-remodal-id="informationpopup"]').remodal()
		$(document).on(
			'click',
			'.information-thumbs__more a, .news-thumbs__more a, .news-block__big-more a, .pay-type-block__button-item--more',
			function (e) {
				e.preventDefault()
				var link = $(this).attr('href')
				var idUrl = window.location.hash.split('/')[0] + '/' + link
				history.pushState(null, null, idUrl)
				$('[data-remodal-id="informationpopup"]')
					.find('.remodal__ajax-content')
					.html('')
				$('[data-remodal-id="informationpopup"]')
					.closest('.remodal-wrapper')
					.css({
						opacity: 1,
					})
				var link = $(this).attr('href')

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
		)
	}

	var $mobileMenuTopItems = $('.main-menu__item')
	var mobileDelay = 0
	$mobileMenuTopItems.each(function (idx, item) {
		var $item = $(item)
		var delay = 50 * (idx + 1)
		mobileDelay = delay
		$item.css({
			'transition-delay': delay + 'ms',
		})
	})

	if ($('.news-block').length) {
		var newsSliderCount = 1
		$('.news-block').each(function (e) {
			var $this = $(this)
			var countSlideItem = window.matchMedia('(min-width:1025px)').matches
					? 6
					: window.matchMedia('(min-width:767px)').matches
					? 2
					: 2,
				countItem = 0
			$this.find('.news-block__item').each(function (ind, e) {
				if (countItem % countSlideItem == 0) {
					var group = $('<div class="news-block__group swiper-slide"></div>')
					group.appendTo($this.find('.news-block__list'))
				}

				$(this).appendTo($this.find('.news-block__group:last-child'))
				countItem = countItem + 1
			})
			$this
				.find('.news-block__content')
				.addClass('swiper swiperSliderNews' + newsSliderCount)
			$this.find('.news-block__list').addClass('swiper-wrapper')
			var newsNextSlide = $(
				'<button class="swiper-button-next">Еще новости</button>'
			)
			newsNextSlide.appendTo($this.find('.news-block__inner'))
			var buttonNewsNextClass = $this.find(
				'.news-block__inner .swiper-button-next'
			)[0]
			var newsPagination = $('<div class="swiper-pagination"></div>')
			newsPagination.appendTo($this.find('.news-block__content'))
			var paginationNews = $this.find(
				'.news-block__inner .swiper-pagination'
			)[0]
			var sliderEffect = isMobile ? '' : 'creative'
			var sliderInformation = new Swiper(
				'.swiperSliderNews' + newsSliderCount,
				{
					effect: sliderEffect,
					creativeEffect: {
						prev: {
							translate: ['-5%', 0, 0],
							opacity: 0,
						},
						next: {
							opacity: 1,
							translate: [0, 0, 0],
						},
					},
					speed: 1000,
					slidesPerView: 1,
					slidesPerGroup: 1,
					loop: true,
					loopFillGroupWithBlank: true,
					spaceBetween: 20,
					navigation: {
						nextEl: buttonNewsNextClass,
						prevEl: '.swiper-button-prev',
					},
					pagination: {
						el: paginationNews,
						type: 'bullets',
					},
				}
			)
			newsSliderCount = newsSliderCount + 1
		})
		$(document).on(
			'click',
			'.news-thumbs__image--video, .news-thumbs__video',
			function (e) {
				e.preventDefault()
				var parrent = $(this).closest('.news-thumbs'),
					name = parrent.find('.news-thumbs__name').text(),
					link = parrent.find('.news-thumbs__more a').attr('href'),
					video = parrent.data('video'),
					section = parrent.closest('.news-block'),
					videoContainer = section.find('.news-block__video')
				videoContainer.attr('data-url', video)
				var indexVideo =
					videoContainer.data('indexvideo') !== undefined
						? videoContainer.data('indexvideo')
						: videoObject.length + 1
				videoInit(videoContainer, indexVideo, true)
				activeVideoIndex = indexVideo
				section.find('.news-block__big-name').text(name)
				section.find('.news-block__big-more a').attr('href', link)
				section.addClass('videonews')
			}
		)
		$(document).on('click', '.news-block__back-to', function (e) {
			e.preventDefault()
			var section = $(this).closest('.news-block'),
				videoContainer = section.find('.news-block__video'),
				indexVideo = videoContainer.data('indexvideo')
			videoDestroy(indexVideo)
			section.removeClass('videonews')
		})
	}

	if ($('.pay-type-block').length) {
		$('.pay-type-block__videos-item').on('click', function (e) {
			e.preventDefault()
			var $this = $(this),
				video = $this.data('video'),
				href = $this.data('href'),
				nameFull = $this.data('name'),
				name = $this.find('.pay-type-block__videos-content > span').text(),
				desc = $this.find('.pay-type-block__video-desc').html(),
				parrent = $this.closest('.section-item'),
				videoContainer = parrent.find('.section-item__video'),
				indexVideo = videoContainer.data('indexvideo')
			var idUrl = window.location.hash.split('/')[0] + '/' + href
			history.pushState(null, null, idUrl)
			videoContainer.data('url', video)
			videoDestroy(indexVideo)
			videoInit(videoContainer, indexVideo, true)
			parrent.find('.pay-type-block__videos-item').removeClass('active')
			$this.addClass('active')
			parrent.find('.pay-type-block__bottom-inner').fadeOut(300, function (e) {
				parrent.find('.pay-type-block__bottom-name').text(name)
				parrent.find('.pay-type-block__description').html(desc)
				parrent.find('.pay-type-block__buttons').addClass('active')
				parrent
					.find('.pay-type-block__button-item--add ._js-text-pay-type')
					.text(nameFull)
				parrent.find('.pay-type-block__button-item--more').attr('href', href)
				$('.site-form--pay-form .site-form__title').text(
					'Оставить заявку на ' + name
				)
				$('.site-form--pay-form input[name="forminfo"]').text(nameFull)
				parrent.find('.pay-type-block__bottom-inner').fadeIn(200)
			})
		})
	}

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
	$(document).on('click', '.product-block__rotate-button button', function (e) {
		e.preventDefault()
		var rotateBox = $('.threesixty')
		var rotateImage = []

		for (var i = 1; i <= frameNumber; i++) {
			var image = view360source + '_' + i + '.png'
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
	$(document).on('click', '.product-block__main-tabs-item', function (e) {
		e.preventDefault()

		if ($(this).hasClass('active')) {
			return
		}

		var index = $(this).index(),
			tab = $('.product-block__tab-item:eq(' + index + ')')
		$('.product-block__tab-item:visible').fadeOut(200, function () {
			$('.product-block__tab-item').removeClass('active')
			tab.fadeIn(400, function () {
				tab.addClass('active')
			})
		})
	})
	$('.product-full-list__item > a').on('click', function (e) {
		e.preventDefault()
		var name = $(this).data('fulename'),
			video = $(this).data('video'),
			image = $(this).find('.product-full-list__item-image img').attr('src'),
			description = $(this).find('.product-full-list__item-description').text(),
			parentSection = $(
				'#' + $(this).closest('.remodal').data('sectionid')
			).closest('.section-item'),
			videoContainer = parentSection.find('.section-item__video'),
			activeProductHref = $(this).attr('href'),
			indexVideo = videoContainer.data('indexvideo'),
			link = $(this).attr('href')
		var idUrl = window.location.hash.split('/')[0] + '/' + link
		history.pushState(null, null, idUrl)
		parentSection.find('.product-section').attr('data-link', activeProductHref)
		parentSection
			.find('.product-section__product-list .product-section__product-item')
			.removeClass('active')
		$(this)
			.closest('.product-full-list__list')
			.find('.product-full-list__item')
			.removeClass('active')
		$(this).closest('.product-full-list__item').addClass('active')
		parentSection
			.find(
				'.product-section__product-list .product-section__product-item[data-fulename="' +
					name +
					'"]'
			)
			.addClass('active')
		parentSection.find('.product-section__bottom-name').animate(
			{
				opacity: 0,
			},
			300,
			function () {
				parentSection.find('.product-section__bottom-name').text(name)
				parentSection.find('.product-section__bottom-name').animate(
					{
						opacity: 1,
					},
					300
				)
			}
		)
		parentSection.find('.product-section__description').animate(
			{
				opacity: 0,
			},
			300,
			function () {
				parentSection.find('.product-section__description').text(description)
				parentSection.find('.product-section__description').animate(
					{
						opacity: 1,
					},
					300
				)
			}
		)
		parentSection.find('.product-section__buttons').addClass('active')
		parentSection.find('.product-section__next-model').addClass('active')
		videoContainer.data('url', video)
		videoDestroy(indexVideo)
		videoInit(videoContainer, indexVideo, true)
		$(this)
			.closest('.remodal__container')
			.find('.header__close')
			.trigger('click')
		$('.product-order-form__form input[name="productinfo"]').val(name)
		$('.product-order-form__title span').text(name)
		$('.product-order-form__image img').attr('src', image)
	})
	$('.product-section__product-item')
		.not('.product-section__product-item--all')
		.on('click', function (e) {
			e.preventDefault()

			if ($(this).hasClass('product-section__product-item--acssesuar')) {
				var parent = $(this).closest('.product-section'),
					indProduct = $(this).index(),
					button = parent.find(
						'.product-section__buttons .product-section__button-item[data-type="acsessuarfull-popup"]'
					),
					idbutton = button.data('remodal-target')
				$('.product-acssesuar-list').removeClass('product')
				$('.product-acssesuar-list, .product-acssesuar-list__item').removeClass(
					'opened'
				)
				parent
					.find(
						'.product-section__buttons .product-section__button-item:first-child'
					)
					.trigger('click')
				$('[data-remodal-id="' + idbutton + '"]')
					.find(
						'.product-acssesuar-list__list > .product-acssesuar-list__item:eq(' +
							indProduct +
							') > .product-acssesuar-list__item-link'
					)
					.trigger('click')
			} else {
				var name = $(this).data('fulename'),
					id = $(this).closest('.product-section').attr('id'),
					popupList = $('.remodal[data-sectionid="' + id + '"]')
				popupList
					.find('.product-full-list__item-link[data-fulename="' + name + '"]')
					.trigger('click')
			}
		})
	$('.product-section__next-model').on('click', function (e) {
		e.preventDefault()
		var id = $(this).closest('.product-section').attr('id'),
			popupList = $('.remodal[data-sectionid="' + id + '"]'),
			index =
				popupList
					.find('.product-full-list__list .product-full-list__item.active')
					.index() + 1

		if (
			index >=
			popupList.find('.product-full-list__list .product-full-list__item').length
		) {
			index = 0
		}

		popupList
			.find('.product-full-list__item:eq(' + index + ') > a')
			.trigger('click')
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
	$(document).on(
		'click',
		'.product-acssesuar-list__sorting-item',
		function (e) {
			e.preventDefault()

			if ($(this).hasClass('down')) {
				$(this).removeClass('down')
				$(this).addClass('up')
			} else {
				$(this).removeClass('up')
				$(this).addClass('down')
			}
		}
	)
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

	if (!isMobile) {
		$('.product-section').each(function (e) {
			var $this = $(this),
				topList = $this.find('.product-section__product-list'),
				bottomList = $this.find('.product-section__bottom-inner')

			if (topList.length) {
				var height =
						parseFloat(
							$this.find('.product-section__inner').css('paddingTop')
						) +
						topList.outerHeight() +
						'px' +
						60,
					hoverTop = $(
						'<span class="product-section__bghover-top" style="height: ' +
							height +
							'px;"></span>'
					)
				hoverTop.prependTo($this)
			}

			if (bottomList.length) {
				var height =
						parseFloat(
							$this.find('.product-section__inner').css('paddingBottom')
						) +
						bottomList.outerHeight() +
						60,
					hoverBottom = $(
						'<span class="product-section__bghover-bottom" style="height: ' +
							height +
							'px;"></span>'
					)
				hoverBottom.prependTo($this)
			}
		})
		$('.product-section__product-list').on('mouseenter', function (e) {
			var height =
				parseFloat(
					$(this).closest('.product-section__inner').css('paddingBottom')
				) +
				$(this).outerHeight() +
				60
			$(this)
				.closest('.product-section')
				.find('.product-section__bghover-top')
				.css('height', height)
			$(this).closest('.product-section').addClass('hoverTop')
		})
		$('.product-section__product-list').on('mouseleave', function (e) {
			$(this).closest('.product-section').removeClass('hoverTop')
		})
		$('.header ').on('mouseenter', function (e) {
			$('.section-item.swiper-slide-active')
				.find('.product-section')
				.addClass('hoverTop')
		})
		$('.header ').on('mouseleave', function (e) {
			$('.section-item.swiper-slide-active')
				.find('.product-section')
				.removeClass('hoverTop')
		})
		$('.product-section__bottom-inner').on('mouseenter', function (e) {
			var height =
				parseFloat(
					$(this).closest('.product-section__inner').css('paddingBottom')
				) +
				$(this).outerHeight() +
				60
			$(this)
				.closest('.product-section')
				.find('.product-section__bghover-bottom')
				.css('height', height)
			$(this).closest('.product-section').addClass('hoverBottom')
		})
		$('.product-section__bottom-inner').on('mouseleave', function (e) {
			$(this).closest('.product-section').removeClass('hoverBottom')
		})
	}

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
			$('[data-remodal-id="informationpopup"]')
				.closest('.remodal-wrapper')
				.css({
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
			$('[data-remodal-id="informationpopup"]')
				.closest('.remodal-wrapper')
				.css({
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
			$('[data-remodal-id="informationpopup"]')
				.closest('.remodal-wrapper')
				.css({
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
			$('[data-remodal-id="informationpopup"]')
				.closest('.remodal-wrapper')
				.css({
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
			$('[data-remodal-id="informationpopup"]')
				.closest('.remodal-wrapper')
				.css({
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
				$('.services-video-list__item-link[href="' + link + '"]').trigger(
					'click'
				)
			}
		},
		'gallery/:name?': function galleryName(name) {
			var informationPopup = $('[data-remodal-id="informationpopup"]').remodal()
			$('[data-remodal-id="informationpopup"]')
				.find('.remodal__ajax-content')
				.html('')
			$('[data-remodal-id="informationpopup"]')
				.closest('.remodal-wrapper')
				.css({
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
})
