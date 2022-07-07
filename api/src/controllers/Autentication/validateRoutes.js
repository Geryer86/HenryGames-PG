const { Router } = require('express')
const { Player, LibraryPlayer } = require('../../db')
const router = Router()

//-----------------------------------------------------------------------
// Esta ruta responde cuando necesito activar una cuenta recién creada y es
// llamada directamente por los usuarios cuando les enviamos el correo de
// validación de email, en el cual va un link para llamarla.
//------------------------------------------------------------------------

router.get('/activation/:userId/:secretToken', async(req, res) => {
    const { userId, secretToken } = req.params

    try {
        let user = await Player.findByPk(userId)
        if(!user)return res.status(404).json({err:'El usuario no existe'})

        if(user && user.secret_token === secretToken){
            user.active = true
            await user.save()
        }

        return res.json({msg:'Usuario activado'})

    } catch (error) {
        res.status(400).send('Ocurrió un error durante la activación')
    }
})

router.get(`/activation/games/:secretCode/:id_user/:longitude`, async(req, res) => {
    const { secretCode, id_user, longitude } = req.params
    console.log('Hola')
    console.log(secretCode)
    try {
        

        let user = await Player.findByPk(id_user)

        if(!user){
            return res.send('No se encontro el usuario!')
        }

        let registros = await LibraryPlayer.findAll({
            where: {
                code: secretCode,
                id_user: id_user
            }
        })

        console.log(registros)


        return res.send(user)
    } catch (error) {
        res.status(404).send(error)
    }
})


module.exports = router