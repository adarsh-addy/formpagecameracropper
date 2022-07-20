const express=require('express');
const mnRouter=express.Router();
const mysql=require('mysql')

const db=mysql.createPool({
    host:"localhost",
    user:"root",
    password:"",
    database:"product_info"
})


mnRouter.post('/save',(req,res)=>{
    const id=req.body.id;
    const product_name=req.body.product_name;
    const point_per_bag=req.body.point_per_bag;
    const product_priority=req.body.product_priority;
    const min_order_oty=req.body.min_order_oty;
    const img=req.body.img;

    db.getConnection(async(err,connection)=>{
        if(err)throw (err);

        const sqlSearch="SELECT * FROM product_db WHERE id=?"
        const search_query=mysql.format(sqlSearch,[id])

        const sqlInsert="INSERT INTO product_db(id,productname,pointperbag,productpriority,minorderoty,img) VALUES(?,?,?,?,?,?)"
        const insert_query=mysql.format(sqlInsert,[id,product_name,point_per_bag,product_priority,min_order_oty,img]);

        await connection.query(search_query,async(err,result)=>{
            if(err)throw(err);
            console.log("--->searching for result");
            console.log(result.length);
            if(result.length!=0){
                connection.release();
                console.log("Record already exists");
                res.json({
                    message:"Record already exists"
                })
            }else{
                await connection.query(insert_query,(err,result)=>{
                    if(err)throw (err)
                    console.log("Record inserted");
                    res.json({
                        message:"Record inserted",
                        result:result
                    })
                    connection.release()
                })
            }
        })
    })
})


//get api
mnRouter.get("/show",(req,res)=>{
    db.getConnection((err,connection)=>{
        if(err){
            console.log(err);
        }else{
            const insert_qu="SELECT * FROM product_db"
            connection.query(insert_qu,(err,result)=>{
                if(err) throw err
                console.log("result",result);
                res.json({
                    message:"Query Executed",
                    records:result

                })
                connection.release()
            })
        }

    })
})




//delete api
// mnRouter.delete("/del",(req,res)=>{
//     let id=req.body.id
   
//     db.getConnection((err,connection)=>{
//         if(err){
//             console.log(err);
//         }else{
//             const insert_qu=`DELETE FROM product_db WHERE Std_id ='${id}'`
//             // const insert=mysql.format(insert_qu,[id,name,age,email])
//             connection.query(insert_qu,(err,result)=>{
//                 if(err) throw err
//                 console.log("result",result);
//                 res.json({
//                     message:"Query Executed"

//                 })
//                 connection.release()
//             })
            // console.log(insert_qu);
//         }

//     })
// })



module.exports=mnRouter;