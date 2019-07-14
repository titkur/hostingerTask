const apiLink = 'https://api.worldtradingdata.com/api/v1/history?symbol=AAPL&sort=newest&api_token=Wl6sOxa5qI9bKa8OENUtOvIh4nYxJPlKzLtNT8XEuk7tFXxqwcD7wB0DukLQ';

export const getTradingData = (successFn) => {
    return fetch(apiLink)
        .then(res => res.json())
        .then(successFn);
};