
import Address from "../../../@shared/domain/value-object/address";
import ClientGateway from "../../gateway/client.gateway";
import { FindClientUseCaseInputDto, FindClientUseCaseOutputDto } from "./find-client.usecase.dto";

export default class FindClientUseCase {

  private _clientRepository: ClientGateway

  constructor(clientRepository: ClientGateway) {
    this._clientRepository = clientRepository
  }

  async execute(input: FindClientUseCaseInputDto): Promise<FindClientUseCaseOutputDto> {

    const client = await this._clientRepository.find(input.id)

    return {
      id: client.id.id,
      name: client.name,
      email: client.email,
      document: client.document,
      street: client.address.street,
      number: client.address.number,
      complement: client.address.complement,
      city: client.address.city,
      state: client.address.state,
      zipCode: client.address.zipCode,
      createdAt: client.createdAt,
      updatedAt: client.updatedAt,
    };
  }
}
