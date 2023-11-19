const sequelize = require('./_database');

// Importation des models
const Product = require('./Product');
const User = require('./User');
const ProductOrder = require('./ProductOrder');
const Order = require('./Order');
const Tags = require('./Tags');
const UserOrder = require('./UserOrder');

// Déclaration des relations
Product.belongsToMany(Tags, { through: 'ProductsTags', as: 'tags' });
Tags.belongsToMany(Product, { through: 'ProductsTags'});

Order.belongsToMany(Product, { through: ProductOrder});
Product.belongsToMany (Order, { through: ProductOrder});

User.belongsToMany(Order, {through: UserOrder});
Order.belongsToMany(User, {through: UserOrder});

// Synchronisation de la base
//sequelize.sync({alter: true});

module.exports = {
    Product: Product,
    User: User,
    ProductOrder: ProductOrder,
    Order: Order,
    Tags: Tags,
    UserOrder: UserOrder
}
