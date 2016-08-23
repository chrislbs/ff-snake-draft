'use strict';

module.exports = function(app, apiRouter) {
    apiRouter.get('/example/?', function(req, res){
        res.status(200).json({'message': 'Example API route success!'});
    });

    apiRouter.post('/example/?', function(req, res){
        res.status(200).json({'message': 'Example API route success!', 'req_body': req.body});
    });
};
