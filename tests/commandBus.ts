/// <reference path="../typings/globals/mocha/index.d.ts" />
/// <reference path="../typings/globals/node/index.d.ts" />

import {CommandBus, Command, Middleware} from '../src';
import * as assert from 'assert';

describe('MessageBus', () => {
    it('handles message even if no middleware has been registered ', async () => {
        const bus = new CommandBus();
        await bus.handle('message');
    });

    it('executes registered middlewares in order', async () => {
        const arr = <Array<string>>[];
        const cb = (name: string) => () => arr.push(name)
        const bus = new CommandBus([
            new CallbackMiddleware(cb('Middleware #1')),
            new CallbackMiddleware(cb('Middleware #2')),
            new CallbackMiddleware(cb('Middleware #3')),
        ]);
        
        await bus.handle('message');
        assert.equal(arr[0], 'Middleware #1');
        assert.equal(arr[1], 'Middleware #2');
        assert.equal(arr[2], 'Middleware #3');
    });

});

class TestCommand implements Command
{
    constructor(public name: string)
    {
    }
}

class CallbackMiddleware implements Middleware
{
    constructor(private _cb: () => void)
    {
    }

    execute(command: Command, next: any) : Promise<void>
    {
        this._cb();
        return next();
    }
}