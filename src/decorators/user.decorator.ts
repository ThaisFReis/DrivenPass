import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const User = createParamDecorator(
    (data: string, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest();
        const userId = request.body.userId; // Obtém o userId do corpo da solicitação

        return data ? userId?.[data] : userId;
    },
);
