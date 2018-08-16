const countryList = document.getElementById('country-list');

countryList.addEventListener('change', () => {
    const url = `http://${window.location.host}${window.location.pathname}?country=${countryList.value}`;
    window.location.href = url;
});
