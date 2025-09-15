import express from 'express';

const app = express();
const PORT = 5001;

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

