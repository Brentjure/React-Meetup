import Head from "next/head";
import { MongoClient, ObjectId } from "mongodb";
import { Fragment } from "react";

import MeetupDetail from "../../components/meetups/MeetupDetail";

const MeetupDetails = (props) => {
  return (
    <Fragment>
      <Head>
        <title>{props.meetupData.title}</title>
        <meta name="description" content={props.meetupData.description} />
      </Head>
      <MeetupDetail
        image={props.meetupData.image}
        title={props.meetupData.title}
        address={props.meetupData.address}
        description={props.meetupData.description}
      />
    </Fragment>
  );
};

export const getStaticPaths = async () => {
  const DATABASE = `mongodb+srv://brent:<password>@cluster0.f9fstle.mongodb.net/meetups?retryWrites=true&w=majority`;
  const DATABASE_PASSWORD = "iy8UKoMAvc4jjcWk";
  const DB = DATABASE.replace("<password>", DATABASE_PASSWORD);

  const client = await MongoClient.connect(DB);
  const db = client.db();
  const meetupCollection = db.collection("meetups");

  const meetups = await meetupCollection.find({}, { _id: 1 }).toArray();

  client.close();

  return {
    fallback: "blocking",
    paths: meetups.map((meetup) => ({
      params: { meetupId: meetup._id.toString() },
    })),
  };
};

export const getStaticProps = async (context) => {
  const meetupId = context.params.meetupId;

  const DATABASE = `mongodb+srv://brent:<password>@cluster0.f9fstle.mongodb.net/meetups?retryWrites=true&w=majority`;
  const DATABASE_PASSWORD = "iy8UKoMAvc4jjcWk";
  const DB = DATABASE.replace("<password>", DATABASE_PASSWORD);

  const client = await MongoClient.connect(DB);
  const db = client.db();
  const meetupCollection = db.collection("meetups");

  const selectedMeetup = await meetupCollection.findOne({
    _id: ObjectId(meetupId),
  });

  client.close();
  return {
    props: {
      meetupData: {
        id: selectedMeetup._id.toString(),
        title: selectedMeetup.title,
        address: selectedMeetup.address,
        image: selectedMeetup.image,
        description: selectedMeetup.description,
      },
    },
  };
};

export default MeetupDetails;
