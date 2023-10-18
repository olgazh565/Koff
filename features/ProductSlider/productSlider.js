export const productSlider = () => {
	Promise.all([
		import('swiper/modules'),
		import('swiper'),
		import('swiper/css'),
	]).then(([{Navigation, Thumbs}, {Swiper}]) => {
		try {
			const swiperThumbnails = new Swiper('.product__slider-thumbnails', {
				spaceBetween: 10,
				slidesPerView: 4,
				freeMode: true,
				watchSlidesProgress: true,
			});

			new Swiper('.product__slider-main', {
				modules: [Navigation, Thumbs],
				spaceBetween: 10,
				navigation: {
					nextEl: '.product__arrow_next',
					prevEl: '.product__arrow_prev',
				},
				thumbs: {
					swiper: swiperThumbnails,
				},
			});
		} catch (error) {
			console.log(error);
		}
	});
};
