module.exports = {

    key: 'B9293BE87E83426B8A66BA5C5E92D25F44498D86FA320FA46D01C7CA8CA7E095',
    appUrl: 'http://3.139.70.149:3000',
    apiUrl: 'http://3.139.70.149:1338',
   
    smsConfig: {
        host: 'http://api.msg91.com/api/v2/sendsms',
        senderId: 'LYANNA'
    },
    facebookAuth : {
        clientID : 'your-clientID-here',
        clientSecret : 'your-client-secret-here',
        callbackURL : 'http://3.139.70.149:1338/api/auth/facebook/callback',
        profileURL: 'https://graph.facebook.com/v2.5/me?fields=first_name,last_name,email'
    },
    googleAuth : {
        clientID : 'your-clientID-here',
        clientSecret : 'your-client-secret-here',
        callbackURL  : 'http://3.139.70.149:1338/auth/google/callback'
    },
    swagger: {
        swaggerDefinition: {
            info: {
                description: 'Laundry Anna API Documentation',
                title: 'Swagger',
                version: '1.0.0',
            },
            host: 'localhost:1338',
            basePath: '/',
            produces: [
                "application/json",
                "application/xml"
            ],
            schemes: ['http', 'https'],
            securityDefinitions: {
                JWT: {
                    type: 'apiKey',
                    in: 'header',
                    name: 'Authorization',
                    description: "",
                }
            }
        },
        basedir: __dirname, //app absolute path
        files: ['./src/routes/**.js', './src/routes/admin/**.js'] //Path to the API handle folder
    }

}
