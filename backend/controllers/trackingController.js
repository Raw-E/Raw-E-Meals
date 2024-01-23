// controllers/trackingController.js
const trackState = async (req, res) => {
  try {
    const statesCollection = req.mongoClient.db("Beings").collection("States");
    const userID = "65aeb48d320533065633b52b";
    const state = req.body.state;
    const timestamp = new Date();

    const result = await statesCollection.insertOne({
      userID,
      state,
      timestamp,
    });

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const trackMeal = async (req, res) => {
  try {
    const mealsCollection = req.mongoClient.db("Beings").collection("Meals");
    const userID = "65aeb48d320533065633b52b";
    const meal = req.body.meal;
    const timestamp = req.body.time;

    const result = await mealsCollection.insertOne({
      userID,
      meal,
      timestamp,
    });

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { trackState, trackMeal };
