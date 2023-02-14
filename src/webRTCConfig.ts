const servers = {
  iceServers: [
    {
      urls: process.env.REACT_APP_RTC_URL_1 as string,
    },
    {
      urls: process.env.REACT_APP_RTC_URL_2 as string,
      username: process.env.REACT_APP_RTC_USERNAME as string,
      credential: process.env.REACT_APP_RTC_PASSWORD as string,
    },
    {
      urls: process.env.REACT_APP_RTC_URL_3 as string,
      username: process.env.REACT_APP_RTC_USERNAME as string,
      credential: process.env.REACT_APP_RTC_PASSWORD as string,
    },
    {
      urls: process.env.REACT_APP_RTC_URL_4 as string,
      username: process.env.REACT_APP_RTC_USERNAME as string,
      credential: process.env.REACT_APP_RTC_PASSWORD as string,
    },
  ],
};

export default servers;
