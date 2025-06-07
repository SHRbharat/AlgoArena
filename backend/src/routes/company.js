import { Router } from "express";
import {
  handleCreateCompany,
  handleGetAll,
  handleDeleteCompany,
  handleEditCompany,
} from "../controllers/company.js";

const companyRouter = Router();

companyRouter.route('/create').post(handleCreateCompany);
companyRouter.route('/:id').delete(handleDeleteCompany);
companyRouter.route('/:id').put(handleEditCompany);
companyRouter.route('/all').get(handleGetAll);

export default companyRouter;
