exports.sleep = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
}

exports.getToday = () => new Date().toJSON().slice(0, 10);

exports.dateDays = (dateStr, addDay) => {
  const myDate = new Date(dateStr);
  myDate.setDate(myDate.getDate() + addDay);
  return myDate.getFullYear()
    + '-' + ('0' + (myDate.getMonth() + 1)).slice(-2)
    + '-' + ('0' + myDate.getDate()).slice(-2)
};

exports.diacriticSensitiveRegex = (string = '') =>
  string.replace(/a/g, '[a,â,á,à,ä]')
    .replace(/e/g, '[e,é,è,ê,ë]')
    .replace(/i/g, '[i,í,ï]')
    .replace(/o/g, '[o,ó,ö,ò]')
    .replace(/u/g, '[u,ü,ú,ù]')
    .replace(/n/g, '[n,ñ]');

exports.byteCount = (s) => {
  return encodeURI(s).split(/%..|./).length - 1;
}

exports.unPad = (str) => {
  if (!str) return str;
  let i = 0;
  while (i < str.length && str[i] == '0')
    i++;
  return str.slice(i, str.length);
}

exports.doPad = (str, size) => {
  if (!str) return str;
  return str.padStart(size).replaceAll(' ', 0)
}

exports.addslashes = (str) => {
  return (str + '').replace(/[\\"']/g, '\\$&').replace(/\u0000/g, '\\0');
}

exports.randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

exports.displayDate = (dateStr, withHours = false, dateObj = null) => {
  if (!dateStr && !dateObj)
    return '';
  const monthNamesFull = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];
  const myDate = !dateObj ? new Date(dateStr) : dateObj;

  const fullDate = monthNames[myDate.getMonth()] + ' '
    + ('0' + myDate.getDate()).slice(-2) + ', ' +
    + myDate.getFullYear();

  /*const fullDate = ('0' + (myDate.getMonth() + 1)).slice(-2) + '/'
    + ('0' + myDate.getDate()).slice(-2) + '/' + 
    + myDate.getFullYear();*/
  const fullHours = ('0' + myDate.getHours()).slice(-2)
    + ':' + ('0' + myDate.getMinutes()).slice(-2)
    + ':' + ('0' + myDate.getSeconds()).slice(-2);
  return fullDate + (withHours ? ' ' + fullHours : '');
}

exports.getObjInArray = (arr, field, value) => {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i][field] === value)
      return arr[i];
  }
}
exports.getIndexInArray = (arr, value) => {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === value)
      return i;
  }
  return -1;
}

// Get params value from url
exports.getQueryVariable = (url, variable) => {
  var vars = url.split('?')[1].split('&');
  for (var i = 0; i < vars.length; i++) {
    var pair = vars[i].split("=");
    if (pair[0] == variable) {
      return pair[1];
    }
  }
  return null;
}

exports.howManyDayBetweenTwoDate = (d1, d2 = null) => {
  const date1 = new Date(parseInt(d1 + ''));
  const date2 = d2 ? new Date(parseInt(d2 + '')) : new Date();
  const diff = date1 - date2;
  return Math.abs(diff) / (24 * 60 * 60 * 1000);
}