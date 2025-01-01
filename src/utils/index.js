
class Utils
{
  // round to 2 digits after point
  static toFixedIfNecessary( value, dp = 2 ){
    return +parseFloat(value).toFixed( dp );
  }
  
  // Calculate the sum for each type
  static formatDuration = (seconds) => {
    seconds = Math.max(seconds || 0, 0);
    let hrs = Math.floor(seconds / 3600);
    let mins = Math.floor((seconds % 3600) / 60);
    let secs = Utils.toFixedIfNecessary(seconds % 60);
    hrs  = isFinite(hrs) ? hrs : 0;
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
    return date.toLocaleTimeString(undefined, timeOptions)
  };
}

export default Utils
