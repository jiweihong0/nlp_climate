import fetch from 'node-fetch';

async function getUser(props) {
  try {
    const response = await fetch(`https://www.google.com/search?q=${props}&rlz=1C1CHBF_zh-TWTW900TW900&oq=hi&aqs=chrome..69i57j46i131i199i433i465i512j0i433i512j46i131i433j0i433i512j69i60l3.641j0j7&sourceid=chrome&ie=UTF-8`);

    if (!response.ok) {
      throw new Error(`Error! status: ${response.status}`);
    }
    const result = response
    result.arrayBuffer
    return result;
  } catch (err) {
    console.log(err);
  }
}

console.log(await getUser("hello"));