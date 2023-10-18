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

			const index = products.findIndex(item => item.productId === id);

			if (index === -1) {
				await new ApiService().postProductToCart(id);
				const {products: products2} = await new ApiService().getCart();

				const basketCount2 = products2?.reduce(
						(acc, item) => acc + item.quantity, 0);

				new Header().changeCount(basketCount2);
			} else {
				let quantity = products[index].quantity;
				quantity++;
				await new ApiService().changeQuantityProductToCart(id, quantity);
				const {products: products3} = await new ApiService().getCart();

				const basketCount3 = products3?.reduce(
						(acc, item) => acc + item.quantity, 0);

				new Header().changeCount(basketCount3);
			}
		});

		return button;
	}
}
