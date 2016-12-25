
export interface Command 
{
}

export class CommandBus
{
    constructor(private _middlewares: Array<Middleware> = [])
    {
    }

    async handle(command: Command): Promise<void>
    {
        const chain = this._middlewares.slice();
        const next = async function() {
            const middleware = chain.shift();

            if (middleware) {
                await middleware.execute(command, next);
            }

            return this;
        };

        await next();
    }
}

export interface Middleware
{
    execute(command: Command, next: any): Promise<void>;
}
