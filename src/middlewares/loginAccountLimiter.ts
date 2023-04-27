import { client } from "../services/redis.service";

interface ObjectAttempts {
  pass?: boolean;
  data?: any;
  wait?: number;
}
export const checkLoginAttempts = async (
  username: string
): Promise<ObjectAttempts> => {
  console.log(username);
  let pass = false;
  const key = `ll:${username}`;
  const now = Date.now();
  const data = await client.hgetall(key);
  console.log("data", data);
  if (!data || !data.count) return { pass: true };
  // lan2

  const count = parseInt(data.count);
  const time = parseInt(data.time);
  const diff = now - time;
  let wait = 0;
  if (count >= 5) {
    wait = 3600 - Math.floor(diff / 1000);
    // const minutes = Math.floor(wait / 60);
    if (wait <= 0) pass = true;
  } else if (count >= 4) {
    wait = 1800 - Math.floor(diff / 1000);
    // const minutes = Math.floor(wait / 60);
    if (wait <= 0) pass = true;
  } else if (count >= 3) {
    wait = 10 - Math.floor(diff / 1000);
    // const minutes = Math.floor(wait / 60);
    if (wait <= 0) pass = true;
  } else {
    return { pass: true, data, wait };
  }
  console.log("wait", wait);
  console.log("pass----checkLoginAttempts", pass);
  return { pass, data, wait };
};

export const setLoginAttempts = async (
  username: string
): Promise<ObjectAttempts> => {
  console.log("setLoginAttempts", username);
  let pass = false;
  const key = `ll:${username}`;
  const now = Date.now();
  const data = await client.hgetall(key);
  console.log("data--------------setLoginAttempts", data);
  if (!data || !data.count) {
    await client.hmset(key, "count", 1, "time", now);
    return { pass, data };
  }
  // lan2
  console.log("lan2---------setLoginAttempts");
  const count = parseInt(data.count);
  const time = parseInt(data.time);
  const diff = now - time;
  let wait = 0;
  if (count >= 5) {
    wait = 3600 - Math.floor(diff / 1000);
    // const minutes = Math.floor(wait / 60);
    if (wait <= 0) pass = true;
  } else if (count >= 4) {
    wait = 1800 - Math.floor(diff / 1000);
    // const minutes = Math.floor(wait / 60);
    if (wait <= 0) pass = true;
  } else if (count >= 3) {
    wait = 10 - Math.floor(diff / 1000);
    // const minutes = Math.floor(wait / 60);
    if (wait <= 0) pass = true;
  }
  await client.hmset(key, "count", count + 1, "time", now);
  return { pass, data, wait };
};
