import {Router} from "express"
import authRouter from "./authRoute"
import cakesRouter from "./cakeRoute"
import imageRouter from "./imageRoute"

const indexRoutes=Router()


indexRoutes.use("/cakes",cakesRouter)
indexRoutes.use("/images",imageRouter)
indexRoutes.use("/auth",authRouter)

export default indexRoutes