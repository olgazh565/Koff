import axios from 'axios';
import {API_URL} from '../const';
import {AccessKeyService} from './StorageService';

export class ApiService {
	#apiUrl = API_URL;

	constructor() {
		this.accessKeyService = new AccessKeyService('accessKey');
		this.accessKey = this.accessKeyService.get();
		this.isDownlodedAccessKey = false;
	}

	async getAccessKey() {
		try {
			if (!this.accessKey && !this.isDownlodedAccessKey) {
				this.isDownlodedAccessKey = true;
				const response = await axios.get(`${this.#apiUrl}api/users/accessKey`);
				this.accessKey = response.data.accessKey;
				this.accessKeyService.set(this.accessKey);
				this.isDownlodedAccessKey = false;
			}
		} catch (error) {
			this.isDownlodedAccessKey = false;
			console.log('error: ', error);
		}
	}

	async getData(pathname, params = {}) {
		try {
			const response = await axios.get(`${this.#apiUrl}${pathname}`, {
				headers: {
					Authorization: `Bearer ${this.accessKey}`,
				},
				params,
			});

			return response.data;
		} catch (error) {
			if (error.response && error.response.status === 401) {
				this.accessKey = null;
				this.accessKeyService.delete();

				return this.getData(pathname, params);
			} else {
				console.log(error);
			}
		}
	}

	async getProducts(params = {}) {
		return await this.getData('api/products', params);
	}

	async getProductCategories() {
		return await this.getData('api/productCategories');
	}

	async getProductById(id) {
		return await this.getData(`api/products/${id}`);
	}

	async postProductToCart(productId, quantity = 1) {
		if (!this.accessKey) {
			await this.getAccessKey();
		}
		try {
			const response = await axios.post(
					`${this.#apiUrl}api/cart/products`,
					{
						productId,
						quantity,
					}, {
						headers: {
							Authorization: `Bearer ${this.accessKey}`,
						},
					});

			return response.data;
		} catch (error) {
			if (error.response && error.response.status === 401) {
				this.accessKey = null;
				this.accessKeyService.delete();
			} else {
				console.error(error);
			}
		}
	}

	async changeQuantityProductToCart(productId, quantity) {
		if (!this.accessKey) {
			await this.getAccessKey();
		}
		try {
			const response = await axios.put(
					`${this.#apiUrl}api/cart/products`,
					{
						productId,
						quantity,
					}, {
						headers: {
							Authorization: `Bearer ${this.accessKey}`,
						},
					});
			return response.data;
		} catch (error) {
			if (error.response && error.response.status === 401) {
				this.accessKey = null;
				this.accessKeyService.delete();
			} else {
				console.error(error);
			}
		}
	}

	async getCart() {
		return await this.getData('api/cart');
	}

	async deleteProductFromCart(id) {
		if (!this.accessKey) {
			await this.getAccessKey();
		}
		try {
			const response = await axios.delete(
					`${this.#apiUrl}api/cart/products/${id}`,
					{
						headers: {
							Authorization: `Bearer ${this.accessKey}`,
						},
					});
			return response.data;
		} catch (error) {
			if (error.response && error.response.status === 401) {
				this.accessKey = null;
				this.accessKeyService.delete();
			} else {
				console.error(error);
			}
		}
	}

	async postOrder(data) {
		if (!this.accessKey) {
			await this.getAccessKey();
		}
		try {
			const response = await axios.post(
					`${this.#apiUrl}api/orders`,
					data,
					{
						headers: {
							Authorization: `Bearer ${this.accessKey}`,
						},
					});

			return response.data;
		} catch (error) {
			if (error.response && error.response.status === 401) {
				this.accessKey = null;
				this.accessKeyService.delete();
			} else {
				console.error(error);
			}
		}
	}

	async getOrder(id) {
		return await this.getData(`api/orders/${id}`);
	}
}
