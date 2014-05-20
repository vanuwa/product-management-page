/**
 * Created by ivan on 5/20/14.
 */
(function (scope) {
	"use strict";
	var products = {},
		productsContainerElement = document.getElementById("products-container"),
		keyTitle = "#{title}",
		keyId = "#{id}",
		keyPrice = "#{price}",
		rowTemplate = "<tr><td>"+keyTitle+"</td><td>"+keyId+"</td><td>"+keyPrice+"</td><td><button>Edit</button><button>Delete</button></td></tr>";

	var utils = {
		hex4: function () {
			return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
		},
		generateId: function () {
			return [this.hex4(), this.hex4(), this.hex4()].join("-");
		},
		serialize: function (form) {
			return {};
		},
		subscribe: function (element, eventName, handler) {
			if (element.addEventListener) {
				element.addEventListener(eventName, handler);
			} else if (element.attachEvent) {
				element.attachEvent('on' + eventName, handler);
			}
		},
		unsubscribe: function (element, eventName, handler) {
			if (element.removeEventListener) {
				element.removeEventListener(eventName, handler);
			} else if (element.detachEvent) {
				element.detachEvent('on' + eventName, handler);
			}
		},
		extractElementFromEvent: function (event) {
			var element = null;
			if (typeof event.target !== 'undefined') {
				element = event.target;
			} else if (typeof event.srcElement !== 'undefined'){
				element = event.srcElement;
			}
			return element;
		},
		blockEvent: function (event) {
			if (!event) {
				event = window.event;
			}

			if (event.stopPropagation) {
				event.stopPropagation();
			} else {
				event.cancelBubble = true;
			}

			if (event.preventDefault) {
				event.preventDefault();
			} else {
				event.returnValue = false;
			}
		}
	};

	var actions = {
		createProduct: function (product) {
			product.id = utils.generateId();
			products[product.id] = product;
			return product;
		},
		updateProduct: function (productId, product) {
			products[productId] = product;
			return product;
		},
		removeProduct: function (productId) {
			delete products[productId];
			return true;
		}
	};

	var handlers = {
		createProduct: function (event) {
			var product = {
				title: document.getElementsByName("title")[0].value,
				price: parseInt(document.getElementsByName("price")[0].value)
			};
			actions.createProduct(product);
			updateView(productsContainerElement, products);
			utils.blockEvent(event);
		},
		editProduct: function (productId) {
			updateView(productsContainerElement, products);
		},
		removeProduct: function (productId) {
			updateView(productsContainerElement, products);
		}
	};

	function updateView(container, collection) {
		var html = "";
		for (var prop in collection) {
			if (collection.hasOwnProperty(prop)) {
				html += rowTemplate.replace(keyTitle, collection[prop].title)
						.replace(keyId,collection[prop].id)
						.replace(keyPrice, collection[prop].price);
			}
		}
		container.innerHTML = html;
	}


	/* LET ME START */

	window.onload = function() {
		utils.subscribe(document.getElementById("product"), "submit", handlers.createProduct);
	};

}(window));