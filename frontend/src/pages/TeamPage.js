import React from "react";
import Heading from "../common/Heading";
import Teams from "../home/Team";

export default function Team() {
  return (
    <>
      <Heading heading="Team" title="Home" subtitle="Team" />
      <Teams />
    </>
  );
}