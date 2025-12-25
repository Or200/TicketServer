import { promises as fs } from "fs";

export async function readFileToJson(path) {
  try {
    const data = await fs.readFile(path, "utf-8");
    const dataToJson = await JSON.parse(data);
    return dataToJson;
  } catch (err) {
    return "cant read file. error: ", err;
  }
}

export async function iFUniq(fileList, uniq, key) {
  for (let i = 0; i < fileList.length; i++) {
    if (fileList[i][key] == uniq) {
      return false;
    }
  }
  return true;
}

export async function writeFileToJson(file, path) {
  try {
    await fs.writeFile(path, JSON.stringify(file), "utf-8");
    return "registered successfully";
  } catch (err) {
    return "cant write file. error: ", err;
  }
}

export async function ifExists(list, key, checked) {
  for (let i = 0; i < list.length; i++) {
    if (list[i][key] === checked) {
      return true;
    }
  }
  return false;
}

export async function validBody(validList, body) {
  if (validList.length === Object.keys(body).length) {
    for (let i = 0; i < validList.length; i++) {
      if (validList[i] !== Object.keys(body)[i]) {
        return false;
      }
      return true;
    }
  } else {
    return false;
  }
}

export async function getNumTicket(eventsList, event) {
  for (let i = 0; i < eventsList.length; i++) {
    if (eventsList[i].eventName === event) {
      return eventsList[i].ticketsForSale;
    }
  }
  return eventsList;
}
export async function eventSub(eventsList, eventBuy, quantity) {
  for (let i = 0; i < eventsList.length; i++) {
    if (eventsList[i].eventName === eventBuy) {
      console.log(eventsList[i].eventName);
      eventsList[i].ticketsForSale -= quantity;
    }
  }
  return eventsList;
}


export async function countNum(List, key, params) {
  let count = 0;
  for (let i = 0; i < List.length; i++) {
    if (List[i].key === params) {
      count += 1;
    }
  }
  return count;
}
