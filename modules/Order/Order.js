import {addContainer} from '../addContainer';

export class Order {
	static instance = null;

	constructor() {
		if (!Order.instance) {
			Order.instance = this;

			this.element = document.createElement('section');
			this.element.classList.add('order');
			this.containerElement = addContainer(this.element, 'order__container');

			this.isMounted = false;
		}

		return Order.instance;
	}

	mount(parent, data) {
		if (this.isMounted) return;

		this.orderWrapper = this.renderOrder(data);

		parent.append(this.element);

		this.isMounted = true;
	}

	unmount() {
		this.orderWrapper.remove();
		this.element.remove();
		this.isMounted = false;
	}

	renderOrder(data) {
		const orderWrapper = document.createElement('div');
		orderWrapper.classList.add('order__wrapper');

		const orderHeader = document.createElement('div');
		orderHeader.classList.add('order__header');

		const orderTitle = document.createElement('h2');
		orderTitle.classList.add('order__title');
		orderTitle.textContent = 'Заказ успешно размещен';

		const orderTotal = document.createElement('p');
		orderTotal.classList.add('order__total-sum');
		orderTotal.textContent = `${Number(data.totalPrice).toLocaleString()} ₽`;

		orderHeader.append(orderTitle, orderTotal);

		const orderId = document.createElement('p');
		orderId.classList.add('order__order-number');
		orderId.textContent = `№${data.id}`;

		const orderSubtitle = document.createElement('p');
		orderSubtitle.classList.add('order__subtitle');
		orderSubtitle.textContent = 'Данные доставки';

		const orderList = document.createElement('ul');
		orderList.classList.add('order__list');

		const orderName = document.createElement('li');
		orderName.classList.add('order__item');

		const orderNameText = document.createElement('p');
		orderNameText.classList.add('order__name');
		orderNameText.textContent = 'Получатель';

		const orderNameValue = document.createElement('p');
		orderNameValue.classList.add('order__value');
		orderNameValue.textContent = data.name;

		orderName.append(orderNameText, orderNameValue);

		const orderPhone = document.createElement('li');
		orderPhone.classList.add('order__item');

		const orderPhoneText = document.createElement('p');
		orderPhoneText.classList.add('order__name');
		orderPhoneText.textContent = 'Телефон';

		const orderPhoneValue = document.createElement('p');
		orderPhoneValue.classList.add('order__value');
		orderPhoneValue.textContent = data.phone;

		orderPhone.append(orderPhoneText, orderPhoneValue);

		const orderEmail = document.createElement('li');
		orderEmail.classList.add('order__item');

		const orderEmailText = document.createElement('p');
		orderEmailText.classList.add('order__name');
		orderEmailText.textContent = 'E-mail';

		const orderEmailValue = document.createElement('p');
		orderEmailValue.classList.add('order__value');
		orderEmailValue.textContent = data.email;

		orderEmail.append(orderEmailText, orderEmailValue);

		const orderAddress = document.createElement('li');
		orderAddress.classList.add('order__item');

		const orderAddressText = document.createElement('p');
		orderAddressText.classList.add('order__name');
		orderAddressText.textContent = 'Адрес доставки';

		const orderAddressValue = document.createElement('p');
		orderAddressValue.classList.add('order__value');
		orderAddressValue.textContent = data.address;

		orderAddress.style.display =
			data.deliveryType === 'pickup' ? 'none' : 'flex';

		orderAddress.append(orderAddressText, orderAddressValue);

		const orderPayment = document.createElement('li');
		orderPayment.classList.add('order__item');

		const orderPaymentText = document.createElement('p');
		orderPaymentText.classList.add('order__name');
		orderPaymentText.textContent = 'Способ оплаты';

		const orderPaymentValue = document.createElement('p');
		orderPaymentValue.classList.add('order__value');
		orderPaymentValue.textContent = data.paymentType === 'cash' ?
			'Наличными при получении' : 'Картой при получении';

		orderPayment.append(orderPaymentText, orderPaymentValue);

		const orderDelivery = document.createElement('li');
		orderDelivery.classList.add('order__item');

		const orderDeliveryText = document.createElement('p');
		orderDeliveryText.classList.add('order__name');
		orderDeliveryText.textContent = 'Способ получения';

		const orderDeliveryValue = document.createElement('p');
		orderDeliveryValue.classList.add('order__value');
		orderDeliveryValue.textContent =
			data.deliveryType === 'pickup' ? 'Самовывоз' : 'Доставка';

		orderDelivery.append(orderDeliveryText, orderDeliveryValue);

		orderList.append(
				orderName,
				orderPhone,
				orderEmail,
				orderAddress,
				orderPayment,
				orderDelivery,
		);

		const orderLink = document.createElement('a');
		orderLink.classList.add('order__link');
		orderLink.href = '/';
		orderLink.textContent = 'На главную';

		orderWrapper.append(
				orderHeader,
				orderId,
				orderSubtitle,
				orderList,
				orderLink,
		);

		this.containerElement.append(orderWrapper);
		return orderWrapper;
	}
}
