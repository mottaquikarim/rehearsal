import test from 'ava';
import {getHashDict} from '../src/utils';

test('getHashDict returns object', t => {
    const k = getHashDict();
    t.is(typeof k, 'object')
})


