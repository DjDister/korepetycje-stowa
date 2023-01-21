import React from "react";
import Layout from "./components/Layout/Layout";
import MessageUserProfile from "./components/MessageUserProfile/MessageUserProfile";

export default function MessagesPage() {
  return (
    <Layout>
      <MessageUserProfile
        iconUrl="https://cdn.midjourney.com/2cd09984-a602-4b3d-bc3b-e565bfba82b1/grid_0.png"
        name="Jack Daniels"
        message="Hey can you buy me some whiskey on the way home?"
      />
    </Layout>
  );
}
