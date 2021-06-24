const express = require("express");
const cors = require("cors");
const stripe = require("stripe")("sk_test_51IzNckSBAHl9otqHL4PhJAxN9WsgWTMXq35Rc5MPRa30yy3WXW8G61L14eR8Alf6R2h88gbJKwuhRkEPoDLoCYhM00exZZPc6L");
const { v4: uuidv4 } = require('uuid');
const app = express();

app.use(cors());
app.use(express.json());
app.get("/", (req,res) => {
    res.send("Welcome into react shop website");
});
app.post("/checkout", async(req,res)=>{
    let error;
    let status;
    try{
        const{product, token} = req.body;
        const customer = await stripe.customers.create({
            email: token.email,
            source: token.id
        })
        const key = uuidv4();
        const charge = await stripe.charges.create({
            amount: product.price * 100,
            currency: "usd",
            customer: customer.id,
            receipt_email: token.email,
            description: 'all products description',
            shipping: {
                name: token.card.name,
                address: {
                    line1: token.card.address_line1,
                    line2: token.card.address_line2,
                    city: token.card.address_city,
                    country: token.card.address_country,
                    postal_code: token.card.address_zip
                }
            }
        },
            {idempotencyKey: key})
            status = "success";
    } catch(error){
        status = "error";
    }
    //console.log(status);
    res.json({status});
});
app.listen(8080, () => {
    console.log('your app is working on port number 8080');
});