
export default class pageRange {
    #dataParaMilissegundos(data) {
        return new Date(data).getTime();
    }

    #calcularNovaMedia(milissegundosMediaAtual, milissegundosNovaData, pesoAtual = 1, pesoNovo = 1) {
        return ((milissegundosMediaAtual * pesoAtual) + (milissegundosNovaData * pesoNovo)) / (pesoAtual + pesoNovo);
    }

    #calcularPontos(diferencaEmDias) {
        if (diferencaEmDias >= 0) {
            return 0.5;
        } else if (Math.abs(diferencaEmDias) <= 5) {
            return 0.4;
        } else if (Math.abs(diferencaEmDias) <= 9) {
            return 0.3;
        } else {
            return 0.1;
        }
    }

    gerarPontuação(mediaLeituraData, novaDataTermino) {

        const milissegundosMediaLeitura = this.#dataParaMilissegundos(mediaLeituraData);
        const milissegundosNovaData = this.#dataParaMilissegundos(novaDataTermino);
        const novaMediaMilissegundos = this.#calcularNovaMedia(milissegundosMediaLeitura, milissegundosNovaData);
        const novaMediaData = new Date(novaMediaMilissegundos).toISOString().split('T')[0];


        const diferencaEmDias = (milissegundosNovaData - milissegundosMediaLeitura) / (1000 * 60 * 60 * 24);

        const pontos = this.#calcularPontos(diferencaEmDias);
        return pontos;
    }
}