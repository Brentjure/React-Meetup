import { MongoClient } from "mongodb";
// /api/new-meetup

const handler = async (req, res) => {
  if (req.method === "POST") {
    try {
      const data = req.body;
      console.log(data);

      const DATABASE = `mongodb+srv://brent:<password>@cluster0.f9fstle.mongodb.net/meetups?retryWrites=true&w=majority`;
      const DATABASE_PASSWORD = "iy8UKoMAvc4jjcWk";
      const DB = DATABASE.replace("<password>", DATABASE_PASSWORD);

      const client = await MongoClient.connect(DB);
      const db = client.db();
      const meetupCollection = db.collection("meetups");
      const results = await meetupCollection.insertOne(data);

      console.log(results);

      client.close();

      res.status(200).json({
        status: "success",
        data: {
          data,
        },
      });
    } catch (err) {
      console.log(err);
      res.status(500).json({
        status: "failed",
        error: {
          err,
        },
      });
    }
  }
};

export default handler;
