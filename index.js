const express = require('express');
const Sequelize = require('sequelize');
const dotenv = require('dotenv');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcryptjs');

// Carregar variáveis de ambiente
dotenv.config();

const app = express();
app.use(express.json());

// Configurar CORS
const corsOptions = {
    origin: process.env.CORS_ORIGIN || '*', // Permitir todas as origens ou especificar a URL do front-end
    methods: 'GET,POST,PUT,DELETE',
    allowedHeaders: 'Content-Type,Authorization',
};
app.use(cors(corsOptions));

// Configuração de arquivos estáticos
app.use('/img/capas-livro', express.static(path.join(__dirname, 'img/capas-livro')));

// Criar diretório para uploads, se necessário
const uploadDir = path.join(__dirname, 'img/capas-livro');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Configuração de upload de arquivos
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'img/capas-livro');
    },
    filename: function (req, file, cb) {
        const ext = path.extname(file.originalname);
        cb(null, `${Date.now()}${ext}`);
    },
});
const upload = multer({ storage });

// Configuração do Sequelize
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    logging: false, // Para evitar logs SQL em produção
});

// Definição de modelos (Tabelas)
const Usuario = sequelize.define(
    'Usuario',
    {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        nome: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        email: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true,
        },
        senha: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        masp: {
            type: Sequelize.STRING,
            allowNull: true,
            unique: true,
        },
    },
    {
        timestamps: true,
        tableName: 'usuarios',
    }
);

const Livro = sequelize.define(
    'Livro',
    {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        titulo: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        autor: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        quantidade: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },
        editora: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        assunto: {
            type: Sequelize.STRING,
        },
        faixaEtaria: {
            type: Sequelize.ENUM('Livre', 'Infantil', 'Infantojuvenil', 'Adulto'),
            allowNull: false,
        },
        imagem: {
            type: Sequelize.STRING,
            allowNull: true,
        },
    },
    {
        timestamps: true,
        tableName: 'livros',
    }
);

const Emprestimo = sequelize.define(
    'Emprestimo',
    {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        data_vencimento: {
            type: Sequelize.DATE,
            allowNull: false,
        },
        renovacoes: {
            type: Sequelize.INTEGER,
            defaultValue: 0,
        },
        usuarioId: {
            type: Sequelize.INTEGER,
            references: {
                model: 'usuarios',
                key: 'id',
            },
        },
        livroId: {
            type: Sequelize.INTEGER,
            references: {
                model: 'livros',
                key: 'id',
            },
        },
    },
    {
        timestamps: true,
        tableName: 'emprestimos',
    }
);

// Relacionamentos
Usuario.hasMany(Emprestimo, { foreignKey: 'usuarioId' });
Livro.hasMany(Emprestimo, { foreignKey: 'livroId' });
Emprestimo.belongsTo(Usuario, { foreignKey: 'usuarioId' });
Emprestimo.belongsTo(Livro, { foreignKey: 'livroId' });

// Sincronizar banco de dados
sequelize
    .sync({ alter: true })
    .then(() => console.log('Banco de dados e tabelas sincronizados!'))
    .catch((error) => console.error('Erro ao sincronizar banco de dados:', error));

// Rotas (Apenas exemplos, você já as tem bem configuradas)

// Registrar usuário
app.post('/registrar', async (req, res) => {
    try {
        const { nome, email, senha } = req.body;
        const senhaHasheada = await bcrypt.hash(senha, 10);

        const usuario = await Usuario.create({ nome, email, senha: senhaHasheada });
        res.status(201).json(usuario);
    } catch (error) {
        res.status(400).json({ erro: error.message });
    }
});

// Outras rotas permanecem iguais...

// Iniciar servidor
const PORT = process.env.PORT || 3750;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
