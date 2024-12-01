import {Request, Response, Router} from "express"
import {User, IUser} from "./models/User"

type TUser = {
    name: string;
    todos: string[];
}

const router: Router = Router()


router.post('/add', async (req, res) => {
    const { name, todo } = req.body

    try {
        let user = await User.findOne({name})

        if(user){
            user.todos.push({todo})
        }else{
            user = new User({name, todos: [{todo}]})
        }
        await user.save()
        res.send(`Todo added successfully for user ${name}`)    
    }catch (err){
        console.error(err)
        res.send("Server error")
    }
})

router.get('/todos', async (req, res) => {
    try{
        const users = await User.find()
        res.status(200).json( users )
    }catch (err){
        console.error(err)
        res.send("Server error")
    }
})

router.get('/todos/:id', async (req, res) => {
    let userId: string = req.params.id
    try{
        const user = await User.findOne({name: userId})

        if(user){
            res.status(200).json(user.todos.map(todo => todo.todo))
        }else {
            console.log("Error fetching user")
            return
        }
    }catch (err){
        console.error(err)
        res.send("Server error")
    }
})

router.delete('/delete', async (req, res) => {
    const {name} = req.body
    
    if(name){
        try{
            const user = await User.findOneAndDelete({name})
    
            if(user){
                res.status(200).send("User deleted successfully")
            }else {
                console.log("Error fetching user")
                return
            }
        }catch (err){
            console.error(err)
            res.send("Server error")
        }
    }else{
        console.log("No name")
    }
})

router.put("/update", async (req, res) => {
    const { name, todo } = req.body;
    if(name && todo){
        try{
            const user = await User.findOne({name})

            if(user){
                const todoIndex = user.todos.findIndex((t) => t.todo === todo)
                if (todoIndex !== -1) {
                    user.todos.splice(todoIndex, 1)
                    await user.save()
                    res.status(200).send("Todo deleted successfully")
                }
            }else {
                console.log("Error fetching user")
                return
            }
        }catch (err){
            console.error(err)
            res.send("Server error")
        }
    }else{
        console.log("No name or todo")
    }
    
})


export default router