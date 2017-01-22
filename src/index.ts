
export interface Command 
{
    id: string
}

export class CommandBus
{
    constructor(private _middlewares: Array<Middleware> = [])
    {
    }

    public async dispatch(command: Command) : Promise<any>
    {
        const chain = this._middlewares.slice();
        const next = async function() {
            const middleware = chain.shift();
            
            if (middleware) {
                return await middleware.execute(command, next);
            }
        };

        return await next();
    }
}

export interface Middleware
{
    execute(command: Command, next: any) : Promise<any>;
}

export class CommandHandlerMiddleware implements Middleware
{
    constructor(private _registry: CommandHandlerRegistry)
    {
    }

    public async execute(command: Command, next: any) : Promise<any>
    {
        const handler = this._registry.getHandlerFor(command.id);
        return await handler(command);
    }
}

export type CommandHandler = (command: Command) => void

export type HandlerMap = { [commandId: string] : CommandHandler }

export class CommandHandlerRegistry
{
    constructor(private _handlers: HandlerMap = {})
    {
    }

    public register(commandId: string, handler: CommandHandler) : void
    {
        if (this.hasHandlerFor(commandId)) {
            throw new Error(`Command with id '${commandId}' is already registered.`);
        }
        
        this._handlers[commandId] = handler;
    }

    public hasHandlerFor(commandId: string) : boolean
    {
        return this._handlers.hasOwnProperty(commandId);
    }

    public getHandlerFor(commandId: string) : CommandHandler
    {
        return this._handlers[commandId];
    } 
}