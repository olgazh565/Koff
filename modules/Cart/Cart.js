import {API_URL} from '../../const';
import {debounce} from '../../helpers';
import {router} from '../../main';
import {ApiService} from '../../services/ApiService';
import {addContainer} from '../addContainer';
import {Header} from '../Header/Header';

export class Cart {
	static instance = null;

	constructor() {
		if (!Cart.instance) {
			Cart.instance = this;

			this.element = document.createElement('section');
			this.element.classList.add('cart');
			this.containerElement = addContainer(this.element, 'cart__container');
			this.isMounted = false;
			this.debUpdateCart = debounce(this.updateCart.bind(this), 300);
		}

		return Cart.instance;
	}

	async mount(parent, data, title) {
		if (this.isMounted) return;
		this.containerElement.innerHTML = '';
		this.titleElem = document.createElement('h2');
		this.titleElem.classList.add('cart__title');
		this.titleElem.textContent = title;

		this.containerElement.append(this.titleElem);

		this.cartData = data;

		if (data.products && data.products.length) {
			this.renederProducts();
			this.order = this.renederPlace();
			this.form = this.renderForm();
		}

		parent.append(this.element);
		this.isMounted = true;
	}

	unmount() {
		this.element.remove();
		this.isMounted = false;
	}

	updateCart(id, quantity) {
		if (quantity === 0) {
			new ApiService().deleteProductFromCart(id);

			this.cartData.products =
				this.cartData.products.filter(item => item.productId !== id);

			if (this.cartData.totalCount === 0) {
				this.containerElement.innerHTML = '';
				this.titleElem.textContent = 'Корзина пуста';
			}
		} else {
			new ApiService().changeQuantityProductToCart(id, quantity);

			this.cartData.products.forEach(item => {
				if (item.productId === id) {
					item.quantity = quantity;
				}
			});
		}

		this.cartData.totalPrice = this.cartData.products.reduce(
				(acc, item) => acc + item.price * item.quantity
				, 0,
		);

		this.cartData.totalCount = this.cartData.products.reduce(
				(acc, item) => acc + item.quantity, 0);

		new Header().changeCount(this.cartData.totalCount);

		this.orderCount.textContent =
			`${this.cartData.totalCount} товара на сумму:`;
		this.orderPrice.textContent =
			`${this.cartData.totalPrice.toLocaleString()} ₽`;
	}

	renederProducts() {
		const listProducts = this.cartData.products;

		const listElem = document.createElement('ul');
		listElem.classList.add('cart__products');

		const listItems = listProducts.map(item => {
			const listItem = document.createElement('li');
			listItem.classList.add('cart__product');

			const img = document.createElement('img');
			img.classList.add('cart__img');
			img.src = `${API_URL}${item.images[0]}`;
			img.alt = item.name;

			const title = document.createElement('a');
			title.classList.add('cart__title-product');
			title.href = `/product/${item.id}`;
			title.textContent = item.name;

			const price = document.createElement('p');
			price.classList.add('cart__price');
			price.textContent = `${(item.price * item.quantity).toLocaleString()} ₽`;

			const article = document.createElement('p');
			article.classList.add('cart__article');
			article.textContent = `арт. ${item.article}`;

			const productControl = document.createElement('div');
			productControl.classList.add('cart__product-control');

			const buttonMinus = document.createElement('button');
			buttonMinus.classList.add('cart__product-btn');
			buttonMinus.textContent = '-';

			const buttonPlus = document.createElement('button');
			buttonPlus.classList.add('cart__product-btn');
			buttonPlus.textContent = '+';

			const productCount = document.createElement('p');
			productCount.classList.add('cart__product-count');
			productCount.textContent = item.quantity;

			buttonMinus.addEventListener('click', async () => {
				console.log('this.cartData: ', this.cartData);

				if (item.quantity) {
					item.quantity--;
					productCount.textContent = item.quantity;

					if (item.quantity === 0) {
						listItem.remove();

						this.debUpdateCart(item.id, item.quantity);
						console.log(this.cartData.totalCount);

						if (this.cartData.totalCount === 1) {
							this.order.innerHTML = '';
							this.form.innerHTML = '';
							this.titleElem.textContent = 'Корзина пуста';
						}
						return;
					}
					price.textContent =
						`${(item.price * item.quantity).toLocaleString()} ₽`;

					this.debUpdateCart(item.id, item.quantity);
				}
			});

			buttonPlus.addEventListener('click', async () => {
				if (item.quantity) {
					item.quantity++;
					productCount.textContent = item.quantity;
					price.textContent =
						`${(item.price * item.quantity).toLocaleString()} ₽`;

					this.debUpdateCart(item.id, item.quantity);
				}
			});

			productControl.append(buttonMinus, productCount, buttonPlus);
			listItem.append(img, title, price, article, productControl);

			return listItem;
		});

		listElem.append(...listItems);

		this.containerElement.append(listElem);
	}

