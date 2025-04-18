import UseCaseInterface from "../../@shared/usecase/use-case.interface";
import InvoiceFacadeInterface, { FindInvoiceFacadeInputDto, FindInvoiceFacadeOutputDto, GenerateInvoiceFacadeInputDto, GenerateInvoiceFacadeOutputDto } from "./invoice.facade.interface";

export interface UseCasesProps {
  generateUseCase: UseCaseInterface;
  findUseCase: UseCaseInterface;
}

export default class InvoiceFacade implements InvoiceFacadeInterface {

  private _generateUseCase: UseCaseInterface;
  private _findUseCase: UseCaseInterface;

  constructor(props: UseCasesProps) {
    this._generateUseCase = props.generateUseCase;
    this._findUseCase = props.findUseCase;
  }

  async generateInvoice(input: GenerateInvoiceFacadeInputDto): Promise<GenerateInvoiceFacadeOutputDto> {
    return await this._generateUseCase.execute(input);
  }

  async findInvoice(input: FindInvoiceFacadeInputDto): Promise<FindInvoiceFacadeOutputDto> {
    return await this._findUseCase.execute(input);
  }
}
