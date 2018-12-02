import { adaptTipoVeiculo, adaptAnoCombustivel } from "../../src/adapters//adaptToFipeApi";
import { TipoVeiculo } from "../../src/enums/TipoVeiculo";

describe("AdaptToFipeApi", () => {
  describe("adaptTipoVeiculo()", () => {
    it("should adapt veiculo of type carro", () => {
      const response = adaptTipoVeiculo(TipoVeiculo.carro);

      chai.expect(response).to.eq("carros");
    });

    it("should adapt veiculo of type moto", () => {
      const response = adaptTipoVeiculo(TipoVeiculo.moto);

      chai.expect(response).to.eq("motos");
    });
  });

  describe("adaptAnoCombustivel()", () => {
    it("should adapt ano combustivel to object", () => {
      const anoCombustivel = "1995-1";
      const expectResponse = { ano: 1995, combustivel: 1 };

      const response = adaptAnoCombustivel(anoCombustivel);

      chai.expect(response).to.deep.eq(expectResponse);
    });
  });
});
