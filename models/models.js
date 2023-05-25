const { DataTypes, Sequelize } = require('sequelize');
const sequelize = new Sequelize(process.env.DATABASE, process.env.DATABASE_USER, process.env.DATABASE_PASSWORD, {
    host: process.env.DATABASE_HOST,
    dialect: 'mysql',
});

const Users = sequelize.define('Users', {
    idUser: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    UserName: {
        type: DataTypes.STRING(45),
        allowNull: false,
    },
    UserEmail: {
        type: DataTypes.STRING(150),
        allowNull: false,
        unique: true,
    },
    UserPassword: {
        type: DataTypes.STRING(150),
        allowNull: false,
    },
    UserProfileImage: {
        type: DataTypes.STRING(255),
        defaultValue: null,
    },
    UserRoles: {
        type: DataTypes.STRING(45),
        defaultValue: null,
    },
}, {
    timestamps: false, // Exclure les timestamps createdAt et updatedAt
});


const Commentaire = sequelize.define('Commentaire', {
    idPost: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    PostTexte: {
        type: DataTypes.STRING(230),
        allowNull: true,
    },
    PostImg: {
        type: DataTypes.STRING(255),
        allowNull: true,
    },
    PostDate: {
        type: DataTypes.DATE,
        allowNull: true,
    },
});

const Like = sequelize.define('Like', {
    idLike: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
});

const Dislike = sequelize.define('Dislike', {
    idDislike: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
});

const Message = sequelize.define('Message', {
    idMessage: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    MessageText: {
        type: DataTypes.STRING(230),
        allowNull: true,
    },
    MessageDate: {
        type: DataTypes.DATE,
        allowNull: true,
    },
});

Users.hasMany(Commentaire, { foreignKey: 'idUser', onDelete: 'CASCADE' });
Commentaire.belongsTo(Users, { foreignKey: 'idUser', onDelete: 'CASCADE' });

Users.hasMany(Like, { foreignKey: 'UserLike', onDelete: 'CASCADE' });
Like.belongsTo(Users, { foreignKey: 'UserLike', onDelete: 'CASCADE' });

Users.hasMany(Dislike, { foreignKey: 'UserDislike', onDelete: 'CASCADE' });
Dislike.belongsTo(Users, { foreignKey: 'UserDislike', onDelete: 'CASCADE' });

Commentaire.hasMany(Like, { foreignKey: 'PostLike', onDelete: 'CASCADE' });
Like.belongsTo(Commentaire, { foreignKey: 'PostLike', onDelete: 'CASCADE' });

Commentaire.hasMany(Dislike, { foreignKey: 'PostDislike', onDelete: 'CASCADE' });
Dislike.belongsTo(Commentaire, { foreignKey: 'PostDislike', onDelete: 'CASCADE' });

Users.hasMany(Message, { foreignKey: 'idUser', onDelete: 'CASCADE' });
Message.belongsTo(Users, { foreignKey: 'idUser', onDelete: 'CASCADE' });

Users.hasMany(Like, { foreignKey: 'UserLike', onDelete: 'CASCADE' });
Like.belongsTo(Users, { foreignKey: 'UserLike', onDelete: 'CASCADE' });

Users.hasMany(Dislike, { foreignKey: 'UserDislike', onDelete: 'CASCADE' });
Dislike.belongsTo(Users, { foreignKey: 'UserDislike', onDelete: 'CASCADE' });

Message.hasMany(Like, { foreignKey: 'MessageLike', onDelete: 'CASCADE' });
Like.belongsTo(Message, { foreignKey: 'MessageLike', onDelete: 'CASCADE' });

Message.hasMany(Dislike, { foreignKey: 'MessageDislike', onDelete: 'CASCADE' });
Dislike.belongsTo(Message, { foreignKey: 'MessageDislike', onDelete: 'CASCADE' });

module.exports = {
    Users,
    Commentaire,
    Like,
    Dislike,
    Message,
};
