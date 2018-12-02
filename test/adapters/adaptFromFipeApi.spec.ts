import { ReferenciasResponseType } from "../../src/interfaces/FipeResponseTypes";
import { adaptReferencia, adaptValor, adaptCombustivel } from "../../src/adapters/adaptFromFipeApi";

describe("AdaptFromFipeApi", () => {
  describe("adaptReferencia()", () => {
    it("should return a Referencia with mes, ano and idFipe", () => {
      const referencia: ReferenciasResponseType = {
        Codigo: 236,
        Mes: "dezembro/2018 ",
      };

      const response = adaptReferencia(referencia);

      chai.expect(response.mes).to.eq(12);
      chai.expect(response.ano).to.eq(2018);
      chai.expect(response.idFipe).to.eq(236);
    });
  });

  describe("adaptValor()", () => {
    it("should return a number from a formatted string", () => {
      const valores = [
        "R$ 722,00",
        "R$ 1.321,00",
        "R$ 16.728,00",
        "R$ 132.321,00",
        "R$ 3.950.054,00",
        "R$ 99.950.054,00",
        "R$ 100.950.054,00",
      ];
      const expectedValores = [722, 1321, 16728, 132321, 3950054, 99950054, 100950054];

      const response = valores.map((valor) => adaptValor(valor));

      chai.expect(response).to.deep.eq(expectedValores);
    });
  });

  describe("adaptCombustivel()", () => {
    it("should parse combustivel of type gasolina", () => {
      const combustivel = "Gasolina";

      const response = adaptCombustivel(combustivel);

      chai.expect(response).to.eq(0);
    });

    it("should parse combustivel of type alcool", () => {
      const combustivel = "Álcool";

      const response = adaptCombustivel(combustivel);

      chai.expect(response).to.eq(1);
    });

    it("should parse combustivel of type diesel", () => {
      const combustivel = "Diesel";

      const response = adaptCombustivel(combustivel);

      chai.expect(response).to.eq(2);
    });

    it("should throw for invalid types", () => {
      const combustivel = "invalid";

      var adaptCombustivelFn = () => {
        adaptCombustivel(combustivel);
      };

      chai.expect(adaptCombustivelFn).to.throw(TypeError);
    });
  });
});
