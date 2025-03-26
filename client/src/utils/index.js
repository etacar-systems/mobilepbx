// class Utils
// {
//   // round to 2 digits after point
//   static toFixedIfNecessary( value, dp = 2 ){
//     return +parseFloat(value).toFixed( dp );
//   }

//   // Calculate the sum for each type
//   static formatDuration = (seconds) => {
//     seconds = Math.max(seconds || 0, 0);
//     let hrs = Math.floor(seconds / 3600);
//     let mins = Math.floor((seconds % 3600) / 60);
//     let secs = Utils.toFixedIfNecessary(seconds % 60);
//     hrs  = isFinite(hrs) ? hrs : 0;
//     mins = isFinite(mins) ? mins : 0;
//     secs = isFinite(secs) ? secs : 0;
//     if (hrs > 0) {
//       return `${hrs}h ${mins}m ${secs}s`;
//     } else if (mins > 0) {
//       return `${mins}m ${secs}s`;
//     } else {
//       return `${secs}s`;
//     }
//   };

class Utils {
  // round to 2 digits after point
  static toFixedIfNecessary(value, dp = 2) {
    return +parseFloat(value).toFixed(dp);
  }

  // Calculate the sum for each type
  static formatDuration = (seconds) => {
    seconds = Math.max(seconds || 0, 0); // Ensure non-negative
    seconds = Math.round(seconds); // Round seconds to nearest integer
    let hrs = Math.floor(seconds / 3600);
    let mins = Math.floor((seconds % 3600) / 60);
    let secs = seconds % 60;

    hrs = isFinite(hrs) ? hrs : 0;
    mins = isFinite(mins) ? mins : 0;
    secs = isFinite(secs) ? secs : 0;

    if (hrs > 0) {
      return `${hrs}h ${mins}m ${secs}s`;
    } else if (mins > 0) {
      return `${mins}m ${secs}s`;
    } else {
      return `${secs}s`;
    }
  };

  // return 24h time format
  static timeDisplay = (date) => {
    const timeOptions = { hour: "2-digit", minute: "2-digit" }; // Options to exclude seconds
    return date.toLocaleTimeString(undefined, timeOptions);
  };

  // return DD.MM.YYYY date format
  static dateDisplay = (date) => {
    return date.toLocaleDateString("en-GB").replace(/\//g, ".");
  };

  //for ChartCardDashboard.jsx
  static generateArray(value) {
    // Initialize the array with 7 elements
    if (value === 0) {
      const array = new Array(7).fill(0);
      return array;
    } else {
      const array = new Array(7).fill(0);

      let remainingValue = value;

      for (let i = 0; i < 6; i++) {
        // Ensure remainingValue allows for valid values in the subsequent iterations
        const maxRandom = Math.min(remainingValue - (6 - i) * 5, value / 1.5);
        const minRandom = remainingValue <= 6 ? 0 : 1;

        if (maxRandom <= minRandom) {
          // If maxRandom is less than or equal to minRandom, distribute 5 to remaining indices
          array[i] = minRandom;
          remainingValue -= array[i];
        } else {
          // Generate a random value between minRandom and maxRandom
          const randomValue =
            Math.random() * (maxRandom - minRandom) + minRandom;
          array[i] = Math.floor(randomValue);
          remainingValue -= array[i];
        }
      }

      // Assign the remaining value to the last index, ensuring it is >= 5
      array[6] = remainingValue;

      if (array[6] < 5) {
        // Redistribute to ensure all values meet the criteria
        for (let i = 0; i < 6; i++) {
          if (array[i] > 5) {
            array[i]--;
            array[6]++;
            if (array[6] >= 5) break;
          }
        }
      }

      // Shuffle the array for randomness
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
      console.log("array", array);

      return array;
    }
  }
}

export default Utils;
