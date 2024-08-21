const SEPERATOR = " · ";
const baseUrl =
  "https://6bs2pvpu3f.execute-api.us-west-2.amazonaws.com/prod/get";
export const getSignedUrl = async (filename) => {
  const rawResponse = await fetch(baseUrl, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ key: filename }),
  });
  // console.log(rawResponse);
  return rawResponse;
};

function convertToCSV(objArray) {
  console.log("objArray", objArray);

  var array = typeof objArray != "object" ? JSON.parse(objArray) : objArray;
  var str = "";

  for (var i = 0; i < array.length; i++) {
    var line = "";
    for (var index in array[i]) {
      if (line != "") line += ",";

      line += array[i][index];
    }

    str += line + "\r\n";
  }

  console.log("str", str);

  return str;
}

function pivot(arr) {
  var mp = new Map();

  function setValue(a, path, val) {
    if (Object(val) !== val) {
      // primitive value
      var pathStr = path.join(".");
      var i = (mp.has(pathStr) ? mp : mp.set(pathStr, mp.size)).get(pathStr);
      a[i] = val;
    } else {
      for (var key in val) {
        setValue(a, key == "0" ? path : path.concat(key), val[key]);
      }
    }
    return a;
  }

  var result = arr.map((obj) => setValue([], [], obj));
  return [[...mp.keys()], ...result];
}

function toCsv(arr) {
  return arr
    .map((row) =>
      row.map((val) => (isNaN(val) ? JSON.stringify(val) : +val)).join(",")
    )
    .join("\n");
}

export const saveToS3 = async (url, body) => {
  const data = [body];
  let csv = toCsv(pivot(data));

  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "text/csv");

  // const file = "<file contents here>";

  const str = JSON.stringify(body);
  const bytes = new TextEncoder().encode(str);
  const blob = new Blob([bytes], {
    type: "application/json;charset=utf-8",
  });

  const requestOptions = {
    method: "PUT",
    headers: myHeaders,
    body: csv,
  };

  // const str = JSON.stringify(body);
  // const bytes = new TextEncoder().encode(str);
  // const blob = new Blob([bytes], {
  //     type: "application/json;charset=utf-8",
  // });
  const rawResponse = await fetch(url, requestOptions);
  console.log(rawResponse);
};

export function truncString(str: string, maxLength: number): string {
  if (str.length <= maxLength) {
    return str;
  }
  return str.slice(0, maxLength - 3) + "...";
}
