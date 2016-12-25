
export interface Command 
{
}

export class CommandBus
{
    constructor(private _middlewares: Array<Middleware> = [])
    {
    }

    async handle(command: Command) : Promise<void>
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
    execute(command: Command, next: any) : Promise<void>;
}

export type CommandHandler = (command: Command) => void

export type HandlerMap = { [commandId: string] : CommandHandler }

export class CommandHandlerRegistry
{
    constructor(private _handlers: HandlerMap = {})
    {
    }

    register(commandId: string, handler: CommandHandler) : void
    {
        if (this.hasHandlerFor(commandId)) {
            throw new Error(`Command with id '${commandId}' is already registered.`);
        }
        
        this._handlers[commandId] = handler;
    }

    hasHandlerFor(commandId: string) : boolean
    {
        return this._handlers.hasOwnProperty(commandId);
    }
}