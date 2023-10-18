import 'normalize.css';
import './style.scss';
import Navigo from 'navigo';
import {Header} from './modules/header/Header';
import {Main} from './modules/main/Main';
import {Footer} from './modules/footer/Footer';
import {ProductList} from './modules/ProductList/ProductList';
import {ApiService} from './services/ApiService';
import {Catalog} from './modules/Catalog/Catalog';
import {FavoriteService} from './services/StorageService';
import {Pagination} from './modules/Pagination/Pagination';
import {BreadCrumbs} from './modules/BreadCrumbs/BreadCrumbs';
import {ProductPage} from './modules/ProductPage/ProductPage';
import {productSlider} from './features/ProductSlider/productSlider';
import {Cart} from './modules/Cart/Cart';
import {Order} from './modules/Order/Order';

export const router = new Navigo('/', {linksSelector: 'a[href^="/"]'});

const init = async () => {
	const api = new ApiService();

	if (!api.accessKey) await api.getAccessKey();

	const {totalCount: basketCount} = await api.getCart();

	new Header().mount();
	new Header().changeCount(basketCount);
	new Main().mount();
	new Footer().mount();

	router
			.on('/',
					async () => {
						new Catalog().mount(new Main().element);
						const products = await api.getProducts();
						new ProductList().mount(new Main().element, products);
						router.updatePageLinks();
					},
					{
						leave(done) {
							new ProductList().unmount();
							new Catalog().unmount();
							done();
						},
						already(match) {
							match.route.handler(match);
						},
					},
			)
			.on('/category',
					async ({params: {slug, page = 1}}) => {
						(await new Catalog().mount(new Main().element)).setActiveLink(slug);

						new BreadCrumbs().mount(new Main().element, [{text: slug}]);

						const {data: products, pagination} = await api.getProducts({
							category: slug,
							page,
						});
						new ProductList().mount(new Main().element, products, slug);

						pagination.totalProducts > pagination.limit ? new Pagination()
								.mount(new ProductList().containerElement)
								.update(pagination) : '';
						router.updatePageLinks();
					},
					{
						leave(done) {
							new BreadCrumbs().unmount();
							new ProductList().unmount();
							new Pagination().unmount();
							new Catalog().unmount();

							done();
						},
						already(match) {
							match.route.handler(match);
						},
					},
			)
			.on('/favorite',
					async ({params}) => {
						console.log('params: ', params);
						new Catalog().mount(new Main().element);
						new BreadCrumbs().mount(new Main().element, [{text: 'Избранное'}]);

						const favorite = new FavoriteService().get().join(',');
						console.log('favorite: ', favorite);

						const {data: products, pagination} = await api.getProducts({
							list: favorite,
							page: params?.page || 1,
						});

						console.log('products: ', products);
						new ProductList()
								.mount(
										new Main().element,
										products,
										products.length ? 'Избранное' :
											'В избранном пока нет товаров',
								);
						pagination.totalProducts > pagination.limit ?
							new Pagination()
									.mount(new ProductList().containerElement)
									.update(pagination) : '';

						router.updatePageLinks();
					},
					{
						leave(done) {
							new ProductList().unmount();
							new Catalog().unmount();
							new BreadCrumbs().unmount();
							new Pagination().unmount();

							done();
						},
						already(match) {
							match.route.handler(match);
						},
					},
			)
			.on('/search',
					async ({params: {q}}) => {
						new Catalog().mount(new Main().element);
						new BreadCrumbs().mount(new Main().element, [{text: 'Поиск'}]);

						const {data: products, pagination} = await api.getProducts({q});

						new ProductList()
								.mount(
										new Main().element,
										products,
										products.length ? `По запросу "${q}" найдено` :
										`По запросу "${q}" ничего не найдено`,
								);

						pagination?.totalProducts > pagination?.limit ?
							new Pagination()
									.mount(new ProductList().containerElement)
									.update(pagination) : '';

						router.updatePageLinks();
					},
					{
						leave(done) {
							new ProductList().unmount();
							new Catalog().unmount();
							new BreadCrumbs().unmount();
							new Pagination().unmount();

							done();
						},
						already(match) {
							match.route.handler(match);
						},
					},
			)
			.on('/product/:id',
					async (obj) => {
						console.log(obj);
						new Catalog().mount(new Main().element);
						const data = await api.getProductById(obj.data.id);

						new BreadCrumbs().mount(new Main().element, [
							{
								text: data.category,
								href: `/category?slug=${data.category}`,
							},
							{
								text: data.name,
							},
						]);
						new ProductPage().mount(new Main().element, data);
						productSlider();
					},
					{
						leave(done) {
							new Catalog().unmount();
							new BreadCrumbs().unmount();
							new ProductPage().unmount();
							done();
						},
						already(match) {
							match.route.handler(match);
						},
					},
			)
			.on('/cart',
					async () => {
						new BreadCrumbs().mount(new Main().element, [{text: 'Корзина'}]);
						const cartItems = await api.getCart();

						new Cart()
								.mount(
										new Main().element,
										cartItems,
										cartItems.products.length ? 'Корзина' : 'Корзина пуста');
					},
					{
						leave(done) {
							new Cart().unmount();
							new BreadCrumbs().unmount();
							done();
						},
						already(match) {
							match.route.handler(match);
						},
					},
			)
			.on('/order/:id',
					async ({data: {id}}) => {
						const data = await api.getOrder(id);
						console.log('data: ', data);
						new Order().mount(new Main().element, data[0]);
						new Header().changeCount(basketCount);
					},
					{
						leave(done) {
							new Order().unmount();
							done();
						},
						already(match) {
							match.route.handler(match);
						},
					},
			)
			.notFound(() => {
				new Main().element.innerHTML = `
						<h2 class="error404-title">Страница не найдена</h2>
						<p class="error404-text">Через 5 секунд вы будете перенаправлены 
								<a class="error404-link" href="/">на главную страницу</a>
						</p>
				`;
				setTimeout(() => {
					router.navigate('/');
				}, 5000);
			},
			{
				leave(done) {
					new Main().element.innerHTML = '';
					done();
				},
			});

	router.resolve();
};

init();

