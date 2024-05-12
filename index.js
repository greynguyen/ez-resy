import {
  checkForExistingBooking,
  getBookingConfig,
  makeBooking,
  fetchDataAndParseSlots,
} from "./utils/bookingLogic.js";

import { checkTokenExpiration } from "./utils/helpers.js";
import schedule from "node-schedule";
import express from "express";

// Function to run booking process
async function runBookingProcess() {
  let token = await checkTokenExpiration(process.env.AUTH_TOKEN);
  if (token) {
    let existingBooking = await checkForExistingBooking();
    if (!existingBooking) {
      let slots = await fetchDataAndParseSlots();

      if (slots) {
        let bookToken = await getBookingConfig(slots);
        let booking = await makeBooking(bookToken);
        if (booking.resy_token) {
          console.log(`You've got a reservation!`);
        } else {
          console.log(`Something went to 💩`);
        }
      }
    }
  }
}

// Schedule the booking process to run every day at 10:00 AM
const job = schedule.scheduleJob("*/5 * * * *", function () {
  console.log("Attempting to run the booking process...");
  runBookingProcess();
});

console.log("Booking job has been scheduled to run every 5 minutes.");

// Ports for Render
const app = express();
const port = process.env.PORT || 4000;

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
