const MongoClient= require('mongodb').MongoClient;

MongoClient.connect('mongodb://localhost:27017/buy',(err,db)=>{
    if(err){
       return  console.log('unable to connect to mongoDB server');
    }
    console.log('connected to mongoDB server');

    db.collection('result').insertOne({
         email: "mekalarajeshreddy@gmail.com",
         password:"123456"
     },(err,result)=>{
       if(err)
       {
           return console.log("unable to insert todo",err)
       }
         console.log(JSON.stringify(result.ops,undefined,2));
     });



    // db.collection('Todos').insertOne({
    //    text:"completed lunch",
    //    completed: true,
    //    calories: 125
    // },(err,result)=>{
    //   if(err)
    //   {
    //       return console.log("unable to insert todo",err)
    //   }
    //     console.log(JSON.stringify(result.ops,undefined,2));
    // });
   
    db.close();
});