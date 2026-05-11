import { DataTypes } from 'sequelize';
;

const UserModel = (sequelize) => {
    const User = sequelize.define('User', {
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        user_name: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        user_email: {
            type: DataTypes.STRING(100),
            allowNull: false,
            unique: true
        },
        user_password: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        refresh_token: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        refresh_token_expires_at: {
            type: DataTypes.DATE,
            allowNull: true
        }
    }, {
        sequelize,
        tableName: 'user',
        timestamps: false,
        indexes: [
            {
                name: 'PRIMARY',
                unique: true,
                using: 'BTREE',
                fields: [{ name: 'user_id' }]
            }
        ]
    })
    return User;
}

export default UserModel;