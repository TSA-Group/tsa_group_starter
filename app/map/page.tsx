"use client";

import { useState } from "react";
import{
  APIProvider,
  Map,
  AdvancedMarker,
  Pin,
  InfoWindow,
} from "@vis.gl/react-google-maps";

export default function Page() {
  const position = {lat: 53.54, lng: 10};
  return (
    <APIProvider apiKey = {"AIzaSyCvg7nk61C3TUhEQlPjbAqpyfJA9OVjC08"}>
        <div style={{height: "100vh"}}>
          <Map zoom ={9} center = {position}></Map>
        </div>
    </APIProvider>
  );
}
