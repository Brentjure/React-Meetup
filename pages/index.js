import { Fragment } from "react";
import Head from "next/head";
import { MongoClient } from "mongodb";
import MeetupList from "../components/meetups/MeetupList";

const HomePage = (props) => {
  return (
    <Fragment>
      <Head>
        <title>React Meetups</title>
        <meta
          name="description"
          content="Browse a hige list of highly active ReactMeetups "
        />
      </Head>
      <MeetupList meetups={props.meetups} />;
    </Fragment>
  );
};

export const getStaticProps = async () => {
  // fetch data from an API

  const DATABASE = `mongodb+srv://brent:<password>@cluster0.f9fstle.mongodb.net/meetups?retryWrites=true&w=majority`;
  const DATABASE_PASSWORD = "iy8UKoMAvc4jjcWk";
  const DB = DATABASE.replace("<password>", DATABASE_PASSWORD);

  const client = await MongoClient.connect(DB);
  const db = client.db();
  const meetupCollection = db.collection("meetups");

  const meetups = await meetupCollection.find().toArray();

  client.close();

  return {
    props: {
      meetups: meetups.map((meetup) => ({
        title: meetup.title,
        address: meetup.address,
        image: meetup.image,
        description: meetup.description,
        id: meetup._id.toString(),
      })),
    },
    revalidate: 1,
  };
};

export default HomePage;
