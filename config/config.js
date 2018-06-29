module.exports = {
    port: 3000,
    bodyParserLimit: '100MB',
    mongodb: {
        url: 'mongodb://localhost/buy'
    },
    jwt: {
        secret: 'SecretKey',
        options: {
        	expiresIn: "1 day"
        }
    },
    passwordLength:8,
};