var braintree = require("braintree");

//configuration
var gateway = braintree.connect({
    environment: braintree.Environment.Sandbox,
    merchantId: "2w74868dxwjqvvcd",
    publicKey: "6ncc6vm3m82ct9k2",
    privateKey: "e20acb356ec71e8d178f30b969c70251"
});

//generating client token
exports.getToken = (req,res) => { 
    gateway.clientToken.generate({
        
    }, function (err, response) {
            if (err) {
                res.status(500).send(err)
            } else {
                res.send(response)
			}
    });
}

//create a transaction
exports.processPayment = (req,res) => {
    let nonceFromTheClient = req.body.paymentMethodNonce

    let amountClient = req.body.amount

    gateway.transaction.sale({
        amount: amountClient,
        paymentMethodNonce: nonceFromTheClient,
        
        options: {
            submitForSettlement: true
        }
    }, function (err, result) {
            if (err) {
                res.status(500).send(err)
            } else {
                res.send(result)
            }
    });
}