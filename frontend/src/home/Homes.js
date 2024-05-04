import React from "react";
import About from "./About";
import Book from "./Book";
import Carousel from "./Carousel";
import Services from "./Service";
import Rooms from "./Rooms";


export default function Home() {
  return (
    <>
      <Carousel />
      <Book />
      <Services />
      <Rooms />
 
    </>
  );
}