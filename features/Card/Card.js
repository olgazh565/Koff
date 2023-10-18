import {API_URL} from '../../const';
import {CardButton} from '../CardButton/CardButton';
import {LikeButton} from '../LikeButton/LikeButton';

export class Card {
	constructor({id, image, title, price}) {
		this.id = id;
		this.image = image;
		this.title = title;
		this.price = price;
		this.cardButton = new CardButton('card__btn', 'В корзину');
		this.likeButton = new LikeButton('card__favorite');
	}

	create() {
		const article = document.createElement('article');
		article.classList.add('goods__card', 'card');

		const link = document.createElement('a');
		link.classList.add('card__link', 'card__link_img');
		link.href = `/product/${this.id}`;

		const linkImg = document.createElement('img');
		linkImg.classList.add('card__img');
		linkImg.src = `${API_URL}${this.image}`;
		linkImg.alt = this.title;

		link.append(linkImg);

		const info = document.createElement('div');
		info.classList.add('card__info');

		const title = document.createElement('h3');
		title.classList.add('card__title');

		const titleLink = document.createElement('a');
		titleLink.classList.add('card__link');
		titleLink.href = `/product/${this.id}`;
		titleLink.textContent = this.title;

		title.append(titleLink);

		const price = document.createElement('p');
		price.classList.add('card__price');
		price.innerHTML = `${this.price.toLocaleString()}&nbsp;₽`;

		info.append(title, price);

		const button = this.cardButton.create(this.id);
		const favorite = this.likeButton.create(this.id);

		article.append(link, info, button, favorite);

		return article;
	}
}

