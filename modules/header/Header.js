import {Logo} from '../../features/Logo/Logo.';
import {likeSvg} from '../../features/likeSvg/likeSvg';
import {router} from '../../main';
import {addContainer} from '../addContainer';

export class Header {
	static instance = null;

	constructor() {
		if (!Header.instance) {
			Header.instance = this;

			this.element = document.createElement('header');
			this.element.classList.add('header');
			this.containerElement = addContainer(this.element, 'header__container');
			this.isMounted = false;
		}

		return Header.instance;
	}

	mount() {
		if (this.isMounted) return;

		const logo = new Logo('header').create();
		const searchForm = this.getSearchForm();
		const navigation = this.getNavigation();
		this.changeCount();

		this.containerElement.append(logo, searchForm, navigation);

		document.body.append(this.element);
		this.isMounted = true;
	}

	unmount() {
		this.element.remove();
		this.isMounted = false;
	}

	getSearchForm() {
		const searchForm = document.createElement('form');
		searchForm.classList.add('header__search');
		searchForm.method = 'get';

		searchForm.innerHTML = `
      <input type="search" class="header__input" placeholder="Введите запрос"
				name="search">
      <button type="submit" class="header__btn">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M7.66665 13.9999C11.1644 13.9999 14 11.1644 14 7.66659C14 4.16878 11.1644 1.33325 7.66665 1.33325C4.16884 1.33325 1.33331 4.16878 1.33331 7.66659C1.33331 11.1644 4.16884 13.9999 7.66665 13.9999Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M14.6666 14.6666L13.3333 13.3333" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
      </button>
    `;

		searchForm.addEventListener('submit', (e) => {
			e.preventDefault();
			const search = searchForm.search.value.trim();
			if (!search) return;
			searchForm.reset();
			router.navigate(`/search?q=${search}`);
		});

		return searchForm;
	}

	getNavigation() {
		const navigation = document.createElement('nav');
		navigation.classList.add('header__control');

		const favoriteLink = document.createElement('a');
		favoriteLink.classList.add('header__link');
		favoriteLink.href = '/favorite';

		const favoriteText = document.createElement('p');
		favoriteText.classList.add('header__link-text');
		favoriteText.textContent = 'Избранное';

		favoriteLink.prepend(favoriteText);

		likeSvg().then(svg => {
			favoriteLink.append(svg);
		});

		const cartLink = document.createElement('a');
		cartLink.classList.add('header__link');
		cartLink.href = '/cart';

		const cartText = document.createElement('span');
		cartText.classList.add('header__link-text');
		cartText.textContent = 'Корзина';

		const countElement = document.createElement('span');
		countElement.classList.add('header__count');
		countElement.textContent = '(0)';

		cartLink.append(cartText, countElement);
		cartLink.insertAdjacentHTML('beforeend', `
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M5.87336 1.33325L3.46002 3.75325" stroke="currentColor" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M10.1266 1.33325L12.54 3.75325" stroke="currentColor" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M1.33331 5.23324C1.33331 3.9999 1.99331 3.8999 2.81331 3.8999H13.1866C14.0066 3.8999 14.6666 3.9999 14.6666 5.23324C14.6666 6.66657 14.0066 6.56657 13.1866 6.56657H2.81331C1.99331 6.56657 1.33331 6.66657 1.33331 5.23324Z" stroke="currentColor"/>
          <path class="svg-white" d="M6.50665 9.33325V11.6999" stroke="currentColor" stroke-linecap="round"/>
          <path class="svg-white" d="M9.5733 9.33325V11.6999" stroke="currentColor" stroke-linecap="round"/>
          <path d="M2.33331 6.66675L3.27331 12.4267C3.48665 13.7201 3.99998 14.6667 5.90665 14.6667H9.92665C12 14.6667 12.3066 13.7601 12.5466 12.5067L13.6666 6.66675" stroke="currentColor" stroke-linecap="round"/>
      </svg>
		`);
		navigation.append(favoriteLink, cartLink);

		this.countElement = countElement;
		return navigation;
	}

	changeCount(count) {
		this.countElement.textContent = count ? `(${count})` : '(0)';
	}
}
