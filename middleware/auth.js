const jwt = require('jsonwebtoken');
const { keys } = require('lodash');
const tokenSecret = "my-token-secret"

exports.verify = (req, res, next) => {
    if(req.header('PlendifyKey')==process.env.API_KEY)
    next()

    else{
        res.status(401).json({error:'unauthorized access'});
    }
    //console.log(req.header('PlendifyKey'));
    // console.log('ENV>>>>>>>>>>>>>>>>>',process.env.API_KEY);
    // next()
//     const token = req.headers.authorization;
//     console.log('token>>>>>>>>>>>>>>>>>>>>>>>>',token);
//     if (!token) res.status(403).json({error: "please provide a token"})
//     else {

//     try{
//             jwt.verify(token.split(" ")[1], tokenSecret, (err, value) => {
//                 console.log('error>>>>>>>>>',err);
//                 if (err) res.status(401).json({error: 'unauthorized access'})
//                 req.user = value.data
//                 next()
//             })
//         }
//     catch(err){
//         res.json(err);

//     }
// }
}

exports.generateToken=(req,res)=>{
    /*payload
    

    */
   const payload={
       sub:req.body.email,
       iss:'auth-service',
       
   }
   const options={
    expiresIn:'24h',
    
    
}
   //const tokenSecret="my-token-secret";
   const token=jwt.sign(payload,tokenSecret,options);
   res.json(token);
   
}