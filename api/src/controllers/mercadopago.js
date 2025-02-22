const {Router} = require('express');
const router = Router();
const { Sale, Player, Videogame } = require('../db.js');
const randomstring = require("randomstring");

//SDK mercadopago
const mercadopago = require('mercadopago');

const { ACCESS_TOKEN_MP } = process.env;

const urlFlama = process.env.BACK_URL || 'http://localhost:3001';

//agrega credenciales
mercadopago.configure({
    access_token: ACCESS_TOKEN_MP
});

router.post('/', (req, res) => {
    
//cosas que deberia recibir por body
    
    const carrito = req.body
    const id_orden = carrito.map(e => e.id).join('-')
    
//cosas que requiere MP de tu respectiva compra
    const items_mp = carrito.map(e => ({
        id: e.id,
        title: e.name,
        unit_price: e.price,
        quantity: 1
    }));

//objeto de preferencia
let preference = {
    items: items_mp, //el carrito solo con los datos importantes
    external_reference: `${id_orden}`, //el id de cada orden
    payment_methods: {
        excluded_payment_types:[
            {
                id: 'atm' //excluir el metodo de pago
            }
        ],
        installments: 3 //cuotas
    },
    "back_urls": {
        "success": `${urlFlama}/mercadopago/save_data`, 
        "failure": `${urlFlama}/mercadopago/failure`,    
        "pending": `${urlFlama}/mercadopago/pending`
    },
};

mercadopago.preferences.create(preference)

.then(function(response){
    console.info('respondio')
    global.init_point = response.body.init_point
    global.id = response.body.id;
    console.log(response.body)
    // console.log(response.body)
    res.json({ id: global.id, init_point: global.init_point })//lo que devolvemos al front
})
.catch(function(error){
    console.log(error)
});
});

router.get('/save_data', async(req, res) => {  // usar un switch
    //console.log('Llegue hasta aca')
    //console.info('lo que me devuelve MP', req.session.passport.user)
    //console.log('hola')
    const id_user = req.session.passport.user
    const payment_id= req.query.payment_id
    const payment_status= req.query.status
    const external_reference = req.query.external_reference.split('-')
    const merchant_order_id= req.query.merchant_order_id
    
    console.log("EXTERNAL REFERENCE ",external_reference)
    const videogames = await Videogame.findAll({where:{"id":external_reference}})
    const user = await Player.findByPk(id_user)

    //Agrega a libreria los juegos
    

    let objeto = videogames.map(e => ({
        'id_sale':payment_id,
        'id_game':e.dataValues.id,
        'id_user':id_user,
        'price': e.dataValues.price
    }))
    
    const promise_pending_array = objeto.map(e => Sale.create(e))

    await Promise.all(promise_pending_array)
    
    let game_stock
    
    //Aumentar stock
    for(let i = 0; i<external_reference.length; i++){
        game_stock = await Videogame.findByPk(external_reference[i])
        game_stock.contador = game_stock.contador + 1
        await game_stock.save()
    }
    /////////////////
    
    let longitude = external_reference.length
    let secret_code = await randomstring.generate(7);
    let resultado = await user.addLibrary(videogames)


    for(let i = 0; i < resultado.length; i++){
        resultado[i].code = secret_code
        await resultado[i].save()
    }
    //Vaciar carrito despues de la compra
    if(payment_status === 'approved') {
        const promise_delete_array = videogames.map(e => user.removeCart(e))
        await Promise.all(promise_delete_array)
    }
    //Actualizar codigo
    //Enviar mail
    


    res.redirect(`${urlFlama}/authentication/email/gameActivation/${secret_code}/${id_user}/${longitude}`)
})

router.get("/failure", async (req, res) =>{
    res.send("payment failure")
})

router.get("/pending", async (req, res) =>{
    res.send("payment pending")
})

module.exports = router;