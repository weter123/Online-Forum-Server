require("dotenv").config();

module.exports = [
    {
        type: "postgres",
        host: process.env.PG_HOST,
        port: 5432,
        username: process.env.PG_ACCOUNT,
        password: process.env.PG_PASSWORD,
        database: process.env.PG_DATABASE,
        synchronize: process.env.PG_SYNCHRONIZE,
        logging: process.env.PG_LOGGING,
        entities: process.env.PG_ENTITIES,
        cli: { 
            entitiesDIR: process.env.PG_ENTITIES_DIR
        },
    }
];