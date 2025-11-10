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
    <APIProvider apiKey = {"AIzaSyA1o7Vio2dHZqCPqC4suZ1cJMPg79G2XFc"}>
        <div style={{height: "100vh"}}>
          <Map zoom ={9} center = {position}></Map>
        </div>
    </APIProvider>
  );
}
