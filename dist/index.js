/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
// Invoke 'strict' JavaScript mode


var util = __webpack_require__(/*! util */ "util"),
  axios = __webpack_require__(/*! axios */ "axios"),
  EventEmitter = (__webpack_require__(/*! events */ "events").EventEmitter),
  Product = __webpack_require__(/*! ./product */ "./src/product.js"),
  Webhook = __webpack_require__(/*! ./webhook */ "./src/webhook.js"),
  Order = __webpack_require__(/*! ./order */ "./src/order.js");
function Printify(option) {
  EventEmitter.call(this);
  this.opts = Object.assign({
    version: 'v1',
    access_token: '',
    shop_id: ''
  }, option || {});
  this.baseURL = ['https://api.printify.com', this.opts.version].join('/');
  this.axios = axios.create({
    baseURL: this.baseURL,
    headers: {
      'Authorization': 'Bearer ' + this.opts.access_token
    }
  });
  this.axios.interceptors.response.use(function (response) {
    // Do something with response data
    //console.log(response);
    return response && response.data ? response.data : null;
  }, function (error) {
    // Do something with response error       
    console.log(util.inspect(error));
    return Promise.reject(error && error.response ? error.response.data : error);
  });
  this.Product = new Product(this.axios, this.opts.shop_id);
  this.Order = new Order(this.axios, this.opts.shop_id);
  this.Webhook = new Webhook(this.axios, this.opts.shop_id);
}
Printify.prototype = {
  shops: function shops() {
    return this.axios.get('shops.json');
  },
  // Retrieve a list of all available blueprints
  catalogues: function catalogues() {
    return this.axios.get('catalog/blueprints.json');
  },
  // Retrieve a specific blueprint
  catalog: function catalog(id) {
    return this.axios.get("catalog/blueprints/".concat(id, ".json"));
  },
  // Retrieve a list of all print providers that fulfill orders for a specific blueprint
  // if id is undefined Retrieve a list of all available print-providers
  providers: function providers(id) {
    return id ? this.axios.get("catalog/blueprints/".concat(id, "/print_providers.json")) : this.axios.get('catalog/print_providers.json');
  },
  // Retrieve a specific print-provider and a list of associated blueprint offerings
  provider: function provider(id) {
    return this.axios.get("catalog/print_providers/".concat(id, ".json"));
  },
  // Retrieve a list of all variants of a blueprint from a specific print provider
  variants: function variants(cid, pid) {
    return this.axios.get("catalog/blueprints/".concat(cid, "/print_providers/").concat(pid, "/variants.json"));
  },
  // Retrieve the shipping information for all variants of a blueprint from a specific print provider
  shipping: function shipping(cid, pid) {
    return this.axios.get("catalog/blueprints/".concat(cid, "/print_providers/").concat(pid, "/shipping.json"));
  },
  // Upload artwork to a Printify account's media library
  upload: function upload(data) {
    return this.axios.post('uploads/images.json', data);
  }
};
util.inherits(Printify, EventEmitter);
module.exports = Printify;

/***/ }),

/***/ "./src/order.js":
/*!**********************!*\
  !*** ./src/order.js ***!
  \**********************/
/***/ ((module) => {

var Order = function Order(axios, shop_id) {
  this.axios = axios;
  this.shop_id = shop_id;
};
Order.prototype = {
  id: function id(_id) {
    return _id ? _id : this.shop_id;
  },
  // Retrieve a list of orders
  fetch: function fetch(shop_id) {
    shop_id = this.id(shop_id);
    return this.axios.get("shops/".concat(shop_id, "/orders.json"));
  },
  lists: function lists(shop_id) {
    return this.fetch(shop_id);
  },
  // Get order details by id
  info: function info(id, shop_id) {
    shop_id = this.id(shop_id);
    return this.axios.get("shops/".concat(shop_id, "/orders/").concat(id, ".json"));
  },
  // Submit an order
  create: function create(data, shop_id) {
    shop_id = this.id(shop_id);
    return this.axios.post("shops/".concat(shop_id, "/orders.json"), data);
  },
  // Send an existing order to production
  send_to_production: function send_to_production(id, shop_id) {
    shop_id = this.id(shop_id);
    return this.axios.post("shops/".concat(shop_id, "/orders/").concat(id, "/send_to_production.json"));
  },
  publish: function publish(id, shop_id) {
    return this.send_to_production(id, shop_id);
  },
  // Calculate the shipping cost of an order
  shipping_cost: function shipping_cost(order, shop_id) {
    shop_id = this.id(shop_id);
    return this.axios.post("shops/".concat(shop_id, "/orders/shipping.json"), order);
  }
};
module.exports = Order;

/***/ }),

