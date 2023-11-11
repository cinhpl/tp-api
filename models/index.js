const sequelize = require('./_database');

// Importation des models
const Product = require('./Product');
const User = require('./User');
const ProductOrder = require('./ProductOrder');
const Order = require('./Order');
const Tags = require('./Tags');

// Déclaration des relations
Order.belongsToMany (Product, { through: ProductOrder });
Product.belongsToMany (Order, { through: ProductOrder });

Product.belongsToMany(Tags, { through: 'ProductsTags', as: 'tags' });
User.belongsTo (Order);
Product.belongsTo(Tags);

// Synchronisation de la base
//sequelize.sync({alter: true});

module.exports = {
    Product: Product,
    User: User,
    ProductOrder: ProductOrder,
    Order: Order,
    Tags: Tags,
}
