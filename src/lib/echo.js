"use client";

import Echo from "laravel-echo";
import Pusher from "pusher-js";

let echo;

if (typeof window !== "undefined") {
  window.Pusher = Pusher;

  echo = new Echo({
    broadcaster: "pusher",
    key: process.env.NEXT_PUBLIC_PUSHER_APP_KEY,
    cluster: process.env.NEXT_PUBLIC_PUSHER_APP_CLUSTER,
    forceTLS: true,
  });

  echo.connector.pusher.connection.bind("state_change", (states) => {
    console.log("Pusher state:", states.current);
  });

  echo.connector.pusher.connection.bind("error", (err) => {
    console.error("Pusher error:", err);
  });
}

export default echo;
