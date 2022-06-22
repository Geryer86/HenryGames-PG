const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    sequelize.define('videogame', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            //defaultValue: DataTypes.UUIDV4,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        description:{
            type: DataTypes.STRING,
            allowNull: false,
        },
        release_date: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        image: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        rating: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        price: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        on_sale: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
        },
        free_to_play: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
        },
        short_screenshots: {
            type: DataTypes.ARRAY(DataTypes.TEXT),
            allowNull: false,
            defaultValue: ["Has no screenShots"]
        },
        // esrb_ratings: {
        //     type: DataTypes.STRING,
        //     allowNull: false,
        //     defaultValue: "Everyone 10+"
        // },
        db_created: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    }, { timestamps: false })
}