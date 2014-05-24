/**
 * Created by username on 5/24/14.
 */
(function () {
	"use strict";

	var utils = {
		hex4: function () {
			return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
		},
		generateId: function () {
			return [this.hex4(), this.hex4(), this.hex4()].join("-");
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

	function Product(title, price, id) {
		var self = this;

		self.id = id || utils.generateId();
		self.title = title;
		self.price = price;
	}

	function ProductsViewModel() {
		var self = this;

		self.products = ko.observableArray([]);
		self.id = ko.observable("");
		self.title = ko.observable("");
		self.price = ko.observable("");

		self.addProduct = function () {};
		self.editProduct = function (product) {
			self.id(product.id);
			self.title(product.title);
			self.price(product.price);
		};
		self.removeProduct = function (product) {
			if (window.confirm("Are you sure?")) {
				self.products.remove(product);
			}
		};
		self.formSubmit = function (formElement) {
			if (self.id()) {

			} else {
				self.products.push(new Product(self.title(), self.price()));
			}

			self.id("");
			self.title("");
			self.price("");

			utils.blockEvent();
		};
	}

	ko.applyBindings(new ProductsViewModel());

}());