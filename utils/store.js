const Product = require('../models/productModel');
const taxConfig = require('../config/tax')
const store = require('../utils/store');

exports.caculateItemsSalesTax=items => {
    const taxRate =taxConfig.stateTaxRate;
    const products =items.map(item =>{
        item.priceWithTax = 0;
        item.totalPrice = 0;
        item.totalTax = 0;
        item.purchasePrice = item.price;

        const price =item.purchasePrice;
        const quantity =item.quantity
        item.totalPrice =parseFloat(Number(price*quantity).toFixed(2))
        const taxAmount = price * (taxRate / 100) * 100;

        item.totalTax = parseFloat(Number((taxAmount * quantity).toFixed(2)));
        item.priceWithTax = parseFloat(
          Number((item.totalPrice + item.totalTax).toFixed(2))
        );
        console.log(price,quantity)
        return item;

    })
    return products;
}