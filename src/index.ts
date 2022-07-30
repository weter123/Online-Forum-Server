import  express  from "express";
import session from "express-session";
import connectRedis from "connect-redis";
import Redis from "ioredis";
import { createConnection } from "typeorm";
import { login, logout, register } from "./repo/UserRepo";
import bodyParser from "body-parser";
import { createThread, getThreadByCategoryId } from "./repo/ThreadRepo";

require("dotenv").config();
declare module "express-session" {
    interface SessionData {
      userId: string | null;
      test: string;
    }
  }
const main = async() =>{
    
    const app = express();
    const router = express.Router();
    //must fix: Replace creatConnection if possible. utilze ormconfig
    await createConnection({
        type: "postgres",
        host: "localhost",
        port: 5432,
        username: "superforumsvc",
        password: "weter123",
        database: "SuperForum",
        synchronize: true,
        entities: ["src/repo/**/*.*"],
        logging: false
      });

    const redis = new Redis({
        port:Number(process.env.REDIS_PORT),
        host: process.env.REDIS_HOST,
        password:  process.env.REDIS_PASSWORD,
    });

    const RedisStore = connectRedis(session);
    const redisStore = new RedisStore({
        client:redis,
    });

    app.use(bodyParser.json());

    app.use(
        session({
            store: redisStore,
            name: process.env.COOKIE_NAME,
            sameSite: "Strict",
            secret: process.env.SESSION_SECRET,
            resave: false,
            saveUninitialized: false,
            cookie:{
                path: "/",
                httpOnly: true,
                secure:false,
                maxAge: 1000*60*60*24,
            },
        } as any)
    );

    app.use(router);
    router.get("/", (req, res, next) => {
        req.session!.test = "hello";
        res.send("hello");
      });

    router.post("/register", async(req,res,next)=> {
        try{
            console.log("params", req.body);
            const userResult = await register(
                req.body.email,
                req.body.userName,
                req.body.password
            );
            if(userResult && userResult.user){
                res.send(`new user created, userId: ${ userResult.user.id}`);
            }
            else if( userResult && userResult.messages){
                res.send(userResult.messages[0]);
            }else{
                next();
            }
        } catch (ex){
            res.send(ex.message);
        }
    });

    router.post("/login", async(req,res,next)=> {
        try {
            console.log("params", req.body);
            console.log("userid", req.session!.userId);
            const userResult = await login(
                req.body.userName,
                req.body.password
            );
            if(userResult && userResult.user){
                req.session!.userId =userResult.user?.id;
                res.send(`user logged in, userId: ${req.session!.userId}`)
            } else if(userResult && userResult.messages){
                res.send(userResult.messages[0]);
            } else{
                next();
            }
        } catch (ex){
            res.send(ex.message)
        }
    });

    router.post("/logout", async (req, res, next) => {
        try {
          console.log("params", req.body);
          console.log("userid", req.session!.userId);
          const msg = await logout(req.body.userName);
          if (msg) {
            req.session!.userId = null;
            res.send(msg);
          } else {
            next();
          }
        } catch (ex) {
          console.log(ex);
          res.send(ex.message);
        }
      });

    router.post("/createthread", async(req,res,next)=> {
        try{
            console.log("userId", req.session);
            console.log("body", req.body);
            const msg = await createThread(
                req.session!.userId!,
                req.body.categoryId,
                req.body.title,
                req.body.body  
            );

            res.send(msg);
        } catch (ex){
            console.log(ex);
            res.send(ex.message);
        }
    })

   
    app.listen({port:process.env.SERVER_PORT},()=>{
        console.log(`Server ready on port ${process.env.SERVER_PORT}`);
    });
    };
main();