const express= require("express");
const router = new express.Router();

const Student = require('../models/basic');

router.post("/create",async(req, res)=>{
    try {
        const user = new Student(req.body);
        const createUser = await user.save();
        res.status(201).send(createUser);
    } catch (error) {
        res.status(400).send(e);
    }
})

router.get("/retrive", async(req,res)=>{

    try{
        const studentsData= await Student.find();
        res.send(studentsData);
    }catch(e){
        res.status(500).send(e);

    }
})

module.exports= router;