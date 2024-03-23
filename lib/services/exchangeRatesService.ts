const exchangeRatesService = {
  getLatestRates: async () => {
    try {
      const URL = `https://openexchangerates.org/api/latest.json?app_id=${process.env.OPEN_EXCHANGE_RATE_APP_ID}&prettyprint=false&show_alternative=false`;
      const response = await fetch(URL, {
        method: "GET",
        headers: {
          accept: "application/json",
        },
      });

      const data = await response.json();

      return data;
    } catch (error) {
      console.error("Error fetching exchange rates", error);
      return null;
    }
  },
};

export default exchangeRatesService;
