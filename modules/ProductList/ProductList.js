import {Card} from '../../features/Card/Card';
import {addContainer} from '../addContainer';

export class ProductList {
	static instance = null;

	constructor() {
		if (!ProductList.instance) {
			ProductList.instance = this;

			this.element = document.createElement('section');
			this.element.classList.add('goods');
			this.containerElement = addContainer(this.element);
			this.isMounted = false;
		}

		return ProductList.instance;
	}

	mount(parent, data, title) {
		this.containerElement.innerHTML = '';

		const titleElem = document.createElement('h2');
		titleElem.textContent = title ? title : 'Список товаров';

		titleElem.className = title ? 'goods__title' :
			'goods__title visually-hidden';

		this.containerElement.append(titleElem);

		this.updateListElem(data);

		if (this.isMounted) return;

		parent.append(this.element);

		this.isMounted = true;
	}

	unmount() {
		this.element.remove();
		this.isMounted = false;
	}

	updateListElem(data = []) {
		const listElem = document.createElement('ul');
		listElem.classList.add('goods__list');

		const listItems = data.map(
				({id, images: [image], name: title, price}) => {
					const listItemElem = document.createElement('li');
					listItemElem.classList.add('goods__item');
					listItemElem.append(new Card({id, image, title, price}).create());

					return listItemElem;
				});
		listElem.append(...listItems);
		this.containerElement.append(listElem);
	}
}
