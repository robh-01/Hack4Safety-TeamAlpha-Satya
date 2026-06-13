import { app, config } from "./app.js";

app.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`);
});
