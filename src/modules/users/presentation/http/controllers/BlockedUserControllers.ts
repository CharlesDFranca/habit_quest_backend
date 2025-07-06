import { BlockUserUseCase } from "@/modules/users/app/use-cases/block-user/BlockUserUseCase";
import { UnblockUserUseCase } from "@/modules/users/app/use-cases/block-user/UnblockUserUseCase";
import { ResponseFormatter } from "@/shared/presentation/http/ResponseFormatter";
import { ValidateRequiredFields } from "@/shared/utils/ValidateRequiredFields";
import { Response, Request } from "express";
import { container } from "tsyringe";

export class BlockedUserControllers {
  private constructor() {}

  static async blockUser(req: Request, res: Response) {
    ValidateRequiredFields.use(req.body, ["blockerId", "blockedId"]);

    const { blockerId, blockedId } = req.body;

    const blockUserUseCase = container.resolve(BlockUserUseCase);

    const blockedUserId = await blockUserUseCase.execute({
      blockerId,
      blockedId,
    });

    const response = ResponseFormatter.success(blockedUserId, {
      blockerId,
      blockedId,
    });

    res.status(201).json(response);
  }

  static async unblockUser(req: Request, res: Response) {
    ValidateRequiredFields.use(req.body, ["blockerId", "blockedId"]);

    const { blockerId, blockedId } = req.body;

    const unblockUserUseCase = container.resolve(UnblockUserUseCase);

    await unblockUserUseCase.execute({
      blockerId,
      blockedId,
    });

    const response = ResponseFormatter.success({});

    res.status(200).json(response);
  }
}
