import userRoutes from "./user/user.routes.js";

export const bootstrap = (app) => {
  app.use("/api/users", userRoutes);
};
