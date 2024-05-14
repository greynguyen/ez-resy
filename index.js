import {
  checkForExistingBooking,
  getBookingConfig,
  makeBooking,
  fetchDataAndParseSlots,
} from "./utils/bookingLogic.js";

import { checkTokenExpiration } from "./utils/helpers.js";
import schedule from "node-schedule";

// Function to run booking process
async function runBookingProcess() {
  const now = getTime();
  let token = await checkTokenExpiration(process.env.AUTH_TOKEN);
  if (token) {
    let existingBooking = await checkForExistingBooking();
    if (!existingBooking) {
      let slots = await fetchDataAndParseSlots();

      if (slots) {
        let bookToken = await getBookingConfig(slots);
        let booking = await makeBooking(bookToken);
        if (booking.resy_token) {
          console.log(`[${now}] – You've got a reservation!`);
        } else {
          console.log(`[${now}] – Something went to 💩`);
        }
      }
    }
  }
}

function getTime() {
  const now = new Date().toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
  return now;
}

// // Schedule the booking process to run every day at 10:00 AM
// const job = schedule.scheduleJob("*/5 * * * *", function () {
//   const now = getTime();
//   console.log(`[${now}] – Attempting to run the booking process...`);
//   runBookingProcess();
// });

// Schedule the booking process to run every second
setInterval(() => {
  const now = getTime();
  console.log(`[${now}] – Attempting to run the booking process...`);
  runBookingProcess();
}, 1000);

const now = getTime();

console.log(
  `[${now}] – Booking job has been scheduled to run every 5 minutes.`
);
