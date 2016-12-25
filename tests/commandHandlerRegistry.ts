/// <reference path="../typings/globals/mocha/index.d.ts" />
/// <reference path="../typings/globals/node/index.d.ts" />

import {CommandHandlerRegistry} from '../src';
import * as assert from 'assert';

describe('CommandHandlerRegistry', () => {
    
    it('doesnt have anything registered by default', async () => {
        const registry = new CommandHandlerRegistry();
        assert.equal(false, registry.hasHandlerFor('c1'));
    });

    it('it can register handler for given commands', async () => {
        const registry = new CommandHandlerRegistry();
        registry.register('c1', (c: any) => {});
        assert.ok(registry.hasHandlerFor('c1'));
    });

    it('it thows error when trying to register same command twice', async () => {
        const registry = new CommandHandlerRegistry();
        registry.register('c1', (c: any) => {});
        assert.throws(() => { 
            registry.register('c1', (c: any) => {});
        }, /Command with id 'c1' is already registered./);
    }); 

});