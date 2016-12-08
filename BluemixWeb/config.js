/*jslint node: true */
/*jslint white:true */
/*jslint nomen:true */
/*jslint es5:true */


module.exports = {
    'secretKey': '12345-67890-09876-54321',
    //'mongoUrl' : 'mongodb://admin:GJUJWRTIMGMIYBDD@sl-eu-lon-2-portal.3.dblayer.com:15797,sl-eu-lon-2-portal.2.dblayer.com:15797/admin?ssl=true', //<- compose for mongodb
    'mongoUrl' : 'mongodb://30248d42-956a-4b6a-9a9c-af379ae6b858:d440e7fa-49ed-4ca1-8d5f-1cda2eb204a3@159.8.128.190:10054/db', // <- mongodb experimental not working
    'mongoUrl' : 'mongodb://admin:sandbox@ds127938.mlab.com:27938/dinner', // <- mlab
    //'mongoUrl' : 'mongodb://localhost:27017/dinnerDev',
    'uploadPath': './public/uploads/dishes'
};
