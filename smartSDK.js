export default class SmartSDK {
    placeholdify(text) {
        const lowerCase = text.toLowerCase();
        return lowerCase.replaceAll(" ", "-");
    }
}