/***/ "./src/product.js":
/*!************************!*\
  !*** ./src/product.js ***!
  \************************/
/***/ ((module) => {

var Product = function Product(axios, shop_id) {
  this.axios = axios;
  this.shop_id = shop_id;
};
Product.prototype = {
  id: function id(_id) {
    return _id ? _id : this.shop_id;
  },
  // Retrieve a list of all products
  fetch: function fetch(payload, shop_id) {
    shop_id = this.id(shop_id);
    return this.axios.get("shops/".concat(shop_id, "/products.json"), payload);
  },
  lists: function lists(payload, shop_id) {
    return this.fetch(payload, shop_id);
  },
  // Retrieve a product
  info: function info(id, shop_id) {
    shop_id = this.id(shop_id);
    return this.axios.get("shops/".concat(shop_id, "/products/").concat(id, ".json"));
  },
  // Create a new product
  create: function create(data, shop_id) {
    shop_id = this.id(shop_id);
    return this.axios.post("shops/".concat(shop_id, "/products.json"), data);
  },
  // Update a product
  update: function update(data, shop_id) {
    shop_id = this.id(shop_id);
    var id = data.id;
    return this.axios.put("shops/".concat(shop_id, "/products/").concat(id, ".json"));
  },
  // Delete a product
  "delete": function _delete(id, shop_id) {
    shop_id = this.id(shop_id);
    return this.axios["delete"]("shops/".concat(shop_id, "/products/").concat(id, ".json"), data);
  },
  // Publish a product
  publish: function publish(id, notify, shop_id) {
    shop_id = this.id(shop_id);
    switch (notify) {
      case "success":
        return this.axios.post("shops/".concat(shop_id, "/products/").concat(id, "/publishing_succeeded.json"));
        break;
      case "error":
        return this.axios.post("shops/".concat(shop_id, "/products/").concat(id, "/publishing_failed.json"));
        break;
      default:
        return this.axios.post("shops/".concat(shop_id, "/products/").concat(id, "/publish.json"));
        break;
    }
  }
};
module.exports = Product;

/***/ }),

/***/ "./src/webhook.js":
/*!************************!*\
  !*** ./src/webhook.js ***!
  \************************/
/***/ ((module) => {

var Webhook = function Webhook(axios, shop_id) {
  this.axios = axios;
  this.shop_id = shop_id;
};
Webhook.prototype = {
  id: function id(_id) {
    return _id ? _id : this.shop_id;
  },
  // Retrieve a list of webhooks
  fetch: function fetch(shop_id) {
    shop_id = this.id(shop_id);
    return this.axios.get("shops/".concat(shop_id, "/webhooks.json"));
  },
  lists: function lists(shop_id) {
    return this.fetch(shop_id);
  },
  // Retrieve a webhook
  info: function info(id, shop_id) {
    shop_id = this.id(shop_id);
    return this.axios.get("shops/".concat(shop_id, "/webhooks/").concat(id, ".json"));
  },
  // Create a new webhook
  create: function create(data, shop_id) {
    shop_id = this.id(shop_id);
    return this.axios.post("shops/".concat(shop_id, "/webhooks.json"), data);
  },
  // Modify a webhook
  update: function update(data, shop_id) {
    shop_id = this.id(shop_id);
    var id = data.id;
    return this.axios.post("shops/".concat(shop_id, "/webhooks/").concat(id, ".json"), data);
  },
  // Delete a webhook
  "delete": function _delete(id, shop_id) {
    shop_id = this.id(shop_id);
    return this.axios["delete"]("shops/".concat(shop_id, "/webhooks/").concat(id, ".json"));
  }
};
module.exports = Webhook;

/***/ }),

/***/ "axios":
/*!************************!*\
  !*** external "axios" ***!
  \************************/
/***/ ((module) => {

"use strict";
module.exports = require("axios");

/***/ }),

/***/ "events":
/*!*************************!*\
  !*** external "events" ***!
  \*************************/
/***/ ((module) => {

"use strict";
module.exports = require("events");

/***/ }),

/***/ "util":
/*!***********************!*\
  !*** external "util" ***!
  \***********************/
/***/ ((module) => {

"use strict";
module.exports = require("util");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__("./src/index.js");
/******/ 	
/******/ })()
;