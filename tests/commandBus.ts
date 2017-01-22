/// <reference path="../typings/globals/mocha/index.d.ts" />
/// <reference path="../typings/globals/node/index.d.ts" />

import {CommandBus, Command, Middleware} from '../src';
import * as assert from 'assert';

describe('CommandBus', () => {

    let sampleCommand = {
        id: 'completeOrder',
        orderId: 1
    }

    it('handles message even if no middleware has been registered ', async () => {
        const bus = new CommandBus();
        await bus.dispatch(sampleCommand);
    });

    it('executes registered middlewares in order', async () => {
        const arr = <Array<string>>[];
        const cb = (name: string) => () => arr.push(name);
        const bus = new CommandBus([
            new CallbackMiddleware(cb('Middleware #1')),
            new CallbackMiddleware(cb('Middleware #2')),
            new CallbackMiddleware(cb('Middleware #3')),
        ]);
        
        await bus.dispatch(sampleCommand);
        assert.equal(arr[0], 'Middleware #1');
        assert.equal(arr[1], 'Middleware #2');
        assert.equal(arr[2], 'Middleware #3');
    });

    it('returns the middleware execution result if provided ', async () => {
        const cb = () => 'fuu';
        const bus = new CommandBus([
            new ReturningCallbackMiddleware(cb)
        ]);
        
        const result = await bus.dispatch(sampleCommand);
        console.log('Result here', result);
        assert.equal(result, 'fuu');
    });

});

class CallbackMiddleware implements Middleware
{
    constructor(private _cb: () => void)
    {
    }

    execute(command: Command, next: any) : Promise<any>
    {
        this._cb();
        return next();
    }
}


class ReturningCallbackMiddleware implements Middleware
{
    constructor(private _cb: () => any)
    {
    }

    execute(command: Command, next: any) : Promise<any>
    {
        return this._cb();
    }
}
