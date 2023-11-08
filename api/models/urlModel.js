module.exports = (sequelize, DataTypes) => {
    const Url = sequelize.define(
        "url",
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                allowNull: false,
            },
            user_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            original_url: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            shortly_url: {
                type: DataTypes.STRING,
                allowNull: false,
            },
        },
        {
            timestamps: false,
        }
    )
    return Url
}
