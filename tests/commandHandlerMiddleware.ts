/// <reference path="../typings/globals/mocha/index.d.ts" />
/// <reference path="../typings/globals/node/index.d.ts" />

import {CommandHandlerRegistry, CommandHandlerMiddleware} from '../src';
import * as assert from 'assert';

describe('CommandHandlerMiddleware', () => {
    
    let sampleCommand = {
        id: 'c1',
        paylod: 'testing'
    };

    let registry: CommandHandlerRegistry;

    beforeEach(() => {
        registry = new CommandHandlerRegistry();
    });

    it('excutes command contained in registry', async () => {
        let executed = false;
        registry.register('c1', (c: any) => { executed = true; });
        
        const middleware = new CommandHandlerMiddleware(registry);
        middleware.execute(sampleCommand, () => {});
        assert.equal(true, executed);
    });

});