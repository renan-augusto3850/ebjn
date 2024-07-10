export default class SmartSDK {
    placeholdify(text) {
        const lowerCase = text.toLowerCase();
        return lowerCase.replaceAll(" ", "-").normalize('NFD').replace(/[\u0300-\u036f]/g, "");;
    }
}