	renederPlace() {
		const count = this.cartData.products.reduce(
				(acc, item) => acc + item.quantity, 0);
		const totalPrice = this.cartData.totalPrice;

		const orderPlace = document.createElement('div');
		orderPlace.classList.add('cart__place');

		const cartSubtitle = document.createElement('h3');
		cartSubtitle.classList.add('cart__subtitle');
		cartSubtitle.textContent = 'Оформление';

		const orderPlaceInfo = document.createElement('div');
		orderPlaceInfo.classList.add('cart__place-info');

		this.orderCount = document.createElement('p');
		this.orderCount.classList.add('cart__place-info');
		this.orderCount.textContent = `${count} товара на сумму:`;

		this.orderPrice = document.createElement('p');
		this.orderPrice.classList.add('cart__place-price');
		this.orderPrice.textContent = `${totalPrice.toLocaleString()} ₽`;

		orderPlaceInfo.append(this.orderCount, this.orderPrice);

		const delivery = document.createElement('p');
		delivery.classList.add('cart__place-delivery');
		delivery.textContent = 'Доставка 0 ₽';

		const orderButton = document.createElement('button');
		orderButton.classList.add('cart__place-btn');
		orderButton.type = 'submit';
		orderButton.setAttribute('form', 'order');
		orderButton.textContent = 'Оформить заказ';

		orderPlace.append(cartSubtitle, orderPlaceInfo, delivery, orderButton);

		this.containerElement.append(orderPlace);
		return orderPlace;
	}

	renderForm() {
		const form = document.createElement('form');
		form.classList.add('cart__form', 'form-order');
		form.id = 'order';
		form.method = 'POST';

		form.innerHTML = `
      <h3 class="cart__subtitle cart__subtitle_form-order">Данные для доставки</h3>
      <fieldset class="form-order__fieldset form-order__fieldset_input">
          <input type="text" class="form-order__input" name="name" 
						placeholder="Фамилия Имя Отчество" required>
          <input type="tel" class="form-order__input" name="phone" 
						placeholder="Телефон" required>
          <input type="email" class="form-order__input" name="email" 
						placeholder="E-mail" required>
          <input type="text" class="form-order__input" name="address" 
						placeholder="Адрес доставки" disabled>
          <textarea class="form-order__textarea" name="comments" 
						placeholder="Комментарий к заказу"></textarea>
      </fieldset>
      <fieldset class="form-order__fieldset form-order__fieldset_radio">
          <legend class="form-order__legend">Доставка</legend>
          <label class="form-order__label radio">
              <input class="radio__input radio__input_delivery" type="radio" name="deliveryType" 
								value="delivery" required>
              Доставка
          </label>
          <label class="form-order__label radio">
              <input class="radio__input radio__input_pickup" type="radio" name="deliveryType" 
								value="pickup" required>
              Самовывоз
          </label>
      </fieldset>
  
      <fieldset class="form-order__fieldset form-order__fieldset_radio">
          <legend class="form-order__legend">Оплата</legend>
          <label class="form-order__label radio">
              <input class="radio__input" type="radio" name="paymentType" 
							value="card" required>
              Картой при получении
          </label>
          <label class="form-order__label radio">
              <input class="radio__input" type="radio" name="paymentType"
								value="cash" required>
              Наличными при получении
          </label>
      </fieldset>
    `;

		form.addEventListener('submit', async (e) => {
			e.preventDefault();

			const data = Object.fromEntries(new FormData(form));
			const {orderId} = await new ApiService().postOrder(data);
			router.navigate(`/order/${orderId}`);
		});

		form.addEventListener('change', (e) => {
			if (e.target.closest('.radio__input_delivery')) {
				form.address.disabled = false;
				form.address.focus();
				form.address.required = true;
			} else if (e.target.closest('.radio__input_pickup')) {
				form.address.disabled = true;
				form.address.required = false;
				form.address.value = '';
			}
		});

		this.containerElement.append(form);
		return form;
	}
}
