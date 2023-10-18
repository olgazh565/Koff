import {Header} from '../../modules/header/Header';
import {ApiService} from '../../services/ApiService';

export class CardButton {
	constructor(className, text) {
		this.text = text;
		this.className = className;
	}

	create(id) {
		const button = document.createElement('button');
		button.classList.add(this.className);
		button.dataset.id = id;
		button.textContent = this.text;

		button.addEventListener('click', async () => {
			const {products} = await new ApiService().getCart();
			if (products.find(item => item.id === id)) return;
			await new ApiService().postProductToCart(id);

			const basketCount = products.reduce(
					(acc, item) => acc + item.quantity, 0);

			new Header().changeCount(basketCount);
		});

		return button;
	}
}
