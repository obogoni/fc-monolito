import Address from "../../../@shared/domain/value-object/address"
import AddClientUseCase from "./add-client.usecase"

const MockRepository = () => {
  return {

    add: jest.fn(),
    find: jest.fn()
  }
}

describe("Add Client use case unit test", () => {

  it("should add a client", async () => {

    const repository = MockRepository()
    const usecase = new AddClientUseCase(repository)

    const input = {
      name: "Lucian",
      email: "lucian@123.com",
      document: "1234-5678",
      street: "Rua 123",
      number: "99",
      complement: "Casa Verde",
      city: "Criciúma",
      state: "SC",
      zipCode: "88888-888",
    }

    const result = await usecase.execute(input)

    expect(repository.add).toHaveBeenCalled()
    expect(result.id).toBeDefined()
    expect(result.name).toEqual(input.name)
    expect(result.email).toEqual(input.email)
    expect(result.document).toEqual(input.document);
    expect(result.street).toEqual(input.street);
    expect(result.number).toEqual(input.number);
    expect(result.complement).toEqual(input.complement);
    expect(result.city).toEqual(input.city);
    expect(result.state).toEqual(input.state);
    expect(result.zipCode).toEqual(input.zipCode);
    expect(result.createdAt).not.toBeNull();
  })
})
