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
		rowTemplate = "<td>"+keyTitle+"</td><td>"+keyId+"</td><td>"+keyPrice+"</td><td><button class='product_edit-control'>Edit</button><button class='product_delete-control'>Delete</button></td>";

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
		getProduct: function (productId) {
			return products[productId];
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
		formSubmit: function (event) {
			var product = {
				id: getFormValue('id'),
				title: getFormValue('title'),
				price: parseInt(getFormValue('price'), 10)
			};

			if (product.id) {
				actions.updateProduct(product.id, product);
			} else {
				actions.createProduct(product);
			}

			updateView(productsContainerElement, products);
            clearForm();
			utils.blockEvent(event);
		},
		editProduct: function (productId, event) {
			fillForm(actions.getProduct(productId));
			utils.blockEvent(event);
		},
		removeProduct: function (productId, event) {
			if (window.confirm("Are you sure?")) {
				actions.removeProduct(productId);
				updateView(productsContainerElement, products);
			}
			utils.blockEvent(event);
		}
	};

	/* helpers */
	function getFormValue(name) {
		return document.getElementsByName(name)[0].value;
	}
	function setFormValue(name, value) {
		return document.getElementsByName(name)[0].value = value;
	}
	function injectRow(container, product) {
		var row = document.createElement('tr');
		row.innerHTML = rowTemplate.replace(keyTitle, product.title)
			.replace(keyId, product.id)
			.replace(keyPrice, product.price);

		container.appendChild(row);


		utils.subscribe(row.getElementsByClassName('product_edit-control')[0], "click", function (event) {
			handlers.editProduct(product.id, event);
		});
		utils.subscribe(row.getElementsByClassName('product_delete-control')[0], "click", function (event) {
			handlers.removeProduct(product.id, event);
		});
	}
	function updateView(container, collection) {
		container.innerHTML = "";
		for (var prop in collection) {
			if (collection.hasOwnProperty(prop)) {
				injectRow(container, collection[prop]);
			}
		}
	}
	function fillForm(product) {
		setFormValue('id',product.id);
		setFormValue('title',product.title);
		setFormValue('price', product.price);
	}
	function clearForm() {
		setFormValue('id',"");
		setFormValue('title', "");
		setFormValue('price', "");
	}
	/* end of helpers */


	/* LET ME START */

	window.onload = function() {
		utils.subscribe(document.getElementById("product"), "submit", handlers.formSubmit);
	};

}(window));